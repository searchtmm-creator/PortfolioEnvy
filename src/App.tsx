import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useScroll, useVelocity, motion, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Award, Terminal, User, Briefcase, Folder, ArrowDown } from 'lucide-react';
import { playSound } from './services/sound';

// Import Dino project assets
import dinoPortada from './assets/dino/Dinoportada.jpg';
import dino1 from './assets/dino/Dino 1.png';
import dino2 from './assets/dino/Dino 2.png';
import dino3 from './assets/dino/dino 3.gif';
import dino4 from './assets/dino/Dino 4.gif';
import dino5 from './assets/dino/Dino 5.gif';

// Import win tv project assets
import wtPortada from './assets/wintv/WintvPortada.jpg';
import wt1 from './assets/wintv/wintv_1.png';
import wt2 from './assets/wintv/wintv_2.png';
import wt3 from './assets/wintv/wintv_3.png';
import wt4 from './assets/wintv/wintv_4.png';
import wt5 from './assets/wintv/wintv_5.gif';
import wt6 from './assets/wintv/wintv_6.png';
import wt7 from './assets/wintv/wintv_7.png';
import wt8 from './assets/wintv/wintv_8.png';
import wt9 from './assets/wintv/wintv_9.png';
import wt10 from './assets/wintv/wintv_10.gif';
import wt11 from './assets/wintv/wintv_11.jpg';
import wt12 from './assets/wintv/wintv_12.jpg';

// Import Lo-Fried Beats project assets
import lofried1 from './assets/lofried/lo-fried_1.gif';
import lofried2 from './assets/lofried/lo-fried_2.png';
import lofried3 from './assets/lofried/lo-fried_3.png';

// Import Open Late project assets
import openlate1 from './assets/openlate/openlate1.png';
import openlate2 from './assets/openlate/openlate2.png';
import openlate3 from './assets/openlate/openlate3.png';
import openlate4 from './assets/openlate/openlate4.jpg';
import openlate5 from './assets/openlate/openlate5.jpg';
import openlate6 from './assets/openlate/openlate6.jpg';

// Import Copa / Cheering Trophy project assets
import copa1 from './assets/copa/copa1.jpg';
import copa2 from './assets/copa/copa2.gif';
import copaPortada from './assets/copa/copaportada.jpg';

// Import Dedos Llenos project assets
import dedos1 from './assets/Dedos/dedos1.jpg';
import dedos2 from './assets/Dedos/dedos2.png';
import dedos3 from './assets/Dedos/dedos3.png';
import dedos4 from './assets/Dedos/dedos4.png';
import dedos5 from './assets/Dedos/dedos5.png';

// Import Sunstats project assets
import sun1 from './assets/sunstats/sun1.jpg';
import sun2 from './assets/sunstats/sun2.jpg';
import sun3 from './assets/sunstats/sun3.jpg';
import sun4 from './assets/sunstats/sun4.jpg';
import sun5 from './assets/sunstats/sun5.jpg';
import sun6 from './assets/sunstats/sun6.jpg';
import sun7 from './assets/sunstats/sun7.jpg';

// Import Exorcist project assets
import exorcistPortada from './assets/exorcist/exorcistportada.jpg';
import exorcist1 from './assets/exorcist/exorcist1.jpg';
import exorcist2 from './assets/exorcist/exorcist2.jpg';
import exorcist3 from './assets/exorcist/exorcist3.jpg';
import exorcist4 from './assets/exorcist/exorcist4.jpg';
import exorcist5 from './assets/exorcist/exorcist5.avif';

// Import Muvid project assets
import muvidPortada from './assets/muvid/muvidportada.jpg';
import muvid1 from './assets/muvid/muvid1.gif';
import muvid2 from './assets/muvid/muvid2.jpg';

// Import Floating logo
import logo from './assets/logoSA.svg';
import searchImage from './assets/search.jpg';
import { EnvyEngine } from './services/EnvyEngine';

// Lazy load the EnvyMeterWidget to defer loading of MediaPipe models and WASM
const EnvyMeterWidget = React.lazy(() =>
  import('./components/EnvyMeterWidget').then((module) => ({ default: module.EnvyMeterWidget }))
);

// 9 Creative Director Projects of Sergio Alzate
const projects = [
  { "id": 18, "title": "THE CHROME DINO", "category": "On Negocios // Film & Content", "year": "2026", "slug": "dino-on-negocios", "images": [dinoPortada, dino1, dino2, dino3, dino4, dino5], "video": "https://player.vimeo.com/video/1176753029", "rollover": "View the film" },
  { "id": 1, "title": "ENTERTAINMENT + SOCCER", "category": "WinTv // Film & Content", "year": "2025", "slug": "wintv", "images": [wtPortada, wt1, wt2, wt3, wt4, wt5, wt6, wt7, wt8, wt9, wt10, wt11, wt12], "video": "https://player.vimeo.com/video/1069358927", "rollover": "View the film" },
  { "id": 2, "title": "LOFRIED BEATS", "category": "KFC // Sound & Content", "year": "2023", "slug": "lo-friedbeats", "images": [lofried1, lofried2, lofried3], "video": "https://player.vimeo.com/video/1007819738", "rollover": "View the case" },
  { "id": 3, "title": "OPEN LATE", "category": "KFC // Print & OOH", "year": "2024", "slug": "open-late", "images": [openlate3, openlate1, openlate2, openlate4, openlate5, openlate6], "video": "", "rollover": "View the prints" },
  { "id": 4, "title": "THE CHEERING TROPHY", "category": "Banco Pichincha // Innovation & PR", "year": "2019", "slug": "the-cheering-trophy", "images": [copaPortada, copa1, copa2], "video": "https://player.vimeo.com/video/386616077", "rollover": "View the film" },
  { "id": 6, "title": "SUN STATS", "category": "KFC // Print & OOH", "year": "2024", "slug": "sun-stats", "images": [sun2, sun1, sun3, sun4, sun5, sun6, sun7], "video": "", "rollover": "View the Prints" },
  { "id": 5, "title": "FINGERS FULL OF FUN", "category": "Cheetos // Film & Content", "year": "2023", "slug": "dedos-llenos", "images": [dedos2, dedos1, dedos3, dedos4, dedos5], "video": "", "rollover": "View the film" },
  { "id": 7, "title": "EXORCIST", "category": "Win // Content", "year": "2025", "slug": "win-exorcist", "images": [exorcistPortada, exorcist1, exorcist2, exorcist3, exorcist4, exorcist5], "video": "https://player.vimeo.com/video/1131961594", "rollover": "View the film" },
  { "id": 9, "title": "MUSIC VIDEO FESTIVAL", "category": "Win // Content", "year": "2025", "slug": "muvid", "images": [muvidPortada, muvid1, muvid2], "video": "https://player.vimeo.com/video/1204577123", "rollover": "View the film" }
];

// Bento span pattern — custom brutalist layout with no 1x1 boxes (small boxes are now larger).
// 3 stellar projects are scaled to 2x2. Other projects use 2x1 (wide) or 1x2 (tall).
const BENTO_PATTERN = [
  'col-span-1 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2', // 0 — Dino (Tall Vertical / Square)
  'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 1 — WinTV (Wide Horizontal)
  'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 2 — Lo-Fried Beats (Wide Horizontal)
  'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 3 — Open Late (Wide Horizontal)
  'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 4 — Cheering Trophy (Wide Horizontal)
  'col-span-1 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2', // 5 — Dedos Llenos (Tall Vertical / Square)
  'col-span-1 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2', // 6 — Sunstats (Tall Vertical / Square)
  'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 7 — Exorcist (Wide Horizontal)
  'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-4 lg:row-span-1', // 8 — Muvid (Wide Horizontal)
];

// Industrial Precision Crosshair Decorator
const Crosshair: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    initial={{ scale: 0, rotate: -45 }}
    whileInView={{ scale: 1, rotate: 0 }}
    viewport={{ once: false, amount: 0.1 }}
    transition={{ type: "spring", stiffness: 80, damping: 12 }}
    className={`absolute w-3 h-3 pointer-events-none z-10 ${className}`}
  >
    <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-zinc-800 group-hover:bg-brand-orange transition-colors" />
    <div className="absolute left-1.5 top-0 bottom-0 w-[1px] bg-zinc-800 group-hover:bg-brand-orange transition-colors" />
  </motion.div>
);

// Nav link with a thin orange bar that sweeps in left→right on hover.
const NavLink: React.FC<{ href: string; label: string; onHover?: () => void }> = ({
  href,
  label,
  onHover,
}) => (
  <a
    href={href}
    onMouseEnter={onHover}
    className="group/nav relative py-1 text-zinc-400 hover:text-brand-orange transition-colors duration-300"
  >
    {label}
    <span className="absolute left-0 -top-0.5 h-[2px] w-0 bg-brand-orange transition-all duration-300 ease-out group-hover/nav:w-full" />
  </a>
);

