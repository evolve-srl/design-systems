import { useState } from "react";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { GaranteCookieBanner } from "./GaranteCookieBanner";

const LOGO_URL =
  "https://evolve-srl.github.io/design-systems/brands/bevolve.it/assets/logo-evolve-CMceMwJq.png";
const HERO_IMG_URL =
  "https://evolve-srl.github.io/design-systems/brands/bevolve.it/assets/hero-home.jpg";

const PRACTICES = [
  { n: "01", title: "Software & AI", desc: "Sviluppo applicazioni custom, soluzioni LLM, RAG e agent workflow per automatizzare processi." },
  { n: "02", title: "Cybersecurity", desc: "SOC, penetration testing, conformità GDPR, NIS2 e architetture Zero Trust per proteggere il vostro business." },
  { n: "03", title: "Reti & Infrastrutture", desc: "Progettazione e gestione di reti aziendali, SD-WAN, Data Center e soluzioni IoT scalabili e sicure." },
  { n: "04", title: "Ingegneria", desc: "Impianti BT/MT, Smart Cities, Building Management Systems e soluzioni di efficienza energetica." },
];

const PHASES = [
  { n: "01", title: "Ascoltiamo", desc: "Comprendiamo il vostro business, gli obiettivi e i vincoli operativi." },
  { n: "02", title: "Co-progettiamo", desc: "Definiamo insieme la soluzione su misura, tecnicamente solida e sostenibile." },
  { n: "03", title: "Realizziamo", desc: "Implementiamo end-to-end con team senior, milestone chiare e qualità certificata." },
  { n: "04", title: "Evolviamo", desc: "Vi affianchiamo nel tempo con manutenzione, evoluzioni e supporto continuo." },
];

const PRODUCTS = [
  { name: "RoadAnalyzer", domain: "roadanalyzer.com", url: "https://roadanalyzer.com", desc: "Piattaforma AI per il monitoraggio della rete stradale: rileva da video buche, crepe, cartelli, segnaletica e vegetazione." },
  { name: "BandiFacile", domain: "bandifacile.it", url: "https://bandifacile.it", desc: "Bandi e finanziamenti a fondo perduto per imprese, PMI e startup, nazionali, regionali ed europei, con requisiti e scadenze." },
  { name: "BandiEnti", domain: "bandienti.it", url: "https://bandienti.it", desc: "Monitoraggio dei bandi europei, ministeriali e regionali per Comuni ed enti locali, con verifica di idoneità e gestione candidature." },
  { name: "Equestria", domain: "equestria.info", url: "https://equestria.info", desc: "Gestionale per centri ippici e maneggi: lezioni, cavalli, allievi, pensioni e fatturazione elettronica." },
  { name: "EquiTwin", domain: "equitwin.com", url: "https://equitwin.com", desc: "Monitoraggio continuo della salute del cavallo nel box con video e sensori non invasivi, a supporto del veterinario." },
  { name: "SISP", domain: "sisp.cloud", url: "https://sisp.cloud", desc: "Sistema Integrato di Sorveglianza Partecipata: collega le telecamere private esistenti in rete per Comuni, Prefetture e Forze dell'Ordine (GDPR)." },
  { name: "evolve.expert", domain: "evolve.expert", url: "https://evolve.expert", desc: "Assistenza remota con occhiali smart industriali e AI on-premise per manutenzione, gestione della conoscenza e formazione." },
];

