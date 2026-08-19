import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

interface TreeNode {
  value: number;
  left: number | null; // index into nodes
  right: number | null;
}

interface BSTStep {
  active: number | null; // node being visited/compared
  visited: number[]; // traversal output so far (node indices)
  note: string;
}

const INSERTS = [50, 30, 70, 20, 40, 60, 80, 35];

// Build a BST and record the node array.
function buildTree(values: number[]): TreeNode[] {
  const nodes: TreeNode[] = [];
  let root: number | null = null;
  const insert = (val: number) => {
    const idx = nodes.length;
    nodes.push({ value: val, left: null, right: null });
    if (root === null) {
      root = idx;
      return;
    }
    let cur = root;
    while (true) {
      if (val < nodes[cur].value) {
        if (nodes[cur].left === null) {
          nodes[cur].left = idx;
          break;
        }
        cur = nodes[cur].left!;
      } else {
        if (nodes[cur].right === null) {
          nodes[cur].right = idx;
          break;
        }
        cur = nodes[cur].right!;
      }
    }
  };
  values.forEach(insert);
  return nodes;
}

type Order = "in" | "pre" | "post";

function traversalSteps(nodes: TreeNode[], order: Order): BSTStep[] {
  const steps: BSTStep[] = [];
  const visited: number[] = [];
  const root = nodes.length ? 0 : null;

  const walk = (idx: number | null) => {
    if (idx === null) return;
    steps.push({ active: idx, visited: [...visited], note: `Visit node ${nodes[idx].value}.` });
    if (order === "pre") {
      visited.push(idx);
      steps.push({ active: idx, visited: [...visited], note: `Output ${nodes[idx].value} (pre-order).` });
    }
    walk(nodes[idx].left);
    if (order === "in") {
      visited.push(idx);
      steps.push({ active: idx, visited: [...visited], note: `Output ${nodes[idx].value} (in-order).` });
    }
    walk(nodes[idx].right);
    if (order === "post") {
      visited.push(idx);
      steps.push({ active: idx, visited: [...visited], note: `Output ${nodes[idx].value} (post-order).` });
    }
  };

  steps.push({ active: null, visited: [], note: `${order}-order traversal. In-order of a BST yields sorted values.` });
  walk(root);
  steps.push({ active: null, visited: [...visited], note: `Done: ${visited.map((i) => nodes[i].value).join(", ")}.` });
  return steps;
}

// Compute layout: x by in-order rank, y by depth.
function layout(nodes: TreeNode[]) {
  const pos: Record<number, { x: number; y: number }> = {};
  let rank = 0;
  const assign = (idx: number | null, depth: number) => {
    if (idx === null) return;
    assign(nodes[idx].left, depth + 1);
    pos[idx] = { x: rank++, y: depth };
    assign(nodes[idx].right, depth + 1);
  };
  if (nodes.length) assign(0, 0);
  return pos;
}

export default function BSTVisualizer() {
  const [order, setOrder] = useState<Order>("in");
  const nodes = useMemo(() => buildTree(INSERTS), []);
  const pos = useMemo(() => layout(nodes), [nodes]);
  const steps = useMemo(() => traversalSteps(nodes, order), [nodes, order]);
  const p = useStepPlayer(steps);
  const step = p.current;

  const cols = nodes.length;
  const colW = 62;
  const rowH = 76;
  const width = cols * colW;
  const height = (Math.max(...Object.values(pos).map((q) => q.y)) + 1) * rowH + 20;
  const cx = (i: number) => pos[i].x * colW + colW / 2;
  const cy = (i: number) => pos[i].y * rowH + 40;

  const fill = (i: number) => {
    if (step.active === i) return "#f59e0b";
    if (step.visited.includes(i)) return "#22c55e";
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
            {(["in", "pre", "post"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOrder(o)}
                className={`px-3 py-1.5 text-sm ${
                  order === o ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {o}-order
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[520px]" style={{ width: "100%" }}>
          {/* edges */}
          {nodes.map((n, i) => (
            <g key={`e${i}`}>
              {n.left !== null && (
                <line x1={cx(i)} y1={cy(i)} x2={cx(n.left)} y2={cy(n.left)} stroke="#475569" strokeWidth={2} />
              )}
              {n.right !== null && (
                <line x1={cx(i)} y1={cy(i)} x2={cx(n.right)} y2={cy(n.right)} stroke="#475569" strokeWidth={2} />
              )}
            </g>
          ))}
          {/* nodes */}
          {nodes.map((n, i) => (
            <g key={i}>
              <motion.circle cx={cx(i)} cy={cy(i)} r={20} animate={{ fill: fill(i) }} stroke="#0b1020" strokeWidth={3} />
              <text x={cx(i)} y={cy(i) + 5} textAnchor="middle" className="fill-white text-sm font-bold">
                {n.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/60 p-2 text-sm">
        <span className="text-xs uppercase tracking-wide text-slate-400">Output: </span>
        {step.visited.map((i) => nodes[i].value).join(", ") || "—"}
      </div>

      <StepBar idx={p.idx} total={p.total} />
      <p className="mt-2 text-sm text-slate-200">
        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
          Step {p.idx + 1}/{p.total}
        </span>
        {step.note}
      </p>
    </div>
  );
}
