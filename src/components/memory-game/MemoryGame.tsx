"use client";

import { Board } from "@/components/memory-game/Board/Board";
import { ControlBar } from "@/components/memory-game/ControlBar/ControlBar";
import { GameResult } from "@/components/memory-game/GameResult/GameResult";
import { Scoreboard } from "@/components/memory-game/Scoreboard/Scoreboard";
import { StartScreen } from "@/components/memory-game/StartScreen/StartScreen";
import { useMemoryGame } from "@/hooks/memory-game/useMemoryGame";
import { isTerminalStatus } from "@/lib/memory-game/game";
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

  const statusMessage =
    state.status === "won"
      ? "You won the game."
      : state.status === "lost"
        ? "Game over. Attempts exhausted."
        : state.status === "checking"
          ? "Checking selected tiles."
          : isRestarting
            ? "Restarting board."
            : "";

  return (
    <div className={styles.root}>
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>
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
          <div className={styles.boardShell}>
            <Board
              tiles={state.tiles}
              difficulty={state.difficulty}
              status={state.status}
              isPaused={state.isPaused || isRestarting}
              onSelectTile={selectTile}
            />
            {isTerminalStatus(state.status) ? (
              <GameResult
                outcome={state.status}
                score={state.score}
                attempts={state.attempts}
                maxAttempts={state.maxAttempts}
                onPlayAgain={restartGame}
                onChangeDifficulty={exitGame}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
