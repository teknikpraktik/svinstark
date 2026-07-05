import { cooldownSegments } from "@/data/cooldown";
import { exerciseData } from "@/data/exerciseData";
import { warmupSegments } from "@/data/warmup";
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
const ALLOWED_EQUIPMENT = new Set<Equipment>(["bodyweight", "floor", "chair", "pullup_bar"]);

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

function isIntensityAllowed(exerciseIntensity: string, workoutIntensity: WorkoutIntensity): boolean {
  if (workoutIntensity === "calm") return exerciseIntensity === "calm";
  if (workoutIntensity === "normal") return exerciseIntensity === "calm" || exerciseIntensity === "normal";
  return exerciseIntensity === "hard";
}

function isEquipmentAllowed(exercise: Exercise): boolean {
  return exercise.equipment.every((item) => ALLOWED_EQUIPMENT.has(item));
}

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
  if (patternMatchesKey(exercise.primaryPattern, key)) return true;
  if (!allowSecondary) return false;
  return exercise.secondaryPatterns.some((pattern) => patternMatchesKey(pattern, key));
}

// Sekvensregler enligt 03-exercise-library-specification.md §14 och
// 07-generator-specifikation.md §8.
function violatesSequenceRules(candidate: Exercise, chosen: Exercise[]): boolean {
  const prev = chosen[chosen.length - 1];
  if (!prev) return false;

  if (prev.avoidAdjacent.includes(candidate.id) || candidate.avoidAdjacent.includes(prev.id)) return true;
  if (prev.jump && candidate.jump) return true;
  if (prev.explosive && candidate.explosive) return true;
  if (prev.movementType === "isometric" && candidate.movementType === "isometric") return true;
  if (prev.unilateral && candidate.unilateral) return true;
  if (prev.primaryPattern === candidate.primaryPattern) return true;
  if (prev.bodyPosition === "hanging" && candidate.bodyPosition === "hanging") return true;

  const prev2 = chosen[chosen.length - 2];
  if (prev2) {
    if (
      prev2.bodyPosition === "floor" &&
      prev.bodyPosition === "floor" &&
      candidate.bodyPosition === "floor"
    ) {
      return true;
    }

    const legsInARow = [prev2, prev, candidate].every((exercise) =>
      exercise.muscleGroups.includes("legs")
    );
    if (legsInARow) return true;
  }

  return false;
}

function findCandidates(
  key: PatternKey,
  intensity: WorkoutIntensity,
  usedIds: Set<string>,
  chosen: Exercise[],
  allowSecondary: boolean
): Exercise[] {
  return exerciseData.filter((exercise) => {
    if (usedIds.has(exercise.id)) return false;
    if (!isIntensityAllowed(exercise.intensity, intensity)) return false;
    if (!isEquipmentAllowed(exercise)) return false;
    if (violatesSequenceRules(exercise, chosen)) return false;
    return exerciseMatchesKey(exercise, key, allowSecondary);
  });
}

function buildMainExercises(patterns: PatternKey[], intensity: WorkoutIntensity): Exercise[] {
  const chosen: Exercise[] = [];
  const usedIds = new Set<string>();

  for (const key of patterns) {
    let candidates = findCandidates(key, intensity, usedIds, chosen, false);
    if (candidates.length === 0) {
      candidates = findCandidates(key, intensity, usedIds, chosen, true);
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
function isValidWorkout(exercises: Exercise[], intensity: WorkoutIntensity): boolean {
  if (exercises.some((exercise) => !isIntensityAllowed(exercise.intensity, intensity))) return false;

  const uniqueIds = new Set(exercises.map((exercise) => exercise.id));
  if (uniqueIds.size !== exercises.length) return false;

  for (let i = 1; i < exercises.length; i++) {
    if (violatesSequenceRules(exercises[i], exercises.slice(0, i))) return false;
  }

  const hasAny = (predicate: (exercise: Exercise) => boolean) => exercises.some(predicate);

  return (
    hasAny((exercise) => exercise.primaryPattern === "knee") &&
    hasAny((exercise) => exercise.primaryPattern === "hip") &&
    hasAny((exercise) => exercise.primaryPattern === "horizontal_push" || exercise.primaryPattern === "vertical_push") &&
    hasAny((exercise) => exercise.primaryPattern === "horizontal_pull" || exercise.primaryPattern === "vertical_pull") &&
    hasAny((exercise) => exercise.primaryPattern === "core") &&
    hasAny((exercise) => exercise.primaryPattern === "conditioning") &&
    hasAny((exercise) => exercise.primaryPattern === "balance" || exercise.primaryPattern === "mobility")
  );
}

function createWarmupBlock(): WorkoutBlock {
  return {
    id: createId(),
    phase: "warmup",
    duration: BLOCK_DURATION_SECONDS,
    segments: warmupSegments,
  };
}

function createCooldownBlock(): WorkoutBlock {
  return {
    id: createId(),
    phase: "cooldown",
    duration: BLOCK_DURATION_SECONDS,
    segments: cooldownSegments,
  };
}

function createExerciseBlock(exercise: Exercise): WorkoutBlock {
  return {
    id: createId(),
    phase: "exercise",
    duration: BLOCK_DURATION_SECONDS,
    exercise,
  };
}

export function generateWorkout(settings: WorkoutSettings): Workout {
  const template = workoutTemplates.find((candidate) => candidate.duration === settings.duration);
  if (!template) {
    throw new InvalidWorkoutTemplateError(settings.duration);
  }

  let mainExercises: Exercise[] | null = null;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      const candidate = buildMainExercises(template.patterns, settings.intensity);
      if (isValidWorkout(candidate, settings.intensity)) {
        mainExercises = candidate;
        break;
      }
    } catch {
      // Försöket misslyckades, prova igen med en ny slumpad sekvens.
    }
  }

  if (!mainExercises) {
    throw new SequenceGenerationFailedError();
  }

  return {
    id: createId(),
    createdAt: new Date(),
    settings,
    blocks: [
      createWarmupBlock(),
      ...mainExercises.map((exercise) => createExerciseBlock(exercise)),
      createCooldownBlock(),
    ],
  };
}
