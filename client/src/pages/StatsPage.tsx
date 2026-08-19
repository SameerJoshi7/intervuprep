import { Link } from "react-router-dom";
import { topics } from "../data/topics";
import { questions, questionsByTopic } from "../data/questions";
import { useProgress } from "../state/AppState";
import { useReviews } from "../hooks/useReviews";

const DIFF_ORDER = [
  "basic",
  "fundamentals",
  "easy",
  "intermediate",
  "medium",
  "advanced",
  "hard",
  "insane",
];

export default function StatsPage() {
  const { mastered } = useProgress();
  const { reviews, dueIds } = useReviews();

  const total = questions.length;
  const done = questions.filter((q) => mastered[q.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const due = dueIds().length;
  const inRotation = Object.keys(reviews).length;

  // by difficulty
  const byDiff = new Map<string, { total: number; done: number }>();
  for (const q of questions) {
    const e = byDiff.get(q.difficulty) ?? { total: 0, done: 0 };
    e.total += 1;
    if (mastered[q.id]) e.done += 1;
    byDiff.set(q.difficulty, e);
  }
  const diffRows = [...byDiff.entries()].sort(
    (a, b) => DIFF_ORDER.indexOf(a[0]) - DIFF_ORDER.indexOf(b[0])
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Progress</h1>
      <p className="mt-1 text-slate-400">
        A snapshot of how far along you are. Progress is saved locally and synced
        to your account when signed in.
      </p>

      {/* Top stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={`${pct}%`} label="overall mastered" accent="text-emerald-400" />
        <Stat value={`${done}/${total}`} label="questions" accent="text-brand-400" />
        <Stat value={due} label="due for review" accent="text-amber-400" />
        <Stat value={inRotation} label="cards in rotation" accent="text-sky-400" />
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          to="/review"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
        >
          Go to review {due > 0 ? `(${due} due)` : ""}
        </Link>
        <Link
          to="/quiz"
          className="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
        >
          Start a quiz
        </Link>
      </div>

      {/* Per-topic */}
      <h2 className="mt-8 mb-3 text-lg font-semibold">By topic</h2>
      <div className="space-y-3">
        {topics.map((t) => {
          const qs = questionsByTopic(t.id);
          const m = qs.filter((q) => mastered[q.id]).length;
          const p = qs.length ? Math.round((m / qs.length) * 100) : 0;
          return (
            <Link
              key={t.id}
              to={`/topic/${t.slug}`}
              className="block rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="text-slate-400">
                  {m}/{qs.length} · {p}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${p}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Per-difficulty */}
      <h2 className="mt-8 mb-3 text-lg font-semibold">By difficulty</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {diffRows.map(([diff, e]) => {
          const p = e.total ? Math.round((e.done / e.total) * 100) : 0;
          return (
            <div key={diff} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{diff}</span>
                <span className="text-slate-400">
                  {e.done}/{e.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{label}</div>
    </div>
  );
}
