import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Upload,
  Megaphone,
  Tags,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  deleteRow,
  fetchAllArticles,
  fetchAllPhotos,
  fetchAllNews,
  fetchAllCategories,
  fetchActiveCategories,
  isCurrentUserAdmin,
  saveArticle,
  saveNews,
  savePhoto,
  saveCategory,
  setCategoryActive,
  moveCategory,
  deleteCategory,
  setPublished,
  slugify,
  uploadImage,
  type ArticleRow,
  type PhotoRow,
  type NewsRow,
  type CategoryRow,
  type CategoryKind,
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
        content: "Interní rozhraní pro správu fotografií, příběhů, aktualit a kategorií projektu Labské nábřeží.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Správa obsahu — Labské nábřeží" },
      { property: "og:description", content: "Interní rozhraní projektu Labské nábřeží." },
    ],
  }),
  component: AdminPage,
});

type Tab = "fotografie" | "clanky" | "aktuality" | "kategorie";

const tabs: Array<{ id: Tab; label: string; icon: typeof ImageIcon }> = [
  { id: "fotografie", label: "Fotografie", icon: ImageIcon },
  { id: "clanky", label: "Příběhy", icon: FileText },
  { id: "aktuality", label: "Aktuality", icon: Megaphone },
  { id: "kategorie", label: "Kategorie", icon: Tags },
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
              {tab === "kategorie" && <CategoriesPanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- kategorie ---------------- */

const categoryKindLabels: Record<CategoryKind, string> = {
  photo: "Fotografie",
  news: "Aktuality",
  article: "Příběhy",
};

const categoryKinds: CategoryKind[] = ["photo", "news", "article"];

/** Dropdown aktivních kategorií daného typu. */
function CategorySelect({
  kind,
  value,
  onChange,
}: {
  kind: CategoryKind;
  value: string;
  onChange: (value: string) => void;
}) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["categories", kind],
    queryFn: () => fetchActiveCategories(kind),
  });

  const known = data.some((c) => c.value === value);

  return (
    <select
      className={fieldClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
    >
      <option value="">— bez kategorie —</option>
      {data.map((c) => (
        <option key={c.id} value={c.value}>
          {c.label}
        </option>
      ))}
      {value && !known && <option value={value}>{value} (neaktivní)</option>}
    </select>
  );
}

const emptyCategory = (kind: CategoryKind): Partial<CategoryRow> => ({
  kind,
  label: "",
  value: "",
  sort_order: 0,
  active: true,
});

function CategoriesPanel() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<(Partial<CategoryRow> & { kind: CategoryKind }) | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchAllCategories,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const save = useMutation({
    mutationFn: (values: Partial<CategoryRow> & { kind: CategoryKind }) =>
      saveCategory({ ...values, label: values.label ?? "" }),
    onSuccess: () => {
      toast.success("Kategorie uložena.");
      setDraft(null);
      invalidate();
    },
    onError: () => toast.error("Uložení se nepodařilo (hodnota musí být v rámci typu unikátní)."),
  });

  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => setCategoryActive(id, active),
    onSuccess: invalidate,
    onError: () => toast.error("Změna se nepodařila."),
  });

  const move = useMutation({
    mutationFn: ({ list, id, direction }: { list: CategoryRow[]; id: string; direction: -1 | 1 }) =>
      moveCategory(list, id, direction),
    onSuccess: invalidate,
    onError: () => toast.error("Změna pořadí se nepodařila."),
  });

  const remove = useMutation({
    mutationFn: (category: CategoryRow) => deleteCategory(category),
    onSuccess: () => {
      toast.success("Kategorie smazána.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Mazání se nepodařilo."),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl">Kategorie ({data.length})</h2>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Kategorie jsou oddělené podle typu obsahu. Smazat lze jen kategorii, kterou žádný záznam
        nepoužívá — jinak ji raději deaktivujte.
      </p>

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
              value={draft.label ?? ""}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </Field>
          <Field label="Technická hodnota (ukládá se k záznamům)">
            <input
              className={fieldClass}
              placeholder={draft.kind === "photo" ? "např. historie" : "např. Dění"}
              value={draft.value ?? ""}
              onChange={(e) => setDraft({ ...draft, value: e.target.value })}
              disabled={Boolean(draft.id)}
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
          <label className="flex items-center gap-3 self-end text-sm">
            <input
              type="checkbox"
              checked={draft.active ?? true}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            />
            Aktivní
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className={btnPrimary} disabled={save.isPending}>
              Uložit
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
        <div className="mt-10 space-y-12">
          {categoryKinds.map((kind) => {
            const list = data.filter((c) => c.kind === kind);
            return (
              <section key={kind}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="font-display text-lg">{categoryKindLabels[kind]}</h3>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => setDraft({ ...emptyCategory(kind), kind })}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Plus className="size-3.5" /> Přidat kategorii
                    </span>
                  </button>
                </div>

                {list.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">Zatím žádné kategorie.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border border-t border-border">
                    {list.map((c, index) => (
                      <li key={c.id} className="flex flex-wrap items-center gap-4 py-4">
                        <div className="min-w-[12rem] flex-1">
                          <p className={cn("text-sm", !c.active && "text-muted-foreground")}>
                            {c.label}
                            {!c.active && " · neaktivní"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{c.value}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className={btnGhost}
                            disabled={index === 0 || move.isPending}
                            onClick={() => move.mutate({ list, id: c.id, direction: -1 })}
                            aria-label="Posunout nahoru"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            disabled={index === list.length - 1 || move.isPending}
                            onClick={() => move.mutate({ list, id: c.id, direction: 1 })}
                            aria-label="Posunout dolů"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() => toggle.mutate({ id: c.id, active: !c.active })}
                          >
                            {c.active ? "Deaktivovat" : "Aktivovat"}
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() => setDraft({ ...c })}
                          >
                            <span className="inline-flex items-center gap-2">
                              <Pencil className="size-3.5" /> Upravit
                            </span>
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() => remove.mutate(c)}
                          >
                            <span className="inline-flex items-center gap-2">
                              <Trash2 className="size-3.5" /> Smazat
                            </span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
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
            <CategorySelect
              kind="photo"
              value={draft.category ?? ""}
              onChange={(value) => setDraft({ ...draft, category: value })}
            />
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

/* ---------------- příběhy ---------------- */

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
        <h2 className="font-display text-xl">Příběhy ({data.length})</h2>
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
            <CategorySelect
              kind="article"
              value={draft.category ?? ""}
              onChange={(value) => setDraft({ ...draft, category: value })}
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
            <CategorySelect
              kind="news"
              value={draft.category ?? ""}
              onChange={(value) => setDraft({ ...draft, category: value })}
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
