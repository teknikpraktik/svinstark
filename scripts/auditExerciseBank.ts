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
  Exercise,
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
// tillsammans med intensiteten Lugnt; Good morning, borttagen i v1.8) får
// inte återinföras i banken
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
  "good_morning",
];
for (const removedId of removedIds) {
  if (ids.has(removedId)) {
    console.log(`PROBLEM: borttagen övning "${removedId}" finns kvar i banken`);
    problems++;
  }
}
if (exerciseData.some((exercise) => exercise.name === "Good morning")) {
  console.log(`PROBLEM: en övning med namnet "Good morning" finns kvar i banken`);
  problems++;
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

// Återverifiering av de sekvensregler som ALDRIG relaxas (violatesSequenceRules
// i workoutGenerator.ts) - oberoende av intern implementation, direkt mot det
// pass generatorn faktiskt returnerade. "Två ensidiga i rad" och "tre
// benövningar i rad" är MEDVETET uteslutna här: de får kopplas bort som sista
// utväg (se generateWorkout/relaxSimilarityRules), så ett test som kräver dem
// strikt skulle bli skört och kunna slå fel på ett giltigt, avsett pass.
function findSequenceViolation(blocks: Exercise[]): string | null {
  for (let i = 1; i < blocks.length; i++) {
    const prev = blocks[i - 1];
    const curr = blocks[i];
    if (prev.avoidAdjacent.includes(curr.id) || curr.avoidAdjacent.includes(prev.id)) {
      return `avoidAdjacent-brott mellan ${prev.id} och ${curr.id}`;
    }
    if (prev.jump && curr.jump) return `två hoppövningar i rad: ${prev.id} -> ${curr.id}`;
    if (prev.explosive && curr.explosive) return `två explosiva övningar i rad: ${prev.id} -> ${curr.id}`;
    if (prev.movementType === "isometric" && curr.movementType === "isometric") {
      return `två isometriska övningar i rad: ${prev.id} -> ${curr.id}`;
    }
    if (prev.primaryPattern === curr.primaryPattern) {
      return `samma primaryPattern i rad: ${prev.id} -> ${curr.id}`;
    }
    if (prev.bodyPosition === "hanging" && curr.bodyPosition === "hanging") {
      return `två hängande övningar i rad: ${prev.id} -> ${curr.id}`;
    }
  }
  return null;
}

// Extern, oberoende kontroll av helkroppstäckning - mirrorar isValidWorkouts
// hasAny-logik men direkt mot primaryPattern/secondaryPatterns, utan att gå
// via workoutGenerator.ts interna hjälpfunktioner.
function findMissingCoverage(blocks: Exercise[]): string | null {
  const matchesAny = (patterns: string[]) =>
    blocks.some(
      (block) => patterns.includes(block.primaryPattern) || block.secondaryPatterns.some((p) => patterns.includes(p))
    );
  const required: Array<[string, string[]]> = [
    ["knee", ["knee"]],
    ["hip", ["hip"]],
    ["push", ["horizontal_push", "vertical_push"]],
    ["pull", ["horizontal_pull", "vertical_pull"]],
    ["core", ["core"]],
    ["conditioning", ["conditioning"]],
  ];
  for (const [label, patterns] of required) {
    if (!matchesAny(patterns)) return `saknar täckning för "${label}"`;
  }
  return null;
}

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

              const exercises = workout.blocks.map((block) => block.exercise);
              const sequenceViolation = findSequenceViolation(exercises);
              if (sequenceViolation) throw new Error(`sekvensregel bruten: ${sequenceViolation}`);

              const missingCoverage = findMissingCoverage(exercises);
              if (missingCoverage) throw new Error(`helkroppstäckning: ${missingCoverage}`);

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

// Ordningsslumpning (v1.8): upprepade genereringar med IDENTISKA inställningar
// ska kunna ge olika ordning på rörelsegrupperna, inte bara olika övningsval
// inom en fast ordning. Testet är medvetet inte skört - det kräver bara att
// FLERA olika utfall förekommer över många körningar, inte en exakt
// fördelning, så det slår inte fel på ett giltigt men "otursamt" utfall.
const VARIETY_RUNS = 40;
function checkOrderVariety(
  label: string,
  settings: { duration: WorkoutDuration; intensity: WorkoutIntensity; hasChair: boolean; hasPullupBar: boolean; freeWeights: FreeWeightsLevel }
) {
  const firstNames = new Set<string>();
  const fullSequences = new Set<string>();
  const workoutIds = new Set<string>();
  for (let i = 0; i < VARIETY_RUNS; i++) {
    const workout = generateWorkout({ ...settings, soundEnabled: false });
    firstNames.add(workout.blocks[0].exercise.name);
    fullSequences.add(workout.blocks.map((block) => block.exercise.id).join(","));
    workoutIds.add(workout.id);
  }
  if (workoutIds.size !== VARIETY_RUNS) {
    console.log(`PROBLEM: ${label} - workout.id återanvändes mellan genereringar (endast ${workoutIds.size}/${VARIETY_RUNS} unika)`);
    problems++;
  }
  if (firstNames.size <= 1) {
    console.log(`PROBLEM: ${label} - första övningen var alltid "${[...firstNames][0]}" över ${VARIETY_RUNS} genereringar (ordningen slumpas inte)`);
    problems++;
  }
  if (fullSequences.size <= 1) {
    console.log(`PROBLEM: ${label} - exakt samma passordning returnerades varje gång över ${VARIETY_RUNS} genereringar`);
    problems++;
  }
}

checkOrderVariety("Standard/Normal, all utrustning", {
  duration: "standard",
  intensity: "normal",
  hasChair: true,
  hasPullupBar: true,
  freeWeights: "heavy",
});
checkOrderVariety("Standard/Tufft, all utrustning", {
  duration: "standard",
  intensity: "hard",
  hasChair: true,
  hasPullupBar: true,
  freeWeights: "heavy",
});
checkOrderVariety("Standard/Normal, ingen utrustning", {
  duration: "standard",
  intensity: "normal",
  hasChair: false,
  hasPullupBar: false,
  freeWeights: "none",
});
checkOrderVariety("Längre/Tufft, all utrustning", {
  duration: "long",
  intensity: "hard",
  hasChair: true,
  hasPullupBar: true,
  freeWeights: "heavy",
});

console.log(`\nOrdningsslumpning kontrollerad (${VARIETY_RUNS} körningar per scenario).`);

if (problems > 0 || failedCombos > 0) {
  process.exitCode = 1;
}
