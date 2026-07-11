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
import { shuffle } from "@/utils/shuffle";

const BLOCK_DURATION_SECONDS = 60;
// Höjd från 50 (v1.8) till 120, sedan till 300 (v1.9): sedan ordningen på
// rörelsegrupperna slumpas per försök (se generateWorkout) behöver enstaka
// tighta utrustningskombinationer fler försök för att träffa en ordning där
// sekvensregler, chinups tre garanterade platser och redan tunna familje-
// pooler (t.ex. hip_dominant/glute_bridge) går ihop samtidigt - värst är
// Längre/Normal med chinsstång men utan stol/bord/vikter. 300 gav noll
// misslyckanden över 1000 riktade provkörningar av just det scenariot och
// över flera fulla körningar av hela testmatrisen (se docs/loggbok.md).
// Generering tar i praktiken enstaka millisekunder (~10 ms i normalfallet,
// uppemot ~30 ms i det tightaste scenariot) - omärkbart för användaren.
const MAX_GENERATION_ATTEMPTS = 300;

// "bodyweight" och "floor" antas alltid finnas tillgängligt (07-generator-
// specifikation.md §7). "pullup_bar" beror på användarens val i
// Inställningar (WorkoutSettings.hasPullupBar). hasChair styr både "chair"
// och "table" tillsammans (UI-etiketten är "Stol och bord", en enda fråga -
// se WorkoutSettings.hasChair) - övningar som kräver ett bord (t.ex. rodd
// under bordet) blir alltså bara tillgängliga när användaren har både stol
// och bord. "Tunga" fria vikter ger tillgång till både lätta och tunga
// viktövningar (Tunga är en superset), eftersom en användare med tunga
// vikter också har lätta.
function getAllowedEquipment(settings: WorkoutSettings): Set<Equipment> {
  const allowed = new Set<Equipment>(["bodyweight", "floor"]);
  if (settings.hasChair) {
    allowed.add("chair");
    allowed.add("table");
  }
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

// Intensitetsfallback i två nivåer: "none" kräver exakt matchning mot
// passintensiteten, "adjacent" tillåter normal-övningar på Tufft när en
// plats saknar hård kandidat (t.ex. drag-platsen helt utan utrustning:
// den enda utrustningsfria drag-övningen i banken är prone_y_raise
// "Liggande Y-lyft", som är normal). Ett Normal-pass innehåller aldrig
// hårda övningar, oavsett nivå.
type IntensityFallback = "none" | "adjacent";

function isIntensityAllowed(
  exerciseIntensity: string,
  workoutIntensity: WorkoutIntensity,
  fallback: IntensityFallback = "none"
): boolean {
  if (workoutIntensity === "normal") return exerciseIntensity === "normal";
  return exerciseIntensity === "hard" || (fallback === "adjacent" && exerciseIntensity === "normal");
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
    "goblet_squat",
    "heavy_goblet_squat",
    "goblet_squat_hold",
    "pistol_squat_negative",
  ],
  // lunge_lateral (Sidoutfall) togs bort som egen namngiven plats i v1.9 för
  // att ge rum åt chinups tre garanterade platser (se workoutTemplates.ts).
  // lateral_lunge finns kvar i övningsbanken och nås fortfarande via
  // Kortares breda "knee"-kategori.
  lunge_forward: ["forward_lunge"],
  lunge_reverse: ["reverse_lunge", "weighted_reverse_lunge"],
  // hip_dominant täcker höftdominant träning brett (inte bara marklyfts-
  // varianter) - höftlyftsfamiljen och donkey kick togs in här i v1.8 sedan
  // Good morning togs bort (se docs/loggbok.md), eftersom marklyftsvarianterna
  // ensamma bara gav EN kroppsviktskandidat på Normal (single_leg_deadlift är
  // hard). Utesluter medvetet superman/bird_dog: bird_dog fyller redan
  // anti_rotation_core, och båda är funktionellt bål-/stabilitetsövningar
  // snarare än renodlat höftdominanta.
  hip_dominant: [
    "single_leg_deadlift",
    "romanian_deadlift",
    "kettlebell_deadlift",
    "glute_bridge",
    "single_leg_glute_bridge",
    "glute_bridge_march",
    "donkey_kick",
  ],
  pushup_rotation: ["spiderman_push_up", "t_push_up"],
  // chinup är sedan v1.9 en garanterad kärnövning (se workoutTemplates.ts:
  // 1x/2x/3x per passlängd) istället för bara en enda plats. Familjen har nu
  // två Normal-nivåer (dead_hang, statiskt håll - och negative_pull_up,
  // omklassad tillbaka från hard) och tre Hard-nivåer (pull_up, chin_up,
  // archer_pull_up), en exakt matchning mot Längre-passets tre garanterade
  // platser på Tufft. Tidigare var alla fyra ursprungliga medlemmar hard,
  // så chinup-platsen hade noll Normal-kandidater och föll alltid tillbaka
  // till "wildcard" - chins/pull-ups visades då aldrig alls på Normal.
  // Ingen ny övning skapades, bara omklassning av befintligt innehåll.
  chinup: ["pull_up", "chin_up", "negative_pull_up", "archer_pull_up", "dead_hang"],
  glute_bridge: [
    "glute_bridge",
    "single_leg_glute_bridge",
    "glute_bridge_march",
  ],
  overhead_press: ["pike_push_up", "overhead_press_light", "curl_to_press"],
  horizontal_pull_row: ["inverted_row", "one_arm_row_light"],
  // plank_shoulder_tap och suitcase_carry räknas hit: båda tränar att stå
  // emot rotation/sidoböjning, och suitcase_carry ger familjen en
  // hard-kandidat (de övriga tre är normal).
  anti_rotation_core: ["dead_bug", "bird_dog", "plank_shoulder_tap", "suitcase_carry"],
  side_plank: ["side_plank", "side_plank_dip", "star_plank"],
};

