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

  const { announceExercise, playNextExercise, playCountdown, playFinish } = useAudio(soundEnabled);

  const handleFinish = useCallback(() => {
    playFinish();
    setScreen("finished");
  }, [playFinish]);

  // Vid övningsbyte läses "next exercise" upp följt av den nya övningens namn.
  // Blockindexet slås upp mot workout här (timern känner bara till index).
  const handleBlockChange = useCallback(
    (blockIndex: number) => {
      const name = workout?.blocks[blockIndex]?.exercise.name;
      if (name) playNextExercise(name);
    },
    [workout, playNextExercise]
  );

  const timerCallbacks = useMemo(
    () => ({ onFinish: handleFinish, onBlockChange: handleBlockChange, onCountdown: playCountdown }),
    [handleFinish, handleBlockChange, playCountdown]
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

    let generated: Workout;
    try {
      generated = generateWorkout(settings);
    } catch {
      // Appen ska försöka återhämta sig innan ett felmeddelande visas (D.7).
      try {
        generated = generateWorkout(settings);
      } catch {
        setError("Kunde inte skapa ett pass just nu. Försök igen.");
        setScreen("start");
        return;
      }
    }

    setWorkout(generated);
    setScreen("workout");

    // Läs upp första övningens namn direkt (synkront i knapptryckningen, precis
    // efter upplåsningen ovan - annars vägrar iOS läsa upp något). Resten av
    // övningarnas namn läses upp vid respektive övningsbyte (handleBlockChange).
    const firstExerciseName = generated.blocks[0]?.exercise.name;
    if (firstExerciseName) announceExercise(firstExerciseName);
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
