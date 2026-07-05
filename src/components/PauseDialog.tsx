import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import styles from "./PauseDialog.module.css";

interface PauseDialogProps {
  isOpen: boolean;
  onResume: () => void;
  onStop: () => void;
}

export default function PauseDialog({ isOpen, onResume, onStop }: PauseDialogProps) {
  return (
    <Modal isOpen={isOpen}>
      <h2 className={styles.title}>Paus</h2>
      <PrimaryButton onClick={onResume}>Fortsätt</PrimaryButton>
      <button className={styles.stopButton} onClick={onStop}>
        Avsluta
      </button>
    </Modal>
  );
}
