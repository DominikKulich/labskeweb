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
import { stories } from "@/data/stories";
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
      title: "Labské nábřeží Štětí | Historie, fotografie a příběhy",
      description:
        "Labské nábřeží ve Štětí: historie i současnost břehu Labe, archivní i nové fotografie, proměny místa a příběhy lidí od řeky.",
      ogTitle: "Labské nábřeží Štětí — historie, fotografie a příběhy",
      ogDescription:
        "Historické i současné fotografie nábřeží ve Štětí, proměny břehu Labe a příběhy místa.",
      image: "/images/nabrezi2.webp",
    }),
    scripts: [
      webPageJsonLd(
        "/",
        "Labské nábřeží Štětí",
        "Historie i současnost Labského nábřeží ve Štětí — fotografie, proměny a příběhy.",
      ),
    ],
  }),
  component: Index,
});

const teasers = [
  {
    title: "Přívoz přes Labe",
    text: "Osmdesát let byl prám jediným spojením obou břehů. Jízdní řád se řídil výškou hladiny.",
    src: images.privoz,
  },
  {
    title: "Stavba mostu",
    text: "Tři roky staveniště, které natrvalo změnilo tvar i význam celého nábřeží.",
    src: images.mostStavba,
  },
  {
    title: "Život u řeky",
    text: "Plovárna na Ostrově, koupání a loďky. Řeka byla přirozeným prodloužením města.",
    src: images.tehdy,
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
  const featuredStories = articleRows?.length ? articleRows.map(articleRowToStory) : stories;


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
            Příběhy, proměny a vzpomínky z břehu Labe ve Štětí.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/galerie"
              className="border border-primary-foreground/70 px-7 py-3.5 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-ink"
            >
              Prohlédnout galerii
            </Link>
            <Link
              to="/historie"
              className="px-1 py-3.5 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-primary-foreground/85 hover:text-primary-foreground"
            >
              <span className="link-editorial">Objevit historii</span>
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
              title="Břeh, který se za sto let přepsal několikrát"
            />
            <p className="text-[1.02rem] leading-relaxed text-muted-foreground lg:pb-2">
              Nábřeží nebylo nikdy jen kus dlažby u vody. Bylo přístavištěm, staveništěm,
              koupalištěm i hranicí, po které se rozlévala velká voda. Každá z těch rolí po sobě
              nechala stopu — někdy v terénu, častěji jen na fotografiích.
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
                <h3 className="mt-5 text-2xl">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <Link
              to="/historie"
              className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
            >
              <span className="link-editorial">Celá časová osa</span>
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
      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow="Texty" title="Příběhy od Labe" />
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

      {/* O PROJEKTU */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="O projektu"
                title="Uchováváme vzpomínky, fotografie a příběhy Labského nábřeží"
              />
              <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                <p>
                  Labské nábřeží je nezávislý komunitní archiv. Shromažďujeme fotografie, dokumenty
                  a vyprávění, která se váží k břehu Labe ve Štětí — od přívozu přes plovárnu až po
                  dnešní promenádu.
                </p>
                <p>
                  Každý snímek popisujeme rokem, místem a zdrojem. Nechceme jen hezké obrázky:
                  chceme, aby se dalo dohledat, kdo je pořídil a co na nich je.
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
                Máte fotografii?
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
