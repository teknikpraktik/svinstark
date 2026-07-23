"use client";

import { useCallback } from "react";
import { playCountdownBeep, playFinishSound, playNewBlockSound } from "@/lib/audio";
import { speakCountdown, speakGo } from "@/lib/voice";

// Spelar ljud endast om inställningen är påslagen (C.19: "Ljud ska kunna
// stängas av"). Hooken innehåller ingen ljudlogik själv, den använder bara
// funktionerna i lib/audio.ts och lib/voice.ts.
//
// Nedräkningen och övningsbytet läses i första hand upp med röst (lib/voice.ts).
// Tonerna i lib/audio.ts är kvar som reserv för webbläsare utan Web Speech API,
// så att signalerna i C.19 aldrig försvinner helt.
export function useAudio(enabled: boolean) {
  const playNewBlock = useCallback(() => {
    if (!enabled) return;
    if (speakGo()) return;
    playNewBlockSound();
  }, [enabled]);

  const playCountdown = useCallback(
    (remainingSeconds: number) => {
      if (!enabled) return;
      if (speakCountdown(remainingSeconds)) return;
      // Utan röst signaleras bara de sista tre sekunderna, som tidigare -
      // ett pip per sekund från tio och ned vore mer stressande än stödjande.
      if (remainingSeconds <= 3) playCountdownBeep();
    },
    [enabled]
  );

  const playFinish = useCallback(() => {
    if (enabled) playFinishSound();
  }, [enabled]);

  return { playNewBlock, playCountdown, playFinish };
}
