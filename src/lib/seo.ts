export const SITE_URL = "https://www.labskenabrezi.cz";
export const SITE_NAME = "Labské nábřeží";

export function absoluteUrl(path: string): string {
  if (!path) return `${SITE_URL}/`;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageSeoInput {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  image?: string | undefined;
}

/** Vrací meta + links pro běžnou veřejnou stránku (canonical, OG, Twitter). */
export function pageSeo({
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
  image,
}: PageSeoInput) {
  const url = absoluteUrl(path);
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle ?? title },
    { property: "og:description", content: ogDescription ?? description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:locale", content: "cs_CZ" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle ?? title },
    { name: "twitter:description", content: ogDescription ?? description },
  ];
  if (image) {
    const abs = absoluteUrl(image);
    meta.push({ property: "og:image", content: abs });
    meta.push({ name: "twitter:image", content: abs });
  }
  return { meta, links: [{ rel: "canonical", href: url }] };
}

/** JSON-LD WebPage s odkazem na WebSite definovaný v rootu. */
export function webPageJsonLd(path: string, name: string, description: string) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name,
      description,
      inLanguage: "cs-CZ",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    }),
  };
}

/** JSON-LD BreadcrumbList: [{name, path}, ...] včetně domovské stránky. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Domů", path: "/" }, ...items].map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    }),
  };
}
