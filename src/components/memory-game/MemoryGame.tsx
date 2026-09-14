"use client";

import { Board } from "@/components/memory-game/Board/Board";
import { StartScreen } from "@/components/memory-game/StartScreen/StartScreen";
import { useMemoryGame } from "@/hooks/memory-game/useMemoryGame";
import styles from "./MemoryGame.module.css";

export function MemoryGame() {
  const {
    state,
    startGame,
    selectTile,
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
        <div className={styles.playArea}>
          <Board
            tiles={state.tiles}
            difficulty={state.difficulty}
            status={state.status}
            isPaused={state.isPaused}
            onSelectTile={selectTile}
          />
        </div>
      )}
    </div>
  );
}
