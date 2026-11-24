# Design system — Evolve

Design system attuali e direzioni di restyle per cinque siti:

| Sito | Settore |
|---|---|
| [privacymasters.it](https://privacymasters.it) | Cybersecurity, privacy e conformità |
| [bevolve.it](https://bevolve.it) | System integrator (software, AI, cyber, reti) |
| [tuttoaltopiano.it](https://tuttoaltopiano.it) | Guida all'Altopiano di Asiago |
| [oblivio.legal](https://oblivio.legal) | Diritto all'oblio |
| [medicleo.com](https://medicleo.com) | Sensore radar per la sicurezza degli anziani a casa |

Per ogni sito ci sono:

1. **Il design system attuale** (`brands/<sito>/attuale/`): colori per ruolo, tipografia, componenti, forme, screenshot desktop e mobile, e una diagnosi in linguaggio semplice di cosa tenere e cosa correggere.
2. **Tre direzioni di restyle** (`brands/<sito>/restyle-*/`): homepage concept animate con GSAP, costruite con i testi e il logo reali e con la palette originale del sito (`data/palettes.json`). Ognuna ha il suo `tokens.css`.

Il sito si apre da `index.html`.

## Struttura

```
index.html                  home
assets/site.css             stile delle pagine di documentazione
data/brands.json            descrizione e diagnosi di ogni brand
data/palettes.json          palette approvate per sito (originali, ancorate al logo): unica fonte dei colori
docs/restyle-brief.md       regole comuni per i restyle
docs/developer-brief.md     brief per lo sviluppatore dei nuovi siti (in inglese)
brands/<sito>/
  index.html                pagina del brand (attuale + 3 direzioni)
  content.md                testi reali della homepage (fonte dei restyle)
  assets/                   logo e immagini originali del sito
  attuale/
    index.html              tavola del design system attuale
    tokens.json             valori estratti dal browser
    *.webp, *.jpg           screenshot
  restyle-<n>-<nome>/
    index.html              homepage concept
    tokens.css              design system della direzione
    direction.json          metadati (concept, palette, font, movimento, riferimenti)
tools/                      script di estrazione e generazione
```

## Rigenerare

Le pagine HTML di `index.html`, `brands/*/index.html` e `brands/*/attuale/index.html` sono generate: non vanno modificate a mano.

```bash
python3 -I tools/build_site.py
```

Per rifare l'estrazione da zero servono Node e Playwright (`npm i playwright`):

```bash
node tools/extract.mjs brands-raw privacymasters.it bevolve.it tuttoaltopiano.it oblivio.legal medicleo.com
```

```bash
node tools/content.mjs brands privacymasters.it bevolve.it tuttoaltopiano.it oblivio.legal medicleo.com
```

```bash
tools/optimize_images.sh brands
```

`extract.mjs` scrive in `brands-raw/<sito>/`: il contenuto va poi spostato in `brands/<sito>/attuale/`. Lo script contiene il percorso del Chromium locale di Playwright: adattalo alla tua macchina.

## Metodo

- I valori del sito attuale sono gli **stili computati dal browser** (Chromium headless) su homepage e pagine interne, a 1440px e 390px, estratti il 23/11/2026. Il banner cookie è stato chiuso con "Rifiuta".
- I contrasti seguono WCAG 2.1 (testo normale ≥ 4.5:1, testo grande ≥ 3:1).
- I colori dei loghi raster sono campionati dai file originali, con precisione di ±16 per canale.
- Gli screenshot sono convertiti in WebP (qualità 82) e, per le pagine intere, in JPEG (qualità 75, larghezza 1440px).

## Note

Loghi, fotografie e testi appartengono ai rispettivi titolari. I restyle sono concept di studio, non siti in produzione.
