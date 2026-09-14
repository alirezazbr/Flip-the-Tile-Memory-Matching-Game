import { DIFFICULTIES, TILE_COLORS, TILE_SHAPES } from "@/lib/memory-game/constants";
import { shuffle } from "@/lib/memory-game/shuffle";
import type { Difficulty, Tile } from "@/types/memory-game";

function padIndex(index: number, width = 3): string {
  return String(index).padStart(width, "0");
}

/**
 * Builds a shuffled face-down tile deck for a difficulty.
 * Each pair shares `pairId` and the same shape+color; every tile has a unique `id`.
 */
export function createGameTiles(difficulty: Difficulty): Tile[] {
  const config = DIFFICULTIES[difficulty];
  const tiles: Tile[] = [];

  for (let pairIndex = 0; pairIndex < config.pairs; pairIndex++) {
    const pairId = `pair-${padIndex(pairIndex + 1)}`;
    const shape = TILE_SHAPES[pairIndex % TILE_SHAPES.length];
    const color = TILE_COLORS[pairIndex % TILE_COLORS.length];

    for (let copy = 0; copy < 2; copy++) {
      const tileNumber = pairIndex * 2 + copy + 1;
      tiles.push({
        id: `tile-${padIndex(tileNumber)}`,
        pairId,
        shape,
        color,
        isFlipped: false,
        isMatched: false,
      });
    }
  }

  return shuffle(tiles);
}

/** Match by shared pairId — never by unique tile id. */
export function isMatch(first: Tile, second: Tile): boolean {
  return first.pairId === second.pairId;
}

export function isGameWon(tiles: Tile[]): boolean {
  return tiles.length > 0 && tiles.every((tile) => tile.isMatched);
}

/**
 * Loss only when attempts are exhausted and the board is not fully matched.
 * Call after evaluating a possible final-attempt match (see final-attempt win rule).
 */
export function isGameLost(
  attempts: number,
  maxAttempts: number,
  tiles: Tile[],
): boolean {
  return attempts >= maxAttempts && !isGameWon(tiles);
}

export function countMatchedPairs(tiles: Tile[]): number {
  const matchedPairIds = new Set(
    tiles.filter((tile) => tile.isMatched).map((tile) => tile.pairId),
  );
  return matchedPairIds.size;
}
