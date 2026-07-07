"use client";

import { useCallback, useMemo, useState } from "react";
import { unlockAudioContext } from "@/lib/audio";
import { generateWorkout } from "@/lib/workoutGenerator";
import { useAudio } from "@/hooks/useAudio";
import { useTimer } from "@/hooks/useTimer";
import { useWakeLock } from "@/hooks/useWakeLock";
import type { Screen, Workout, WorkoutSettings } from "@/types/workout";

// Orkestrerar skärmflödet Start -> Workout -> Paused -> Finished -> Start
// (B.27/B.28) genom att koppla ihop passgeneratorn med useTimer.
export function useWorkout() {
  const [screen, setScreen] = useState<Screen>("start");
  const [pendingSettings, setPendingSettings] = useState<WorkoutSettings | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ljud på/av avgörs av inställningen som gällde när passet skapades
  // (workout.settings), eftersom det inte finns någon inställningsdialog
  // synlig under själva passet.
  const { playNewBlock, playCountdown, playFinish } = useAudio(workout?.settings.soundEnabled ?? true);

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

  function start(settings: WorkoutSettings) {
    // Måste ske synkront här, i själva knapptryckningen, annars förblir
    // ljudet permanent avstängt på mobila webbläsare (se lib/audio.ts).
    // Låset gäller för resten av sessionen, så det behöver inte upprepas
    // när passet faktiskt startar efter uppvärmningsskärmen.
    if (settings.soundEnabled) {
      unlockAudioContext();
    }

    setError(null);
    setPendingSettings(settings);
    setScreen("warmup");
  }

  function beginWorkout() {
    if (screen !== "warmup" || !pendingSettings) return;

    try {
      setWorkout(generateWorkout(pendingSettings));
      setScreen("workout");
    } catch {
      // Appen ska försöka återhämta sig innan ett felmeddelande visas (D.7).
      try {
        setWorkout(generateWorkout(pendingSettings));
        setScreen("workout");
      } catch {
        setError("Kunde inte skapa ett pass just nu. Försök igen.");
        setPendingSettings(null);
        setScreen("start");
      }
    }
  }

  function cancelWarmup() {
    if (screen !== "warmup") return;
    setPendingSettings(null);
    setScreen("start");
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
    beginWorkout,
    cancelWarmup,
    pause,
    resume,
    stop,
    skip,
    goToStart,
  };
}
