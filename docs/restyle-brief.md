# Brief comune per i restyle

Ogni sito ha **3 direzioni di restyle** della homepage. Le direzioni devono essere davvero diverse tra loro (concetto, tipografia, palette, layout, linguaggio di movimento), non varianti dello stesso layout. Servono a scegliere la strada del nuovo design system, quindi ognuna deve rendere chiara e coerente la propria idea.

## Materiale di partenza (per ogni sito, in `brands/<dominio>/`)
- `content.md`: testi reali della homepage in ordine di pagina, più l'elenco degli asset scaricati. **Si usano solo questi contenuti, claim e numeri.** I testi si possono accorciare, riordinare e rendere più incisivi ("giocare con i testi"). Vietato inventare dati, statistiche, clienti, testimonianze, certificazioni o prezzi.
- `assets/`: file originali del sito (logo, foto, favicon). **Il logo resta quello attuale**: si usa il file originale, senza deformarlo, rispettando l'aspect ratio. Si possono mettere accanto un nome in testo e un lockup tipografico, ma il file del logo non si modifica.
- `attuale/tokens.json` e `attuale/*.png`: il design system attuale estratto e gli screenshot.

## Struttura dei file
```
brands/<dominio>/restyle-<n>-<slug>/
  index.html       homepage restyle, completa e navigabile (header, hero, 4-7 sezioni, CTA, footer)
  tokens.css       SOLO variabili CSS del design system della direzione (:root), con un commento per ogni gruppo
  direction.json   metadati (schema sotto), usati per generare le pagine indice
  preview.png      screenshot desktop 1440x900 (fold)
  preview-mobile.png  screenshot mobile 390x844 (fold)
```
I percorsi verso gli asset sono relativi: `../assets/<file>`. Nessun build step: HTML, CSS e JS statici, serviti anche da GitHub Pages.

## direction.json
```json
{
  "n": 1,
  "slug": "editoriale",
  "name": "Nome breve della direzione",
  "concept": "2-3 frasi in italiano semplice: idea, per chi, perché funziona per questo brand",
  "palette": [{"name": "Ink", "hex": "#0A2B33", "role": "testo principale"}],
  "fonts": [{"family": "Fraunces", "role": "titoli", "source": "Google Fonts (OFL)"}],
  "motion": ["SplitText reveal sui titoli", "..."],
  "components": ["hero con ...", "bento grid ...", "..."],
  "fixes": ["problemi del sito attuale risolti, es. contrasto CTA 2.28 → 7.1"],
  "references": [{"label": "Nome sito/pattern", "url": "https://..."}]
}
```

## Stack tecnico (versioni fissate)
- GSAP 3.15.0 da jsDelivr, con i plugin necessari (ScrollTrigger, SplitText, Flip, ecc. sono gratuiti dalla 3.13):
  `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js`, `.../dist/ScrollTrigger.min.js`, `.../dist/SplitText.min.js`
- Font solo da Google Fonts (licenza OFL, uso commerciale ok). Massimo 2 famiglie per direzione.
- Icone: SVG Lucide inline (stroke 1.5 o 2, coerente in tutta la pagina). **Mai emoji come icone.**
- Niente framework. Niente Lenis o smooth scroll che sostituisca lo scroll nativo.

## Movimento: "giochiamo con testi e animazioni"
Ogni direzione ha un linguaggio di movimento riconoscibile. Esempi: titoli che si compongono per parola o lettera (SplitText), sezioni pinnate con scrub, testo che scorre orizzontale, numeri che contano (solo numeri reali presi da content.md), reveal a maschera di immagini, transizioni di colore della pagina allo scroll, parallax leggero, micro-interazioni su CTA e card.
Requisiti obbligatori:
- `prefers-reduced-motion: reduce` → niente animazioni d'ingresso o di scroll, contenuto subito visibile.
- Il contenuto deve essere leggibile anche se il JS non parte: lo stato iniziale nascosto va impostato con JS, non nel CSS.
- Niente cursori custom, niente scroll-jacking che blocchi la pagina più di uno schermo per sezione pinnata.
- Animare solo transform e opacity: 60fps, niente layout thrash.

## Qualità (si verifica prima di consegnare)
- Contrasto WCAG AA su tutto il testo e le CTA (≥4.5:1, testo grande ≥3:1). Correggere i problemi di contrasto del sito attuale e annotarli in `fixes`.
- Responsive: 390px senza scroll orizzontale, gutter laterale di 16px, menu mobile funzionante.
- Zero errori in console. Immagini con `alt`. Un solo H1. Focus visibile.
- Tono italiano naturale, niente lorem ipsum, niente testo segnaposto.
- In fondo a ogni pagina, una barra discreta: "Restyle concept · direzione N di 3 · design system →" con link a `tokens.css` e a `../index.html`.

## Riferimenti
Prima di progettare, guarda online come lavorano i migliori siti del settore e i siti premiati di modern web design (Awwwards, Godly, Land-book, la showcase di GSAP). Annota 2-4 link reali e verificati per ogni direzione in `references`. **Ispirarsi ai pattern, non copiare un sito specifico.**
