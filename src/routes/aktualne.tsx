import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { NewsItem } from "@/components/site/NewsList";
import { fetchPublishedNews } from "@/lib/cms";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/aktualne")({
  head: () => ({
    ...pageSeo({
      path: "/aktualne",
      title: "Aktuálně na nábřeží ve Štětí | Labské nábřeží",
      description:
        "Přehled aktuálního dění na nábřeží ve Štětí — akce u Labe, sport v Labe aréně, komunitní setkání, údržba zeleně a dočasná omezení.",
      ogTitle: "Aktuálně na nábřeží ve Štětí",
      ogDescription: "Krátké zprávy o akcích a dění na Labském nábřeží ve Štětí.",
    }),
    scripts: [
      webPageJsonLd(
        "/aktualne",
        "Aktuálně na nábřeží ve Štětí",
        "Živý přehled akcí, úprav a dění na Labském nábřeží ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Aktuálně", path: "/aktualne" }]),
    ],
  }),
  component: AktualnePage,
});

function AktualnePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", "published"],
    queryFn: fetchPublishedNews,
  });

  const items = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Dění u Labe"
        title="Aktuálně"
        lead="Krátké zprávy o tom, co se právě děje na nábřeží ve Štětí — akce, sport, úpravy okolí i dočasná omezení."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">


            {isLoading && <p className="mt-8 text-sm text-muted-foreground">Načítám aktuality…</p>}
            {isError && (
              <p className="mt-8 text-sm text-muted-foreground">
                Aktuality se nepodařilo načíst. Zkuste stránku obnovit.
              </p>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <p className="mt-8 text-sm text-muted-foreground">
                Zatím tu není žádná aktualita. Sledujte tuto stránku, přibývají průběžně.
              </p>
            )}

            <div className="mt-10 space-y-10">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={i * 70}>
                  <NewsItem item={item} />
                </Reveal>
              ))}
            </div>

            <div className="mt-16 border-t border-border-strong pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Víte o akci nebo změně na nábřeží, která tu chybí? Napište nám — rádi ji doplníme.
              </p>
              <Link
                to="/prispet"
                className="mt-5 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
              >
                <span className="link-editorial">Ozvat se</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
