// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Statický build (GitHub Pages) se zapíná proměnnou PAGES_BUILD=1.
 * Bez ní zůstává chování beze změny (serverový build pro Lovable/Cloudflare).
 */
const isPagesBuild = process.env["PAGES_BUILD"] === "1";

const PUBLIC_ROUTES = ["/", "/historie", "/galerie", "/pribehy", "/o-projektu", "/prispet"];

/** Slugy publikovaných článků načtené přes veřejné (publishable) API v době buildu. */
async function fetchArticlePaths(): Promise<string[]> {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/articles?select=slug&published=eq.true`, {
      headers: { apikey: key },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string }>;
    return rows.filter((r) => r?.slug).map((r) => `/pribehy/${r.slug}`);
  } catch {
    return [];
  }
}

const prerenderPaths = isPagesBuild ? [...PUBLIC_ROUTES, ...(await fetchArticlePaths())] : [];

export default defineConfig({
  tanstackStart: isPagesBuild
    ? {
        // Statický výstup: prerender veřejných stránek + SPA shell pro ostatní routy.
        server: { entry: "server" },
        spa: { enabled: true, maskPath: "/_spa-shell" },
        prerender: { enabled: true, crawlLinks: false, failOnError: false },
        pages: prerenderPaths.map((path) => ({ path, prerender: { enabled: true } })),
      }

    : {
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        // nitro/vite builds from this
        server: { entry: "server" },
      },
  // Pro statický výstup nepotřebujeme serverový (nitro) bundle.
  ...(isPagesBuild ? { nitro: false as const } : {}),
});
