import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { topics } from "../data/topics";
import { questionsByTopic } from "../data/questions";
import { conceptsByTopic } from "../data/concepts";
import { useProgress } from "../state/AppState";
import { DifficultyBadge, ResourceLink } from "../components/ui";

export default function TopicPage() {
  const { slug } = useParams();
  const topic = topics.find((t) => t.slug === slug);
  const { mastered, toggleMastered } = useProgress();
  const [tab, setTab] = useState<"concepts" | "questions">("concepts");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");

  const all = useMemo(
    () => (topic ? questionsByTopic(topic.id) : []),
    [topic]
  );

  const conceptList = useMemo(
    () => (topic ? conceptsByTopic(topic.id) : []),
    [topic]
  );

  const difficulties = useMemo(
    () => ["all", ...Array.from(new Set(all.map((q) => q.difficulty)))],
    [all]
  );

  const filtered = all.filter(
    (q) =>
      (difficulty === "all" || q.difficulty === difficulty) &&
      q.text.toLowerCase().includes(search.toLowerCase())
  );

  if (!topic) {
    return (
      <div>
        <p className="text-slate-400">Topic not found.</p>
        <Link to="/" className="text-brand-400 hover:underline">
          Back to topics
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-400 hover:text-white">
        &larr; All topics
      </Link>

      <div className="mt-3 flex items-start gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600/20 font-bold text-brand-300 ring-1 ring-brand-500/30">
          {topic.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{topic.name}</h1>
          <p className="text-slate-400">{topic.blurb}</p>
        </div>
      </div>

      {topic.resources && topic.resources.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            Start here — curated free resources
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {topic.resources.map((r) => (
              <ResourceLink key={r.url} resource={r} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-white/10">
        {(["concepts", "questions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? "border-brand-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t} (
            {t === "concepts" ? conceptList.length : all.length})
          </button>
        ))}
      </div>

      {/* Concepts tab */}
      {tab === "concepts" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {conceptList.map((c) => (
            <Link
              key={c.id}
              to={`/concept/${c.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-500/50 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-100">{c.title}</h3>
                <DifficultyBadge difficulty={c.difficulty} />
              </div>
              <p className="mt-1 text-sm text-slate-400">{c.summary}</p>
              {c.visualizer && (
                <span className="mt-2 inline-block rounded bg-brand-600/20 px-2 py-0.5 text-[11px] text-brand-300 ring-1 ring-brand-500/30">
                  interactive visual
                </span>
              )}
            </Link>
          ))}
          {conceptList.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500 sm:col-span-2">
              In-house explanations for this topic are coming soon — check the
              curated resources above and the Questions tab.
            </p>
          )}
        </div>
      )}

      {tab === "questions" && (
        <>
      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-56 rounded-md bg-slate-800 px-3 py-1.5 text-sm outline-none ring-1 ring-white/10 focus:ring-brand-500"
        />
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full px-3 py-1 text-xs capitalize ring-1 transition ${
              difficulty === d
                ? "bg-brand-600 text-white ring-brand-500"
                : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Questions */}
      <ul className="mt-5 space-y-2">
        {filtered.map((qq) => (
          <li
            key={qq.id}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <input
              type="checkbox"
              checked={!!mastered[qq.id]}
              onChange={() => toggleMastered(qq.id)}
              className="h-4 w-4 accent-emerald-500"
              title="Mark as mastered"
            />
            <Link to={`/question/${qq.id}`} className="flex-1">
              <span className="text-sm text-slate-100">{qq.text}</span>
            </Link>
            {qq.visualizer && (
              <span className="rounded bg-brand-600/20 px-2 py-0.5 text-[11px] text-brand-300 ring-1 ring-brand-500/30">
                visual
              </span>
            )}
            <DifficultyBadge difficulty={qq.difficulty} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-sm text-slate-500">
            No questions match your filters.
          </li>
        )}
      </ul>
        </>
      )}
    </div>
  );
}
