"use client";

import { StartScreen } from "@/components/memory-game/StartScreen/StartScreen";
import { useMemoryGame } from "@/hooks/memory-game/useMemoryGame";
import styles from "./MemoryGame.module.css";

export function MemoryGame() {
  const {
    state,
    startGame,
    setDifficulty,
    toggleSound,
  } = useMemoryGame();

  return (
    <div className={styles.root}>
      {state.status === "idle" ? (
        <StartScreen
          difficulty={state.difficulty}
          isSoundEnabled={state.isSoundEnabled}
          onDifficultyChange={setDifficulty}
          onStart={startGame}
          onToggleSound={toggleSound}
        />
      ) : (
        <div className={styles.placeholder} role="status">
          <p>Game started ({state.difficulty}). Board UI comes next.</p>
          <p>
            Tiles: {state.tiles.length} · Attempts: {state.attempts}/
            {state.maxAttempts}
          </p>
        </div>
      )}
    </div>
  );
}
