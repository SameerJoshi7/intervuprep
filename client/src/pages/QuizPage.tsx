import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { topics } from "../data/topics";
import { questions } from "../data/questions";
import { topicById } from "../data/topics";
import { useProgress } from "../state/AppState";
import { useReviews } from "../hooks/useReviews";
import { DifficultyBadge, ResourceLink } from "../components/ui";
import type { Question } from "../types";

type Phase = "config" | "run" | "results";

const SECONDS_PER_Q = 90;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { mastered, toggleMastered } = useProgress();
  const { rate: scheduleReview } = useReviews();
  const [phase, setPhase] = useState<Phase>("config");

  // config
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [timed, setTimed] = useState(false);

  // run
  const [deck, setDeck] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Record<string, "known" | "review">>({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Countdown for timed mock sessions.
  useEffect(() => {
    if (phase !== "run" || !timed) return;
    if (secondsLeft <= 0) {
      setPhase("results");
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timed, secondsLeft]);

  const pool = useMemo(() => {
    let p = questions;
    if (selectedTopics.length) p = p.filter((q) => selectedTopics.includes(q.topicId));
    if (onlyUnmastered) p = p.filter((q) => !mastered[q.id]);
    return p;
  }, [selectedTopics, onlyUnmastered, mastered]);

  const start = () => {
    const d = shuffle(pool).slice(0, count);
    if (d.length === 0) return;
    setDeck(d);
    setIdx(0);
    setRevealed(false);
    setResults({});
    if (timed) setSecondsLeft(d.length * SECONDS_PER_Q);
    setPhase("run");
  };

  const answer = (r: "known" | "review") => {
    const q = deck[idx];
    setResults((prev) => ({ ...prev, [q.id]: r }));
    // Feed the spaced-repetition scheduler (Good vs Again).
    scheduleReview(q.id, r === "known" ? 4 : 2);
    if (r === "known" && !mastered[q.id]) toggleMastered(q.id);
    if (idx + 1 >= deck.length) setPhase("results");
    else {
      setIdx(idx + 1);
      setRevealed(false);
    }
  };

  const toggleTopic = (id: string) =>
    setSelectedTopics((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  // ---------- CONFIG ----------
  if (phase === "config") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Quiz / Mock Interview</h1>
        <p className="mt-1 text-slate-400">
          Flashcard-style self-assessment: recall your answer, reveal the
          resources, then rate yourself. "Knew it" marks the question mastered.
        </p>

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            Topics (none = all)
          </h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
                  selectedTopics.includes(t.id)
                    ? "bg-brand-600 text-white ring-brand-500"
                    : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            Questions
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm ring-1 ring-white/10"
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={onlyUnmastered}
              onChange={(e) => setOnlyUnmastered(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Only not-yet-mastered
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Timed mock ({SECONDS_PER_Q}s/question)
          </label>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          {pool.length} questions match your selection.
        </p>

        <button
          onClick={start}
          disabled={pool.length === 0}
          className="mt-4 rounded-md bg-brand-600 px-5 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-50"
        >
          Start ({Math.min(count, pool.length)} questions)
        </button>
      </div>
    );
  }

  // ---------- RESULTS ----------
  if (phase === "results") {
    const known = Object.values(results).filter((r) => r === "known").length;
    const toReview = deck.filter((q) => results[q.id] === "review");
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Session complete</h1>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{known}</div>
            <div className="text-xs text-slate-400">knew it</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <div className="text-3xl font-bold text-amber-400">
              {toReview.length}
            </div>
            <div className="text-xs text-slate-400">to review</div>
          </div>
          <div className="text-2xl font-semibold text-slate-300">
            {Math.round((known / deck.length) * 100)}%
          </div>
        </div>

        {toReview.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">
              Review these
            </h2>
            <ul className="space-y-2">
              {toReview.map((q) => (
                <li
                  key={q.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <Link to={`/question/${q.id}`} className="text-sm hover:text-brand-300">
                    {q.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setPhase("config")}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
          >
            New session
          </button>
        </div>
      </div>
    );
  }

  // ---------- RUN ----------
  const q = deck[idx];
  const topic = topicById[q.topicId];
  const resources = q.resources?.length ? q.resources : topic.resources ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
        <span>
          Question {idx + 1} / {deck.length}
        </span>
        <div className="flex items-center gap-3">
          {timed && (
            <span
              className={`rounded px-2 py-0.5 font-mono font-semibold ${
                secondsLeft <= 30
                  ? "bg-rose-600/30 text-rose-300"
                  : "bg-white/10 text-slate-200"
              }`}
            >
              {fmt(secondsLeft)}
            </span>
          )}
          <span>{topic.name}</span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${(idx / deck.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
        <DifficultyBadge difficulty={q.difficulty} />
        <h2 className="mt-3 text-xl font-semibold leading-snug">{q.text}</h2>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            Reveal resources
          </button>
        ) : (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-slate-300">
              Learn more
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {resources.map((r) => (
                <ResourceLink key={r.url} resource={r} />
              ))}
            </div>
            {q.visualizer && (
              <Link
                to="/visualize"
                className="mt-3 inline-block text-sm text-brand-300 hover:underline"
              >
                This has an interactive visualization &rarr;
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => answer("review")}
          className="flex-1 rounded-md bg-amber-600/80 px-4 py-3 text-sm font-medium hover:bg-amber-600"
        >
          Need to review
        </button>
        <button
          onClick={() => answer("known")}
          className="flex-1 rounded-md bg-emerald-600/80 px-4 py-3 text-sm font-medium hover:bg-emerald-600"
        >
          I knew it
        </button>
      </div>
    </div>
  );
}
