import { exerciseData } from "@/data/exerciseData";
import { workoutTemplates } from "@/data/workoutTemplates";
import type {
  Equipment,
  Exercise,
  ExercisePattern,
  PatternKey,
  Workout,
  WorkoutBlock,
  WorkoutIntensity,
  WorkoutSettings,
} from "@/types/workout";
import { createId } from "@/utils/createId";
import { randomItem } from "@/utils/randomItem";

const BLOCK_DURATION_SECONDS = 60;
const MAX_GENERATION_ATTEMPTS = 50;

// "bodyweight" och "floor" antas alltid finnas tillgängligt (07-generator-
// specifikation.md §7). "chair"/"pullup_bar" beror på användarens val i
// Inställningar (WorkoutSettings.hasChair/hasPullupBar). "Tunga" fria vikter
// ger tillgång till både lätta och tunga viktövningar (Tunga är en
// superset), eftersom en användare med tunga vikter också har lätta.
function getAllowedEquipment(settings: WorkoutSettings): Set<Equipment> {
  const allowed = new Set<Equipment>(["bodyweight", "floor"]);
  if (settings.hasChair) allowed.add("chair");
  if (settings.hasPullupBar) allowed.add("pullup_bar");
  if (settings.freeWeights === "light" || settings.freeWeights === "heavy") allowed.add("weights_light");
  if (settings.freeWeights === "heavy") allowed.add("weights_heavy");
  return allowed;
}

export class NoExercisesFoundError extends Error {
  constructor(patternKey: PatternKey) {
    super(`Inga övningar hittades för mönster: ${patternKey}`);
    this.name = "NoExercisesFoundError";
  }
}

export class InvalidWorkoutTemplateError extends Error {
  constructor(duration: string) {
    super(`Ingen passmall hittades för längd: ${duration}`);
    this.name = "InvalidWorkoutTemplateError";
  }
}

export class SequenceGenerationFailedError extends Error {
  constructor() {
    super("Kunde inte generera ett giltigt pass efter maximalt antal försök.");
    this.name = "SequenceGenerationFailedError";
  }
}

function isIntensityAllowed(
  exerciseIntensity: string,
  workoutIntensity: WorkoutIntensity,
  allowIntensityFallback = false
): boolean {
  if (workoutIntensity === "calm") {
    return exerciseIntensity === "calm" || (allowIntensityFallback && exerciseIntensity === "normal");
  }
  if (workoutIntensity === "normal") return exerciseIntensity === "calm" || exerciseIntensity === "normal";
  return exerciseIntensity === "hard" || (allowIntensityFallback && exerciseIntensity === "normal");
}

function isEquipmentAllowed(exercise: Exercise, allowedEquipment: Set<Equipment>): boolean {
  return exercise.equipment.every((item) => allowedEquipment.has(item));
}

// Smalare "kärnrörelse"-familjer som Standard/Längre-mallarna bygger passets
// stomme kring (se PatternKey i types/workout.ts). Matchas mot en uttrycklig
// lista av övnings-id:n istället för ExercisePattern, eftersom varje familj är
// en delmängd av en bredare kategori (t.ex. "squat" är bara knäböjsvarianter,
// inte alla knädominanta övningar - lunges ska inte kunna fylla den platsen).
const MOVEMENT_FAMILIES: Partial<Record<PatternKey, string[]>> = {
  squat: [
    "squat",
    "sumo_squat",
    "jump_squat",
    "squat_pulse",
    "squat_hold",
    "assisted_squat_chair",
    "goblet_squat",
    "heavy_goblet_squat",
    "goblet_squat_hold",
    "half_squat",
    "pistol_squat_negative",
    "deep_squat_hold",
  ],
  lunge_forward: ["forward_lunge"],
  lunge_lateral: ["lateral_lunge"],
  lunge_reverse: ["reverse_lunge", "weighted_reverse_lunge"],
  hip_hinge: ["single_leg_deadlift", "single_leg_hip_hinge"],
  pushup_rotation: ["spiderman_push_up", "t_push_up"],
  chinup: ["pull_up", "chin_up", "negative_pull_up", "archer_pull_up"],
  glute_bridge: [
    "glute_bridge",
    "single_leg_glute_bridge",
    "glute_bridge_march",
    "explosive_glute_bridge",
    "supine_bridge_hold",
  ],
  overhead_press: ["pike_push_up", "overhead_press_light", "curl_to_press"],
  horizontal_pull_row: ["inverted_row", "one_arm_row_light", "one_arm_row_heavy"],
  anti_rotation_core: ["dead_bug", "bird_dog", "weighted_dead_bug"],
  side_plank: ["side_plank", "side_plank_dip", "star_plank"],
};

