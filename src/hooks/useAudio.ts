"use client";

import { useCallback } from "react";
import { playCountdownBeep, playFinishSound, playNewBlockSound } from "@/lib/audio";

// Spelar ljud endast om inställningen är påslagen (C.19: "Ljud ska kunna
// stängas av"). Hooken innehåller ingen ljudlogik själv, den använder bara
// funktionerna i lib/audio.ts.
export function useAudio(enabled: boolean) {
  const playNewBlock = useCallback(() => {
    if (enabled) playNewBlockSound();
  }, [enabled]);

  const playCountdown = useCallback(() => {
    if (enabled) playCountdownBeep();
  }, [enabled]);

  const playFinish = useCallback(() => {
    if (enabled) playFinishSound();
  }, [enabled]);

  return { playNewBlock, playCountdown, playFinish };
}
