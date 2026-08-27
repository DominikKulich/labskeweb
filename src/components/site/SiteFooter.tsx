import { Link } from "@tanstack/react-router";
import { SocialLinks } from "@/components/site/SocialLinks";



export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">
              Labské <span className="font-light opacity-75">nábřeží</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-70">
              Nezávislá vizuální kronika Labského nábřeží ve Štětí. Sbíráme fotografie,
              dokumenty a vzpomínky lidí, kteří u řeky žili.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] opacity-55">
              labskenabrezi.cz
            </p>
            <SocialLinks className="mt-5" />
          </div>


          <nav aria-label="Patička — sekce">
            <p className="eyebrow text-navy-foreground/60">Sekce</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/aktualne", label: "Aktuálně" },
                { to: "/historie", label: "Historie" },
                { to: "/galerie", label: "Galerie" },
                { to: "/pribehy", label: "Příběhy" },
                { to: "/o-projektu", label: "O projektu" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-editorial opacity-80 hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Patička — projekt">
            <p className="eyebrow text-navy-foreground/60">Projekt</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/prispet" className="link-editorial opacity-80 hover:opacity-100">
                  Máte fotografii?
                </Link>
              </li>
              <li>
                <Link to="/admin" className="link-editorial opacity-80 hover:opacity-100">
                  Správa obsahu
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-navy-foreground/15 pt-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:gap-0">
            <p>© {new Date().getFullYear()} Labské nábřeží</p>
            <p className="max-w-md leading-relaxed">
              Poděkování za fotografie a informace: Zdeněk Fořt, Miloš Bílek, Retro Štětí, Štětí,
              Vodní mlýny, Martin Krch
            </p>
          </div>
          <p>
            Vytvořil{" "}
            <a
              href="https://www.dominikkulich.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-opacity hover:opacity-100"
            >
              Dominik Kulich
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
