import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { submitContribution } from "@/data/contributions";
import type { ContributionInput } from "@/data/types";
import { breadcrumbJsonLd, pageSeo, webPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/prispet")({
  head: () => ({
    ...pageSeo({
      path: "/prispet",
      title: "Máte fotografii? | Labské nábřeží Štětí",
      description:
        "Pošlete historickou fotografii nábřeží ve Štětí nebo vzpomínku na život u Labe. Originály vracíme, autora vždy uvádíme.",
      ogTitle: "Máte fotografii? — Labské nábřeží",
      ogDescription: "Sdílejte fotografii nebo vzpomínku na nábřeží a řeku Labe ve Štětí.",
    }),
    scripts: [
      webPageJsonLd(
        "/prispet",
        "Máte fotografii?",
        "Formulář pro zaslání historické fotografie nebo vzpomínky z nábřeží ve Štětí.",
      ),
      breadcrumbJsonLd([{ name: "Máte fotografii?", path: "/prispet" }]),
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
      year: String(fd.get("year") ?? ""),
      place: String(fd.get("place") ?? ""),
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
        eyebrow="Máte fotografii?"
        title="Pošlete fotografii nebo vzpomínku"
        lead="Nemusíte nic skenovat. Stačí napsat, co máte — ozveme se a domluvíme se na dalším postupu."
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            {done && (
              <p
                role="status"
                className="mb-8 border-l-2 border-river bg-paper px-5 py-4 text-sm leading-relaxed"
              >
                Děkujeme. Zprávu jsme přijali a ozveme se na uvedený e-mail. V této ukázkové verzi
                se odesílání zatím jen zaznamenává — po zapnutí backendu poputuje rovnou do archivu.
              </p>
            )}

            <form onSubmit={onSubmit} noValidate={false} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="eyebrow block">
                    Jméno *
                  </label>
                  <input id="name" name="name" required autoComplete="name" className={fieldClass} />
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

              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="year" className="eyebrow block">
                    Rok pořízení (odhad)
                  </label>
                  <input
                    id="year"
                    name="year"
                    placeholder="např. kolem 1965"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="place" className="eyebrow block">
                    Místo
                  </label>
                  <input
                    id="place"
                    name="place"
                    placeholder="např. rampa přívozu"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="eyebrow block">
                  Co máte nebo si pamatujete *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder="Popište fotografii, vzpomínku nebo dokument…"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="border border-ink px-8 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-background disabled:opacity-50"
              >
                {pending ? "Odesílám…" : "Odeslat příspěvek"}
              </button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Odesláním souhlasíte s tím, že vás můžeme kontaktovat kvůli upřesnění údajů.
                Fotografie zveřejňujeme až po vaší výslovné dohodě.
              </p>
            </form>
          </div>

          <aside className="bg-paper p-8 sm:p-10">
            <h2 className="text-2xl leading-snug">Co se hodí nejvíc</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li className="rule-top pt-4">Snímky přívozu, plovárny a starého překladiště</li>
              <li className="rule-top pt-4">Fotografie ze stavby mostu, i neostré a amatérské</li>
              <li className="rule-top pt-4">Povodňové snímky s viditelnou hladinou</li>
              <li className="rule-top pt-4">Rodinné fotografie, kde je nábřeží jen v pozadí</li>
              <li className="rule-top pt-4">Vzpomínky bez fotografií — pomáhají s datací</li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
