import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/site/PageHeader";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { fetchPublishedPhotos, photoRowToPhoto } from "@/lib/cms";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    ...pageSeo({
      path: "/galerie",
      title: "Historické fotografie Štětí a Labe | Galerie",
      description:
        "Galerie fotografií Labského nábřeží ve Štětí — archivní i současné snímky Labe, filtrování podle kategorií, popisy, datace a zdroje.",
      ogTitle: "Galerie fotografií nábřeží ve Štětí",
      ogDescription: "Archivní i současné snímky nábřeží a Labe s popisem, datací a zdrojem.",
    }),
    scripts: [
      webPageJsonLd(
        "/galerie",
        "Galerie fotografií Labského nábřeží ve Štětí",
        "Historické i současné fotografie nábřeží a Labe ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Galerie", path: "/galerie" }]),
    ],
  }),
  component: GaleriePage,
});

function GaleriePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["photos", "published"],
    queryFn: fetchPublishedPhotos,
  });

  const photos = (data ?? []).map(photoRowToPhoto);

  return (
    <>
      <PageHeader
        eyebrow={isLoading ? "Sbírka" : `Sbírka · ${photos.length} snímků`}
        title="Galerie"
        lead="Vyberte kategorii a klikněte na fotografii pro zvětšení. U každého snímku uvádíme rok, popis a zdroj."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          {isLoading && <p className="text-sm text-muted-foreground">Načítám snímky…</p>}
          {isError && (
            <p className="text-sm text-muted-foreground">
              Snímky se nepodařilo načíst. Zkuste stránku obnovit.
            </p>
          )}
          {!isLoading && !isError && photos.length === 0 && (
            <p className="text-sm text-muted-foreground">
              V archivu zatím nejsou zveřejněné žádné snímky.
            </p>
          )}
          {photos.length > 0 && <GalleryGrid photos={photos} />}
        </div>
      </section>
    </>
  );
}