// Bredare reservkategori per kärnrörelse-familj, använd av buildMainExercises
// när familjen inte har någon kandidat (t.ex. chinup kräver alltid
// pullup_bar - saknas den utrustningen faller platsen tillbaka till en
// bredare kategori istället för att göra hela passet omöjligt att generera).
//
// chinup faller till "wildcard", inte "pull": horizontal_pull_row faller
// redan till "pull" i samma mallar, och utan stol/bord/chinsstång finns
// bara EN kroppsviktsövning i hela "pull"-kategorin (prone_y_raise/
// "Liggande Y-lyft"). Om båda platserna föll till "pull" skulle de
// oundvikligen krocka på samma övning - och eftersom samma övning aldrig
// får förekomma två gånger i samma pass (se isValidWorkout) skulle passet
// bli omöjligt att generera helt utan utrustning. "pull"-täckningen i
// passet garanteras redan av horizontal_pull_row-platsen, så chinup
// behöver inte också vara en pull-övning när chins inte går att göra.
//
// Samma tunna "pull"-kategori är också skälet till att "adjacent"-nivån i
// IntensityFallback finns kvar: på Tufft helt utan utrustning är
// prone_y_raise (normal) det enda sättet att fylla drag-platsen.
const FAMILY_FALLBACK: Partial<Record<PatternKey, PatternKey>> = {
  squat: "knee",
  lunge_forward: "knee",
  lunge_reverse: "knee",
  hip_dominant: "hip",
  pushup_rotation: "push",
  chinup: "wildcard",
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
  intensityFallback: IntensityFallback,
  relaxSimilarityRules: boolean
): Exercise[] {
  return exerciseData.filter((exercise) => {
    if (!allowRepeat && usedIds.has(exercise.id)) return false;
    if (!isIntensityAllowed(exercise.intensity, intensity, intensityFallback)) return false;
    if (!isEquipmentAllowed(exercise, allowedEquipment)) return false;
    if (violatesSequenceRules(exercise, chosen, equipmentRestricted, relaxSimilarityRules)) return false;
    return exerciseMatchesKey(exercise, key, allowSecondary);
  });
}

