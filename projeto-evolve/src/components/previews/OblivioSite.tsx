import { useState } from "react";
import { Menu, X, CheckCircle2, Clock, Phone, ArrowRight } from "lucide-react";
import { GaranteCookieBanner } from "./GaranteCookieBanner";

const LOGO_URL =
  "https://evolve-srl.github.io/design-systems/brands/oblivio.legal/assets/oblivio-logo-Ud0gr9mv.png";

const STEPS = [
  { n: "01", title: "Raccontaci il tuo caso", status: "In corso", color: "#097EA4", desc: "Apri la chat o compila il form di valutazione gratuita. Bastano pochi minuti per descrivere il problema." },
  { n: "02", title: "Analisi e strategia", status: "In corso", color: "#097EA4", desc: "Avvocati iscritti all'Albo e informatici valutano la fattibilità e propongono una strategia chiara." },
  { n: "03", title: "Rimozione e tutela", status: "Completata", color: "#008658", desc: "Procediamo con deindicizzazione, diffide e azioni legali. Segui ogni passo dalla tua area cliente." },
];

const SERVICES = [
  { n: "a)", title: "Rimozione da Google", desc: "Deindicizzazione di URL su Google e altri motori di ricerca tramite procedure GDPR e moduli ufficiali." },
  { n: "b)", title: "Rimozione da social", desc: "Eliminazione di post, profili clone, foto e contenuti diffamatori da Facebook, Instagram, X, TikTok, LinkedIn." },
  { n: "c)", title: "Diffide e azioni legali", desc: "Diffide formali a editori e piattaforme. Azioni civili e penali in caso di diffamazione persistente." },
  { n: "d)", title: "Monitoraggio reputazione", desc: "Servizio continuativo di monitoraggio per intercettare nuovi contenuti dannosi appena pubblicati." },
];

const TESTIMONIALS = [
  { quote: "Dopo l'archiviazione del procedimento, il mio nome continuava ad apparire nei primi risultati di Google. In tre mesi tutto è stato rimosso.", who: "M.R. · Imprenditore, Lombardia" },
  { quote: "Un articolo di cronaca raccontava una versione errata dei fatti. Il team ha gestito sia la rettifica che la deindicizzazione.", who: "L.B. · Professionista, Toscana" },
  { quote: "Pensavo non si potesse fare nulla. Mi hanno spiegato passo passo cosa era possibile e i risultati sono arrivati.", who: "G.S. · Privato cittadino, Lazio" },
];

