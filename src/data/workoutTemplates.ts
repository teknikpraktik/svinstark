import type { WorkoutTemplate } from "@/types/workout";

// Mallarna anger vilka rörelsemönster ett pass ska innehålla, som en
// omärkt lista (multiset) - INTE en fast ordning. Passgeneratorn slumpar
// ordningen på rörelsegrupperna för varje genereringsförsök (se
// generateWorkout i workoutGenerator.ts, v1.8) och väljer sedan en konkret
// övning per plats. Källa: 07-generator-specifikation.md §6. Standard/
// Längre byggdes om i v1.5 (se docs/loggbok.md) kring namngivna
// kärnrörelser (höftdominant, armhävning med rotation, utfall, dead
// bug/bird dog, knäböj, sidoplanka, glute bridge, axelpress, chins,
// horisontellt drag) plus vader - istället för att bara fylla breda
// kategorier ("knee"/"push"/"pull") slumpmässigt. Kortare använder bara de
// breda kategorierna, för att hålla det allra kortaste passet enkelt och
// helkroppsfokuserat.
//
// chins/pull-ups (chinup) är en garanterad kärnövning sedan v1.9: 1x på
// Kortare, 2x på Standard, 3x på Längre - oavsett intensitet. På Kortare
// sker det INTE via en egen namngiven plats utan genom att den breda
// "pull"-platsen föredrar bardrag när chinsstång finns (se candidatesForKey
// i workoutGenerator.ts) - annars hade "pull" behövt bli "chinup" rakt av,
// vilket skulle göra passet ogenererbart utan bar OCH bord (chinups enda
// reservkategori är "wildcard", som inte specifikt riktar mot "pull").
// Standard/Längre använder istället flera explicita "chinup"-platser
// (ersätter sidoutfall, och på Längre även den extra press-platsen från
// v1.7) eftersom de redan har en egen "horizontal_pull_row"-plats som
// garanterar bred dragtäckning oavsett utrustning - kollisionsrisken som
// gjorde chinups fallback till "wildcard" (se workoutGenerator.ts) gäller
// bara när FLERA dragplatser samtidigt måste falla tillbaka till samma
// tunna pool, vilket "pull"-preferensen på Kortare inte skapar (bara en
// dragplats där). Sidoutfall (lateral_lunge) finns kvar i övningsbanken och
// kan fortfarande väljas i Kortare-pass (breda "knee"-kategorin), men har
// inte längre en egen garanterad plats i Standard/Längre.
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
      "chinup",
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
    // Platsen som tidigare var rörlighet är numera en extra bred
    // konditionsplats (v1.7): banken innehåller inte längre rena
    // rörlighetsövningar, och rena balansställningar togs bort tillsammans
    // med intensiteten Lugnt. Platsen som tidigare var balans, och den
    // extra press-platsen, är sedan v1.9 istället de två extra chinup-
    // platserna (se kommentaren ovan) - chinup går från 1x till 3x totalt.
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
      "chinup",
      "chinup",
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
