import { useState } from "react";
import { visualizers } from "../visualizers/registry";

export default function VisualizePage() {
  const [activeId, setActiveId] = useState(visualizers[0]?.id);
  const active = visualizers.find((v) => v.id === activeId);
  const Active = active?.component;

  return (
    <div>
      <h1 className="text-2xl font-bold">Visualizations</h1>
      <p className="mt-1 text-slate-400">
        Learn by seeing. Step through algorithms and system concepts
        interactively. More visualizers (graphs, trees, system-design flows, and
        3D scenes) are on the roadmap.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {visualizers.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className={`rounded-lg px-3 py-1.5 text-sm ring-1 transition ${
              activeId === v.id
                ? "bg-brand-600 text-white ring-brand-500"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            }`}
          >
            {v.title}
            <span className="ml-2 text-[11px] text-slate-400">{v.category}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-5">
          <p className="mb-3 text-sm text-slate-400">{active.description}</p>
          {Active && <Active />}
        </div>
      )}
    </div>
  );
}
