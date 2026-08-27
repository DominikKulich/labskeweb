import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/photos";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/o-projektu")({
  head: () => ({
    ...pageSeo({
      path: "/o-projektu",
      title: "O projektu Labské nábřeží ve Štětí — oživit břeh Labe",
      description:
        "Cílem Labského nábřeží je oživit břeh Labe ve Štětí — sport, akce, procházky i setkávání. Archiv fotografií a příběhů pomáhá budovat vztah k místu.",
      ogTitle: "Labské nábřeží — oživit nábřeží ve Štětí",
      ogDescription:
        "Chceme, aby se na nábřeží ve Štětí něco dělo. Sport, akce, procházky — a zároveň příběhy a fotografie z historie místa.",
    }),
    scripts: [
      webPageJsonLd(
        "/o-projektu",
        "O projektu Labské nábřeží",
        "Cílem je oživit Labské nábřeží ve Štětí a zároveň uchovávat jeho fotografie, dokumenty a příběhy.",
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
        title="Oživit Labské nábřeží ve Štětí"
        lead="Chceme, aby nábřeží bylo místem, kam se lidé nebojí chodit — na sport, procházku, posezení i akce u vody. Archiv fotografií a historie je nástroj, jak navázat na příběh místa a budovat k němu vztah."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <Reveal>
            <div className="space-y-5 text-[1.05rem] leading-[1.75] text-foreground/85">
              <p>
                Labské nábřeží ve Štětí má být místo, kde se něco děje. Představujeme si ho jako
                břeh, kam lidé přijdou na discgolf, dětské hřiště, sport, procházku nebo posezení.
                Místo, které si každý užije po svém.
              </p>
              <p>
                Současně věříme, že kdo zná historii místa, má k němu blíž. Proto sbíráme
                fotografie, dokumenty a vzpomínky — od přívozu přes plovárnu až po dnešní
                promenádu. Archiv není cíl, je to způsob, jak nábřeží vrátit do povědomí a do
                života města.
              </p>
              <p>
                Projekt není městský ani firemní. Drží ho lidé, kteří chtějí, aby fotografie z
                rodinných alb nezmizely spolu s alby a aby břeh Labe znovu patřil Štětí.
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

      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="eyebrow">Poděkování</p>
            <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-muted-foreground">
              Děkujeme za poskytnuté fotografie, informace a historické materiály:
            </p>
            <p className="mt-3 max-w-3xl text-[1.05rem] leading-relaxed text-foreground/90">
              Zdeněk Fořt · Miloš Bílek · Retro Štětí · Štětí · Vodní mlýny · Martin Krch
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="bg-navy px-8 py-14 text-navy-foreground sm:px-14">
            <p className="eyebrow text-navy-foreground/60">Výzva</p>
            <h2 className="mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
              Máte historické fotografie, vzpomínky nebo informace k nábřeží? Ozvěte se nám.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed opacity-75">
              Pomůže i jediný snímek nebo vzpomínka — často díky ní dokážeme určit rok nebo místo u jiného snímku.
            </p>
            <Link
              to="/prispet"
              className="mt-9 inline-block border border-navy-foreground/60 px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-navy-foreground hover:text-navy"
            >
              Napište nám
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
