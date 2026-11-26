import { useState } from "react";
import { Menu, X, MessageCircle, Compass, CloudSnow, Mountain } from "lucide-react";
import { GaranteCookieBanner } from "./GaranteCookieBanner";

const BASE = "https://evolve-srl.github.io/design-systems/brands/tuttoaltopiano.it/assets/";

const TOWNS = [
  { name: "Asiago", alt: "1.001 m", desc: "Il capoluogo dell'Altopiano: il Corso, il Sacrario militare del Leiten, l'Osservatorio astrofisico e il formaggio DOP." },
  { name: "Gallio", alt: "1.090 m", desc: "Il paese delle malghe e della neve: da qui si sale a Melette e Campomulo, cuore dello sci di fondo." },
  { name: "Roana", alt: "992 m", desc: "Il comune cimbro per eccellenza, con Mezzaselva, Canove, Camporovere, Cesuna e il celebre Ponte di Roana." },
  { name: "Rotzo", alt: "935 m", desc: "Terra del patatino di Rotzo, con l'altura di Castelletto e le viste sulla Val d'Astico." },
];

const TRAILS = [
  { name: "Anello del Monte Zebio", level: "Facile", duration: "2h 30'" },
  { name: "Cima Portule dalla Bocchetta Portule", level: "Medio", duration: "4h 30'" },
  { name: "Anello della Marcesina", level: "Facile", duration: "2h 45'" },
  { name: "Sentiero delle Calà – Val Frenzela", level: "Impegnativo", duration: "3h 30'" },
  { name: "Monte Fior e Castelgomberto", level: "Medio", duration: "3h 45'" },
];

const EVENTS = [
  { title: "Mercatini di Natale", when: "Dicembre · Asiago, Gallio, Canove" },
  { title: "Capodanno in piazza", when: "31 dicembre · Asiago" },
  { title: "Gran Fondo Val Formica", when: "Gennaio – febbraio · Campomulo (Gallio)" },
  { title: "Carnevale cimbro", when: "Febbraio · Roana e frazioni" },
  { title: "Risveglio delle malghe", when: "Maggio – giugno · Pascoli di Gallio ed Enego" },
];

const NANDO_PROMPTS: Array<{ q: string; hint: string }> = [
  { q: "Che sentiero faccio con i bambini?", hint: "Suggerimento dalla guida: Anello del Monte Zebio (Facile · 2h 30') o Anello della Marcesina (Facile · 2h 45')." },
  { q: "Dove si scia oggi sull'Altopiano?", hint: "Campomulo (Gallio) e Marcesina per il fondo, Kaberlaba per la discesa — verifica sempre il bollettino neve aggiornato." },
  { q: "Cosa vedo in un giorno tra Asiago e Gallio?", hint: "Il giro classico: Corso di Asiago, Sacrario Militare del Leiten, Piana della Marcesina e sosta in malga." },
  { q: "Quali malghe sono aperte a settembre?", hint: "Nando consulta orari stagionali e aperture delle malghe tra Gallio, Asiago ed Enego su tuttoaltopiano.it/chiedi-a-nando." },
];

const ITINERARIES = [
  { tag: "1 GIORNO · PRIMA VOLTA", title: "L'Altopiano in 1 giorno", desc: "Il giro classico tra Asiago, Gallio e Roana per chi ha solo una giornata." },
  { tag: "2 GIORNI · FAMIGLIE", title: "2 giorni con bambini", desc: "Percorsi facili, animali, parco avventura e una serata sotto le stelle." },
  { tag: "2 GIORNI · STORIA", title: "2 giorni sulla Grande Guerra", desc: "Trincee, sacrari e musei per capire il fronte dell'Altopiano." },
  { tag: "3 GIORNI · ESCURSIONISTI", title: "3 giorni di trekking", desc: "Le cime maggiori dell'Altopiano, dormendo tra Gallio e Asiago." },
  { tag: "2 GIORNI · INVERNO", title: "Weekend sulla neve", desc: "Fondo a Campomulo, discesa al Kaberlaba e ciaspole in Marcesina." },
  { tag: "2 GIORNI · COPPIE", title: "Autunno slow tra le contrade", desc: "Foliage, mercatini del formaggio e passeggiate senza fatica." },
];

