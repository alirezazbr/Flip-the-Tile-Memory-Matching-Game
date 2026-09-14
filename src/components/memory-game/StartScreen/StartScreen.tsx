import { DifficultySelector } from "@/components/memory-game/DifficultySelector/DifficultySelector";
import type { Difficulty } from "@/types/memory-game";
import styles from "./StartScreen.module.css";

export interface StartScreenProps {
  difficulty: Difficulty;
  isSoundEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
  onToggleSound: () => void;
}

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

        <DifficultySelector
          value={difficulty}
          onChange={onDifficultyChange}
        />

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
