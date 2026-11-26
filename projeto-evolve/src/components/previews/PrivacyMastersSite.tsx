import { useState } from "react";
import { Menu, X, ShieldCheck, ArrowRight } from "lucide-react";
import { GaranteCookieBanner } from "./GaranteCookieBanner";

const LOGO_URL =
  "https://evolve-srl.github.io/design-systems/brands/privacymasters.it/assets/logo-BgtPAKuu.png";
const HERO_BG_URL =
  "https://evolve-srl.github.io/design-systems/brands/privacymasters.it/assets/hero-bg-DpxwDN4b.jpg";

const THREATS = [
  { stat: "+37%", title: "Ransomware", body: "L'Italia è tra i 5 Paesi al mondo più colpiti. Crescita attacchi nel 2024.", source: "Clusit – Rapporto 2025" },
  { stat: "1.731", title: "Violazioni GDPR", body: "Data breach notificati al Garante Privacy nel 2023. Trend in costante crescita.", source: "Garante Privacy – Relazione 2024" },
  { stat: "81%", title: "Phishing & social engineering", body: "Tecnica utilizzata negli attacchi che sfruttano credenziali rubate.", source: "Verizon DBIR 2024" },
  { stat: "68%", title: "Furto credenziali", body: "Coinvolge un fattore umano non malintenzionato. MFA mancante nel 40% delle PMI.", source: "Verizon DBIR 2024" },
];

const SERVICES = [
  { n: "01", title: "GDPR & Compliance", desc: "Adeguamento, DPO esterno, audit privacy.", bg: "#FFFFFF", fg: "#0A2B33", muted: "#55666F", border: "#129740" },
  { n: "02", title: "Cybersecurity", desc: "Pen test, vulnerability assessment, NIS2.", bg: "#F5F9FA", fg: "#0A2B33", muted: "#55666F", border: "#129740" },
  { n: "03", title: "Investigazioni & Intelligence", desc: "Frodi, controlli interni, raccolta prove.", bg: "#0F8036", fg: "#FFFFFF", muted: "rgba(255,255,255,.85)", border: "#0F8036" },
  { n: "04", title: "Sicurezza Fisica", desc: "Videosorveglianza, controllo accessi, anti-intrusione.", bg: "#0A2B33", fg: "#FFFFFF", muted: "rgba(255,255,255,.72)", border: "#0A2B33" },
];

const SECTORS = [
  { name: "Pubblica Amministrazione", note: "Linee guida AGID, Misure minime ICT, perimetro PSNC." },
  { name: "Sanità", note: "Soggetto essenziale NIS2, FSE, telemedicina, dati sanitari (art. 9 GDPR)." },
  { name: "Finance & Assicurazioni", note: "DORA, ICT risk management, ABI Lab, IVASS." },
  { name: "Manifattura", note: "OT/ICS security, supply chain, IEC 62443." },
  { name: "Energia & Utilities", note: "NIS2 essenziale, Direttiva CER, ENISA Energy." },
  { name: "Retail & e-commerce", note: "PSD2, PCI-DSS, profilazione e marketing." },
  { name: "Studi professionali", note: "Segreto professionale, antiriciclaggio, custodia dati clienti." },
  { name: "Terzo settore & no-profit", note: "GDPR, fundraising, tutela donatori e beneficiari." },
];

const STANDARDS = [
  "ISO/IEC 27001:2022 — Sistemi di gestione della sicurezza delle informazioni",
  "ISO/IEC 27701:2019 — Gestione delle informazioni sulla privacy",
  "ISO/IEC 27017 / 27018 — Sicurezza e privacy in cloud",
  "ISO/IEC 22301:2019 — Business continuity",
  "NIST Cybersecurity Framework 2.0 (2024)",
  "MITRE ATT&CK & D3FEND",
  "Linee guida AGID per la sicurezza ICT della PA",
  "Framework Nazionale Cybersecurity & Data Protection (CIS-Sapienza)",
];

const FAQS = [
  "La mia azienda è obbligata ad applicare la NIS2?",
  "Cosa rischio se subisco un data breach senza notificarlo?",
  "Devo nominare un DPO?",
  "Quanto costa un check-up di sicurezza?",
  "Coprite anche la sicurezza fisica?",
];

