"use client";

import { Board } from "@/components/memory-game/Board/Board";
import { ControlBar } from "@/components/memory-game/ControlBar/ControlBar";
import { Scoreboard } from "@/components/memory-game/Scoreboard/Scoreboard";
import { StartScreen } from "@/components/memory-game/StartScreen/StartScreen";
import { useMemoryGame } from "@/hooks/memory-game/useMemoryGame";
import styles from "./MemoryGame.module.css";

export function MemoryGame() {
  const {
    state,
    isRestarting,
    startGame,
    selectTile,
    restartGame,
    exitGame,
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
          <Scoreboard state={state} />
          <ControlBar
            isSoundEnabled={state.isSoundEnabled}
            restartDisabled={isRestarting || state.isPaused}
            onRestart={restartGame}
            onExit={exitGame}
            onToggleSound={toggleSound}
          />
          <Board
            tiles={state.tiles}
            difficulty={state.difficulty}
            status={state.status}
            isPaused={state.isPaused || isRestarting}
            onSelectTile={selectTile}
          />
        </div>
      )}
    </div>
  );
}
