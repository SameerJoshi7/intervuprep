import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

interface LLStep {
  values: number[];
  next: number[]; // next[i] = index of the node i points to, or -1
  prev: number | null;
  curr: number | null;
  savedNext: number | null;
  note: string;
}

function buildReversalSteps(values: number[]): LLStep[] {
  const n = values.length;
  const next = values.map((_, i) => (i < n - 1 ? i + 1 : -1));
  const steps: LLStep[] = [];
  const snap = (
    prev: number | null,
    curr: number | null,
    savedNext: number | null,
    note: string
  ) => steps.push({ values, next: [...next], prev, curr, savedNext, note });

  let prev = -1;
  let curr = 0;
  snap(null, curr, null, "Start: prev = null, curr = head. We reverse each pointer in place.");
  while (curr !== -1) {
    const saved = next[curr];
    snap(prev === -1 ? null : prev, curr, saved === -1 ? null : saved, `Save next (node ${saved === -1 ? "null" : values[saved]}) before we lose it.`);
    next[curr] = prev; // reverse the pointer
    snap(prev === -1 ? null : prev, curr, saved === -1 ? null : saved, `Point curr (${values[curr]}) back to prev (${prev === -1 ? "null" : values[prev]}).`);
    prev = curr;
    curr = saved;
    snap(prev === -1 ? null : prev, curr === -1 ? null : curr, null, `Advance: prev = ${values[prev]}, curr = ${curr === -1 ? "null" : values[curr]}.`);
  }
  snap(prev === -1 ? null : prev, null, null, `Done. New head is ${values[prev]}. List reversed in O(n) time, O(1) space.`);
  return steps;
}

const BOX = 56;
const GAP = 44;
const PAD = 30;

export default function LinkedListVisualizer() {
  const values = useMemo(() => [1, 2, 3, 4, 5], []);
  const steps = useMemo(() => buildReversalSteps(values), [values]);
  const p = useStepPlayer(steps);
  const step = p.current;

  const xOf = (i: number) => PAD + i * (BOX + GAP);
  const cy = 70;
  const width = PAD * 2 + values.length * (BOX + GAP) - GAP;

  const color = (i: number) => {
    if (step.curr === i) return "#f59e0b";
    if (step.prev === i) return "#22c55e";
    if (step.savedNext === i) return "#38bdf8";
    return "#334155";
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
      />

      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} 150`} className="min-w-[520px]" style={{ width: "100%" }}>
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* pointer arrows */}
          {step.next.map((target, i) => {
            if (target === -1) return null;
            const x1 = xOf(i) + BOX / 2;
            const x2 = xOf(target) + BOX / 2;
            const forward = target > i;
            // forward arrows arc above, reversed arrows arc below
            const midY = forward ? cy - 45 : cy + 45;
            const startX = forward ? xOf(i) + BOX : xOf(i);
            const endX = forward ? xOf(target) : xOf(target) + BOX;
            return (
              <path
                key={`${i}-${target}`}
                d={`M ${startX} ${cy} Q ${(x1 + x2) / 2} ${midY} ${endX} ${cy}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* nodes */}
          {values.map((v, i) => (
            <g key={i}>
              <motion.rect
                x={xOf(i)}
                y={cy - BOX / 2}
                width={BOX}
                height={BOX}
                rx={10}
                animate={{ fill: color(i) }}
                stroke="#0b1020"
                strokeWidth={3}
              />
              <text x={xOf(i) + BOX / 2} y={cy + 6} textAnchor="middle" className="fill-white text-lg font-bold">
                {v}
              </text>
              {/* pointer labels */}
              <text x={xOf(i) + BOX / 2} y={cy - BOX / 2 - 10} textAnchor="middle" className="fill-emerald-300 text-[11px] font-bold">
                {step.prev === i ? "prev" : ""}
              </text>
              <text x={xOf(i) + BOX / 2} y={cy + BOX / 2 + 20} textAnchor="middle" className="fill-amber-300 text-[11px] font-bold">
                {step.curr === i ? "curr" : ""}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <StepBar idx={p.idx} total={p.total} />
      <p className="mt-2 text-sm text-slate-200">
        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
          Step {p.idx + 1}/{p.total}
        </span>
        {step.note}
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <Legend color="#22c55e" label="prev" />
        <Legend color="#f59e0b" label="curr" />
        <Legend color="#38bdf8" label="saved next" />
        <Legend color="#334155" label="other" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
