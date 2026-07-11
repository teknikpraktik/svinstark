import type { WorkoutTemplate } from "@/types/workout";

// Mallarna anger vilka rörelsemönster ett pass ska innehålla, som en
// omärkt lista (multiset) - INTE en fast ordning. Passgeneratorn slumpar
// ordningen på rörelsegrupperna för varje genereringsförsök (se
// generateWorkout i workoutGenerator.ts, v1.8) och väljer sedan en konkret
// övning per plats. Källa: 07-generator-specifikation.md §6. Standard/
// Längre byggdes om i v1.5 (se docs/loggbok.md) kring tolv namngivna
// kärnrörelser (höftdominant, armhävning med rotation, utfall åt tre håll,
// dead bug/bird dog, knäböj, sidoplanka, glute bridge, axelpress, chins,
// horisontellt drag) plus vader - istället för att bara fylla breda
// kategorier ("knee"/"push"/"pull") slumpmässigt. Kortare använder bara de
// breda kategorierna, för att hålla det allra kortaste passet enkelt och
// helkroppsfokuserat.
//
// Alla mallar täcker de centrala rörelsemönstren knä, höft, press, drag,
// bål och puls, oavsett i vilken ordning platserna hamnar (se isValidWorkout
// i workoutGenerator.ts - helkroppstäckningen valideras på passnivå, ingen
// rörelsegrupp kräver en bestämd position). Vad ingår alltid i Standard/
// Längre men är inget krav på Kortare: på sju minuter ska tiden gå till de
// stora rörelsemönstren, så sista platsen är en wildcard som ger variation
// - ibland en vadövning, ibland något annat.
export const workoutTemplates: WorkoutTemplate[] = [
  {
    duration: "short",
    patterns: ["knee", "push", "conditioning", "pull", "core", "hip", "wildcard"],
  },
  {
    duration: "standard",
    patterns: [
      "hip_dominant",
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
    // aldrig på horizontal_pull_row/overhead_press, som bara har EN
    // utrustningsfri medlem var (prone_y_raise/pike_push_up). Eftersom samma
    // övning aldrig får förekomma två gånger i samma pass (se
    // workoutGenerator.ts isValidWorkout) skulle en andra omgång av en sådan
    // tunn familj göra passet omöjligt att generera helt utan utrustning
    // (se docs/loggbok.md, v1.6). hip_dominant är sedan v1.8 tillräckligt
    // bred (höftlyftsfamiljen plus donkey kick) för att i praktiken tåla en
    // andra omgång också, men får ändå bara en plats här för att hålla
    // passets rörelsebalans - glute_bridge täcker redan samma muskelgrupp.
    //
    // De två platser som tidigare var balans respektive rörlighet är numera
    // en extra bred press- respektive konditionsplats (v1.7): banken
    // innehåller inte längre rena rörlighetsövningar, och rena
    // balansställningar togs bort tillsammans med intensiteten Lugnt.
    duration: "long",
    patterns: [
      "hip_dominant",
      "conditioning",
      "pushup_rotation",
      "horizontal_pull_row",
      "anti_rotation_core",
      "squat",
      "side_plank",
      "lunge_forward",
      "glute_bridge",
      "push",
      "lunge_lateral",
      "overhead_press",
      "lunge_reverse",
      "chinup",
      "conditioning",
      "calf",
      "squat",
      "core",
      "glute_bridge",
      "wildcard",
      "side_plank",
    ],
  },
];
