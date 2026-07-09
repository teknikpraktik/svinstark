import type { WorkoutTemplate } from "@/types/workout";

// Mallarna anger endast ordningen av rörelsemönster. Passgeneratorn väljer
// konkreta övningar för varje plats. Källa: 07-generator-specifikation.md §6
// (kortare är exakt det exempel-mallen dokumentet ger, oförändrad sedan
// MVP). Standard/Längre byggdes om i v1.5 (se docs/loggbok.md) kring tolv
// namngivna kärnrörelser (draken/hip_hinge, armhävning med rotation,
// utfall åt tre håll, dead bug/bird dog, knäböj, sidoplanka, glute bridge,
// axelpress, chins, horisontellt drag) plus vader - istället för att bara
// fylla breda kategorier ("knee"/"push"/"pull") slumpmässigt. Kortare
// använder fortfarande bara de breda kategorierna, för att hålla det
// allra kortaste passet enkelt och helkroppsfokuserat.
export const workoutTemplates: WorkoutTemplate[] = [
  {
    duration: "short",
    patterns: ["knee", "push", "conditioning", "pull", "core", "hip", "balance_or_mobility"],
  },
  {
    duration: "standard",
    patterns: [
      "hip_hinge",
      "conditioning",
      "pushup_rotation",
      "horizontal_pull_row",
      "anti_rotation_core",
      "squat",
      "side_plank",
      "lunge_forward",
      "glute_bridge",
      "lunge_lateral",
      "overhead_press",
      "lunge_reverse",
      "chinup",
      "calf",
    ],
  },
  {
    // Extra volym (andra omgången) läggs bara på familjer med minst två
    // kroppsviktstillgängliga medlemmar (squat, glute_bridge, side_plank) -
    // aldrig på horizontal_pull_row/overhead_press/hip_hinge, som bara har
    // EN utrustningsfri medlem var (prone_y_raise/pike_push_up/
    // single_leg_deadlift). Eftersom samma övning aldrig får förekomma två
    // gånger i samma pass (se workoutGenerator.ts isValidWorkout) skulle en
    // andra omgång av en sådan tunn familj göra passet omöjligt att
    // generera helt utan utrustning (se docs/loggbok.md, v1.6).
    duration: "long",
    patterns: [
      "hip_hinge",
      "conditioning",
      "pushup_rotation",
      "horizontal_pull_row",
      "anti_rotation_core",
      "squat",
      "side_plank",
      "lunge_forward",
      "glute_bridge",
      "balance",
      "lunge_lateral",
      "overhead_press",
      "lunge_reverse",
      "chinup",
      "mobility",
      "calf",
      "squat",
      "core",
      "glute_bridge",
      "wildcard",
      "side_plank",
    ],
  },
];