export function TuttoAltopianoSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [cookieSignal, setCookieSignal] = useState(0);
  const activePrompt = NANDO_PROMPTS[selectedPrompt] ?? NANDO_PROMPTS[0]!;

  return (
    <div style={{ backgroundColor: "#FAF9F1", color: "#141D16" }} className="min-h-screen font-sans">
      <header
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "#FAF9F1", borderColor: "#DEDFD4" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <a href="#ta-main" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider" style={{ color: "#1F4D32" }}>
            <Mountain className="h-4 w-4" aria-hidden="true" />
            <span>TUTTOALTOPIANO</span>
          </a>

          <nav aria-label="Principale" className="hidden items-center gap-5 text-sm md:flex">
            {[
              ["Dove oggi", "#ta-oggi"],
              ["Meteo & neve", "#ta-meteo"],
              ["Sentieri", "#ta-sentieri"],
              ["Itinerari", "#ta-itinerari"],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ color: "#141D16" }} className="hover:underline">
                {label}
              </a>
            ))}
            <a
              href="#ta-nando"
              className="inline-flex items-center gap-1.5 rounded px-3.5 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#1F4D32", color: "#FAF9F1" }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chiedi a Nando
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="rounded border p-2 md:hidden"
            style={{ borderColor: "#DEDFD4", color: "#141D16" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: "#DEDFD4" }}>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#ta-oggi" onClick={() => setMenuOpen(false)}>Dove andare oggi</a>
              <a href="#ta-meteo" onClick={() => setMenuOpen(false)}>Meteo e neve</a>
              <a href="#ta-sentieri" onClick={() => setMenuOpen(false)}>Sentieri ed eventi</a>
              <a href="#ta-itinerari" onClick={() => setMenuOpen(false)}>Itinerari</a>
              <a
                href="#ta-nando"
                onClick={() => setMenuOpen(false)}
                className="rounded px-3.5 py-2 text-center text-xs font-semibold"
                style={{ backgroundColor: "#1F4D32", color: "#FAF9F1" }}
              >
                Chiedi a Nando
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="ta-main">
        {/* Editorial Cover */}
        <section className="border-b py-10 sm:py-14" style={{ borderColor: "#DEDFD4" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#9F632A" }}>
              Altopiano dei Sette Comuni · Veneto · Guida indipendente aggiornata ogni giorno
            </p>
            <h1 className="mt-3 max-w-4xl font-editorial text-4xl font-medium leading-[1.06] sm:text-6xl">
              Asiago, Gallio, Roana: <span className="italic" style={{ color: "#1F4D32" }}>l'Altopiano spiegato bene</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "#586156" }}>
              Sentieri, malghe, trincee della Grande Guerra, neve e sagre. Una guida indipendente
              aggiornata ogni giorno, con Nando che risponde alle tue domande.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#ta-sentieri"
                className="inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: "#1F4D32", color: "#FAF9F1" }}
              >
                <Compass className="h-4 w-4" />
                Sentieri ed escursioni
              </a>
              <a
                href="#ta-nando"
                className="inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: "#CD8643", color: "#141D16" }}
              >
                Chiedi a Nando
              </a>
            </div>

            {/* Real Asiago plateau cover plate */}
            <figure className="mt-8 overflow-hidden rounded border" style={{ borderColor: "#DEDFD4" }}>
              <img
                src={`${BASE}hero-altopiano-CWMDIx28.jpg`}
                alt="Pascoli e malga dell'Altopiano di Asiago al tramonto con le montagne sullo sfondo"
                className="h-64 w-full object-cover sm:h-[420px]"
              />
              <figcaption
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 font-mono text-[11px]"
                style={{ backgroundColor: "#EDEBDC", color: "#586156" }}
              >
                <span>Pascoli e malga dell'Altopiano di Asiago al tramonto</span>
                <span>Fotografia reale del territorio</span>
              </figcaption>
            </figure>

            {/* 3 Immediate Utility Cards */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["CONSIGLIO DEL GIORNO", "Dove andare oggi", "La scelta migliore in base a meteo, vento e neve."],
                ["ARRIVARE", "Strade e bus 2026", "Valdastico, Valsugana, catene e collegamenti senza auto."],
                ["ITINERARI", "6 itinerari pronti", "Da 1 giorno a 3, con bambini o sugli sci."],
              ].map(([eyebrow, title, desc]) => (
                <div
                  key={title}
                  className="rounded border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#A4662C" }}>
                    {eyebrow}
                  </p>
                  <h2 className="mt-1 font-editorial text-xl font-medium">{title}</h2>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "#586156" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Weather Bulletin (Open-Meteo) */}
        <section id="ta-meteo" className="border-b py-10" style={{ backgroundColor: "#EDEBDC", borderColor: "#DEDFD4" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1F4D32" }}>
                  <CloudSnow className="mr-1.5 inline h-3.5 w-3.5" />
                  Meteo e neve ad Asiago (1.000 m)
                </p>
                <h2 className="mt-1 font-editorial text-2xl font-medium">
                  Dati aggiornati ogni 30 minuti da Open-Meteo
                </h2>
              </div>
              <span className="font-mono text-xs" style={{ color: "#586156" }}>
                Aggiornato: 15:15 · Open-Meteo
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["5°C", "TEMPERATURA", "Poco nuvoloso"],
                ["6 km/h", "VENTO", "Raffiche 9 km/h"],
                ["81%", "UMIDITÀ", "Percepita 2°C"],
                ["0.0 cm", "NEVE FRESCA", "Pioggia 0.0 mm"],
              ].map(([val, label, sub]) => (
                <div key={label} className="rounded border p-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
                  <p className="font-mono text-[10px] tracking-widest" style={{ color: "#A4662C" }}>{label}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold" style={{ color: "#1F4D32" }}>{val}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "#586156" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tre idee per la giornata + 3 real photographic plates */}
        <section id="ta-oggi" className="border-b py-14" style={{ borderColor: "#DEDFD4" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#9F632A" }}>
              Consigli di oggi · Lunedì 23 novembre
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Tre idee per la giornata
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["#1 oggi", "Sacrario Militare del Leiten", "Il grande monumento bianco che custodisce oltre 50.000 caduti della Grande Guerra."],
                ["#2 oggi", "Piana della Marcesina", "Enego / Gallio — La 'piccola Finlandia' d'Italia: torbiere, abetaie e praterie a 1.300 metri."],
                ["#3 oggi", "Ponte di Roana", "Viadotto storico sospeso sulla Val d'Assa, simbolo dell'ingegneria di inizio Novecento."],
              ].map(([tag, title, desc]) => (
                <article key={title} className="border-t-2 pt-4" style={{ borderColor: "#1F4D32" }}>
                  <span className="inline-block rounded px-2 py-0.5 font-mono text-[11px] font-semibold" style={{ backgroundColor: "#CD8643", color: "#141D16" }}>
                    {tag}
                  </span>
                  <h3 className="mt-2.5 font-editorial text-2xl font-medium">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#586156" }}>{desc}</p>
                </article>
              ))}
            </div>

            {/* Three real photographic stories */}
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { img: "malghe-ClZ0urFs.jpg", title: "Malghe e Asiago DOP", caption: "Dove assaggiare formaggio e ricotta appena fatti." },
                { img: "grande-guerra-Bd6f4mP5.jpg", title: "Grande Guerra", caption: "Trincee, forti e sacrari da visitare a piedi." },
                { img: "inverno-DTfb18A4.jpg", title: "Inverno e sci di fondo", caption: "Campomulo, Marcesina e le piste dell'Altopiano." },
              ].map((story) => (
                <figure key={story.title} className="overflow-hidden rounded border" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
                  <img
                    src={`${BASE}${story.img}`}
                    alt={story.title}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-4">
                    <h3 className="font-editorial text-xl font-medium">{story.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "#586156" }}>{story.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Sette Comuni */}
        <section className="border-b py-14" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#A4662C" }}>
              Territorio e quote reali
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              L'Altopiano: sette comuni, mille modi di viverlo
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOWNS.map((t) => (
                <div key={t.name} className="rounded border p-4" style={{ backgroundColor: "#FAF9F1", borderColor: "#DEDFD4" }}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-editorial text-2xl font-medium">{t.name}</h3>
                    <span className="font-mono text-xs font-semibold" style={{ color: "#1F4D32" }}>{t.alt}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "#586156" }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chiedi a Nando — Interactive starter questions on Forest Green */}
        <section id="ta-nando" className="py-16" style={{ backgroundColor: "#1F4D32", color: "#FAF9F1" }}>
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#CD8643" }}>
                Assistente locale
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
                Chiedi a Nando
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(250,249,241,0.82)" }}>
                Nando è la guida virtuale dell'Altopiano: gli chiedi che sentiero fare con la
                pioggia, dove mangiare in malga o come arrivare senza auto, e ti risponde in un
                attimo.
              </p>
              <a
                href="https://tuttoaltopiano.it/chiedi-a-nando"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-semibold"
                style={{ backgroundColor: "#CD8643", color: "#141D16" }}
              >
                Parla con Nando
              </a>
            </div>

            <div className="rounded border p-5 lg:col-span-7" style={{ backgroundColor: "#141D16", borderColor: "rgba(250,249,241,0.18)" }}>
              <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "rgba(250,249,241,0.72)" }}>
                Prova una domanda reale:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {NANDO_PROMPTS.map((item, idx) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setSelectedPrompt(idx)}
                    className="rounded border px-3 py-1.5 text-left text-xs transition-colors"
                    style={
                      selectedPrompt === idx
                        ? { backgroundColor: "#CD8643", color: "#141D16", borderColor: "#CD8643", fontWeight: 600 }
                        : { backgroundColor: "transparent", color: "#FAF9F1", borderColor: "rgba(250,249,241,0.28)" }
                    }
                  >
                    {item.q}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded p-4 text-sm leading-relaxed" style={{ backgroundColor: "#1F4D32", color: "#FAF9F1" }}>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">Nando · Anteprima</p>
                <p className="mt-1">{activePrompt.hint}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trails & Events */}
        <section id="ta-sentieri" className="border-b py-14" style={{ borderColor: "#DEDFD4" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#9F632A" }}>
                Carta dei sentieri
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium">Sentieri più cercati</h2>
              <div className="mt-5 divide-y rounded border" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
                {TRAILS.map((tr) => {
                  const levelStyle =
                    tr.level === "Facile"
                      ? { color: "#1F4D32" }
                      : tr.level === "Medio"
                        ? { color: "#A4662C" }
                        : { color: "#141D16", fontWeight: 700 };
                  return (
                    <div key={tr.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5 text-sm">
                      <span className="font-medium">{tr.name}</span>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span style={levelStyle}>{tr.level}</span>
                        <span style={{ color: "#586156" }}>{tr.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#9F632A" }}>
                Calendario
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium">Prossimi appuntamenti</h2>
              <ul className="mt-5 divide-y rounded border" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
                {EVENTS.map((ev) => (
                  <li key={ev.title} className="px-4 py-3.5">
                    <p className="text-sm font-semibold">{ev.title}</p>
                    <p className="mt-0.5 font-mono text-xs" style={{ color: "#A4662C" }}>{ev.when}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6 Ready Itineraries */}
        <section id="ta-itinerari" className="py-14" style={{ backgroundColor: "#EDEBDC" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1F4D32" }}>
              Organizzare la visita
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium">Itinerari pronti all'uso</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ITINERARIES.map((it) => (
                <article key={it.title} className="rounded border p-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDFD4" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#A4662C" }}>
                    {it.tag}
                  </p>
                  <h3 className="mt-1.5 font-editorial text-xl font-medium">{it.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "#586156" }}>{it.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-xs" style={{ backgroundColor: "#141D16", color: "rgba(250,249,241,0.8)" }}>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="font-mono font-semibold" style={{ color: "#FAF9F1" }}>TUTTOALTOPIANO</p>
            <p className="mt-1">
              © 2026 tuttoaltopiano.it — guida indipendente, non è un sito istituzionale. Dati
              meteo: Open-Meteo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCookieSignal((n) => n + 1)}
            className="self-start underline sm:self-auto"
            style={{ color: "#FAF9F1" }}
          >
            Preferenze cookie
          </button>
        </div>
      </footer>

      <GaranteCookieBanner
        siteKey="tuttoaltopiano"
        siteName="TUTTOALTOPIANO"
        accentBg="#1F4D32"
        accentFg="#FAF9F1"
        borderColor="#DEDFD4"
        surfaceBg="#FAF9F1"
        textColor="#141D16"
        mutedColor="#586156"
        openSignal={cookieSignal}
      />
    </div>
  );
}