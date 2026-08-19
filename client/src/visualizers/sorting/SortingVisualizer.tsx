import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SORTERS, type SorterKey, type ArrayStep } from "./algorithms";

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 8);
}

export default function SortingVisualizer() {
  const [algo, setAlgo] = useState<SorterKey>("bubble");
  const [input, setInput] = useState<number[]>(() => randomArray(12));
  const [steps, setSteps] = useState<ArrayStep[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // steps per ~500ms multiplier
  const timer = useRef<number | null>(null);

  // Recompute steps whenever algorithm or input changes.
  useEffect(() => {
    const generated = Array.from(SORTERS[algo].fn(input));
    setSteps(generated);
    setIdx(0);
    setPlaying(false);
  }, [algo, input]);

  // Playback loop.
  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(
      () => setIdx((i) => Math.min(i + 1, steps.length - 1)),
      Math.max(60, 500 / speed)
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, idx, steps.length, speed]);

  const step = steps[idx];
  const maxVal = useMemo(() => Math.max(...input, 1), [input]);

  if (!step) return null;

  const isHi = (i: number) => step.highlights.includes(i);
  const isSorted = (i: number) => step.sorted.includes(i);
  const isSwap = (i: number) => step.swapped?.includes(i);

  const barColor = (i: number) => {
    if (isSorted(i)) return "#22c55e";
    if (isSwap(i)) return "#f43f5e";
    if (isHi(i)) return "#f59e0b";
    return "#6366f1";
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value as SorterKey)}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm outline-none ring-1 ring-white/10"
        >
          {Object.entries(SORTERS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label} — {v.complexity}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            if (idx >= steps.length - 1) setIdx(0);
            setPlaying((p) => !p);
          }}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium hover:bg-brand-500"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setIdx((i) => Math.max(0, i - 1));
          }}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          Prev
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setIdx((i) => Math.min(steps.length - 1, i + 1));
          }}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          Next
        </button>
        <button
          onClick={() => setInput(randomArray(input.length))}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          Shuffle
        </button>

        <label className="ml-2 flex items-center gap-2 text-xs text-slate-300">
          Speed
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          Size
          <input
            type="range"
            min={5}
            max={24}
            step={1}
            value={input.length}
            onChange={(e) => setInput(randomArray(Number(e.target.value)))}
          />
        </label>
      </div>

      {/* Bars */}
      <div className="mt-5 flex h-64 items-end justify-center gap-1.5">
        {step.array.map((v, i) => (
          <motion.div
            key={i}
            layout
            className="flex-1 rounded-t-md"
            style={{ maxWidth: 40 }}
            initial={false}
            animate={{
              height: `${(v / maxVal) * 100}%`,
              backgroundColor: barColor(i),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="pt-1 text-center text-[10px] font-semibold text-white/80">
              {v}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Explanation + progress */}
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${(idx / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-200">
          <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
            Step {idx + 1}/{steps.length}
          </span>
          {step.note}
        </p>
        {step.pointers && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
            {Object.entries(step.pointers).map(([k, val]) => (
              <span key={k} className="rounded bg-white/5 px-2 py-0.5">
                {k} = {val}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <Legend color="#6366f1" label="unsorted" />
        <Legend color="#f59e0b" label="comparing" />
        <Legend color="#f43f5e" label="swapping" />
        <Legend color="#22c55e" label="in final position" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
