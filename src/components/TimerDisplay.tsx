import { formatTime } from "@/utils/formatTime";
import styles from "./TimerDisplay.module.css";

interface TimerDisplayProps {
  seconds: number;
  totalSeconds: number;
}

const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Ringen visar andelen tid kvar av det aktuella blocket (helkrets vid start,
// halv krets vid halva tiden) och töms medsols, som en vanlig pie-timer.
export default function TimerDisplay({ seconds, totalSeconds }: TimerDisplayProps) {
  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, seconds / totalSeconds)) : 0;
  const dashoffset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className={styles.wrapper}>
      <svg className={styles.ring} viewBox="0 0 200 200">
        <circle className={styles.track} cx="100" cy="100" r={RADIUS} />
        <circle
          className={styles.progress}
          cx="100"
          cy="100"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className={styles.timer}>{formatTime(seconds)}</div>
    </div>
  );
}
