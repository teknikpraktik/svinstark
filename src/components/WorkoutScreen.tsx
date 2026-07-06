import ExerciseCard from "@/components/ExerciseCard";
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
  onPause: () => void;
  onStop: () => void;
}

export default function WorkoutScreen({
  blocks,
  block,
  settings,
  timerState,
  onPause,
  onStop,
}: WorkoutScreenProps) {
  const exerciseProgress = getExerciseProgress(blocks, timerState.currentBlock);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.summary}>Total längd: {durationMinutes[settings.duration]} min</p>
        <p className={styles.summary}>Intensitet: {intensityLabels[settings.intensity]}</p>
      </div>

      <TimerDisplay seconds={timerState.remainingSeconds} />

      <div className={styles.content}>
        <ExerciseCard name={block.exercise.name} instruction={block.exercise.instruction} />
        <WorkoutProgress current={exerciseProgress.current} total={exerciseProgress.total} />
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
