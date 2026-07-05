"use client";

import { useState } from "react";
import IconButton from "@/components/IconButton";
import OptionSelector from "@/components/OptionSelector";
import PrimaryButton from "@/components/PrimaryButton";
import SettingsDialog from "@/components/SettingsDialog";
import type { WorkoutDuration, WorkoutIntensity, WorkoutSettings } from "@/types/workout";
import styles from "./StartScreen.module.css";

const trainingTimes: { value: WorkoutDuration; label: string; sublabel: string }[] = [
  { value: "short", label: "Kortare", sublabel: "9 min" },
  { value: "standard", label: "Standard", sublabel: "16 min" },
  { value: "long", label: "Längre", sublabel: "23 min" },
];

const intensities: { value: WorkoutIntensity; label: string }[] = [
  { value: "calm", label: "Lugnt" },
  { value: "normal", label: "Normalt" },
  { value: "hard", label: "Tufft" },
];

const valueProps = ["Helkropp", "Tidseffektivt", "Regelstyrt"];

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.43.7.7 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z" />
    </svg>
  );
}

interface StartScreenProps {
  settings: WorkoutSettings;
  error: string | null;
  onDurationChange: (duration: WorkoutDuration) => void;
  onIntensityChange: (intensity: WorkoutIntensity) => void;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
  onStart: () => void;
}

export default function StartScreen({
  settings,
  error,
  onDurationChange,
  onIntensityChange,
  onSoundEnabledChange,
  onStart,
}: StartScreenProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <IconButton
          icon={<SettingsIcon />}
          ariaLabel="Inställningar"
          onClick={() => setIsSettingsOpen(true)}
        />
      </header>

      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/monogram.png" alt="" width={56} height={56} className={styles.monogram} />

        <p className={styles.wordmark}>svinstark</p>

        <h1 className={styles.headline}>Kroppen svarar på signaler, inte på träningstid.</h1>
        <p className={styles.slogan}>Den minsta effektiva dosen</p>

        <p className={styles.explanation}>
          Styrka och funktion utvecklas när muskler, senor, skelett och nervsystem regelbundet får
          en tydlig träningsstimulans. Svinstark levererar den minsta effektiva dosen genom korta,
          balanserade helkroppspass.
        </p>

        <ul className={styles.valueProps}>
          {valueProps.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>

      <div className={styles.choices}>
        <OptionSelector
          label="Träningstid"
          options={trainingTimes}
          value={settings.duration}
          onChange={onDurationChange}
        />
        <OptionSelector
          label="Intensitet"
          options={intensities}
          value={settings.intensity}
          onChange={onIntensityChange}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <PrimaryButton onClick={onStart}>STARTA PASS</PrimaryButton>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={settings.soundEnabled}
        onSoundEnabledChange={onSoundEnabledChange}
      />
    </div>
  );
}
