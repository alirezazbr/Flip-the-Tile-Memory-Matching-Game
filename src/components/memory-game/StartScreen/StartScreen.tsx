import { DIFFICULTIES } from "@/lib/memory-game/constants";
import type { Difficulty } from "@/types/memory-game";
import styles from "./StartScreen.module.css";

export interface StartScreenProps {
  difficulty: Difficulty;
  isSoundEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
  onToggleSound: () => void;
}

const DIFFICULTY_OPTIONS = Object.values(DIFFICULTIES);

export function StartScreen({
  difficulty,
  isSoundEnabled,
  onDifficultyChange,
  onStart,
  onToggleSound,
}: StartScreenProps) {
  return (
    <section className={styles.screen} aria-labelledby="memory-flip-title">
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Memory game</p>
        <h1 id="memory-flip-title" className={styles.title}>
          Memory Flip
        </h1>
        <p className={styles.instructions}>
          Flip two tiles at a time and find every matching pair before you run
          out of attempts.
        </p>

        <fieldset className={styles.difficulty}>
          <legend className={styles.difficultyLegend}>Difficulty</legend>
          <div
            className={styles.difficultyOptions}
            role="radiogroup"
            aria-label="Select difficulty"
          >
            {DIFFICULTY_OPTIONS.map((option) => {
              const selected = option.id === difficulty;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={
                    selected
                      ? `${styles.difficultyOption} ${styles.difficultyOptionSelected}`
                      : styles.difficultyOption
                  }
                  onClick={() => onDifficultyChange(option.id)}
                >
                  <span className={styles.difficultyLabel}>{option.label}</span>
                  <span className={styles.difficultyMeta}>
                    {option.rows} × {option.columns}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <button type="button" className={styles.startButton} onClick={onStart}>
          Start
        </button>

        <button
          type="button"
          className={styles.soundToggle}
          onClick={onToggleSound}
          aria-pressed={isSoundEnabled}
          aria-label={isSoundEnabled ? "Sound on" : "Sound off"}
        >
          Sound {isSoundEnabled ? "On" : "Off"}
        </button>
      </div>
    </section>
  );
}
