import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { chapters, highlights, keyMilestones } from "@/data/historie";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/historie")({
  head: () => ({
    ...pageSeo({
      path: "/historie",
      title: "Historie nábřeží, Ostrova a Labe ve Štětí | Labské nábřeží",
      description:
        "Podrobná historie štětského nábřeží a Ostrova: přívoz od roku 1537, létací most, lodní mlýny a řetězová paroplavba, plovárny, jez a kluziště, most z roku 1973 i velké povodně.",
      ogTitle: "Historie štětského nábřeží, Ostrova a života kolem Labe",
      ogDescription:
        "Časová osa i dvanáct kapitol: přívoz a loď „Marie“, lodní mlýny, zasypané rameno u Ostrova, plovárny, jez a kluziště, most z roku 1973 a povodně od roku 1784 do roku 2002.",
    }),
    scripts: [
      webPageJsonLd(
        "/historie",
        "Historie štětského nábřeží, Ostrova a života kolem Labe",
        "Kapitoly o přívozu, lodních mlýnech, řetězové paroplavbě, Ostrově, plovárnách, jezu, mostu z roku 1973 a povodních ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Historie", path: "/historie" }]),
    ],
  }),
  component: HistoriePage,
});

function HistoriePage() {
  return (
    <>
      <PageHeader
        eyebrow="Historie místa"
        title="Nábřeží, Ostrov a život kolem Labe"
        lead="Řeka dávala Štětí vodu, ryby, dopravu i obživu — a zároveň si pravidelně brala zpět. Dvanáct kapitol o břehu, který se za dvě století přepsal několikrát: od brodu a přívozu přes lodní mlýny a plovárny až k mostu, jezu a velké vodě."
      />

      {/* RYCHLÁ ČASOVÁ OSA */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-16">
          <p className="eyebrow">Rychlá časová osa</p>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground">
            Dvanáct letopočtů, které nejvíc změnily podobu štětského břehu.
          </p>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {keyMilestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 40}>
                <li className="list-none border-t border-border-strong pt-4">
                  <p className="font-display text-3xl tabular-nums text-river-deep">{m.year}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* KAPITOLY */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          {chapters.map((ch, i) => {
            const mediaFirst = i % 2 === 1;
            return (
              <Reveal as="article" key={ch.id} delay={40}>
                <div id={ch.id} className="scroll-mt-28 border-t border-border py-14 sm:py-16">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
                    <div className={cn(mediaFirst && "lg:order-2")}>
                      <p className="eyebrow">{ch.eyebrow}</p>
                      <h2 className="mt-3 text-2xl leading-snug sm:text-3xl lg:text-[2.1rem]">
                        {ch.title}
                      </h2>
                      <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-foreground/85">
                        {ch.lead}
                      </p>
                      <div className="mt-5 max-w-2xl space-y-4 text-[1rem] leading-relaxed text-muted-foreground">
                        {ch.paragraphs.map((p, k) => (
                          <p key={k}>{p}</p>
                        ))}
                      </div>

                      {ch.sections?.map((s) => (
                        <div key={s.heading} className="mt-8 max-w-2xl">
                          <h3 className="text-[0.78rem] font-medium uppercase tracking-[0.16em] text-foreground">
                            {s.heading}
                          </h3>
                          <div className="mt-3 space-y-4 text-[1rem] leading-relaxed text-muted-foreground">
                            {s.paragraphs.map((p, k) => (
                              <p key={k}>{p}</p>
                            ))}
                          </div>
                        </div>
                      ))}

                      {ch.facts && (
                        <dl className="mt-9 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
                          {ch.facts.map((f) => (
                            <div key={f.year + f.text}>
                              <dt className="font-display text-xl tabular-nums text-river-deep">
                                {f.year}
                              </dt>
                              <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {f.text}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    <div className={cn("space-y-6 lg:pt-9", mediaFirst && "lg:order-1")}>
                      {ch.imageSrc && (
                        <figure className="m-0 bg-paper-deep p-2.5">
                          <img
                            src={ch.imageSrc}
                            alt={ch.imageAlt ?? ch.title}
                            loading={i < 2 ? "eager" : "lazy"}
                            className={cn(
                              "aspect-[4/3] w-full object-cover",
                              ch.archival && "archival",
                            )}
                          />
                          {ch.imageCaption && (
                            <figcaption className="px-1 pt-3 text-xs leading-relaxed text-muted-foreground">
                              {ch.imageCaption}
                            </figcaption>
                          )}
                        </figure>
                      )}
                      {ch.didYouKnow && !ch.didYouKnowLarge && (
                        <aside className="border-l-2 border-river bg-paper p-6">
                          <p className="eyebrow">Věděli jste, že…</p>
                          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/85">
                            {ch.didYouKnow}
                          </p>
                        </aside>
                      )}
                    </div>
                  </div>

                  {ch.didYouKnow && ch.didYouKnowLarge && (
                    <aside className="mt-10 border-l-2 border-river bg-paper px-6 py-8 sm:px-10 sm:py-10">
                      <p className="eyebrow">Věděli jste, že…</p>
                      <p className="mt-4 max-w-3xl text-[1.15rem] leading-relaxed text-foreground/90 sm:text-[1.3rem]">
                        {ch.didYouKnow}
                      </p>
                    </aside>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ZAJÍMAVOSTI V KOSTCE */}
      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="eyebrow">Nejsilnější zajímavosti v kostce</p>
          <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <Reveal key={h} delay={i * 40}>
                <li className="flex gap-4 border-t border-border-strong pt-4">
                  <span className="font-display text-sm tabular-nums text-river-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-muted-foreground">{h}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Pokračování</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl">
              Jednotlivá témata rozvíjíme v delších textech
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
              Loď „Marie“, chůze korytem Labe v roce 1842, zasypané rameno u Ostrova nebo
              bombardování ledové bariéry v roce 1953 — každé z těchto témat má vlastní příběh.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link
                to="/pribehy"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
              >
                <span className="link-editorial">Přečíst příběhy</span>
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/prispet"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
              >
                <span className="link-editorial">Máte fotografii?</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
