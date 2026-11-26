import { useState } from "react";
import { Link, useDocumentTitle } from "@/router";
import { ArrowRight, ExternalLink, AlertCircle, MonitorPlay, FileText } from "lucide-react";
import { ALL_SITES } from "@/data/sites";
import { NON_NEGOTIABLE_RULES } from "@/data/qa-checklist";
import { DossierHeader } from "@/components/DossierHeader";
import { ExportReplyDialog } from "@/components/ExportReplyDialog";
import { Button } from "@/components/ui/button";


export function HomePage() {
  const [exportOpen, setExportOpen] = useState(false);
  useDocumentTitle("Evolve S.r.l. — 5-Site Restyle Dossier & Live Prototypes");

  const allClientQuestions = ALL_SITES.flatMap((site) =>
    site.clientQuestions.map((q) => ({ ...q, siteName: site.name, siteSlug: site.slug })),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DossierHeader onOpenExport={() => setExportOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Executive Masthead */}
        <section className="border-b border-border pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Phase 1 Pre-Code Delivery + Phase 2 Palette-Locked Prototypes
          </p>
          <div className="mt-3 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                Five-website restyling dossier for Evolve S.r.l.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Every deliverable requested in the brief—visitor & goal statements, 9 annotated
                references per site, recommended direction mixes, sitemaps, strict greyscale
                wireframes, and palette-locked live websites built directly from{" "}
                <span className="font-mono text-xs text-foreground">data/palettes.json</span> and{" "}
                <span className="font-mono text-xs text-foreground">content.md</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
              <Button onClick={() => setExportOpen(true)} className="gap-1.5">
                <FileText className="h-4 w-4" />
                Export Client Reply (.md)
              </Button>
              <a
                href="https://github.com/evolve-srl/design-systems"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                GitHub Brief
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
            {[
              ["05", "Websites delivered"],
              ["45", "Annotated web references"],
              [String(allClientQuestions.length), "Client confirmations flagged"],
              ["100%", "Locked to palettes.json"],
            ].map(([val, label]) => (
              <div key={label}>
                <p className="font-editorial text-3xl font-medium text-foreground">{val}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Five Websites Matrix */}
        <section className="border-b border-border py-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                01 · The Five Websites
              </p>
              <h2 className="mt-1 font-editorial text-2xl font-medium sm:text-3xl">
                Review each pre-code dossier or inspect its live build
              </h2>
            </div>
          </div>

          <div className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
            {ALL_SITES.map((site) => (
              <article
                key={site.slug}
                className="grid gap-5 p-5 lg:grid-cols-12 lg:items-center"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-muted-foreground">{site.order}</span>
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-border"
                      style={{ backgroundColor: site.brandAnchorHex }}
                      aria-hidden="true"
                    />
                    <h3 className="font-editorial text-2xl font-medium text-foreground">
                      {site.name}
                    </h3>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {site.domain} · {site.sector}
                  </p>
                </div>

                <div className="space-y-1.5 text-sm lg:col-span-5">
                  <p className="text-foreground">
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">
                      Visitor:{" "}
                    </span>
                    {site.visitorBrief.primaryVisitor}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">
                      Direction:{" "}
                    </span>
                    {site.recommendedMix.title}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {site.moodboard.length} references · {site.wireframe.length} wireframe blocks ·{" "}
                    {site.clientQuestions.length} open confirmations
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end">
                  <Link
                    to="/site/$slug"
                    params={{ slug: site.slug }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Phase 1 Dossier
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/preview/$slug"
                    params={{ slug: site.slug }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <MonitorPlay className="h-3.5 w-3.5" />
                    Live Site
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Consolidated Client Confirmations */}
        <section className="border-b border-border py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            02 · Open Client Decisions Flagged (Zero Silent Compromises)
          </p>
          <h2 className="mt-1 font-editorial text-2xl font-medium sm:text-3xl">
            Items requiring confirmation before production launch
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {allClientQuestions.map((q) => (
              <div
                key={q.id}
                className="rounded-md border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <Link
                    to="/site/$slug"
                    params={{ slug: q.siteSlug }}
                    className="font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {q.siteName}
                  </Link>
                  <span className="inline-flex items-center gap-1 text-status-warn">
                    <AlertCircle className="h-3 w-3" />
                    {q.blocking}
                  </span>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-foreground">{q.topic}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Non-negotiable brief rules */}
        <section className="py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            03 · Studio Discipline (from docs/developer-brief.md)
          </p>
          <h2 className="mt-1 font-editorial text-2xl font-medium sm:text-3xl">
            Rules enforced across all five builds
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NON_NEGOTIABLE_RULES.map((rule) => (
              <div key={rule.n} className="rounded-md border border-border bg-card p-4">
                <span className="font-mono text-xs text-muted-foreground">{rule.n}</span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">{rule.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {rule.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ExportReplyDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}
