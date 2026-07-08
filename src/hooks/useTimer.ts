"use client";

import { useEffect, useRef, useState } from "react";
import { WorkoutTimer } from "@/lib/timer";
import type { TimerState, Workout } from "@/types/workout";

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
  // Sätts direkt från passets första block istället för 0, annars hinner
  // TimerDisplay-ringen rendera en tom cirkel (fraction 0) innan timerns
  // egen start()-emit rättar till det ett ögonblick senare.
  const [timerState, setTimerState] = useState<TimerState>(() => ({
    currentBlock: 0,
    remainingSeconds: workout?.blocks[0]?.duration ?? 0,
    isRunning: false,
    isPaused: false,
  }));
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
    skip: () => timerRef.current?.skip(),
  };
}
