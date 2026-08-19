import { useEffect, useRef, useState } from "react";

/**
 * Generic playback controller for any array of "steps".
 * Visualizers generate steps (pure data) and use this hook to play/step through them.
 */
export function useStepPlayer<T>(steps: T[]) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);

  // Reset to start whenever the step list identity changes.
  useEffect(() => {
    setIdx(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(
      () => setIdx((i) => Math.min(i + 1, steps.length - 1)),
      Math.max(60, 600 / speed)
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, idx, steps.length, speed]);

  const atEnd = idx >= steps.length - 1;

  return {
    idx,
    setIdx,
    playing,
    speed,
    setSpeed,
    atEnd,
    current: steps[idx],
    total: steps.length,
    play: () => {
      if (atEnd) setIdx(0);
      setPlaying((p) => !p);
    },
    prev: () => {
      setPlaying(false);
      setIdx((i) => Math.max(0, i - 1));
    },
    next: () => {
      setPlaying(false);
      setIdx((i) => Math.min(steps.length - 1, i + 1));
    },
    reset: () => {
      setPlaying(false);
      setIdx(0);
    },
  };
}
