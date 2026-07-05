// Håller mobilskärmen vaken under ett pass via Screen Wake Lock API.
// Stöds inte i alla webbläsare (t.ex. äldre Safari) - misslyckas då tyst,
// vilket bara innebär att skärmen kan dimmas som vanligt (ingen krasch).
let wakeLockSentinel: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<void> {
  if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

  try {
    wakeLockSentinel = await navigator.wakeLock.request("screen");
  } catch {
    // T.ex. om fliken inte är synlig just då. Inte kritiskt.
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (!wakeLockSentinel) return;

  try {
    await wakeLockSentinel.release();
  } catch {
    // Redan släppt eller kunde inte släppas. Inte kritiskt.
  } finally {
    wakeLockSentinel = null;
  }
}
