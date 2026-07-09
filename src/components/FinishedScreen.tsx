import PrimaryButton from "@/components/PrimaryButton";
import { durationMinutes, intensityLabels } from "@/data/workoutLabels";
import type { WorkoutSettings } from "@/types/workout";
import styles from "./FinishedScreen.module.css";

interface FinishedScreenProps {
  settings: WorkoutSettings;
  onGoToStart: () => void;
}

export default function FinishedScreen({ settings, onGoToStart }: FinishedScreenProps) {
  return (
    <div className={styles.screen}>
      <p className={styles.message}>Klart!</p>
      <div className={styles.summary}>
        <p>Träningstid: {durationMinutes[settings.duration]} min</p>
        <p>Intensitet: {intensityLabels[settings.intensity]}</p>
      </div>
      <PrimaryButton onClick={onGoToStart}>Till start</PrimaryButton>
    </div>
  );
}
