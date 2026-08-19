import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStepPlayer } from "../useStepPlayer";
import PlayerControls, { StepBar } from "../PlayerControls";

interface Box {
  id: string;
  label: string;
  x: number;
  y: number;
}

const BOXES: Box[] = [
  { id: "client", label: "Client", x: 30, y: 110 },
  { id: "lb", label: "Load Balancer", x: 170, y: 110 },
  { id: "api", label: "API Server", x: 320, y: 110 },
  { id: "cache", label: "Cache (Redis)", x: 470, y: 30 },
  { id: "db", label: "Database", x: 470, y: 190 },
];

const boxById = Object.fromEntries(BOXES.map((b) => [b.id, b]));
const W = 110;
const H = 48;
const center = (id: string) => ({
  x: boxById[id].x + W / 2,
  y: boxById[id].y + H / 2,
});

interface FStep {
  from: string;
  to: string;
  active: string; // active box id
  note: string;
  color: string;
}

function buildSteps(cacheHit: boolean): FStep[] {
  const s: FStep[] = [
    { from: "client", to: "lb", active: "lb", color: "#6366f1", note: "Client sends request to the load balancer." },
    { from: "lb", to: "api", active: "api", color: "#6366f1", note: "Load balancer routes to a healthy API server." },
    { from: "api", to: "cache", active: "cache", color: "#f59e0b", note: "API checks the cache first (cache-aside pattern)." },
  ];
  if (cacheHit) {
    s.push({ from: "cache", to: "api", active: "api", color: "#22c55e", note: "Cache HIT: data returned quickly, DB is skipped." });
  } else {
    s.push({ from: "cache", to: "api", active: "api", color: "#f43f5e", note: "Cache MISS: not in cache, must query the database." });
    s.push({ from: "api", to: "db", active: "db", color: "#6366f1", note: "API queries the database." });
    s.push({ from: "db", to: "api", active: "api", color: "#6366f1", note: "Database returns the result." });
    s.push({ from: "api", to: "cache", active: "cache", color: "#f59e0b", note: "API writes the result to cache for next time." });
  }
  s.push({ from: "api", to: "lb", active: "lb", color: "#6366f1", note: "API returns response up the chain." });
  s.push({ from: "lb", to: "client", active: "client", color: "#22c55e", note: "Response delivered to the client." });
  return s;
}

export default function RequestFlowVisualizer() {
  const [cacheHit, setCacheHit] = useState(false);
  const steps = useMemo(() => buildSteps(cacheHit), [cacheHit]);
  const p = useStepPlayer(steps);
  const step = p.current;

  const a = center(step.from);
  const b = center(step.to);

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
          <label className="ml-2 flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={cacheHit}
              onChange={(e) => setCacheHit(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Simulate cache hit
          </label>
        }
      />

      <svg viewBox="0 0 600 270" className="mt-4 w-full rounded-lg bg-slate-950/50">
        {/* static connectors */}
        {[
          ["client", "lb"],
          ["lb", "api"],
          ["api", "cache"],
          ["api", "db"],
        ].map(([f, t]) => {
          const c1 = center(f);
          const c2 = center(t);
          return (
            <line key={`${f}${t}`} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="#334155" strokeWidth={2} />
          );
        })}

        {/* animated packet */}
        <motion.circle
          r={8}
          fill={step.color}
          initial={false}
          animate={{ cx: [a.x, b.x], cy: [a.y, b.y] }}
          transition={{ duration: Math.max(0.25, 0.7 / p.speed) }}
          key={p.idx}
        />

        {/* boxes */}
        {BOXES.map((box) => (
          <g key={box.id}>
            <motion.rect
              x={box.x}
              y={box.y}
              width={W}
              height={H}
              rx={8}
              animate={{
                stroke: step.active === box.id ? step.color : "#475569",
                fill: step.active === box.id ? "#1e293b" : "#0f172a",
              }}
              strokeWidth={2}
            />
            <text
              x={box.x + W / 2}
              y={box.y + H / 2 + 4}
              textAnchor="middle"
              className="fill-slate-100 text-[12px] font-semibold"
            >
              {box.label}
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
        Toggle "cache hit" to compare the fast path vs a full round-trip to the database.
      </p>
    </div>
  );
}
