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

export interface UseTimerCallbacks {
  onFinish?: () => void;
  onBlockChange?: (blockIndex: number) => void;
  onCountdown?: (remainingSeconds: number) => void;
}

// Kopplar WorkoutTimer (ingen React-logik) till React-state. Timern startar
// automatiskt så fort ett workout ges, och stoppas/städas bort när det
// tas bort eller byts ut. All state uppdateras uteslutande via timerns
// egna callbacks (onTick), aldrig direkt i effektens kropp.
export function useTimer(workout: Workout | null, callbacks: UseTimerCallbacks = {}) {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_STATE);
  const timerRef = useRef<WorkoutTimer | null>(null);

  useEffect(() => {
    if (!workout) return;

    const timer = new WorkoutTimer(workout, {
      onTick: setTimerState,
      onBlockChange: callbacks.onBlockChange,
      onCountdown: callbacks.onCountdown,
      onFinish: callbacks.onFinish,
    });
    timerRef.current = timer;
    timer.start();

    return () => {
      timer.stop();
      timerRef.current = null;
    };
  }, [workout, callbacks]);

  return {
    timerState,
    pause: () => timerRef.current?.pause(),
    resume: () => timerRef.current?.resume(),
    stop: () => timerRef.current?.stop(),
  };
}