export function PrivacyMastersSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSignal, setCookieSignal] = useState(0);

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#0A2B33" }} className="min-h-screen font-sans">
      <a
        href="#pm-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-3 focus:py-2 focus:text-xs"
        style={{ backgroundColor: "#0A2B33", color: "#FFFFFF" }}
      >
        Salta al contenuto
      </a>

      {/* Header — petrol dark bar matching hero */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "#0A2B33", borderColor: "rgba(255,255,255,0.14)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <a href="#pm-main" className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded"
              style={{ backgroundColor: "#FFFFFF" }}
              aria-hidden="true"
            >
              <ShieldCheck className="h-5 w-5" style={{ color: "#129740" }} />
            </span>
            <span className="text-base font-semibold tracking-tight" style={{ color: "#FFFFFF" }}>
              Privacy<span style={{ color: "#13A445" }}>Masters</span>
            </span>
          </a>

          <nav aria-label="Principale" className="hidden items-center gap-5 text-sm md:flex">
            {[
              ["Minacce", "#pm-dati"],
              ["Servizi", "#pm-servizi"],
              ["Metodo", "#pm-metodo"],
              ["Settori", "#pm-settori"],
              ["Standard", "#pm-standard"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="transition-opacity hover:opacity-100"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                {label}
              </a>
            ))}
            <a
              href="#pm-checkup"
              className="rounded px-3.5 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#13A445", color: "#0A2B33" }}
            >
              Check-up gratuito
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="rounded border p-2 md:hidden"
            style={{ borderColor: "rgba(255,255,255,0.28)", color: "#FFFFFF" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div
            className="border-t px-4 py-3 md:hidden"
            style={{ borderColor: "rgba(255,255,255,0.14)", backgroundColor: "#0A2B33" }}
          >
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#pm-dati" onClick={() => setMenuOpen(false)} style={{ color: "#FFFFFF" }}>Minacce</a>
              <a href="#pm-servizi" onClick={() => setMenuOpen(false)} style={{ color: "#FFFFFF" }}>Servizi</a>
              <a href="#pm-metodo" onClick={() => setMenuOpen(false)} style={{ color: "#FFFFFF" }}>Metodo</a>
              <a href="#pm-settori" onClick={() => setMenuOpen(false)} style={{ color: "#FFFFFF" }}>Settori e standard</a>
              <a
                href="#pm-checkup"
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-block rounded px-3.5 py-2 text-center text-xs font-semibold"
                style={{ backgroundColor: "#13A445", color: "#0A2B33" }}
              >
                Richiedi check-up gratuito
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="pm-main">
        {/* Hero — Command Center petrol backdrop + 4 operational readouts */}
        <section
          className="relative overflow-hidden py-16 sm:py-24"
          style={{ backgroundColor: "#0A2B33", color: "#FFFFFF" }}
        >
          <img
            src={HERO_BG_URL}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#13A445" }}>
              Difesa integrata 360° · Evolve S.r.l., Rovigo
            </p>
            <h1 className="mt-4 max-w-3xl font-editorial text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              Protezione totale. <span style={{ color: "#13A445" }}>Zero compromessi.</span>
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Cybersecurity, privacy, investigazione e sicurezza fisica. Un unico team operativo —
              avvocati, ethical hacker, investigatori e ingegneri — per difendere aziende e persone
              in conformità a GDPR, NIS2, DORA e AI Act.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#pm-checkup"
                className="inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#13A445", color: "#0A2B33" }}
              >
                Richiedi check-up gratuito
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+390425090621"
                className="inline-flex items-center rounded border px-5 py-3 text-sm font-medium transition-opacity hover:opacity-85"
                style={{ borderColor: "rgba(255,255,255,0.35)", color: "#FFFFFF" }}
              >
                Parla con un esperto
              </a>
            </div>

            <div
              className="mt-12 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4"
              style={{ borderColor: "rgba(255,255,255,0.16)" }}
            >
              {[
                ["4", "AREE INTEGRATE"],
                ["12+", "NORMATIVE COPERTE"],
                ["24/7", "INCIDENT RESPONSE"],
                ["48h", "RISPOSTA CHECK-UP"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-mono text-2xl font-semibold sm:text-3xl" style={{ color: "#13A445" }}>
                    {num}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tracking-wider" style={{ color: "rgba(255,255,255,0.72)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 01 — Threat data (Istituzionale crisp white tabular grid) */}
        <section id="pm-dati" className="border-b py-16" style={{ borderColor: "#D8DFE3", backgroundColor: "#FFFFFF" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
              § 01 · Realtà · Dati ufficiali 2024–2025
            </p>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-editorial text-3xl font-medium sm:text-4xl">
                Le minacce sono reali
              </h2>
              <p className="max-w-md text-sm" style={{ color: "#55666F" }}>
                Dati ufficiali aggregati da Clusit, ACN, Garante Privacy, IBM e Verizon — fonti
                aprile 2025.
              </p>
            </div>

            <div
              className="mt-8 grid divide-y border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4"
              style={{ borderColor: "#D8DFE3" }}
            >
              {THREATS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col justify-between border-b p-5 sm:border-r lg:border-b-0"
                  style={{ borderColor: "#D8DFE3" }}
                >
                  <div>
                    <p className="font-editorial text-4xl font-medium" style={{ color: "#129740" }}>
                      {item.stat}
                    </p>
                    <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#55666F" }}>
                      {item.body}
                    </p>
                  </div>
                  <p className="mt-4 font-mono text-[11px]" style={{ color: "#55666F" }}>
                    {item.source}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 font-editorial text-xl italic" style={{ color: "#0A2B33" }}>
              “Il problema non è se succederà. Ma quando.”
            </p>
          </div>
        </section>

        {/* Section 02 — Four Integrated Defence Pillars (Difesa a strati 01–04) */}
        <section id="pm-servizi" className="border-b py-16" style={{ backgroundColor: "#F5F9FA", borderColor: "#D8DFE3" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
              § 02 · Una difesa completa
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Quattro aree, un solo presidio operativo.
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#55666F" }}>
              “Non lavoriamo a compartimenti separati. Lavoriamo insieme.”
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((svc) => (
                <article
                  key={svc.n}
                  className="flex flex-col justify-between rounded border-2 p-5"
                  style={{ backgroundColor: svc.bg, color: svc.fg, borderColor: svc.border }}
                >
                  <div>
                    <span className="font-mono text-xs opacity-80">STRATO {svc.n}</span>
                    <h3 className="mt-3 text-lg font-semibold">{svc.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: svc.muted }}>
                      {svc.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 03 — Method */}
        <section id="pm-metodo" className="border-b py-16" style={{ backgroundColor: "#FFFFFF", borderColor: "#D8DFE3" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
              § 03 · Metodo operativo
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">Come funziona</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Analisi del rischio", "Mappatura completa di asset, processi e vulnerabilità."],
                ["02", "Piano di protezione", "Strategia su misura: tecnica, legale, operativa."],
                ["03", "Monitoraggio continuo", "Vigilanza, aggiornamenti e risposta agli incidenti."],
              ].map(([n, title, desc]) => (
                <div key={n} className="border-t-2 pt-4" style={{ borderColor: "#129740" }}>
                  <span className="font-mono text-sm font-semibold" style={{ color: "#0F8036" }}>
                    {n}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#55666F" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 04 — Sectors & Standards */}
        <section id="pm-settori" className="border-b py-16" style={{ backgroundColor: "#F5F9FA", borderColor: "#D8DFE3" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
                § 04 · Verticali NIS2 e infrastrutture critiche
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium">Settori serviti</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SECTORS.map((sec) => (
                  <div
                    key={sec.name}
                    className="rounded border p-4"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D8DFE3" }}
                  >
                    <h3 className="text-sm font-semibold">{sec.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "#55666F" }}>
                      {sec.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div id="pm-standard" className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
                § 05 · Qualità e framework
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium">Standard di riferimento</h2>
              <ul
                className="mt-6 divide-y rounded border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D8DFE3" }}
              >
                {STANDARDS.map((std) => (
                  <li
                    key={std}
                    className="px-4 py-3 font-mono text-xs leading-relaxed"
                    style={{ color: "#0A2B33" }}
                  >
                    {std}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 05 — Team & FAQ */}
        <section className="border-b py-16" style={{ backgroundColor: "#FFFFFF", borderColor: "#D8DFE3" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
                § 06 · Competenze operative
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium">
                Non consulenti. Operativi.
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#55666F" }}>
                Il team Privacy Masters integra profili giuridici, tecnici e investigativi che
                operano insieme su ogni incarico. Su richiesta forniamo CV anonimizzati e referenze
                contrattuali.
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                {[
                  "Ex appartenenti alle Forze dell'Ordine",
                  "Ethical hacker certificati",
                  "Avvocati specializzati in privacy e cyber",
                  "Ingegneri della sicurezza informatica",
                ].map((role) => (
                  <li key={role} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#129740" }} />
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#0F8036" }}>
                § 07 · Domande frequenti
              </p>
              <div className="mt-4 divide-y rounded border" style={{ borderColor: "#D8DFE3" }}>
                {FAQS.map((q) => (
                  <details key={q} className="group px-4 py-3.5">
                    <summary className="cursor-pointer list-none font-medium text-sm flex items-center justify-between gap-2">
                      <span>{q}</span>
                      <span className="font-mono text-xs" style={{ color: "#0F8036" }}>+</span>
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "#55666F" }}>
                      Risposta tecnica personalizzata disponibile tramite check-up gratuito in 48h
                      o contatto diretto con il team (testo FAQ dettagliato in attesa di conferma
                      del cliente).
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section id="pm-checkup" className="py-16" style={{ backgroundColor: "#0A2B33", color: "#FFFFFF" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-editorial text-3xl font-medium sm:text-4xl">
                Non aspettare il problema
              </h2>
              <p className="mt-2 max-w-xl text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
                Un check-up gratuito può evitarti danni da centinaia di migliaia di euro. Risposta
                entro 48 ore dal team operativo di Rovigo.
              </p>
            </div>
            <a
              href="mailto:info@privacymasters.it?subject=Richiesta%20Check-up%20Gratuito"
              className="inline-flex shrink-0 items-center gap-2 rounded px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#13A445", color: "#0A2B33" }}
            >
              Prenota il tuo check-up gratuito
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-12 text-xs"
        style={{ backgroundColor: "#F5F9FA", borderColor: "#D8DFE3", color: "#55666F" }}
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div
              className="inline-block rounded border p-3"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D8DFE3" }}
            >
              <img
                src={LOGO_URL}
                alt="Privacy Masters — Security Experts"
                className="h-28 w-auto object-contain"
                loading="lazy"
              />
            </div>
            <p className="mt-3 leading-relaxed">
              Privacy Masters è un brand operativo di Evolve S.r.l. — P.IVA / C.F. 04597090234 ·
              REA RO-426960.
            </p>
          </div>
          <div className="md:col-span-4 space-y-1.5">
            <p className="font-mono uppercase tracking-wider" style={{ color: "#0A2B33" }}>
              Contatti
            </p>
            <p>Via Luigi Einaudi 54, 45100 Rovigo (RO), Italia</p>
            <p>
              <a href="mailto:info@privacymasters.it" style={{ color: "#0F8036" }} className="underline">
                info@privacymasters.it
              </a>
            </p>
            <p>
              <a href="tel:+390425090621" style={{ color: "#0F8036" }} className="underline">
                +39 0425 090621
              </a>
            </p>
          </div>
          <div className="md:col-span-4 space-y-2">
            <p className="font-mono uppercase tracking-wider" style={{ color: "#0A2B33" }}>
              Trasparenza e cookie
            </p>
            <p className="leading-relaxed">
              I contenuti hanno finalità informative e non costituiscono parere legale. Dati e
              fonti aggiornati ad aprile 2025 (Garante Privacy, ACN, Clusit, IBM, Verizon).
            </p>
            <button
              type="button"
              onClick={() => setCookieSignal((n) => n + 1)}
              className="underline font-medium"
              style={{ color: "#0F8036" }}
            >
              Preferenze cookie
            </button>
          </div>
        </div>
      </footer>

      <GaranteCookieBanner
        siteKey="privacymasters"
        siteName="PrivacyMasters"
        accentBg="#0F8036"
        accentFg="#FFFFFF"
        borderColor="#D8DFE3"
        surfaceBg="#FFFFFF"
        textColor="#0A2B33"
        mutedColor="#55666F"
        openSignal={cookieSignal}
      />
    </div>
  );
}