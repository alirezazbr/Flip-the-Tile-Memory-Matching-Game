import type { Tile as TileModel, TileShape } from "@/types/memory-game";
import { TILE_FLIP_DURATION_MS } from "@/lib/memory-game/constants";
import styles from "./Tile.module.css";

export interface TileProps {
  tile: TileModel;
  onSelect: (tileId: string) => void;
  /** Extra lock (e.g. checking / restarting) beyond matched state. */
  interactionDisabled?: boolean;
}

function TileShapeIcon({
  shape,
  color,
}: {
  shape: TileShape;
  color: string;
}) {
  const common = {
    width: "64%",
    height: "64%",
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (shape) {
    case "circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" fill={color} />
        </svg>
      );
    case "square":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="1.5" fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <polygon points="12,4 20,19 4,19" fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <polygon
            points="12,2 14.9,9.1 22.5,9.3 16.4,13.9 18.6,21.5 12,17.2 5.4,21.5 7.6,13.9 1.5,9.3 9.1,9.1"
            fill={color}
          />
        </svg>
      );
    case "hexagon":
      return (
        <svg {...common}>
          <polygon
            points="12,2 20,7 20,17 12,22 4,17 4,7"
            fill={color}
          />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <polygon points="12,2 21,12 12,22 3,12" fill={color} />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path
            d="M12 21s-7.2-4.5-9.3-8.4C.7 9.3 2.3 5.8 5.6 5.2c1.9-.3 3.7.6 4.7 2.1C11.3 5.8 13.1 4.9 15 5.2c3.3.6 4.9 4.1 2.9 7.4C19.2 16.5 12 21 12 21z"
            fill={color}
          />
        </svg>
      );
    case "cross":
      return (
        <svg {...common}>
          <path
            d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"
            fill={color}
          />
        </svg>
      );
  }
}

export function Tile({ tile, onSelect, interactionDisabled = false }: TileProps) {
  const isFaceUp = tile.isFlipped || tile.isMatched;
  const isDisabled = tile.isMatched || interactionDisabled;

  const ariaLabel = tile.isMatched
    ? `Matched tile showing ${tile.shape}`
    : isFaceUp
      ? `Tile showing ${tile.shape}`
      : "Hidden memory tile";

  return (
    <button
      type="button"
      className={[
        styles.tile,
        isFaceUp ? styles.flipped : "",
        tile.isMatched ? styles.matched : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--tile-flip-ms" as string]: `${TILE_FLIP_DURATION_MS}ms` }}
      aria-label={ariaLabel}
      aria-pressed={isFaceUp}
      disabled={isDisabled}
      onClick={() => onSelect(tile.id)}
    >
      <span className={styles.tileInner}>
        <span className={styles.tileFront} aria-hidden="true">
          <span className={styles.frontPattern} />
        </span>
        <span className={styles.tileBack} aria-hidden="true">
          <TileShapeIcon shape={tile.shape} color={tile.color} />
        </span>
      </span>
    </button>
  );
}
