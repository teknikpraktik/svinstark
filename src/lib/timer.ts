import type { TimerState, Workout, WorkoutBlock } from "@/types/workout";

const TICK_INTERVAL_MS = 250;

export interface ExerciseProgress {
  current: number;
  total: number;
}

// Vilken övning det aktuella blocket är, av det totala antalet övningar i
// passet (alla block är övningar sedan uppvärmning/nedvarvning togs bort).
export function getExerciseProgress(
  blocks: WorkoutBlock[],
  currentBlockIndex: number
): ExerciseProgress {
  return { current: currentBlockIndex + 1, total: blocks.length };
}

export interface WorkoutTimerCallbacks {
  onTick?: (state: TimerState) => void;
  onBlockChange?: (blockIndex: number) => void;
  onCountdown?: (remainingSeconds: number) => void;
  onFinish?: () => void;
}

// Timern arbetar endast med ett Workout (02-teknisk-specifikation.md B.25) och
// känner inte till React. Den räknar mot en absolut deadline (Date.now()-baserad)
// istället för att bara räkna ned steg för steg, så att korrekt återstående tid
// bevaras även om appen hamnar i bakgrunden och intervallet fördröjs (D.11).
export class WorkoutTimer {
  private readonly blockDurationsSeconds: number[];
  private readonly callbacks: WorkoutTimerCallbacks;
  private state: TimerState;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private blockDeadline = 0;
  private remainingMsWhenPaused = 0;

  constructor(workout: Workout, callbacks: WorkoutTimerCallbacks = {}) {
    this.blockDurationsSeconds = workout.blocks.map((block) => block.duration);
    this.callbacks = callbacks;
    this.state = {
      currentBlock: 0,
      remainingSeconds: this.blockDurationsSeconds[0] ?? 0,
      isRunning: false,
      isPaused: false,
    };
  }

  getState(): TimerState {
    return { ...this.state };
  }

  start(): void {
    if (this.state.isRunning || this.blockDurationsSeconds.length === 0) return;

    this.blockDeadline = Date.now() + this.blockDurationsSeconds[this.state.currentBlock] * 1000;
    this.state = { ...this.state, isRunning: true, isPaused: false };
    this.beginTicking();
    this.emit();
  }

  pause(): void {
    if (!this.state.isRunning) return;

    this.remainingMsWhenPaused = Math.max(0, this.blockDeadline - Date.now());
    this.stopTicking();
    this.state = {
      ...this.state,
      isRunning: false,
      isPaused: true,
      remainingSeconds: Math.ceil(this.remainingMsWhenPaused / 1000),
    };
    this.emit();
  }

  resume(): void {
    if (!this.state.isPaused) return;

    this.blockDeadline = Date.now() + this.remainingMsWhenPaused;
    this.state = { ...this.state, isRunning: true, isPaused: false };
    this.beginTicking();
    this.emit();
  }

  stop(): void {
    this.stopTicking();
    this.state = { ...this.state, isRunning: false, isPaused: false };
    this.emit();
  }

  // Hoppar direkt till nästa block med dess fulla tid, till skillnad från
  // tick()'s katch-up-logik (som skjuter fram deadline kumulativt för att
  // hålla wall-clock-schemat efter bakgrundsfördröjning). Ett skip är en
  // explicit, engångs-handling just nu - nästa block ska få hela sin tid
  // räknat från detta ögonblick, inte från när det "borde" ha startat.
  // Anropar avsiktligt inte onBlockChange (som triggar skidstart-tonen) -
  // ett skip ska vara tyst, bara nästa övning ska starta.
  skip(): void {
    if (!this.state.isRunning) return;

    const isLastBlock = this.state.currentBlock >= this.blockDurationsSeconds.length - 1;
    if (isLastBlock) {
      this.stopTicking();
      this.state = { ...this.state, remainingSeconds: 0, isRunning: false, isPaused: false };
      this.emit();
      this.callbacks.onFinish?.();
      return;
    }

    const nextBlock = this.state.currentBlock + 1;
    this.blockDeadline = Date.now() + this.blockDurationsSeconds[nextBlock] * 1000;
    this.state = { ...this.state, currentBlock: nextBlock, remainingSeconds: this.blockDurationsSeconds[nextBlock] };
    this.emit();
  }

  private beginTicking(): void {
    this.stopTicking();
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS);
  }

  private stopTicking(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    let remainingMs = this.blockDeadline - Date.now();

    while (remainingMs <= 0) {
      const isLastBlock = this.state.currentBlock >= this.blockDurationsSeconds.length - 1;
      if (isLastBlock) {
        this.stopTicking();
        this.state = { ...this.state, remainingSeconds: 0, isRunning: false, isPaused: false };
        this.emit();
        this.callbacks.onFinish?.();
        return;
      }

      const nextBlock = this.state.currentBlock + 1;
      this.blockDeadline += this.blockDurationsSeconds[nextBlock] * 1000;
      this.state = { ...this.state, currentBlock: nextBlock };
      this.callbacks.onBlockChange?.(nextBlock);
      remainingMs = this.blockDeadline - Date.now();
    }

    // TICK_INTERVAL_MS är tätare än en hel sekund (för precision kring
    // block-/nedräkningsgränser), men det visade värdet är avrundat till hela
    // sekunder. Uppdatera state (och trigga en rendering) bara när det visade
    // värdet faktiskt ändras, för att undvika onödiga renderingar (A.10/C.29).
    const previousSeconds = this.state.remainingSeconds;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    if (remainingSeconds === previousSeconds) return;

    this.state = { ...this.state, remainingSeconds };

    // Normalt minskar remainingSeconds med exakt 1 per tick (250 ms-
    // intervallet är fyra gånger tätare än en sekund), men en bakgrundad
    // flik eller en fördröjd tick (t.ex. vid tunga renderingar) kan hoppa
    // över ett eller flera sekundvärden. Utan den här loopen kunde en sådan
    // hopp tysta ett eller flera av 3-2-1-pipen helt - de spelas nu upp i
    // snabb följd istället för att tappas bort.
    for (let second = Math.min(previousSeconds - 1, 3); second >= Math.max(remainingSeconds, 1); second--) {
      this.callbacks.onCountdown?.(second);
    }
    this.emit();
  }

  private emit(): void {
    this.callbacks.onTick?.(this.getState());
  }
}
