import type { ConceptBlock } from "../types";
import CodeBlock from "./CodeBlock";

export default function ConceptBody({ blocks }: { blocks: ConceptBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h3 key={i} className="pt-2 text-base font-semibold text-brand-300">
                {b.text}
              </h3>
            );
          case "text":
            return (
              <p key={i} className="text-sm leading-relaxed text-slate-200">
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="list-disc space-y-1 pl-5 text-sm text-slate-200">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} language={b.language} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
