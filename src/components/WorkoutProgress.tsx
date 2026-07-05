import { formatTime } from "@/utils/formatTime";
import styles from "./WorkoutProgress.module.css";

interface WorkoutProgressProps {
  remainingSeconds: number;
}

// Diskret indikator för hur mycket tid som återstår av HELA passet.
// Ska aldrig konkurrera visuellt med den stora TimerDisplay-komponenten.
// Ingen memo här (till skillnad från ExerciseCard/PhaseBadge) eftersom
// remainingSeconds ändras varje sekund - memoisering skulle inte göra nytta.
export default function WorkoutProgress({ remainingSeconds }: WorkoutProgressProps) {
  return <p className={styles.progress}>{formatTime(remainingSeconds)} kvar</p>;
}
