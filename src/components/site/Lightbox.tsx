import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/data/types";
import { photoCategoryLabels } from "@/data/types";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title}, ${photo.year}`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/97"
    >
      <div className="flex items-center justify-between px-5 py-4 text-background/80 sm:px-8">
        <span className="text-xs uppercase tracking-[0.2em]">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] hover:text-background"
        >
          Zavřít <X className="size-4" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        <button
          type="button"
          aria-label="Předchozí fotografie"
          onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
          className="absolute left-1 z-10 p-3 text-background/70 hover:text-background sm:left-4"
        >
          <ChevronLeft className="size-7" />
        </button>
        <img
          src={photo.src}
          alt={photo.title}
          className={photo.archival ? "archival max-h-full max-w-full object-contain" : "max-h-full max-w-full object-contain"}
        />
        <button
          type="button"
          aria-label="Další fotografie"
          onClick={() => onNavigate((index + 1) % photos.length)}
          className="absolute right-1 z-10 p-3 text-background/70 hover:text-background sm:right-4"
        >
          <ChevronRight className="size-7" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-3xl px-5 py-6 text-background sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-display text-2xl">{photo.title}</h2>
          <span className="text-sm text-background/60">{photo.year}</span>
          <span className="text-[0.68rem] uppercase tracking-[0.18em] text-background/50">
            {photoCategoryLabels[photo.category]}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-background/75">{photo.description}</p>
        <p className="mt-2 text-xs text-background/50">{photo.source}</p>
      </div>
    </div>
  );
}
