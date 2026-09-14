import { describe, expect, it } from "vitest";
import {
  createEmptyHighScoreBoard,
  parseHighScores,
  recordHighScore,
} from "@/lib/memory-game/highScores";

describe("highScores", () => {
  it("parses corrupt storage safely", () => {
    expect(parseHighScores("not-json")).toEqual(createEmptyHighScoreBoard());
    expect(parseHighScores('{"easy":[{"bad":true}]}')).toEqual(
      createEmptyHighScoreBoard(),
    );
  });

  it("keeps top scores per difficulty", () => {
    let board = createEmptyHighScoreBoard();
    board = recordHighScore(board, {
      difficulty: "easy",
      score: 100,
      attempts: 5,
      date: "2026-01-01",
    });
    board = recordHighScore(board, {
      difficulty: "easy",
      score: 400,
      attempts: 4,
      date: "2026-01-02",
    });

    expect(board.easy[0]?.score).toBe(400);
    expect(board.easy).toHaveLength(2);
  });
});
