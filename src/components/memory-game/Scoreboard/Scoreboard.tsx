import { DIFFICULTIES } from "@/lib/memory-game/constants";
import {
  countMatchedPairs,
  getRemainingAttempts,
} from "@/lib/memory-game/game";
import type { GameState } from "@/types/memory-game";
import styles from "./Scoreboard.module.css";

export interface ScoreboardProps {
  state: Pick<
    GameState,
    | "score"
    | "attempts"
    | "maxAttempts"
    | "wins"
    | "losses"
    | "tiles"
    | "difficulty"
  >;
}

export function Scoreboard({ state }: ScoreboardProps) {
  const totalPairs = DIFFICULTIES[state.difficulty].pairs;
  const matchedPairs = countMatchedPairs(state.tiles);
  const remaining = getRemainingAttempts(state.attempts, state.maxAttempts);

  return (
    <dl className={styles.scoreboard} aria-label="Game statistics">
      <div className={styles.item}>
        <dt>Score</dt>
        <dd>{state.score}</dd>
      </div>
      <div className={styles.item}>
        <dt>Attempts</dt>
        <dd>
          {state.attempts} / {state.maxAttempts}
        </dd>
      </div>
      <div className={styles.item}>
        <dt>Remaining</dt>
        <dd>{remaining}</dd>
      </div>
      <div className={styles.item}>
        <dt>Pairs</dt>
        <dd>
          {matchedPairs} / {totalPairs}
        </dd>
      </div>
      <div className={styles.item}>
        <dt>Wins</dt>
        <dd>{state.wins}</dd>
      </div>
      <div className={styles.item}>
        <dt>Losses</dt>
        <dd>{state.losses}</dd>
      </div>
    </dl>
  );
}