export function EvolveSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSignal, setCookieSignal] = useState(0);

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#0B0B0B" }} className="min-h-screen font-sans">
      <header
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDEDE" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <a href="#ev-main" className="flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="Evolve - System Integrator"
              className="h-9 w-[168px] object-contain object-left"
            />
            <span className="hidden font-mono text-[11px] lg:inline" style={{ color: "#555555" }}>
              System integrator · Rovigo
            </span>
          </a>

          <nav aria-label="Principale" className="hidden items-center gap-5 text-sm md:flex">
            {[
              ["Servizi", "#ev-servizi"],
              ["Metodo", "#ev-metodo"],
              ["Prodotti", "#ev-prodotti"],
              ["Contatti", "#ev-contatti"],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ color: "#0B0B0B" }} className="hover:underline">
                {label}
              </a>
            ))}
            <a
              href="#ev-contatti"
              className="rounded px-4 py-2 text-xs font-semibold transition-colors"
              style={{ backgroundColor: "#11338A", color: "#FFFFFF" }}
            >
              Richiedi consulenza
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="rounded border p-2 md:hidden"
            style={{ borderColor: "#DEDEDE", color: "#0B0B0B" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: "#DEDEDE" }}>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#ev-servizi" onClick={() => setMenuOpen(false)}>Servizi</a>
              <a href="#ev-metodo" onClick={() => setMenuOpen(false)}>Metodo</a>
              <a href="#ev-prodotti" onClick={() => setMenuOpen(false)}>Prodotti propri</a>
              <a
                href="#ev-contatti"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-2 text-center text-xs font-semibold"
                style={{ backgroundColor: "#11338A", color: "#FFFFFF" }}
              >
                Richiedi consulenza
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="ev-main">
        {/* Hero — Swiss Engineering layout + single signature-gradient Rovigo block */}
        <section className="border-b py-14 sm:py-20" style={{ borderColor: "#DEDEDE" }}>
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#3B5BC9" }}>
                Il Vostro Partner per l'Innovazione
              </p>
              <h1 className="mt-3 font-editorial text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
                System integrator a Rovigo: software, AI, cybersecurity e reti per imprese e PA
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#555555" }}>
                EVOLVE è un system integrator italiano. Uniamo software, AI, cybersecurity, reti e
                ingegneria in soluzioni integrate che fanno crescere il vostro business.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#ev-contatti"
                  className="inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-semibold"
                  style={{ backgroundColor: "#11338A", color: "#FFFFFF" }}
                >
                  Richiedi consulenza
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#ev-servizi"
                  className="inline-flex items-center rounded border px-5 py-3 text-sm font-medium"
                  style={{ borderColor: "#11338A", color: "#11338A" }}
                >
                  I nostri servizi
                </a>
              </div>
            </div>

            {/* Single signature gradient panel */}
            <div
              className="relative overflow-hidden rounded-md p-6 sm:p-7 lg:col-span-5"
              style={{
                background: "linear-gradient(135deg, #3B5BC9 0%, #1E3A8A 50%, #0F1F4D 100%)",
                color: "#FFFFFF",
              }}
            >
              <img
                src={HERO_IMG_URL}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 grayscale"
              />
              <div className="relative space-y-5">
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Sede operativa · Veneto
                </p>
                <p className="font-editorial text-3xl italic">Rovigo</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
                  Via Luigi Einaudi 54 — lavoriamo con imprese e Pubblica Amministrazione in Veneto
                  e nel resto d'Italia, dall'analisi iniziale alla manutenzione nel tempo.
                </p>
                <div
                  className="grid grid-cols-2 gap-3 border-t pt-4 font-mono text-xs"
                  style={{ borderColor: "rgba(255,255,255,0.22)" }}
                >
                  <div>
                    <span className="block text-lg font-semibold">1</span>
                    <span style={{ color: "rgba(255,255,255,0.85)" }}>interlocutore</span>
                  </div>
                  <div>
                    <span className="block text-lg font-semibold">24 ore</span>
                    <span style={{ color: "rgba(255,255,255,0.85)" }}>risposta proposta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spec table */}
        <section className="border-b py-8" style={{ backgroundColor: "#F5F5F5", borderColor: "#DEDEDE" }}>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4">
            {[
              ["SEDE", "Via L. Einaudi 54, Rovigo"],
              ["CLIENTI", "Imprese e Pubblica Amministrazione"],
              ["AREE", "4 pratiche · 1 team integrato"],
              ["PRODOTTI", "7 piattaforme proprietarie"],
            ].map(([k, v]) => (
              <div key={k} className="border-l-2 pl-3" style={{ borderColor: "#11338A" }}>
                <p className="font-mono text-[10px] tracking-widest" style={{ color: "#555555" }}>{k}</p>
                <p className="mt-1 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solid Navy Band — 4 Practices */}
        <section id="ev-servizi" className="py-16" style={{ backgroundColor: "#11338A", color: "#FFFFFF" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.85)" }}>
              01 · Cosa facciamo
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Ingegneria a 360°
            </h2>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
              Quattro pratiche, un unico team integrato. Dalle infrastrutture al codice,
              dall'hardware all'AI.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PRACTICES.map((item) => (
                <article
                  key={item.n}
                  className="rounded border p-6"
                  style={{ backgroundColor: "#0F1F4D", borderColor: "rgba(255,255,255,0.16)" }}
                >
                  <span className="font-mono text-xs" style={{ color: "#6D85D7" }}>
                    AREA {item.n}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Phases */}
        <section id="ev-metodo" className="border-b py-16" style={{ borderColor: "#DEDEDE" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#3B5BC9" }}>
              02 · Innovation Journey
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Un percorso in 4 fasi
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PHASES.map((phase) => (
                <div key={phase.n} className="border-t-2 pt-4" style={{ borderColor: "#11338A" }}>
                  <p className="font-mono text-2xl font-semibold" style={{ color: "#11338A" }}>
                    {phase.n}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{phase.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#555555" }}>
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7 Proprietary Products Index */}
        <section id="ev-prodotti" className="border-b py-16" style={{ backgroundColor: "#F5F5F5", borderColor: "#DEDEDE" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#3B5BC9" }}>
              03 · Prodotti propri
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Sette piattaforme sviluppate e gestite da Evolve
            </h2>

            <div className="mt-8 divide-y rounded border" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEDEDE" }}>
              {PRODUCTS.map((prod, i) => (
                <a
                  key={prod.name}
                  href={prod.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-2 px-5 py-4 transition-colors hover:bg-[#F5F5F5] md:grid-cols-12 md:items-center"
                >
                  <div className="flex items-center gap-3 md:col-span-3">
                    <span className="font-mono text-xs" style={{ color: "#555555" }}>
                      0{i + 1}
                    </span>
                    <span className="font-semibold" style={{ color: "#11338A" }}>
                      {prod.name}
                    </span>
                  </div>
                  <p className="text-sm md:col-span-7" style={{ color: "#555555" }}>
                    {prod.desc}
                  </p>
                  <div className="flex items-center gap-1 font-mono text-xs md:col-span-2 md:justify-end" style={{ color: "#11338A" }}>
                    <span>{prod.domain}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section id="ev-contatti" className="py-16" style={{ backgroundColor: "#11338A", color: "#FFFFFF" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-editorial text-3xl font-medium sm:text-4xl">
                Pronti a far evolvere il vostro business?
              </h2>
              <p className="mt-2 max-w-xl text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                Raccontateci la vostra sfida. Vi rispondiamo entro 24 ore con una proposta concreta.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:info@bevolve.it?subject=Richiesta%20consulenza"
                className="rounded px-5 py-3 text-sm font-semibold"
                style={{ backgroundColor: "#FFFFFF", color: "#11338A" }}
              >
                Contattaci
              </a>
              <a
                href="tel:+390425090621"
                className="rounded border px-5 py-3 text-sm font-medium"
                style={{ borderColor: "rgba(255,255,255,0.45)", color: "#FFFFFF" }}
              >
                0425 090621
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-xs" style={{ backgroundColor: "#0F172A", color: "rgba(255,255,255,0.85)" }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={LOGO_URL}
              alt="Evolve - System Integrator"
              className="h-8 w-[168px] object-contain object-left brightness-0 invert"
              loading="lazy"
            />
            <p className="mt-3 leading-relaxed">
              Evolve S.r.l. · P.IVA/C.F. 04597090234 · REA RO-426960 · Cap. soc. € 10.000,00 i.v.
            </p>
          </div>
          <div className="md:col-span-4 space-y-1">
            <p className="font-mono uppercase" style={{ color: "#6D85D7" }}>Sede e contatti</p>
            <p>Via Luigi Einaudi 54, 45100 Rovigo (RO) · Italia</p>
            <p>info@bevolve.it · 0425 090621</p>
          </div>
          <div className="md:col-span-3 space-y-1.5">
            <p className="font-mono uppercase" style={{ color: "#6D85D7" }}>Legale</p>
            <p>Privacy Policy · Cookie Policy · SLA</p>
            <button
              type="button"
              onClick={() => setCookieSignal((n) => n + 1)}
              className="underline"
              style={{ color: "#FFFFFF" }}
            >
              Preferenze cookie
            </button>
          </div>
        </div>
      </footer>

      <GaranteCookieBanner
        siteKey="bevolve"
        siteName="Evolve S.r.l."
        accentBg="#11338A"
        accentFg="#FFFFFF"
        borderColor="#DEDEDE"
        surfaceBg="#FFFFFF"
        textColor="#0B0B0B"
        mutedColor="#555555"
        openSignal={cookieSignal}
      />
    </div>
  );
}