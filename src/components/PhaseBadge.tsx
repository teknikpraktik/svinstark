import type { WorkoutPhase } from "@/types/workout";
import styles from "./PhaseBadge.module.css";

interface PhaseBadgeProps {
  phase: WorkoutPhase;
}

const phaseLabels: Record<WorkoutPhase, string> = {
  warmup: "Uppvärmning",
  exercise: "Träning",
  cooldown: "Nedvarvning",
};

export default function PhaseBadge({ phase }: PhaseBadgeProps) {
  return <span className={styles.badge}>{phaseLabels[phase]}</span>;
}
