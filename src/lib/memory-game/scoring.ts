import {
  COMPLETION_BONUS,
  MATCH_SCORE,
  MISMATCH_PENALTY,
} from "@/lib/memory-game/constants";

export type ScoreEvent = "match" | "mismatch" | "complete";

export const SCORE_VALUES = {
  match: MATCH_SCORE,
  mismatch: MISMATCH_PENALTY,
  complete: COMPLETION_BONUS,
} as const;

/**
 * Deterministic score update. Score never goes below zero.
 */
export function calculateScore(currentScore: number, event: ScoreEvent): number {
  switch (event) {
    case "match":
      return currentScore + MATCH_SCORE;
    case "mismatch":
      return Math.max(0, currentScore - MISMATCH_PENALTY);
    case "complete":
      return currentScore + COMPLETION_BONUS;
  }
}
