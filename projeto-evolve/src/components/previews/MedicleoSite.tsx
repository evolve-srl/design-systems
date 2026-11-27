import { useState, type FormEvent } from "react";
import { Menu, X, Shield, Radio, BellRing, EyeOff } from "lucide-react";
import { GaranteCookieBanner } from "./GaranteCookieBanner";

const BASE = "https://evolve-srl.github.io/design-systems/brands/medicleo.com/assets/";

const STATS = [
  { num: "34,5%", title: "Avrà almeno 65 anni nel 2050", desc: "Dal 24,7% del 2025 nello scenario mediano delle previsioni demografiche.", source: "Istat · Previsioni base 1/1/2025" },
  { num: "Oltre il 7%", title: "Avrà almeno 85 anni nel 2050", desc: "Dal 4,1% del 2025. Cresce il bisogno di supporto nelle ore scoperte.", source: "Istat · Previsioni base 1/1/2025" },
  { num: "425.780", title: "Posti letto residenziali totali", desc: "Meno di 2 anziani over 65 su 100 vivono in una struttura residenziale.", source: "Istat · Report Presidi 1/1/2024" },
  { num: "2.312 €/mese", title: "Retta media RSA Lombardia 2025", desc: "Circa 76 €/giorno e 27.747 €/anno (dato regionale, non media nazionale).", source: "CISL Milano · Dati Lombardia 2025" },
];

const AUDIENCES = [
  {
    title: "Famiglie",
    headerBg: "#00558B",
    points: [
      "Un supporto per chi può restare a casa propria",
      "Allerte ai familiari e dati consultabili a distanza",
      "Una scelta da valutare insieme al medico e a chi assiste",
    ],
  },
  {
    title: "Enti pubblici, Comuni e ASL",
    headerBg: "#007373",
    points: [
      "Supporto ai progetti di assistenza domiciliare integrata",
      "Monitoraggio di anziani soli sul territorio",
      "Domiciliarità per contribuire ad alleggerire le liste d'attesa",
    ],
  },
  {
    title: "RSA, cooperative e assistenza",
    headerBg: "#002946",
    points: [
      "Allerte che aiutano a indirizzare l'intervento notturno",
      "Dati in tempo reale a supporto degli operatori",
      "Servizi a domicilio anche per chi attende un posto",
    ],
  },
];

const FAQS = [
  { q: "Il sistema usa telecamere o microfoni?", a: "No. Il sensore radar non registra immagini né audio e tutela completamente la privacy della persona nella propria stanza." },
  { q: "Serve un dispositivo indossabile?", a: "No. Funziona senza contatto, senza bracciali o ciondoli, giorno e notte e anche completamente al buio." },
  { q: "Medicleo sostituisce il personale o fa diagnosi?", a: "No. Medicleo è un ausilio alla cura e all'allerta immediata; non sostituisce l'assistenza sanitaria continuativa e non effettua diagnosi." },
  { q: "Cosa succede in caso di caduta o abbandono del letto?", a: "Il sistema invia un'allerta immediata ai familiari o agli operatori autorizzati, così da sapere subito quando intervenire." },
  { q: "Come avviene la valutazione per la nostra casa o struttura?", a: "Analizziamo insieme la stanza, chi riceve le allerte e i costi di installazione durante una demo dedicata." },
];

