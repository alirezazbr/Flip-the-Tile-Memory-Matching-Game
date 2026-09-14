import { HIGH_SCORES_STORAGE_KEY } from "@/lib/memory-game/constants";
import type { Difficulty, HighScore } from "@/types/memory-game";

export type HighScoreBoard = Record<Difficulty, HighScore[]>;

const MAX_SCORES_PER_DIFFICULTY = 5;

let cachedBoard: HighScoreBoard = {
  easy: [],
  medium: [],
  hard: [],
};
let hasLoadedFromStorage = false;
const listeners = new Set<() => void>();

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function isHighScore(value: unknown): value is HighScore {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<HighScore>;
  return (
    isDifficulty(entry.difficulty) &&
    typeof entry.score === "number" &&
    typeof entry.attempts === "number" &&
    typeof entry.date === "string"
  );
}

export function createEmptyHighScoreBoard(): HighScoreBoard {
  return {
    easy: [],
    medium: [],
    hard: [],
  };
}

export function parseHighScores(raw: string | null): HighScoreBoard {
  if (!raw) {
    return createEmptyHighScoreBoard();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return createEmptyHighScoreBoard();
    }

    const board = createEmptyHighScoreBoard();
    for (const difficulty of Object.keys(board) as Difficulty[]) {
      const list = (parsed as Record<string, unknown>)[difficulty];
      if (!Array.isArray(list)) {
        continue;
      }
      board[difficulty] = list
        .filter(isHighScore)
        .slice(0, MAX_SCORES_PER_DIFFICULTY);
    }
    return board;
  } catch {
    return createEmptyHighScoreBoard();
  }
}

function readHighScoresFromStorage(): HighScoreBoard {
  if (typeof window === "undefined") {
    return createEmptyHighScoreBoard();
  }

  try {
    return parseHighScores(window.localStorage.getItem(HIGH_SCORES_STORAGE_KEY));
  } catch {
    return createEmptyHighScoreBoard();
  }
}

function writeHighScoresToStorage(board: HighScoreBoard): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(board));
  } catch {
    // Ignore quota / privacy mode failures.
  }
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeHighScores(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHighScoreSnapshot(): HighScoreBoard {
  if (!hasLoadedFromStorage && typeof window !== "undefined") {
    cachedBoard = readHighScoresFromStorage();
    hasLoadedFromStorage = true;
  }
  return cachedBoard;
}

export function getHighScoreServerSnapshot(): HighScoreBoard {
  return createEmptyHighScoreBoard();
}

export function recordHighScore(
  board: HighScoreBoard,
  entry: HighScore,
): HighScoreBoard {
  const nextList = [...board[entry.difficulty], entry]
    .sort((a, b) => b.score - a.score || a.attempts - b.attempts)
    .slice(0, MAX_SCORES_PER_DIFFICULTY);

  return {
    ...board,
    [entry.difficulty]: nextList,
  };
}

export function commitHighScore(entry: HighScore): HighScoreBoard {
  const next = recordHighScore(getHighScoreSnapshot(), entry);
  cachedBoard = next;
  hasLoadedFromStorage = true;
  writeHighScoresToStorage(next);
  emit();
  return next;
}
