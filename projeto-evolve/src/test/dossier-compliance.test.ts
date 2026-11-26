import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ALL_SITES, buildClientReplyMarkdown } from "@/data/sites";
import { resolveRoute, toHref, pathFromHash } from "@/router";

const APPROVED_HEXES_BY_PREVIEW: Record<string, string[]> = {
  "PrivacyMastersSite.tsx": [
    "#129740",
    "#0A2B33",
    "#0F8036",
    "#13A445",
    "#FFFFFF",
    "#F5F9FA",
    "#55666F",
    "#D8DFE3",
  ],
  "EvolveSite.tsx": [
    "#11338A",
    "#3B5BC9",
    "#1E3A8A",
    "#0F1F4D",
    "#0F172A",
    "#6D85D7",
    "#FFFFFF",
    "#F5F5F5",
    "#F2F2F2",
    "#0B0B0B",
    "#555555",
    "#DEDEDE",
  ],
  "TuttoAltopianoSite.tsx": [
    "#1F4D32",
    "#CD8643",
    "#A4662C",
    "#9F632A",
    "#FFFFFF",
    "#FAF9F1",
    "#EDEBDC",
    "#141D16",
    "#586156",
    "#DEDFD4",
  ],
  "OblivioSite.tsx": [
    "#1D4ED8",
    "#0B94C1",
    "#00AA6F",
    "#097EA4",
    "#008658",
    "#4E76E7",
    "#FFFFFF",
    "#EBF2F8",
    "#DBF1FF",
    "#031222",
    "#596571",
    "#DEE5EC",
  ],
  "MedicleoSite.tsx": [
    "#00558B",
    "#002946",
    "#007373",
    "#01AEEF",
    "#ED0F63",
    "#017DAC",
    "#DF0E5D",
    "#F4508E",
    "#FFFFFF",
    "#ECF5F8",
    "#E5F5FA",
    "#0D2131",
    "#4C5D6A",
    "#D7E4E9",
    "#EEF7FA",
  ],
};

describe("Evolve 5-site delivery compliance", () => {
  it("covers all five requested domains with 8–12 annotated moodboard references each", () => {
    expect(ALL_SITES.map((s) => s.domain)).toEqual([
      "privacymasters.it",
      "bevolve.it",
      "tuttoaltopiano.it",
      "oblivio.legal",
      "medicleo.com",
    ]);

    for (const site of ALL_SITES) {
      expect(site.visitorBrief.summaryLines.length).toBeGreaterThanOrEqual(3);
      expect(site.moodboard.length).toBeGreaterThanOrEqual(8);
      expect(site.moodboard.length).toBeLessThanOrEqual(12);
      expect(site.officialDirections).toHaveLength(3);
      expect(site.wireframe.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("matches dossier and live preview routes for all five sites", () => {
    for (const site of ALL_SITES) {
      expect(resolveRoute(`/site/${site.slug}`)).toEqual({ kind: "dossier", slug: site.slug });
      expect(resolveRoute(`/preview/${site.slug}`)).toEqual({
        kind: "preview",
        slug: site.slug,
      });
    }
    expect(resolveRoute("/")).toEqual({ kind: "home" });
    expect(resolveRoute("/site/unknown")).toEqual({ kind: "dossier", slug: "unknown" });
    expect(resolveRoute("/nope/x")).toEqual({ kind: "not-found", path: "/nope/x" });
  });

  it("keeps in-page anchors out of the router", () => {
    expect(pathFromHash("#mc-contatti")).toBeUndefined();
    expect(pathFromHash("#/site/medicleo")).toBe("/site/medicleo");
    expect(toHref("/site/$slug", { slug: "oblivio" })).toBe("#/site/oblivio");
  });

  it("uses strictly approved palettes.json hex colours inside every live website component", () => {
    const hexRegex = /#[0-9A-Fa-f]{6}\b/g;
    for (const [fileName, allowed] of Object.entries(APPROVED_HEXES_BY_PREVIEW)) {
      const source = readFileSync(
        resolve(process.cwd(), "src/components/previews", fileName),
        "utf-8",
      );
      const found = Array.from(new Set((source.match(hexRegex) ?? []).map((h) => h.toUpperCase())));
      const allowedSet = new Set(allowed.map((h) => h.toUpperCase()));
      const unauthorized = found.filter((hex) => !allowedSet.has(hex));
      expect(unauthorized, `${fileName} contains off-palette hexes`).toEqual([]);
    }
  });

  it("generates a complete client reply Markdown covering all five sites", () => {
    const md = buildClientReplyMarkdown();
    for (const site of ALL_SITES) {
      expect(md).toContain(site.domain);
      expect(md).toContain(site.recommendedMix.title);
    }
  });
});
