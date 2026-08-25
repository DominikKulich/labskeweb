import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { timeline } from "@/data/stories";
import { images } from "@/data/photos";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/historie")({
  head: () => ({
    ...pageSeo({
      path: "/historie",
      title: "Historie Labského nábřeží ve Štětí | Časová osa",
      description:
        "Historie Štětí u Labe na časové ose: kamenný břeh, plovárna, přívoz, povodně, stavba mostu v roce 1973 i dnešní promenáda.",
      ogTitle: "Historie Labského nábřeží ve Štětí",
      ogDescription:
        "Časová osa nábřeží ve Štětí — od kamenného břehu po revitalizovanou promenádu.",
    }),
    scripts: [
      webPageJsonLd(
        "/historie",
        "Historie Labského nábřeží ve Štětí",
        "Časová osa proměn nábřeží a břehu Labe ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Historie", path: "/historie" }]),
    ],
  }),
  component: HistoriePage,
});

function HistoriePage() {
  return (
    <>
      <PageHeader
        eyebrow="Historie místa"
        title="Sto třicet let na jednom břehu"
        lead="Časová osa poskládaná z fotografií, dobových zmínek a vzpomínek pamětníků. Doplňujeme ji průběžně — každý nový snímek může některý údaj upřesnit."
      />

      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
          <ol className="relative">
            {timeline.map((entry, i) => (
              <Reveal as="li" key={entry.id} delay={40}>
                <div className="grid gap-6 border-t border-border py-12 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[160px_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14">
                  <p className="font-display text-3xl tabular-nums text-river-deep sm:text-4xl">
                    {entry.year}
                  </p>
                  <div>
                    <h2 className="text-2xl leading-snug sm:text-3xl">{entry.title}</h2>
                    <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
                      {entry.text}
                    </p>
                  </div>
                  {entry.imageSrc ? (
                    <figure className="m-0 bg-paper-deep p-2.5 lg:mt-1">
                      <img
                        src={entry.imageSrc}
                        alt={entry.imageAlt ?? entry.title}
                        loading="lazy"
                        className={
                          i >= timeline.length - 1
                            ? "aspect-[4/3] w-full object-cover"
                            : "archival aspect-[4/3] w-full object-cover"
                        }
                      />
                    </figure>
                  ) : (
                    <div aria-hidden className="hidden lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-paper">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Tematické bloky</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Řeka jako dopravní tepna, hranice i koupaliště
            </h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted-foreground">
              <p>
                Nákladní doprava po Labi určovala rytmus města déle než sto let. Překladiště
                fungovalo od časného rána, remorkéry se ohlašovaly houkáním a děti podle nich
                poznávaly čas.
              </p>
              <p>
                Povodně jsou druhou stálicí. Roky 1940 a 2002 se do podoby nábřeží zapsaly stejně
                silně jako kterákoli stavební úprava.
              </p>
            </div>
            <Link
              to="/pribehy"
              className="mt-8 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
            >
              <span className="link-editorial">Přečíst delší příběhy</span>
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal delay={80} className="bg-paper-deep p-3">
            <img
              src={images.pristav}
              alt="Plachetnice na Labi"
              loading="lazy"
              className="archival aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
