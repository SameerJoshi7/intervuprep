import { Link, useParams } from "react-router-dom";
import { conceptById } from "../data/concepts";
import { topicById } from "../data/topics";
import { DifficultyBadge, ResourceLink } from "../components/ui";
import ConceptBody from "../components/ConceptBody";
import { visualizerById } from "../visualizers/registry";

export default function ConceptPage() {
  const { id } = useParams();
  const concept = id ? conceptById(id) : undefined;

  if (!concept) {
    return (
      <div>
        <p className="text-slate-400">Concept not found.</p>
        <Link to="/" className="text-brand-400 hover:underline">
          Back to topics
        </Link>
      </div>
    );
  }

  const topic = topicById[concept.topicId];
  const viz = concept.visualizer ? visualizerById(concept.visualizer) : undefined;
  const Viz = viz?.component;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/topic/${topic.slug}`}
        className="text-sm text-slate-400 hover:text-white"
      >
        &larr; {topic.name}
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={concept.difficulty} />
        {concept.visualizer && (
          <span className="rounded bg-brand-600/20 px-2 py-0.5 text-[11px] text-brand-300 ring-1 ring-brand-500/30">
            interactive
          </span>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-bold leading-snug">{concept.title}</h1>
      <p className="mt-1 text-slate-400">{concept.summary}</p>

      <article className="mt-6">
        <ConceptBody blocks={concept.body} />
      </article>

      {Viz && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            See it in action
          </h2>
          <Viz />
        </section>
      )}

      {concept.resources && concept.resources.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-slate-300">
            Learn more (free resources)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {concept.resources.map((r) => (
              <ResourceLink key={r.url} resource={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
