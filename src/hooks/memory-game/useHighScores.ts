"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  commitHighScore,
  getHighScoreServerSnapshot,
  getHighScoreSnapshot,
  subscribeHighScores,
} from "@/lib/memory-game/highScores";
import type { Difficulty, HighScore } from "@/types/memory-game";

export function useHighScores() {
  const scores = useSyncExternalStore(
    subscribeHighScores,
    getHighScoreSnapshot,
    getHighScoreServerSnapshot,
  );

  const saveScore = useCallback(
    (entry: Omit<HighScore, "date"> & { date?: string }) => {
      commitHighScore({
        ...entry,
        date: entry.date ?? new Date().toISOString(),
      });
    },
    [],
  );

  const getTopScores = useCallback(
    (difficulty: Difficulty) => scores[difficulty],
    [scores],
  );

  return {
    scores,
    saveScore,
    getTopScores,
  };
}
