// Övningsklassificering (se 03-exercise-library-specification.md)

export type Equipment = "bodyweight" | "floor" | "chair" | "pullup_bar";

export type ExercisePattern =
  | "knee"
  | "hip"
  | "horizontal_push"
  | "vertical_push"
  | "horizontal_pull"
  | "vertical_pull"
  | "core"
  | "conditioning"
  | "balance"
  | "mobility";

export type ExerciseIntensity = "calm" | "normal" | "hard";

export type DemandLevel = "low" | "medium" | "high";

export type BodyPosition = "standing" | "floor" | "kneeling" | "hanging";

export type MovementType = "dynamic" | "isometric";

export type Impact = "low" | "medium" | "high";

export type MovementPlane = "sagittal" | "frontal" | "transverse" | "multi";

export type MuscleGroup =
  | "legs"
  | "glutes"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "full_body";

export interface Exercise {
  // Identitet
  id: string;
  name: string;
  instruction: string;

  // Klassificering
  primaryPattern: ExercisePattern;
  secondaryPatterns: ExercisePattern[];
  intensity: ExerciseIntensity;
  equipment: Equipment[];
  muscleGroups: MuscleGroup[];

  // Objektiva egenskaper
  bodyPosition: BodyPosition;
  movementType: MovementType;
  movementPlane: MovementPlane;
  impact: Impact;

  explosive: boolean;
  unilateral: boolean;
  jump: boolean;
  rotation: boolean;
  overhead: boolean;
  locomotion: boolean;

  // Belastning
  strengthDemand: DemandLevel;
  cardioDemand: DemandLevel;
  mobilityDemand: DemandLevel;
  balanceDemand: DemandLevel;
  coordinationDemand: DemandLevel;

  // Generatorregler
  avoidAdjacent: string[];
}

// Pass och användarval (se 02-teknisk-specifikation.md Del B)

export type WorkoutDuration = "short" | "standard" | "long";

export type WorkoutIntensity = "calm" | "normal" | "hard";

export interface WorkoutSettings {
  duration: WorkoutDuration;
  intensity: WorkoutIntensity;
  soundEnabled: boolean;
  // "bodyweight" och "floor" antas alltid finnas tillgängligt.
  hasChair: boolean;
  hasPullupBar: boolean;
}

export interface WorkoutBlock {
  id: string;
  duration: number;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  createdAt: Date;
  settings: WorkoutSettings;
  blocks: WorkoutBlock[];
}

// Passgenerator (se 07-generator-specifikation.md)

export type PatternKey =
  | "knee"
  | "hip"
  | "push"
  | "pull"
  | "horizontal_push"
  | "vertical_push"
  | "horizontal_pull"
  | "vertical_pull"
  | "conditioning"
  | "core"
  | "balance"
  | "mobility"
  | "balance_or_mobility"
  | "knee_or_hip"
  | "wildcard";

export interface WorkoutTemplate {
  duration: WorkoutDuration;
  patterns: PatternKey[];
}

// Timer och applikationsstate

export interface TimerState {
  currentBlock: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export type Screen = "start" | "warmup" | "workout" | "paused" | "finished";

export interface AppState {
  screen: Screen;
  workout?: Workout;
  timer: TimerState;
  settings: WorkoutSettings;
}
