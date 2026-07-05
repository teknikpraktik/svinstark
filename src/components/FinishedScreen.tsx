import PrimaryButton from "@/components/PrimaryButton";
import styles from "./FinishedScreen.module.css";

interface FinishedScreenProps {
  onGoToStart: () => void;
}

export default function FinishedScreen({ onGoToStart }: FinishedScreenProps) {
  return (
    <div className={styles.screen}>
      <p className={styles.message}>Klart!</p>
      <PrimaryButton onClick={onGoToStart}>Till start</PrimaryButton>
    </div>
  );
}
