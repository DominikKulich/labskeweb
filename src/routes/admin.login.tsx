import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Přihlášení do správy | Labské nábřeží" },
      { name: "description", content: "Přihlášení do interní správy obsahu projektu Labské nábřeží." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Přihlášení do správy — Labské nábřeží" },
      { property: "og:description", content: "Interní přihlášení projektu Labské nábřeží." },
    ],
  }),
  component: AdminLogin,
});

const fieldClass =
  "mt-2 w-full border border-input bg-background px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      toast.error("Přihlášení se nezdařilo. Zkontrolujte e-mail a heslo.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-20">
      <div className="w-full max-w-md bg-background p-8 sm:p-10">
        <p className="eyebrow">Interní rozhraní</p>
        <h1 className="mt-2 font-display text-3xl leading-snug">Přihlášení do správy</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Přístup mají pouze účty s rolí administrátora.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="eyebrow block">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow block">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full border border-ink px-8 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-background disabled:opacity-50"
          >
            {pending ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-8 inline-block link-editorial text-[0.72rem] uppercase tracking-[0.16em]"
        >
          Zpět na web
        </Link>
      </div>
    </div>
  );
}
