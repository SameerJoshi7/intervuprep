import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { questions, questionById } from "../data/questions";
import { topicById } from "../data/topics";
import { useReviews } from "../hooks/useReviews";
import { DifficultyBadge, ResourceLink } from "../components/ui";
import type { Question } from "../types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RATINGS: { label: string; quality: number; color: string }[] = [
  { label: "Again", quality: 1, color: "bg-rose-600/80 hover:bg-rose-600" },
  { label: "Hard", quality: 3, color: "bg-amber-600/80 hover:bg-amber-600" },
  { label: "Good", quality: 4, color: "bg-sky-600/80 hover:bg-sky-600" },
  { label: "Easy", quality: 5, color: "bg-emerald-600/80 hover:bg-emerald-600" },
];

export default function ReviewPage() {
  const { reviews, rate, dueIds } = useReviews();
  const [deck, setDeck] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const due = dueIds();
  const studiedCount = Object.keys(reviews).length;
  const newQuestions = useMemo(
    () => questions.filter((q) => !reviews[q.id]),
    [reviews]
  );

  const startDue = () => {
    const d = due.map((id) => questionById(id)).filter(Boolean) as Question[];
    setDeck(d);
    setIdx(0);
    setRevealed(false);
  };

  const startNew = () => {
    setDeck(shuffle(newQuestions).slice(0, 10));
    setIdx(0);
    setRevealed(false);
  };

  const onRate = (quality: number) => {
    if (!deck) return;
    rate(deck[idx].id, quality);
    if (idx + 1 >= deck.length) setDeck(null);
    else {
      setIdx(idx + 1);
      setRevealed(false);
    }
  };

  // ------- Running a review session -------
  if (deck && deck.length > 0) {
    const q = deck[idx];
    const topic = topicById[q.topicId];
    const resources = q.resources?.length ? q.resources : topic.resources ?? [];
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
          <span>
            Card {idx + 1} / {deck.length}
          </span>
          <button onClick={() => setDeck(null)} className="hover:text-white">
            End session
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${(idx / deck.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="text-xs text-slate-500">{topic.name}</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold leading-snug">{q.text}</h2>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
            >
              Reveal resources
            </button>
          ) : (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {resources.map((r) => (
                <ResourceLink key={r.url} resource={r} />
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          How well did you recall the answer?
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.label}
              onClick={() => onRate(r.quality)}
              className={`rounded-md px-3 py-3 text-sm font-medium ${r.color}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ------- Landing / overview -------
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Spaced Repetition Review</h1>
      <p className="mt-1 text-slate-400">
        Review questions right before you'd forget them. Ratings use the SM-2
        algorithm to schedule each card's next appearance.
      </p>

      <div className="mt-6 flex gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-amber-400">{due.length}</div>
          <div className="text-xs text-slate-400">due now</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-brand-400">{studiedCount}</div>
          <div className="text-xs text-slate-400">in rotation</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-slate-300">
            {newQuestions.length}
          </div>
          <div className="text-xs text-slate-400">not yet studied</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={startDue}
          disabled={due.length === 0}
          className="rounded-md bg-brand-600 px-5 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-50"
        >
          Review due ({due.length})
        </button>
        <button
          onClick={startNew}
          disabled={newQuestions.length === 0}
          className="rounded-md bg-slate-700 px-5 py-2 text-sm hover:bg-slate-600 disabled:opacity-50"
        >
          Study 10 new
        </button>
      </div>

      {due.length === 0 && studiedCount > 0 && (
        <p className="mt-6 text-sm text-emerald-400">
          You're all caught up — nothing due right now. Come back later or study
          new cards.
        </p>
      )}

      <p className="mt-8 text-xs text-slate-500">
        Tip: the <Link to="/quiz" className="text-brand-300 hover:underline">Quiz</Link>{" "}
        mode is for broad self-testing; Review focuses on long-term retention.
      </p>
    </div>
  );
}
