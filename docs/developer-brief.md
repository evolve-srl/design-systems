# Developer brief: five professional websites

This brief is for the developer building the new websites. It explains what each site is for, who reads it, and the quality level we expect.

**In short:** each of these sites represents a real business that clients trust with something serious: their company's security, their legal reputation, the safety of an elderly parent. The site is often the first proof that this trust is deserved. A site that looks like a template or a generic "AI-generated" landing page damages the business. **We will not accept work below a professional studio standard.**

Everything you need is in this repository:

- `brands/<site>/attuale/`: the current design system, measured from the live site, with a list of what to keep and what to fix.
- `brands/<site>/restyle-*/`: three homepage concepts per site. They show direction, mood and motion. They are not final templates to copy as they are.
- `brands/<site>/content.md`: the real texts, figures and claims of the current homepage.
- `data/palettes.json`: **the approved colours of every site**. This is the single source of truth for colour.

Live version: https://evolve-srl.github.io/design-systems/

---

## Non-negotiable rules (all five sites)

1. **Original palette, anchored on the logo.** Use only the colours in `data/palettes.json` for that site. Do not add new colours, tints, "accent" hues or coloured shadows. Where the brand colour is not readable as text, use the darker or lighter *variant* listed there, which is the same hue already measured for contrast. For a lighter tint, use transparency of an allowed colour, not a new hex value.
2. **The logo is the original file.** Never redraw it, recolour it or stretch it. Always keep its aspect ratio. If a logo is weak at small sizes (see each site), tell us. Do not fix it yourself.
3. **Real content only.** Texts may be shortened and made sharper. Numbers, claims, certifications, client names, testimonials and prices come only from the client. Never invent them and never use placeholders in a delivered page.
4. **Accessibility (WCAG 2.1 AA).**
   - Text contrast must be at least 4.5:1, or 3:1 for large text, including buttons, hover states and text over photos.
   - Keyboard navigation must work, with a visible focus.
   - One H1 per page, headings in order, `alt` on every meaningful image.
   - With `prefers-reduced-motion: reduce`, there are no entrance or scroll animations.
5. **Responsive.**
   - Test at 390px, 768px, 1280px and 1440px.
   - No horizontal scroll and no overlapping text at any width.
   - The mobile menu must work.
6. **Motion with purpose.**
   - Animations must support the message, never delay it. Content must be readable before animations run and without JavaScript.
   - Animate only `transform` and `opacity`.
   - No custom cursors and no scroll-jacking.
7. **Performance.**
   - Images in modern formats (WebP/AVIF), sized for their slot, lazy-loaded below the fold.
   - Fonts self-hosted or from Google Fonts with explicit weights, at most 2 families.
   - Target Lighthouse ≥ 90 on Performance and Accessibility (mobile).
8. **Production hygiene.**
   - No builder badges (for example "Edit with Lovable"), console errors or broken links.
   - Correct `<title>`, meta description and favicon on every page.
   - Cookie banner that follows the Italian data protection authority's cookie guidelines (Garante, June 2021): no non-essential cookies before consent, and refusing must be as easy as accepting. We use a clearly visible "Reject" button.
9. **Cross-browser.** Chrome, Safari (macOS and iOS), Firefox and Edge, on real devices where possible.

---

## The five sites

### 1. privacymasters.it: cybersecurity, privacy and compliance

- **What it is:** the cybersecurity and compliance brand of Evolve S.r.l. (Rovigo). Lawyers, ethical hackers, investigators and engineers in one team. They cover GDPR, NIS2, DORA, the AI Act, investigations and physical security.
- **Who reads it:** business owners, managers and compliance officers who need to meet regulations and fear an attack or a fine.
- **What the site must do:** convey authority and precision, then drive visitors to the free check-up ("Check-up gratuito") or to a talk with an expert.
- **What "professional" means here:**
  - It must feel like a serious security firm: calm, exact, technical where useful.
  - Never "hacker" clichés: no matrix rain, no glitch effects, no stock hooded figures.
  - Regulations must be named correctly.
- **Palette:**
  - Logo green `#129740` is the brand colour. For text and buttons on white use `#0F8036`; for green on dark use `#13A445`.
  - Petrol `#0A2B33` is the dark colour.
  - The current mint `#00C483` is retired: it fails contrast (2.28:1 with white text) and does not match the logo.
- **Fix:**
  - The logo at 32px makes its embedded tagline unreadable. Ask us for a simplified mark.

### 2. bevolve.it: Evolve S.r.l., IT system integrator

- **What it is:** a system integrator based in Rovigo. It delivers software and AI, cybersecurity, networks and engineering for companies and public administration.
- **Who reads it:** companies and public bodies looking for a reliable technology partner, often non-technical decision makers.
- **What the site must do:**
  - Make clear what Evolve does, for whom, and why it is reliable and close by.
  - Lead visitors to "Richiedi consulenza".
