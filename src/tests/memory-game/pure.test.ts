import { describe, expect, it } from "vitest";
import { DIFFICULTIES } from "@/lib/memory-game/constants";
import {
  createGameTiles,
  isGameLost,
  isGameWon,
  isMatch,
} from "@/lib/memory-game/game";
import { calculateScore } from "@/lib/memory-game/scoring";
import { shuffle } from "@/lib/memory-game/shuffle";
import type { Tile } from "@/types/memory-game";

function tile(partial: Partial<Tile> & Pick<Tile, "id" | "pairId">): Tile {
  return {
    shape: "circle",
    color: "#E63946",
    isFlipped: false,
    isMatched: false,
    ...partial,
  };
}

describe("createGameTiles", () => {
  it.each([
    ["easy", 6, 3],
    ["medium", 20, 10],
    ["hard", 42, 21],
  ] as const)("%s creates %i tiles with %i pairs", (difficulty, total, pairs) => {
    const tiles = createGameTiles(difficulty);
    expect(tiles).toHaveLength(total);
    expect(DIFFICULTIES[difficulty].pairs).toBe(pairs);

    const ids = new Set(tiles.map((entry) => entry.id));
    expect(ids.size).toBe(total);

    const pairCounts = new Map<string, number>();
    for (const entry of tiles) {
      pairCounts.set(entry.pairId, (pairCounts.get(entry.pairId) ?? 0) + 1);
    }
    expect(pairCounts.size).toBe(pairs);
    expect([...pairCounts.values()].every((count) => count === 2)).toBe(true);
  });
});

describe("shuffle", () => {
  it("does not mutate the original array and keeps the same items", () => {
    const original = [1, 2, 3, 4, 5, 6];
    const copy = [...original];
    const shuffled = shuffle(original);

    expect(original).toEqual(copy);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort()).toEqual([...original].sort());
  });
});

describe("isMatch", () => {
  it("matches by pairId and rejects same id", () => {
    const a = tile({ id: "a", pairId: "p1" });
    const b = tile({ id: "b", pairId: "p1" });
    const c = tile({ id: "c", pairId: "p2" });

    expect(isMatch(a, b)).toBe(true);
    expect(isMatch(a, c)).toBe(false);
    expect(isMatch(a, a)).toBe(false);
  });
});

describe("win and loss helpers", () => {
  it("detects win and loss correctly including final-attempt win", () => {
    const incomplete = [
      tile({ id: "1", pairId: "p1", isMatched: true }),
      tile({ id: "2", pairId: "p1", isMatched: true }),
      tile({ id: "3", pairId: "p2", isMatched: false }),
      tile({ id: "4", pairId: "p2", isMatched: false }),
    ];
    const complete = incomplete.map((entry) => ({ ...entry, isMatched: true }));

    expect(isGameWon(incomplete)).toBe(false);
    expect(isGameWon(complete)).toBe(true);
    expect(isGameLost(7, 8, incomplete)).toBe(false);
    expect(isGameLost(8, 8, incomplete)).toBe(true);
    expect(isGameLost(8, 8, complete)).toBe(false);
  });
});

describe("calculateScore", () => {
  it("applies rewards, penalties, and a zero floor", () => {
    expect(calculateScore(0, "match")).toBe(100);
    expect(calculateScore(5, "mismatch")).toBe(0);
    expect(calculateScore(100, "complete")).toBe(600);
  });
});
