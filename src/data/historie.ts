import { images } from "./photos";

/**
 * Obsah historické stránky vychází z dokumentu
 * „Historie štětského nábřeží, Ostrova a života kolem Labe“.
 * Nedoplňujeme fakta z jiných zdrojů.
 */

export interface HistoryFact {
  year: string;
  text: string;
}

export interface HistorySection {
  heading: string;
  paragraphs: string[];
}

export interface HistoryChapter {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  /** Podsekce pro delší kapitoly — drží text čitelný i na mobilu. */
  sections?: HistorySection[];
  facts?: HistoryFact[];
  didYouKnow?: string;
  /** Zvýrazněná zajímavost se sází jako velký box přes celou šířku. */
  didYouKnowLarge?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  archival?: boolean;
}

/** Rychlá časová osa — nejdůležitější body historie nábřeží. */
export const keyMilestones: HistoryFact[] = [
  { year: "1537", text: "První doložená zmínka o přívozu přes Labe." },
  { year: "1557", text: "Ferdinand I. potvrdil 30. 3. právo přívoz provozovat." },
  { year: "1787", text: "Doložen starší ze dvou plovoucích lodních mlýnů." },
  { year: "1841", text: "Začátek osobní parní plavby; parník Bohemia každé čtyři dny." },
  { year: "1842", text: "Extrémní sucho — do Hněvic se chodilo přímo korytem Labe." },
  { year: "1851", text: "Pontonový „létací most“ pro pěší k nádraží v Hněvicích." },
  { year: "1885", text: "Řetězová paroplavba po řetězu položeném na dně řeky." },
  { year: "1908", text: "Regulace: konec lodních mlýnů i létacího mostu." },
  { year: "1909", text: "Hradlový jez, který se na zimu ručně rozebíral." },
  { year: "1908–1910", text: "Rameno u Ostrova zasypáno hlušinou z výstavby jezu." },
  { year: "1973", text: "Otevření mostu ukončuje pravidelný provoz přívozu." },
  { year: "2002", text: "Srpnová povodeň kulminuje 7,5 m nad normálem." },
];

/** Shrnutí nejsilnějších zajímavostí na konci stránky. */
export const highlights: string[] = [
  "V suchém roce 1842 se ze Štětí do Hněvic chodilo přímo korytem Labe — voda sahala nanejvýš ke kolenům.",
  "Od roku 1885 tahaly lodě po Labi řetězové parníky po řetězu položeném přímo na dně řeky.",
  "Ostrov byl skutečným ostrovem; úzké rameno Labe zasypala až regulace v letech 1908–1910.",
  "Hlušinu na zasypání ramene vozila zhruba čtyřkilometrová úzkokolejka, na kterou místní kluci naskakovali načerno.",
  "Protože se jez na zimu rozebíral, vznikalo kluziště od přívozu kolem celého Štětí až do Počeplic.",
  "V listopadu 1960 přibyla vodometná pramice pro sto osob za 242 000 Kčs, po ní jezdila loď „Marie“.",
  "V roce 1953 bombardovala armáda ledovou bariéru pod jezem — voda se přesto dostala až na Husovo náměstí.",
  "Most z roku 1973 vznikl hlavně kvůli železniční vlečce do papíren, proto vede po jedné konstrukci vlak i auta.",
];

