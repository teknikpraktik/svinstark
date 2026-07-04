import { formatTime } from "@/utils/formatTime";
import styles from "./TimerDisplay.module.css";

interface TimerDisplayProps {
  seconds: number;
}

export default function TimerDisplay({ seconds }: TimerDisplayProps) {
  return <div className={styles.timer}>{formatTime(seconds)}</div>;
}
