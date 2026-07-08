import ExerciseCard from "@/components/ExerciseCard";
import IconButton from "@/components/IconButton";
import TimerDisplay from "@/components/TimerDisplay";
import WorkoutProgress from "@/components/WorkoutProgress";
import { durationMinutes, intensityLabels } from "@/data/workoutLabels";
import { getExerciseProgress } from "@/lib/timer";
import type { TimerState, WorkoutBlock, WorkoutSettings } from "@/types/workout";
import styles from "./WorkoutScreen.module.css";

interface WorkoutScreenProps {
  blocks: WorkoutBlock[];
  block: WorkoutBlock;
  settings: WorkoutSettings;
  timerState: TimerState;
  soundEnabled: boolean;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
}

export default function WorkoutScreen({
  blocks,
  block,
  settings,
  timerState,
  soundEnabled,
  onPause,
  onStop,
  onSkip,
  onSoundEnabledChange,
}: WorkoutScreenProps) {
  const exerciseProgress = getExerciseProgress(blocks, timerState.currentBlock);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.summary}>Total längd: {durationMinutes[settings.duration]} min</p>
          <p className={styles.summary}>Intensitet: {intensityLabels[settings.intensity]}</p>
        </div>
        <div className={styles.soundButton}>
          <IconButton
            icon={soundEnabled ? "🔊" : "🔇"}
            ariaLabel={soundEnabled ? "Stäng av ljud" : "Sätt på ljud"}
            onClick={() => onSoundEnabledChange(!soundEnabled)}
            size="large"
          />
        </div>
      </div>

      <TimerDisplay seconds={timerState.remainingSeconds} totalSeconds={block.duration} />

      <div className={styles.content}>
        <ExerciseCard name={block.exercise.name} instruction={block.exercise.instruction} />
        <WorkoutProgress current={exerciseProgress.current} total={exerciseProgress.total} />
      </div>

      <div className={styles.skipRow}>
        <button className={styles.skipButton} onClick={onSkip}>
          Hoppa över
        </button>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={onPause}>
          Paus
        </button>
        <button className={styles.actionButton} onClick={onStop}>
          Avsluta
        </button>
      </div>
    </div>
  );
}