// Procedural SVG thumbnails matching the project names (Neo-Brutalist & high-contrast)
const ProjectThumbnail: React.FC<{ id: number }> = ({ id }) => {
  if (id === 1) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange/30 transition-colors duration-300" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <circle cx="50" cy="50" r="28" fill="none" className="stroke-zinc-800 group-hover:stroke-cyan-400 transition-colors duration-500" strokeWidth="1" />
        <line x1="10" y1="10" x2="90" y2="90" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === 2) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="12" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1" />
        <circle cx="50" cy="50" r="22" fill="none" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1" />
        <circle cx="50" cy="50" r="32" fill="none" className="stroke-zinc-700 group-hover:stroke-rose-500 transition-colors duration-500" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="42" fill="none" className="stroke-zinc-600 group-hover:stroke-purple-500 transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 3) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300 font-mono text-[9px] fill-zinc-900 group-hover:fill-emerald-400 transition-all duration-500" viewBox="0 0 100 100">
        <text x="5" y="18">01100101</text>
        <text x="5" y="38">11011001</text>
        <text x="5" y="58">00100101</text>
        <text x="5" y="78">10110011</text>
        <text x="50" y="28">10011011</text>
        <text x="50" y="48">00110001</text>
        <text x="50" y="68">11001110</text>
        <text x="50" y="88">01011011</text>
      </svg>
    );
  }
  if (id === 4) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <path d="M10,15 L35,15 L55,35 L55,65 L75,85 L90,85" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <path d="M10,85 L35,85 L55,65 L80,65 L90,55" fill="none" className="stroke-zinc-800 group-hover:stroke-yellow-400 transition-colors duration-500" strokeWidth="1" />
        <circle cx="55" cy="35" r="4" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <circle cx="55" cy="65" r="4" className="fill-zinc-800 group-hover:fill-yellow-400 transition-colors duration-500" />
      </svg>
    );
  }
  if (id === 5) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <line x1="-10" y1="20" x2="30" y2="-20" className="stroke-zinc-900 group-hover:stroke-pink-500 transition-colors duration-500" strokeWidth="6" />
        <line x1="10" y1="40" x2="50" y2="0" className="stroke-zinc-800 group-hover:stroke-pink-500 transition-colors duration-500" strokeWidth="6" />
        <line x1="30" y1="60" x2="70" y2="20" className="stroke-zinc-800 group-hover:stroke-pink-500 transition-colors duration-500" strokeWidth="6" />
        <line x1="50" y1="80" x2="90" y2="40" className="stroke-zinc-700 group-hover:stroke-pink-500 transition-colors duration-500" strokeWidth="6" />
        <line x1="70" y1="100" x2="110" y2="60" className="stroke-zinc-700 group-hover:stroke-pink-500 transition-colors duration-500" strokeWidth="6" />
      </svg>
    );
  }
  if (id === 6) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="10" y="65" width="10" height="35" className="fill-zinc-900 group-hover:fill-brand-orange transition-colors duration-500" />
        <rect x="25" y="50" width="10" height="50" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <rect x="40" y="35" width="10" height="65" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <rect x="55" y="55" width="10" height="45" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <rect x="70" y="25" width="10" height="75" className="fill-zinc-700 group-hover:fill-cyan-400 transition-colors duration-500" />
        <rect x="85" y="10" width="10" height="90" className="fill-zinc-700 group-hover:fill-cyan-400 transition-colors duration-500" />
      </svg>
    );
  }
  if (id === 7) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <path d="M12,50 L42,20 L42,38 L88,38 L88,62 L42,62 L42,80 Z" className="fill-zinc-900 group-hover:fill-brand-orange transition-all duration-500" />
      </svg>
    );
  }
  if (id === 8) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <line x1="50" y1="40" x2="0" y2="100" className="stroke-zinc-900 group-hover:stroke-purple-500 transition-colors duration-500" strokeWidth="1" />
        <line x1="50" y1="40" x2="33" y2="100" className="stroke-zinc-900 group-hover:stroke-purple-500 transition-colors duration-500" strokeWidth="1" />
        <line x1="50" y1="40" x2="66" y2="100" className="stroke-zinc-900 group-hover:stroke-purple-500 transition-colors duration-500" strokeWidth="1" />
        <line x1="50" y1="40" x2="100" y2="100" className="stroke-zinc-900 group-hover:stroke-purple-500 transition-colors duration-500" strokeWidth="1" />
        <line x1="0" y1="65" x2="100" y2="65" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="100" y2="80" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1" />
        <line x1="0" y1="92" x2="100" y2="92" className="stroke-zinc-700 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === 9) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <polygon points="12,12 88,22 78,78 28,68" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <polygon points="22,32 68,42 48,88 18,58" className="fill-none stroke-zinc-800 group-hover:stroke-cyan-400 transition-colors duration-500" strokeWidth="1" />
      </svg>
    );
  }
  if (id === 10) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="28" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="12" />
        <circle cx="50" cy="50" r="28" fill="none" className="stroke-zinc-800 group-hover:stroke-white transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 11) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <circle cx="35" cy="65" r="10" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <circle cx="65" cy="35" r="10" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <line x1="35" y1="65" x2="65" y2="35" className="stroke-zinc-800 group-hover:stroke-cyan-500 transition-colors duration-500" strokeWidth="4" />
        <line x1="35" y1="65" x2="65" y2="35" className="stroke-zinc-950" strokeWidth="1" />
      </svg>
    );
  }
  if (id === 12) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="75" className="stroke-zinc-800 group-hover:stroke-cyan-500 transition-colors duration-500" strokeWidth="1.5" />
        <line x1="25" y1="50" x2="75" y2="50" className="stroke-zinc-800 group-hover:stroke-cyan-500 transition-colors duration-500" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="8" className="fill-none stroke-zinc-700 group-hover:stroke-rose-500 transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 13) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <text x="15" y="65" className="font-mono text-5xl font-black fill-zinc-900 group-hover:fill-brand-orange transition-colors duration-500">Aa</text>
        <line x1="10" y1="75" x2="90" y2="75" className="stroke-zinc-800 group-hover:stroke-cyan-500 transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 14) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <path d="M20,70 L50,30 L80,70 Z" fill="none" className="stroke-zinc-900 group-hover:stroke-yellow-400 transition-colors duration-500" strokeWidth="2.5" />
        <path d="M50,30 C50,20 60,20 60,30" fill="none" className="stroke-zinc-800 group-hover:stroke-yellow-400 transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 15) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <path d="M15,85 Q50,15 85,85" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
        <polygon points="85,85 75,75 80,70" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <circle cx="50" cy="50" r="3" className="fill-zinc-700 group-hover:fill-cyan-400 transition-colors duration-500" />
      </svg>
    );
  }
  if (id === 16) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="4" className="fill-none stroke-zinc-900 group-hover:stroke-white transition-colors duration-500" strokeWidth="2" />
        <circle cx="35" cy="35" r="5" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <circle cx="65" cy="35" r="5" className="fill-zinc-800 group-hover:fill-brand-orange transition-colors duration-500" />
        <line x1="30" y1="60" x2="70" y2="60" className="stroke-zinc-800 group-hover:stroke-cyan-500 transition-colors duration-500" strokeWidth="3" />
      </svg>
    );
  }
  if (id === 17) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <line x1="20" y1="50" x2="20" y2="80" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="4" />
        <line x1="35" y1="30" x2="35" y2="80" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="4" />
        <line x1="50" y1="15" x2="50" y2="85" className="stroke-zinc-700 group-hover:stroke-cyan-400 transition-colors duration-500" strokeWidth="4" />
        <line x1="65" y1="40" x2="65" y2="80" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="4" />
        <line x1="80" y1="55" x2="80" y2="80" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="4" />
      </svg>
    );
  }
  if (id === 18) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" rx="2" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2.5" />
        <circle cx="40" cy="45" r="4" className="fill-zinc-800 group-hover:fill-white transition-colors duration-500" />
        <path d="M 35 60 Q 50 70 65 60" fill="none" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 19) {
    return (
      <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="28" fill="none" className="stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="12" />
        <circle cx="50" cy="50" r="12" fill="none" className="stroke-zinc-800 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className="w-full h-full bg-zinc-950 transition-colors duration-300" viewBox="0 0 100 100">
      <rect x="15" y="15" width="22" height="22" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1.5" />
      <rect x="63" y="15" width="22" height="22" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1.5" />
      <rect x="39" y="63" width="22" height="22" className="fill-none stroke-zinc-900 group-hover:stroke-brand-orange transition-colors duration-500" strokeWidth="1.5" />
    </svg>
  );
};

