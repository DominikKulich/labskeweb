import type { Photo } from "./types";

// Fotografie Štětí (CDN pointery)
import privozAsset from "@/assets/privoz_beztextu.webp.asset.json";
import mostStavbaAsset from "@/assets/most_beztextu.webp.asset.json";
import plovarna1930Asset from "@/assets/plovarna1930.webp.asset.json";
import plovarnaOldAsset from "@/assets/plovarnaold.webp.asset.json";
import plovarna2Asset from "@/assets/plovarna2.webp.asset.json";
import kozeluznaAsset from "@/assets/kozeluzna.webp.asset.json";
import povodneAsset from "@/assets/povodne.webp.asset.json";
import lodAsset from "@/assets/lod.webp.asset.json";
import lod2Asset from "@/assets/lod2.webp.asset.json";
import retroSteti from "@/assets/retro_steti.webp.asset.json";
import retro2 from "@/assets/retro2.png.asset.json";
import nabrezi1 from "@/assets/nabrezi1.webp.asset.json";
import nabrezi2 from "@/assets/nabrezi2.webp.asset.json";
import nabrezi3 from "@/assets/nabrezi3.webp.asset.json";
import nabrezi4 from "@/assets/nabrezi4.webp.asset.json";
import nabrezi5 from "@/assets/nabrezi5.webp.asset.json";
import parkAsset from "@/assets/park.webp.asset.json";

export const images = {
  hero: nabrezi2.url,
  // historie
  privoz: privozAsset.url,
  mostStavba: mostStavbaAsset.url,
  plovarna: plovarna1930Asset.url,
  plovarna2: plovarna2Asset.url,
  kozeluzna: kozeluznaAsset.url,
  povoden: povodneAsset.url,
  lod: lodAsset.url,
  pristav: lod2Asset.url,
  retroSteti: retroSteti.url,
  retroPruvod: retro2.url,
  // současnost
  tehdy: plovarnaOldAsset.url,
  dnes: parkAsset.url,
  park: parkAsset.url,
  labeMlha: nabrezi2.url,
  mostDnes: nabrezi3.url,
  promenada: nabrezi5.url,
  nabrezi1: nabrezi1.url,
  nabrezi4: nabrezi4.url,
  detiUReky: kozeluznaAsset.url,
};

/**
 * Záložní datová sada (galerie čte primárně z databáze).
 */
export const photos: Photo[] = [
  {
    id: "p-01",
    src: images.privoz,
    title: "Přívoz přes Labe",
    year: "",
    description:
      "Přívoz přes Labe zajišťoval ve Štětí přepravu přes řeku pěším i vozidlům od středověku až do zprovoznění nového mostu v roce 1973.",
    source: "",
    category: "historie",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-02",
    src: images.mostStavba,
    title: "Výstavba nového mostu přes Labe",
    year: "1973",
    description: "Výstavba nového mostu přes Labe ve Štětí v roce 1973.",
    source: "",
    category: "promeny",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-03",
    src: images.plovarna,
    title: "Plovárna na Ostrově",
    year: "1930",
    description:
      "Na zalesněném Ostrově stála šatna na převlékání a prodávalo se občerstvení. Na řece byl zakotven malý plovoucí vor, kde plavčík učil plavat na bidle.",
    source: "",
    category: "historie",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-04",
    src: images.plovarna2,
    title: "Koupání u Ostrova",
    year: "",
    description: "Koupající se u břehu Labe.",
    source: "",
    category: "historie",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-05",
    src: images.kozeluzna,
    title: "Nábřeží u koželužny",
    year: "",
    description: "Historické nábřeží s budovou koželužny a dětmi u vody.",
    source: "",
    category: "historie",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-06",
    src: images.povoden,
    title: "Povodeň ve Štětí",
    year: "",
    description: "Zaplavená ulice, obyvatelé se pohybují na loďkách.",
    source: "",
    category: "labe",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-07",
    src: images.pristav,
    title: "Plachetnice na Labi",
    year: "",
    description: "Plachetnice s označením D 77 na hladině Labe.",
    source: "",
    category: "labe",
    orientation: "portrait",
    archival: true,
  },
  {
    id: "p-08",
    src: images.lod,
    title: "Podvečerní plavba",
    year: "",
    description: "Plachetnice na Labi proti zapadajícímu slunci.",
    source: "",
    category: "labe",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-09",
    src: images.retroSteti,
    title: "Alej u Labe",
    year: "",
    description: "Historický snímek aleje a odpočinku u řeky ve Štětí.",
    source: "",
    category: "historie",
    orientation: "landscape",
    archival: true,
  },
  {
    id: "p-10",
    src: images.nabrezi1,
    title: "Lavička nad hladinou",
    year: "",
    description: "Břeh Labe se vzrostlými stromy a lavičkou.",
    source: "",
    category: "soucasnost",
    orientation: "landscape",
    archival: false,
  },
  {
    id: "p-11",
    src: images.park,
    title: "Park u mostu",
    year: "",
    description: "Pískoviště, lavičky a pohled na most přes Labe.",
    source: "",
    category: "soucasnost",
    orientation: "landscape",
    archival: false,
  },
  {
    id: "p-12",
    src: images.mostDnes,
    title: "Údržba břehu",
    year: "",
    description: "Ruční sekání a úklid břehu s mostem v pozadí.",
    source: "",
    category: "promeny",
    orientation: "portrait",
    archival: false,
  },
  {
    id: "p-13",
    src: images.labeMlha,
    title: "Ráno na nábřeží",
    year: "",
    description: "Klidná hladina Labe za jasného rána.",
    source: "",
    category: "labe",
    orientation: "portrait",
    archival: false,
  },
  {
    id: "p-14",
    src: images.promenada,
    title: "Nábřeží pod mraky",
    year: "",
    description: "Travnatý břeh s lavičkou a přístavním molem.",
    source: "",
    category: "soucasnost",
    orientation: "portrait",
    archival: false,
  },
  {
    id: "p-15",
    src: images.nabrezi4,
    title: "Cesta podél Labe",
    year: "",
    description: "Posekaná cesta mezi stromy nedaleko břehu.",
    source: "",
    category: "soucasnost",
    orientation: "landscape",
    archival: false,
  },
];

export function getPhotosByCategory(category: string): Photo[] {
  if (category === "vse") return photos;
  return photos.filter((p) => p.category === category);
}
