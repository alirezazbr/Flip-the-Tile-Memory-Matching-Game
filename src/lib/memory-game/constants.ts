import type {
  Difficulty,
  DifficultyConfig,
  TileShape,
} from "@/types/memory-game";

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "Easy",
    rows: 2,
    columns: 3,
    totalTiles: 6,
    pairs: 3,
    maxAttempts: 8,
  },
  medium: {
    id: "medium",
    label: "Medium",
    rows: 4,
    columns: 5,
    totalTiles: 20,
    pairs: 10,
    maxAttempts: 25,
  },
  hard: {
    id: "hard",
    label: "Hard",
    rows: 6,
    columns: 7,
    totalTiles: 42,
    pairs: 21,
    maxAttempts: 50,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = "easy";

export const TILE_SHAPES: readonly TileShape[] = [
  "circle",
  "square",
  "triangle",
  "star",
  "hexagon",
  "diamond",
  "heart",
  "cross",
] as const;

/** Distinct colors; pairs combine shape + color so identity is not color-only. */
export const TILE_COLORS: readonly string[] = [
  "#E63946",
  "#2A9D8F",
  "#E9C46A",
  "#457B9D",
  "#F4A261",
  "#6A4C93",
  "#1D3557",
  "#D62828",
  "#06D6A0",
  "#118AB2",
  "#EF476F",
  "#073B4C",
  "#FFD166",
  "#8338EC",
  "#3A86FF",
  "#FB5607",
  "#FF006E",
  "#8AC926",
  "#1982C4",
  "#6D6875",
  "#B56576",
] as const;

export const MATCH_SCORE = 100;
export const MISMATCH_PENALTY = 10;
export const COMPLETION_BONUS = 500;

/** Delay before flipping mismatched tiles back (ms). */
export const MISMATCH_FLIP_BACK_DELAY_MS = 800;

/** Delay while all tiles stay revealed during restart (ms). */
export const RESTART_REVEAL_DELAY_MS = 700;

/** CSS flip animation duration target (ms). */
export const TILE_FLIP_DURATION_MS = 400;

export const HIGH_SCORES_STORAGE_KEY = "memory-game-high-scores";
