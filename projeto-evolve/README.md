# Evolve S.r.l. — 5-Site Restyle Dossier & Live Prototypes

A standalone **React + TypeScript** app (Vite, no backend, no accounts) containing everything
requested in the brief:

- **Phase 1 pre-code dossier** for all five websites — visitor & goal statements, annotated
  moodboards (9 references each), recommended direction mixes, sitemaps, strict greyscale
  homepage wireframes, locked palettes and the QA gate.
- **Phase 2 live prototypes** — the five restyled websites, palette-locked to `data/palettes.json`.
- **Export client reply** — one click produces the ready-to-send Markdown package.

## Open it in Visual Studio Code

1. Unzip the folder.
2. In VS Code: **File → Open Folder…** and pick this folder.
3. Open the integrated terminal (`` Ctrl+` `` / `` Cmd+` ``) and run:

```bash
npm install
npm run dev
```

If `npm install` ever fails on your machine, use either of these instead — both install the
exact same packages:

```bash
npm install --legacy-peer-deps
# or
bun install
```

Then `npm run dev` (or `bun run dev`) still works the same way.

4. VS Code prints a local address (usually `http://localhost:5173`) — open it in your browser.

## Commands

| Command             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Start the app locally with hot reload                   |
| `npm run build`     | Produce the static site in `dist/`                      |
| `npm run preview`   | Serve the built `dist/` locally                         |
| `npm run typecheck` | TypeScript check                                        |
| `npm test`          | Run the compliance tests (palette lock, dossier rules)  |

## Where things live

```
src/
  data/
    types.ts            Shared TypeScript types for a site dossier
    qa-checklist.ts     Non-negotiable brief rules + definition of done
    sites/              One module per website (brief, moodboard, mix,
                        sitemap, wireframe, palette, open questions)
  components/
    DossierHeader.tsx        Sticky navigation across the five sites
    MoodboardSection.tsx     Annotated reference grid
    DirectionMixSection.tsx  Recommended direction comparison
    SitemapView.tsx          Sitemap tree
    GreyscaleWireframe.tsx   Monochrome homepage wireframe (desktop / mobile)
    PaletteAndQaSection.tsx  Locked palette + QA checklist
    ExportReplyDialog.tsx    Markdown export
    previews/                The five live restyled websites
  pages/                Overview, dossier page, live-site page
  router.tsx            Tiny hash router (`#/site/medicleo`)
  test/                 Compliance tests
```

## Notes

- Routing uses the URL hash (`#/site/medicleo`, `#/preview/oblivio`) so the built `dist/`
  folder works on any static host or opened directly from disk.
- Section jump links inside a page (`#visitor`, `#mc-contatti`) are in-page anchors and do not
  change the route.
- The QA checklist and the Medicleo contact form store state in the browser's local storage —
  they are review aids, not a database.
- Client decisions still open are listed on the overview page and inside each dossier; nothing
  was decided silently.
