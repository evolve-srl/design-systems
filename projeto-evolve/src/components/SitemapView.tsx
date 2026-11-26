import type { SitemapGroup } from "@/data/types";

interface SitemapViewProps {
  groups: SitemapGroup[];
  domain: string;
}

export function SitemapView({ groups, domain }: SitemapViewProps) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Site Architecture (from live content.md links)
          </p>
          <h3 className="mt-0.5 font-editorial text-lg font-medium text-foreground">
            Sitemap · {domain}
          </h3>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Root: https://{domain}/
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.label}
            className="rounded border border-border/80 bg-background p-3.5"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground">
              {group.label}
            </p>
            <ul className="mt-2.5 space-y-2 text-xs">
              {group.items.map((item) => (
                <li key={`${group.label}-${item.title}`} className="border-l-2 border-border pl-2.5">
                  <div className="font-medium text-foreground">{item.title}</div>
                  <div className="font-mono text-[11px] text-muted-foreground break-all">
                    {item.path}
                  </div>
                  {item.note && (
                    <div className="mt-0.5 text-[11px] italic text-muted-foreground">
                      {item.note}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}