import type { ContributionInput } from "./types";

/** Odeslání příspěvku přes Formspree. */

export async function submitContribution(
  input: ContributionInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = input.name.trim();
  const email = input.email.trim();
  const story = input.message.trim();

  if (!name || !email || !story) {
    return { ok: false, error: "Vyplňte prosím jméno, e-mail a zprávu." };
  }

  if (name.length > 120 || email.length > 255 || story.length > 4000) {
    return { ok: false, error: "Některé pole je příliš dlouhé." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Zadejte prosím platný e-mail." };
  }

  try {
    const response = await fetch("https://formspree.io/f/mwlkkpan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        year: input.year?.trim() || "",
        place: input.place?.trim() || "",
        message: story,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: "Odeslání se nepodařilo. Zkuste to prosím znovu.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Odeslání se nepodařilo. Zkuste to prosím znovu.",
    };
  }
}