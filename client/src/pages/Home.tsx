import { Link } from "react-router-dom";
import { topics } from "../data/topics";
import { questions, questionsByTopic } from "../data/questions";
import { concepts, conceptsByTopic } from "../data/concepts";
import { visualizers } from "../visualizers/registry";
import { useProgress } from "../state/AppState";

export default function Home() {
  const { mastered } = useProgress();
  const total = questions.length;
  const done = questions.filter((q) => mastered[q.id]).length;

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Learn it. See it. Nail the interview.
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Browse curated questions across DSA, system design, and the full-stack
          world. Attach open-source resources, keep your own notes, and{" "}
          <em>watch</em> concepts come alive with interactive visualizations.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/quiz"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
          >
            Start a quiz
          </Link>
          <Link
            to="/review"
            className="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            Review (spaced repetition)
          </Link>
          <Link
            to="/visualize"
            className="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            Explore visualizations
          </Link>
          <Link
            to="/stats"
            className="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            View progress
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-bold text-brand-400">{total}</div>
            <div className="text-xs text-slate-400">questions</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-bold text-sky-400">{concepts.length}</div>
            <div className="text-xs text-slate-400">explained concepts</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-bold text-amber-400">
              {visualizers.length}
            </div>
            <div className="text-xs text-slate-400">visualizers</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-2xl font-bold text-emerald-400">{done}</div>
            <div className="text-xs text-slate-400">mastered</div>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${total ? (done / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => {
          const qs = questionsByTopic(t.id);
          const m = qs.filter((q) => mastered[q.id]).length;
          return (
            <Link
              key={t.id}
              to={`/topic/${t.slug}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-brand-500/50 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600/20 text-sm font-bold text-brand-300 ring-1 ring-brand-500/30">
                  {t.icon}
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {t.category}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold group-hover:text-brand-300">
                {t.name}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{t.blurb}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {conceptsByTopic(t.id).length} concepts · {qs.length} questions
                </span>
                <span>
                  {m}/{qs.length}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