// Bredare reservkategori per kärnrörelse-familj, använd av buildMainExercises
// när familjen inte har någon kandidat (t.ex. chinup kräver alltid
// pullup_bar - saknas den utrustningen faller platsen tillbaka till valfri
// pull-övning istället för att göra hela passet omöjligt att generera).
const FAMILY_FALLBACK: Partial<Record<PatternKey, PatternKey>> = {
  squat: "knee",
  lunge_forward: "knee",
  lunge_lateral: "knee",
  lunge_reverse: "knee",
  hip_hinge: "hip",
  pushup_rotation: "push",
  chinup: "pull",
  glute_bridge: "hip",
  overhead_press: "push",
  horizontal_pull_row: "pull",
  anti_rotation_core: "core",
  side_plank: "core",
};

function patternMatchesKey(pattern: ExercisePattern, key: PatternKey): boolean {
  switch (key) {
    case "push":
      return pattern === "horizontal_push" || pattern === "vertical_push";
    case "pull":
      return pattern === "horizontal_pull" || pattern === "vertical_pull";
    case "knee_or_hip":
      return pattern === "knee" || pattern === "hip";
    case "balance_or_mobility":
      return pattern === "balance" || pattern === "mobility";
    case "wildcard":
      return true;
    default:
      return pattern === key;
  }
}

function exerciseMatchesKey(exercise: Exercise, key: PatternKey, allowSecondary: boolean): boolean {
  const family = MOVEMENT_FAMILIES[key];
  if (family) return family.includes(exercise.id);
  if (patternMatchesKey(exercise.primaryPattern, key)) return true;
  if (!allowSecondary) return false;
  return exercise.secondaryPatterns.some((pattern) => patternMatchesKey(pattern, key));
}

// Sekvensregler enligt 03-exercise-library-specification.md §14 och
// 07-generator-specifikation.md §8. "Aldrig tre golvövningar i rad" stängs av
// helt när användaren saknar stol/chinsstång (equipmentRestricted): varje
// hård pull-övning utan utrustning måste utföras på golvet (inget att dra i
// annars), så regeln gör annars Tufft praktiskt taget omöjligt att generera
// för Standard/Längre utan utrustning. En mjukare gräns (t.ex. fyra i rad)
// testades men räckte inte för Längre (endast ~6 % lyckade försök) - se
// docs/loggbok.md.
//
// relaxSimilarityRules: undantag för "två ensidiga övningar i rad" och "tre
// benövningar i rad". På Tufft är hard-poolerna för core/höft/rörlighet så
// tunna att alla alternativ delar "ben" och/eller är ensidiga - reglerna gör
// annars vissa passmallar omöjliga att generera. Separation försöks alltid
// först (se generateWorkout); undantaget används bara om det krävs.
function violatesSequenceRules(
  candidate: Exercise,
  chosen: Exercise[],
  equipmentRestricted: boolean,
  relaxSimilarityRules: boolean
): boolean {
  const prev = chosen[chosen.length - 1];
  if (!prev) return false;

  if (prev.avoidAdjacent.includes(candidate.id) || candidate.avoidAdjacent.includes(prev.id)) return true;
  if (prev.jump && candidate.jump) return true;
  if (prev.explosive && candidate.explosive) return true;
  if (prev.movementType === "isometric" && candidate.movementType === "isometric") return true;
  if (!relaxSimilarityRules && prev.unilateral && candidate.unilateral) return true;
  if (prev.primaryPattern === candidate.primaryPattern) return true;
  if (prev.bodyPosition === "hanging" && candidate.bodyPosition === "hanging") return true;

  if (!equipmentRestricted) {
    const prev2Floor = chosen[chosen.length - 2];
    if (
      prev2Floor &&
      prev2Floor.bodyPosition === "floor" &&
      prev.bodyPosition === "floor" &&
      candidate.bodyPosition === "floor"
    ) {
      return true;
    }
  }

  if (!relaxSimilarityRules) {
    const prev2 = chosen[chosen.length - 2];
    if (prev2) {
      const legsInARow = [prev2, prev, candidate].every((exercise) =>
        exercise.muscleGroups.includes("legs")
      );
      if (legsInARow) return true;
    }
  }

  return false;
}