// Fallback-ordning per plats: unikt före upprepning, korrekt intensitet före
// nedgraderad. Samma övning ska aldrig förekomma två gånger i samma pass
// (se docs/loggbok.md) - allowRepeat är därför en sista utväg, bara använd
// om varken ett unikt primärt eller sekundärt mönster-match finns kvar för
// platsen. isValidWorkout gör dessutom en hård kontroll mot dubbletter, så
// ett pass som ändå fått en upprepning via denna sista utväg kasseras och
// ett nytt försök görs istället för att visas för användaren.
interface CandidateTier {
  allowSecondary: boolean;
  allowRepeat: boolean;
  intensityFallback: IntensityFallback;
}

const CANDIDATE_TIERS: CandidateTier[] = [
  { allowSecondary: false, allowRepeat: false, intensityFallback: "none" },
  { allowSecondary: true, allowRepeat: false, intensityFallback: "none" },
  { allowSecondary: false, allowRepeat: false, intensityFallback: "adjacent" },
  { allowSecondary: true, allowRepeat: false, intensityFallback: "adjacent" },
  { allowSecondary: false, allowRepeat: true, intensityFallback: "none" },
  { allowSecondary: true, allowRepeat: true, intensityFallback: "none" },
  { allowSecondary: false, allowRepeat: true, intensityFallback: "adjacent" },
  { allowSecondary: true, allowRepeat: true, intensityFallback: "adjacent" },
];

