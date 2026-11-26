export type SiteSlug =
  | "privacymasters"
  | "bevolve"
  | "tuttoaltopiano"
  | "oblivio"
  | "medicleo";

export type PatternCategory =
  | "Grid & Layout"
  | "Typography"
  | "Numbers & Data"
  | "Interaction & Motion"
  | "Mobile & Utility";

export interface MoodboardReference {
  id: string;
  title: string;
  url: string;
  gallery: string;
  sectorScope: "Same sector" | "Outside sector";
  pattern: PatternCategory;
  takeaway: string;
}

export interface OfficialDirection {
  number: 1 | 2 | 3;
  slug: string;
  name: string;
  previewUrl: string;
  fonts: string;
  tone: string;
  strength: string;
  tradeoff: string;
}

export interface CustomMixRow {
  section: string;
  source: string;
  rationale: string;
}

export interface SitemapGroup {
  label: string;
  items: Array<{
    title: string;
    path: string;
    note?: string;
  }>;
}

export type WireframeBlockKind =
  | "header"
  | "hero"
  | "stats"
  | "grid-4"
  | "process"
  | "split"
  | "list"
  | "faq"
  | "cta"
  | "footer";

export interface WireframeSection {
  id: string;
  order: string;
  name: string;
  kind: WireframeBlockKind;
  visitorQuestion: string;
  eyebrow?: string;
  headline: string;
  subcopy?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  mediaPlaceholder?: string;
  items?: Array<{ label: string; detail?: string; meta?: string }>;
  footnote?: string;
}

export interface PaletteColor {
  name: string;
  hex: string;
  group: "Base" | "WCAG AA Variant" | "Neutral";
  use: string;
}

export interface ClientQuestion {
  id: string;
  topic: string;
  detail: string;
  blocking: "Before design system" | "Before launch";
}

export interface SiteDossier {
  order: string;
  slug: SiteSlug;
  name: string;
  domain: string;
  sector: string;
  designSystemUrl: string;
  liveUrl: string;
  primaryCta: string;
  brandAnchorHex: string;
  visitorBrief: {
    summaryLines: string[];
    primaryVisitor: string;
    secondaryVisitor: string;
    primaryAction: string;
    trustSignal: string;
  };
  clientQuestions: ClientQuestion[];
  moodboard: MoodboardReference[];
  officialDirections: OfficialDirection[];
  recommendedMix: {
    title: string;
    summary: string;
    typePairing: string;
    motionRule: string;
    rows: CustomMixRow[];
  };
  sitemap: SitemapGroup[];
  wireframe: WireframeSection[];
  palette: {
    logoHexes: string[];
    gradient?: string;
    colors: PaletteColor[];
    forbidden: string[];
  };
}