import styles from "./ControlBar.module.css";

export interface ControlBarProps {
  isSoundEnabled: boolean;
  restartDisabled?: boolean;
  onRestart: () => void;
  onExit: () => void;
  onToggleSound: () => void;
}

export function ControlBar({
  isSoundEnabled,
  restartDisabled = false,
  onRestart,
  onExit,
  onToggleSound,
}: ControlBarProps) {
  return (
    <div className={styles.bar} role="toolbar" aria-label="Game controls">
      <button
        type="button"
        className={styles.button}
        onClick={onRestart}
        disabled={restartDisabled}
        aria-label="Restart game"
      >
        Restart
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={onExit}
        aria-label="Exit to start screen"
      >
        Exit
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={onToggleSound}
        aria-pressed={isSoundEnabled}
        aria-label={isSoundEnabled ? "Sound on" : "Sound off"}
      >
        Sound {isSoundEnabled ? "On" : "Off"}
      </button>
    </div>
  );
}
