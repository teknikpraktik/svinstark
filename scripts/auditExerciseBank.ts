// Engångsaudit: körs med `npx tsx scripts/auditExerciseBank.ts`.
// 1. Statiska kontroller av övningsbanken (dubbletter, döda referenser).
// 2. Provkörning av generateWorkout för samtliga kombinationer av
//    längd/intensitet/utrustning.
import { readFileSync } from "node:fs";
import { exerciseData } from "@/data/exerciseData";
import { generateWorkout } from "@/lib/workoutGenerator";
import type {
  FreeWeightsLevel,
  WorkoutDuration,
  WorkoutIntensity,
} from "@/types/workout";

const ids = new Set(exerciseData.map((exercise) => exercise.id));
let problems = 0;

// Dubblett-id och dubblettnamn
const seenIds = new Set<string>();
const seenNames = new Set<string>();
for (const exercise of exerciseData) {
  if (seenIds.has(exercise.id)) {
    console.log(`PROBLEM: dubblett-id "${exercise.id}"`);
    problems++;
  }
  seenIds.add(exercise.id);
  if (seenNames.has(exercise.name)) {
    console.log(`PROBLEM: dubblettnamn "${exercise.name}"`);
    problems++;
  }
  seenNames.add(exercise.name);
}

// Döda avoidAdjacent-referenser
for (const exercise of exerciseData) {
  for (const ref of exercise.avoidAdjacent) {
    if (!ids.has(ref)) {
      console.log(`PROBLEM: ${exercise.id} avoidAdjacent -> "${ref}" finns inte`);
      problems++;
    }
    if (ref === exercise.id) {
      console.log(`PROBLEM: ${exercise.id} avoidAdjacent pekar på sig själv`);
      problems++;
    }
  }
}

// Döda id-referenser i MOVEMENT_FAMILIES (parsas ur källfilen eftersom
// konstanten inte är exporterad)
const generatorSource = readFileSync("src/lib/workoutGenerator.ts", "utf8");
const familiesBlock = generatorSource
  .slice(
    generatorSource.indexOf("const MOVEMENT_FAMILIES"),
    generatorSource.indexOf("const FAMILY_FALLBACK")
  )
  .split("\n")
  .filter((line) => !line.trim().startsWith("//"))
  .join("\n");
for (const match of familiesBlock.matchAll(/"([a-z_]+)"/g)) {
  const ref = match[1];
  if (!ids.has(ref)) {
    console.log(`PROBLEM: MOVEMENT_FAMILIES refererar "${ref}" som inte finns`);
    problems++;
  }
}

console.log(`\nStatiska kontroller klara (${problems} problem).\n`);

// Provkörning: alla kombinationer, många försök per kombination
const durations: WorkoutDuration[] = ["short", "standard", "long"];
const intensities: WorkoutIntensity[] = ["calm", "normal", "hard"];
const weightLevels: FreeWeightsLevel[] = ["none", "light", "heavy"];
const RUNS = 50;

let failedCombos = 0;
for (const duration of durations) {
  for (const intensity of intensities) {
    for (const hasChair of [false, true]) {
      for (const hasPullupBar of [false, true]) {
        for (const freeWeights of weightLevels) {
          let failures = 0;
          let lastError = "";
          for (let i = 0; i < RUNS; i++) {
            try {
              generateWorkout({
                duration,
                intensity,
                soundEnabled: false,
                hasChair,
                hasPullupBar,
                freeWeights,
              });
            } catch (error) {
              failures++;
              lastError = error instanceof Error ? error.message : String(error);
            }
          }
          if (failures > 0) {
            failedCombos++;
            console.log(
              `FAIL ${failures}/${RUNS}: ${duration}/${intensity} stol=${hasChair} stång=${hasPullupBar} vikter=${freeWeights} — ${lastError}`
            );
          }
        }
      }
    }
  }
}

console.log(
  failedCombos === 0
    ? `\nAlla 108 kombinationer OK (${RUNS} körningar per kombination).`
    : `\n${failedCombos} kombinationer misslyckades.`
);
