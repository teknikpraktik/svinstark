import Modal from "@/components/Modal";
import OptionSelector from "@/components/OptionSelector";
import PrimaryButton from "@/components/PrimaryButton";
import packageJson from "../../package.json";
import styles from "./SettingsDialog.module.css";

const soundOptions: { value: "on" | "off"; label: string }[] = [
  { value: "on", label: "På" },
  { value: "off", label: "Av" },
];

const equipmentOptions: { value: "yes" | "no"; label: string }[] = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nej" },
];

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
  hasChair: boolean;
  onHasChairChange: (hasChair: boolean) => void;
  hasPullupBar: boolean;
  onHasPullupBarChange: (hasPullupBar: boolean) => void;
}

export default function SettingsDialog({
  isOpen,
  onClose,
  soundEnabled,
  onSoundEnabledChange,
  hasChair,
  onHasChairChange,
  hasPullupBar,
  onHasPullupBarChange,
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

      <OptionSelector
        label="Stol/pall"
        options={equipmentOptions}
        value={hasChair ? "yes" : "no"}
        onChange={(value) => onHasChairChange(value === "yes")}
      />

      <OptionSelector
        label="Chinsstång"
        options={equipmentOptions}
        value={hasPullupBar ? "yes" : "no"}
        onChange={(value) => onHasPullupBarChange(value === "yes")}
      />

      <p className={styles.version}>Version {packageJson.version}</p>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
