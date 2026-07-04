import styles from "./PhaseBadge.module.css";

type Phase = "warmup" | "exercise" | "cooldown";

interface PhaseBadgeProps {
  phase: Phase;
}

const phaseLabels: Record<Phase, string> = {
  warmup: "Uppvärmning",
  exercise: "Träning",
  cooldown: "Nedvarvning",
};

export default function PhaseBadge({ phase }: PhaseBadgeProps) {
  return <span className={styles.badge}>{phaseLabels[phase]}</span>;
}
