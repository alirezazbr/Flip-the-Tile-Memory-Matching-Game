import { DIFFICULTIES } from "@/lib/memory-game/constants";
import type { Difficulty } from "@/types/memory-game";
import styles from "./DifficultySelector.module.css";

export interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_OPTIONS = Object.values(DIFFICULTIES);

export function DifficultySelector({
  value,
  onChange,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <fieldset className={styles.root} disabled={disabled}>
      <legend className={styles.legend}>Difficulty</legend>
      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Select difficulty"
        aria-disabled={disabled || undefined}
      >
        {DIFFICULTY_OPTIONS.map((option) => {
          const selected = option.id === value;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              className={
                selected
                  ? `${styles.option} ${styles.optionSelected}`
                  : styles.option
              }
              onClick={() => onChange(option.id)}
            >
              <span className={styles.label}>{option.label}</span>
              <span className={styles.meta}>
                {option.rows} × {option.columns}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
