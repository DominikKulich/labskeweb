import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import type { Photo } from "@/data/types";
import {
  articleRowToStory,
  fetchPublishedArticles,
  fetchPublishedNews,
  fetchPublishedPhotos,
  photoRowToPhoto,
} from "@/lib/cms";

import { images, photos } from "@/data/photos";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StoryCard } from "@/components/site/StoryCard";
import { NewsItem } from "@/components/site/NewsList";
import { pageSeo, webPageJsonLd } from "@/lib/seo";

function mixFeaturedPhotos(photos: Photo[], limit: number): Photo[] {
  const byCategory = photos.reduce<Record<string, Photo[]>>((acc, photo) => {
    const cat = photo.category || "historie";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(photo);
    return acc;
  }, {});

  const categories: Array<Photo["category"]> = ["historie", "soucasnost", "labe", "promeny"];
  const result: Photo[] = [];
  let round = 0;
  let added = true;

  while (result.length < limit && added) {
    added = false;
    for (const cat of categories) {
      const photo = byCategory[cat]?.[round];
      if (photo && result.length < limit) {
        result.push(photo);
        added = true;
      }
    }
    round++;
  }

  if (result.length < limit) {
    const usedIds = new Set(result.map((p) => p.id));
    const remaining = photos.filter((p) => !usedIds.has(p.id));
    result.push(...remaining.slice(0, limit - result.length));
  }

  return result;
}


export const Route = createFileRoute("/")({
  head: () => ({
    ...pageSeo({
      path: "/",
      title: "Labské nábřeží Štětí | Místo u řeky s příběhem",
      description:
        "Labské nábřeží ve Štětí chceme vrátit do života: sport, procházky, dětské hřiště, discgolf, posezení a akce u Labe — a současně uchovat příběhy a historii tohoto místa.",
      ogTitle: "Labské nábřeží Štětí — místo u řeky s příběhem",
      ogDescription:
        "Nábřeží ve Štětí ožívá: sport, procházky, akce u Labe a kolem toho historie, fotografie a vzpomínky místa.",
    }),
    scripts: [
      webPageJsonLd(
        "/",
        "Labské nábřeží Štětí",
        "Místo u řeky ve Štětí, které ožívá sportem, akcemi a setkáváním — a současně uchovává příběhy a historii nábřeží.",
      ),
    ],
  }),
  component: Index,
});

const teasers = [
  {
    title: "Přívoz",
    year: "1537–1973",
    text: "Přívoz je doložen od roku 1537, privilegium vydal Ferdinand I. v roce 1557. Poslední loď „Marie“ jezdila až do otevření mostu.",
    src: images.privoz,
  },
  {
    title: "Ostrov",
    year: "1908–1910",
    text: "Ostrov byl skutečným ostrovem — od města jej dělilo rameno Labe. Při regulaci ho zasypala hlušina z výstavby jezu.",
    src: images.plovarna2,
  },
  {
    title: "Most",
    year: "1973",
    text: "Most postavil SEPAP kvůli železniční vlečce do papíren. Proto je společný pro vlaky i auta — a ukončil provoz přívozu.",
    src: images.mostStavba,
  },
];


