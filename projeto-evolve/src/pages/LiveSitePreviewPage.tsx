import { Link, useDocumentTitle } from "@/router";
import { ArrowLeft } from "lucide-react";
import { ALL_SITES } from "@/data/sites";
import type { SiteDossier } from "@/data/types";
import { PrivacyMastersSite } from "@/components/previews/PrivacyMastersSite";
import { EvolveSite } from "@/components/previews/EvolveSite";
import { TuttoAltopianoSite } from "@/components/previews/TuttoAltopianoSite";
import { OblivioSite } from "@/components/previews/OblivioSite";
import { MedicleoSite } from "@/components/previews/MedicleoSite";


export function LiveSitePreviewPage({ site }: { site: SiteDossier }) {

  useDocumentTitle(`${site.name} (${site.domain}) — Restyled Production Prototype`);

  return (
    <div>
      {/* Minimal studio switcher bar so reviewer can toggle between live sites and Phase 1 dossiers */}
      <div className="no-print border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-x-auto px-4 py-2 text-xs">
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/site/$slug"
              params={{ slug: site.slug }}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] opacity-90 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Phase 1 Dossier
            </Link>
            <span className="opacity-35">|</span>
            <span className="font-mono text-[11px] opacity-75">
              LIVE PROTOTYPE · {site.domain} · PALETTES.JSON LOCKED
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {ALL_SITES.map((s) => (
              <Link
                key={s.slug}
                to="/preview/$slug"
                params={{ slug: s.slug }}
                className={`rounded px-2 py-0.5 font-mono text-[11px] transition-opacity ${
                  s.slug === site.slug
                    ? "bg-background text-foreground font-semibold"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                {s.order} {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {site.slug === "privacymasters" && <PrivacyMastersSite />}
      {site.slug === "bevolve" && <EvolveSite />}
      {site.slug === "tuttoaltopiano" && <TuttoAltopianoSite />}
      {site.slug === "oblivio" && <OblivioSite />}
      {site.slug === "medicleo" && <MedicleoSite />}
    </div>
  );
}