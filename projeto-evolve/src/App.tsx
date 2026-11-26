import { useEffect } from "react";
import { Link, resolveRoute, useRoutePath } from "@/router";
import { getSiteBySlug } from "@/data/sites";
import { LiveSitePreviewPage } from "@/pages/LiveSitePreviewPage";

export function App() {
  const path = useRoutePath();
  const route = resolveRoute(path);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  if (route.kind === "not-found") {
    return <NotFound path={path} />;
  }

  const site = getSiteBySlug(route.slug);

  if (!site) {
    return <NotFound path={path} />;
  }

  return <LiveSitePreviewPage site={site} />;
}

function NotFound({ path }: { path: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        404 · route not found
      </p>
      <h1 className="font-editorial text-4xl font-medium text-foreground">
        Nothing lives at <span className="font-mono text-2xl">{path}</span>
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Open PrivacyMasters to access the five websites.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Open PrivacyMasters
      </Link>
    </div>
  );
}
