import PrimaryButton from "@/components/PrimaryButton";
import styles from "./WarmupScreen.module.css";

interface WarmupScreenProps {
  onReady: () => void;
  onCancel: () => void;
}

export default function WarmupScreen({ onReady, onCancel }: WarmupScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>Valfri uppvärmning</h1>
        <p className={styles.message}>Värm upp på det sätt som passar dig.</p>
      </div>

      <div className={styles.actions}>
        <PrimaryButton onClick={onReady}>JAG ÄR UPPVÄRMD</PrimaryButton>
        <button className={styles.cancelButton} onClick={onCancel}>
          Tillbaka
        </button>
      </div>
    </div>
  );
}
