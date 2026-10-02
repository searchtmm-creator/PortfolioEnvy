// Import Dino project assets
import dinoPortada from '../assets/dino/Dinoportada.webp';
import dino1 from '../assets/dino/Dino 1.webp';
import dino2 from '../assets/dino/Dino 2.webp';
import dino3 from '../assets/dino/dino 3.mp4';
import dino4 from '../assets/dino/Dino 4.mp4';
import dino5 from '../assets/dino/Dino 5.mp4';

// Import win tv project assets
import wtPortada from '../assets/wintv/WintvPortada.webp';
import wt1 from '../assets/wintv/wintv_1.webp';
import wt2 from '../assets/wintv/wintv_2.webp';
import wt3 from '../assets/wintv/wintv_3.webp';
import wt4 from '../assets/wintv/wintv_4.webp';
import wt5 from '../assets/wintv/wintv_5.mp4';
import wt6 from '../assets/wintv/wintv_6.webp';
import wt7 from '../assets/wintv/wintv_7.webp';
import wt8 from '../assets/wintv/wintv_8.webp';
import wt9 from '../assets/wintv/wintv_9.webp';
import wt10 from '../assets/wintv/wintv_10.mp4';
import wt11 from '../assets/wintv/wintv_11.webp';
import wt12 from '../assets/wintv/wintv_12.webp';

// Import Lo-Fried Beats project assets
import lofried1 from '../assets/lofried/lo-fried_1.mp4';
import lofried2 from '../assets/lofried/lo-fried_2.webp';
import lofried3 from '../assets/lofried/lo-fried_3.webp';

// Import Open Late project assets
import openlate1 from '../assets/openlate/openlate1.webp';
import openlate2 from '../assets/openlate/openlate2.webp';
import openlate3 from '../assets/openlate/openlate3.webp';
import openlate4 from '../assets/openlate/openlate4.webp';
import openlate5 from '../assets/openlate/openlate5.webp';
import openlate6 from '../assets/openlate/openlate6.webp';

// Import Copa / Cheering Trophy project assets
import copa1 from '../assets/copa/copa1.webp';
import copa2 from '../assets/copa/copa2.mp4';
import copaPortada from '../assets/copa/copaportada.webp';

// Import Dedos Llenos project assets
import dedos1 from '../assets/Dedos/dedos1.webp';
import dedos2 from '../assets/Dedos/dedos2.webp';
import dedos3 from '../assets/Dedos/dedos3.webp';
import dedos4 from '../assets/Dedos/dedos4.webp';
import dedos5 from '../assets/Dedos/dedos5.webp';

// Import Sunstats project assets
import sun1 from '../assets/sunstats/sun1.webp';
import sun2 from '../assets/sunstats/sun2.webp';
import sun3 from '../assets/sunstats/sun3.webp';
import sun4 from '../assets/sunstats/sun4.webp';
import sun5 from '../assets/sunstats/sun5.webp';
import sun6 from '../assets/sunstats/sun6.webp';
import sun7 from '../assets/sunstats/sun7.webp';

// Import Exorcist project assets
import exorcistPortada from '../assets/exorcist/exorcistportada.webp';
import exorcist1 from '../assets/exorcist/exorcist1.webp';
import exorcist2 from '../assets/exorcist/exorcist2.webp';
import exorcist3 from '../assets/exorcist/exorcist3.webp';
import exorcist4 from '../assets/exorcist/exorcist4.webp';
import exorcist5 from '../assets/exorcist/exorcist5.avif';

// Import Muvid project assets
import muvidPortada from '../assets/muvid/muvidportada.webp';
import muvid1 from '../assets/muvid/muvid1.mp4';
import muvid2 from '../assets/muvid/muvid2.webp';

// Import Floating logo
import logo from '../assets/logoSA.svg';
import searchImage from '../assets/search.webp';

const descriptions: Record<string, string> = {
  'dino-on-negocios': 'The Chrome Dino: a 2026 film and content campaign for On Negocios, featuring the familiar dinosaur from Chrome’s offline game.',
  'wintv': 'Entertainment + Soccer: a 2025 film and content campaign for WinTV bringing entertainment and football together.',
  'lo-friedbeats': 'Lo-Fried Beats: a 2023 sound and content campaign for KFC, presented through its case film, audio and visual pieces.',
  'open-late': 'Open Late: a 2024 print and out-of-home campaign for KFC about its late-night offering.',
  'the-cheering-trophy': 'The Cheering Trophy: a 2019 innovation and PR campaign for Banco Pichincha, presented through a case film and campaign visuals.',
  'sun-stats': 'Sun Stats: a 2024 print and out-of-home campaign for KFC, shown through its series of campaign executions.',
  'dedos-llenos': 'Fingers Full of Fun: a 2023 film and content campaign for Cheetos, with a collection of films and campaign visuals.',
  'win-exorcist': 'Exorcist: a 2025 content campaign for Win, combining a campaign film with its supporting visual pieces.',
  'muvid': 'Music Video Festival: a 2025 content campaign for Win, presented through a film and festival visuals.',
};

