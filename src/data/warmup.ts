import type { WorkoutSegment } from "@/types/workout";

// Signaturuppvärmningen är alltid densamma. Källa: 01-produktspecifikation.md §12
// och 02-teknisk-specifikation.md D.12 (exakta tidsintervall).
export const warmupSegments: WorkoutSegment[] = [
  {
    startSecond: 0,
    endSecond: 15,
    title: "Djup knäböj med armlyft",
    instruction: "Sänk ned i en djup knäböj. Lyft armarna rakt upp när du reser dig.",
  },
  {
    startSecond: 15,
    endSecond: 30,
    title: "Utfall bakåt med rotation",
    instruction: "Kliv bakåt i ett utfall. Rotera överkroppen mot det främre benet.",
  },
  {
    startSecond: 30,
    endSecond: 45,
    title: "Inchworm",
    instruction: "Fäll framåt och gå ut med händerna till planka. Gå tillbaka och res dig upp.",
  },
  {
    startSecond: 45,
    endSecond: 60,
    title: "Höga knän",
    instruction: "Jogga på stället och driv knäna högt mot bröstet.",
  },
];
