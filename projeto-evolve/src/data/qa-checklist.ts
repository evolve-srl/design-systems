export interface QaItem {
  id: string;
  label: string;
  requirement: string;
}

export const NON_NEGOTIABLE_RULES: Array<{ n: string; title: string; detail: string }> = [
  {
    n: "01",
    title: "Locked palette from palettes.json",
    detail:
      "Zero invented hex values or off-palette tints. Use only measured WCAG AA variants when brand colour contrast is below 4.5:1.",
  },
  {
    n: "02",
    title: "Original logo files untouched",
    detail:
      "Never redraw, recolour or stretch logos. Flag small-size legibility issues to the client instead of silently altering marks.",
  },
  {
    n: "03",
    title: "Real client content only",
    detail:
      "Zero invented statistics, claims, testimonials or certifications. Flag missing assets or conflicting copy explicitly.",
  },
  {
    n: "04",
    title: "WCAG 2.1 AA + Reduced motion",
    detail:
      "4.5:1 text / 3:1 large text including hover and photo overlays; visible keyboard focus; zero motion under prefers-reduced-motion.",
  },
  {
    n: "05",
    title: "Responsive 390px to 1440px",
    detail:
      "Tested at 390, 768, 1280 and 1440px with zero horizontal overflow, working mobile navigation and readable content without JS.",
  },
  {
    n: "06",
    title: "Garante cookie compliance & hygiene",
    detail:
      "No non-essential cookies before consent, equal-weight Reject button, zero builder badges, Lighthouse mobile >= 90.",
  },
];

export const DEFINITION_OF_DONE: QaItem[] = [
  {
    id: "palette-audit",
    label: "Palette audit",
    requirement: "Only colours from data/palettes.json appear in CSS and JS.",
  },
  {
    id: "original-logo",
    label: "Original logo integrity",
    requirement: "Original logo file preserved with aspect ratio intact; legibility flags raised.",
  },
  {
    id: "client-copy",
    label: "Approved real content",
    requirement: "All texts, numbers and sources verified by client; zero placeholders shipped.",
  },
  {
    id: "wcag-contrast",
    label: "WCAG 2.1 AA contrast",
    requirement: "Measured >= 4.5:1 body / >= 3:1 large text across normal, hover and image overlays.",
  },
  {
    id: "keyboard-focus",
    label: "Keyboard & focus order",
    requirement: "Full keyboard navigation, skip link, one H1 and visible focus rings.",
  },
  {
    id: "reduced-motion",
    label: "Reduced motion & no-JS",
    requirement: "Readable without JavaScript; animations disabled under prefers-reduced-motion.",
  },
  {
    id: "responsive-grid",
    label: "Responsive 390-1440px",
    requirement: "Zero horizontal scroll or text overlap at 390, 768, 1280 and 1440px.",
  },
  {
    id: "zero-errors",
    label: "Zero console & link errors",
    requirement: "Zero console errors, zero broken links, zero broken images, no builder badges.",
  },
  {
    id: "lighthouse-90",
    label: "Lighthouse mobile >= 90",
    requirement: "Performance >= 90 and Accessibility >= 90 on mobile, report attached.",
  },
  {
    id: "cross-browser",
    label: "Cross-browser check",
    requirement: "Verified on Chrome, Safari (macOS & iOS), Firefox and Edge.",
  },
  {
    id: "seo-cookie",
    label: "Metadata & Garante banner",
    requirement: "Unique title, description, favicon and Italian Garante cookie banner with Reject.",
  },
  {
    id: "screenshots",
    label: "Desktop & mobile screenshots",
    requirement: "Full screenshots attached with final delivery.",
  },
];