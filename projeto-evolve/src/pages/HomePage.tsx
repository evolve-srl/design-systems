import { Link, useDocumentTitle } from "@/router";
import { MonitorPlay } from "lucide-react";
import { motion } from "motion/react";
import { ALL_SITES } from "@/data/sites";

const MotionLink = motion.create(Link);

export function HomePage() {
  useDocumentTitle("Evolve S.r.l. — Sites");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-editorial text-4xl font-medium tracking-tight"
        >
          Evolve S.r.l.
        </motion.h1>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
          className="mt-8 flex flex-col gap-3"
        >
          {ALL_SITES.map((site) => (
            <MotionLink
              key={site.slug}
              to="/preview/$slug"
              params={{ slug: site.slug }}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-border"
                  style={{ backgroundColor: site.brandAnchorHex }}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-editorial text-2xl font-medium">{site.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{site.domain}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                <MonitorPlay className="h-3.5 w-3.5" />
                Abrir site
              </span>
            </MotionLink>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