// 9 Creative Director Projects of Sergio Alzate
export const projects = [
  { "id": 18, "title": "THE CHROME DINO", "category": "On Negocios // Film & Content", "year": "2026", "slug": "dino-on-negocios", "images": [dinoPortada, dino1, dino2, dino3, dino4, dino5], "video": "https://player.vimeo.com/video/1176753029", "rollover": "View the film" },
  { "id": 1, "title": "ENTERTAINMENT + SOCCER", "category": "WinTv // Film & Content", "year": "2025", "slug": "wintv", "images": [wtPortada, wt1, wt2, wt3, wt4, wt5, wt6, wt7, wt8, wt9, wt10, wt11, wt12], "video": "https://player.vimeo.com/video/1069358927", "rollover": "View the film" },
  { "id": 2, "title": "LOFRIED BEATS", "category": "KFC // Sound & Content", "year": "2023", "slug": "lo-friedbeats", "images": [lofried1, lofried2, lofried3], "video": "https://player.vimeo.com/video/1007819738", "rollover": "View the case" },
  { "id": 3, "title": "OPEN LATE", "category": "KFC // Print & OOH", "year": "2024", "slug": "open-late", "images": [openlate3, openlate1, openlate2, openlate4, openlate5, openlate6], "video": "", "rollover": "View the prints" },
  { "id": 4, "title": "THE CHEERING TROPHY", "category": "Banco Pichincha // Innovation & PR", "year": "2019", "slug": "the-cheering-trophy", "images": [copaPortada, copa1, copa2], "video": "https://player.vimeo.com/video/386616077", "rollover": "View the film" },
  { "id": 6, "title": "SUN STATS", "category": "KFC // Print & OOH", "year": "2024", "slug": "sun-stats", "images": [sun2, sun1, sun3, sun4, sun5, sun6, sun7], "video": "", "rollover": "View the Prints" },
  { "id": 5, "title": "FINGERS FULL OF FUN", "category": "Cheetos // Film & Content", "year": "2023", "slug": "dedos-llenos", "images": [dedos2, dedos1, dedos3, dedos4, dedos5], "video": "", "rollover": "View the film" },
  { "id": 7, "title": "EXORCIST", "category": "Win // Content", "year": "2025", "slug": "win-exorcist", "images": [exorcistPortada, exorcist1, exorcist2, exorcist3, exorcist4, exorcist5], "video": "https://player.vimeo.com/video/1131961594", "rollover": "View the film" },
  { "id": 9, "title": "MUSIC VIDEO FESTIVAL", "category": "Win // Content", "year": "2025", "slug": "muvid", "images": [muvidPortada, muvid1, muvid2], "video": "https://player.vimeo.com/video/1204577123", "rollover": "View the film" }
].map(project => ({ ...project, description: descriptions[project.slug] }));

export type Tier = 'gold' | 'silver' | 'bronze' | 'shortlist' | 'jury' | 'mention' | 'feature' | 'other';

interface AwardEntry {
  year: string;
  result: string;
  tier: Tier;
}

export interface Festival {
  name: string;
  location?: string;
  entries: AwardEntry[];
}

