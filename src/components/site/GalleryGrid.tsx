import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Photo, PhotoCategory } from "@/data/types";
import { photoCategoryLabels } from "@/data/types";
import { Lightbox } from "./Lightbox";

const filters: Array<PhotoCategory | "vse"> = [
  "vse",
  "historie",
  "soucasnost",
  "labe",
  "promeny",
];

export function GalleryGrid({
  photos,
  limit,
  pageSize,
  showFilters = true,
}: {
  photos: Photo[];
  limit?: number;
  pageSize?: number;
  showFilters?: boolean;
}) {
  const [active, setActive] = useState<PhotoCategory | "vse">("vse");
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paged = Boolean(pageSize);

  const goToPage = (next: number) => {
    setPage(next);
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      window.scrollTo({ top: window.scrollY + top - 100, behavior: "smooth" });
    }
  };

  const filtered = useMemo(() => {
    return active === "vse" ? photos : photos.filter((p) => p.category === active);
  }, [photos, active]);

  const totalPages = pageSize ? Math.ceil(filtered.length / pageSize) : 1;

  useEffect(() => {
    setPage(0);
  }, [active]);

  const visible = useMemo(() => {
    if (limit) return filtered.slice(0, limit);
    if (pageSize) return filtered.slice(page * pageSize, (page + 1) * pageSize);
    return filtered;
  }, [filtered, limit, pageSize, page]);


  return (
    <div ref={gridRef}>
      {showFilters && (
        <div className="mb-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-border pb-4">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={cn(
                "pb-1 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors",
                active === f
                  ? "border-b-2 border-ink text-foreground"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {photoCategoryLabels[f]}
            </button>
          ))}
        </div>
      )}

      <ul
        className={cn(
          paged
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            : "columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5",
        )}
      >
        {visible.map((photo, i) => (
          <li key={photo.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full text-left"
            >
              <div className={cn("overflow-hidden", photo.archival ? "bg-paper-deep p-2.5" : "bg-muted")}>
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  className={cn(
                    "w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]",
                    paged ? "aspect-[4/3]" : "max-h-[26rem]",
                    photo.archival && "archival",
                  )}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-display text-lg leading-snug">{photo.title}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {photo.year}
                </span>
              </div>
              <span className="mt-1 block text-xs text-muted-foreground">{photo.source}</span>
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          V této kategorii zatím nejsou žádné fotografie.
        </p>
      )}

      {pageSize && totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Stránkování galerie">
          <button
            type="button"
            onClick={() => goToPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Předchozí
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-pressed={page === i}
              className={cn(
                "size-9 text-[0.75rem] font-medium transition-colors",
                page === i
                  ? "bg-ink text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Další
          </button>
        </nav>
      )}

      {openIndex !== null && (
        <Lightbox
          photos={visible}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
