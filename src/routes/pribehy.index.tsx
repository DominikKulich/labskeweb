import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { StoryCard } from "@/components/site/StoryCard";
import { articleRowToStory, fetchPublishedArticles } from "@/lib/cms";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/pribehy/")({
  head: () => ({
    ...pageSeo({
      path: "/pribehy",
      title: "Příběhy od Labe ve Štětí | Labské nábřeží",
      description:
        "Texty o nábřeží ve Štětí: stavba mostu přes Labe, přívoz spojující oba břehy, plovárna na Ostrově a každodenní život u řeky.",
      ogTitle: "Příběhy od Labe ve Štětí",
      ogDescription: "Texty o mostě, přívozu, plovárně a životě na nábřeží ve Štětí.",
    }),
    scripts: [
      webPageJsonLd(
        "/pribehy",
        "Příběhy od Labe ve Štětí",
        "Přehled článků o historii a proměnách nábřeží ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Příběhy", path: "/pribehy" }]),
    ],
  }),
  component: PribehyPage,
});

function PribehyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });

  const stories = (data ?? []).map(articleRowToStory);

  return (
    <>
      <PageHeader
        eyebrow="Texty"
        title="Příběhy od Labe"
        lead="Delší vyprávění poskládaná z archivních snímků, dobových zmínek a vzpomínek pamětníků."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          {isLoading && <p className="text-sm text-muted-foreground">Načítám příběhy…</p>}
          {isError && (
            <p className="text-sm text-muted-foreground">
              Příběhy se nepodařilo načíst. Zkuste stránku obnovit.
            </p>
          )}
          {!isLoading && !isError && stories.length === 0 && (
            <p className="text-sm text-muted-foreground">Zatím zde není zveřejněný žádný text.</p>
          )}
          <div className="grid gap-14 md:grid-cols-3 md:gap-8">
            {stories.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <StoryCard story={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
