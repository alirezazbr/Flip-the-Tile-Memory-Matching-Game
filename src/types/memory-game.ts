export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  rows: number;
  columns: number;
  totalTiles: number;
  pairs: number;
  maxAttempts: number;
}

export type TileShape =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "hexagon"
  | "diamond"
  | "heart"
  | "cross";

export interface Tile {
  id: string;
  pairId: string;
  shape: TileShape;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameStatus = "idle" | "playing" | "checking" | "won" | "lost";

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  tiles: Tile[];
  selectedTileIds: string[];
  matchedTileIds: string[];
  attempts: number;
  maxAttempts: number;
  score: number;
  wins: number;
  losses: number;
  isSoundEnabled: boolean;
  isPaused: boolean;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SELECT_TILE"; tileId: string }
  | { type: "MATCH_TILES"; tileIds: [string, string] }
  | { type: "FLIP_TILES_BACK"; tileIds: [string, string] }
  | { type: "WIN_GAME" }
  | { type: "LOSE_GAME" }
  | { type: "RESTART_GAME"; tiles: Tile[] }
  | { type: "EXIT_GAME" }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "RESET_GAME" }
  | { type: "REVEAL_ALL_TILES" };

export interface HighScore {
  difficulty: Difficulty;
  score: number;
  attempts: number;
  date: string;
}
