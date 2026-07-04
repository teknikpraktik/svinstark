import { ReactNode } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  icon: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function IconButton({
  icon,
  ariaLabel,
  onClick,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}
