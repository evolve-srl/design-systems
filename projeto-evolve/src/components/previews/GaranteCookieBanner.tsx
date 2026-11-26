import { useEffect, useState } from "react";

interface GaranteCookieBannerProps {
  siteKey: string;
  siteName: string;
  accentBg: string;
  accentFg: string;
  borderColor: string;
  surfaceBg: string;
  textColor: string;
  mutedColor: string;
  openSignal: number;
}

export function GaranteCookieBanner({
  siteKey,
  siteName,
  accentBg,
  accentFg,
  borderColor,
  surfaceBg,
  textColor,
  mutedColor,
  openSignal,
}: GaranteCookieBannerProps) {
  const storageKey = `cookie-consent-${siteKey}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (openSignal > 0) setVisible(true);
  }, [openSignal]);

  function choose(choice: "rejected" | "accepted") {
    try {
      window.localStorage.setItem(storageKey, choice);
    } catch {
      // ignore storage restrictions
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label={`Preferenze cookie per ${siteName}`}
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-md border p-4 shadow-lg"
      style={{ backgroundColor: surfaceBg, borderColor, color: textColor }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-xs leading-relaxed">
          <p className="font-semibold" style={{ color: textColor }}>
            Cookie e riservatezza ({siteName})
          </p>
          <p className="mt-1" style={{ color: mutedColor }}>
            Utilizziamo solo cookie tecnici necessari al funzionamento del sito. Nessun cookie di
            profilazione o analisi viene attivato prima del tuo consenso (Linee guida Garante
            Privacy, giugno 2021).
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded border px-3.5 py-2 text-xs font-semibold transition-opacity hover:opacity-85 focus:outline-none focus:ring-2"
            style={{ borderColor: textColor, color: textColor, backgroundColor: "transparent" }}
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded px-3.5 py-2 text-xs font-semibold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2"
            style={{ backgroundColor: accentBg, color: accentFg }}
          >
            Accetta
          </button>
        </div>
      </div>
    </aside>
  );
}