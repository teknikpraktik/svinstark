"use client";

import { useSyncExternalStore } from "react";
import type { FreeWeightsLevel, WorkoutDuration, WorkoutIntensity, WorkoutSettings } from "@/types/workout";

const STORAGE_KEY = "svinstark:settings";

const DEFAULT_SETTINGS: WorkoutSettings = {
  duration: "standard",
  intensity: "normal",
  soundEnabled: true,
  hasChair: true,
  hasPullupBar: true,
  freeWeights: "none",
};

let cachedSettings: WorkoutSettings = DEFAULT_SETTINGS;
let hasReadFromStorage = false;
const listeners = new Set<() => void>();

function parseDuration(value: unknown): WorkoutDuration {
  return value === "short" || value === "standard" || value === "long"
    ? value
    : DEFAULT_SETTINGS.duration;
}

// Migrerar bort den borttagna intensiteten Lugnt: ett tidigare sparat
// "calm"-värde (liksom alla andra ogiltiga värden) blir "normal". Endast
// "normal" och "hard" kan läsas in, och eftersom setIntensity bara tar emot
// WorkoutIntensity kan inget annat sparas igen.
function parseIntensity(value: unknown): WorkoutIntensity {
  return value === "normal" || value === "hard" ? value : DEFAULT_SETTINGS.intensity;
}

function parseFreeWeights(value: unknown): FreeWeightsLevel {
  return value === "none" || value === "light" || value === "heavy"
    ? value
    : DEFAULT_SETTINGS.freeWeights;
}

// Validerar allt som läses från localStorage fält för fält, så att gamla
// eller manipulerade lagrade värden aldrig kan ge appen ett ogiltigt
// tillstånd. Exporterad för valideringsskriptet (scripts/auditExerciseBank.ts).
export function sanitizeStoredSettings(parsed: Partial<Record<keyof WorkoutSettings, unknown>>): WorkoutSettings {
  return {
    duration: parseDuration(parsed.duration),
    intensity: parseIntensity(parsed.intensity),
    soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
    hasChair: typeof parsed.hasChair === "boolean" ? parsed.hasChair : DEFAULT_SETTINGS.hasChair,
    hasPullupBar: typeof parsed.hasPullupBar === "boolean" ? parsed.hasPullupBar : DEFAULT_SETTINGS.hasPullupBar,
    freeWeights: parseFreeWeights(parsed.freeWeights),
  };
}

function readFromStorage(): WorkoutSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    return sanitizeStoredSettings(JSON.parse(raw) as Partial<Record<keyof WorkoutSettings, unknown>>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getSnapshot(): WorkoutSettings {
  if (!hasReadFromStorage) {
    cachedSettings = readFromStorage();
    hasReadFromStorage = true;
  }
  return cachedSettings;
}

function getServerSnapshot(): WorkoutSettings {
  return DEFAULT_SETTINGS;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function setStoredSettings(next: WorkoutSettings): void {
  cachedSettings = next;
  hasReadFromStorage = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

// Lagrar endast senast valda träningstid, intensitet, ljud på/av och
// tillgänglig utrustning (C.28). Ingen träningshistorik sparas.
// useSyncExternalStore läser localStorage utan hydreringskrock mot
// serverrendering (server får alltid DEFAULT_SETTINGS).
export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function update(updater: (prev: WorkoutSettings) => WorkoutSettings) {
    setStoredSettings(updater(settings));
  }

  return {
    settings,
    setDuration: (duration: WorkoutDuration) => update((prev) => ({ ...prev, duration })),
    setIntensity: (intensity: WorkoutIntensity) => update((prev) => ({ ...prev, intensity })),
    setSoundEnabled: (soundEnabled: boolean) => update((prev) => ({ ...prev, soundEnabled })),
    setHasChair: (hasChair: boolean) => update((prev) => ({ ...prev, hasChair })),
    setHasPullupBar: (hasPullupBar: boolean) => update((prev) => ({ ...prev, hasPullupBar })),
    setFreeWeights: (freeWeights: FreeWeightsLevel) => update((prev) => ({ ...prev, freeWeights })),
  };
}
