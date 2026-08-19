import { useState } from "react";

const RUNNABLE = new Set(["javascript", "js"]);

function runJs(code: string): { logs: string[]; error: string | null } {
  const logs: string[] = [];
  const format = (args: unknown[]) =>
    args
      .map((a) => {
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" ");

  const original = console.log;
  console.log = (...args: unknown[]) => logs.push(format(args));
  let error: string | null = null;
  try {
    // Study snippets run in the user's own browser. Wrapped so `return` works
    // and the global scope isn't polluted.
    new Function(`"use strict";\n${code}`)();
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  } finally {
    console.log = original;
  }
  return { logs, error };
}

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState<{ logs: string[]; error: string | null } | null>(null);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const runnable = RUNNABLE.has(language.toLowerCase());

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-wide text-slate-500">
          {language}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditing((e) => !e)}
            className="rounded px-2 py-0.5 text-[11px] text-slate-300 hover:bg-white/10"
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={copy}
            className="rounded px-2 py-0.5 text-[11px] text-slate-300 hover:bg-white/10"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          {runnable && (
            <button
              onClick={() => setOutput(runJs(source))}
              className="rounded bg-brand-600 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-brand-500"
            >
              Run
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
          className="min-h-[140px] w-full resize-y bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-200 outline-none"
        />
      ) : (
        <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-slate-200">
          <code>{source}</code>
        </pre>
      )}

      {output && (
        <div className="border-t border-white/10 bg-black/40 p-3 font-mono text-xs">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">
            Output
          </div>
          {output.logs.length === 0 && !output.error && (
            <div className="text-slate-500">
              (no console output — add console.log or call your function)
            </div>
          )}
          {output.logs.map((l, i) => (
            <div key={i} className="text-emerald-300">
              {l}
            </div>
          ))}
          {output.error && <div className="text-rose-400">{output.error}</div>}
        </div>
      )}
    </div>
  );
}
