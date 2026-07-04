import { ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${fullWidth ? styles.fullWidth : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