export function OblivioSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSignal, setCookieSignal] = useState(0);

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#031222" }} className="min-h-screen font-sans">
      {/* Discreet dark legal top bar */}
      <div className="border-b py-1.5 text-xs" style={{ backgroundColor: "#031222", color: "rgba(255,255,255,0.82)", borderColor: "#031222" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6 font-mono text-[11px]">
          <span>Dati cifrati e riservati · Avvocati iscritti all'Albo</span>
          <a href="tel:+390425090621" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "#FFFFFF" }}>
            <Phone className="h-3 w-3" />
            0425 090621
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEE5EC" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <a href="#ob-main" className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Logo Oblivio" className="h-8 w-8 object-contain" />
            <span className="font-editorial text-xl font-medium tracking-tight" style={{ color: "#031222" }}>
              Oblivio
            </span>
          </a>

          <nav aria-label="Principale" className="hidden items-center gap-5 text-sm md:flex">
            {[
              ["Come funziona", "#ob-passi"],
              ["Servizi", "#ob-servizi"],
              ["Normative", "#ob-norme"],
              ["Testimonianze", "#ob-voci"],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ color: "#031222" }} className="hover:underline">
                {label}
              </a>
            ))}
            <a
              href="#ob-valutazione"
              className="rounded px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#1D4ED8", color: "#FFFFFF" }}
            >
              Valutazione gratuita
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="rounded border p-2 md:hidden"
            style={{ borderColor: "#DEE5EC", color: "#031222" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: "#DEE5EC" }}>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#ob-passi" onClick={() => setMenuOpen(false)}>Come funziona</a>
              <a href="#ob-servizi" onClick={() => setMenuOpen(false)}>Servizi</a>
              <a href="#ob-norme" onClick={() => setMenuOpen(false)}>Quadro normativo</a>
              <a
                href="#ob-valutazione"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-2 text-center text-xs font-semibold"
                style={{ backgroundColor: "#1D4ED8", color: "#FFFFFF" }}
              >
                Valutazione gratuita
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="ob-main">
        {/* Hero + Illustrative 'Caso risolto' dossier */}
        <section className="border-b py-14 sm:py-20" style={{ borderColor: "#DEE5EC" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1D4ED8" }}>
                Diritto all'oblio · Tutela reputazionale
              </p>
              <h1 className="mt-3 font-editorial text-4xl font-medium leading-[1.08] sm:text-5xl">
                Sei stato scagionato, ma <span style={{ color: "#1D4ED8" }}>Google ancora ti accusa?</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#596571" }}>
                Aiutiamo persone come te a rimuovere da Google e dai social informazioni errate,
                superate o ingiustamente lesive. Diritto all'oblio, deindicizzazione, diffide e
                azioni legali — tutto gestito da un team specializzato.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#ob-valutazione"
                  className="inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-semibold"
                  style={{ backgroundColor: "#1D4ED8", color: "#FFFFFF" }}
                >
                  Valutazione gratuita
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#ob-passi"
                  className="inline-flex items-center rounded border px-5 py-3 text-sm font-medium"
                  style={{ borderColor: "#DEE5EC", color: "#031222" }}
                >
                  Come funziona
                </a>
              </div>
            </div>

            {/* Illustrative dossier card — WCAG AA green & sky states */}
            <div className="rounded-md border p-5 lg:col-span-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEE5EC" }}>
              <div className="flex items-center justify-between gap-2 border-b pb-3" style={{ borderColor: "#DEE5EC" }}>
                <span className="font-mono text-[11px] uppercase" style={{ color: "#596571" }}>
                  Fascicolo · 3 mesi fa
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-semibold"
                  style={{ backgroundColor: "rgba(0,170,111,0.14)", color: "#031222" }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#008658" }} />
                  Caso risolto
                </span>
              </div>

              <div className="mt-4 rounded p-3 font-mono text-xs" style={{ backgroundColor: "#EBF2F8", color: "#596571" }}>
                <span className="block text-[10px] uppercase">Articolo originale</span>
                <span className="mt-1 block line-through" style={{ color: "#031222" }}>
                  cronaca.example.it/notizia-archiviata-2019
                </span>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-center justify-between border-b pb-2" style={{ borderColor: "#DEE5EC" }}>
                  <span className="font-medium">Deindicizzazione Google</span>
                  <span className="font-mono font-semibold" style={{ color: "#008658" }}>Completata</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2" style={{ borderColor: "#DEE5EC" }}>
                  <span className="font-medium">Rimozione articolo originale</span>
                  <span className="font-mono font-semibold" style={{ color: "#008658" }}>Completata</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium">Monitoraggio attivo</span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold" style={{ color: "#097EA4" }}>
                    <Clock className="h-3 w-3" />
                    In corso
                  </span>
                </li>
              </ul>

              <p className="mt-4 border-t pt-3 font-mono text-[10px]" style={{ borderColor: "#DEE5EC", color: "#596571" }}>
                Esempio illustrativo basato su casi reali anonimizzati.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Legal Guarantees */}
        <section className="border-b py-6" style={{ backgroundColor: "#EBF2F8", borderColor: "#DEE5EC" }}>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4">
            {[
              ["I", "Avvocati iscritti all'Albo"],
              ["II", "Conformità GDPR · Reg. UE 2016/679"],
              ["III", "100% Riservatezza e dati cifrati"],
              ["IV", "Team multidisciplinare Avv. + Tech"],
            ].map(([roman, label]) => (
              <div key={roman} className="flex items-baseline gap-2.5">
                <span className="font-editorial text-sm italic font-semibold" style={{ color: "#1D4ED8" }}>{roman}.</span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Steps */}
        <section id="ob-passi" className="border-b py-16" style={{ borderColor: "#DEE5EC" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1D4ED8" }}>
              § 1 · Come funziona
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Tre passi semplici per riprendere il controllo
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {STEPS.map((st) => (
                <article key={st.n} className="rounded border p-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEE5EC" }}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold" style={{ color: "#1D4ED8" }}>PASSO {st.n}</span>
                    <span style={{ color: st.color }}>{st.status}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold">{st.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#596571" }}>{st.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="ob-servizi" className="border-b py-16" style={{ backgroundColor: "#EBF2F8", borderColor: "#DEE5EC" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1D4ED8" }}>
              § 2 · Cosa facciamo
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Servizi pensati per ogni tipo di problema
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICES.map((svc) => (
                <article key={svc.n} className="rounded border p-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEE5EC" }}>
                  <span className="font-mono text-xs font-semibold" style={{ color: "#1D4ED8" }}>{svc.n}</span>
                  <h3 className="mt-1.5 text-lg font-semibold">{svc.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#596571" }}>{svc.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Full-Ink Normative Band */}
        <section id="ob-norme" className="py-16" style={{ backgroundColor: "#031222", color: "#FFFFFF" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#4E76E7" }}>
              § 3 · Quadro normativo
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Operiamo nel pieno rispetto delle normative europee e italiane
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["GDPR", "Reg. UE 2016/679 · Art. 17 Diritto alla cancellazione"],
                ["DSA", "Reg. UE 2022/2065 · Segnalazione piattaforme"],
                ["Codice Rosso", "L. 69/2019 — Tutela vittime"],
                ["Garante Privacy", "Procedure ufficiali e reclami"],
              ].map(([title, desc]) => (
                <div key={title} className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                  <h3 className="font-mono text-sm font-semibold" style={{ color: "#4E76E7" }}>{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Anonymized testimonials */}
        <section id="ob-voci" className="border-b py-16" style={{ borderColor: "#DEE5EC" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#1D4ED8" }}>
              § 4 · Testimonianze anonimizzate
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium">Persone reali, risultati concreti</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.who} className="flex flex-col justify-between rounded border p-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#DEE5EC" }}>
                  <p className="font-editorial text-lg italic leading-relaxed">“{t.quote}”</p>
                  <footer className="mt-4 font-mono text-xs" style={{ color: "#596571" }}>{t.who}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Gradient CTA */}
        <section id="ob-valutazione" className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="rounded-md p-8 sm:p-10"
              style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #0B94C1 100%)", color: "#FFFFFF" }}
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <h2 className="font-editorial text-3xl font-medium sm:text-4xl">
                    Inizia oggi a difendere la tua reputazione
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.92)" }}>
                    Una valutazione gratuita, riservata e senza impegno. Ti rispondiamo entro 48
                    ore.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:info@bevolve.it?subject=Valutazione%20gratuita%20Oblivio"
                    className="rounded px-5 py-3 text-sm font-semibold"
                    style={{ backgroundColor: "#FFFFFF", color: "#1D4ED8" }}
                  >
                    Richiedi valutazione gratuita
                  </a>
                  <a
                    href="tel:+390425090621"
                    className="rounded border px-5 py-3 text-sm font-medium"
                    style={{ borderColor: "rgba(255,255,255,0.55)", color: "#FFFFFF" }}
                  >
                    Tel. 0425 090621
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 text-xs" style={{ backgroundColor: "#EBF2F8", borderColor: "#DEE5EC", color: "#596571" }}>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="font-semibold" style={{ color: "#031222" }}>
              Oblivio — Servizio erogato da Evolve S.r.l.
            </p>
            <p className="mt-1">
              Via L. Einaudi 54, 45100 Rovigo (RO) · P.IVA 04597090234 · Sito conforme GDPR. Le
              informazioni qui presenti non costituiscono consulenza legale.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCookieSignal((n) => n + 1)}
            className="self-start underline font-medium sm:self-auto"
            style={{ color: "#1D4ED8" }}
          >
            Preferenze cookie
          </button>
        </div>
      </footer>

      <GaranteCookieBanner
        siteKey="oblivio"
        siteName="Oblivio"
        accentBg="#1D4ED8"
        accentFg="#FFFFFF"
        borderColor="#DEE5EC"
        surfaceBg="#FFFFFF"
        textColor="#031222"
        mutedColor="#596571"
        openSignal={cookieSignal}
      />
    </div>
  );
}