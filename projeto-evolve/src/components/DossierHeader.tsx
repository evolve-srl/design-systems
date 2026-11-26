import { Link } from "@/router";
import { FileText, ExternalLink, Layers } from "lucide-react";
import { ALL_SITES } from "@/data/sites";
import type { SiteSlug } from "@/data/types";
import { Button } from "@/components/ui/button";

interface DossierHeaderProps {
  activeSlug?: SiteSlug;
  onOpenExport: () => void;
}

export function DossierHeader({ activeSlug, onOpenExport }: DossierHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="group flex items-baseline gap-2.5 min-w-0">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              EVOLVE S.R.L.
            </span>
            <span className="font-editorial text-lg font-medium text-foreground truncate group-hover:underline">
              Restyle Dossier
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://evolve-srl.github.io/design-systems/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Source Repo
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button size="sm" variant="default" onClick={onOpenExport} className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Client Reply</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      <nav
        aria-label="Sites navigation"
        className="border-t border-border/70 bg-card/70 overflow-x-auto"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-1.5 sm:px-6 min-w-max">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              !activeSlug
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Overview (5 Sites)
          </Link>
          <span className="mx-1 h-3.5 w-px bg-border" aria-hidden="true" />
          {ALL_SITES.map((site) => {
            const isActive = activeSlug === site.slug;
            return (
              <Link
                key={site.slug}
                to="/site/$slug"
                params={{ slug: site.slug }}
                className={`inline-flex items-center gap-2 rounded px-2.5 py-1 text-xs transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{site.order}</span>
                <span>{site.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}