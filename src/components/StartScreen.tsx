"use client";

import { useState } from "react";
import AboutModal from "@/components/AboutModal";
import IconButton from "@/components/IconButton";
import InstallPrompt from "@/components/InstallPrompt";
import OptionSelector from "@/components/OptionSelector";
import PrimaryButton from "@/components/PrimaryButton";
import {
  durationLabels,
  durationMinutes,
  durationOrder,
  freeWeightsLabels,
  freeWeightsOrder,
  intensityLabels,
  intensityOrder,
} from "@/data/workoutLabels";
import type { FreeWeightsLevel, WorkoutDuration, WorkoutIntensity, WorkoutSettings } from "@/types/workout";
import styles from "./StartScreen.module.css";

const trainingTimes = durationOrder.map((value) => ({
  value,
  label: durationLabels[value],
  sublabel: `${durationMinutes[value]} min`,
}));

const intensities = intensityOrder.map((value) => ({
  value,
  label: intensityLabels[value],
}));

const freeWeightOptions = freeWeightsOrder.map((value) => ({
  value,
  label: freeWeightsLabels[value],
}));

const equipmentOptions = [
  { value: "yes" as const, label: "Ja" },
  { value: "no" as const, label: "Nej" },
];

const valueProps = ["Helkropp", "Tidseffektivt", "Regelstyrt"];

interface StartScreenProps {
  settings: WorkoutSettings;
  error: string | null;
  onDurationChange: (duration: WorkoutDuration) => void;
  onIntensityChange: (intensity: WorkoutIntensity) => void;
  onSoundEnabledChange: (soundEnabled: boolean) => void;
  onHasChairChange: (hasChair: boolean) => void;
  onHasPullupBarChange: (hasPullupBar: boolean) => void;
  onFreeWeightsChange: (freeWeights: FreeWeightsLevel) => void;
  onStart: () => void;
}

export default function StartScreen({
  settings,
  error,
  onDurationChange,
  onIntensityChange,
  onSoundEnabledChange,
  onHasChairChange,
  onHasPullupBarChange,
  onFreeWeightsChange,
  onStart,
}: StartScreenProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <IconButton
          icon="ⓘ"
          ariaLabel="Om Svinstark"
          onClick={() => setIsAboutOpen(true)}
        />
        <IconButton
          icon={settings.soundEnabled ? "🔊" : "🔇"}
          ariaLabel={settings.soundEnabled ? "Stäng av ljud" : "Sätt på ljud"}
          onClick={() => onSoundEnabledChange(!settings.soundEnabled)}
        />
      </header>

      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/monogram.png" alt="" width={56} height={56} className={styles.monogram} />

        <p className={styles.wordmark}>svinstark</p>

        <h1 className={styles.headline}>Kroppen svarar på signaler, inte på träningstid.</h1>

        <p className={styles.explanation}>
          Den minsta effektiva dosen: korta, balanserade helkroppspass som ger kroppen tydlig
          träningsstimulans.
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

        <div className={styles.equipment}>
          <span className={styles.equipmentLabel}>Utrustning</span>
          <OptionSelector
            label="Chinsstång"
            options={equipmentOptions}
            value={settings.hasPullupBar ? "yes" : "no"}
            onChange={(value) => onHasPullupBarChange(value === "yes")}
          />
          <OptionSelector
            label="Stol/pall"
            options={equipmentOptions}
            value={settings.hasChair ? "yes" : "no"}
            onChange={(value) => onHasChairChange(value === "yes")}
          />
          <OptionSelector
            label="Fria vikter"
            options={freeWeightOptions}
            value={settings.freeWeights}
            onChange={onFreeWeightsChange}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <PrimaryButton onClick={onStart}>STARTA PASS</PrimaryButton>

      <InstallPrompt />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
