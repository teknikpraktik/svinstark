import styles from "./WorkoutProgress.module.css";

interface WorkoutProgressProps {
  current: number;
  total: number;
}

// Diskret indikator för vilken övning i passet användaren är på. Ska aldrig
// konkurrera visuellt med den stora TimerDisplay-komponenten eller ExerciseCard.
export default function WorkoutProgress({ current, total }: WorkoutProgressProps) {
  return (
    <p className={styles.progress}>
      Övning {current} av {total}
    </p>
  );
}
