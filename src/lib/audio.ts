// Ljudsignalerna genereras som korta, diskreta toner med Web Audio API
// istället för ljudfiler, i linje med att MVP inte ska bero på externa
// tillgångar (00-principer.md §6). Signaler enligt C.19: nytt block,
// sista tre sekunderna, pass klart. Ljud ska aldrig kännas stressande (§14
// i 05-designprinciper.md), därför korta toner med mjuk attack/release.

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(context: AudioContext, frequency: number, durationSeconds: number, startDelay = 0): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const startTime = context.currentTime + startDelay;
  const endTime = startTime + durationSeconds;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime);
}

// Måste anropas synkront inifrån en riktig användarinteraktion (t.ex. en
// click-handler), inte senare från en timer-callback. Mobila webbläsare
// (särskilt iOS Safari) håller annars AudioContext pausad permanent -
// context.resume() räcker inte där, ett ljud måste faktiskt starta inom
// själva knapptryckningen. Spelar en tyst, momentan ton för att "låsa upp"
// ljudet för resten av passet.
export function unlockAudioContext(): void {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  gain.gain.value = 0;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.001);
}

// Avslutar 3-2-1-nedräkningen (playCountdownBeep) precis som ett
// skidskyttestarts sista, ljusare ton - högre än nedräkningens pip, inte
// lägre, så det känns som en startsignal snarare än en nedtoning.
export function playNewBlockSound(): void {
  const context = getAudioContext();
  if (!context) return;
  playTone(context, 1567.98, 0.2);
}

export function playCountdownBeep(): void {
  const context = getAudioContext();
  if (!context) return;
  playTone(context, 880, 0.08);
}

export function playFinishSound(): void {
  const context = getAudioContext();
  if (!context) return;
  playTone(context, 523.25, 0.15, 0);
  playTone(context, 659.25, 0.15, 0.15);
  playTone(context, 783.99, 0.25, 0.3);
}
