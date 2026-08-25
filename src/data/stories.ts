import type { Story, TimelineEntry } from "./types";
import { images } from "./photos";

export const stories: Story[] = [
  {
    id: "s-01",
    slug: "jak-vznikal-novy-most-pres-labe",
    title: "Jak vznikal nový most přes Labe",
    perex:
      "Tři roky stavby, dvě povodně a jedna generace, která si zvykla, že se na druhý břeh chodí pěšky.",
    category: "Proměny",
    date: "2025-03-18",
    coverSrc: images.mostStavba,
    coverAlt: "Archivní snímek rozestavěného mostu přes Labe",
    readingTime: 7,
    body: [
      {
        type: "paragraph",
        text: "Než se přes Labe přehnal první betonový oblouk, musel se změnit celý spodní okraj města. Nábřeží, které do té doby končilo kamennou rampou přívozu, se stalo staveništěm.",
      },
      {
        type: "heading",
        text: "Rozhodnutí, které se odkládalo dvacet let",
      },
      {
        type: "paragraph",
        text: "O mostu se mluvilo už krátce po válce. Přívoz stačil pěším a kolům, ale ne nákladním autům, která musela objíždět desítky kilometrů. Projekt se dostal na papír až koncem šedesátých let, kdy se rozšířil průmysl na protějším břehu.",
      },
      {
        type: "quote",
        text: "Když jsme betonovali první pilíř, přišla celá čtvrť. Lidi stáli na břehu a dívali se, jako by se něco loučilo.",
        author: "vzpomínka stavbyvedoucího, zapsáno 2019",
      },
      {
        type: "image",
        src: images.tehdy,
        caption: "Výstavba nového mostu přes Labe ve Štětí v roce 1973.",
      },
      {
        type: "heading",
        text: "Poslední jízda prámu",
      },
      {
        type: "paragraph",
        text: "Přívoz jezdil ještě několik měsíců po otevření mostu. Pak zmizel ze dne na den — prám odtáhli po proudu a rampa zarostla. Dnes po ní zbyl jen šikmý pruh betonu pod novou dlažbou.",
      },
      {
        type: "paragraph",
        text: "Most změnil i to, kudy lidé chodí. Nábřeží se z dopravní spojnice stalo místem, kam se chodí na procházku. Trvalo ale ještě čtyřicet let, než tomu odpovídala i jeho podoba.",
      },
    ],
  },
  {
    id: "s-02",
    slug: "privoz-ktery-spojoval-oba-brehy",
    title: "Přívoz, který spojoval oba břehy",
    perex:
      "Sto let jízd tam a zpět, jízdenky za pár haléřů a převozníci, kteří znali každého cestujícího jménem.",
    category: "Historie",
    date: "2025-01-27",
    coverSrc: images.privoz,
    coverAlt: "Sepiová fotografie přívozu s cestujícími",
    readingTime: 5,
    body: [
      {
        type: "paragraph",
        text: "Přívoz byl po většinu dvacátého století nejsamozřejmější věcí na nábřeží. Ráno vozil dělníky, odpoledne školáky, v neděli výletníky s košíky.",
      },
      {
        type: "heading",
        text: "Provoz podle vody",
      },
      {
        type: "paragraph",
        text: "Jízdní řád se řídil hladinou. Při velké vodě se neplulo, při nízké se přistávalo o kus níž po proudu. Cestující to brali jako součást počasí.",
      },
      {
        type: "image",
        src: images.kozeluzna,
        caption: "Historické nábřeží u koželužny.",
      },
      {
        type: "quote",
        text: "Převozník poznal podle kroků na rampě, kdo přichází. Nemusel se otáčet.",
      },
      {
        type: "paragraph",
        text: "Sbíráme jízdenky, fotografie i útržky vzpomínek. Každý detail pomáhá poskládat provoz, o kterém se nevedly téměř žádné záznamy.",
      },
    ],
  },
  {
    id: "s-03",
    slug: "plovarna-na-ostrove",
    title: "Plovárna na Ostrově",
    perex:
      "Dřevěné molo, půjčovna loděk a letní odpoledne, která si pamatuje ještě několik generací.",
    category: "Život u řeky",
    date: "2024-11-09",
    coverSrc: images.plovarna,
    coverAlt: "Archivní barevná fotografie plovárny s dřevěným molem",
    readingTime: 6,
    body: [
      {
        type: "paragraph",
        text: "Plovárna vznikla mezi válkami jako prosté dřevěné molo s kabinami. Vydržela přes půl století a zanikla tiše, bez rozhodnutí — prostě ji jednou v zimě odnesla voda.",
      },
      {
        type: "heading",
        text: "Sezona od června do září",
      },
      {
        type: "paragraph",
        text: "Vstupné se platilo u dřevěné budky, plavčík hlídal dva vytyčené pruhy a kdo uměl, plaval k bójce uprostřed ramene. Loďky se půjčovaly na hodinu.",
      },
      {
        type: "image",
        src: images.plovarna2,
        caption: "Koupání u Ostrova.",
      },
      {
        type: "paragraph",
        text: "Po plovárně nezůstalo nic než pilotové otvory ve dně a fotografie v rodinných albech. Právě ty jsou pro projekt nejcennější.",
      },
    ],
  },
];

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export const timeline: TimelineEntry[] = [
  {
    id: "t-1890",
    year: "1890",
    title: "Kamenné nábřeží",
    text: "Břeh dostává první zpevněnou hranu. Vzniká rampa, u které bude příštích osmdesát let přistávat přívoz.",
  },
  {
    id: "t-1925",
    year: "1925",
    title: "Plovárna a loděnice",
    text: "Na rameni řeky se otevírá plovárna s dřevěným molem a půjčovnou loděk.",
    imageSrc: images.plovarna,
    imageAlt: "Plovárna na Ostrově",
  },
  {
    id: "t-1940",
    year: "1940",
    title: "Velká voda",
    text: "Povodeň zaplavuje spodní část nábřeží. Zkušenost se promítne do pozdějších úprav břehu.",
    imageSrc: images.povoden,
    imageAlt: "Povodeň ve Štětí",
  },
  {
    id: "t-1963",
    year: "1963",
    title: "Řeka jako dopravní tepna",
    text: "Nákladní doprava po Labi vrcholí. U překladiště kotví remorkéry s tlačnými soupravami.",
    imageSrc: images.pristav,
    imageAlt: "Plachetnice na Labi",
  },
  {
    id: "t-1971",
    year: "1971",
    title: "Stavba mostu",
    text: "Začíná betonáž pilířů. Nábřeží se na tři roky mění ve staveniště.",
    imageSrc: images.mostStavba,
    imageAlt: "Výstavba mostu přes Labe ve Štětí v roce 1973",
  },
  {
    id: "t-1974",
    year: "1974",
    title: "Konec přívozu",
    text: "Otevření mostu ukončuje provoz přívozu. Rampa zůstává na místě a postupně zarůstá.",
  },
  {
    id: "t-2002",
    year: "2002",
    title: "Povodeň a obnova",
    text: "Další velká voda urychlí diskusi o novém využití břehu a protipovodňových opatřeních.",
  },
  {
    id: "t-2021",
    year: "2021",
    title: "Revitalizace promenády",
    text: "Nábřeží dostává novou dlažbu, alej a mobiliář. Z dopravní hrany se stává veřejný prostor.",
    imageSrc: images.dnes,
    imageAlt: "Park u mostu na nábřeží",
  },
];
