import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-paper">
      <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
        )}
      </div>
    </header>
  );
}
