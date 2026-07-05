import ExerciseCard from "@/components/ExerciseCard";
import PhaseBadge from "@/components/PhaseBadge";
import TimerDisplay from "@/components/TimerDisplay";
import WorkoutProgress from "@/components/WorkoutProgress";
import { getCurrentSegment, getTotalRemainingSeconds } from "@/lib/timer";
import type { TimerState, WorkoutBlock } from "@/types/workout";
import styles from "./WorkoutScreen.module.css";

interface WorkoutScreenProps {
  blocks: WorkoutBlock[];
  block: WorkoutBlock;
  timerState: TimerState;
  onPause: () => void;
  onStop: () => void;
}

export default function WorkoutScreen({ blocks, block, timerState, onPause, onStop }: WorkoutScreenProps) {
  const displayed =
    block.phase === "exercise" && block.exercise
      ? { name: block.exercise.name, instruction: block.exercise.instruction }
      : toDisplayedSegment(getCurrentSegment(block, timerState.remainingSeconds));

  const totalRemainingSeconds = getTotalRemainingSeconds(
    blocks,
    timerState.currentBlock,
    timerState.remainingSeconds
  );

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <PhaseBadge phase={block.phase} />
        <WorkoutProgress remainingSeconds={totalRemainingSeconds} />
      </div>

      <TimerDisplay seconds={timerState.remainingSeconds} />

      <div className={styles.content}>
        {displayed && <ExerciseCard name={displayed.name} instruction={displayed.instruction} />}
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
