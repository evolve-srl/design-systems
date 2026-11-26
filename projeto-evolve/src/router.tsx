/**
 * Tiny hash-based router.
 *
 * Routes live in the URL hash (`#/preview/medicleo`) so the built app also works
 * when opened straight from the file system or served from any static host
 * without rewrite rules.
 *
 * Hashes that do not start with `/` (for example `#mc-contatti`) are in-page
 * anchor jumps inside a live site: the browser scrolls natively and the router
 * keeps the current route untouched.
 */
import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

export type RouteParams = Record<string, string>;

export function toHref(to: string, params?: RouteParams): string {
  let path = to;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`$${key}`, value);
    }
  }
  return `#${path}`;
}

export function pathFromHash(hash: string): string | undefined {
  const raw = hash.replace(/^#/, "");
  return raw.startsWith("/") ? raw : undefined;
}

function initialPath(): string {
  return pathFromHash(window.location.hash) ?? "/";
}

export function useRoutePath(): string {
  const [path, setPath] = useState<string>(initialPath);

  useEffect(() => {
    const onHashChange = () => {
      const next = pathFromHash(window.location.hash);
      if (next) setPath(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return path;
}

export type ResolvedRoute =
  | { kind: "preview"; slug: string }
  | { kind: "not-found"; path: string };

export function resolveRoute(path: string): ResolvedRoute {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { kind: "preview", slug: "privacymasters" };
  }

  const [section, slug] = segments;

  // Older dossier links open the corresponding site.
  if ((section === "preview" || section === "site") && slug) {
    return { kind: "preview", slug };
  }

  return { kind: "not-found", path };
}

export function navigate(to: string, params?: RouteParams): void {
  window.location.hash = toHref(to, params).slice(1);
}

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: RouteParams;
  children: ReactNode;
};

export function Link({ to, params, children, ...anchorProps }: LinkProps) {
  return (
    <a href={toHref(to, params)} {...anchorProps}>
      {children}
    </a>
  );
}
