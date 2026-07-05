import Modal from "@/components/Modal";
import OptionSelector from "@/components/OptionSelector";
import PrimaryButton from "@/components/PrimaryButton";
import packageJson from "../../package.json";
import styles from "./SettingsDialog.module.css";

const soundOptions: { value: "on" | "off"; label: string }[] = [
  { value: "on", label: "På" },
  { value: "off", label: "Av" },
];

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
}

export default function SettingsDialog({
  isOpen,
  onClose,
  soundEnabled,
  onSoundEnabledChange,
}: SettingsDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.title}>Inställningar</h2>

      <OptionSelector
        label="Ljud"
        options={soundOptions}
        value={soundEnabled ? "on" : "off"}
        onChange={(value) => onSoundEnabledChange(value === "on")}
      />

      <p className={styles.version}>Version {packageJson.version}</p>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
