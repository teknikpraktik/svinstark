import type { WorkoutDuration, WorkoutIntensity } from "@/types/workout";

// Delade visningsetiketter för träningstid/intensitet, använda av både
// StartScreen och WorkoutScreen (undviker att samma text/siffror underhålls
// på två ställen).
export const durationOrder: WorkoutDuration[] = ["short", "standard", "long"];

export const durationLabels: Record<WorkoutDuration, string> = {
  short: "Kortare",
  standard: "Standard",
  long: "Längre",
};

// Total passlängd i minuter, enligt 01-produktspecifikation.md §10.
export const durationMinutes: Record<WorkoutDuration, number> = {
  short: 7,
  standard: 14,
  long: 21,
};

export const intensityOrder: WorkoutIntensity[] = ["calm", "normal", "hard"];

export const intensityLabels: Record<WorkoutIntensity, string> = {
  calm: "Lugnt",
  normal: "Normalt",
  hard: "Tufft",
};
