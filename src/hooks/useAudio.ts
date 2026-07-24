"use client";

import { useCallback } from "react";
import { playCountdownBeep, playFinishSound, playNewBlockSound } from "@/lib/audio";
import { speakCountdown, speakExerciseName, speakNextExercise, speakWorkoutComplete } from "@/lib/voice";

// Spelar ljud endast om inställningen är påslagen (C.19: "Ljud ska kunna
// stängas av"). Hooken innehåller ingen ljudlogik själv, den använder bara
// funktionerna i lib/audio.ts och lib/voice.ts.
//
// Målet är att hela passet ska gå att köra utan att titta på mobilen: när en
// övning börjar läses dess namn upp, sedan nedräkningen (30, 10, 3, 2, 1) och
// vid övningsbytet "next exercise" följt av nästa övnings namn. Allt detta
// läses upp med röst (lib/voice.ts). Tonerna i lib/audio.ts är kvar som reserv
// för webbläsare utan Web Speech API, så att signalerna aldrig försvinner helt.
export function useAudio(enabled: boolean) {
  // Läser upp namnet på övningen som startar. Används för passets första
  // övning; övriga övningars namn läses upp av playNextExercise vid bytet.
  const announceExercise = useCallback(
    (name: string) => {
      if (!enabled) return;
      speakExerciseName(name);
    },
    [enabled]
  );

  // Övningsbyte: "next exercise" följt av nästa övnings namn. Utan röst spelas
  // skidstart-tonen som signal att ett nytt block har börjat.
  const playNextExercise = useCallback(
    (name: string) => {
      if (!enabled) return;
      if (speakNextExercise(name)) return;
      playNewBlockSound();
    },
    [enabled]
  );

  const playCountdown = useCallback(
    (remainingSeconds: number) => {
      if (!enabled) return;
      if (speakCountdown(remainingSeconds)) return;
      // Utan röst signaleras bara den sammanhängande slutnedräkningen (fem
      // sekunder och ned) - ett pip per sekund från tio och ned vore mer
      // stressande än stödjande.
      if (remainingSeconds <= 5) playCountdownBeep();
    },
    [enabled]
  );

  // Passet klart: rösten säger "workout complete", plus avslutningsklangen
  // (kvar som celebrativ signal och som reserv för webbläsare utan röst).
  const playFinish = useCallback(() => {
    if (!enabled) return;
    speakWorkoutComplete();
    playFinishSound();
  }, [enabled]);

  return { announceExercise, playNextExercise, playCountdown, playFinish };
}
