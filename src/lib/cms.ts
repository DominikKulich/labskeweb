import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoCategory, Story } from "@/data/types";

export interface PhotoRow {
  id: string;
  title: string;
  year: string | null;
  description: string | null;
  source: string | null;
  author: string | null;
  category: string;
  image_url: string;
  published: boolean;
  sort_order: number;
  is_demo: boolean;
  created_at: string;
}

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
  published: boolean;
  reading_time: number | null;
  is_demo: boolean;
  created_at: string;
}

export interface SubmissionRow {
  id: string;
  name: string;
  email: string;
  approximate_year: string | null;
  place: string | null;
  story: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

const ARCHIVAL_CATEGORIES = new Set(["historie", "promeny"]);

export function photoRowToPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    src: row.image_url,
    title: row.title,
    year: row.year ?? "",
    description: row.description ?? "",
    source: [row.source, row.author].filter(Boolean).join(" · "),
    category: (row.category as PhotoCategory) ?? "historie",
    orientation: "landscape",
    archival: ARCHIVAL_CATEGORIES.has(row.category),
  };
}

/** Rozdělí prostý text článku na editorial bloky (## nadpis, > citace, odstavec). */
export function parseArticleContent(content: string | null): Story["body"] {
  if (!content) return [];
  return content
    .split(/\n\s*\n/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) return { type: "heading" as const, text: block.slice(3).trim() };
      if (block.startsWith("> "))
        return { type: "quote" as const, text: block.replace(/^>\s?/gm, "").trim() };
      return { type: "paragraph" as const, text: block };
    });
}

export function articleRowToStory(row: ArticleRow): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    perex: row.excerpt ?? "",
    category: row.category ?? "Příběhy",
    date: row.published_at ?? "",
    coverSrc: row.cover_image_url ?? "",
    coverAlt: row.title,
    readingTime: row.reading_time ?? 4,
    body: parseArticleContent(row.content),
  };
}

/* ---------- veřejné čtení (RLS: pouze published) ---------- */

export async function fetchPublishedPhotos(): Promise<PhotoRow[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PhotoRow[];
}

export async function fetchPublishedArticles(): Promise<ArticleRow[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ArticleRow[];
}

export async function fetchPublishedArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as ArticleRow) ?? null;
}

/* ---------- veřejný příspěvek ---------- */

export async function insertSubmission(input: {
  name: string;
  email: string;
  approximate_year?: string | null;
  place?: string | null;
  story: string;
  image_url?: string | null;
}) {
  const { error } = await supabase.from("submissions").insert(input);
  if (error) throw error;
}

/* ---------- administrace (RLS: pouze admin) ---------- */

export async function fetchAllPhotos(): Promise<PhotoRow[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PhotoRow[];
}

export async function fetchAllArticles(): Promise<ArticleRow[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ArticleRow[];
}

export async function fetchSubmissions(): Promise<SubmissionRow[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionRow[];
}

export async function savePhoto(values: Partial<PhotoRow> & { title: string; image_url: string }) {
  const payload = {
    title: values.title,
    year: values.year ?? null,
    description: values.description ?? null,
    source: values.source ?? null,
    author: values.author ?? null,
    category: values.category ?? "historie",
    image_url: values.image_url,
    published: values.published ?? false,
    sort_order: values.sort_order ?? 0,
  };
  const query = values.id
    ? supabase.from("photos").update(payload).eq("id", values.id)
    : supabase.from("photos").insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function saveArticle(values: Partial<ArticleRow> & { title: string; slug: string }) {
  const payload = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt ?? null,
    content: values.content ?? null,
    cover_image_url: values.cover_image_url ?? null,
    category: values.category ?? null,
    published: values.published ?? false,
    published_at: values.published_at ?? new Date().toISOString(),
    reading_time: values.reading_time ?? null,
  };
  const query = values.id
    ? supabase.from("articles").update(payload).eq("id", values.id)
    : supabase.from("articles").insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function setPublished(
  table: "photos" | "articles",
  id: string,
  published: boolean,
) {
  const { error } = await supabase.from(table).update({ published }).eq("id", id);
  if (error) throw error;
}

export async function deleteRow(table: "photos" | "articles" | "submissions", id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function setSubmissionStatus(id: string, status: string) {
  const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- upload do Storage ---------- */

export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const name = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("images").upload(name, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from("images").getPublicUrl(name);
  return publicUrl.publicUrl;
}