function Index() {
  const { data: photoRows } = useQuery({
    queryKey: ["photos", "published"],
    queryFn: fetchPublishedPhotos,
  });
  const { data: articleRows } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });

  const { data: newsRows } = useQuery({
    queryKey: ["news", "published"],
    queryFn: fetchPublishedNews,
  });

  const latestNews = (newsRows ?? []).slice(0, 2);
  const galleryPhotos = photoRows?.length ? photoRows.map(photoRowToPhoto) : photos;
  const featuredPhotos = mixFeaturedPhotos(galleryPhotos, galleryPhotos.length);
  const featuredStories = (articleRows ?? []).map(articleRowToStory);


  return (

    <>
      {/* HERO */}
      <section className="relative min-h-[86vh] w-full overflow-hidden bg-ink">
        <img
          src={images.hero}
          alt="Labské nábřeží ve Štětí — pohled na hladinu Labe"
          width={1440}
          height={1920}
          className="absolute inset-0 size-full object-cover [object-position:58%_42%] sm:[object-position:50%_38%]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,20,25,0.72) 0%, rgba(18,20,25,0.42) 38%, rgba(18,20,25,0.86) 100%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-ink/25" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-[1280px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
          <p className="eyebrow text-primary-foreground/75">Vizuální kronika · Labe</p>
          <h1 className="mt-5 max-w-4xl text-balance text-5xl leading-[0.98] text-primary-foreground sm:text-7xl lg:text-[5.5rem]">
            Labské nábřeží
          </h1>
          <p className="mt-6 max-w-xl font-display text-xl font-light text-primary-foreground/85 sm:text-2xl">
            Místo u Labe, které chceme vrátit do života.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/galerie"
              className="border border-primary-foreground/70 px-7 py-3.5 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-ink"
            >
              Prohlédnout galerii
            </Link>
            <Link
              to="/o-projektu"
              className="px-1 py-3.5 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-primary-foreground/85 hover:text-primary-foreground"
            >
              <span className="link-editorial">O projektu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* AKTUÁLNĚ U LABE */}
      {latestNews.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
              <Reveal>
                <p className="eyebrow">Aktuálně u Labe</p>
                <h2 className="mt-4 text-3xl leading-tight sm:text-[2.1rem]">
                  Co se na nábřeží děje teď
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Nábřeží není jen archiv. Krátké zprávy o akcích, sportu, údržbě i dočasných
                  omezeních.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <div className="space-y-8">
                  {latestNews.map((item) => (
                    <NewsItem key={item.id} item={item} compact />
                  ))}
                </div>
                <Link
                  to="/aktualne"
                  className="mt-10 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
                >
                  <span className="link-editorial">Všechny aktuality</span>
                  <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* TEHDY A DNES */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Porovnání"
                title="Tehdy a dnes"
                lead="Břeh Labe s odstupem desítek let. Vlevo letní koupání a plovárna na nábřeží v roce 1930, vpravo dnešní park u mostu. Linie břehu zůstala — všechno ostatní se změnilo."
              />
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border-strong pt-6 text-sm">
                <div>
                  <dt className="eyebrow">Archivní snímek</dt>
                  <dd className="mt-2 font-display text-2xl">1930</dd>
                </div>
                <div>
                  <dt className="eyebrow">Současný snímek</dt>
                  <dd className="mt-2 font-display text-2xl">Dnes</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={80}>
              <BeforeAfter
                beforeSrc={images.tehdy}
                afterSrc={images.dnes}
                beforeLabel="1930"
                afterLabel="Dnes"
                beforeAlt="Plovárna a koupání na nábřeží Labe ve Štětí v roce 1930"
                afterAlt="Dnešní park na nábřeží s mostem přes Labe"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* HISTORIE MÍSTA */}
      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <SectionHeading
              eyebrow="Historie místa"
              title="Tři témata, bez kterých se nábřeží nedá vyprávět"
            />
            <p className="text-[1.02rem] leading-relaxed text-muted-foreground lg:pb-2">
              Labe dávalo Štětí vodu, ryby, dopravu i obživu — a pravidelně si je bralo zpět.
              Začněte přívozem, Ostrovem a mostem; zbytek příběhu čeká v devíti kapitolách.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {teasers.map((t, i) => (
              <Reveal as="article" key={t.title} delay={i * 90}>
                <div className="bg-paper-deep p-3">
                  <img
                    src={t.src}
                    alt={t.title}
                    loading="lazy"
                    className="archival aspect-[4/5] w-full object-cover"
                  />
                </div>
                <p className="mt-5 font-display text-xl tabular-nums text-river-deep">{t.year}</p>
                <h3 className="mt-1 text-2xl">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <Link
              to="/historie"
              className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
            >
              <span className="link-editorial">Celá historie nábřeží</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Sbírka"
              title="Galerie minulosti i současnosti"
              lead="Archivní snímky sázíme na papírovém podkladu, současné fotografie necháváme čisté. Klikněte pro zvětšení a popis."
            />
            <Link
              to="/galerie"
              className="text-[0.75rem] font-medium uppercase tracking-[0.16em]"
            >
              <span className="link-editorial">Všechny fotografie</span>
            </Link>
          </Reveal>
          <GalleryGrid photos={featuredPhotos} pageSize={6} />
        </div>
      </section>

      {/* PŘÍBĚHY */}
      {featuredStories.length > 0 && (
        <section className="border-y border-border bg-paper">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Texty" title="Příběhy od Labe" />
              <Link
                to="/pribehy"
                className="text-[0.75rem] font-medium uppercase tracking-[0.16em]"
              >
                <span className="link-editorial">Všechny příběhy</span>
              </Link>
            </Reveal>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
              {featuredStories.slice(0, 3).map((s, i) => (
                <Reveal key={s.id} delay={i * 90}>
                  <StoryCard story={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* O PROJEKTU */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="O projektu"
                title="Oživit Labské nábřeží ve Štětí"
              />
              <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted-foreground">
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
              <Link
                to="/o-projektu"
                className="mt-8 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
              >
                <span className="link-editorial">Více o projektu</span>
                <span aria-hidden>→</span>
              </Link>
            </Reveal>

            <Reveal delay={80} className="bg-paper-deep p-8 sm:p-10">
              <p className="eyebrow">Výzva</p>
              <h3 className="mt-4 text-3xl leading-tight">
                Máte historické fotografie nebo vzpomínky?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Stačí i jeden snímek z rodinného alba nebo krátká vzpomínka. Originály vracíme,
                skenujeme zdarma a autora vždy uvádíme.
              </p>
              <Link
                to="/prispet"
                className="mt-8 inline-block border border-ink px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-background"
              >
                Napište nám
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
