import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/photos";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/o-projektu")({
  head: () => ({
    ...pageSeo({
      path: "/o-projektu",
      title: "O projektu Labské nábřeží ve Štětí",
      description:
        "Labské nábřeží je nezávislý archiv fotografií, dokumentů a vzpomínek spojených s břehem Labe ve Štětí. Jak sbíráme a ověřujeme materiály.",
      ogTitle: "O projektu Labské nábřeží",
      ogDescription: "Nezávislý archiv fotografií a vzpomínek z nábřeží Labe ve Štětí.",
    }),
    scripts: [
      webPageJsonLd(
        "/o-projektu",
        "O projektu Labské nábřeží",
        "Archiv fotografií, dokumentů a vzpomínek z nábřeží Labe ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "O projektu", path: "/o-projektu" }]),
    ],
  }),
  component: OProjektuPage,
});

const principy = [
  {
    title: "Datace a zdroj",
    text: "U každé fotografie uvádíme rok, popis a odkud pochází. Nejisté datace označujeme jako přibližné.",
  },
  {
    title: "Originály vracíme",
    text: "Snímky skenujeme ve vysokém rozlišení a fyzické fotografie vracíme majitelům.",
  },
  {
    title: "Bez retuše",
    text: "Archivní snímky nezkrášlujeme filtry. Zásah omezujeme na odstranění prachu a srovnání.",
  },
  {
    title: "Otevřený archiv",
    text: "Materiály zpřístupňujeme veřejnosti, školám i badatelům. Autorství vždy uvádíme.",
  },
];

function OProjektuPage() {
  return (
    <>
      <PageHeader
        eyebrow="O projektu"
        title="Vizuální kronika jednoho místa a jeho proměn"
        lead="Labské nábřeží uchovává vzpomínky, fotografie a příběhy břehu Labe ve Štětí. Vzniká zdola, z rodinných alb a vyprávění pamětníků."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <Reveal>
            <div className="space-y-5 text-[1.05rem] leading-[1.75] text-foreground/85">
              <p>
                Nábřeží je místo, které si každá generace pamatuje jinak. Pro jedny je to rampa
                přívozu a dřevěné molo plovárny, pro druhé staveniště mostu, pro nejmladší
                dlážděná promenáda s alejí.
              </p>
              <p>
                Sbíráme fotografie, pohlednice, dokumenty i krátká vyprávění. Skládáme z nich
                obraz jednoho břehu napříč sto třiceti lety — bez nostalgie a bez příkras.
              </p>
              <p>
                Projekt není městský ani firemní. Nemá logo ani oficiální razítko. Drží ho pár
                lidí, kteří chtějí, aby fotografie z rodinných alb nezmizely spolu s alby.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} className="bg-paper-deep p-3">
            <img
              src={images.privoz}
              alt="Archivní snímek přívozu na Labi"
              loading="lazy"
              className="archival aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
          <p className="eyebrow">Jak pracujeme</p>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {principy.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="rule-top pt-5">
                  <h2 className="text-xl">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="bg-navy px-8 py-14 text-navy-foreground sm:px-14">
            <p className="eyebrow text-navy-foreground/60">Výzva</p>
            <h2 className="mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
              Máte historické fotografie nebo vzpomínky?
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-75">
              Ozvěte se i s jediným snímkem. Pomůže i vzpomínka bez fotografie — často díky ní
              dokážeme určit rok nebo místo u jiného snímku.
            </p>
            <Link
              to="/prispet"
              className="mt-9 inline-block border border-navy-foreground/60 px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-navy-foreground hover:text-navy"
            >
              Máte fotografii?
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
