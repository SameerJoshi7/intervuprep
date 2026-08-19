import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

// Fixed layout so the graph is readable and stable.
const NODES: Record<string, { x: number; y: number }> = {
  A: { x: 300, y: 40 },
  B: { x: 150, y: 130 },
  C: { x: 450, y: 130 },
  D: { x: 80, y: 240 },
  E: { x: 220, y: 240 },
  F: { x: 400, y: 240 },
  G: { x: 520, y: 240 },
};

const ADJ: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F", "G"],
  D: ["B"],
  E: ["B"],
  F: ["C"],
  G: ["C"],
};

const EDGES: [string, string][] = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "F"],
  ["C", "G"],
];

interface GStep {
  visited: string[];
  frontier: string[]; // queue (BFS) or stack (DFS)
  current: string | null;
  note: string;
}

function bfs(start: string): GStep[] {
  const steps: GStep[] = [];
  const visited: string[] = [];
  const queue: string[] = [start];
  steps.push({ visited: [], frontier: [...queue], current: null, note: `BFS from ${start}. Enqueue ${start}.` });
  while (queue.length) {
    const node = queue.shift()!;
    if (visited.includes(node)) continue;
    visited.push(node);
    steps.push({ visited: [...visited], frontier: [...queue], current: node, note: `Dequeue ${node}, mark visited.` });
    const next = ADJ[node].filter((n) => !visited.includes(n) && !queue.includes(n));
    for (const n of next) queue.push(n);
    if (next.length)
      steps.push({ visited: [...visited], frontier: [...queue], current: node, note: `Enqueue neighbors of ${node}: ${next.join(", ")}.` });
  }
  steps.push({ visited: [...visited], frontier: [], current: null, note: `Done. Visit order: ${visited.join(" -> ")}.` });
  return steps;
}

function dfs(start: string): GStep[] {
  const steps: GStep[] = [];
  const visited: string[] = [];
  const stack: string[] = [start];
  steps.push({ visited: [], frontier: [...stack], current: null, note: `DFS from ${start}. Push ${start}.` });
  while (stack.length) {
    const node = stack.pop()!;
    if (visited.includes(node)) continue;
    visited.push(node);
    steps.push({ visited: [...visited], frontier: [...stack], current: node, note: `Pop ${node}, mark visited.` });
    const next = ADJ[node].filter((n) => !visited.includes(n));
    for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]);
    if (next.length)
      steps.push({ visited: [...visited], frontier: [...stack], current: node, note: `Push neighbors of ${node}: ${next.join(", ")}.` });
  }
  steps.push({ visited: [...visited], frontier: [], current: null, note: `Done. Visit order: ${visited.join(" -> ")}.` });
  return steps;
}

export default function GraphVisualizer() {
  const [mode, setMode] = useState<"bfs" | "dfs">("bfs");
  const steps = useMemo(() => (mode === "bfs" ? bfs("A") : dfs("A")), [mode]);
  const p = useStepPlayer(steps);
  const step = p.current;

  const fill = (id: string) => {
    if (step.current === id) return "#f59e0b";
    if (step.visited.includes(id)) return "#22c55e";
    if (step.frontier.includes(id)) return "#6366f1";
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
        extra={
          <div className="ml-2 flex overflow-hidden rounded-md ring-1 ring-white/10">
            {(["bfs", "dfs"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-sm uppercase ${
                  mode === m ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,200px]">
        <svg viewBox="0 0 600 300" className="w-full rounded-lg bg-slate-950/50">
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="#475569"
              strokeWidth={2}
            />
          ))}
          {Object.entries(NODES).map(([id, pos]) => (
            <g key={id}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={22}
                animate={{ fill: fill(id) }}
                stroke="#0b1020"
                strokeWidth={3}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="fill-white text-sm font-bold"
              >
                {id}
              </text>
            </g>
          ))}
        </svg>

        <div className="text-sm">
          <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">
            {mode === "bfs" ? "Queue (FIFO)" : "Stack (LIFO)"}
          </div>
          <div className="flex min-h-[40px] flex-wrap gap-1 rounded-lg border border-white/10 bg-slate-900/60 p-2">
            {step.frontier.length ? (
              step.frontier.map((n, i) => (
                <span key={i} className="rounded bg-brand-600/40 px-2 py-1 text-xs">
                  {n}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-600">empty</span>
            )}
          </div>
          <div className="mb-1 mt-3 text-xs uppercase tracking-wide text-slate-400">
            Visited
          </div>
          <div className="flex flex-wrap gap-1">
            {step.visited.map((n, i) => (
              <span key={i} className="rounded bg-emerald-600/30 px-2 py-1 text-xs">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <StepBar idx={p.idx} total={p.total} />
      <p className="mt-2 text-sm text-slate-200">
        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
          Step {p.idx + 1}/{p.total}
        </span>
        {step.note}
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <Legend color="#334155" label="unvisited" />
        <Legend color="#6366f1" label="in frontier" />
        <Legend color="#f59e0b" label="current" />
        <Legend color="#22c55e" label="visited" />
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
