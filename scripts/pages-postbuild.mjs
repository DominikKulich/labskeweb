/**
 * Post-build krok pro statické nasazení (GitHub Pages).
 * - vygeneruje sitemap.xml z veřejných rout + publikovaných článků
 * - vytvoří 404.html jako SPA fallback pro deep-linky
 * - zajistí .nojekyll a CNAME v outputu
 */
import { existsSync, copyFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env["PAGES_OUTPUT_DIR"] || "dist/client";
const SITE_URL = "https://www.labskenabrezi.cz";

if (!existsSync(OUT)) {
  console.error(`[pages] Výstupní adresář ${OUT} neexistuje.`);
  process.exit(1);
}

/* ---------- sitemap ---------- */

const staticEntries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/historie", changefreq: "monthly", priority: "0.9" },
  { path: "/galerie", changefreq: "weekly", priority: "0.9" },
  { path: "/pribehy", changefreq: "weekly", priority: "0.8" },
  { path: "/o-projektu", changefreq: "yearly", priority: "0.5" },
  { path: "/prispet", changefreq: "yearly", priority: "0.5" },
];

async function fetchArticleSlugs() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/articles?select=slug&published=eq.true`, {
      headers: { apikey: key },
    });
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r) => r.slug).filter(Boolean);
  } catch {
    return [];
  }
}

const entries = [
  ...staticEntries,
  ...(await fetchArticleSlugs()).map((slug) => ({
    path: `/pribehy/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${SITE_URL}${e.path}</loc>`,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(join(OUT, "sitemap.xml"), xml);
console.log(`[pages] sitemap.xml (${entries.length} URL)`);

/* ---------- SPA fallback ---------- */

const shellCandidates = [
  join(OUT, "_shell.html"),
  join(OUT, "_shell", "index.html"),
  join(OUT, "_shell.html"),
  join(OUT, "index.html"),
];
const shell = shellCandidates.find((p) => existsSync(p));
if (!shell) {
  console.error("[pages] Nenalezen SPA shell ani index.html.");
  process.exit(1);
}
copyFileSync(shell, join(OUT, "404.html"));
console.log(`[pages] 404.html <- ${shell}`);

/* ---------- statické soubory pro Pages ---------- */

writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(join(OUT, "CNAME"), "www.labskenabrezi.cz\n");

// Deep-link routy adminu (statický shell), aby přímé otevření nekončilo 404.
for (const route of ["admin", "admin/login"]) {
  const dir = join(OUT, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(shell, join(dir, "index.html"));
}

console.log(`[pages] hotovo: ${readdirSync(OUT).length} položek v ${OUT}`);
