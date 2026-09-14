import { describe, expect, it } from "vitest";
import { createGameTiles, isMatch } from "@/lib/memory-game/game";
import {
  createInitialGameState,
  gameReducer,
} from "@/lib/memory-game/reducer";

describe("memory game flows", () => {
  it("starts medium with 20 tiles", () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: "SET_DIFFICULTY", difficulty: "medium" });
    state = gameReducer(state, { type: "START_GAME" });

    expect(state.status).toBe("playing");
    expect(state.tiles).toHaveLength(20);
  });

  it("matches a pair and keeps tiles visible", () => {
    let state = gameReducer(createInitialGameState({ difficulty: "easy" }), {
      type: "START_GAME",
    });
    const first = state.tiles[0];
    const match = state.tiles.find(
      (tile) => tile.id !== first.id && isMatch(tile, first),
    )!;

    state = gameReducer(state, { type: "SELECT_TILE", tileId: first.id });
    state = gameReducer(state, { type: "SELECT_TILE", tileId: match.id });
    state = gameReducer(state, {
      type: "MATCH_TILES",
      tileIds: [first.id, match.id],
    });

    expect(state.tiles.find((tile) => tile.id === first.id)?.isMatched).toBe(
      true,
    );
    expect(state.tiles.find((tile) => tile.id === match.id)?.isFlipped).toBe(
      true,
    );
    expect(state.score).toBe(100);
  });

  it("flips mismatched tiles back and resumes play", () => {
    let state = gameReducer(createInitialGameState({ difficulty: "easy" }), {
      type: "START_GAME",
    });
    const first = state.tiles[0];
    const other = state.tiles.find((tile) => tile.pairId !== first.pairId)!;

    state = gameReducer(state, { type: "SELECT_TILE", tileId: first.id });
    state = gameReducer(state, { type: "SELECT_TILE", tileId: other.id });
    state = gameReducer(state, {
      type: "FLIP_TILES_BACK",
      tileIds: [first.id, other.id],
    });

    expect(state.status).toBe("playing");
    expect(state.tiles.find((tile) => tile.id === first.id)?.isFlipped).toBe(
      false,
    );
    expect(state.selectedTileIds).toHaveLength(0);
  });

  it("restarts with a fresh board without counting a loss", () => {
    let state = gameReducer(createInitialGameState({ difficulty: "easy" }), {
      type: "START_GAME",
    });
    state = gameReducer(state, { type: "SELECT_TILE", tileId: state.tiles[0].id });
    state = gameReducer(state, { type: "REVEAL_ALL_TILES" });
    expect(state.tiles.every((tile) => tile.isFlipped)).toBe(true);

    state = gameReducer(state, {
      type: "RESTART_GAME",
      tiles: createGameTiles("easy"),
    });

    expect(state.status).toBe("playing");
    expect(state.attempts).toBe(0);
    expect(state.score).toBe(0);
    expect(state.losses).toBe(0);
    expect(state.tiles).toHaveLength(6);
    expect(state.tiles.every((tile) => !tile.isFlipped && !tile.isMatched)).toBe(
      true,
    );
  });

  it("exits to the start screen without counting a loss", () => {
    let state = gameReducer(createInitialGameState({ difficulty: "easy" }), {
      type: "START_GAME",
    });
    state = gameReducer(state, { type: "EXIT_GAME" });

    expect(state.status).toBe("idle");
    expect(state.tiles).toHaveLength(0);
    expect(state.losses).toBe(0);
  });

  it("wins on a successful final-attempt match", () => {
    let state = gameReducer(createInitialGameState({ difficulty: "easy" }), {
      type: "START_GAME",
    });
    const pairId = state.tiles[0].pairId;
    state = {
      ...state,
      attempts: 7,
      maxAttempts: 8,
      score: 200,
      tiles: state.tiles.map((tile) =>
        tile.pairId === pairId
          ? { ...tile, isMatched: false, isFlipped: false }
          : { ...tile, isMatched: true, isFlipped: true },
      ),
      status: "playing",
    };

    const [first, second] = state.tiles.filter((tile) => tile.pairId === pairId);
    state = gameReducer(state, { type: "SELECT_TILE", tileId: first.id });
    state = gameReducer(state, { type: "SELECT_TILE", tileId: second.id });
    expect(state.attempts).toBe(8);
    state = gameReducer(state, {
      type: "MATCH_TILES",
      tileIds: [first.id, second.id],
    });

    expect(state.status).toBe("won");
    expect(state.wins).toBe(1);
    expect(state.losses).toBe(0);
  });
});