// In `bw` mode the art renders in black & white and bursts into colour on hover.
const ProjectMedia: React.FC<{ id: number; image?: string; bw?: boolean }> = ({
  id,
  image,
  bw = false,
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;
  const imgClass = `absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
    bw ? 'filter grayscale group-hover:grayscale-0' : ''
  }`;
  return (
    <div className="relative w-full h-full bg-zinc-950">
      {/* SVG procedural fallback always painted underneath; covered by the
          real image once it arrives so there's never a blank box. */}
      <div className="absolute inset-0">
        <ProjectThumbnail id={id} />
      </div>
      {showImage && (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className={imgClass}
        />
      )}
    </div>
  );
};

// ─── AWARDS DATA ─────────────────────────────────────────────────────────────
// Every recognition, grouped by festival. Each entry is {year, result} where
// `result` already encodes the medal/level + category + project, exactly as
// logged in the source list. `tier` drives the colour of the medal chip.
type Tier = 'gold' | 'silver' | 'bronze' | 'shortlist' | 'jury' | 'mention' | 'feature' | 'other';

interface AwardEntry {
  year: string;
  result: string;
  tier: Tier;
}

interface Festival {
  name: string;
  location?: string;
  entries: AwardEntry[];
}

const AWARDS_DATA: Festival[] = [
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
    name: 'Best Ads of TV',
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
    name: 'APAP',
    location: 'PERU',
    entries: [{ year: '2025', result: 'Bronze — Film', tier: 'bronze' }],
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

const TIER_META: Record<Tier, { label: string; chip: string; dot: string }> = {
  gold: { label: 'GOLD', chip: 'bg-brand-orange text-brand-black font-black', dot: 'bg-brand-orange' },
  silver: { label: 'SILVER', chip: 'bg-brand-white text-brand-black font-black', dot: 'bg-brand-white' },
  bronze: { label: 'BRONZE', chip: 'bg-brand-offwhite text-brand-black font-black', dot: 'bg-brand-offwhite' },
  shortlist: { label: 'SHORTLIST', chip: 'bg-brand-charcoal border border-brand-offwhite/25 text-brand-offwhite font-bold', dot: 'bg-brand-offwhite/60' },
  jury: { label: 'JURY', chip: 'bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-bold', dot: 'bg-brand-orange' },
  mention: { label: 'MENTION', chip: 'bg-brand-charcoal border border-zinc-800 text-zinc-400', dot: 'bg-zinc-500' },
  feature: { label: 'FEATURE', chip: 'bg-brand-white/10 border border-brand-white/20 text-brand-white font-bold', dot: 'bg-brand-white' },
  other: { label: 'OTHER', chip: 'bg-brand-charcoal/50 border border-zinc-800/40 text-zinc-500', dot: 'bg-zinc-700' },
};

// Collapsible festival accordion. Header shows the festival name, location and
// a count of entries; the body lists every recognition with a tier chip.
const AwardAccordion: React.FC<{
  festival: Festival;
  defaultOpen?: boolean;
  onToggle?: () => void;
}> = ({ festival, defaultOpen = false, onToggle }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-900 bg-black/40">
      <button
        onClick={() => {
          setOpen((o) => !o);
          onToggle?.();
        }}
        className="group/acc w-full flex items-center justify-between gap-4 px-4 md:px-5 py-4 text-left hover:bg-zinc-950 transition-colors duration-300"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <span className="font-mono text-[10px] text-zinc-600 hidden sm:inline">
            {String(festival.entries.length).padStart(2, '0')}
          </span>
          <span className="font-black text-base md:text-xl uppercase tracking-tight truncate group-hover/acc:text-brand-orange transition-colors duration-300">
            {festival.name}
          </span>
          {festival.location && (
            <span className="hidden md:inline font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              {festival.location}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Medal summary dots */}
          <div className="hidden sm:flex items-center gap-1">
            {Object.entries(
              festival.entries.reduce<Record<string, number>>((acc, e) => {
                acc[e.tier] = (acc[e.tier] ?? 0) + 1;
                return acc;
              }, {}),
            ).map(([tier, count]) => (
              <span key={tier} className="flex items-center gap-1" title={`${TIER_META[tier as Tier].label} ×${count}`}>
                <span className={`w-1.5 h-1.5 ${TIER_META[tier as Tier].dot}`} />
                <span className="font-mono text-[9px] text-zinc-500">{count}</span>
              </span>
            ))}
          </div>
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-brand-orange text-lg leading-none"
          >
            ›
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 pt-1 border-t border-zinc-900 divide-y divide-zinc-950">
              {festival.entries.map((entry, i) => {
                const meta = TIER_META[entry.tier];
                return (
                  <div key={i} className="flex items-center gap-3 md:gap-4 py-3 font-mono text-[11px] md:text-xs">
                    <span className={`px-1.5 py-0.5 text-[8px] md:text-[9px] font-bold tracking-widest ${meta.chip} shrink-0`}>
                      {meta.label}
                    </span>
                    <span className="text-zinc-600 w-10 shrink-0">{entry.year}</span>
                    <span className="text-zinc-300 flex-1 min-w-0">{entry.result}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BIOGRAPHY_TEXT = "I’M SERGIO ALZATE, BORN IN ECUADOR, AND I LIKE TO DEFINE MYSELF AS A CREATIVE COOKER WITH A PART MAKER, ANOTHER SAMPLER, AND THE REST... WELL, I’M STILL LEARNING THE REST.";
const bioWords = BIOGRAPHY_TEXT.split(" ");

const EXPERIENCES = [
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

interface WordKeyedProps {
  word: string;
  index: number;
  progress: number;
  total: number;
}

const WordKeyed: React.FC<WordKeyedProps> = ({ word, index, progress, total }) => {
  const start = index / total;
  const end = Math.min(1, (index + 1.2) / total);
  
  const wordProgress = progress > end
    ? 1
    : (progress < start ? 0 : (progress - start) / (end - start));
  
  const r = Math.round(255 - 255 * wordProgress);
  const g = Math.round(255 - 255 * wordProgress);
  const b = Math.round(255 - 255 * wordProgress);
  const textColor = `rgb(${r}, ${g}, ${b})`;
  
  const bgOpacity = wordProgress;
  const backgroundColor = `rgba(206, 254, 70, ${bgOpacity})`;
  
  return (
    <span
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
      }}
      className="py-1 inline"
    >
      {word}{index < total - 1 ? " " : ""}
    </span>
  );
};

const ScrollBiography: React.FC = () => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startY = windowHeight * 0.80;
      const endY = windowHeight * 0.30;
      const currentY = rect.top;
      
      const p = currentY > startY
        ? 0
        : (currentY < endY ? 1 : (startY - currentY) / (startY - endY));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Initial call to set correct progress on mount
    handleScroll();
    
    // Additional deferred execution check to capture correct coordinates after layout shifts
    const timer = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <h2 ref={containerRef} className="font-black text-2xl md:text-3xl uppercase tracking-tighter mb-8 font-mono text-white leading-relaxed">
      {bioWords.map((word, i) => (
        <WordKeyed key={i} word={word} index={i} progress={progress} total={bioWords.length} />
      ))}
    </h2>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Clear envy history and viewed status on page load (refresh)
  useEffect(() => {
    projects.forEach((p) => {
      localStorage.removeItem(`envy-project-${p.id}`);
      localStorage.removeItem(`envy-project-viewed-${p.id}`);
    });
  }, []);

  const [isBooted, setIsBooted] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('skipPreloader') === 'true' || params.get('autoActivateScanner') === 'true';
  });
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const isScannerLoaded = true;
  const [envyScore, setEnvyScore] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isWidgetInfoOpen, setIsWidgetInfoOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSearchWidget, setShowSearchWidget] = useState(true);
  
  // Parallax Scroll Tracking
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroMarqueeY = useTransform(scrollY, [0, 800], [0, 80]);


  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string>('');

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleModalScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      EnvyEngine.getInstance().triggerScrollStopBoost();
    }, 450);
  };

  // Clear timeout on project change
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedProject]);

  // Listen for 'Escape' key to close active project details drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (selectedProject) {
          playSound('click', isMuted);
          setSelectedProject(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, isMuted]);

  // Scroll tracking state to animate floating logo top position
  const [logoTop, setLogoTop] = useState<number>(60);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const updateLogoPosition = () => {
      const scrollYVal = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      
      const isMobile = window.innerWidth < 768;
      
      // Align with the header's S_A // CD.01 text vertical center (pt-6 = 24px + text/2 = 32px)
      const topStart = 32;
      const centerPos = viewportHeight / 2;
      
      const footerEl = document.getElementById('footer-links');
      
      // Calculate baseline position (start to center transition)
      let currentBase = centerPos;
      if (scrollYVal < 300) {
        const progress = scrollYVal / 300;
        currentBase = topStart + (centerPos - topStart) * progress;
      }
      
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        // Target: logo center sits inside the top padding of the footer-links container
        const targetFooterTop = footerRect.top + (isMobile ? 20 : 24);
        
        const maxScroll = scrollHeight - viewportHeight;
        const distanceToBottom = Math.max(0, maxScroll - scrollYVal);
        
        const transitionZone = 400; // start moving down in the last 400px of scroll
        if (distanceToBottom < transitionZone && maxScroll > 300) {
          // Calculate interpolation progress (0 when 400px away, 1 when at bottom)
          const progress = (transitionZone - distanceToBottom) / transitionZone;
          const clampedProgress = Math.min(1, Math.max(0, progress));
          
          // Interpolate from currentBase to targetFooterTop
          setLogoTop(currentBase + (targetFooterTop - currentBase) * clampedProgress);
          return;
        }
      }
      
      setLogoTop(currentBase);
    };
    
    window.addEventListener('scroll', updateLogoPosition);
    window.addEventListener('resize', updateLogoPosition);
    // Run initially to set the right starting position
    updateLogoPosition();
    
    // Run deferred once to make sure layout has finished shifting
    const timer = setTimeout(updateLogoPosition, 100);
    
    return () => {
      window.removeEventListener('scroll', updateLogoPosition);
      window.removeEventListener('resize', updateLogoPosition);
      clearTimeout(timer);
    };
  }, []);

  // Viewed projects tracking (starts clean on every page load)
  const [viewedProjects, setViewedProjects] = useState<Record<number, boolean>>({});

  // Helper to open project drawer and mark as viewed
  const handleSelectProject = (project: typeof projects[0]) => {
    playSound('click', isMuted);
    setSelectedProject(project);
    if (!viewedProjects[project.id]) {
      const updated = { ...viewedProjects, [project.id]: true };
      setViewedProjects(updated);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`envy-project-viewed-${project.id}`, 'true');
      }
    }
  };

  // Spring-physics based custom cursor coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSpringConfig = { stiffness: 450, damping: 28, mass: 0.2 };
  const cursorSpringX = useSpring(cursorX, cursorSpringConfig);
  const cursorSpringY = useSpring(cursorY, cursorSpringConfig);
  
  // Real-time project reaction peak tracker (starts clean on every page load)
  const [projectPeaks, setProjectPeaks] = useState<Record<number, number>>({});

  // Custom magnetic cursor states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<'default' | 'hovering' | 'glitch'>('default');

  // Velocity-based scroll animation
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollVelocity = useVelocity(scrollY);

  // Glitch state calculations
  const isGlitching = false;

  // Simulated Boot Loader Diagnostics sequence
  useEffect(() => {
    const sequences = [
      'INITIALIZING ENVY-METER PROTOCOLS...',
      'SYSTEM CHECK: WASM STACK RESOLVER DEPLOYED.',
      'ASSET LINKED: FACELANDMARKER STACK IN Standby.',
      'STITCH CONFIG: COLOR BASE METRICS INITIALIZED (#121212, #FFFFFF, #CEFE46).',
      'RAMI VOSS GRID SYSTEM BUILT.',
      'DIAGNOSTIC STATUS: READY FOR HOSTILE AGENTS.',
    ];
    let index = 0;
    let autoBootTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      if (index < sequences.length) {
        setBootLogs((prev) => [...prev, `> ${sequences[index]}`]);
        index++;
      } else {
        clearInterval(interval);
        autoBootTimer = setTimeout(() => {
          setIsBooted(true);
        }, 600);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      if (autoBootTimer) clearTimeout(autoBootTimer);
    };
  }, []);

  // Custom Magnetic Cursor coordinates tracking
  useEffect(() => {
    if (!isBooted) return;

    const handleMouseMove = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      let isHovering = false;
      let isProjectCard = false;
      let targetX = e.clientX;
      let targetY = e.clientY;
      let customLabel = '';

      while (target) {
        if (target.getAttribute && target.getAttribute('data-cursor-label')) {
          customLabel = target.getAttribute('data-cursor-label') || '';
          isHovering = true;
          if (target.classList && target.classList.contains('magnetic-target')) {
            const rect = target.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
          break;
        }
        if (target.id && target.id.startsWith('project-')) {
          isProjectCard = true;
          isHovering = true;
          break;
        }
        if (
          target.classList &&
          (target.classList.contains('magnetic-target') ||
            target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            target.getAttribute('role') === 'button')
        ) {
          isHovering = true;
          if (target.classList.contains('magnetic-target')) {
            const rect = target.getBoundingClientRect();
            // Snap to the horizontal and vertical center of the element
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
          }
          break;
        }
        target = target.parentElement;
      }

      setMousePos({ x: targetX, y: targetY });
      cursorX.set(targetX);
      cursorY.set(targetY);
      
      if (isGlitching) {
        setCursorState('glitch');
        setCursorLabel('');
      } else {
        setCursorState(isHovering ? 'hovering' : 'default');
        setCursorLabel(customLabel || (isProjectCard ? '[ VIEW ]' : ''));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isBooted, isGlitching, cursorX, cursorY]);

  // Adjust cursor state immediately when glitch level switches
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (isGlitching) {
        setCursorState('glitch');
      } else {
        setCursorState('default');
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [isGlitching]);

  // Permanently close the explanation callout once the scanner is activated
  useEffect(() => {
    if (isScannerActive) {
      const frameId = requestAnimationFrame(() => {
        setShowExplanation(false);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [isScannerActive]);

  // Reset EnvyEngine score state whenever a project is opened or closed
  // to ensure independent measurement starting from scratch
  useEffect(() => {
    EnvyEngine.getInstance().reset();
  }, [selectedProject]);

  // Track envy score for the currently selected project (independent measurement)
  useEffect(() => {
    if (selectedProject && envyScore !== null) {
      const currentPeak = projectPeaks[selectedProject.id] ?? 1.0;
      if (envyScore > currentPeak) {
        const frameId = requestAnimationFrame(() => {
          setProjectPeaks((prev) => {
            const updated = { ...prev, [selectedProject.id]: envyScore };
            localStorage.setItem(`envy-project-${selectedProject.id}`, envyScore.toFixed(1));
            return updated;
          });
        });
        return () => cancelAnimationFrame(frameId);
      }
    }
  }, [envyScore, selectedProject, projectPeaks, isMuted]);

  // Horizontal Awards Marquee Scroll-Velocity Throttle
  useEffect(() => {
    return scrollVelocity.on('change', (latest) => {
      const absVelocity = Math.abs(latest);
      // Map absolute scrolling velocity to CSS animation duration (from 25s down to 1s)
      const duration = Math.max(1, 25 - absVelocity / 180);
      if (marqueeRef.current) {
        marqueeRef.current.style.setProperty('--marquee-duration', `${duration}s`);
      }
    });
  }, [scrollVelocity]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // Handlers
  const handleScoreChange = (score: number | null) => {
    setEnvyScore(score);
  };

  // Calculate average envy score across visited projects (default to 1.0 if none visited)
  const visitedProjects = projects.filter((p) => projectPeaks[p.id] !== undefined);
  const averageEnvyScore = visitedProjects.length > 0
    ? visitedProjects.reduce((sum, p) => sum + projectPeaks[p.id], 0) / visitedProjects.length
    : 1.0;

  // Map active envy score (live for current project, average for home screen) to UI intensity
  const activeEnvyForIntensity = selectedProject ? envyScore : averageEnvyScore;
  const envIntensity = activeEnvyForIntensity === null ? 0 : Math.min(1, Math.max(0, (activeEnvyForIntensity - 3.8) / 5.9));

  const containerStyle = {
    '--envy-skew': '0deg',
    '--envy-letter-spacing': '0em',
    '--envy-scale-x': '1',
    '--envy-glow': '0',
    '--envy-intensity': '0',
  } as React.CSSProperties;

  // Preloader Screen Render
  if (!isBooted) {
    const progress = Math.min(100, Math.round((bootLogs.length / 6) * 100));
    const blockCount = Math.round((bootLogs.length / 6) * 12);
    const progressBar = '█'.repeat(blockCount) + '░'.repeat(12 - blockCount);

    return (
      <div className="fixed inset-0 bg-black z-[999] flex flex-col justify-between p-8 md:p-16 lg:p-24 font-mono select-none overflow-hidden relative">
        {/* Spotlight ambient orange glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none z-0" />
        
        {/* Dynamic Film Grain texture overlay */}
        <div className="film-grain-container" />

        {/* Rotating BIOMETRIC HUD Reticle background */}
        <div className="absolute right-12 bottom-12 md:right-24 md:bottom-24 w-64 h-64 md:w-96 md:h-96 pointer-events-none opacity-[0.05] z-0 animate-[spin_30s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-brand-orange fill-none" strokeWidth="0.5">
            <circle cx="50" cy="50" r="46" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="32" />
            <circle cx="50" cy="50" r="18" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="4" fill="currentColor" className="text-brand-orange" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
          </svg>
        </div>

        {/* Large watermark-like technical title */}
        <div className="absolute top-12 right-12 text-right opacity-[0.04] z-0 pointer-events-none select-none hidden md:block">
          <div className="font-black text-6xl lg:text-8xl leading-none text-stroke-white tracking-tighter">
            INIT_STK
          </div>
          <div className="text-[10px] tracking-widest mt-2 font-mono">
            SYS_BOOT_LOADER // CDMX.LIMA.PERU
          </div>
        </div>

        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-6 z-10">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-brand-orange animate-pulse" />
            <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-zinc-400">
              SERGIO ALZATE // BIOMETRIC SYSTEM BOOT v1.0
            </span>
          </div>
          <div className="text-[9px] text-zinc-600 hidden md:block">
            TIME_LNK: {new Date().toISOString().substring(11, 19)} UTC
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-2xl w-full my-auto z-10 relative">
          <div className="mb-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
              STATUS CALIBRATION
            </span>
            <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tighter text-white">
              {progress < 100 ? 'System Booting...' : 'Diagnostics Clear.'}
            </h1>
          </div>

          {/* Technical Diagnostics Logs Console Box */}
          <div className="border border-zinc-900 bg-zinc-950/50 p-6 backdrop-blur-sm relative overflow-hidden group">
            {/* Corner Crosshairs */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-zinc-700" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-zinc-700" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-zinc-700" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-zinc-700" />

            <div className="space-y-3 text-[10px] md:text-xs leading-normal font-mono h-40 overflow-y-auto">
              {bootLogs.map((log, index) => {
                let statusLabel = '[ BOOT ]';
                let statusColor = 'text-brand-orange';
                
                if (log.includes('READY')) {
                  statusLabel = '[  OK  ]';
                  statusColor = 'text-emerald-500';
                } else if (log.includes('SYSTEM CHECK') || log.includes('STITCH')) {
                  statusLabel = '[ CONF ]';
                  statusColor = 'text-cyan-400';
                }
                
                return (
                  <div key={index} className="flex gap-3 text-zinc-400">
                    <span className={`font-bold ${statusColor} flex-shrink-0`}>{statusLabel}</span>
                    <span className="flex-1">{log.replace('> ', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress metrics and bar */}
          <div className="mt-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-grow">
              <div className="flex justify-between font-mono text-[10px] text-zinc-500 mb-2 tracking-wider">
                <span>{progressBar}</span>
                <span className="font-bold text-brand-orange">{progress}% LINKED</span>
              </div>
              <div className="w-full bg-zinc-950 border border-zinc-900 h-1 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-orange transition-all duration-200" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex justify-between items-center border-t border-zinc-900 pt-6 z-10 font-mono text-[9px] text-zinc-600">
          <span>HOST: SECURE_CONTAINER</span>
          <span>© {new Date().getFullYear()} SEARCH_PORTFOLIO</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      className={`min-h-screen transition-all duration-300 relative ${
        isGlitching ? 'glitch-flash text-black' : 'bg-black text-white'
      }`}
    >
      {/* Dynamic Film Grain texture overlay */}
      <div className="film-grain-container" />

      {/* Floating vertical left logo */}
      <div 
        className="hidden md:block fixed left-12 z-40 pointer-events-auto select-none -translate-y-1/2"
        style={{ 
          top: `${logoTop}px`,
          transition: 'top 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div className="relative">
          <button
            onClick={() => {
              playSound('click', isMuted);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setSelectedProject(null);
            }}
            onMouseEnter={() => {
              playSound('tick', isMuted);
              setIsLogoHovered(true);
            }}
            onMouseLeave={() => {
              setIsLogoHovered(false);
            }}
            className="block focus:outline-none hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Scroll to top"
          >
            <img 
              src={logo} 
              alt="SA Logo" 
              className="w-8 md:w-10 h-auto opacity-75 hover:opacity-100 transition-all duration-300"
              style={{ 
                filter: isLogoHovered ? 'brightness(0) invert(0.92)' : 'none'
              }}
            />
          </button>
          
          {/* Animated name tag label "[ Sergio Alzate ]" below the logo (centered) */}
          <span 
            className="absolute left-1/2 top-full mt-2 font-mono text-[9px] md:text-xs text-zinc-400 tracking-wider whitespace-nowrap pointer-events-none transition-all duration-300 ease-out"
            style={{
              opacity: isLogoHovered ? 1 : 0,
              transform: `translateX(-50%) translateY(${isLogoHovered ? '0px' : '-4px'})`
            }}
          >
            [ Sergio Alzate ]
          </span>
        </div>
      </div>

      {/* Spaceship HUD Telemetry Background Overlays */}
      <div className="fixed top-24 left-6 pointer-events-none font-mono text-[9px] text-zinc-700 z-10 hidden lg:block uppercase tracking-widest leading-relaxed select-none">
        <div>SYSTEM: ONLINE</div>
        <div>SYS_PING: 0014MS</div>
        <div>SCANNER_CORE: {isScannerLoaded ? 'READY' : 'STANDBY'}</div>
      </div>
      <div className="fixed bottom-24 left-6 pointer-events-none font-mono text-[9px] text-zinc-700 z-10 hidden lg:block uppercase tracking-widest leading-relaxed select-none">
        <div>HUD_COORDS // X_{mousePos.x.toFixed(0).padStart(4, '0')}</div>
        <div>HUD_COORDS // Y_{mousePos.y.toFixed(0).padStart(4, '0')}</div>
        <div>TELEMETRY: ACTIVE</div>
      </div>
      {/* Glitch CRT Scanlines Screen Overlay */}
      {isGlitching && (
        <div className="fixed inset-0 pointer-events-none z-[99] bg-scanlines opacity-30 mix-blend-overlay" />
      )}

      {/* Dynamic Cursor Overlay */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[110] rounded-full flex items-center justify-center border hidden md:flex transition-[width,height,padding,min-width,border-color,background-color] duration-150 ${
          cursorState === 'default'
            ? 'w-4 h-4 bg-brand-orange border-brand-orange'
            : cursorState === 'hovering'
            ? 'px-4 h-20 min-w-20 bg-transparent border-brand-orange text-brand-orange whitespace-nowrap'
            : 'w-44 h-44 bg-white border-white text-black mix-blend-difference'
        }`}
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {cursorState === 'glitch' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite]">
              <path
                id="textCircle"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="none"
              />
              <text className="font-mono text-[9px] font-black tracking-widest fill-black uppercase">
                <textPath href="#textCircle" startOffset="0%">
                  • WORK WITH SERGIO • WORK WITH SERGIO • WORK WITH SERGIO
                </textPath>
              </text>
            </svg>
          </div>
        )}
        {cursorState === 'hovering' && cursorLabel && (
          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-white">{cursorLabel}</span>
        )}
      </motion.div>

      {/* Global Glitch Orange Sticky Call-To-Action Banner */}
      {isGlitching && (
        <div className="fixed top-0 inset-x-0 bg-brand-orange border-b border-black text-black font-mono font-black py-4 px-6 z-[95] text-center tracking-widest text-sm select-none flex items-center justify-center gap-2 animate-[pulse_1s_infinite]">
          <span>FEELING JEALOUS? OUTWORK THE COMPETITION.</span>
          <a
            href="https://wa.me/525535550795"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-black text-white hover:bg-white hover:text-black transition-colors duration-200 border border-black uppercase text-xs font-bold"
          >
            [ HIRE SERGIO ALZATE ]
          </a>
        </div>
      )}

      {/* Navigation Header */}
      <header className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-900'} px-6 md:px-12 pt-6 pb-3 flex flex-col gap-3 z-40 relative`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            {/* Logo static on mobile, hidden on desktop */}
            <div className="block md:hidden shrink-0">
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setSelectedProject(null);
                }}
                className="block hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <img src={logo} alt="SA Logo" className="w-6 h-auto opacity-75" />
              </button>
            </div>
            <div className="font-mono text-xs font-bold tracking-widest md:pl-12">
              [ Sergio Alzate ]
            </div>
          </div>
          
          {/* Real-time Grid Coordinates Telemetry HUD */}
          <div className="text-[10px] text-zinc-500 font-mono hidden md:block">
            GRID_COORD: X_{mousePos.x.toString().padStart(4, '0')} Y_{mousePos.y.toString().padStart(4, '0')}
          </div>

          <nav className="hidden md:flex items-center gap-4 sm:gap-8 font-mono text-xs uppercase tracking-wider">
            <NavLink href="#work" label="Work" onHover={() => playSound('tick', isMuted)} />
            <NavLink href="#about" label="About" onHover={() => playSound('tick', isMuted)} />
            <NavLink href="#awards" label="Awards" onHover={() => playSound('tick', isMuted)} />
            <button
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? 'Unmute interface sound' : 'Mute interface sound'}
              aria-pressed={isMuted}
              className="text-zinc-500 hover:text-brand-orange transition-colors border border-zinc-800 px-2 py-1"
            >
              [{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}]
            </button>
          </nav>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => {
              playSound('click', isMuted);
              setIsMobileMenuOpen((open) => !open);
            }}
            className="md:hidden flex items-center justify-center w-8 h-8 border border-zinc-800 hover:border-brand-orange hover:text-brand-orange text-zinc-400 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Hamburger Dropdown Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden w-full overflow-hidden bg-black border-t border-zinc-900 mt-2 z-50"
            >
              <div className="flex flex-col gap-3 py-3 px-2 font-mono text-xs uppercase tracking-wider">
                <a 
                  href="#work" 
                  onClick={() => {
                    playSound('click', isMuted);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-zinc-400 hover:text-brand-orange py-2 border-b border-zinc-900"
                >
                  Work
                </a>
                <a 
                  href="#about" 
                  onClick={() => {
                    playSound('click', isMuted);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-zinc-400 hover:text-brand-orange py-2 border-b border-zinc-900"
                >
                  About
                </a>
                <a 
                  href="#awards" 
                  onClick={() => {
                    playSound('click', isMuted);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-zinc-400 hover:text-brand-orange py-2 border-b border-zinc-900"
                >
                  Awards
                </a>
                <button
                  onClick={() => {
                    playSound('click', isMuted);
                    setIsMuted((m) => !m);
                  }}
                  className="text-zinc-500 hover:text-brand-orange text-left py-2"
                >
                  [{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Single gray line divider */}
        <div className="w-full border-t border-zinc-800 opacity-60" />

        {/* Secondary Metadata Info Bar */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[9px] font-mono tracking-widest text-zinc-500 uppercase select-none">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite]" />
            <span>SYSTEM: ONLINE</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-zinc-600">
            <span>-</span>
            <span>CD - CW</span>
            <span>·</span>
            <span>EST.2013</span>
            <span>·</span>
            <span>LATAM → GLOBAL</span>
            <span>·</span>
            <span className="text-zinc-700">// CDMX - LIMA - QUITO - BUE - SPO - SCL</span>
          </div>
        </div>
      </header>

      {/* SECTION 1: HOME (Hero) */}
      <section className="min-h-[90vh] flex flex-col md:flex-row relative">
        <Crosshair className="top-0 left-0" />
        <Crosshair className="bottom-0 left-0" />
        
        {/* Left splitting vertical line marquee typography */}
        <div className={`w-full md:w-1/4 border-b md:border-b-0 md:border-r ${isGlitching ? 'border-black' : 'border-zinc-900'} flex items-center justify-center py-4 md:py-0 relative overflow-hidden`}>
          {/* Horizontal Scrolling Marquee on Mobile */}
          <div className="md:hidden w-full overflow-hidden select-none py-2 bg-zinc-950/20">
            <div 
              className="marquee-content flex whitespace-nowrap text-3xl font-black tracking-tighter text-stroke-white uppercase cursor-pointer magnetic-target"
              data-cursor-label="ADVERTISING"
              style={{
                animation: 'marquee-scroll 15s linear infinite',
              }}
            >
              <span>CREATIVE PORTFOLIO • CREATIVE PORTFOLIO • CREATIVE PORTFOLIO • </span>
              <span>CREATIVE PORTFOLIO • CREATIVE PORTFOLIO • CREATIVE PORTFOLIO • </span>
            </div>
          </div>
          {/* Vertical Marquee on Desktop */}
          <motion.div
            style={{ y: heroMarqueeY, writingMode: 'vertical-rl' }}
            className="hidden md:block md:rotate-180 text-center font-black tracking-tighter text-4xl md:text-5xl lg:text-6xl text-stroke-white select-none whitespace-nowrap py-4 cursor-pointer magnetic-target"
            data-cursor-label="ADVERTISING"
          >
            CREATIVE PORTFOLIO
          </motion.div>
        </div>

        {/* Right headline copy */}
        <div className="flex-1 flex flex-col justify-center px-6 pt-10 pb-20 md:p-12 lg:p-24 relative">
          <Crosshair className="top-0 right-0" />
          <Crosshair className="bottom-0 right-0" />
          
          <div className="max-w-4xl">
            <motion.h1
              style={{
                y: heroY,
                opacity: heroOpacity,
                letterSpacing: 'var(--envy-letter-spacing, 0em)',
                transform: 'skewX(var(--envy-skew, 0deg)) scaleX(var(--envy-scale-x, 1))',
                transformOrigin: 'left center',
                display: 'inline-block',
                filter: 'drop-shadow(0 0 calc(var(--envy-glow, 0) * 18px) rgba(206,254,70,calc(var(--envy-glow, 0) * 0.9)))',
                transition: 'letter-spacing 0.1s ease-out, transform 0.1s ease-out, filter 0.1s ease-out'
              }}
              className="font-black text-3xl sm:text-4xl md:text-6xl lg:text-[5.2vw] leading-[1.05] tracking-tighter mb-8 uppercase"
            >
              SERGIO ALZATE<br />
              <span className="text-brand-orange select-all cursor-pointer magnetic-target" data-cursor-label="COPY WRITING BASED">// CREATIVE DIRECTOR.</span>
            </motion.h1>
            <div className="flex flex-col gap-4 max-w-xl font-mono text-sm leading-relaxed text-zinc-400 border-l border-brand-orange pl-4">
              <h2 className="font-black text-lg text-white uppercase tracking-tight font-mono">
                PEOPLE WHO KNOW ME CALL ME SEARCH.
              </h2>
              <p>
                If you're searching for something, we already have something in common. Take a look at my advertising portfolio and discover the ideas I've developed over my 13 years as a creative.
              </p>
            </div>
          </div>
          
          {/* Scroll Indicator — anchors down to SELECTED WORK */}
          <a
            href="#work"
            onClick={() => playSound('click', isMuted)}
            className="group/scroll absolute bottom-8 left-6 md:left-12 lg:left-24 flex items-center gap-3 font-mono text-[10px] text-zinc-500 hover:text-brand-orange tracking-widest select-none uppercase transition-colors duration-300"
          >
            <span className="animate-[pulse_1.5s_infinite]">SCROLL AND SEARCH</span>
            <ArrowDown className="w-3.5 h-3.5 text-brand-orange animate-bounce group-hover/scroll:translate-y-1 transition-transform duration-300" />
          </a>
        </div>
      </section>

      {/* SECTION 2: WORK (12 Projects Asymmetrical Grid) */}
      <section id="work" className={`border-t ${isGlitching ? 'border-black' : 'border-zinc-900'} py-24 px-6 md:pl-28 md:pr-12 relative`}>
        <Crosshair className="top-0 left-0" />
        <Crosshair className="top-0 right-0" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-brand-orange mb-6 font-mono text-xs uppercase tracking-widest font-bold">
            <Folder className="w-4 h-4" />
            // SELECTED WORK
          </div>
          <motion.div 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-16"
          >
            <h2 className="font-black text-5xl uppercase tracking-tighter">Selected Work</h2>
            <div className="font-mono text-xs text-zinc-500 uppercase">[19 PROJECTS COMPILATION]</div>
          </motion.div>

          {/* BENTO GRID — asymmetrical brutalist rectangles of varied sizes.
              Each project is placed on a 6-col grid with a deterministic span
              pattern so the layout stays intentional, not random. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grid-flow-row-dense auto-rows-[180px] md:auto-rows-[220px] gap-2 md:gap-3 w-full">
            {projects.map((project, idx) => {
              const hasPeak = projectPeaks[project.id] !== undefined;
              // Deterministic size pattern → visual rhythm without randomness.
              const span = BENTO_PATTERN[idx % BENTO_PATTERN.length];

              return (
                <div
                  key={project.id}
                  id={`project-${project.id}`}
                  onClick={() => handleSelectProject(project)}
                  onMouseEnter={() => playSound('tick', isMuted)}
                  style={{
                    boxShadow: `0 0 calc(${envIntensity} * 36px) rgba(206,254,70,calc(${envIntensity} * 0.55))`,
                    borderColor: hasPeak ? 'rgba(206,254,70,0.5)' : undefined,
                  }}
                  className={`group relative cursor-pointer overflow-hidden border border-zinc-900 hover:border-brand-orange transition-all duration-500 ${span}`}
                >
                  {/* Full-bleed B&W media — colour reveals only on hover */}
                  <div className="absolute inset-0 w-full h-full">
                    <ProjectMedia id={project.id} image={project.images?.[0]} bw />
                  </div>

                  {/* Brutalist offset shadow block (slides in on hover) */}
                  <div className="absolute inset-0 translate-x-2 translate-y-2 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                  {/* Readability tint — clears slightly on hover so colour pops */}
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/25 transition-colors duration-500 z-10" />

                  {/* Target lock-on brackets on Hover */}
                  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-brand-orange" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-brand-orange" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-brand-orange" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-brand-orange" />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-5 select-none pointer-events-none">
                    {/* Top row: index + category */}
                    <div className="flex items-start justify-between gap-2 font-mono text-[9px] md:text-[10px] text-zinc-300">
                      <span className="bg-black/70 border border-zinc-700 px-1.5 py-0.5">
                        {String(idx + 1).padStart(2, '0')} // {project.category}
                      </span>
                      <div className="flex gap-2 items-center">
                        {hasPeak && viewedProjects[project.id] && (
                          <span className="bg-brand-orange text-black font-bold px-1.5 py-0.5 border border-brand-orange shadow-[2px_2px_0px_#ffffff] text-[8px] uppercase tracking-wider">
                            ENVY: {projectPeaks[project.id].toFixed(1)}
                          </span>
                        )}
                        <span className="bg-black/70 border border-zinc-700 px-1.5 py-0.5">{project.year}</span>
                      </div>
                    </div>

                    {/* Bottom row: title + hover CTA */}
                    <div>
                      <h3 className="font-black tracking-tighter uppercase text-white group-hover:text-brand-orange transition-colors duration-300 text-lg md:text-2xl lg:text-3xl leading-[0.95]">
                        {project.title}
                      </h3>
                      <div className="overflow-hidden h-0 opacity-0 group-hover:h-6 group-hover:opacity-100 transition-all duration-300 ease-out flex justify-between items-center pt-0 group-hover:pt-2">
                        <span className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-brand-orange">
                          [ {project.rollover || 'View Case'} → ]
                        </span>
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-zinc-500 group-hover:animate-pulse">
                          {hasPeak ? `[ PEAK_FACTOR: ${projectPeaks[project.id].toFixed(1)} ]` : '[ SCAN_STATUS: READY ]'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Link to Behance under Selected Work */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://www.behance.net/sergio_thk"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playSound('tick', isMuted)}
              data-cursor-label="[ WATCH IN BEHANCE ]"
              className="whitespace-nowrap px-2 py-1 font-mono text-xs uppercase tracking-wider border border-zinc-800 text-zinc-500 hover:text-brand-orange transition-colors inline-block"
            >
              [ MORE WORK ]
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT (System Status Resume) */}
      <section 
        id="about" 
        className={`border-t ${isGlitching ? 'border-black' : 'border-zinc-900'} py-24 px-6 md:pl-28 md:pr-12 relative w-full bg-black`}
      >
        <Crosshair className="top-0 left-0" />
        <Crosshair className="top-0 right-0" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Bio Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-brand-orange mb-6 font-mono text-xs uppercase tracking-widest font-bold">
                <User className="w-4 h-4" />
                // BIOGRAPHY
              </div>
              
              {/* Neobrutalist Biography Image Widget */}
              {showSearchWidget && (
                <div className="border-2 border-brand-orange bg-zinc-950 p-2 shadow-[6px_6px_0px_rgba(206,254,70,0.8)] relative group select-none mb-8 w-full max-w-[280px] animate-[fadeIn_0.3s_ease-out]">
                  {/* Corner highlights */}
                  <div className="absolute top-[-2px] left-[-2px] w-2 h-2 bg-brand-orange" />
                  <div className="absolute top-[-2px] right-[-2px] w-2 h-2 bg-brand-orange" />
                  <div className="absolute bottom-[-2px] left-[-2px] w-2 h-2 bg-brand-orange" />
                  <div className="absolute bottom-[-2px] right-[-2px] w-2 h-2 bg-brand-orange" />
                  
                  {/* HUD Header tag */}
                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 border-b border-zinc-900 pb-1">
                    <span>ID: SERGIO_ALZATE</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('click', isMuted);
                        setShowSearchWidget(false);
                      }}
                      className="text-zinc-500 hover:text-brand-orange font-bold text-[10px] cursor-pointer px-1 transition-colors"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Image Container with Scanlines Overlay */}
                  <div className="relative overflow-hidden bg-black flex items-center justify-center border border-zinc-900 aspect-[3/4]">
                    {/* Subtle Scanlines */}
                    <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none z-10" />
                    
                    <img 
                      src={searchImage} 
                      alt="Sergio Alzate Biography" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                    
                    {/* HUD overlay labels */}
                    <div className="absolute bottom-2 left-2 z-20 font-mono text-[7px] text-brand-orange bg-black/80 px-1 py-0.5 border border-brand-orange/30">
                      LATAM_GEO: CDMX
                    </div>
                    <div className="absolute top-2 right-2 z-20 font-mono text-[7px] text-zinc-400 bg-black/80 px-1 py-0.5 border border-zinc-800">
                      REC: 1080P
                    </div>
                  </div>
                </div>
              )}

              <ScrollBiography />

              <div className="font-mono text-xs leading-relaxed text-zinc-400 space-y-4 mb-8 border-l border-zinc-800 pl-4">
                <p>
                  I studied visual arts and a few things related to communication, literature and technology. I've been fortunate to work in several Latin American countries like Argentina, Brazil, Chile, Ecuador, Peru and now Mexico.
                </p>
                <p>
                  My nickname, "Search," comes from my friend Molinitas, who says I'm the best at googling. As a nerd, I have no doubt that machines will rule the world, I just hope they are the coffee-making ones.
                </p>
              </div>
              <p className="font-mono text-xs text-brand-orange">
                Contact: donsergio.alzatetorres(a)gmail.com
              </p>
            </div>

            <div className="pt-8 border-t border-zinc-900 mt-12 font-mono text-xs text-zinc-500">
              [ STATUS: READY TO HIRE • LOCATION: CDMX / LATAM / GLOBAL ]
            </div>
          </motion.div>

          {/* Timeline Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-brand-orange mb-4 font-mono text-xs uppercase tracking-widest font-bold">
              <Briefcase className="w-4 h-4" />
              // EXPERIENCE TIMELINE
            </div>
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-6 select-none">
              ECUADOR - ARGENTINA - BRASIL - CHILE - PERU - MEXICO
            </div>

            <div className="space-y-8">
              {EXPERIENCES.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="group bg-black text-white font-mono text-[10px] border border-zinc-800 hover:border-zinc-650 select-none w-full flex flex-col uppercase tracking-widest transition-all duration-300 shadow-[0px_0px_0px_rgba(0,0,0,0)] hover:shadow-[4px_4px_0px_#ffffff] cursor-pointer"
                >
                  {/* Top Header Row */}
                  <div className="border-b border-zinc-800 px-3 py-2 flex justify-between font-black text-[9px] md:text-[10px] text-zinc-400 transition-colors duration-300">
                    <span>EXPERIENCE RECORD // CD.01.{idx.toString().padStart(2, '0')}</span>
                    <span className="text-brand-orange font-bold">EST. {item.period}</span>
                  </div>

                  {/* Middle Split Row */}
                  <div className="flex border-b border-zinc-800 min-h-[72px] transition-colors duration-300">
                    {/* Left Column: Company */}
                    <div className="w-1/2 border-r border-zinc-800 flex items-stretch transition-colors duration-300">
                      <div className="p-3 font-black text-lg md:text-xl tracking-tighter leading-none uppercase text-white group-hover:bg-[#cefe46] group-hover:text-black w-full flex items-center transition-all duration-300">
                        {item.company}
                      </div>
                    </div>

                    {/* Middle Column: Role */}
                    <div className="w-1/3 border-r border-zinc-800 p-3 flex flex-col justify-between transition-colors duration-300">
                      <span className="text-[8px] text-zinc-555 font-bold tracking-wider">// ASSIGNMENT</span>
                      <span className="font-black text-xs md:text-sm tracking-tight leading-none pt-2 text-white transition-colors duration-300">{item.role}</span>
                    </div>

                    {/* Right Column: Diagonal Graphic */}
                    <div className="flex-1 relative overflow-hidden bg-white/[0.02] flex items-center justify-center transition-colors duration-300">
                      <svg className="absolute inset-0 w-full h-full text-zinc-800 transition-colors duration-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Row 3: Location (New Bottom Row) */}
                  <div className="p-3 flex justify-between items-center font-bold text-[9px] text-zinc-400 transition-colors duration-300">
                    <div>LOCATION: {item.location}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: AWARDS (Static text + Table) */}
      <section id="awards" className={`border-t ${isGlitching ? 'border-black' : 'border-zinc-900'} py-24 relative`}>
        <Crosshair className="top-0 left-0" />
        <Crosshair className="top-0 right-0" />

        <div className="max-w-7xl mx-auto px-6 md:pl-28 md:pr-12 mb-20">
          <div className="flex items-center gap-2 text-brand-orange mb-4 font-mono text-xs uppercase tracking-widest font-bold">
            <Award className="w-4 h-4" />
            // RECOGNITION DECK
          </div>
          <motion.h2
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-5xl uppercase tracking-tighter mb-4"
          >
            AWARDS & STACKS
          </motion.h2>
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-12 select-none">
            {AWARDS_DATA.reduce((n, f) => n + f.entries.length, 0)} RECOGNITIONS · {AWARDS_DATA.length} FESTIVALS
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-zinc-400 font-mono text-xs md:text-sm leading-relaxed mb-16 border-l-2 border-brand-orange pl-6 select-none"
          >
            Here’s the thing: there are a bunch of us creatives who don’t really care about awards or recognition. I’ve got over 90 of those “I don’t care about” awards, and I made sure to write them down with the date, celebrate them by dancing, post about them on all my socials… and even called my mom excited to tell her I won.
          </motion.div>

          {/* Awards — collapsible accordions grouped by festival */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {AWARDS_DATA.map((festival, idx) => (
              <AwardAccordion
                key={festival.name}
                festival={festival}
                defaultOpen={idx < 2}
                onToggle={() => playSound('tick', isMuted)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Moving Marquee (Cenefa en movimiento) — speeds up + glows with envy */}
      <div className={`marquee-container border-t border-b ${isGlitching ? 'border-black' : 'border-zinc-900'} bg-zinc-950 py-4 overflow-hidden select-none`}>
        <div
          className="marquee-content flex whitespace-nowrap text-xl md:text-3xl font-mono font-black tracking-widest text-brand-orange uppercase"
          style={{
            // Faster (down to ~6s) and brighter as envy rises
            animation: `marquee-scroll ${Math.max(6, 25 - envIntensity * 19)}s linear infinite`,
            textShadow: `0 0 calc(${envIntensity} * 16px) rgba(206,254,70,calc(${envIntensity} * 0.9))`,
          }}
        >
          <span>IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • </span>
          <span>IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • </span>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={`border-t ${isGlitching ? 'border-black' : 'border-zinc-900'} px-6 md:px-12 py-12 flex flex-col gap-8 z-40 relative`}>
        <div id="footer-links" className="flex flex-col items-start gap-3 font-mono text-xs uppercase tracking-wider pt-12 md:pt-14 relative">
          {/* Static logo at the end for mobile only */}
          <div className="block md:hidden mb-2">
            <button
              onClick={() => {
                playSound('click', isMuted);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSelectedProject(null);
              }}
              className="block hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <img src={logo} alt="SA Logo" className="w-8 h-auto opacity-75" />
            </button>
          </div>
          {/* Whatsapp Button */}
          <a
            href="https://wa.me/525535550795"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound('tick', isMuted)}
            className="group/nav relative py-1 text-zinc-400 hover:text-brand-orange transition-colors duration-300"
          >
            Whatsapp
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-brand-orange transition-all duration-300 ease-out group-hover/nav:w-full" />
          </a>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/in/salzate/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound('tick', isMuted)}
            className="group/nav relative py-1 text-zinc-400 hover:text-brand-orange transition-colors duration-300"
          >
            LinkedIn
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-brand-orange transition-all duration-300 ease-out group-hover/nav:w-full" />
          </a>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/ser.confiltros/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound('tick', isMuted)}
            className="group/nav relative py-1 text-zinc-400 hover:text-brand-orange transition-colors duration-300"
          >
            Instagram
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-brand-orange transition-all duration-300 ease-out group-hover/nav:w-full" />
          </a>

          {/* Behance Button */}
          <a
            href="https://www.behance.net/sergio_thk"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound('tick', isMuted)}
            className="group/nav relative py-1 text-zinc-400 hover:text-brand-orange transition-colors duration-300"
          >
            Behance
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-brand-orange transition-all duration-300 ease-out group-hover/nav:w-full" />
          </a>
        </div>
        <div className="font-mono text-[10px] text-zinc-500 text-center w-full mt-4">
          © 2026 SERGIO ALZATE. ALL WRONGS RESERVED.
        </div>
      </footer>

      {/* Unified Envy-Meter Stacking Layout */}
      <div className="hidden md:flex fixed bottom-4 right-4 z-[100] flex-col gap-3 w-[280px] pointer-events-none">
        
        {/* Onboarding Callout Banner (only visible offline, not active, not info open) */}
        {showExplanation && envyScore === null && !isScannerActive && !isWidgetInfoOpen && (
          <div className="pointer-events-auto bg-black border border-zinc-800 p-4 font-mono text-[10px] text-zinc-400 shadow-[4px_4px_0px_#27272a] select-none hover:border-brand-orange relative z-20 hidden md:block animate-[fadeIn_0.3s_ease-out]">
            <p className="leading-relaxed mb-2 text-white font-mono text-[10px]">
              To decide who I want to work with, I usually use envy. If I feel a little envious, I should work with that person. To make it easy for you, I created this envy meter for when you see my work.
            </p>
            <div className="text-right text-brand-orange font-bold text-[9px] animate-[pulse_1.5s_infinite]">
              ACTIVATE ENVY SCANNER ↘
            </div>
            
            {/* Hand-Drawn SVG Arrow pointing down to the scanner widget */}
            <svg
              className="absolute bottom-[-32px] right-10 w-12 h-12 text-brand-orange pointer-events-none"
              viewBox="0 0 50 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 15 5 C 20 15, 25 25, 25 35" />
              <path d="M 18 30 L 25 35 L 28 27" />
              <path d="M 13 4 C 11 6, 9 10, 11 12 C 13 14, 17 12, 16 9 C 15 6, 12 3, 14 4" />
            </svg>
          </div>
        )}

        {/* Biometric Envy Scanner Widget */}
        <div className="pointer-events-auto w-full relative z-0">
          <Suspense
            fallback={
              <div className="w-full font-mono text-[10px] text-white bg-black border border-zinc-800 p-4 shadow-[3px_3px_0px_#27272a]">
                Loading biometric libraries...
              </div>
            }
          >
            <EnvyMeterWidget
              onScoreChange={handleScoreChange}
              onActiveChange={setIsScannerActive}
              onInfoToggle={setIsWidgetInfoOpen}
              displayScoreOverride={selectedProject ? null : averageEnvyScore}
              projectId={selectedProject?.id ?? null}
            />
          </Suspense>
        </div>

        {/* Brutalist "HIRE SERGIO" CTA Link/Button (only visible when envy > 6.0) */}
        {envyScore !== null && envyScore > 6.0 && (
          <a
            href="https://wa.me/525535550795"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto block w-full text-center py-2 bg-brand-orange text-black font-black uppercase tracking-widest text-xs border border-brand-orange hover:bg-black hover:text-brand-orange hover:border-brand-orange transition-all duration-300 cursor-pointer shadow-[3px_3px_0px_#27272a] hover:shadow-[4px_4px_0px_#27272a] active:translate-y-[1px] animate-[fadeIn_0.2s_ease-out]"
          >
            HIRE SERGIO
          </a>
        )}
        </div>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onScroll={handleModalScroll}
          className={`fixed inset-0 z-[90] overflow-y-auto font-mono p-6 md:p-12 lg:p-24 flex flex-col justify-start ${
            isGlitching ? 'glitch-flash text-black' : 'bg-black/95 text-white'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto w-full">
            {/* Modal Header */}
            <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} pb-6 mb-8`}>
              <div className="flex-grow">
                <span className={`${isGlitching ? 'text-zinc-800' : 'text-zinc-500'} text-xs uppercase tracking-wider block`}>
                  {selectedProject.category} // {selectedProject.year}
                </span>
                <h2
                  style={{
                    letterSpacing: 'var(--envy-letter-spacing, 0em)',
                    transform: 'skewX(var(--envy-skew, 0deg)) scaleX(var(--envy-scale-x, 1))',
                    transformOrigin: 'left center',
                    display: 'inline-block',
                    transition: 'all 0.1s ease-out'
                  }}
                  className={`font-black text-3xl md:text-5xl uppercase tracking-tighter mt-2 break-words ${
                    isGlitching ? 'text-black' : 'text-brand-orange'
                  }`}
                >
                  {selectedProject.title}
                </h2>
                {projectPeaks[selectedProject.id] !== undefined && (
                  <div className="mt-4 flex items-center">
                    <span className={`px-2 py-1 font-mono font-bold text-[9px] uppercase tracking-widest pointer-events-none shadow-[2px_2px_0px_#ffffff] ${
                      isGlitching ? 'bg-black text-white' : 'bg-brand-orange text-black'
                    }`}>
                      ENVY FACTOR PEAK: {projectPeaks[selectedProject.id].toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setSelectedProject(null);
                }}
                className={`whitespace-nowrap flex-shrink-0 px-2 py-1 border transition-colors font-mono text-xs uppercase tracking-wider ${
                  isGlitching
                    ? 'bg-black text-white border-black hover:bg-white hover:text-black'
                    : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-brand-orange'
                } self-start sm:self-auto`}
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Unified Media Box (Gapless, Brutalist stack) */}
            {selectedProject.video || (selectedProject.images && selectedProject.images.length > 0) ? (
              <div className={`border ${isGlitching ? 'border-black' : 'border-zinc-800'} bg-zinc-950 overflow-hidden relative`}>
                {selectedProject.id === 18 || selectedProject.slug === 'dino-on-negocios' ? (
                  /* Custom Layout for Dino Project */
                  <div className="flex flex-col">

                    {/* Dino 1.png */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Dino detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Dino 2.png */}
                    {selectedProject.images?.[2] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Dino detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-[1280/880] w-full ${selectedProject.images && selectedProject.images.length > 3 ? `border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}` : ''} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* Dino 3.gif, Dino 4.gif, Dino 5.gif side-by-side (1 row of 3 columns) */}
                    {selectedProject.images && selectedProject.images.length > 3 && (
                      <div className={`grid grid-cols-3 divide-x ${isGlitching ? 'divide-black' : 'divide-zinc-800'}`}>
                        {selectedProject.images.slice(3, 6).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Dino detail ${idx + 3}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 2 || selectedProject.slug === 'lo-friedbeats' ? (
                  /* Custom Layout for Lo-Fried Beats Project */
                  <div className="flex flex-col">
                    {/* lo-fried_1.gif */}
                    {selectedProject.images?.[0] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[0]} 
                          alt="Lo-Fried Beats detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* lo-fried_2.png */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Lo-Fried Beats detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Spotify Embed Iframe */}
                    <div className={`w-full h-[152px] border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                      <iframe
                        src="https://open.spotify.com/embed/album/0Dozl59DWjlDjMHx0pB4Ib?utm_source=generator"
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; picture-in-picture"
                        sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-popups allow-popups-to-escape-sandbox"
                        className="w-full h-full border-0"
                      />
                    </div>
                    
                    {/* lo-fried_3.png */}
                    {selectedProject.images?.[2] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Lo-Fried Beats detail 3" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 1 || selectedProject.slug === 'wintv' ? (
                  /* Custom Layout for win tv Project */
                  <div className="flex flex-col">

                    {/* Row 1: wintv_1.png */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="WinTV detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video 1: https://player.vimeo.com/video/1069358927 */}
                    <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                      <iframe
                        src="https://player.vimeo.com/video/1069358927"
                        title="WinTV Video 1"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    
                    {/* Row 2: Grid of wintv_2, wintv_3, wintv_4 (3 columns) */}
                    {selectedProject.images && selectedProject.images.length > 4 && (
                      <div className={`grid grid-cols-3 divide-x border-b ${isGlitching ? 'divide-black border-black' : 'divide-zinc-800 border-zinc-800'}`}>
                        {selectedProject.images.slice(2, 5).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`WinTV detail ${idx + 2}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Row 3: wintv_5.gif */}
                    {selectedProject.images?.[5] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[5]} 
                          alt="WinTV detail 5" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Row 4: wintv_6.png */}
                    {selectedProject.images?.[6] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[6]} 
                          alt="WinTV detail 6" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video 2: https://player.vimeo.com/video/1078828956 */}
                    <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                      <iframe
                        src="https://player.vimeo.com/video/1078828956"
                        title="WinTV Video 2"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    
                    {/* Row 5: Grid of wintv_7, wintv_8, wintv_9 (3 columns) */}
                    {selectedProject.images && selectedProject.images.length > 9 && (
                      <div className={`grid grid-cols-3 divide-x border-b ${isGlitching ? 'divide-black border-black' : 'divide-zinc-800 border-zinc-800'}`}>
                        {selectedProject.images.slice(7, 10).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`WinTV detail ${idx + 7}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Row 6: wintv_10.gif */}
                    {selectedProject.images?.[10] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[10]} 
                          alt="WinTV detail 10" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Row 7: Grid of wintv_11, wintv_12 (2 columns) */}
                    {selectedProject.images && selectedProject.images.length > 12 && (
                      <div className={`grid grid-cols-2 divide-x ${isGlitching ? 'divide-black' : 'divide-zinc-800'}`}>
                        {selectedProject.images.slice(11, 13).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`WinTV detail ${idx + 11}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 3 || selectedProject.slug === 'open-late' ? (
                  /* Custom Layout for Open Late Project */
                  <div className="flex flex-col">
                    {/* openlate1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Open Late detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* openlate2 */}
                    {selectedProject.images?.[2] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Open Late detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* openlate3 (menu cover stored at index 0) */}
                    {selectedProject.images?.[0] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[0]} 
                          alt="Open Late detail 3" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* openlate4 */}
                    {selectedProject.images?.[3] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[3]} 
                          alt="Open Late detail 4" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* openlate5 */}
                    {selectedProject.images?.[4] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[4]} 
                          alt="Open Late detail 5" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* openlate6 */}
                    {selectedProject.images?.[5] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[5]} 
                          alt="Open Late detail 6" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 4 || selectedProject.slug === 'the-cheering-trophy' ? (
                  /* Custom Layout for The Cheering Trophy Project */
                  <div className="flex flex-col">
                    {/* Copa 1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Copa detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Vimeo Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* Copa 2 */}
                    {selectedProject.images?.[2] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Copa detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 5 || selectedProject.slug === 'dedos-llenos' ? (
                  /* Custom Layout for Dedos Llenos Project */
                  <div className="flex flex-col">
                    {/* dedos1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Dedos detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video 1: https://player.vimeo.com/video/809990478 */}
                    <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                      <iframe
                        src="https://player.vimeo.com/video/809990478"
                        title="Dedos Llenos Video 1"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Video 2: https://player.vimeo.com/video/1014369181 */}
                    <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                      <iframe
                        src="https://player.vimeo.com/video/1014369181"
                        title="Dedos Llenos Video 2"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Video 3 & 4 Row: Unequal Widths (7/12 and 5/12 split, scaling proportionally) */}
                    <div className={`flex divide-x border-b ${isGlitching ? 'divide-black border-black' : 'divide-zinc-800 border-zinc-800'}`}>
                      <div className="w-7/12 aspect-video relative overflow-hidden">
                        <iframe
                          src="https://player.vimeo.com/video/845815102"
                          title="Dedos Llenos Video 3"
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="w-5/12 relative overflow-hidden bg-zinc-950">
                        <iframe
                          src="https://player.vimeo.com/video/845815773"
                          title="Dedos Llenos Video 4"
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* Images Row: dedos2, dedos3, dedos4 (Last item, no bottom border) */}
                    {selectedProject.images && selectedProject.images.length > 3 && (
                      <div className={`grid grid-cols-3 divide-x ${isGlitching ? 'divide-black' : 'divide-zinc-800'}`}>
                        {/* dedos2 */}
                        <div className="relative">
                          <img 
                            src={selectedProject.images[0]} 
                            alt="Dedos detail 2" 
                            className="w-full h-auto object-cover" 
                          />
                        </div>
                        {/* dedos3 */}
                        <div className="relative">
                          <img 
                            src={selectedProject.images[2]} 
                            alt="Dedos detail 3" 
                            className="w-full h-auto object-cover" 
                          />
                        </div>
                        {/* dedos4 */}
                        <div className="relative">
                          <img 
                            src={selectedProject.images[3]} 
                            alt="Dedos detail 4" 
                            className="w-full h-auto object-cover" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 6 || selectedProject.slug === 'sun-stats' ? (
                  /* Custom Layout for Sunstats Project */
                  <div className="flex flex-col">
                    {/* sun1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Sunstats detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun2 (menu cover stored at index 0) */}
                    {selectedProject.images?.[0] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[0]} 
                          alt="Sunstats detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun3 */}
                    {selectedProject.images?.[2] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Sunstats detail 3" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun4 */}
                    {selectedProject.images?.[3] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[3]} 
                          alt="Sunstats detail 4" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun5 */}
                    {selectedProject.images?.[4] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[4]} 
                          alt="Sunstats detail 5" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun6 */}
                    {selectedProject.images?.[5] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[5]} 
                          alt="Sunstats detail 6" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* sun7 */}
                    {selectedProject.images?.[6] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[6]} 
                          alt="Sunstats detail 7" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 7 || selectedProject.slug === 'win-exorcist' ? (
                  /* Custom Layout for Win Exorcist Project */
                  <div className="flex flex-col">
                    {/* exorcist1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Exorcist detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-[356/240] w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* exorcist2, exorcist3, exorcist4 side-by-side (1 row of 3 columns) */}
                    {selectedProject.images && selectedProject.images.length > 4 && (
                      <div className={`grid grid-cols-3 divide-x border-b ${isGlitching ? 'divide-black border-black' : 'divide-zinc-800 border-zinc-800'}`}>
                        {selectedProject.images.slice(2, 5).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Exorcist detail ${idx + 2}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* exorcist5 */}
                    {selectedProject.images?.[5] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[5]} 
                          alt="Exorcist detail 5" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : selectedProject.id === 9 || selectedProject.slug === 'muvid' ? (
                  /* Custom Layout for Muvid Project */
                  <div className="flex flex-col">
                    {/* muvid1 */}
                    {selectedProject.images?.[1] && (
                      <div className={`border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
                        <img 
                          src={selectedProject.images[1]} 
                          alt="Muvid detail 1" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-video w-full border-b ${isGlitching ? 'border-black' : 'border-zinc-800'} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* muvid2 */}
                    {selectedProject.images?.[2] && (
                      <div className="relative">
                        <img 
                          src={selectedProject.images[2]} 
                          alt="Muvid detail 2" 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Layout for other projects */
                  <div className="flex flex-col">
                    {/* Video Player */}
                    {selectedProject.video && (
                      <div className={`aspect-video w-full ${selectedProject.images && selectedProject.images.length > 0 ? `border-b ${isGlitching ? 'border-black' : 'border-zinc-800'}` : ''} relative overflow-hidden`}>
                        <iframe
                          src={selectedProject.video}
                          title={selectedProject.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* Images Gallery */}
                    {selectedProject.images && selectedProject.images.length > 0 && (
                      <div className={`flex flex-col divide-y ${isGlitching ? 'divide-black' : 'divide-zinc-800'}`}>
                        {selectedProject.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`${selectedProject.title} detail ${idx + 1}`} 
                              className="w-full h-auto object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={`border ${isGlitching ? 'border-black text-black' : 'border-zinc-800 text-zinc-500'} p-24 text-center uppercase text-xs tracking-widest`}>
                [ No media assets found for this project ]
              </div>
            )}
            
            {/* Project Navigation Footer */}
            <div className={`mt-24 pt-12 border-t ${isGlitching ? 'border-black' : 'border-zinc-800'}`}>
              
              {/* Storyboard Filmstrip Carousel Menu */}
              <div className="mb-16">
                <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                  <span>// CHAPTER SELECTOR: STORYBOARDS STRIP [19 CAMPAIGNS]</span>
                  <span className="text-brand-orange text-[8px] animate-pulse">← SCROLL HORIZONTALLY TO EXPLORE →</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-950">
                  {projects.map((proj, idx) => {
                    const isActive = proj.id === selectedProject.id;
                    const coverImage = proj.images && proj.images.length > 0 ? proj.images[0] : null;
                    
                    return (
                      <button
                        key={proj.id}
                        onClick={() => handleSelectProject(proj)}
                        className={`snap-start flex-shrink-0 w-48 md:w-56 aspect-[16/10] relative overflow-hidden border text-left transition-all duration-300 group/strip ${
                          isActive 
                            ? 'border-brand-orange ring-1 ring-brand-orange' 
                            : 'border-zinc-800 hover:border-zinc-500'
                        }`}
                      >
                        {/* Cover Image or Fallback */}
                        <div className="absolute inset-0 z-0 scale-100 group-hover/strip:scale-105 transition-transform duration-500 ease-out">
                          {coverImage ? (
                            <img 
                              src={coverImage} 
                              alt={proj.title} 
                              className={`w-full h-full object-cover grayscale transition-all duration-500 group-hover/strip:grayscale-0 ${
                                isActive ? 'grayscale-0' : 'opacity-60 group-hover/strip:opacity-90'
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full opacity-40 group-hover/strip:opacity-75">
                              <ProjectThumbnail id={proj.id} />
                            </div>
                          )}
                        </div>

                        {/* Dark Overlay Tint */}
                        <div className={`absolute inset-0 z-10 transition-colors duration-300 ${
                          isActive ? 'bg-brand-orange/15' : 'bg-black/70 group-hover/strip:bg-black/55'
                        }`} />

                        {/* Text Info Overlay */}
                        <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between select-none pointer-events-none">
                          <div className="flex justify-between items-start font-mono text-[8px] md:text-[9px]">
                            <span className="bg-zinc-950/90 text-zinc-400 px-1.5 py-0.5 border border-zinc-800">
                              CH.{String(idx + 1).padStart(2, '0')}
                            </span>
                            {isActive && (
                              <span className="bg-brand-orange text-black px-1.5 py-0.5 font-bold uppercase tracking-wider">
                                ACTIVE
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-mono text-[9px] md:text-[10px] font-black text-white uppercase tracking-tight line-clamp-1 group-hover/strip:text-brand-orange transition-colors">
                              {proj.slug.replace('-', ' ')}
                            </h4>
                            <p className="font-mono text-[7px] text-zinc-500 uppercase tracking-widest line-clamp-1">
                              {proj.category.split(' // ')[0]}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Moving Marquee inside Project Modal */}
            <div className={`marquee-container border-t border-b ${isGlitching ? 'border-black' : 'border-zinc-900'} bg-zinc-950 py-4 overflow-hidden select-none my-16`}>
              <div
                className="marquee-content flex whitespace-nowrap text-xl md:text-3xl font-mono font-black tracking-widest text-brand-orange uppercase"
                style={{
                  animation: 'marquee-scroll 25s linear infinite',
                }}
              >
                <span>IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • </span>
                <span>IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • IF MY JOB MAKES YOU FEEL UNCOMFORTABLE - WE SHOULD TALK • </span>
              </div>
            </div>

            <div className={`mt-16 pt-8 border-t ${isGlitching ? 'border-black' : 'border-zinc-800'} flex justify-center`}>
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setSelectedProject(null);
                }}
                className={`whitespace-nowrap px-6 py-3 font-mono text-sm uppercase tracking-widest border transition-colors ${
                  isGlitching
                    ? 'bg-black text-white border-black hover:bg-white hover:text-black'
                    : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-brand-orange'
                }`}
              >
                [ RETURN TO PORTFOLIO ]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default App;
