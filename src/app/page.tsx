"use client";

import FinishedScreen from "@/components/FinishedScreen";
import StartScreen from "@/components/StartScreen";
import WorkoutScreen from "@/components/WorkoutScreen";
import { useSettings } from "@/hooks/useSettings";
import { useWorkout } from "@/hooks/useWorkout";
import { unlockAudioContext } from "@/lib/audio";
import { unlockVoice } from "@/lib/voice";

export default function Home() {
  const {
    settings,
    setDuration,
    setIntensity,
    setSoundEnabled,
    setHasChair,
    setHasPullupBar,
    setFreeWeights,
  } = useSettings();
  const {
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
  } = useWorkout(settings.soundEnabled);

  if (screen === "start") {
    return (
      <StartScreen
        settings={settings}
        error={error}
        onDurationChange={setDuration}
        onIntensityChange={setIntensity}
        onHasChairChange={setHasChair}
        onHasPullupBarChange={setHasPullupBar}
        onFreeWeightsChange={setFreeWeights}
        onStart={() => start(settings)}
      />
    );
  }

  if (screen === "finished") {
    if (!workout) return null;
    return <FinishedScreen settings={workout.settings} onGoToStart={goToStart} />;
  }

  if (!currentBlock || !workout) return null;

  return (
    <WorkoutScreen
      blocks={workout.blocks}
      block={currentBlock}
      settings={workout.settings}
      timerState={timerState}
      soundEnabled={settings.soundEnabled}
      isPaused={screen === "paused"}
      onPause={pause}
      onResume={resume}
      onStop={stop}
      onSkip={skip}
      onSoundEnabledChange={(soundEnabled) => {
        // Måste låsas upp här också (inte bara vid passets start i
        // useWorkout.start()): om ljudet var avstängt när passet startade
        // och användaren slår på det med ikonen mitt i passet är detta den
        // enda riktiga knapptryckning webbläsaren har att låsa upp
        // AudioContext och rösten med (se lib/audio.ts och lib/voice.ts).
        // Utan dessa anrop förblir
        // ljudet tyst resten av passet på mobila webbläsare, trots att
        // inställningen visar "på".
        if (soundEnabled) {
          unlockAudioContext();
          unlockVoice();
        }
        setSoundEnabled(soundEnabled);
      }}
    />
  );
}
