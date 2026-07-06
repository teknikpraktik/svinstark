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

  const { timerState, pause: pauseTimer, resume: resumeTimer, stop: stopTimer } = useTimer(
    workout,
    timerCallbacks
  );

  // Skärmen ska inte dimmas/släckas så länge ett pass pågår, även vid paus.
  useWakeLock(workout !== null);

  function start(settings: WorkoutSettings) {
    // Måste ske synkront här, i själva knapptryckningen, annars förblir
    // ljudet permanent avstängt på mobila webbläsare (se lib/audio.ts).
    if (settings.soundEnabled) {
      unlockAudioContext();
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
    stopTimer();
    setWorkout(null);
    setScreen("start");
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
    goToStart,
  };
}
