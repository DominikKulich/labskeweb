import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  FileText,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Upload,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  deleteRow,
  fetchAllArticles,
  fetchAllPhotos,
  fetchAllNews,
  fetchSubmissions,
  isCurrentUserAdmin,
  saveArticle,
  saveNews,
  savePhoto,
  setPublished,
  setSubmissionStatus,
  slugify,
  uploadImage,
  type ArticleRow,
  type PhotoRow,
  type NewsRow,
} from "@/lib/cms";
import { formatDate } from "@/components/site/StoryCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Správa obsahu | Labské nábřeží" },
      {
        name: "description",
        content: "Interní rozhraní pro správu fotografií, článků a příspěvků projektu Labské nábřeží.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Správa obsahu — Labské nábřeží" },
      { property: "og:description", content: "Interní rozhraní projektu Labské nábřeží." },
    ],
  }),
  component: AdminPage,
});

type Tab = "fotografie" | "clanky" | "aktuality" | "prispevky";

const tabs: Array<{ id: Tab; label: string; icon: typeof ImageIcon }> = [
  { id: "fotografie", label: "Fotografie", icon: ImageIcon },
  { id: "clanky", label: "Články", icon: FileText },
  { id: "aktuality", label: "Aktuality", icon: Megaphone },
  { id: "prispevky", label: "Příspěvky", icon: Inbox },
];

const fieldClass =
  "mt-2 w-full border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring";

const btnPrimary =
  "border border-ink px-6 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-background disabled:opacity-50";
const btnGhost =
  "border border-border px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-ink hover:text-foreground";

