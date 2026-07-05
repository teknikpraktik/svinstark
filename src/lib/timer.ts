import type { TimerState, Workout, WorkoutBlock, WorkoutSegment } from "@/types/workout";

const TICK_INTERVAL_MS = 250;

// Härleder vilket segment (t.ex. under uppvärmning/nedvarvning) som är
// aktuellt just nu, utifrån hur mycket av blocket som redan förflutit.
export function getCurrentSegment(block: WorkoutBlock, remainingSeconds: number): WorkoutSegment | undefined {
  if (!block.segments) return undefined;

  const elapsedSeconds = block.duration - remainingSeconds;
  return block.segments.find(
    (segment) => elapsedSeconds >= segment.startSecond && elapsedSeconds < segment.endSecond
  );
}

export interface ExerciseProgress {
  current: number;
  total: number;
}

// Vilken övning (inte uppvärmning/nedvarvning) det aktuella blocket är, av
// det totala antalet övningar i passet. Returnerar null utanför träningsfasen
// - uppvärmning och nedvarvning har inget "övning X av Y" att visa.
export function getExerciseProgress(
  blocks: WorkoutBlock[],
  currentBlockIndex: number
): ExerciseProgress | null {
  if (blocks[currentBlockIndex]?.phase !== "exercise") return null;

  const total = blocks.filter((block) => block.phase === "exercise").length;
  const current = blocks
    .slice(0, currentBlockIndex + 1)
    .filter((block) => block.phase === "exercise").length;

  return { current, total };
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
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    if (remainingSeconds === this.state.remainingSeconds) return;

    const isNewCountdownSecond = remainingSeconds >= 1 && remainingSeconds <= 3;
    this.state = { ...this.state, remainingSeconds };
    if (isNewCountdownSecond) {
      this.callbacks.onCountdown?.(remainingSeconds);
    }
    this.emit();
  }

  private emit(): void {
    this.callbacks.onTick?.(this.getState());
  }
}
