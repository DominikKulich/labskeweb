import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag
        className={cn(
          "mt-4 text-balance",
          as === "h1"
            ? "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
            : "text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
        )}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            "mt-5 text-[1.02rem] leading-relaxed text-muted-foreground",
            align === "left" && "max-w-xl",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