function findCandidates(
  key: PatternKey,
  intensity: WorkoutIntensity,
  allowedEquipment: Set<Equipment>,
  equipmentRestricted: boolean,
  usedIds: Set<string>,
  chosen: Exercise[],
  allowSecondary: boolean,
  allowRepeat: boolean,
  allowIntensityFallback: boolean,
  relaxSimilarityRules: boolean
): Exercise[] {
  return exerciseData.filter((exercise) => {
    if (!allowRepeat && usedIds.has(exercise.id)) return false;
    if (!isIntensityAllowed(exercise.intensity, intensity, allowIntensityFallback)) return false;
    if (!isEquipmentAllowed(exercise, allowedEquipment)) return false;
    if (violatesSequenceRules(exercise, chosen, equipmentRestricted, relaxSimilarityRules)) return false;
    return exerciseMatchesKey(exercise, key, allowSecondary);
  });
}

// Fallback-ordning per plats: unikt före upprepning, korrekt intensitet före
// nedgraderad, eftersom ett fåtal mönster/intensitet/utrustnings-kombinationer
// (t.ex. drag på Tufft utan stol/chinsstång) annars saknar övningar helt.
const CANDIDATE_TIERS: Array<{ allowSecondary: boolean; allowRepeat: boolean; allowIntensityFallback: boolean }> = [
  { allowSecondary: false, allowRepeat: false, allowIntensityFallback: false },
  { allowSecondary: true, allowRepeat: false, allowIntensityFallback: false },
  { allowSecondary: false, allowRepeat: true, allowIntensityFallback: false },
  { allowSecondary: true, allowRepeat: true, allowIntensityFallback: false },
  { allowSecondary: false, allowRepeat: false, allowIntensityFallback: true },
  { allowSecondary: true, allowRepeat: false, allowIntensityFallback: true },
  { allowSecondary: false, allowRepeat: true, allowIntensityFallback: true },
  { allowSecondary: true, allowRepeat: true, allowIntensityFallback: true },
];

function candidatesForKey(
  key: PatternKey,
  intensity: WorkoutIntensity,
  allowedEquipment: Set<Equipment>,
  equipmentRestricted: boolean,
  usedIds: Set<string>,
  chosen: Exercise[],
  relaxSimilarityRules: boolean
): Exercise[] {
  for (const tier of CANDIDATE_TIERS) {
    const candidates = findCandidates(
      key,
      intensity,
      allowedEquipment,
      equipmentRestricted,
      usedIds,
      chosen,
      tier.allowSecondary,
      tier.allowRepeat,
      tier.allowIntensityFallback,
      relaxSimilarityRules
    );
    if (candidates.length > 0) return candidates;
  }
  return [];
}

