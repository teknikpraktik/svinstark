import styles from "./OptionSelector.module.css";

interface OptionSelectorOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
}

interface OptionSelectorProps<T extends string> {
  label: string;
  options: OptionSelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionSelectorProps<T>) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      <div className={styles.row}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.option} ${
              value === option.value ? styles.optionActive : ""
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {option.sublabel && <span className={styles.sublabel}>{option.sublabel}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
