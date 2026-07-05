import ExerciseCard from "@/components/ExerciseCard";
import PhaseBadge from "@/components/PhaseBadge";
import TimerDisplay from "@/components/TimerDisplay";
import WorkoutProgress from "@/components/WorkoutProgress";
import { durationMinutes, intensityLabels } from "@/data/workoutLabels";
import { getCurrentSegment, getExerciseProgress } from "@/lib/timer";
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
  const displayed =
    block.phase === "exercise" && block.exercise
      ? { name: block.exercise.name, instruction: block.exercise.instruction }
      : toDisplayedSegment(getCurrentSegment(block, timerState.remainingSeconds));

  const exerciseProgress = getExerciseProgress(blocks, timerState.currentBlock);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.summary}>Total längd: {durationMinutes[settings.duration]} min</p>
        <p className={styles.summary}>Intensitet: {intensityLabels[settings.intensity]}</p>
        <PhaseBadge phase={block.phase} />
      </div>

      <TimerDisplay seconds={timerState.remainingSeconds} />

      <div className={styles.content}>
        {displayed && <ExerciseCard name={displayed.name} instruction={displayed.instruction} />}
        {exerciseProgress && (
          <WorkoutProgress current={exerciseProgress.current} total={exerciseProgress.total} />
        )}
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

function toDisplayedSegment(segment: ReturnType<typeof getCurrentSegment>) {
  if (!segment) return null;
  return { name: segment.title, instruction: segment.instruction };
}
