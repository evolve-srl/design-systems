import { useState } from "react";
import { Link, useDocumentTitle } from "@/router";
import { ArrowLeft, ArrowRight, ExternalLink, AlertCircle, MonitorPlay } from "lucide-react";
import { ALL_SITES } from "@/data/sites";
import type { SiteDossier } from "@/data/types";
import { DossierHeader } from "@/components/DossierHeader";
import { MoodboardSection } from "@/components/MoodboardSection";
import { DirectionMixSection } from "@/components/DirectionMixSection";
import { SitemapView } from "@/components/SitemapView";
import { GreyscaleWireframe } from "@/components/GreyscaleWireframe";
import { PaletteAndQaSection } from "@/components/PaletteAndQaSection";
import { ExportReplyDialog } from "@/components/ExportReplyDialog";


export function SiteDossierPage({ site }: { site: SiteDossier }) {
  const [exportOpen, setExportOpen] = useState(false);
  useDocumentTitle(`${site.name} (${site.domain}) — Pre-Code Restyle Dossier`);

  const idx = ALL_SITES.findIndex((s) => s.slug === site.slug);
  const prevSite = idx > 0 ? ALL_SITES[idx - 1] : undefined;
  const nextSite = idx >= 0 && idx < ALL_SITES.length - 1 ? ALL_SITES[idx + 1] : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DossierHeader activeSlug={site.slug} onOpenExport={() => setExportOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Site Header */}
        <div className="border-b border-border pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
              <span>SITE {site.order} / 05</span>
              <span>·</span>
              <span>{site.domain}</span>
              <span>·</span>
              <span>{site.sector}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={site.designSystemUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground hover:bg-secondary"
              >
                Original Concepts
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
              <Link
                to="/preview/$slug"
                params={{ slug: site.slug }}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MonitorPlay className="h-3.5 w-3.5" />
                Open Live Redesigned Site
              </Link>
            </div>
          </div>

          <h1 className="mt-3 font-editorial text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {site.name}
          </h1>

          {/* Section Jump Links */}
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
            {[
              ["01 Visitor & Goal", "#visitor"],
              ["02 Moodboard", "#moodboard"],
              ["03 Direction Mix", "#direction"],
              ["04 Sitemap & Wireframe", "#wireframe"],
              ["05 Palette & QA", "#palette-qa"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded border border-border bg-card px-2.5 py-1 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* 01 · Visitor & Goal */}
        <section id="visitor" className="scroll-mt-32 border-b border-border py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            01 · Visitor & Goal (3–4 Lines)
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Who visits {site.domain} and what the site must make them do
          </h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            <div className="space-y-3 rounded-md border border-border bg-card p-5 lg:col-span-7">
              {site.visitorBrief.summaryLines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
            </div>

            <dl className="space-y-3 rounded-md border border-border bg-card p-5 text-xs lg:col-span-5">
              <div>
                <dt className="font-mono uppercase tracking-wider text-muted-foreground">
                  Primary Visitor
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  {site.visitorBrief.primaryVisitor}
                </dd>
              </div>
              <div className="border-t border-border/70 pt-2.5">
                <dt className="font-mono uppercase tracking-wider text-muted-foreground">
                  Primary Conversion Goal
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">
                  {site.visitorBrief.primaryAction}
                </dd>
              </div>
              <div className="border-t border-border/70 pt-2.5">
                <dt className="font-mono uppercase tracking-wider text-muted-foreground">
                  Core Proof / Trust Signal
                </dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">
                  {site.visitorBrief.trustSignal}
                </dd>
              </div>
            </dl>
          </div>

          {/* Open Confirmations for this site */}
          <div className="mt-5 rounded-md border border-border bg-secondary/40 p-4">
            <p className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-status-warn" />
              Open Confirmations for Client ({site.clientQuestions.length})
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {site.clientQuestions.map((q) => (
                <li key={q.id} className="rounded border border-border bg-card p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{q.topic}</span>
                    <span className="font-mono text-[10px] text-status-warn">{q.blocking}</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{q.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 02 · Annotated Moodboard */}
        <MoodboardSection references={site.moodboard} siteName={site.name} />

        {/* 03 · Direction Mix */}
        <DirectionMixSection site={site} />

        {/* 04 · Sitemap & Greyscale Wireframe */}
        <section id="wireframe" className="scroll-mt-32 border-b border-border py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            04 · Structure & Content
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Sitemap & Greyscale Homepage Wireframe
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Built strictly in greyscale with zero effects and real Italian copy from{" "}
            <span className="font-mono text-xs text-foreground">content.md</span> so we verify
            information order before applying brand colour.
          </p>

          <div className="mt-6">
            <SitemapView groups={site.sitemap} domain={site.domain} />
            <GreyscaleWireframe sections={site.wireframe} domain={site.domain} />
          </div>
        </section>

        {/* 05 · Locked Palette & QA Gate */}
        <PaletteAndQaSection site={site} />

        {/* Prev / Next Navigation */}
        <nav
          aria-label="Between sites"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"
        >
          {prevSite ? (
            <Link
              to="/site/$slug"
              params={{ slug: prevSite.slug }}
              className="inline-flex items-center gap-2 rounded border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {prevSite.order} {prevSite.name}
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Overview
            </Link>
          )}

          {nextSite ? (
            <Link
              to="/site/$slug"
              params={{ slug: nextSite.slug }}
              className="inline-flex items-center gap-2 rounded bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              {nextSite.order} {nextSite.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Back to 5-Site Overview
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      </main>

      <ExportReplyDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}