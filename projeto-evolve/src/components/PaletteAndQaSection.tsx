import { useEffect, useState } from "react";
import { CheckSquare, Square, Ban } from "lucide-react";
import { DEFINITION_OF_DONE } from "@/data/qa-checklist";
import type { SiteDossier } from "@/data/types";

interface PaletteAndQaSectionProps {
  site: SiteDossier;
}

export function PaletteAndQaSection({ site }: PaletteAndQaSectionProps) {
  const storageKey = `evolve-qa-${site.slug}`;
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCheckedIds(parsed);
      } else {
        setCheckedIds([]);
      }
    } catch {
      setCheckedIds([]);
    }
  }, [storageKey]);

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  }

  return (
    <section id="palette-qa" className="scroll-mt-32 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        05 · Next Step Reference — Locked Palette (palettes.json) & QA Gate
      </p>
      <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        Approved colours & Definition of Done for {site.name}
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {site.palette.colors.map((c) => (
          <div
            key={`${site.slug}-${c.name}-${c.hex}`}
            className="flex items-start gap-3 rounded-md border border-border bg-card p-3"
          >
            <div
              className="mt-0.5 h-10 w-10 shrink-0 rounded border border-border"
              style={{ backgroundColor: c.hex }}
              aria-label={`${c.name} swatch ${c.hex}`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{c.hex}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {c.group}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{c.use}</p>
            </div>
          </div>
        ))}
      </div>

      {site.palette.gradient && (
        <div className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Approved Signature Gradient
            </p>
            <p className="font-mono text-xs text-foreground">{site.palette.gradient}</p>
          </div>
          <div
            className="h-8 w-full rounded border border-border sm:w-48"
            style={{ background: site.palette.gradient }}
          />
        </div>
      )}

      <div className="mt-4 rounded-md border border-destructive/30 bg-card p-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-destructive">
          <Ban className="h-3.5 w-3.5" />
          Explicitly Forbidden Colours (Must Never Return)
        </div>
        <ul className="mt-2 flex flex-wrap gap-2">
          {site.palette.forbidden.map((item) => (
            <li
              key={item}
              className="rounded border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground line-through"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-md border border-border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-editorial text-lg font-medium text-foreground">
              Pre-Delivery QA Checklist ({site.domain})
            </h3>
            <p className="text-xs text-muted-foreground">
              Saved automatically in this browser per site — directly from docs/developer-brief.md.
            </p>
          </div>
          <span className="font-mono text-xs font-medium text-foreground">
            {checkedIds.length} / {DEFINITION_OF_DONE.length} verified
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEFINITION_OF_DONE.map((item) => {
            const checked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`flex items-start gap-2.5 rounded border p-3 text-left transition-colors ${
                  checked
                    ? "border-primary/40 bg-secondary/70"
                    : "border-border bg-background hover:border-foreground/30"
                }`}
              >
                {checked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p className={`text-xs font-medium ${checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.requirement}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}