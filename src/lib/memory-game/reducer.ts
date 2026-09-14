import { DEFAULT_DIFFICULTY, DIFFICULTIES } from "@/lib/memory-game/constants";
import {
  canSelectTile,
  createGameTiles,
  isGameLost,
  isGameWon,
  isMatch,
} from "@/lib/memory-game/game";
import { calculateScore } from "@/lib/memory-game/scoring";
import type { GameAction, GameState, Tile } from "@/types/memory-game";

function matchedIdsFromTiles(tiles: Tile[]): string[] {
  return tiles.filter((tile) => tile.isMatched).map((tile) => tile.id);
}

export function createInitialGameState(
  overrides: Partial<GameState> = {},
): GameState {
  const difficulty = overrides.difficulty ?? DEFAULT_DIFFICULTY;
  const base: GameState = {
    status: "idle",
    difficulty,
    tiles: [],
    selectedTileIds: [],
    matchedTileIds: [],
    attempts: 0,
    maxAttempts: DIFFICULTIES[difficulty].maxAttempts,
    score: 0,
    wins: 0,
    losses: 0,
    isSoundEnabled: false,
    isPaused: false,
  };

  return {
    ...base,
    ...overrides,
    difficulty: overrides.difficulty ?? base.difficulty,
    maxAttempts:
      overrides.maxAttempts ??
      DIFFICULTIES[overrides.difficulty ?? base.difficulty].maxAttempts,
  };
}

function startPlaying(state: GameState): GameState {
  const tiles = createGameTiles(state.difficulty);
  const { maxAttempts } = DIFFICULTIES[state.difficulty];

  return {
    ...state,
    status: "playing",
    tiles,
    selectedTileIds: [],
    matchedTileIds: [],
    attempts: 0,
    maxAttempts,
    score: 0,
    isPaused: false,
  };
}

function selectTile(state: GameState, tileId: string): GameState {
  if (!canSelectTile(state, tileId)) {
    return state;
  }

  const tiles = state.tiles.map((entry) =>
    entry.id === tileId ? { ...entry, isFlipped: true } : entry,
  );
  const selectedTileIds = [...state.selectedTileIds, tileId];
  const isSecondSelection = selectedTileIds.length === 2;

  return {
    ...state,
    tiles,
    selectedTileIds,
    attempts: isSecondSelection ? state.attempts + 1 : state.attempts,
    status: isSecondSelection ? "checking" : "playing",
  };
}

function matchTiles(
  state: GameState,
  tileIds: [string, string],
): GameState {
  if (state.status !== "checking") {
    return state;
  }

  const [firstId, secondId] = tileIds;

  if (firstId === secondId) {
    return state;
  }

  const firstTile = state.tiles.find((tile) => tile.id === firstId);
  const secondTile = state.tiles.find((tile) => tile.id === secondId);

  if (!firstTile || !secondTile || !isMatch(firstTile, secondTile)) {
    return state;
  }

  if (firstTile.isMatched || secondTile.isMatched) {
    return state;
  }

  const tiles = state.tiles.map((tile) =>
    tile.id === firstId || tile.id === secondId
      ? { ...tile, isFlipped: true, isMatched: true }
      : tile,
  );

  let score = calculateScore(state.score, "match");
  const won = isGameWon(tiles);

  if (won) {
    score = calculateScore(score, "complete");

    return {
      ...state,
      tiles,
      selectedTileIds: [],
      matchedTileIds: matchedIdsFromTiles(tiles),
      score,
      status: "won",
      wins: state.wins + 1,
    };
  }

  // Last attempt used on a non-winning match — no further tries remain.
  if (state.attempts >= state.maxAttempts) {
    return {
      ...state,
      tiles,
      selectedTileIds: [],
      matchedTileIds: matchedIdsFromTiles(tiles),
      score,
      status: "lost",
      losses: state.losses + 1,
    };
  }

  return {
    ...state,
    tiles,
    selectedTileIds: [],
    matchedTileIds: matchedIdsFromTiles(tiles),
    score,
    status: "playing",
  };
}

function flipTilesBack(
  state: GameState,
  tileIds: [string, string],
): GameState {
  if (state.status !== "checking") {
    return state;
  }

  const [firstId, secondId] = tileIds;

  if (firstId === secondId) {
    return state;
  }

  const firstTile = state.tiles.find((tile) => tile.id === firstId);
  const secondTile = state.tiles.find((tile) => tile.id === secondId);

  if (!firstTile || !secondTile) {
    return state;
  }

  // Matched pairs must stay face-up; only true mismatches flip back.
  if (isMatch(firstTile, secondTile) || firstTile.isMatched || secondTile.isMatched) {
    return state;
  }

  const tiles = state.tiles.map((tile) =>
    tile.id === firstId || tile.id === secondId
      ? { ...tile, isFlipped: false }
      : tile,
  );

  const score = calculateScore(state.score, "mismatch");
  const lost = isGameLost(state.attempts, state.maxAttempts, tiles);

  return {
    ...state,
    tiles,
    selectedTileIds: [],
    score,
    status: lost ? "lost" : "playing",
    losses: lost ? state.losses + 1 : state.losses,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return startPlaying(state);

    case "SELECT_TILE":
      return selectTile(state, action.tileId);

    case "MATCH_TILES":
      return matchTiles(state, action.tileIds);

    case "FLIP_TILES_BACK":
      return flipTilesBack(state, action.tileIds);

    case "WIN_GAME": {
      if (state.status === "won") {
        return state;
      }

      return {
        ...state,
        status: "won",
        selectedTileIds: [],
        score: calculateScore(state.score, "complete"),
        wins: state.wins + 1,
      };
    }

    case "LOSE_GAME": {
      if (state.status === "lost") {
        return state;
      }

      return {
        ...state,
        status: "lost",
        selectedTileIds: [],
        losses: state.losses + 1,
      };
    }

    case "REVEAL_ALL_TILES":
      return {
        ...state,
        tiles: state.tiles.map((tile) => ({ ...tile, isFlipped: true })),
        selectedTileIds: [],
        isPaused: true,
      };

    case "RESTART_GAME": {
      const { maxAttempts } = DIFFICULTIES[state.difficulty];

      return {
        ...state,
        status: "playing",
        tiles: action.tiles,
        selectedTileIds: [],
        matchedTileIds: [],
        attempts: 0,
        maxAttempts,
        score: 0,
        isPaused: false,
      };
    }

    case "EXIT_GAME": {
      if (state.status === "idle") {
        return state;
      }

      // Return to start screen without counting a loss.
      return {
        ...state,
        status: "idle",
        tiles: [],
        selectedTileIds: [],
        matchedTileIds: [],
        attempts: 0,
        maxAttempts: DIFFICULTIES[state.difficulty].maxAttempts,
        score: 0,
        isPaused: false,
      };
    }

    case "SET_DIFFICULTY": {
      if (state.status !== "idle") {
        return state;
      }

      return {
        ...state,
        difficulty: action.difficulty,
        maxAttempts: DIFFICULTIES[action.difficulty].maxAttempts,
      };
    }

    case "TOGGLE_SOUND":
      return {
        ...state,
        isSoundEnabled: !state.isSoundEnabled,
      };

    case "TOGGLE_PAUSE": {
      if (state.status !== "playing" && state.status !== "checking") {
        return state;
      }

      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }

    case "RESET_GAME":
      return createInitialGameState({
        isSoundEnabled: state.isSoundEnabled,
      });

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
