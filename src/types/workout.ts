// Övningsklassificering (se 03-exercise-library-specification.md)

export type Equipment =
  | "bodyweight"
  | "floor"
  | "chair"
  | "table"
  | "pullup_bar"
  | "weights_light"
  | "weights_heavy";

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
  | "mobility"
  | "calf";

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

export type FreeWeightsLevel = "none" | "light" | "heavy";

export interface WorkoutSettings {
  duration: WorkoutDuration;
  intensity: WorkoutIntensity;
  soundEnabled: boolean;
  // "bodyweight" och "floor" antas alltid finnas tillgängligt. hasChair
  // styr både "chair"- och "table"-utrustning (UI-etikett "Stol och bord") -
  // en enda fråga, inte två separata inställningar.
  hasChair: boolean;
  hasPullupBar: boolean;
  freeWeights: FreeWeightsLevel;
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
  | "wildcard"
  // Smalare "kärnrörelse"-familjer (se 99-loggbok, v1.5): matchas mot en
  // uttrycklig lista av övnings-id:n i workoutGenerator.ts MOVEMENT_FAMILIES,
  // inte mot ExercisePattern, eftersom de är en delmängd av en bredare
  // kategori (t.ex. "squat" är bara knäböjsvarianter, inte alla knädominanta
  // övningar). Standard/Längre-mallarna bygger passets stomme kring dessa;
  // Kortare använder fortfarande bara de breda kategorierna ovan.
  | "squat"
  | "lunge_forward"
  | "lunge_lateral"
  | "lunge_reverse"
  | "hip_hinge"
  | "pushup_rotation"
  | "chinup"
  | "glute_bridge"
  | "overhead_press"
  | "horizontal_pull_row"
  | "anti_rotation_core"
  | "side_plank"
  | "calf";

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
