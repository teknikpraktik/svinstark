"use client";

import { useState } from "react";
import styles from "./page.module.css";

type TrainingTime = "short" | "standard" | "long";
type Intensity = "calm" | "normal" | "hard";

const trainingTimes: { value: TrainingTime; label: string }[] = [
  { value: "short", label: "Kortare" },
  { value: "standard", label: "Standard" },
  { value: "long", label: "Längre" },
];

const intensities: { value: Intensity; label: string }[] = [
  { value: "calm", label: "Lugnt" },
  { value: "normal", label: "Normalt" },
  { value: "hard", label: "Tufft" },
];

export default function Home() {
  const [trainingTime, setTrainingTime] = useState<TrainingTime>("standard");
  const [intensity, setIntensity] = useState<Intensity>("normal");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.settingsButton} aria-label="Inställningar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.43.7.7 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z" />
          </svg>
        </button>
      </header>

      <div className={styles.hero}>
        <h1 className={styles.title}>svinstark</h1>
        <p className={styles.slogan}>Den minsta effektiva dosen</p>
      </div>

      <div className={styles.choices}>
        <div className={styles.choiceGroup}>
          <span className={styles.choiceLabel}>Träningstid</span>
          <div className={styles.optionRow}>
            {trainingTimes.map((option) => (
              <button
                key={option.value}
                className={`${styles.option} ${
                  trainingTime === option.value ? styles.optionActive : ""
                }`}
                onClick={() => setTrainingTime(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.choiceGroup}>
          <span className={styles.choiceLabel}>Intensitet</span>
          <div className={styles.optionRow}>
            {intensities.map((option) => (
              <button
                key={option.value}
                className={`${styles.option} ${
                  intensity === option.value ? styles.optionActive : ""
                }`}
                onClick={() => setIntensity(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className={styles.startButton}>STARTA PASS</button>
    </div>
  );
}