- **What "professional" means here:** an engineering company, solid and organised. It should be clean but not anonymous: today's site is tidy but the brand colour is almost invisible.
- **Palette:**
  - The logo is monochrome. The brand is the site's navy family: `#11338A`, `#3B5BC9`, `#1E3A8A`, `#0F1F4D`, `#0F172A`.
  - The gradient `#3B5BC9 → #1E3A8A → #0F1F4D` is the signature.
  - Use navy with confidence, not only on one button.
- **Fix:**
  - The wordmark has strokes about 1px thick and becomes fragile when small or on colour. Test it and report.
  - The favicon does not match the logo.

### 3. tuttoaltopiano.it: guide to the Asiago plateau

- **What it is:** an independent guide to the Altopiano dei Sette Comuni (Asiago, Gallio, Roana). It covers trails, malghe (mountain dairies), Great War sites, snow and events. "Nando", the assistant, answers questions.
- **Who reads it:** visitors planning a trip or deciding what to do today, often on a phone, outdoors.
- **What the site must do:**
  - Make visitors want to go, then help them decide quickly: where to go today, trails, weather and snow.
  - Make "Chiedi a Nando" easy to find.
- **What "professional" means here:**
  - An editorial, trustworthy guide with real photography of the place. Never a generic tourism template or stock imagery from other mountains.
  - Information must be up to date and fast on mobile networks.
- **Palette:**
  - Forest green `#1F4D32` (logo and site) and ochre `#CD8643` as accent.
  - Cream `#FAF9F1` / `#EDEBDC` for paper surfaces.
  - Ochre text must use `#A4662C` on white or `#9F632A` on cream. The current ochre button with light text fails contrast (2.88:1).
- **Fix:**
  - Remove the "Edit with Lovable" badge from production.
  - Provide the logo as a real SVG file. Today it exists only inline in the header.

### 4. oblivio.legal: right to be forgotten

- **What it is:** lawyers and IT specialists who remove harmful, outdated or wrong information from Google and social networks. Their work covers the right to be forgotten, de-indexing, formal notices and legal action.
- **Who reads it:** private people and professionals in a vulnerable moment. Often they were acquitted, but search results still accuse them.
- **What the site must do:**
  - Reassure, explain the process clearly, and lead to the free evaluation ("Valutazione gratuita") or the packages.
  - Leave no doubt about confidentiality and timing.
- **What "professional" means here:**
  - The discretion and authority of a law firm, the clarity of a good service.
  - Never sensational and never "dark web" imagery.
  - Every example must be labelled as illustrative, as the current site does.
- **Palette:**
  - Logo blue `#1D4ED8` is the brand colour. It replaces the current `#0068CB`, so that logo and interface use the same blue.
  - Sky `#0B94C1` and green `#00AA6F` are secondary accents. Green is only for "done/removed" states.
  - Gradient `#1D4ED8 → #0B94C1`.
- **Fix:**
  - The mint floating "call me back" button is off-palette and competes with the chat button. Keep one floating action.
  - The site states both "< 24h" and "48 ore" as response time. The client must confirm one before launch.

### 5. medicleo.com: radar safety sensor for elderly people at home

- **What it is:** a non-invasive radar sensor that watches over elderly and fragile people day and night. It sends immediate alerts to family and carers, with no cameras and nothing to wear.
- **Who reads it:**
  - adult children worried about a parent living alone;
  - carers and care professionals.
- **What the site must do:** build trust in a health-related product, explain how it works and the privacy guarantees (no cameras), then lead to "Richiedi una demo".
- **What "professional" means here:**
  - Medical-grade credibility with human warmth.
  - The existing figures and their sources must stay, accurate and cited.
  - No fear-based imagery and no fake testimonials.
- **Palette:**
  - The site's blues are the base: petrol `#00558B`, night `#002946`, teal `#007373`.
  - The logo's cyan `#01AEEF` and magenta `#ED0F63` are accents only. Cyan stands for the technology; magenta is used sparingly, for alerts and the one key call to action (button `#DF0E5D` with white text).
  - Never use magenta as a large background.
- **Fix:**
  - The header shows the logo (which contains "MediCleo") next to the text "Medicleo": two spellings side by side. Show the name once.
  - The 300px raster logo is at the limit of legibility at 44px.

---

## Definition of done (for every page you deliver)

- [ ] Only colours from `data/palettes.json`. Searching the CSS and JS for any other hex value finds nothing.
- [ ] Original logo file, not deformed.
- [ ] All texts and numbers approved by the client, with no placeholders.
- [ ] WCAG AA contrast measured, including hover states and text on images.
- [ ] Keyboard and focus tested.
- [ ] Reduced motion tested, and content readable without JavaScript.
- [ ] No horizontal scroll and no overlap at 390, 768, 1280 and 1440px.
- [ ] Zero console errors and zero broken links or images.
- [ ] Lighthouse mobile ≥ 90 on Performance and Accessibility, with the report attached.
- [ ] Tested on Chrome, Safari (incl. iOS), Firefox and Edge.
- [ ] Title, meta description, favicon and cookie banner (no tracking before consent, visible "Reject") in place.
- [ ] Screenshots desktop and mobile of every page sent with the delivery.

When something in this brief conflicts with a client request, or a rule cannot be met, **ask before deciding**. Do not ship a compromise silently.
