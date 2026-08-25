import { Link } from "@tanstack/react-router";
import type { Story } from "@/data/types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group flex h-full flex-col">
      {story.coverSrc && (
        <Link
          to="/pribehy/$slug"
          params={{ slug: story.slug }}
          className="block overflow-hidden bg-muted"
          tabIndex={-1}
          aria-hidden
        >
          <img
            src={story.coverSrc}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>
      )}


      <div className="mt-5 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
        <span>{story.category}</span>
        {story.date && (
          <>
            <span aria-hidden className="h-px w-6 bg-border-strong" />
            <time dateTime={story.date}>{formatDate(story.date)}</time>
          </>
        )}
      </div>

      <h3 className="mt-3 text-2xl leading-snug">
        <Link to="/pribehy/$slug" params={{ slug: story.slug }} className="link-editorial">
          {story.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{story.perex}</p>

      <Link
        to="/pribehy/$slug"
        params={{ slug: story.slug }}
        className="mt-5 inline-flex w-fit items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-foreground"
      >
        <span className="link-editorial">Číst příběh</span>
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
