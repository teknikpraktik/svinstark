"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import IconButton from "@/components/IconButton";
import styles from "./InstallPrompt.module.css";

const DISMISSED_KEY = "svinstark:install-prompt-dismissed";

// Chrome/Edge (Android och desktop) skjuter upp sin egen installdialog och
// skickar detta event istället, så att sidan kan visa en egen knapp och
// trigga dialogen senare via prompt(). Standardtypad saknas i lib.dom.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function isStandaloneDisplay(): boolean {
  const isNavigatorStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia("(display-mode: standalone)").matches || isNavigatorStandalone === true;
}

function isIOSDevice(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function noopSubscribe() {
  return () => {};
}

function getServerSnapshotFalse() {
  return false;
}

// Läser localStorage/navigator/matchMedia - inget av det finns under SSR, och
// ingetdera ändras reaktivt utifrån under sidans livstid, så en tom subscribe
// räcker (useSyncExternalStore, samma mönster som useSettings.ts, undviker
// hydreringskrock genom att alltid rendera "false" på servern).
function useClientSnapshot(getSnapshot: () => boolean): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshotFalse);
}

// Självständig komponent utan props: avgör helt själv om, och vilken variant
// av, installationsinformationen som ska visas. Döljs permanent (localStorage)
// om användaren stänger den, och visas aldrig när appen redan körs som
// installerad PWA (C.28/D.7-stil beteende, se docs/loggbok.md).
export default function InstallPrompt() {
  const initiallyVisible = useClientSnapshot(
    () => !isStandaloneDisplay() && window.localStorage.getItem(DISMISSED_KEY) !== "true"
  );
  const isIOS = useClientSnapshot(isIOSDevice);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!initiallyVisible || manuallyDismissed) return null;

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setManuallyDismissed(true);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  }

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <p className={styles.title}>Installera Svinstark</p>
        <IconButton icon="×" ariaLabel="Stäng installationsinformation" onClick={dismiss} />
      </div>

      <p className={styles.text}>
        Lägg Svinstark på hemskärmen för snabbare start och en bättre appupplevelse.
      </p>

      {deferredPrompt ? (
        <button className={styles.installButton} onClick={handleInstall}>
          Lägg till på hemskärmen
        </button>
      ) : isIOS ? (
        <p className={styles.text}>
          Tryck på <strong>Dela</strong>-ikonen i Safari och välj <strong>Lägg till på hemskärmen</strong>.
        </p>
      ) : (
        <p className={styles.text}>Lägg till appen via webbläsarens meny.</p>
      )}
    </div>
  );
}
