// Validering av övningsbank, generator och inställningsmigrering:
// körs med `npx tsx scripts/auditExerciseBank.ts`.
// 1. Statiska kontroller av övningsbanken (dubbletter, döda referenser,
//    giltiga intensiteter, borttagna övningar).
// 2. Kontroll av UI-etiketter och migrering av gamla sparade inställningar.
// 3. Provkörning av generateWorkout för samtliga kombinationer av
//    längd/intensitet/utrustning, med kontroll av passens intensitetsinnehåll.
import { readFileSync } from "node:fs";
import { exerciseData } from "@/data/exerciseData";
import { intensityLabels, intensityOrder } from "@/data/workoutLabels";
import { sanitizeStoredSettings } from "@/hooks/useSettings";
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

// Endast "normal" och "hard" är giltiga intensiteter i banken
const validIntensities = new Set<string>(["normal", "hard"]);
for (const exercise of exerciseData) {
  if (!validIntensities.has(exercise.intensity)) {
    console.log(`PROBLEM: ${exercise.id} har ogiltig intensitet "${exercise.intensity}"`);
    problems++;
  }
}

// Borttagna övningar (rörlighet/stretch/rena balansställningar, borttagna
// tillsammans med intensiteten Lugnt) får inte återinföras i banken
const removedIds = [
  "cat_cow",
  "thoracic_rotation",
  "arm_circles",
  "leg_swings",
  "deep_squat_hold",
  "standing_forward_fold",
  "childs_pose",
  "tree_pose_hold",
  "single_leg_stand",
];
for (const removedId of removedIds) {
  if (ids.has(removedId)) {
    console.log(`PROBLEM: borttagen övning "${removedId}" finns kvar i banken`);
    problems++;
  }
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

// UI-etiketter: exakt två intensiteter, och Lugnt får inte förekomma
if (intensityOrder.length !== 2 || intensityOrder[0] !== "normal" || intensityOrder[1] !== "hard") {
  console.log(`PROBLEM: intensityOrder är inte ["normal", "hard"]: ${JSON.stringify(intensityOrder)}`);
  problems++;
}
for (const label of Object.values(intensityLabels)) {
  if (label.toLowerCase().includes("lugn")) {
    console.log(`PROBLEM: UI-etiketten "${label}" refererar till den borttagna intensiteten Lugnt`);
    problems++;
  }
}

// Migrering av gamla sparade inställningar: "calm" (och andra ogiltiga
// värden) ska bli "normal", giltiga värden ska bevaras
const migrationCases: Array<{ stored: unknown; expected: WorkoutIntensity }> = [
  { stored: "calm", expected: "normal" },
  { stored: "normal", expected: "normal" },
  { stored: "hard", expected: "hard" },
  { stored: undefined, expected: "normal" },
  { stored: "nonsense", expected: "normal" },
  { stored: 3, expected: "normal" },
];
for (const testCase of migrationCases) {
  const sanitized = sanitizeStoredSettings({ intensity: testCase.stored });
  if (sanitized.intensity !== testCase.expected) {
    console.log(
      `PROBLEM: migrering av intensity=${JSON.stringify(testCase.stored)} gav "${sanitized.intensity}", förväntade "${testCase.expected}"`
    );
    problems++;
  }
}
// Hela inställningsobjektet ska alltid bli giltigt, även från skräpdata
const sanitizedGarbage = sanitizeStoredSettings({
  duration: "verylong",
  intensity: "calm",
  soundEnabled: "yes",
  hasChair: 1,
  hasPullupBar: null,
  freeWeights: "many",
});
if (
  sanitizedGarbage.duration !== "standard" ||
  sanitizedGarbage.intensity !== "normal" ||
  sanitizedGarbage.soundEnabled !== true ||
  sanitizedGarbage.hasChair !== true ||
  sanitizedGarbage.hasPullupBar !== true ||
  sanitizedGarbage.freeWeights !== "none"
) {
  console.log(`PROBLEM: skräpdata sanerades inte till standardvärden: ${JSON.stringify(sanitizedGarbage)}`);
  problems++;
}

console.log(`\nStatiska kontroller klara (${problems} problem).\n`);

// Provkörning: alla kombinationer, många körningar per kombination.
// Utöver att genereringen lyckas kontrolleras att passet aldrig innehåller
// fel intensitet (Normal: endast normal-övningar; Tufft: hard-övningar med
// normal som reserv där hård kandidat saknas) och aldrig samma övning två
// gånger.
const durations: WorkoutDuration[] = ["short", "standard", "long"];
const intensities: WorkoutIntensity[] = ["normal", "hard"];
const weightLevels: FreeWeightsLevel[] = ["none", "light", "heavy"];
const RUNS = 50;

let failedCombos = 0;
let comboCount = 0;
for (const duration of durations) {
  for (const intensity of intensities) {
    for (const hasChair of [false, true]) {
      for (const hasPullupBar of [false, true]) {
        for (const freeWeights of weightLevels) {
          comboCount++;
          let failures = 0;
          let lastError = "";
          for (let i = 0; i < RUNS; i++) {
            try {
              const workout = generateWorkout({
                duration,
                intensity,
                soundEnabled: false,
                hasChair,
                hasPullupBar,
                freeWeights,
              });

              const workoutIds = workout.blocks.map((block) => block.exercise.id);
              if (new Set(workoutIds).size !== workoutIds.length) {
                throw new Error(`samma övning två gånger: ${workoutIds.join(", ")}`);
              }

              // Vadövning krävs på Standard/Längre men inte på Kortare
              if (duration !== "short") {
                const hasCalf = workout.blocks.some(
                  (block) =>
                    block.exercise.primaryPattern === "calf" ||
                    block.exercise.secondaryPatterns.includes("calf")
                );
                if (!hasCalf) {
                  throw new Error("Standard/Längre-pass saknar vadövning");
                }
              }
              for (const block of workout.blocks) {
                const exerciseIntensity = block.exercise.intensity;
                if (intensity === "normal" && exerciseIntensity !== "normal") {
                  throw new Error(`Normal-pass innehöll ${exerciseIntensity}-övning: ${block.exercise.id}`);
                }
                if (!validIntensities.has(exerciseIntensity)) {
                  throw new Error(`ogiltig intensitet "${exerciseIntensity}": ${block.exercise.id}`);
                }
              }
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
    ? `\nAlla ${comboCount} kombinationer OK (${RUNS} körningar per kombination).`
    : `\n${failedCombos} kombinationer misslyckades.`
);
if (problems > 0 || failedCombos > 0) {
  process.exitCode = 1;
}
