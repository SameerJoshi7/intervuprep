import type { Difficulty, Resource } from "../types";

const DIFF_COLOR: Record<string, string> = {
  basic: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  fundamentals: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  easy: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  intermediate: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  medium: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  advanced: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  hard: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  insane: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${
        DIFF_COLOR[difficulty] ?? "bg-white/10 text-slate-300 ring-white/20"
      }`}
    >
      {difficulty}
    </span>
  );
}

const TYPE_ICON: Record<Resource["type"], string> = {
  doc: "[doc]",
  video: "[video]",
  article: "[article]",
  repo: "[repo]",
};

export function ResourceLink({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-brand-500/50 hover:bg-white/10"
    >
      <span className="text-xs text-brand-400">{TYPE_ICON[resource.type]}</span>
      <span className="flex-1">{resource.title}</span>
      <span className="text-slate-500">&#8599;</span>
    </a>
  );
}
