import type { NewsRow } from "@/lib/cms";
import { cn } from "@/lib/utils";

export function formatNewsDate(iso: string) {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsItem({ item, compact = false }: { item: NewsRow; compact?: boolean }) {
  const imageUrl = item.image_url;
  const hasImage = !!imageUrl;

  return (
    <article
      className={cn(
        "grid gap-5 border-t border-border pt-6",
        !compact && hasImage && "sm:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] sm:gap-10",
        compact && hasImage && "sm:grid-cols-[minmax(0,1fr)_minmax(0,140px)] sm:items-start sm:gap-6",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
          <time dateTime={item.starts_at}>{formatNewsDate(item.starts_at)}</time>
          <span aria-hidden className="h-px w-5 bg-border-strong" />
          <span className="text-river-deep">{item.category}</span>
        </div>

        <h3
          className={cn(
            "mt-3 leading-snug",
            compact ? "text-xl" : "text-2xl sm:text-[1.75rem]",
          )}
        >
          {item.title}
        </h3>

        {item.summary && (
          <p
            className={cn(
              "mt-3 leading-relaxed text-muted-foreground",
              compact ? "text-sm" : "text-[0.98rem]",
            )}
          >
            {item.summary}
          </p>
        )}
      </div>

      {hasImage && (
        <img
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      )}
    </article>
  );
}