function buildMainExercises(
  patterns: PatternKey[],
  intensity: WorkoutIntensity,
  allowedEquipment: Set<Equipment>,
  equipmentRestricted: boolean,
  relaxSimilarityRules: boolean
): Exercise[] {
  const chosen: Exercise[] = [];
  const usedIds = new Set<string>();

  for (const key of patterns) {
    let candidates = candidatesForKey(
      key,
      intensity,
      allowedEquipment,
      equipmentRestricted,
      usedIds,
      chosen,
      relaxSimilarityRules
    );

    // En kärnrörelse-familj (t.ex. chinup, som alltid kräver pullup_bar) kan
    // sakna kandidater helt beroende på utrustning. Platsen faller då
    // tillbaka till familjens bredare kategori (se FAMILY_FALLBACK) istället
    // för att göra passet omöjligt att generera.
    if (candidates.length === 0) {
      const fallbackKey = FAMILY_FALLBACK[key];
      if (fallbackKey) {
        candidates = candidatesForKey(
          fallbackKey,
          intensity,
          allowedEquipment,
          equipmentRestricted,
          usedIds,
          chosen,
          relaxSimilarityRules
        );
      }
    }

    if (candidates.length === 0) {
      throw new NoExercisesFoundError(key);
    }

    const picked = randomItem(candidates);
    chosen.push(picked);
    usedIds.add(picked.id);
  }

  return chosen;
}

// Slutkontroll enligt 07-generator-specifikation.md §19 och
// 02-teknisk-specifikation.md B.19/B.23 (oberoende av hur passet byggdes).
function isValidWorkout(
  exercises: Exercise[],
  intensity: WorkoutIntensity,
  equipmentRestricted: boolean,
  relaxSimilarityRules: boolean
): boolean {
  if (exercises.some((exercise) => !isIntensityAllowed(exercise.intensity, intensity, true))) return false;

  for (let i = 1; i < exercises.length; i++) {
    if (violatesSequenceRules(exercises[i], exercises.slice(0, i), equipmentRestricted, relaxSimilarityRules)) return false;
  }

  // Matchar samma sätt som findCandidates (inklusive sekundära mönster) -
  // annars kan ett giltigt byggt pass avvisas här för att en plats fylldes
  // via en övnings sekundära mönster istället för dess primära.
  const hasAny = (key: PatternKey) => exercises.some((exercise) => exerciseMatchesKey(exercise, key, true));

  return (
    hasAny("knee") &&
    hasAny("hip") &&
    hasAny("push") &&
    hasAny("pull") &&
    hasAny("core") &&
    hasAny("conditioning") &&
    hasAny("balance_or_mobility")
  );
}

function createExerciseBlock(exercise: Exercise): WorkoutBlock {
  return {
    id: createId(),
    duration: BLOCK_DURATION_SECONDS,
    exercise,
  };
}

export function generateWorkout(settings: WorkoutSettings): Workout {
  const template = workoutTemplates.find((candidate) => candidate.duration === settings.duration);
  if (!template) {
    throw new InvalidWorkoutTemplateError(settings.duration);
  }

  const allowedEquipment = getAllowedEquipment(settings);
  const equipmentRestricted = !settings.hasChair || !settings.hasPullupBar;
  let mainExercises: Exercise[] | null = null;

  // Separation av liknande övningar (undvik två ensidiga eller tre
  // benövningar i rad) försöks alltid först. Bara om det är omöjligt att
  // fylla passmallen med separation (t.ex. Tufft där core/höft/rörlighet
  // alla delar "ben") körs en andra omgång med undantaget aktiverat.
  for (const relaxSimilarityRules of [false, true]) {
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      try {
        const candidate = buildMainExercises(
          template.patterns,
          settings.intensity,
          allowedEquipment,
          equipmentRestricted,
          relaxSimilarityRules
        );
        if (isValidWorkout(candidate, settings.intensity, equipmentRestricted, relaxSimilarityRules)) {
          mainExercises = candidate;
          break;
        }
      } catch {
        // Försöket misslyckades, prova igen med en ny slumpad sekvens.
      }
    }
    if (mainExercises) break;
  }

  if (!mainExercises) {
    throw new SequenceGenerationFailedError();
  }

  return {
    id: createId(),
    createdAt: new Date(),
    settings,
    blocks: mainExercises.map((exercise) => createExerciseBlock(exercise)),
  };
}