export const chapters: HistoryChapter[] = [
  {
    id: "labe-a-breh",
    eyebrow: "Kapitola 01",
    title: "Labe a původní břeh",
    lead: "Řeka byla od počátku zásadní součástí života ve Štětí — voda, ryby, doprava a obživa, zároveň ale trvalé povodňové riziko.",
    paragraphs: [
      "Původní břeh nevypadal jako dnešní zpevněná hrana. Byl proměnlivý, s písečnými přesypy, mělčinami a nízkými křovinami, a nikdy nezůstal dlouho stejný.",
      "Podoba břehu se měnila s každou velkou vodou i s každým suchým létem. Až regulace na počátku 20. století dala řece pevný tvar — a s ním i nábřeží, jak ho známe dnes.",
    ],
    imageSrc: images.nabrezi1,
    imageAlt: "Břeh Labe ve Štětí",
    imageCaption: "Břeh Labe ve Štětí.",
  },
  {
    id: "brod-a-privoz",
    eyebrow: "Kapitola 02",
    title: "Brod, přívoz a spory o právo převážet",
    lead: "Přechod přes Labe se řešil pravděpodobně nejprve brodem, později přívozem. Ten je doložen už od roku 1537.",
    paragraphs: [
      "Právo přívoz provozovat potvrdil Ferdinand I. dne 30. března 1557. Přívoz byl cenný majetek — kolem roku 1657 se o něj vedl spor.",
    ],
    sections: [
      {
        heading: "Rok bez vody",
        paragraphs: [
          "V roce 1842 bylo Labe kvůli extrémnímu suchu tak nízké, že se ze Štětí do Hněvic chodilo přímo korytem řeky. Voda sahala nanejvýš ke kolenům.",
        ],
      },
    ],
    facts: [
      { year: "1537", text: "První doložená zmínka o přívozu." },
      { year: "1557", text: "Potvrzení práva Ferdinandem I. (30. 3.)." },
      { year: "1657", text: "Spor o přívoz." },
      { year: "1842", text: "Sucho — chůze korytem do Hněvic." },
    ],
    didYouKnow:
      "V roce 1842 se ze Štětí do Hněvic dalo dojít přímo korytem Labe. Voda sahala nanejvýš ke kolenům.",
    didYouKnowLarge: true,
    imageSrc: images.privoz,
    imageAlt: "Přívoz přes Labe ve Štětí",
    imageCaption: "Přívoz přes Labe ve Štětí.",
    archival: true,
  },
  {
    id: "letaci-most",
    eyebrow: "Kapitola 03",
    title: "„Létací most“ pro pěší",
    lead: "Od roku 1851 sloužila pěším pontonová lávka, které se říkalo létací most — fliegende Brücke.",
    paragraphs: [
      "Vznikla kvůli nové železniční stanici v Hněvicích: lidé ze Štětí potřebovali na vlak a přívoz sám na to nestačil.",
      "Lávka sloužila víc než půl století. Odstraněna byla při regulaci řeky v roce 1908.",
    ],
    facts: [
      { year: "1851", text: "Pontonová lávka pro pěší." },
      { year: "1908", text: "Odstranění při regulaci řeky." },
    ],
    imageSrc: images.promenada,
    imageAlt: "Nábřeží Labe ve Štětí",
    imageCaption: "Nábřeží Labe ve Štětí.",

  },
  {
    id: "privoz-20-stoleti",
    eyebrow: "Kapitola 04",
    title: "Přívoz ve 20. století a loď „Marie“",
    lead: "Ve 20. století se přívoz modernizoval — a několikrát ho zastavila zima.",
    paragraphs: [
      "Provoz stálo zamrzlé Labe v zimách 1927 a 1928–1929. Od roku 1932 pomáhal převozníkům benzinový motor, v letech 1935 a 1937 se pracovalo na hrázkách a řetězech.",
    ],
    sections: [
      {
        heading: "Poslední lodě",
        paragraphs: [
          "Po válce se u přívozu vystřídala celá řada převozníků a jízdné mělo své dobové ceny.",
          "V listopadu 1960 přibyla nová vodometná pramice pro sto osob za 242 000 Kčs. Po ní nastoupila loď „Marie“, která jezdila až do otevření mostu v roce 1973.",
        ],
      },
    ],
    facts: [
      { year: "1932", text: "Benzinový motor pro převozníky." },
      { year: "1935–1937", text: "Práce na hrázkách a řetězech." },
      { year: "1960", text: "Vodometná pramice pro 100 osob." },
      { year: "1973", text: "Konec pravidelného přívozu." },
    ],
    didYouKnow:
      "Vodometná pramice z listopadu 1960 uvezla sto osob a stála 242 000 Kčs. Po ní převzala provoz loď „Marie“ — poslední štětský přívoz.",
    didYouKnowLarge: true,
    imageSrc: images.pristav,
    imageAlt: "Loď na Labi u Štětí",
    imageCaption: "Loď na Labi u Štětí.",
    archival: true,
  },
  {
    id: "lodni-mlyny",
    eyebrow: "Kapitola 05",
    title: "Lodní mlýny",
    lead: "Na Labi u Štětí kotvily dva plovoucí lodní mlýny. Starší je doložen už v roce 1787, druhý byl povolen v roce 1797.",
    paragraphs: [
      "V suchém roce 1842 musel být téměř celý proud soustředěn pod kola mlýnů, aby vůbec mlely. Obilí se tehdy vozilo až z okolí Slaného.",
      "Oba mlýny byly odstraněny v roce 1908 při regulaci řeky. Krátkou epizodou zůstal větrný mlýn z let 1803–1804.",
    ],
    facts: [
      { year: "1787", text: "Doložen starší lodní mlýn." },
      { year: "1797", text: "Povolení druhého mlýna." },
      { year: "1803–1804", text: "Krátká epizoda větrného mlýna." },
      { year: "1908", text: "Odstranění obou lodních mlýnů." },
    ],
    imageSrc: "/images/mlyny.webp",
    imageAlt: "Lodní mlýny na Labi u Štětí",
    imageCaption: "Lodní mlýny na Labi u Štětí.",
    archival: true,
  },
  {
    id: "doprava-po-rece",
    eyebrow: "Kapitola 06",
    title: "Doprava po řece",
    lead: "Po proudu pluly nákladní lodě a vory. Proti proudu se zprvu táhlo koňmi po levém břehu, později nastoupily parníky.",
    paragraphs: [
      "Osobní parníky jezdily od roku 1841 — parník Bohemia každé čtyři dny.",
    ],
    sections: [
      {
        heading: "Řetěz na dně řeky",
        paragraphs: [
          "Od roku 1885 fungovala řetězová paroplavba: lodě se přitahovaly po řetězu položeném přímo na dně Labe.",
        ],
      },
      {
        heading: "Regulace a moderní plavba",
        paragraphs: [
          "Po kanalizaci a regulaci řeky a stavbě jezů v letech 1903–1919 byla doprava kolem roku 1910 pravidelnější. Meziválečná osobní doprava měla ve Štětí vlastní zastávku.",
          "V roce 2009 byla osobní plavba částečně obnovena lodí Porta Bohemica 1.",
        ],
      },
    ],
    facts: [
      { year: "1841", text: "Začátek osobní parní plavby." },
      { year: "1885", text: "Řetězová paroplavba po dně řeky." },
      { year: "1903–1919", text: "Stavba jezů, kanalizace Labe." },
      { year: "2009", text: "Obnovení plavby s Porta Bohemica 1." },
    ],
    didYouKnow:
      "Řetězové parníky se od roku 1885 doslova přitahovaly po řetězu, který ležel na dně Labe.",
    didYouKnowLarge: true,
    imageSrc: "/images/lod.webp",
    imageAlt: "Lodní doprava na Labi u Štětí",
    imageCaption: "Lodní doprava na Labi u Štětí.",
    archival: true,
  },
  {
    id: "lodenice",
    eyebrow: "Obrazový meziblok",
    title: "Loděnice",
    lead: "Výstavba štětské loděnice.",
    paragraphs: [],
    imageSrc: "/images/vystavbalodenice.webp",
    imageAlt: "Výstavba štětské loděnice",
    imageCaption: "Výstavba štětské loděnice.",
    archival: true,
  },
  {
    id: "ostrov",
    eyebrow: "Kapitola 07",
    title: "Ostrov jako skutečný ostrov",
    lead: "Dnešní Ostrov byl původně opravdovým ostrovem, oddělený od města úzkým ramenem Labe.",
    paragraphs: [
      "Rozkládaly se na něm štětské louky a přicházelo se sem po lávce. Výrazněji zalesněn byl až po roce 1878.",
      "Při regulaci v letech 1908–1910 bylo rameno zasypáno hlušinou z výstavby jezu. Zemina se vozila zhruba čtyři kilometry úzkokolejnou drahou.",
    ],
    facts: [
      { year: "1878", text: "Začátek výraznějšího zalesnění." },
      { year: "1908–1910", text: "Zasypání ramene Labe." },
    ],
    didYouKnow:
      "Ostrov nebyl jen jméno. Od města ho dělilo rameno Labe a chodilo se na něj po lávce — a místní kluci naskakovali načerno na vagónky úzkokolejky, která rameno zasypávala.",
    didYouKnowLarge: true,
    imageSrc: images.plovarna2,
    imageAlt: "Rameno Labe u Ostrova",
    imageCaption: "Rameno Labe u Ostrova.",
    archival: true,
  },
  {
    id: "plovarny-a-letni-hoste",
    eyebrow: "Kapitola 08",
    title: "Plovárny, letní hosté a nedělní šraml",
    lead: "Na přelomu 19. a 20. století jezdili do Štětí výletníci a letní hosté. Zhruba deset domů nabízelo pokoje „letňákům“.",
    paragraphs: [
      "Na Ostrově stála obecní plovoucí vorová plovárna. Plavčík učil plavat pomocí bidla, na břehu byla převlékací kabina a altán s parketem.",
    ],
    sections: [
      {
        heading: "Neděle u vody",
        paragraphs: [
          "V neděli hrál šraml, tančilo se, čepovalo se pivo a limonáda.",
          "Ve městě fungovala i druhá, cukrovarská plovárna, školní hřiště, občas divadlo v přírodě a půjčovna loděk.",
        ],
      },
    ],
    imageSrc: images.plovarna,
    imageAlt: "Plovárna na Ostrově",
    imageCaption: "Plovárna na Ostrově.",
    archival: true,
  },
  {
    id: "jez-a-kluziste",
    eyebrow: "Kapitola 09",
    title: "Jez a zimní kluziště",
    lead: "Původní hradlový jez sloužil od roku 1909 a na zimu se dva až tři dny ručně rozebíral.",
    paragraphs: [
      "Hladina pak klesla o dva až tři metry, tůně zamrzaly a vznikalo velké kluziště od přívozu kolem Štětí až do Počeplic. Sedláci z vypuštěných tůní vybírali bahno jako hnojivo.",
    ],
    sections: [
      {
        heading: "Nový jez a jeho následek",
        paragraphs: [
          "V 70. letech nahradil hradlový jez nový elektrický sklápěcí jez a plavební komory se prodloužily ze 73 na 85 metrů.",
          "Stabilní hladina ale během zhruba deseti let způsobila úhyn starého lužního porostu.",
        ],
      },
    ],
    facts: [
      { year: "1909", text: "Hradlový jez, na zimu rozebíraný." },
      { year: "70. léta", text: "Elektrický sklápěcí jez." },
    ],
    didYouKnow:
      "Kluziště sahalo od přívozu kolem celého Štětí až do Počeplic — vzniklo jen díky tomu, že se jez na zimu rozebíral.",
    didYouKnowLarge: true,
    imageSrc: "/images/zamrzlelabe.webp",
    imageAlt: "Zamrzlé Labe u Štětí",
    imageCaption: "Zamrzlé Labe u Štětí.",
  },
  {
    id: "papirny-a-most",
    eyebrow: "Kapitola 10",
    title: "Papírny a most 1973",
    lead: "Rozvoj papíren SEPAP zásadně změnil dopravu ve Štětí a vytvořil potřebu kvalitního napojení na železnici na protějším břehu.",
    paragraphs: [
      "Most se stavěl na přelomu 60. a 70. let a dokončen byl v roce 1973. Investorem byl SEPAP, projekt zpracoval Chemoprojekt, generálním dodavatelem byla IPS Praha a podílely se Stavby silnic a železnic.",
      "Hlavním účelem stavby byla železniční vlečka do papíren — proto má most společné železniční a silniční uspořádání. Jeho otevření ukončilo pravidelný provoz přívozu a zkrátilo cestu na Roudnici.",
    ],
    sections: [
      {
        heading: "Návrat přívozu 2019–2020",
        paragraphs: [
          "Během rekonstrukce mostu v letech 2019–2020 se do Štětí dočasně vrátil přívoz pro pěší a cyklisty.",
        ],
      },
    ],
    facts: [
      { year: "1973", text: "Dokončení mostu přes Labe." },
      { year: "2019–2020", text: "Rekonstrukce a dočasný přívoz." },
    ],
    imageSrc: "/images/vystavbamostu.webp",
    imageAlt: "Výstavba mostu přes Labe ve Štětí",
    imageCaption: "Výstavba mostu přes Labe ve Štětí.",
    archival: true,
  },
  {
    id: "povodne",
    eyebrow: "Kapitola 11",
    title: "Povodně a mimořádné události",
    lead: "Velká voda se do podoby nábřeží zapsala stejně silně jako kterákoli stavba.",
    paragraphs: [
      "Povodeň roku 1784 zasáhla 72 domů, kostel a faru; obyvatele zachraňoval přívozník Václav Šťastný. V roce 1845 stoupla voda asi o 45 cm výš než v roce 1784, v kostele stálo půl metru vody a 28 domů zůstalo neobyvatelných. Povodeň roku 1920 patřila k největším.",
    ],
    sections: [
      {
        heading: "Válka a poválečná léta",
        paragraphs: [
          "V roce 1945 dopadly do Labe před Koželužnou bomby a tlaková vlna vyrazila okna. Po válce lovili vojáci ryby granáty a pancéřovými pěstmi, pravý břeh byl plný opuštěné techniky.",
        ],
      },
      {
        heading: "Led, voda a rok 2002",
        paragraphs: [
          "V roce 1953 bombardovala armáda ledovou bariéru pod jezem a voda se dostala až na Husovo náměstí. V roce 1965 teklo přes nábřeží více než metr kalné vody.",
          "Při povodni v roce 2002 dosáhla hladina 13. srpna 5,86 m nad normálem, 15. srpna kulminovala na 7,5 m a obchvat od Koželužny k mostu byl pod vodou.",
        ],
      },
    ],
    facts: [
      { year: "1784", text: "Zasaženo 72 domů, kostel a fara." },
      { year: "1845", text: "Voda o 45 cm výš než v roce 1784." },
      { year: "1953", text: "Bombardování ledové bariéry pod jezem." },
      { year: "2002", text: "Maximum 7,5 m nad normálem." },
    ],
    didYouKnow:
      "V roce 1953 rozbíjela armáda bombardováním ledovou bariéru pod jezem. Voda se přesto dostala až na Husovo náměstí.",
    didYouKnowLarge: true,
    imageSrc: images.povoden,
    imageAlt: "Povodeň ve Štětí",
    imageCaption: "Povodeň ve Štětí.",
    archival: true,
  },
  {
    id: "moderni-ostrov",
    eyebrow: "Kapitola 12",
    title: "Moderní Ostrov",
    lead: "V 90. letech přišla obnova travnatého Ostrova — cesty, lavičky, hřiště a sportoviště.",
    paragraphs: [
      "V jižní části vznikl areál veslařů. Od roku 2005 stojí na Ostrově skate rampa.",
    ],
    facts: [{ year: "2005", text: "Skate rampa na Ostrově." }],
    imageSrc: images.dnes,
    imageAlt: "Dnešní park na Ostrově u mostu",
    imageCaption: "Dnešní park na Ostrově.",
  },
];
