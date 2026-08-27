import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Domů" },
  { to: "/aktualne", label: "Aktuálně" },
  { to: "/historie", label: "Historie" },
  { to: "/galerie", label: "Galerie" },
  { to: "/pribehy", label: "Příběhy" },
  { to: "/o-projektu", label: "O projektu" },
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overlay && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        transparent
          ? "bg-transparent text-primary-foreground"
          : "border-b border-border bg-background/92 text-foreground backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group block leading-none" aria-label="Labské nábřeží — Štětí">
          <span className="block font-display text-[1.05rem] leading-none tracking-tight sm:text-[1.2rem]">
            <span className="font-medium">Labské</span>{" "}
            <span className="font-light">nábřeží</span>
          </span>
          <span className="mt-1.5 block text-[0.5rem] font-medium uppercase leading-none tracking-[0.42em] opacity-55 sm:text-[0.55rem]">
            Štětí
          </span>
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-editorial text-[0.8rem] font-medium uppercase tracking-[0.14em]"
              activeProps={{ className: "opacity-100" }}
              inactiveProps={{ className: "opacity-75 hover:opacity-100" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/prispet"
            className={cn(
              "border px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors",
              transparent
                ? "border-primary-foreground/60 hover:bg-primary-foreground hover:text-ink"
                : "border-foreground/40 hover:bg-foreground hover:text-background",
            )}
          >
            Napište nám
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background text-foreground md:hidden"
        >
          <nav aria-label="Mobilní navigace" className="flex flex-col px-5 py-4 sm:px-8">
            {[...nav, { to: "/prispet", label: "Napište nám" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-border py-4 font-display text-2xl last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