function candidatesForKey(
  key: PatternKey,
  intensity: WorkoutIntensity,
  allowedEquipment: Set<Equipment>,
  equipmentRestricted: boolean,
  usedIds: Set<string>,
  chosen: Exercise[],
  relaxSimilarityRules: boolean,
  preferBarWork = false
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
      tier.intensityFallback,
      relaxSimilarityRules
    );
    if (candidates.length > 0) {
      // När en plats på Tufft fallit tillbaka till normal-övningar ska den
      // ändå kännas så tuff som möjligt: föredra kandidater med minst
      // medelhögt styrkekrav (t.ex. kroppsrodd/enarmsrodd före liggande
      // Y-lyft på drag-platsen). Att samma övning då återkommer oftare är
      // ett medvetet val - hellre en krävande övning ofta än en lätt för
      // variationens skull. Lågkravskandidater används bara när inget
      // annat finns (i praktiken drag-platsen helt utan utrustning).
      if (intensity === "hard" && tier.intensityFallback === "adjacent") {
        const demanding = candidates.filter((candidate) => candidate.strengthDemand !== "low");
        if (demanding.length > 0) return demanding;
      }
      // Bardrag (chins/pull-ups/dead hang) är en kärnövning som ska synas
      // på Kortares enda dragplats när chinsstång finns, istället för att
      // konkurrera på lika villkor mot rodd/liggande Y-lyft (v1.9). Gäller
      // uttryckligen BARA när "pull" är den primära mallplatsen (preferBarWork,
      // satt av buildMainExercises enbart för det första candidatesForKey-
      // anropet) - INTE när "pull" används som FAMILY_FALLBACK-reserv för
      // horizontal_pull_row/chinup. Standard/Längre har flera dragplatser
      // (upp till tre chinup-platser plus horizontal_pull_row) som redan
      // konkurrerar om samma tunna Normal-pool (dead_hang/negative_pull_up);
      // om även horizontal_pull_row-reservens sökning föredrog bardrag
      // skulle den konkurrensen bli för hård och enstaka utrustnings-
      // kombinationer sluta gå att generera (se docs/loggbok.md v1.9).
      if (preferBarWork && key === "pull") {
        const barWork = candidates.filter((candidate) => candidate.primaryPattern === "vertical_pull");
        if (barWork.length > 0) return barWork;
      }
      return candidates;
    }
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
    // preferBarWork=true bara här: "pull" som PRIMÄR mallplats (Kortares enda
    // dragplats) ska föredra bardrag när chinsstång finns. Se candidatesForKey.
    let candidates = candidatesForKey(
      key,
      intensity,
      allowedEquipment,
      equipmentRestricted,
      usedIds,
      chosen,
      relaxSimilarityRules,
      true
    );

    // En kärnrörelse-familj (t.ex. chinup, som alltid kräver pullup_bar) kan
    // sakna kandidater helt beroende på utrustning. Platsen faller då
    // tillbaka till familjens bredare kategori (se FAMILY_FALLBACK) istället
    // för att göra passet omöjligt att generera. preferBarWork=false här
    // (standard): en FALLBACK-sökning (t.ex. horizontal_pull_row utan bord)
    // ska ta vilken "pull"-kandidat som helst, inte konkurrera med de
    // dedikerade chinup-platserna om samma tunna bardragspool.
    const fallbackKey = FAMILY_FALLBACK[key];
    if (candidates.length === 0 && fallbackKey) {
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
// requireCalf: vadövning krävs på Standard/Längre men inte på Kortare -
// sju minuter ska gå till de stora rörelsemönstren, och vad är där en
// möjlighet (via wildcard-platsen), inte ett krav.
function isValidWorkout(
  exercises: Exercise[],
  intensity: WorkoutIntensity,
  equipmentRestricted: boolean,
  relaxSimilarityRules: boolean,
  requireCalf: boolean
): boolean {
  if (exercises.some((exercise) => !isIntensityAllowed(exercise.intensity, intensity, "adjacent"))) return false;

  // Samma övning får aldrig förekomma två gånger i samma pass. buildMainExercises
  // undviker redan detta i praktiken (allowRepeat är bara en sista utväg i
  // CANDIDATE_TIERS), men den här kontrollen garanterar det oavsett hur passet
  // byggdes - ett pass med en dubblett kasseras och ett nytt försök görs.
  if (new Set(exercises.map((exercise) => exercise.id)).size !== exercises.length) return false;

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
    (!requireCalf || hasAny("calf"))
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
  const requireCalf = settings.duration !== "short";
  let mainExercises: Exercise[] | null = null;

  // template.patterns är en omärkt lista av rörelsegrupper, inte en fast
  // ordning (se workoutTemplates.ts) - varje försök slumpar en ny ordning
  // innan passet byggs, så att samma typ av övning inte alltid hamnar på
  // samma plats (t.ex. alltid först). Sekvensreglerna (violatesSequenceRules)
  // appliceras sedan i den slumpade ordningen precis som förut: en ordning
  // som råkar ställa två svåra/liknande övningar intill varandra ger helt
  // enkelt inga giltiga kandidater för den platsen, försöket kastas och ett
  // nytt försök (med ny slumpad ordning) görs - se catch nedan. Separation
  // av liknande övningar (undvik två ensidiga eller tre benövningar i rad)
  // försöks alltid först. Bara om det är omöjligt att fylla passmallen med
  // separation (t.ex. Tufft där core/höft alla delar "ben") körs en andra
  // omgång med undantaget aktiverat.
  for (const relaxSimilarityRules of [false, true]) {
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      try {
        const candidate = buildMainExercises(
          shuffle(template.patterns),
          settings.intensity,
          allowedEquipment,
          equipmentRestricted,
          relaxSimilarityRules
        );
        if (isValidWorkout(candidate, settings.intensity, equipmentRestricted, relaxSimilarityRules, requireCalf)) {
          mainExercises = candidate;
          break;
        }
      } catch {
        // Försöket misslyckades (ogiltig ordning eller sekvens), prova igen
        // med en ny slumpad ordning och sekvens.
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