function ImageUploadField({
  label,
  value,
  onChange,
  folder = "uploads",
  className,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vyberte obrázek (JPEG, PNG, WebP, AVIF).");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Obrázek nahrán.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nahrání se nepodařilo.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <span className="eyebrow block">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(btnGhost, "inline-flex items-center gap-2")}
        >
          <Upload className="size-3.5" />
          {uploading ? "Nahrávám…" : "Nahrát obrázek"}
        </button>
        <span className="text-xs text-muted-foreground">nebo vložit URL</span>
      </div>
      <input
        className={fieldClass}
        placeholder="https://…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <img
          src={value}
          alt=""
          className="mt-3 h-24 w-40 border border-border bg-muted object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("fotografie");

  const { data: isAdmin, isLoading: checkingRole } = useQuery({
    queryKey: ["is-admin"],
    queryFn: isCurrentUserAdmin,
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="eyebrow">Interní rozhraní</p>
            <h1 className="mt-1 font-display text-2xl">Správa obsahu</h1>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/" className="link-editorial uppercase tracking-[0.14em]">
              Zpět na web
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 uppercase tracking-[0.14em] transition-colors hover:text-foreground"
            >
              <LogOut className="size-3.5" /> Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8">
        {checkingRole && <p className="text-sm text-muted-foreground">Ověřuji oprávnění…</p>}

        {!checkingRole && !isAdmin && (
          <p className="max-w-2xl border-l-2 border-river bg-background px-5 py-4 text-sm leading-relaxed">
            Váš účet nemá roli administrátora, proto je obsah skrytý. Roli lze přidělit v tabulce{" "}
            <code className="text-foreground">user_roles</code> (hodnota <code>admin</code>).
          </p>
        )}

        {!checkingRole && isAdmin && (
          <>
            <nav aria-label="Sekce administrace" className="flex gap-8 border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={cn(
                    "-mb-px inline-flex items-center gap-2 border-b-2 pb-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors",
                    tab === t.id
                      ? "border-ink text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="mt-10">
              {tab === "fotografie" && <PhotosPanel />}
              {tab === "clanky" && <ArticlesPanel />}
              {tab === "aktuality" && <NewsPanel />}
              {tab === "prispevky" && <SubmissionsPanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- fotografie ---------------- */

const emptyPhoto: Partial<PhotoRow> = {
  title: "",
  year: "",
  description: "",
  source: "",
  author: "",
  category: "historie",
  image_url: "",
  published: false,
  sort_order: 0,
};

function PhotosPanel() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Partial<PhotoRow> | null>(null);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "photos"], queryFn: fetchAllPhotos });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "photos"] });
    qc.invalidateQueries({ queryKey: ["photos"] });
  };

  const save = useMutation({
    mutationFn: (values: Partial<PhotoRow>) =>
      savePhoto({ ...values, title: values.title ?? "", image_url: values.image_url ?? "" }),
    onSuccess: () => {
      toast.success("Fotografie uložena.");
      setDraft(null);
      invalidate();
    },
    onError: () => toast.error("Uložení se nepodařilo."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow("photos", id),
    onSuccess: () => {
      toast.success("Fotografie smazána.");
      invalidate();
    },
    onError: () => toast.error("Mazání se nepodařilo."),
  });

  const publish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      setPublished("photos", id, published),
    onSuccess: invalidate,
    onError: () => toast.error("Změna publikace se nepodařila."),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl">Fotografie ({data.length})</h2>
        <button type="button" className={btnPrimary} onClick={() => setDraft({ ...emptyPhoto })}>
          <span className="inline-flex items-center gap-2">
            <Plus className="size-3.5" /> Přidat fotografii
          </span>
        </button>
      </div>

      {draft && (
        <form
          className="mt-8 grid gap-5 bg-background p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
        >
          <Field label="Název *">
            <input
              required
              className={fieldClass}
              value={draft.title ?? ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </Field>
          <Field label="Rok">
            <input
              className={fieldClass}
              placeholder="např. 1973"
              value={draft.year ?? ""}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Obrázek *"
            value={draft.image_url ?? ""}
            onChange={(url) => setDraft({ ...draft, image_url: url })}
            folder="photos"
            className="sm:col-span-2"
          />
          <Field label="Kategorie">
            <select
              className={fieldClass}
              value={draft.category ?? "historie"}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              <option value="historie">Historie</option>
              <option value="soucasnost">Současnost</option>
              <option value="labe">Labe</option>
              <option value="promeny">Proměny</option>
            </select>
          </Field>
          <Field label="Zdroj">
            <input
              className={fieldClass}
              value={draft.source ?? ""}
              onChange={(e) => setDraft({ ...draft, source: e.target.value })}
            />
          </Field>
          <Field label="Autor">
            <input
              className={fieldClass}
              value={draft.author ?? ""}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            />
          </Field>
          <Field label="Popis" className="sm:col-span-2">
            <textarea
              rows={3}
              className={`${fieldClass} resize-y`}
              value={draft.description ?? ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
          <Field label="Pořadí">
            <input
              type="number"
              className={fieldClass}
              value={draft.sort_order ?? 0}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </Field>
          <label className="flex items-end gap-3 pb-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.published)}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Publikovat na webu
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={save.isPending} className={btnPrimary}>
              {save.isPending ? "Ukládám…" : "Uložit"}
            </button>
            <button type="button" className={btnGhost} onClick={() => setDraft(null)}>
              Zrušit
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Načítám…</p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {data.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 py-4">
              <img
                src={p.image_url}
                alt=""
                className="h-16 w-24 shrink-0 bg-muted object-cover"
                loading="lazy"
              />
              <div className="min-w-[12rem] flex-1">
                <p className="font-display text-lg leading-snug">
                  {p.title}{" "}
                  {p.is_demo && (
                    <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                      demo
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[p.year, p.category, p.source].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => publish.mutate({ id: p.id, published: !p.published })}
                className={cn(
                  "border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
                  p.published
                    ? "border-river text-river hover:bg-river hover:text-background"
                    : "border-border text-muted-foreground hover:border-ink hover:text-foreground",
                )}
              >
                {p.published ? "Zveřejněno" : "Koncept"}
              </button>
              <button type="button" className={btnGhost} onClick={() => setDraft(p)}>
                <span className="inline-flex items-center gap-2">
                  <Pencil className="size-3.5" /> Upravit
                </span>
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  if (confirm(`Smazat fotografii „${p.title}“?`)) remove.mutate(p.id);
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="size-3.5" /> Smazat
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- články ---------------- */

const emptyArticle: Partial<ArticleRow> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category: "Historie",
  published: false,
  reading_time: 4,
};

function ArticlesPanel() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Partial<ArticleRow> | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: fetchAllArticles,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
    qc.invalidateQueries({ queryKey: ["articles"] });
  };

  const save = useMutation({
    mutationFn: (values: Partial<ArticleRow>) =>
      saveArticle({
        ...values,
        title: values.title ?? "",
        slug: values.slug || slugify(values.title ?? ""),
      }),
    onSuccess: () => {
      toast.success("Článek uložen.");
      setDraft(null);
      invalidate();
    },
    onError: () => toast.error("Uložení se nepodařilo (zkontrolujte unikátní slug)."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow("articles", id),
    onSuccess: () => {
      toast.success("Článek smazán.");
      invalidate();
    },
    onError: () => toast.error("Mazání se nepodařilo."),
  });

  const publish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      setPublished("articles", id, published),
    onSuccess: invalidate,
    onError: () => toast.error("Změna publikace se nepodařila."),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl">Články ({data.length})</h2>
        <button type="button" className={btnPrimary} onClick={() => setDraft({ ...emptyArticle })}>
          <span className="inline-flex items-center gap-2">
            <Plus className="size-3.5" /> Přidat článek
          </span>
        </button>
      </div>

      {draft && (
        <form
          className="mt-8 grid gap-5 bg-background p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
        >
          <Field label="Titulek *">
            <input
              required
              className={fieldClass}
              value={draft.title ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  title: e.target.value,
                  slug: draft.id ? (draft.slug ?? "") : slugify(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slug (adresa)">
            <input
              className={fieldClass}
              value={draft.slug ?? ""}
              onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            />
          </Field>
          <Field label="Kategorie">
            <input
              className={fieldClass}
              value={draft.category ?? ""}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Titulní fotografie"
            value={draft.cover_image_url ?? ""}
            onChange={(url) => setDraft({ ...draft, cover_image_url: url })}
            folder="articles"
            className="sm:col-span-2"
          />
          <Field label="Perex" className="sm:col-span-2">
            <textarea
              rows={2}
              className={`${fieldClass} resize-y`}
              value={draft.excerpt ?? ""}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            />
          </Field>
          <Field
            label="Text článku (prázdný řádek = odstavec, ## nadpis, > citace)"
            className="sm:col-span-2"
          >
            <textarea
              rows={12}
              className={`${fieldClass} resize-y font-sans`}
              value={draft.content ?? ""}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
          </Field>
          <Field label="Čtení (min)">
            <input
              type="number"
              className={fieldClass}
              value={draft.reading_time ?? 4}
              onChange={(e) => setDraft({ ...draft, reading_time: Number(e.target.value) })}
            />
          </Field>
          <label className="flex items-end gap-3 pb-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.published)}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Publikovat na webu
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={save.isPending} className={btnPrimary}>
              {save.isPending ? "Ukládám…" : "Uložit"}
            </button>
            <button type="button" className={btnGhost} onClick={() => setDraft(null)}>
              Zrušit
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Načítám…</p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {data.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="min-w-[14rem] flex-1">
                <p className="font-display text-lg leading-snug">
                  {a.title}{" "}
                  {a.is_demo && (
                    <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                      demo
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  /pribehy/{a.slug}
                  {a.published_at ? ` · ${formatDate(a.published_at)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => publish.mutate({ id: a.id, published: !a.published })}
                className={cn(
                  "border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
                  a.published
                    ? "border-river text-river hover:bg-river hover:text-background"
                    : "border-border text-muted-foreground hover:border-ink hover:text-foreground",
                )}
              >
                {a.published ? "Zveřejněno" : "Koncept"}
              </button>
              <button type="button" className={btnGhost} onClick={() => setDraft(a)}>
                <span className="inline-flex items-center gap-2">
                  <Pencil className="size-3.5" /> Upravit
                </span>
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  if (confirm(`Smazat článek „${a.title}“?`)) remove.mutate(a.id);
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="size-3.5" /> Smazat
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- aktuality ---------------- */

const emptyNews: Partial<NewsRow> = {
  title: "",
  summary: "",
  category: "Dění",
  starts_at: new Date().toISOString(),
  image_url: "",
  published: false,
  sort_order: 0,
};

/** ISO -> hodnota pro <input type="datetime-local"> v lokálním čase. */
function toLocalInput(iso: string | undefined) {
  const d = iso ? new Date(iso) : new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

function NewsPanel() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Partial<NewsRow> | null>(null);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "news"], queryFn: fetchAllNews });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "news"] });
    qc.invalidateQueries({ queryKey: ["news"] });
  };

  const save = useMutation({
    mutationFn: (values: Partial<NewsRow>) => saveNews({ ...values, title: values.title ?? "" }),
    onSuccess: () => {
      toast.success("Aktualita uložena.");
      setDraft(null);
      invalidate();
    },
    onError: () => toast.error("Uložení se nepodařilo."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow("news", id),
    onSuccess: () => {
      toast.success("Aktualita smazána.");
      invalidate();
    },
    onError: () => toast.error("Mazání se nepodařilo."),
  });

  const publish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      setPublished("news", id, published),
    onSuccess: invalidate,
    onError: () => toast.error("Změna publikace se nepodařila."),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl">Aktuality ({data.length})</h2>
        <button type="button" className={btnPrimary} onClick={() => setDraft({ ...emptyNews })}>
          <span className="inline-flex items-center gap-2">
            <Plus className="size-3.5" /> Přidat aktualitu
          </span>
        </button>
      </div>

      {draft && (
        <form
          className="mt-8 grid gap-5 bg-background p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
        >
          <Field label="Titulek *">
            <input
              required
              className={fieldClass}
              value={draft.title ?? ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </Field>
          <Field label="Kategorie / štítek">
            <input
              className={fieldClass}
              placeholder="např. Sport, Komunita, Údržba, Omezení"
              value={draft.category ?? ""}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </Field>
          <Field label="Datum a čas">
            <input
              type="datetime-local"
              className={fieldClass}
              value={toLocalInput(draft.starts_at)}
              onChange={(e) =>
                setDraft({ ...draft, starts_at: new Date(e.target.value).toISOString() })
              }
            />
          </Field>
          <Field label="Pořadí">
            <input
              type="number"
              className={fieldClass}
              value={draft.sort_order ?? 0}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </Field>
          <Field label="Krátký popis" className="sm:col-span-2">
            <textarea
              rows={3}
              className={`${fieldClass} resize-y`}
              value={draft.summary ?? ""}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Fotografie (volitelné)"
            value={draft.image_url ?? ""}
            onChange={(url) => setDraft({ ...draft, image_url: url })}
            folder="news"
            className="sm:col-span-2"
          />
          <label className="flex items-end gap-3 pb-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.published)}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Publikovat na webu
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={save.isPending} className={btnPrimary}>
              {save.isPending ? "Ukládám…" : "Uložit"}
            </button>
            <button type="button" className={btnGhost} onClick={() => setDraft(null)}>
              Zrušit
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Načítám…</p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {data.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center gap-4 py-4">
              {n.image_url && (
                <img
                  src={n.image_url}
                  alt=""
                  className="h-16 w-24 shrink-0 bg-muted object-cover"
                  loading="lazy"
                />
              )}
              <div className="min-w-[14rem] flex-1">
                <p className="font-display text-lg leading-snug">
                  {n.title}{" "}
                  {n.is_demo && (
                    <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                      demo
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[formatDate(n.starts_at), n.category].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => publish.mutate({ id: n.id, published: !n.published })}
                className={cn(
                  "border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
                  n.published
                    ? "border-river text-river hover:bg-river hover:text-background"
                    : "border-border text-muted-foreground hover:border-ink hover:text-foreground",
                )}
              >
                {n.published ? "Zveřejněno" : "Koncept"}
              </button>
              <button type="button" className={btnGhost} onClick={() => setDraft(n)}>
                <span className="inline-flex items-center gap-2">
                  <Pencil className="size-3.5" /> Upravit
                </span>
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  if (confirm(`Smazat aktualitu „${n.title}“?`)) remove.mutate(n.id);
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="size-3.5" /> Smazat
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- příspěvky ---------------- */

function SubmissionsPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: fetchSubmissions,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "submissions"] });

  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => setSubmissionStatus(id, value),
    onSuccess: invalidate,
    onError: () => toast.error("Změna stavu se nepodařila."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow("submissions", id),
    onSuccess: () => {
      toast.success("Příspěvek smazán.");
      invalidate();
    },
    onError: () => toast.error("Mazání se nepodařilo."),
  });

  return (
    <div>
      <h2 className="font-display text-xl">Příspěvky veřejnosti ({data.length})</h2>
      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Načítám…</p>
      ) : data.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Zatím nedorazil žádný příspěvek.</p>
      ) : (
        <ul className="mt-8 space-y-5">
          {data.map((s) => (
            <li key={s.id} className="bg-background p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-display text-lg">
                  {s.name} <span className="text-sm text-muted-foreground">· {s.email}</span>
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(s.created_at)} · {s.status}
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {[s.approximate_year, s.place].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{s.story}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => status.mutate({ id: s.id, value: "reviewed" })}
                >
                  Označit jako zpracované
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => status.mutate({ id: s.id, value: "archived" })}
                >
                  Archivovat
                </button>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    if (confirm("Smazat příspěvek?")) remove.mutate(s.id);
                  }}
                >
                  Smazat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="eyebrow block">{label}</span>
      {children}
    </div>
  );
}
