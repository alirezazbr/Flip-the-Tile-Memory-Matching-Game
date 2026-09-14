"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  MISMATCH_FLIP_BACK_DELAY_MS,
  RESTART_REVEAL_DELAY_MS,
} from "@/lib/memory-game/constants";
import { createGameTiles, isMatch } from "@/lib/memory-game/game";
import {
  createInitialGameState,
  gameReducer,
} from "@/lib/memory-game/reducer";
import type { Difficulty } from "@/types/memory-game";

export function useMemoryGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );
  const [isRestarting, setIsRestarting] = useState(false);

  const stateRef = useRef(state);
  const sessionIdRef = useRef(0);
  const timerIdsRef = useRef<Set<number>>(new Set());
  const handledSelectionRef = useRef<string | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearTimers = useCallback(() => {
    for (const timerId of timerIdsRef.current) {
      window.clearTimeout(timerId);
    }
    timerIdsRef.current.clear();
  }, []);

  const invalidateSession = useCallback(() => {
    clearTimers();
    sessionIdRef.current += 1;
    handledSelectionRef.current = null;
    return sessionIdRef.current;
  }, [clearTimers]);

  const schedule = useCallback(
    (sessionId: number, delayMs: number, callback: () => void) => {
      const timerId = window.setTimeout(() => {
        timerIdsRef.current.delete(timerId);
        if (sessionId !== sessionIdRef.current) {
          return;
        }
        callback();
      }, delayMs);

      timerIdsRef.current.add(timerId);
      return timerId;
    },
    [],
  );

  useEffect(() => {
    return () => {
      clearTimers();
      sessionIdRef.current += 1;
    };
  }, [clearTimers]);

  useEffect(() => {
    if (state.status !== "checking" || state.selectedTileIds.length !== 2) {
      if (state.status !== "checking") {
        handledSelectionRef.current = null;
      }
      return;
    }

    const [firstId, secondId] = state.selectedTileIds;
    const selectionKey = `${firstId}:${secondId}`;

    if (handledSelectionRef.current === selectionKey) {
      return;
    }

    const firstTile = state.tiles.find((tile) => tile.id === firstId);
    const secondTile = state.tiles.find((tile) => tile.id === secondId);

    if (!firstTile || !secondTile) {
      return;
    }

    handledSelectionRef.current = selectionKey;

    if (isMatch(firstTile, secondTile)) {
      dispatch({
        type: "MATCH_TILES",
        tileIds: [firstId, secondId],
      });
      return;
    }

    const sessionId = sessionIdRef.current;
    schedule(sessionId, MISMATCH_FLIP_BACK_DELAY_MS, () => {
      dispatch({
        type: "FLIP_TILES_BACK",
        tileIds: [firstId, secondId],
      });
    });
  }, [schedule, state.selectedTileIds, state.status, state.tiles]);

  const startGame = useCallback(() => {
    setIsRestarting(false);
    invalidateSession();
    dispatch({ type: "START_GAME" });
  }, [invalidateSession]);

  const selectTile = useCallback(
    (tileId: string) => {
      if (isRestarting) {
        return;
      }
      dispatch({ type: "SELECT_TILE", tileId });
    },
    [isRestarting],
  );

  const restartGame = useCallback(() => {
    const current = stateRef.current;

    if (isRestarting || current.status === "idle" || current.tiles.length === 0) {
      return;
    }

    setIsRestarting(true);
    const sessionId = invalidateSession();
    dispatch({ type: "REVEAL_ALL_TILES" });

    schedule(sessionId, RESTART_REVEAL_DELAY_MS, () => {
      const tiles = createGameTiles(stateRef.current.difficulty);
      dispatch({ type: "RESTART_GAME", tiles });
      setIsRestarting(false);
    });
  }, [invalidateSession, isRestarting, schedule]);

  const exitGame = useCallback(() => {
    setIsRestarting(false);
    invalidateSession();
    dispatch({ type: "EXIT_GAME" });
  }, [invalidateSession]);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: "SET_DIFFICULTY", difficulty });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: "TOGGLE_SOUND" });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: "TOGGLE_PAUSE" });
  }, []);

  return {
    state,
    isRestarting,
    startGame,
    selectTile,
    restartGame,
    exitGame,
    setDifficulty,
    toggleSound,
    togglePause,
  };
}
