import type { ContributionInput } from "./types";
import { insertSubmission } from "@/lib/cms";

/** Odeslání příspěvku veřejnosti do tabulky `submissions`. */
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
    await insertSubmission({
      name,
      email,
      approximate_year: input.year?.trim() || null,
      place: input.place?.trim() || null,
      story,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Odeslání se nepodařilo. Zkuste to prosím znovu." };
  }
}
