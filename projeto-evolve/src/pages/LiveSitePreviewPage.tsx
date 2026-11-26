import { Link, useDocumentTitle } from "@/router";
import { ALL_SITES } from "@/data/sites";
import type { SiteDossier } from "@/data/types";
import { PrivacyMastersSite } from "@/components/previews/PrivacyMastersSite";
import { EvolveSite } from "@/components/previews/EvolveSite";
import { TuttoAltopianoSite } from "@/components/previews/TuttoAltopianoSite";
import { OblivioSite } from "@/components/previews/OblivioSite";
import { MedicleoSite } from "@/components/previews/MedicleoSite";

export function LiveSitePreviewPage({ site }: { site: SiteDossier }) {
  useDocumentTitle(`${site.name} (${site.domain})`);

  return (
    <div>
      <nav aria-label="Siti web" className="no-print border-b border-border bg-foreground text-background">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1 px-4 py-2 text-sm">
          {ALL_SITES.map(({ slug, name }) => (
            <li key={slug}>
              <Link
                to="/preview/$slug"
                params={{ slug }}
                aria-current={slug === site.slug ? "page" : undefined}
                className="block rounded px-3 py-1.5 hover:underline aria-[current=page]:bg-background aria-[current=page]:text-foreground"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {site.slug === "privacymasters" && <PrivacyMastersSite />}
      {site.slug === "bevolve" && <EvolveSite />}
      {site.slug === "tuttoaltopiano" && <TuttoAltopianoSite />}
      {site.slug === "oblivio" && <OblivioSite />}
      {site.slug === "medicleo" && <MedicleoSite />}
    </div>
  );
}
