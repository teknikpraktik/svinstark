import type { WorkoutSegment } from "@/types/workout";

// Signaturavslutet är alltid detsamma. Källa: 01-produktspecifikation.md §13
// och 02-teknisk-specifikation.md D.13 (exakta tidsintervall och titlar).
export const cooldownSegments: WorkoutSegment[] = [
  {
    startSecond: 0,
    endSecond: 20,
    title: "Djup knäböj",
    instruction: "Sänk ned i en djup knäböj. Andas lugnt och håll positionen avslappnad.",
  },
  {
    startSecond: 20,
    endSecond: 40,
    title: "Framåtfällning",
    instruction: "Fäll långsamt framåt över höfterna. Låt huvud och armar hänga avslappnat.",
  },
  {
    startSecond: 40,
    endSecond: 60,
    title: "Andning med armlyft",
    instruction: "Res dig upp. Lyft armarna i takt med en lugn inandning och sänk vid utandning.",
  },
];
