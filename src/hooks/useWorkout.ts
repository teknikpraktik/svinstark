"use client";

import { useCallback, useState } from "react";
import { generateWorkout } from "@/lib/workoutGenerator";
import { useTimer } from "@/hooks/useTimer";
import type { Screen, Workout, WorkoutSettings } from "@/types/workout";

// Orkestrerar skärmflödet Start -> Workout -> Paused -> Finished -> Start
// (B.27/B.28) genom att koppla ihop passgeneratorn med useTimer.
export function useWorkout() {
  const [screen, setScreen] = useState<Screen>("start");
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = useCallback(() => setScreen("finished"), []);
  const { timerState, pause: pauseTimer, resume: resumeTimer, stop: stopTimer } = useTimer(
    workout,
    handleFinish
  );

  function start(settings: WorkoutSettings) {
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
  // (B.28: paus kan ske från uppvärmning/övning/nedvarvning, aldrig från
  // start eller finished). Hooken skyddar övergångarna själv istället för
  // att lita på att UI:t bara anropar dem vid rätt tillfälle.
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
