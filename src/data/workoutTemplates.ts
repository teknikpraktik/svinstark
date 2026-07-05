import type { WorkoutTemplate } from "@/types/workout";

// Mallarna anger endast ordningen av rörelsemönster. Passgeneratorn väljer
// konkreta övningar för varje plats. Källa: 07-generator-specifikation.md §6
// (kortare/standard är exakt de exempel-mallar dokumentet ger; längre är
// konstruerad enligt samma princip, utan två identiska mönster i följd).
export const workoutTemplates: WorkoutTemplate[] = [
  {
    duration: "short",
    patterns: ["knee", "push", "conditioning", "pull", "core", "hip", "balance_or_mobility"],
  },
  {
    duration: "standard",
    patterns: [
      "knee",
      "push",
      "conditioning",
      "pull",
      "core",
      "hip",
      "mobility",
      "conditioning",
      "push",
      "balance",
      "hip",
      "pull",
      "core",
      "wildcard",
    ],
  },
  {
    duration: "long",
    patterns: [
      "knee",
      "push",
      "conditioning",
      "pull",
      "core",
      "hip",
      "balance",
      "mobility",
      "knee",
      "push",
      "conditioning",
      "pull",
      "core",
      "hip",
      "wildcard",
      "balance_or_mobility",
      "knee",
      "push",
      "core",
      "wildcard",
      "balance_or_mobility",
    ],
  },
];
