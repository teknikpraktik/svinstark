"use client";

import { useSyncExternalStore } from "react";
import type { WorkoutDuration, WorkoutIntensity, WorkoutSettings } from "@/types/workout";

const STORAGE_KEY = "svinstark:settings";

const DEFAULT_SETTINGS: WorkoutSettings = {
  duration: "standard",
  intensity: "normal",
  soundEnabled: true,
};

let cachedSettings: WorkoutSettings = DEFAULT_SETTINGS;
let hasReadFromStorage = false;
const listeners = new Set<() => void>();

function readFromStorage(): WorkoutSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<WorkoutSettings>;
    return {
      duration: parsed.duration ?? DEFAULT_SETTINGS.duration,
      intensity: parsed.intensity ?? DEFAULT_SETTINGS.intensity,
      soundEnabled: parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
    };
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

// Lagrar endast senast valda träningstid, intensitet och ljud på/av (C.28).
// Ingen träningshistorik sparas. useSyncExternalStore läser localStorage
// utan hydreringskrock mot serverrendering (server får alltid DEFAULT_SETTINGS).
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
  };
}
