import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { fetchPublishedArticles } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/aktualne", changefreq: "daily", priority: "0.8" },
          { path: "/historie", changefreq: "monthly", priority: "0.9" },
          { path: "/galerie", changefreq: "weekly", priority: "0.9" },
          { path: "/pribehy", changefreq: "weekly", priority: "0.8" },
          { path: "/o-projektu", changefreq: "yearly", priority: "0.5" },
          { path: "/prispet", changefreq: "yearly", priority: "0.5" },
        ];

        try {
          const articles = await fetchPublishedArticles();
          for (const article of articles) {
            entries.push({
              path: `/pribehy/${article.slug}`,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        } catch {
          // Bez načtených článků vracíme alespoň statické stránky.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
