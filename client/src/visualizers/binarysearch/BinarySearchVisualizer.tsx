import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

interface BSStep {
  lo: number;
  hi: number;
  mid: number;
  found: number | null;
  note: string;
}

function buildSteps(arr: number[], target: number): BSStep[] {
  const steps: BSStep[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  steps.push({ lo, hi, mid: -1, found: null, note: `Search for ${target} in a sorted array.` });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, found: mid, note: `arr[${mid}] = ${arr[mid]} == ${target}. Found at index ${mid}!` });
      return steps;
    }
    if (arr[mid] < target) {
      steps.push({ lo, hi, mid, found: null, note: `arr[${mid}] = ${arr[mid]} < ${target}. Discard left half; search right.` });
      lo = mid + 1;
    } else {
      steps.push({ lo, hi, mid, found: null, note: `arr[${mid}] = ${arr[mid]} > ${target}. Discard right half; search left.` });
      hi = mid - 1;
    }
  }
  steps.push({ lo, hi, mid: -1, found: null, note: `lo > hi. ${target} is not in the array.` });
  return steps;
}

function sortedArray(n: number): number[] {
  const s = new Set<number>();
  while (s.size < n) s.add(Math.floor(Math.random() * 99) + 1);
  return [...s].sort((a, b) => a - b);
}

export default function BinarySearchVisualizer() {
  const [arr, setArr] = useState<number[]>(() => sortedArray(15));
  const [target, setTarget] = useState<number>(() => arr[Math.floor(arr.length / 2)]);
  const steps = useMemo(() => buildSteps(arr, target), [arr, target]);
  const p = useStepPlayer(steps);
  const step = p.current;

  const cellColor = (i: number) => {
    if (step.found === i) return "bg-emerald-500 text-white";
    if (i === step.mid) return "bg-amber-500 text-black";
    if (i < step.lo || i > step.hi) return "bg-slate-800 text-slate-600";
    return "bg-brand-600/40 text-white";
  };

  const regenerate = () => {
    const a = sortedArray(15);
    setArr(a);
    setTarget(a[Math.floor(Math.random() * a.length)]);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <PlayerControls
        playing={p.playing}
        speed={p.speed}
        onPlay={p.play}
        onPrev={p.prev}
        onNext={p.next}
        onSpeed={p.setSpeed}
        extra={
          <>
            <label className="ml-2 flex items-center gap-2 text-xs text-slate-300">
              Target
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-20 rounded bg-slate-800 px-2 py-1 text-sm ring-1 ring-white/10"
              />
            </label>
            <button
              onClick={regenerate}
              className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
            >
              New array
            </button>
          </>
        }
      />

      <div className="mt-5 flex flex-wrap justify-center gap-1.5">
        {arr.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              layout
              animate={{ scale: i === step.mid ? 1.12 : 1 }}
              className={`grid h-11 w-11 place-items-center rounded-md text-sm font-semibold ${cellColor(i)}`}
            >
              {v}
            </motion.div>
            <span className="mt-1 text-[10px] text-slate-500">{i}</span>
            <span className="h-4 text-[10px] font-bold text-brand-300">
              {i === step.lo && i === step.hi
                ? "lo/hi"
                : i === step.lo
                ? "lo"
                : i === step.hi
                ? "hi"
                : ""}
            </span>
          </div>
        ))}
      </div>

      <StepBar idx={p.idx} total={p.total} />
      <p className="mt-2 text-sm text-slate-200">
        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
          Step {p.idx + 1}/{p.total}
        </span>
        {step.note}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Binary search halves the search space each step: O(log n).
      </p>
    </div>
  );
}
