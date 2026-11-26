import { ArrowUpRight } from "lucide-react";
import type { SiteDossier } from "@/data/types";

interface DirectionMixSectionProps {
  site: SiteDossier;
}

export function DirectionMixSection({ site }: DirectionMixSectionProps) {
  return (
    <section id="direction" className="scroll-mt-32 border-b border-border py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        03 · Direction Evaluation & Recommended Mix
      </p>
      <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {site.recommendedMix.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {site.recommendedMix.summary}
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {site.officialDirections.map((dir) => (
          <div
            key={dir.slug}
            className="flex flex-col justify-between rounded-md border border-border bg-card p-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  CONCEPT 0{dir.number}
                </span>
                <a
                  href={dir.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground underline-offset-4 hover:underline"
                >
                  Open concept
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <h3 className="mt-2 font-editorial text-xl font-medium text-foreground">
                {dir.name}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{dir.fonts}</p>
              <p className="mt-2.5 text-sm text-foreground/90">{dir.tone}</p>
            </div>

            <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-xs">
              <p className="text-foreground">
                <span className="font-mono uppercase text-muted-foreground">Keep: </span>
                {dir.strength}
              </p>
              <p className="text-muted-foreground">
                <span className="font-mono uppercase">Trade-off: </span>
                {dir.tradeoff}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-border bg-card">
        <div className="grid gap-4 border-b border-border bg-secondary/50 p-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Type Pairing Chosen
            </p>
            <p className="mt-1 text-sm text-foreground">{site.recommendedMix.typePairing}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Motion Discipline
            </p>
            <p className="mt-1 text-sm text-foreground">{site.recommendedMix.motionRule}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Homepage Section</th>
                <th className="px-4 py-3 font-medium">Taken From</th>
                <th className="px-4 py-3 font-medium">One-Sentence Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {site.recommendedMix.rows.map((row) => (
                <tr key={row.section}>
                  <td className="px-4 py-3 font-medium text-foreground align-top whitespace-nowrap">
                    {row.section}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground align-top whitespace-nowrap">
                    {row.source}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground align-top leading-relaxed">
                    {row.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}