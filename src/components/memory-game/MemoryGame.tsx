"use client";

import { useEffect, useRef } from "react";
import { Board } from "@/components/memory-game/Board/Board";
import { ControlBar } from "@/components/memory-game/ControlBar/ControlBar";
import { GameResult } from "@/components/memory-game/GameResult/GameResult";
import { Scoreboard } from "@/components/memory-game/Scoreboard/Scoreboard";
import { StartScreen } from "@/components/memory-game/StartScreen/StartScreen";
import { useGameSound } from "@/hooks/memory-game/useGameSound";
import { useHighScores } from "@/hooks/memory-game/useHighScores";
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
  const sound = useGameSound(state.isSoundEnabled);
  const { saveScore, getTopScores } = useHighScores();
  const previousRef = useRef({
    status: state.status,
    matchedCount: state.matchedTileIds.length,
    selectedCount: state.selectedTileIds.length,
  });
  const recordedWinRef = useRef(false);

  useEffect(() => {
    if (state.status === "won" && !recordedWinRef.current) {
      recordedWinRef.current = true;
      saveScore({
        difficulty: state.difficulty,
        score: state.score,
        attempts: state.attempts,
      });
    }

    if (state.status !== "won") {
      recordedWinRef.current = false;
    }
  }, [saveScore, state.attempts, state.difficulty, state.score, state.status]);

  useEffect(() => {
    const previous = previousRef.current;

    if (state.selectedTileIds.length > previous.selectedCount) {
      sound.playFlip();
    }

    if (state.matchedTileIds.length > previous.matchedCount) {
      sound.playMatch();
    }

    if (
      previous.status === "checking" &&
      state.status === "playing" &&
      state.matchedTileIds.length === previous.matchedCount
    ) {
      sound.playMismatch();
    }

    if (state.status === "won" && previous.status !== "won") {
      sound.playWin();
    }

    if (state.status === "lost" && previous.status !== "lost") {
      sound.playLoss();
    }

    previousRef.current = {
      status: state.status,
      matchedCount: state.matchedTileIds.length,
      selectedCount: state.selectedTileIds.length,
    };
  }, [
    sound,
    state.matchedTileIds.length,
    state.selectedTileIds.length,
    state.status,
  ]);

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
          highScores={getTopScores(state.difficulty)}
          onDifficultyChange={setDifficulty}
          onStart={() => {
            sound.playClick();
            startGame();
          }}
          onToggleSound={toggleSound}
        />
      ) : (
        <div className={styles.playArea}>
          <Scoreboard state={state} />
          <ControlBar
            isSoundEnabled={state.isSoundEnabled}
            restartDisabled={isRestarting || state.isPaused}
            onRestart={() => {
              sound.playClick();
              restartGame();
            }}
            onExit={() => {
              sound.playClick();
              exitGame();
            }}
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
                onPlayAgain={() => {
                  sound.playClick();
                  restartGame();
                }}
                onChangeDifficulty={() => {
                  sound.playClick();
                  exitGame();
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
