import { useState } from "react";
import { Monitor, Smartphone, Eye, EyeOff } from "lucide-react";
import type { WireframeSection } from "@/data/types";

interface GreyscaleWireframeProps {
  sections: WireframeSection[];
  domain: string;
}

export function GreyscaleWireframe({ sections, domain }: GreyscaleWireframeProps) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [showNotes, setShowNotes] = useState(true);
  const isMobile = viewport === "mobile";

  return (
    <div className="mt-6 rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Strict Greyscale Homepage Wireframe · Zero Colour / Zero Effects
          </p>
          <p className="text-xs text-muted-foreground">
            Real Italian copy & verified numbers from <span className="font-mono">{domain}</span> — validate content order before styling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded border border-border bg-background p-0.5"
            role="group"
            aria-label="Wireframe viewport width"
          >
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                !isMobile
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              1280px
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                isMobile
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              390px
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNotes((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-secondary"
          >
            {showNotes ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showNotes ? "Hide rationale" : "Show rationale"}
          </button>
        </div>
      </div>

      <div className="bg-wire-surface-alt/60 p-4 sm:p-6 overflow-x-auto">
        <div
          className={`mx-auto border border-wire-border bg-wire-bg text-wire-ink transition-all ${
            isMobile ? "w-[358px] max-w-full shadow-sm" : "w-full max-w-4xl"
          }`}
        >
          <div className="flex items-center justify-between border-b border-wire-border bg-wire-surface px-3 py-1.5 font-mono text-[10px] text-wire-muted">
            <span>WIREFRAME · {domain}</span>
            <span>{isMobile ? "MOBILE 390px" : "DESKTOP 1280px"} · GREYSCALE ONLY</span>
          </div>

          <div className="divide-y divide-wire-border">
            {sections.map((sec) => (
              <div key={sec.id} className="p-4 sm:p-5">
                {showNotes && (
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-wire-border pb-2 font-mono text-[11px] text-wire-muted">
                    <span>
                      [{sec.order}] {sec.name.toUpperCase()}
                    </span>
                    <span className="italic">Visitor asks: “{sec.visitorQuestion}”</span>
                  </div>
                )}

                {sec.kind === "header" && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="border border-wire-border bg-wire-surface px-2.5 py-1 font-mono text-xs font-semibold text-wire-ink">
                      {sec.headline}
                    </div>
                    {!isMobile && sec.items && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-wire-muted">
                        {sec.items.map((item) => (
                          <span key={item.label}>{item.label}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {sec.ctaPrimary && (
                        <span className="bg-wire-fill px-3 py-1 font-mono text-[11px] text-wire-bg">
                          {sec.ctaPrimary}
                        </span>
                      )}
                      {isMobile && (
                        <span className="border border-wire-border px-2 py-1 font-mono text-[10px] text-wire-ink">
                          MENU
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {sec.kind === "hero" && (
                  <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "md:grid-cols-12"}`}>
                    <div className={isMobile ? "" : "md:col-span-7"}>
                      {sec.eyebrow && (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-wire-muted">
                          {sec.eyebrow}
                        </p>
                      )}
                      <h4 className="mt-1.5 font-sans text-xl font-bold leading-tight text-wire-ink sm:text-2xl">
                        {sec.headline}
                      </h4>
                      {sec.subcopy && (
                        <p className="mt-2 text-xs leading-relaxed text-wire-muted">
                          {sec.subcopy}
                        </p>
                      )}
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {sec.ctaPrimary && (
                          <span className="bg-wire-fill px-3 py-1.5 font-mono text-xs text-wire-bg">
                            {sec.ctaPrimary}
                          </span>
                        )}
                        {sec.ctaSecondary && (
                          <span className="border border-wire-ink px-3 py-1.5 font-mono text-xs text-wire-ink">
                            {sec.ctaSecondary}
                          </span>
                        )}
                      </div>
                    </div>
                    {sec.mediaPlaceholder && (
                      <div
                        className={`wireframe-hatch flex min-h-32 items-center justify-center border border-dashed border-wire-border bg-wire-surface p-3 text-center font-mono text-[11px] leading-relaxed text-wire-muted ${
                          isMobile ? "" : "md:col-span-5"
                        }`}
                      >
                        {sec.mediaPlaceholder}
                      </div>
                    )}
                  </div>
                )}

                {(sec.kind === "stats" || sec.kind === "grid-4") && (
                  <div>
                    {sec.eyebrow && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-wire-muted">
                        {sec.eyebrow}
                      </p>
                    )}
                    <h4 className="mt-1 font-sans text-base font-bold text-wire-ink">
                      {sec.headline}
                    </h4>
                    {sec.subcopy && (
                      <p className="mt-1 text-xs text-wire-muted">{sec.subcopy}</p>
                    )}
                    {sec.items && (
                      <div
                        className={`mt-3 grid gap-2.5 ${
                          isMobile
                            ? "grid-cols-1"
                            : sec.kind === "stats"
                              ? "sm:grid-cols-4"
                              : "sm:grid-cols-2"
                        }`}
                      >
                        {sec.items.map((item) => (
                          <div
                            key={item.label}
                            className="border border-wire-border bg-wire-surface p-3"
                          >
                            {item.meta && (
                              <p className="font-mono text-[10px] uppercase text-wire-muted">
                                {item.meta}
                              </p>
                            )}
                            <p className="mt-0.5 font-mono text-sm font-bold text-wire-ink">
                              {item.label}
                            </p>
                            {item.detail && (
                              <p className="mt-1 text-xs leading-snug text-wire-muted">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.footnote && (
                      <p className="mt-2.5 font-mono text-[11px] text-wire-muted">
                        {sec.footnote}
                      </p>
                    )}
                  </div>
                )}

                {sec.kind === "process" && (
                  <div>
                    {sec.eyebrow && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-wire-muted">
                        {sec.eyebrow}
                      </p>
                    )}
                    <h4 className="mt-1 font-sans text-base font-bold text-wire-ink">
                      {sec.headline}
                    </h4>
                    {sec.items && (
                      <div
                        className={`mt-3 grid gap-2.5 ${
                          isMobile ? "grid-cols-1" : "sm:grid-cols-3"
                        }`}
                      >
                        {sec.items.map((item) => (
                          <div
                            key={item.label}
                            className="border-t-2 border-wire-ink bg-wire-surface p-3"
                          >
                            <p className="font-mono text-xs font-bold text-wire-ink">
                              {item.label}
                            </p>
                            {item.detail && (
                              <p className="mt-1 text-xs leading-snug text-wire-muted">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.footnote && (
                      <p className="mt-2.5 border border-dashed border-wire-border p-2 font-mono text-[11px] text-wire-muted">
                        {sec.footnote}
                      </p>
                    )}
                  </div>
                )}

                {(sec.kind === "list" || sec.kind === "faq") && (
                  <div>
                    {sec.eyebrow && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-wire-muted">
                        {sec.eyebrow}
                      </p>
                    )}
                    <h4 className="mt-1 font-sans text-base font-bold text-wire-ink">
                      {sec.headline}
                    </h4>
                    {sec.subcopy && (
                      <p className="mt-1 text-xs text-wire-muted">{sec.subcopy}</p>
                    )}
                    {sec.items && (
                      <div className="mt-3 divide-y divide-wire-border border border-wire-border">
                        {sec.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex flex-col justify-between gap-1 bg-wire-bg px-3 py-2.5 sm:flex-row sm:items-baseline"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-wire-ink">
                                {sec.kind === "faq" ? "+ " : ""}
                                {item.label}
                              </p>
                              {item.detail && (
                                <p className="mt-0.5 text-xs text-wire-muted">{item.detail}</p>
                              )}
                            </div>
                            {item.meta && (
                              <span className="shrink-0 font-mono text-[10px] uppercase text-wire-muted">
                                {item.meta}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sec.kind === "cta" && (
                  <div className="border-2 border-wire-ink bg-wire-surface p-4 text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      {sec.eyebrow && (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-wire-muted">
                          {sec.eyebrow}
                        </p>
                      )}
                      <h4 className="mt-0.5 font-sans text-base font-bold text-wire-ink">
                        {sec.headline}
                      </h4>
                      {sec.subcopy && (
                        <p className="mt-1 max-w-xl text-xs text-wire-muted">{sec.subcopy}</p>
                      )}
                    </div>
                    <div className="mt-3 flex shrink-0 flex-wrap gap-2 sm:mt-0">
                      {sec.ctaPrimary && (
                        <span className="bg-wire-fill px-3.5 py-2 font-mono text-xs text-wire-bg">
                          {sec.ctaPrimary}
                        </span>
                      )}
                      {sec.ctaSecondary && (
                        <span className="border border-wire-ink px-3 py-2 font-mono text-xs text-wire-ink">
                          {sec.ctaSecondary}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {sec.kind === "footer" && (
                  <div className="bg-wire-surface-alt p-3 font-mono text-[11px] text-wire-muted">
                    <p className="font-semibold text-wire-ink">{sec.headline}</p>
                    {sec.subcopy && <p className="mt-1">{sec.subcopy}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}