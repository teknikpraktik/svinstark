"use client";

import { useEffect } from "react";
import { releaseWakeLock, requestWakeLock } from "@/lib/wakeLock";

// Håller skärmen vaken så länge `active` är true. Webbläsaren släpper
// automatiskt låset när fliken göms (t.ex. användaren byter app), så vi
// begär det på nytt när fliken blir synlig igen medan passet fortfarande
// pågår.
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    requestWakeLock();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [active]);
}
