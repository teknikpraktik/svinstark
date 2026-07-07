import { ReactNode } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  icon: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "default" | "large";
}

export default function IconButton({
  icon,
  ariaLabel,
  onClick,
  disabled = false,
  size = "default",
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${size === "large" ? styles.large : ""}`}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}
