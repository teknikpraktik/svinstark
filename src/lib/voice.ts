// Röstuppläsning under passet: övningens namn när den börjar, nedräkningen
// ("thirty", "ten", "five" ... "one"), "next exercise" följt av nästa övnings
// namn vid övningsbyte och "workout complete" när passet är slut. Målet är att
// hela passet ska gå att köra utan att titta på mobilen. Använder webbläsarens
// inbyggda Web Speech API istället för inspelade
// ljudfiler, av samma skäl som tonerna i audio.ts genereras med Web Audio API:
// MVP ska inte bero på externa tillgångar (00-principer.md §6) och appen ska
// fungera offline utan nedladdade resurser.
//
// Rösten är engelsk: övningsnamnen är engelska (se exerciseData.ts) och
// siffrorna är korta och entydiga på engelska. Engelska röster finns dessutom
// installerade på i praktiken alla plattformar (svenska röster saknas ofta på
// icke-svenska enheter).

// Bara de sekunder timern faktiskt signalerar (COUNTDOWN_CUE_SECONDS i
// lib/timer.ts) - en sekund utan ord faller tillbaka på pipljudet.
const NUMBER_WORDS: Record<number, string> = {
  30: "thirty",
  10: "ten",
  5: "five",
  4: "four",
  3: "three",
  2: "two",
  1: "one",
};

// Web Speech API exponerar inget kön på rösterna, så kvinnorösten måste
// gissas fram ur namnet. Listan är de vanligaste kvinnorösterna på macOS/iOS
// (Samantha, Karen, Moira...), Windows (Zira, Hazel, Aria...) och
// Android/Chrome (Google UK English Female m.fl.).
const FEMALE_VOICE_NAMES = [
  "samantha",
  "karen",
  "moira",
  "tessa",
  "fiona",
  "serena",
  "victoria",
  "allison",
  "ava",
  "susan",
  "joanna",
  "salli",
  "zira",
  "hazel",
  "aria",
  "jenny",
  "michelle",
  "sonia",
  "libby",
  "clara",
  "catherine",
];

let cachedVoice: SpeechSynthesisVoice | null = null;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();

  let score = 0;
  if (name.includes("female")) score += 4;
  else if (FEMALE_VOICE_NAMES.some((femaleName) => name.includes(femaleName))) score += 3;

  // En lokalt installerad röst hinner svara direkt och fungerar utan nät -
  // avgörande när ordet ska ligga på rätt sekund i en nedräkning.
  if (voice.localService) score += 1;

  return score;
}

// Röstlistan är tom vid första anropet i flera webbläsare (den fylls i
// asynkront och signaleras med voiceschanged), därför cachas valet först när
// det faktiskt finns röster att välja bland.
function pickVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;

  const englishVoices = synth.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (englishVoices.length === 0) return null;

  const best = englishVoices.reduce((bestSoFar, voice) =>
    scoreVoice(voice) > scoreVoice(bestSoFar) ? voice : bestSoFar
  );

  cachedVoice = best;
  return best;
}

function speak(text: string): void {
  const synth = getSynth();
  if (!synth) return;

  // En fördröjd tick kan skicka två siffror tätt inpå varandra (se timer.ts).
  // Utan detta läggs de i kö och rösten hamnar efter nedräkningen - nu vinner
  // alltid den senaste siffran. Villkoret finns för att cancel() på en tom kö
  // kan låsa uppläsningen i Chrome.
  if (synth.speaking || synth.pending) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(synth);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-US";
  }
  // Något långsammare än normaltempo för ett lugnt, tydligt intryck - ljud ska
  // aldrig kännas stressande (05-designprinciper.md §14). Fortfarande snabbt nog
  // att varje nedräkningssiffra hinner klart innan nästa sekund.
  utterance.rate = 0.9;

  synth.speak(utterance);
}

export function isVoiceAvailable(): boolean {
  return getSynth() !== null;
}

// Motsvarigheten till unlockAudioContext() i audio.ts: måste anropas synkront
// inifrån en riktig användarinteraktion, annars vägrar iOS Safari läsa upp
// något senare från en timer-callback. Läser upp ett blanktecken, vilket är
// ohörbart men räknas som en uppläsning och låser upp rösten för sessionen.
export function unlockVoice(): void {
  const synth = getSynth();
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(" ");
  utterance.volume = 0;
  synth.speak(utterance);

  // Röstlistan hinner sällan bli klar innan första nedräkningen om den inte
  // efterfrågas tidigt - det här anropet triggar laddningen redan vid start.
  pickVoice(synth);
}

// Returnerar false när sekunden inte har något ord eller rösten inte finns, så
// att anroparen kan falla tillbaka på pipljudet i audio.ts.
export function speakCountdown(remainingSeconds: number): boolean {
  const word = NUMBER_WORDS[remainingSeconds];
  if (!word || !isVoiceAvailable()) return false;

  speak(word);
  return true;
}

// Läser upp övningens namn när den startar.
export function speakExerciseName(name: string): boolean {
  if (!isVoiceAvailable()) return false;

  speak(name);
  return true;
}

// Övningsbyte: "Next exercise" följt av nästa övnings namn. Läses upp som EN
// enda utterance - speak() avbryter (cancel:ar) alltid en pågående uppläsning,
// så två separata anrop hade tystat "Next exercise" innan namnet hann läsas.
export function speakNextExercise(name: string): boolean {
  if (!isVoiceAvailable()) return false;

  speak(`Next exercise. ${name}`);
  return true;
}

// Läses upp när passet är slut (efter sista övningen).
export function speakWorkoutComplete(): boolean {
  if (!isVoiceAvailable()) return false;

  speak("Workout complete.");
  return true;
}

export function cancelVoice(): void {
  const synth = getSynth();
  if (!synth) return;
  if (synth.speaking || synth.pending) synth.cancel();
}
