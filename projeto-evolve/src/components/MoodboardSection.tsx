import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { MoodboardReference, PatternCategory } from "@/data/types";

const PATTERNS: Array<"All" | PatternCategory> = [
  "All",
  "Grid & Layout",
  "Typography",
  "Numbers & Data",
  "Interaction & Motion",
  "Mobile & Utility",
];

interface MoodboardSectionProps {
  references: MoodboardReference[];
  siteName: string;
}

export function MoodboardSection({ references, siteName }: MoodboardSectionProps) {
  const [selectedPattern, setSelectedPattern] = useState<"All" | PatternCategory>("All");

  const filtered =
    selectedPattern === "All"
      ? references
      : references.filter((ref) => ref.pattern === selectedPattern);

  return (
    <section id="moodboard" className="scroll-mt-32 border-b border-border py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            02 · Annotated Moodboard ({references.length} References)
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Patterns collected for {siteName}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Each reference answers a specific structural or usability question—grid, type pairing,
            data citation, or mobile ergonomics—rather than borrowing surface styling.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter references by pattern">
        {PATTERNS.map((pattern) => {
          const active = selectedPattern === pattern;
          const count =
            pattern === "All"
              ? references.length
              : references.filter((r) => r.pattern === pattern).length;
          return (
            <button
              key={pattern}
              type="button"
              onClick={() => setSelectedPattern(pattern)}
              className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {pattern} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ref, idx) => (
          <article
            key={ref.id}
            className="flex flex-col justify-between rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground/30"
          >
            <div>
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                <span>{String(idx + 1).padStart(2, "0")} · {ref.gallery}</span>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px]">
                  {ref.sectorScope}
                </span>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <span>{ref.title}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ref.takeaway}</p>
            </div>

            <div className="mt-4 border-t border-border/70 pt-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/80">
                Pattern: {ref.pattern}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}