import { Facebook, Instagram } from "lucide-react";
import { activeSocialLinks } from "@/data/social";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof Facebook> = {
  Facebook,
  Instagram,
};

export function SocialLinks({ className }: { className?: string }) {
  if (activeSocialLinks.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {activeSocialLinks.map((link) => {
        const Icon = icons[link.label];
        return (
          <li key={link.label}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex size-9 items-center justify-center border border-current/25 opacity-75 transition-opacity hover:opacity-100"
            >
              {Icon ? <Icon aria-hidden className="size-4" /> : link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
