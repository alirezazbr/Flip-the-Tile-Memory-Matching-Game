import { Tile } from "@/components/memory-game/Tile/Tile";
import { DIFFICULTIES } from "@/lib/memory-game/constants";
import type { Difficulty, GameStatus, Tile as TileModel } from "@/types/memory-game";
import styles from "./Board.module.css";

export interface BoardProps {
  tiles: TileModel[];
  difficulty: Difficulty;
  status: GameStatus;
  isPaused: boolean;
  onSelectTile: (tileId: string) => void;
}

export function Board({
  tiles,
  difficulty,
  status,
  isPaused,
  onSelectTile,
}: BoardProps) {
  const { columns } = DIFFICULTIES[difficulty];
  const interactionDisabled =
    isPaused || status === "checking" || status === "won" || status === "lost";

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
      role="grid"
      aria-label={`Memory board, ${DIFFICULTIES[difficulty].rows} by ${columns}`}
      aria-busy={status === "checking" || undefined}
    >
      {tiles.map((tile) => (
        <div key={tile.id} className={styles.cell} role="gridcell">
          <Tile
            tile={tile}
            onSelect={onSelectTile}
            interactionDisabled={interactionDisabled}
          />
        </div>
      ))}
    </div>
  );
}
