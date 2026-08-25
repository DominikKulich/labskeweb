/**
 * Datové modely projektu. Struktura odpovídá tabulkám v databázi
 * (photos, stories), aby šlo statická data nahradit dotazy bez změny komponent.
 */

export type PhotoCategory = "historie" | "soucasnost" | "labe" | "promeny";

export interface Photo {
  id: string;
  /** URL nebo importovaný asset */
  src: string;
  title: string;
  /** Rok pořízení, u nepřesných datací např. "kolem 1930" */
  year: string;
  description: string;
  /** Autor nebo archiv, ze kterého snímek pochází */
  source: string;
  category: PhotoCategory;
  /** Orientace pro editorial grid */
  orientation: "portrait" | "landscape";
  /** Historické snímky se sázejí na papírovém podkladu */
  archival: boolean;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  perex: string;
  category: string;
  /** ISO datum publikace */
  date: string;
  coverSrc: string;
  coverAlt: string;
  readingTime: number;
  /** Odstavce a mezinadpisy článku */
  body: Array<
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "quote"; text: string; author?: string }
    | { type: "image"; src: string; caption: string }
  >;
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  text: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface ContributionInput {
  name: string;
  email: string;
  year?: string;
  place?: string;
  message: string;
}

export const photoCategoryLabels: Record<PhotoCategory | "vse", string> = {
  vse: "Vše",
  historie: "Historie",
  soucasnost: "Současnost",
  labe: "Labe",
  promeny: "Proměny",
};
