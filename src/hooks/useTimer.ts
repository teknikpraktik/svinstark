"use client";

import { useEffect, useRef, useState } from "react";
import { WorkoutTimer } from "@/lib/timer";
import type { TimerState, Workout } from "@/types/workout";

const INITIAL_STATE: TimerState = {
  currentBlock: 0,
  remainingSeconds: 0,
  isRunning: false,
  isPaused: false,
};

// Kopplar WorkoutTimer (ingen React-logik) till React-state. Timern startar
// automatiskt så fort ett workout ges, och stoppas/städas bort när det
// tas bort eller byts ut. All state uppdateras uteslutande via timerns
// egna callbacks (onTick), aldrig direkt i effektens kropp.
export function useTimer(workout: Workout | null, onFinish?: () => void) {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_STATE);
  const timerRef = useRef<WorkoutTimer | null>(null);

  useEffect(() => {
    if (!workout) return;

    const timer = new WorkoutTimer(workout, {
      onTick: setTimerState,
      onFinish: () => onFinish?.(),
    });
    timerRef.current = timer;
    timer.start();

    return () => {
      timer.stop();
      timerRef.current = null;
    };
  }, [workout, onFinish]);

  return {
    timerState,
    pause: () => timerRef.current?.pause(),
    resume: () => timerRef.current?.resume(),
    stop: () => timerRef.current?.stop(),
  };
}
