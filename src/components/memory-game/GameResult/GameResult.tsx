"use client";

import { useEffect, useRef } from "react";
import styles from "./GameResult.module.css";

export interface GameResultProps {
  outcome: "won" | "lost";
  score: number;
  attempts: number;
  maxAttempts: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export function GameResult({
  outcome,
  score,
  attempts,
  maxAttempts,
  onPlayAgain,
  onChangeDifficulty,
}: GameResultProps) {
  const isWin = outcome === "won";
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-result-title"
      aria-describedby="game-result-stats"
    >
      <div className={styles.panel}>
        <h2 id="game-result-title" className={styles.title}>
          {isWin ? "You Won!" : "Game Over"}
        </h2>
        <p id="game-result-stats" className={styles.stats}>
          Score: {score}
          <br />
          Attempts: {attempts}
          {!isWin ? ` / ${maxAttempts}` : null}
        </p>
        <div className={styles.actions}>
          <button
            ref={primaryRef}
            type="button"
            className={styles.primary}
            onClick={onPlayAgain}
          >
            {isWin ? "Play Again" : "Try Again"}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={onChangeDifficulty}
          >
            Change Difficulty
          </button>
        </div>
      </div>
    </div>
  );
}
