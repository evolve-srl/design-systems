import { Link, useDocumentTitle } from "@/router";
import { MonitorPlay } from "lucide-react";
import { ALL_SITES } from "@/data/sites";

export function HomePage() {
  useDocumentTitle("Evolve S.r.l. — Sites");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-editorial text-4xl font-medium tracking-tight">Evolve S.r.l.</h1>
        <div className="mt-8 divide-y divide-border rounded-md border border-border bg-card">
          {ALL_SITES.map((site) => (
            <Link
              key={site.slug}
              to="/preview/$slug"
              params={{ slug: site.slug }}
              className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-border"
                  style={{ backgroundColor: site.brandAnchorHex }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-editorial text-2xl font-medium">{site.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{site.domain}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                <MonitorPlay className="h-3.5 w-3.5" />
                Abrir site
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
