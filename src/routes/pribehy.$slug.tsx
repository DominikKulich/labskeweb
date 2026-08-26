import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { formatDate, StoryCard } from "@/components/site/StoryCard";
import {
  articleRowToStory,
  fetchPublishedArticleBySlug,
  fetchPublishedArticles,
} from "@/lib/cms";
import { absoluteUrl, breadcrumbJsonLd, pageSeo, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/pribehy/$slug")({
  loader: async ({ params }) => {
    try {
      return { article: await fetchPublishedArticleBySlug(params.slug) };
    } catch {
      return { article: null };
    }
  },
  head: ({ params, loaderData }) => {
    const article = loaderData?.article;
    const title = article?.title ?? params.slug.replace(/-/g, " ");
    const description =
      article?.excerpt ?? "Příběh z archivu nábřeží ve Štětí — fotografie, vzpomínky a souvislosti.";
    const path = `/pribehy/${params.slug}`;
    const seo = pageSeo({
      path,
      title: `${title} | Labské nábřeží Štětí`,
      description,
      ogTitle: `${title} — Labské nábřeží`,
      ogType: "article",
      image: article?.cover_image_url ?? undefined,
    });
    const scripts: Array<{ type: string; children: string }> = [
      breadcrumbJsonLd([
        { name: "Příběhy", path: "/pribehy" },
        { name: title, path },
      ]),
    ];
    if (article) {
      scripts.unshift({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt ?? undefined,
          image: article.cover_image_url ? [absoluteUrl(article.cover_image_url)] : undefined,
          datePublished: article.published_at ?? undefined,
          inLanguage: "cs-CZ",
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
          isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        }),
      });
    }
    return { ...seo, scripts };
  },

  errorComponent: StoryNotFound,
  notFoundComponent: StoryNotFound,
  component: StoryDetail,
});

function StoryNotFound() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-40 text-center sm:px-8">
      <h1 className="text-4xl">Příběh nenalezen</h1>
      <p className="mt-4 text-muted-foreground">Tento text v archivu zatím není.</p>
      <Link
        to="/pribehy"
        className="mt-8 inline-block link-editorial text-sm uppercase tracking-[0.16em]"
      >
        Zpět na příběhy
      </Link>
    </div>
  );
}

function StoryDetail() {
  const { slug } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchPublishedArticleBySlug(slug),
  });
  const { data: allArticles } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-5 py-40 text-center sm:px-8">
        <p className="text-sm text-muted-foreground">Načítám příběh…</p>
      </div>
    );
  }

  if (!data) return <StoryNotFound />;

  const story = articleRowToStory(data);
  const related = (allArticles ?? [])
    .filter((a) => a.slug !== slug)
    .slice(0, 2)
    .map(articleRowToStory);

  return (
    <article>
      <figure className="relative m-0 h-[68vh] min-h-[420px] w-full overflow-hidden bg-ink">
        {story.coverSrc && (
          <img
            src={story.coverSrc}
            alt={story.coverAlt}
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(24,26,32,0.6) 0%, rgba(24,26,32,0.2) 45%, rgba(24,26,32,0.8) 100%)",
          }}
        />
        <figcaption className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.18em] text-primary-foreground/75">
            <span>{story.category}</span>
            {story.date && (
              <>
                <span aria-hidden className="h-px w-6 bg-primary-foreground/40" />
                <time dateTime={story.date}>{formatDate(story.date)}</time>
              </>
            )}
            <span aria-hidden className="h-px w-6 bg-primary-foreground/40" />
            <span>{story.readingTime} min čtení</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl leading-[1.03] text-primary-foreground sm:text-6xl">
            {story.title}
          </h1>
        </figcaption>
      </figure>

      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[42rem]">
            {story.perex && (
              <p className="font-display text-xl font-light leading-relaxed text-foreground sm:text-2xl">
                {story.perex}
              </p>
            )}

            <div className="mt-12 space-y-8">
              {story.body.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={i} className="pt-4 text-2xl leading-snug sm:text-3xl">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={i}
                      className="border-l-2 border-river py-1 pl-6 text-xl font-light leading-relaxed"
                    >
                      <p>{block.text}</p>
                      {block.author && (
                        <footer className="mt-3 font-sans text-xs uppercase not-italic tracking-[0.16em] text-muted-foreground">
                          {block.author}
                        </footer>
                      )}
                    </blockquote>
                  );
                }
                if (block.type === "image") {
                  return (
                    <figure key={i} className="m-0 -mx-5 sm:mx-0">
                      <img
                        src={block.src}
                        alt={block.caption}
                        loading="lazy"
                        className="w-full object-cover"
                      />
                      <figcaption className="mt-3 px-5 text-xs text-muted-foreground sm:px-0">
                        {block.caption}
                      </figcaption>
                    </figure>
                  );
                }
                return (
                  <p key={i} className="text-[1.08rem] leading-[1.75] text-foreground/85">
                    {block.text}
                  </p>
                );
              })}
            </div>

            <div className="mt-16 border-t border-border pt-8">
              <Link
                to="/prispet"
                className="link-editorial text-[0.78rem] font-medium uppercase tracking-[0.16em]"
              >
                Máte k tomuto tématu fotografii? Napište nám →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-paper">
          <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="eyebrow">Další příběhy</p>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-8">
              {related.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