export function MedicleoSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSignal, setCookieSignal] = useState(0);
  const [emailOpened, setEmailOpened] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  function handleDemoSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    const subject = encodeURIComponent("Richiesta demo Medicleo");
    const body = encodeURIComponent(`Buongiorno, vorrei richiedere una demo.\n\nNome / Ente: ${name.trim()}\nRecapito: ${contact.trim()}`);
    window.location.href = `mailto:info@medicleo.com?subject=${subject}&body=${body}`;
    setEmailOpened(true);
  }

  return (
    <div style={{ backgroundColor: "#ECF5F8", color: "#0D2131" }} className="min-h-screen font-sans">
      {/* Header — Single original logo only (fixes duplicate MediCleo/Medicleo spelling) */}
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#mc-main" className="flex items-center">
            <img
              src={`${BASE}medicleo-logo-DnmoDSbt.webp`}
              alt="MediCleo"
              className="h-11 w-auto object-contain"
            />
          </a>

          <nav aria-label="Principale" className="hidden items-center gap-5 text-sm md:flex">
            {[
              ["Perché a casa", "#mc-problema"],
              ["La soluzione", "#mc-soluzione"],
              ["Per chi", "#mc-per-chi"],
              ["FAQ", "#mc-faq"],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ color: "#0D2131" }} className="hover:underline">
                {label}
              </a>
            ))}
            <a
              href="#mc-contatti"
              className="rounded px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#DF0E5D", color: "#FFFFFF" }}
            >
              Richiedi una demo
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="rounded border p-2 md:hidden"
            style={{ borderColor: "#D7E4E9", color: "#0D2131" }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: "#D7E4E9" }}>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#mc-problema" onClick={() => setMenuOpen(false)}>Perché a casa</a>
              <a href="#mc-soluzione" onClick={() => setMenuOpen(false)}>La soluzione</a>
              <a href="#mc-per-chi" onClick={() => setMenuOpen(false)}>Per chi</a>
              <a href="#mc-faq" onClick={() => setMenuOpen(false)}>Domande frequenti</a>
              <a
                href="#mc-contatti"
                onClick={() => setMenuOpen(false)}
                className="rounded px-4 py-2 text-center text-xs font-semibold"
                style={{ backgroundColor: "#DF0E5D", color: "#FFFFFF" }}
              >
                Richiedi una demo
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="mc-main">
        {/* Warm Domestic Hero + Real Bedroom & Sensor Photo + Readable Disclaimer */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#007373" }}>
                Medicleo · Monitoraggio e allerta
              </p>
              <h1 className="mt-3 font-editorial text-4xl font-medium leading-[1.08] sm:text-5xl">
                Restare a casa, <span className="italic" style={{ color: "#00558B" }}>in sicurezza.</span> Anche quando si invecchia.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#4C5D6A" }}>
                Medicleo veglia giorno e notte su anziani e persone fragili con un sensore radar
                non invasivo: allerte immediate a familiari e operatori, senza telecamere e senza
                nulla da indossare.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#mc-contatti"
                  className="rounded px-5 py-3 text-sm font-semibold"
                  style={{ backgroundColor: "#DF0E5D", color: "#FFFFFF" }}
                >
                  Richiedi una demo
                </a>
                <a
                  href="#mc-problema"
                  className="rounded border px-5 py-3 text-sm font-medium"
                  style={{ borderColor: "#00558B", color: "#00558B", backgroundColor: "#FFFFFF" }}
                >
                  Perché restare a casa
                </a>
              </div>

              <div
                className="mt-6 rounded border p-3.5 text-xs leading-relaxed"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9", color: "#4C5D6A" }}
              >
                <strong style={{ color: "#0D2131" }}>Nota clinica:</strong> Un ausilio alla cura,
                non un sostituto dell'assistenza sanitaria continuativa. Restare a casa è una scelta
                da valutare con la famiglia e i medici.
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border p-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9" }}>
                <img
                  src={`${BASE}guardiano-1-BPtavAYL.webp`}
                  alt="Persona anziana nella propria stanza, con monitoraggio radar Medicleo"
                  className="h-72 w-full rounded-xl object-cover sm:h-80"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-[11px]" style={{ color: "#017DAC" }}>
                  <span>Nessuna telecamera · Nulla da indossare · 24/7</span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ED0F63" }} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cited Istat & CISL Milano Context */}
        <section id="mc-problema" className="border-y py-16" style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#007373" }}>
              Il contesto · Fonti ufficiali Istat e CISL Milano
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Un Paese che invecchia. Le strutture non bastano, e non sempre servono.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((st) => (
                <article key={st.title} className="flex flex-col justify-between rounded-lg border p-5" style={{ backgroundColor: "#ECF5F8", borderColor: "#D7E4E9" }}>
                  <div>
                    <p className="font-editorial text-3xl font-medium" style={{ color: "#00558B" }}>{st.num}</p>
                    <h3 className="mt-2 text-sm font-semibold">{st.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "#4C5D6A" }}>{st.desc}</p>
                  </div>
                  <p className="mt-4 font-mono text-[10px]" style={{ color: "#4C5D6A" }}>{st.source}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: "#4C5D6A" }}>
              Nelle Marche risultano 1.015 anziani in attesa di RSA e 6.635 nelle Residenze Protette
              (Consiglio regionale Marche, int. n. 84, 15/01/2026). Indirizzo sostenuto da Legge
              33/2023 e D.Lgs. 29/2024 sulla domiciliarità.
            </p>
          </div>
        </section>

        {/* Night Blue Radar Solution Stage */}
        <section id="mc-soluzione" className="py-16" style={{ backgroundColor: "#002946", color: "#EEF7FA" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="relative mx-auto flex max-w-xs flex-col items-center rounded-2xl border p-6" style={{ borderColor: "rgba(238,247,250,0.16)", backgroundColor: "rgba(238,247,250,0.04)" }}>
                <img
                  src={`${BASE}medicleo-radar-hero-6io_rX3r.webp`}
                  alt="Sensore radar Medicleo per il monitoraggio discreto di una persona a riposo"
                  className="h-56 w-56 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="mt-4 flex items-center gap-2 font-mono text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ED0F63" }} />
                  <span style={{ color: "#F4508E" }}>Allerta caduta immediata</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#01AEEF" }}>
                La soluzione · Tecnologia invisibile
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl" style={{ color: "#FFFFFF" }}>
                La sicurezza arriva a casa
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(238,247,250,0.82)" }}>
                La cura resta alle persone; il radar aiuta a sapere quando intervenire, senza
                invadere lo spazio privato.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Radio, title: "Monitoraggio continuo", desc: "Frequenza cardiaca e respiratoria, sonno e presenza a letto, senza contatto." },
                  { icon: BellRing, title: "Allerte a chi può intervenire", desc: "Notifiche in caso di caduta e abbandono del letto, giorno e notte." },
                  { icon: Shield, title: "Dati in tempo reale", desc: "Informazioni consultabili dai familiari e dagli operatori autorizzati." },
                  { icon: EyeOff, title: "Nessuna telecamera", desc: "Niente immagini o audio registrati e nulla da indossare." },
                ].map((f) => (
                  <div key={f.title} className="rounded-lg border p-4" style={{ borderColor: "rgba(238,247,250,0.16)", backgroundColor: "rgba(238,247,250,0.05)" }}>
                    <f.icon className="h-4 w-4" style={{ color: "#01AEEF" }} />
                    <h3 className="mt-2 text-sm font-semibold" style={{ color: "#FFFFFF" }}>{f.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(238,247,250,0.8)" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Per chi (3 Audiences) */}
        <section id="mc-per-chi" className="border-b py-16" style={{ borderColor: "#D7E4E9" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#007373" }}>
              Per chi · Tre passi, nessun contatto
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl">
              Una rete intorno alla persona
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {AUDIENCES.map((aud) => (
                <article key={aud.title} className="overflow-hidden rounded-xl border" style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9" }}>
                  <div className="px-5 py-3.5" style={{ backgroundColor: aud.headerBg, color: "#FFFFFF" }}>
                    <h3 className="text-base font-semibold">{aud.title}</h3>
                  </div>
                  <ul className="space-y-2.5 p-5 text-sm" style={{ color: "#4C5D6A" }}>
                    {aud.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#017DAC" }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Native FAQ */}
        <section id="mc-faq" className="border-b py-16" style={{ backgroundColor: "#FFFFFF", borderColor: "#D7E4E9" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#007373" }}>
              Hai qualche dubbio?
            </p>
            <h2 className="mt-2 font-editorial text-3xl font-medium">Domande frequenti</h2>
            <div className="mt-6 space-y-2.5">
              {FAQS.map((item) => (
                <details key={item.q} className="rounded-lg border px-5 py-3.5" style={{ backgroundColor: "#ECF5F8", borderColor: "#D7E4E9" }}>
                  <summary className="cursor-pointer font-semibold text-sm">{item.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#4C5D6A" }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Request & Contacts */}
        <section id="mc-contatti" className="py-16" style={{ backgroundColor: "#002946", color: "#EEF7FA" }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#01AEEF" }}>
                Contatti · Rovigo
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium sm:text-4xl" style={{ color: "#FFFFFF" }}>
                Più anni a casa propria, <span style={{ color: "#F4508E" }}>più serenità</span> per chi vi vuole bene.
              </h2>
              <ul className="mt-5 space-y-2 text-sm" style={{ color: "rgba(238,247,250,0.85)" }}>
                <li>• Valutiamo l'ambiente e le esigenze di monitoraggio.</li>
                <li>• Chiariamo chi riceve le allerte e chi può intervenire.</li>
                <li>• Confrontiamo installazione e costi per il tuo caso.</li>
              </ul>
              <div className="mt-6 font-mono text-xs space-y-1" style={{ color: "rgba(238,247,250,0.78)" }}>
                <p>Via L. Einaudi 54 – 45100 Rovigo (RO) · Evolve S.r.l. P.IVA 04597090234</p>
                <p>
                  <a className="underline" href="mailto:info@medicleo.com">info@medicleo.com</a>
                  {" · "}
                  <a className="underline" href="tel:+390425090621">Tel. 0425 090621</a>
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 lg:col-span-6" style={{ backgroundColor: "#FFFFFF", color: "#0D2131" }}>
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <h3 className="font-editorial text-2xl font-medium">Richiedi una demo</h3>
                <div>
                  <label htmlFor="mc-name" className="block text-xs font-semibold">
                    Nome e cognome / Ente
                  </label>
                  <input
                    id="mc-name"
                    required
                    pattern={".*\\S.*"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Es. Maria Rossi"
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    style={{ borderColor: "#D7E4E9" }}
                  />
                </div>
                <div>
                  <label htmlFor="mc-contact" className="block text-xs font-semibold">
                    Email o telefono
                  </label>
                  <input
                    id="mc-contact"
                    required
                    pattern={".*\\S.*"}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Es. maria@esempio.it o 333 0000000"
                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    style={{ borderColor: "#D7E4E9" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded px-4 py-2.5 text-sm font-semibold"
                  style={{ backgroundColor: "#DF0E5D", color: "#FFFFFF" }}
                >
                  Apri email per richiedere una demo
                </button>
                {emailOpened && (
                  <p role="status" className="text-sm">
                    Invia la bozza dalla tua app di posta. Se non si apre, scrivi a info@medicleo.com.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-xs" style={{ backgroundColor: "#002946", borderColor: "rgba(238,247,250,0.14)", color: "rgba(238,247,250,0.78)" }}>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>Medicleo — Evolve S.r.l. · P.IVA 04597090234 · Via L. Einaudi 54, Rovigo</p>
          <button
            type="button"
            onClick={() => setCookieSignal((n) => n + 1)}
            className="self-start underline sm:self-auto"
            style={{ color: "#EEF7FA" }}
          >
            Preferenze cookie
          </button>
        </div>
      </footer>

      <GaranteCookieBanner
        siteKey="medicleo"
        siteName="Medicleo"
        accentBg="#00558B"
        accentFg="#FFFFFF"
        borderColor="#D7E4E9"
        surfaceBg="#FFFFFF"
        textColor="#0D2131"
        mutedColor="#4C5D6A"
        openSignal={cookieSignal}
      />
    </div>
  );
}