export const AWARDS_DATA: Festival[] = [
  {
    name: 'Cannes Lions',
    location: 'FRANCE',
    entries: [
      { year: '2021', result: 'Exhibition — ACT Responsible’s Great Ads', tier: 'feature' },
      { year: '2021', result: 'Jury — Future Lions', tier: 'jury' },
      { year: '2019', result: 'Bronze — Radio & Audio / The Cheering Trophy', tier: 'bronze' },
      { year: '2019', result: 'Shortlist — Radio & Audio / The Cheering Trophy', tier: 'shortlist' },
      { year: '2019', result: 'Shortlist — Radio & Audio / The Cheering Trophy', tier: 'shortlist' },
      { year: '2017', result: 'Shortlist — Media / Revealing Light', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Print & Publishing / GTI Family Font', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Media / Missing Tag', tier: 'shortlist' },
      { year: '2013', result: 'Bronze — Print / Young Lions Ecuador', tier: 'bronze' },
    ],
  },
  {
    name: 'Clio Awards',
    location: 'USA',
    entries: [
      { year: '2020', result: 'Clio Sports Silver — Direct / The Cheering Trophy', tier: 'silver' },
      { year: '2020', result: 'Clio Sports Bronze — Experiential/Events / The Cheering Trophy', tier: 'bronze' },
      { year: '2020', result: 'Clio Sports Bronze — Public Relations / The Cheering Trophy', tier: 'bronze' },
    ],
  },
  {
    name: 'LIA Awards',
    location: 'USA',
    entries: [{ year: '2019', result: 'Bronze — Radio & Audio / The Cheering Trophy', tier: 'bronze' }],
  },
  {
    name: 'One Show',
    location: 'USA',
    entries: [{ year: '2020', result: 'Merit — Innovation in Radio & Audio / The Cheering Trophy', tier: 'mention' }],
  },
  {
    name: 'Lürzer’s Archive',
    location: 'GERMANY',
    entries: [
      { year: '2024', result: 'Magazine 03.268 / KFC Sun Stats', tier: 'feature' },
      { year: '2024', result: 'Magazine 40th Anniversary / KFC Open Late', tier: 'feature' },
    ],
  },
  {
    name: 'Adweek Project Isaac',
    location: 'USA',
    entries: [{ year: '2017', result: 'Gold — HR Invention / No Gender Profile', tier: 'gold' }],
  },
  {
    name: 'CAC',
    location: 'ECUADOR',
    entries: [{ year: '2020', result: 'Expo — Contemporary Art Center of Quito', tier: 'feature' }],
  },
  {
    name: 'Ojo de Iberoamérica',
    location: 'LATAM',
    entries: [
      { year: '2024', result: 'Bronze — Radio & Sound / Lo Fried Beats', tier: 'bronze' },
      { year: '2024', result: 'Bronze — Print / Sun Stats', tier: 'bronze' },
      { year: '2024', result: 'Shortlist — Print / Sun Stats', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Radio & Sound / Lo Fried Beats', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Radio & Sound / Lo Fried Beats', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Social & Digital / Lo Fried Beats', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Best Country Idea', tier: 'shortlist' },
      { year: '2024', result: 'Jury — Radio & Sound', tier: 'jury' },
      { year: '2024', result: 'Jury — Best Country Idea', tier: 'jury' },
      { year: '2019', result: 'Silver — Ojo Sports / The Cheering Trophy', tier: 'silver' },
      { year: '2019', result: 'Bronze — El Ojo PR / The Cheering Trophy', tier: 'bronze' },
      { year: '2019', result: 'Shortlist — Best Country Idea / The Cheering Trophy', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Innovación / Missing Tag', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Media / Missing Tag', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Sustentable / Missing Tag', tier: 'shortlist' },
      { year: '2016', result: 'Shortlist — Interacción / Missing Tag', tier: 'shortlist' },
    ],
  },
  {
    name: 'Sol',
    location: 'LATAM',
    entries: [{ year: '2019', result: 'Shortlist — Uso Innovador de Audio / The Cheering Trophy', tier: 'shortlist' }],
  },
  {
    name: 'FIAP',
    location: 'LATAM',
    entries: [
      { year: '2026', result: 'Bronze — Anuncios / On Negocios - Dino', tier: 'bronze' },
      { year: '2026', result: 'Bronze — Anuncios / On Negocios - Dino', tier: 'bronze' },
      { year: '2026', result: 'Shortlist — Anuncios / On Negocios - Dino', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Anuncios / On Negocios - Dino', tier: 'shortlist' },
      { year: '2025', result: 'Bronze — Producción / WinTv', tier: 'bronze' },
      { year: '2025', result: 'Bronze — Producción / WinTv', tier: 'bronze' },
      { year: '2016', result: 'Shortlist — Innovación en Redes Sociales / Missing Tag', tier: 'shortlist' },
    ],
  },
  {
    name: 'Festival of Media',
    location: 'GLOBAL',
    entries: [{ year: '2016', result: 'Gold — Best Social Media Campaign / Missing Tag', tier: 'gold' }],
  },
  {
    name: 'WINA',
    location: 'GLOBAL',
    entries: [
      { year: '2021', result: 'Bronze — Print / Kids', tier: 'bronze' },
      { year: '2021', result: 'Honorable Mention — Print / Reflections', tier: 'mention' },
    ],
  },
  {
    name: 'Best Ads on TV',
    location: 'GLOBAL',
    entries: [
      { year: '2026', result: 'Best Print / By mom’s side', tier: 'gold' },
      { year: '2026', result: 'Best Film / Dino', tier: 'gold' },
      { year: '2024', result: 'Best Interactive / Good o.Meter', tier: 'gold' },
      { year: '2024', result: 'Best Print / Sun Stats', tier: 'gold' },
      { year: '2024', result: 'Best Print / Open Late', tier: 'gold' },
      { year: '2023', result: 'Best Print / Ice Scream', tier: 'gold' },
      { year: '2021', result: 'Best Print / Toys', tier: 'gold' },
      { year: '2020', result: 'Best / Smart watch for kids', tier: 'gold' },
      { year: '2018', result: 'Best Print / Packed in history', tier: 'gold' },
    ],
  },
  {
    name: 'IAB',
    location: 'LATAM',
    entries: [
      { year: '2017', result: 'Bronze — Uso Nativo del medio / No Gender Profile', tier: 'bronze' },
      { year: '2016', result: 'Silver — Campaign on Social Networks / Missing Tag', tier: 'silver' },
    ],
  },
  {
    name: 'Care Awards',
    location: 'GLOBAL',
    entries: [{ year: '2021', result: 'Jury — Print', tier: 'jury' }],
  },
  {
    name: 'FEPI',
    location: 'LATAM',
    entries: [
      { year: '2024', result: 'Jury — Campañas integrales', tier: 'jury' },
      { year: '2022', result: 'Jury — Innovación en medios', tier: 'jury' },
    ],
  },
  {
    name: 'Ad Forum PHNX',
    location: 'GLOBAL',
    entries: [
      { year: '2024', result: 'Jury', tier: 'jury' },
      { year: '2023', result: 'Jury', tier: 'jury' },
      { year: '2022', result: 'Jury', tier: 'jury' },
      { year: '2021', result: 'Jury', tier: 'jury' },
    ],
  },
  {
    name: 'Diente',
    location: 'ARGENTINA',
    entries: [
      { year: '2018', result: 'Honorable Mention — Design / Selfish box', tier: 'mention' },
      { year: '2017', result: 'Bronze — Promo and Activation & PR / No Gender Profile', tier: 'bronze' },
      { year: '2017', result: 'Honorable Mention — Interactive / No Gender Profile', tier: 'mention' },
    ],
  },
  {
    name: 'Premios Anda',
    entries: [{ year: '2026', result: 'Shortlist / Marsella - Nadie huele como tú', tier: 'shortlist' }],
  },
  {
    name: 'APAP',
    location: 'PERU',
    entries: [
      { year: '2026', result: 'Bronze — Film & Content (Film) / On Negocios - Dino', tier: 'bronze' },
      { year: '2026', result: 'Bronze — Craft & Production / On Negocios - Dino', tier: 'bronze' },
      { year: '2026', result: 'Shortlist — Dirección / On Negocios - Dino', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Postproducción / On Negocios - Dino', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Print / Indurama - Naturalmente fresco', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Craft y Producción / Win - Exorcista', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Craft y Producción / Cementos Yura - Construye con orgullo', tier: 'shortlist' },
      { year: '2026', result: 'Shortlist — Craft y Producción / Cementos Yura - Construye con orgullo', tier: 'shortlist' },
      { year: '2025', result: 'Bronze — Film', tier: 'bronze' },
    ],
  },
  {
    name: 'Effie Bolivia',
    location: 'BOLIVIA',
    entries: [{ year: '2026', result: 'Shortlist — Suministros Para el Hogar / Marsella - Nadie huele como tú', tier: 'shortlist' }],
  },
  {
    name: 'Effie Awards Peru',
    location: 'PERU',
    entries: [
      { year: '2026', result: 'Silver — Extensión de Línea / Win Tv', tier: 'silver' },
      { year: '2026', result: 'Silver — Éxito Sostenido / Win', tier: 'silver' },
      { year: '2026', result: 'Bronze — David y Goliat / Win Tv', tier: 'bronze' },
      { year: '2026', result: 'Bronze — Promoción de Servicios / Win - Exorcista', tier: 'bronze' },
      { year: '2026', result: 'Silver — Marketing Estacional / Win - Exorcista', tier: 'silver' },
      { year: '2026', result: 'Silver — Internet y Telecomunicaciones / Win - Exorcista', tier: 'silver' },
      { year: '2026', result: 'Shortlist — Innovación en el negocio / Marsella - Nadie huele como tú', tier: 'shortlist' },
    ],
  },
  {
    name: 'Cóndor',
    location: 'ECUADOR',
    entries: [
      { year: '2024', result: 'Bronze — Craft Photo / Open Late', tier: 'bronze' },
      { year: '2024', result: 'Shortlist — Radio / Lo Fried Beats', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Print and Publishing / Open Late', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Digital Craft / Nuggets Sound Test', tier: 'shortlist' },
      { year: '2024', result: 'Shortlist — Craft Audio / Nuggets Sound Test', tier: 'shortlist' },
      { year: '2023', result: 'Silver — Radio / Lo Fried Beats', tier: 'silver' },
      { year: '2023', result: 'Silver — Radio / Lo Fried Beats', tier: 'silver' },
      { year: '2023', result: 'Silver — PR / Paranormal Activity', tier: 'silver' },
      { year: '2023', result: 'Bronze — Digital / Paranormal Activity', tier: 'bronze' },
      { year: '2023', result: 'Bronze — Craft / Fried on the map', tier: 'bronze' },
      { year: '2023', result: 'Shortlist — Craft / Fried on the map', tier: 'shortlist' },
      { year: '2023', result: 'Shortlist — Craft / Paranormal Icetivity', tier: 'shortlist' },
      { year: '2018', result: 'Silver — Print and Publishing / Terrified Posters', tier: 'silver' },
      { year: '2018', result: 'Bronze — Craft / Terrified Posters', tier: 'bronze' },
    ],
  },
  {
    name: 'LUX',
    location: 'ECUADOR',
    entries: [
      { year: '2019', result: 'Silver — Direct / The Cheering Trophy', tier: 'silver' },
      { year: '2019', result: 'Bronze — The Cheering Trophy', tier: 'bronze' },
      { year: '2019', result: 'Shortlist — Craft music / Discover extralike', tier: 'shortlist' },
      { year: '2018', result: 'Shortlist — Outdoor / Terrified Posters', tier: 'shortlist' },
      { year: '2018', result: 'Shortlist — Print Craft / Terrified Posters', tier: 'shortlist' },
    ],
  },
  {
    name: 'Punto 99 Awards',
    location: 'ECUADOR',
    entries: [{ year: '2023', result: 'Best Creative', tier: 'gold' }],
  },
  {
    name: 'BenditaCarpeta',
    location: 'LATAM',
    entries: [
      { year: '2017', result: 'Tercer Lugar del Mundial Creativo', tier: 'bronze' },
      { year: '2016', result: 'Dupla ganadora del Mundial Creativo', tier: 'gold' },
    ],
  },
];

export const EXPERIENCES = [
  {
    role: 'Group Creative Director',
    company: 'GUT',
    period: 'Now',
    location: 'CDMX - México',
  },
  {
    role: 'Creative Director',
    company: 'Lemon The Agency',
    period: '2025',
    location: 'Lima - Peru',
  },
  {
    role: 'Creative Director',
    company: 'Punto 99',
    period: '2023 - 2024',
    location: 'Quito - Ecuador',
  },
  {
    role: 'Creative Director',
    company: 'Don',
    period: '2022 - 2023',
    location: 'Buenos Aires - Argentina',
  },
  {
    role: 'Sr. Copywriter',
    company: 'Wunderman Thompson',
    period: '2019',
    location: 'Santiago - Chile',
  },
  {
    role: 'Creative Director',
    company: 'Mullen Lowe',
    period: '2018 - 2019',
    location: 'Quito - Ecuador',
  },
  {
    role: 'Sr. Copywriter',
    company: 'Publicis',
    period: '2017 - 2018',
    location: 'São Paulo - Brazil',
  },
  {
    role: 'Sr. Copywriter',
    company: 'DPZ&T',
    period: '2017 - 2018',
    location: 'São Paulo - Brazil',
  },
  {
    role: 'Sr Copywriter',
    company: 'Wunderman',
    period: '2015 - 2017',
    location: 'Buenos Aires - Argentina',
  },
  {
    role: 'Jr Copywriter',
    company: 'Tribal DDB',
    period: '2013 - 2015',
    location: 'Buenos Aires - Argentina',
  },
];


export { logo, searchImage };
