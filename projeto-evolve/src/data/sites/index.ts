import { PRIVACYMASTERS_DOSSIER } from "./privacymasters";
import { BEVOLVE_DOSSIER } from "./bevolve";
import { TUTTOALTOPIANO_DOSSIER } from "./tuttoaltopiano";
import { OBLIVIO_DOSSIER } from "./oblivio";
import { MEDICLEO_DOSSIER } from "./medicleo";
import type { SiteDossier, SiteSlug } from "../types";

export const ALL_SITES: SiteDossier[] = [
  PRIVACYMASTERS_DOSSIER,
  BEVOLVE_DOSSIER,
  TUTTOALTOPIANO_DOSSIER,
  OBLIVIO_DOSSIER,
  MEDICLEO_DOSSIER,
];

export function getSiteBySlug(slug: string): SiteDossier | undefined {
  return ALL_SITES.find((site) => site.slug === (slug as SiteSlug));
}

export function buildClientReplyMarkdown(sites: SiteDossier[] = ALL_SITES): string {
  const lines: string[] = [
    "# Pre-Code Restyle Delivery — Evolve S.r.l. (5 Websites)",
    "",
    "Hi team,",
    "",
    "Here is the complete Phase 1 delivery requested before coding: visitor & goal brief, annotated moodboard (9 references per site), recommended direction mix, sitemap, greyscale homepage wireframe structure, and open client confirmations for each of the five websites.",
    "",
  ];

  for (const site of sites) {
    lines.push(`---`, ``, `## ${site.order}. ${site.name} (${site.domain})`, ``);
    lines.push(`### Visitor & Goal`);
    for (const s of site.visitorBrief.summaryLines) {
      lines.push(`- ${s}`);
    }
    lines.push(`- **Primary action:** ${site.visitorBrief.primaryAction}`, ``);

    lines.push(`### Recommended Direction / Mix`);
    lines.push(`**${site.recommendedMix.title}**`);
    lines.push(site.recommendedMix.summary, ``);
    for (const row of site.recommendedMix.rows) {
      lines.push(`- **${row.section}** (${row.source}): ${row.rationale}`);
    }
    lines.push(``);

    lines.push(`### Annotated Moodboard (${site.moodboard.length} references)`);
    for (const ref of site.moodboard) {
      lines.push(`- **${ref.title}** [${ref.gallery} · ${ref.pattern}] (${ref.url}) — ${ref.takeaway}`);
    }
    lines.push(``);

    lines.push(`### Sitemap & Greyscale Homepage Order`);
    for (const group of site.sitemap) {
      lines.push(`- **${group.label}:** ${group.items.map((i) => `${i.title} (${i.path})`).join(" · ")}`);
    }
    lines.push(`- **Homepage Wireframe Sequence:** ${site.wireframe.map((w) => `${w.order} ${w.name}`).join(" -> ")}`, ``);

    lines.push(`### Open Confirmations Needed Before Launch`);
    for (const q of site.clientQuestions) {
      lines.push(`- [${q.blocking}] **${q.topic}:** ${q.detail}`);
    }
    lines.push(``);
  }

  return lines.join("\n");
}