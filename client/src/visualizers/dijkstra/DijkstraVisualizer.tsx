import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

const NODES: Record<string, { x: number; y: number }> = {
  A: { x: 60, y: 150 },
  B: { x: 200, y: 60 },
  C: { x: 200, y: 240 },
  D: { x: 360, y: 60 },
  E: { x: 360, y: 240 },
  F: { x: 500, y: 150 },
};

// Weighted, undirected edges.
const EDGES: [string, string, number][] = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "C", 1],
  ["B", "D", 5],
  ["C", "E", 8],
  ["D", "E", 2],
  ["D", "F", 6],
  ["E", "F", 3],
];

const ADJ: Record<string, [string, number][]> = {};
for (const k of Object.keys(NODES)) ADJ[k] = [];
for (const [a, b, w] of EDGES) {
  ADJ[a].push([b, w]);
  ADJ[b].push([a, w]);
}

interface DStep {
  dist: Record<string, number>;
  visited: string[];
  current: string | null;
  edge: [string, string] | null;
  note: string;
}

function dijkstra(start: string): DStep[] {
  const steps: DStep[] = [];
  const dist: Record<string, number> = {};
  for (const k of Object.keys(NODES)) dist[k] = Infinity;
  dist[start] = 0;
  const visited: string[] = [];
  const unvisited = new Set(Object.keys(NODES));

  steps.push({ dist: { ...dist }, visited: [], current: null, edge: null, note: `Init: distance to ${start} = 0, all others = ∞.` });

  while (unvisited.size) {
    // pick unvisited node with smallest dist
    let cur: string | null = null;
    let best = Infinity;
    for (const n of unvisited) {
      if (dist[n] < best) {
        best = dist[n];
        cur = n;
      }
    }
    if (cur === null || best === Infinity) break;
    unvisited.delete(cur);
    visited.push(cur);
    steps.push({ dist: { ...dist }, visited: [...visited], current: cur, edge: null, note: `Pick closest unvisited: ${cur} (dist ${dist[cur]}). Mark visited.` });

    for (const [nb, w] of ADJ[cur]) {
      if (!unvisited.has(nb)) continue;
      const nd = dist[cur] + w;
      if (nd < dist[nb]) {
        dist[nb] = nd;
        steps.push({ dist: { ...dist }, visited: [...visited], current: cur, edge: [cur, nb], note: `Relax ${cur}→${nb}: new shorter distance ${nd}.` });
      } else {
        steps.push({ dist: { ...dist }, visited: [...visited], current: cur, edge: [cur, nb], note: `Check ${cur}→${nb}: ${nd} ≥ ${dist[nb]}, no update.` });
      }
    }
  }
  steps.push({ dist: { ...dist }, visited: [...visited], current: null, edge: null, note: `Done. Shortest distances from ${start} finalized.` });
  return steps;
}

const center = (id: string) => NODES[id];

export default function DijkstraVisualizer() {
  const steps = useMemo(() => dijkstra("A"), []);
  const p = useStepPlayer(steps);
  const step = p.current;

  const fill = (id: string) => {
    if (step.current === id) return "#f59e0b";
    if (step.visited.includes(id)) return "#22c55e";
    return "#334155";
  };

  const edgeActive = (a: string, b: string) =>
    step.edge &&
    ((step.edge[0] === a && step.edge[1] === b) ||
      (step.edge[0] === b && step.edge[1] === a));

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

      <svg viewBox="0 0 560 300" className="mt-4 w-full rounded-lg bg-slate-950/50">
        {EDGES.map(([a, b, w]) => {
          const c1 = center(a);
          const c2 = center(b);
          return (
            <g key={`${a}${b}`}>
              <line
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={edgeActive(a, b) ? "#f59e0b" : "#475569"}
                strokeWidth={edgeActive(a, b) ? 4 : 2}
              />
              <text
                x={(c1.x + c2.x) / 2}
                y={(c1.y + c2.y) / 2 - 4}
                textAnchor="middle"
                className="fill-slate-300 text-[11px] font-semibold"
              >
                {w}
              </text>
            </g>
          );
        })}
        {Object.entries(NODES).map(([id, pos]) => (
          <g key={id}>
            <motion.circle cx={pos.x} cy={pos.y} r={22} animate={{ fill: fill(id) }} stroke="#0b1020" strokeWidth={3} />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
              {id}
            </text>
            <text x={pos.x} y={pos.y - 30} textAnchor="middle" className="fill-brand-300 text-[11px] font-bold">
              {step.dist[id] === Infinity ? "∞" : step.dist[id]}
            </text>
          </g>
        ))}
      </svg>

      <StepBar idx={p.idx} total={p.total} />
      <p className="mt-2 text-sm text-slate-200">
        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
          Step {p.idx + 1}/{p.total}
        </span>
        {step.note}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Numbers above nodes are the best-known distance from A; edge labels are weights.
      </p>
    </div>
  );
}
