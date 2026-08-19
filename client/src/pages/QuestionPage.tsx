import { Link, useParams } from "react-router-dom";
import { questionById } from "../data/questions";
import { topicById } from "../data/topics";
import { useProgress } from "../state/AppState";
import { DifficultyBadge, ResourceLink } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { visualizerById } from "../visualizers/registry";

export default function QuestionPage() {
  const { id } = useParams();
  const question = id ? questionById(id) : undefined;
  const { mastered, toggleMastered, notes, setNote } = useProgress();

  if (!question) {
    return (
      <div>
        <p className="text-slate-400">Question not found.</p>
        <Link to="/" className="text-brand-400 hover:underline">
          Back to topics
        </Link>
      </div>
    );
  }

  const topic = topicById[question.topicId];
  const viz = question.visualizer
    ? visualizerById(question.visualizer)
    : undefined;
  const VizComponent = viz?.component;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/topic/${topic.slug}`}
        className="text-sm text-slate-400 hover:text-white"
      >
        &larr; {topic.name}
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={question.difficulty} />
        {question.visualizer && (
          <span className="rounded bg-brand-600/20 px-2 py-0.5 text-[11px] text-brand-300 ring-1 ring-brand-500/30">
            has visualization
          </span>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-bold leading-snug">{question.text}</h1>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={!!mastered[question.id]}
          onChange={() => toggleMastered(question.id)}
          className="h-4 w-4 accent-emerald-500"
        />
        I can confidently answer this
      </label>

      {/* Visualization */}
      {VizComponent && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            Interactive visualization
          </h2>
          <VizComponent />
        </section>
      )}

      {/* Notes */}
      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-slate-300">
          Your answer / notes
        </h2>
        <textarea
          value={notes[question.id] ?? ""}
          onChange={(e) => setNote(question.id, e.target.value)}
          placeholder="Write your answer, key points, gotchas, and links..."
          className="min-h-[160px] w-full rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-100 outline-none focus:border-brand-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Saved automatically in your browser.
        </p>
      </section>

      {/* Examples */}
      {question.examples && question.examples.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            Code example
          </h2>
          {question.examples.map((ex, i) => (
            <div key={i} className="mb-3">
              {ex.explanation && (
                <p className="mb-1 text-sm text-slate-400">{ex.explanation}</p>
              )}
              <CodeBlock code={ex.code} language={ex.language} />
            </div>
          ))}
        </section>
      )}

      {/* Resources: question-specific if present, otherwise the topic's curated links */}
      {(() => {
        const hasOwn = question.resources && question.resources.length > 0;
        const resources = hasOwn ? question.resources! : topic.resources ?? [];
        if (resources.length === 0) return null;
        return (
          <section className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">
              {hasOwn ? "Learn more" : `Learn more — ${topic.name} resources`}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {resources.map((r) => (
                <ResourceLink key={r.url} resource={r} />
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
