import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
  name: string;
  instruction: string;
}

export default function ExerciseCard({ name, instruction }: ExerciseCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.instruction}>{instruction}</p>
    </div>
  );
}
