import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { SocialLinks } from "@/components/site/SocialLinks";
import { activeSocialLinks } from "@/data/social";

import { submitContribution } from "@/data/contributions";
import type { ContributionInput } from "@/data/types";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/prispet")({
  head: () => ({
    ...pageSeo({
      path: "/prispet",
      title: "Napište nám | Labské nábřeží Štětí",
      description:
        "Máte dotaz, nápad nebo připomínku k Labskému nábřeží ve Štětí? Napište nám. Budeme rádi i za historické fotografie, dokumenty nebo vzpomínky.",
      ogTitle: "Napište nám — Labské nábřeží",
      ogDescription:
        "Ozvěte se nám s dotazem, nápadem, připomínkou nebo podnětem k Labskému nábřeží ve Štětí.",
    }),
    scripts: [
      webPageJsonLd(
        "/prispet",
        "Napište nám",
        "Kontaktní formulář projektu Labské nábřeží ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Napište nám", path: "/prispet" }]),
    ],
  }),
  component: PrispetPage,
});

const fieldClass =
  "mt-2 w-full border border-input bg-background px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring";

function PrispetPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);

    const input: ContributionInput = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      year: "",
      place: "",
      message: String(fd.get("message") ?? ""),
    };

    setPending(true);

    const res = await submitContribution(input);

    setPending(false);

    if (res.ok) {
      setDone(true);
      form.reset();
      toast.success("Děkujeme, zpráva byla odeslána.");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Napište nám"
        title="Máte dotaz, nápad nebo připomínku?"
        lead="Napište nám cokoliv, co se týká Labského nábřeží ve Štětí. Může jít o dotaz, nápad, připomínku, nabídku spolupráce nebo třeba historickou fotografii či vzpomínku."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            {done && (
              <p
                role="status"
                className="mb-8 border-l-2 border-river bg-paper px-5 py-4 text-sm leading-relaxed"
              >
                Děkujeme. Zprávu jsme přijali a ozveme se na uvedený e-mail.
              </p>
            )}

            <form onSubmit={onSubmit} noValidate={false} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow block">
                    Jméno *
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="eyebrow block">
                    E-mail *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="eyebrow block">
                  Zpráva *
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={8}
                  placeholder="Napište nám svůj dotaz, nápad, připomínku nebo cokoliv dalšího…"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="border border-ink px-8 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-background disabled:opacity-50"
              >
                {pending ? "Odesílám…" : "Odeslat zprávu"}
              </button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Odesláním souhlasíte s tím, že vás můžeme kontaktovat v souvislosti
                s vaší zprávou.
              </p>
            </form>
          </div>

          <aside className="bg-paper p-8 sm:p-10">
            <h2 className="text-2xl leading-snug">Ozvěte se nám</h2>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Budeme rádi za vaše dotazy, podněty, připomínky i nápady k Labskému
              nábřeží.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pokud máte historické fotografie, dokumenty nebo vzpomínky spojené
              s nábřežím a životem u Labe, můžete nám napsat i o nich.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Ozvat se můžete také v případě, že máte zájem o spolupráci nebo se
              chcete do projektu nějak zapojit.
            </p>

            {activeSocialLinks.length > 0 && (
              <div className="mt-8 border-t border-border-strong pt-6">
                <p className="eyebrow">Sledujte nás</p>
                <SocialLinks className="mt-4" />
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}