import { memo } from "react";
import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
  name: string;
  instruction: string;
}

// Memoiserad eftersom WorkoutScreen (föräldern) renderas om varje sekund via
// timern, medan namn/instruktion bara ändras vid block-/segmentbyten (A.10).
function ExerciseCard({ name, instruction }: ExerciseCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.instruction}>{instruction}</p>
    </div>
  );
}

export default memo(ExerciseCard);
