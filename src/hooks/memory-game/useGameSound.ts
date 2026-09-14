"use client";

import { useCallback, useEffect, useRef } from "react";

export interface GameSound {
  playFlip(): void;
  playMatch(): void;
  playMismatch(): void;
  playWin(): void;
  playLoss(): void;
  playClick(): void;
}

function playTone(
  context: AudioContext,
  frequency: number,
  durationMs: number,
  type: OscillatorType = "sine",
  gainValue = 0.04,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(context.destination);
  const now = context.currentTime;
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

export function useGameSound(enabled: boolean): GameSound {
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void contextRef.current?.close().catch(() => undefined);
      contextRef.current = null;
    };
  }, []);

  const withContext = useCallback(
    (action: (context: AudioContext) => void) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }

      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextCtor) {
          return;
        }

        if (!contextRef.current) {
          contextRef.current = new AudioContextCtor();
        }

        const context = contextRef.current;
        if (context.state === "suspended") {
          void context.resume().catch(() => undefined);
        }

        action(context);
      } catch {
        // Missing/blocked audio must never break gameplay.
      }
    },
    [enabled],
  );

  const playFlip = useCallback(() => {
    withContext((context) => playTone(context, 420, 90, "triangle", 0.03));
  }, [withContext]);

  const playMatch = useCallback(() => {
    withContext((context) => {
      playTone(context, 520, 110, "sine", 0.04);
      playTone(context, 780, 140, "sine", 0.03);
    });
  }, [withContext]);

  const playMismatch = useCallback(() => {
    withContext((context) => playTone(context, 180, 160, "sawtooth", 0.025));
  }, [withContext]);

  const playWin = useCallback(() => {
    withContext((context) => {
      playTone(context, 523, 120, "sine", 0.04);
      playTone(context, 659, 140, "sine", 0.04);
      playTone(context, 784, 180, "sine", 0.045);
    });
  }, [withContext]);

  const playLoss = useCallback(() => {
    withContext((context) => playTone(context, 140, 280, "triangle", 0.035));
  }, [withContext]);

  const playClick = useCallback(() => {
    withContext((context) => playTone(context, 660, 60, "square", 0.02));
  }, [withContext]);

  return {
    playFlip,
    playMatch,
    playMismatch,
    playWin,
    playLoss,
    playClick,
  };
}
