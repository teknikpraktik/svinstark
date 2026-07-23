"use client";

import { useCallback, useMemo, useState } from "react";
import { unlockAudioContext } from "@/lib/audio";
import { cancelVoice, unlockVoice } from "@/lib/voice";
import { generateWorkout } from "@/lib/workoutGenerator";
import { useAudio } from "@/hooks/useAudio";
import { useTimer } from "@/hooks/useTimer";
import { useWakeLock } from "@/hooks/useWakeLock";
import type { Screen, Workout, WorkoutSettings } from "@/types/workout";

// Orkestrerar skärmflödet Start -> Workout -> Paused -> Finished -> Start
// (B.27/B.28) genom att koppla ihop passgeneratorn med useTimer.
//
// soundEnabled tas emot live (inte som en frusen kopia av inställningen vid
// passets start) eftersom ljudikonen numera visas och kan togglas på
// WorkoutScreen medan passet pågår (se docs/loggbok.md v1.4).
export function useWorkout(soundEnabled: boolean) {
  const [screen, setScreen] = useState<Screen>("start");
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { playNewBlock, playCountdown, playFinish } = useAudio(soundEnabled);

  const handleFinish = useCallback(() => {
    playFinish();
    setScreen("finished");
  }, [playFinish]);

  const timerCallbacks = useMemo(
    () => ({ onFinish: handleFinish, onBlockChange: playNewBlock, onCountdown: playCountdown }),
    [handleFinish, playNewBlock, playCountdown]
  );

  const { timerState, pause: pauseTimer, resume: resumeTimer, stop: stopTimer, skip: skipTimer } = useTimer(
    workout,
    timerCallbacks
  );

  // Skärmen ska inte dimmas/släckas så länge ett pass pågår, även vid paus.
  useWakeLock(workout !== null);

  // Passet genereras och startar direkt vid knapptryckningen - hela den
  // valda tiden går till själva träningspasset.
  function start(settings: WorkoutSettings) {
    // Måste ske synkront här, i själva knapptryckningen, annars förblir
    // ljudet permanent avstängt på mobila webbläsare (se lib/audio.ts).
    // Låset gäller för resten av sessionen.
    if (settings.soundEnabled) {
      unlockAudioContext();
      unlockVoice();
    }

    setError(null);

    try {
      setWorkout(generateWorkout(settings));
      setScreen("workout");
    } catch {
      // Appen ska försöka återhämta sig innan ett felmeddelande visas (D.7).
      try {
        setWorkout(generateWorkout(settings));
        setScreen("workout");
      } catch {
        setError("Kunde inte skapa ett pass just nu. Försök igen.");
        setScreen("start");
      }
    }
  }

  // Paus är endast giltigt från "workout" och återuppta endast från "paused"
  // (B.24: aldrig från start eller finished). Hooken skyddar övergångarna
  // själv istället för att lita på att UI:t bara anropar dem vid rätt tillfälle.
  function pause() {
    if (screen !== "workout") return;
    pauseTimer();
    setScreen("paused");
  }

  function resume() {
    if (screen !== "paused") return;
    resumeTimer();
    setScreen("workout");
  }

  function stop() {
    if (screen !== "workout" && screen !== "paused") return;
    // En påbörjad nedräkningssiffra ska inte läsas upp efter att passet
    // avbrutits - rösten lever vidare i webbläsaren, inte i timern.
    cancelVoice();
    stopTimer();
    setWorkout(null);
    setScreen("start");
  }

  // Giltigt endast under pågående pass (aldrig pausad/start/finished).
  // skipTimer avslutar passet själv (via onFinish -> handleFinish) om det
  // var sista övningen, så inget extra skärmbyte behövs här för det fallet.
  function skip() {
    if (screen !== "workout") return;
    skipTimer();
  }

  function goToStart() {
    if (screen !== "finished") return;
    setWorkout(null);
    setScreen("start");
  }

  const currentBlock = workout?.blocks[timerState.currentBlock] ?? null;

  return {
    screen,
    workout,
    currentBlock,
    timerState,
    error,
    start,
    pause,
    resume,
    stop,
    skip,
    goToStart,
  };
}
