"use client";

import FinishedScreen from "@/components/FinishedScreen";
import PauseDialog from "@/components/PauseDialog";
import StartScreen from "@/components/StartScreen";
import WarmupScreen from "@/components/WarmupScreen";
import WorkoutScreen from "@/components/WorkoutScreen";
import { useSettings } from "@/hooks/useSettings";
import { useWorkout } from "@/hooks/useWorkout";

export default function Home() {
  const { settings, setDuration, setIntensity, setSoundEnabled, setHasChair, setHasPullupBar } =
    useSettings();
  const {
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
    goToStart,
  } = useWorkout();

  if (screen === "start") {
    return (
      <StartScreen
        settings={settings}
        error={error}
        onDurationChange={setDuration}
        onIntensityChange={setIntensity}
        onSoundEnabledChange={setSoundEnabled}
        onHasChairChange={setHasChair}
        onHasPullupBarChange={setHasPullupBar}
        onStart={() => start(settings)}
      />
    );
  }

  if (screen === "warmup") {
    return <WarmupScreen onReady={beginWorkout} onCancel={cancelWarmup} />;
  }

  if (screen === "finished") {
    return <FinishedScreen onGoToStart={goToStart} />;
  }

  if (!currentBlock || !workout) return null;

  return (
    <>
      <WorkoutScreen
        blocks={workout.blocks}
        block={currentBlock}
        settings={workout.settings}
        timerState={timerState}
        onPause={pause}
        onStop={stop}
      />
      <PauseDialog isOpen={screen === "paused"} onResume={resume} onStop={stop} />
    </>
  );
}
