import { memo } from "react";
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

// Memoiserad av samma anledning som ExerciseCard: föräldern renderas om
// varje sekund, fasen ändras bara vid blockbyten.
function PhaseBadge({ phase }: PhaseBadgeProps) {
  return <span className={styles.badge}>{phaseLabels[phase]}</span>;
}

export default memo(PhaseBadge);
