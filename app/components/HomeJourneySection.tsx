"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Architectural SVG Illustrations
// All in crisp, fine white line-drawing style (stroke="#FFFFFF", strokeWidth="1" to "1.5", transparent fills)
export interface MilestoneSubEntry {
  subCode: string;
  badgeType: "Academic" | "Internship" | "Training" | "Employment";
  badgeLabel: string;
  dateLabel: string;
  title: string;
  org: string;
  statBadge?: string;
  description: string;
  tags: string[];
}

export interface MilestoneData {
  number: string;
  yearWatermark: string;
  location: string;
  dateLabel: string;
  badgeType: "Academic" | "Internship" | "Training" | "Employment" | "Present";
  title: string;
  org: string;
  description: string;
  tags: string[];
  illustrationTitle: string;
  svg: React.ReactNode;
  subEntries?: MilestoneSubEntry[];
}

// 1. Malegaon: Bhuykot Castle (Bhuikot Fort) - fortress walls, bastions, ramparts & historic arched entrance
function BhuykotCastleSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Architectural pencil drawing of Malegaon Bhuykot Castle"
    >
      {/* Ground horizon / base line */}
      <line x1="10" y1="165" x2="270" y2="165" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="25" y1="160" x2="255" y2="160" strokeWidth="1.2" />

      {/* Outer Fort Left Bastion (Round Turret) */}
      <path d="M 32 160 L 32 95 Q 32 80 50 80 Q 68 80 68 95 L 68 160" strokeWidth="1.2" />
      {/* Bastion Battlements (Merlons) */}
      <path d="M 30 80 L 30 72 L 38 72 L 38 80 L 46 80 L 46 72 L 54 72 L 54 80 L 62 80 L 62 72 L 70 72 L 70 80" strokeWidth="1" />
      {/* Bastion Arrow Slits / Windows */}
      <line x1="50" y1="98" x2="50" y2="114" strokeWidth="1.5" />
      <line x1="50" y1="126" x2="50" y2="142" strokeWidth="1.5" />
      <path d="M 40 102 Q 40 96 50 96 Q 60 96 60 102" strokeWidth="0.8" opacity="0.6" />

      {/* Main Curtain Wall (Connecting Rampart Left to Center) */}
      <path d="M 68 108 L 105 108 L 105 160" strokeWidth="1.2" />
      {/* Wall merlons */}
      <path d="M 68 108 L 74 108 L 74 102 L 80 102 L 80 108 L 86 108 L 86 102 L 92 102 L 92 108 L 98 108 L 98 102 L 105 102 L 105 108" strokeWidth="0.9" />

      {/* Grand Central Fortress Gateway (Darwaza) */}
      <path d="M 105 160 L 105 65 L 175 65 L 175 160" strokeWidth="1.4" />
      {/* Gateway parapet & battlements */}
      <path d="M 101 65 L 101 56 L 111 56 L 111 65 L 121 65 L 121 56 L 131 56 L 131 65 L 149 65 L 149 56 L 159 56 L 159 65 L 169 65 L 169 56 L 179 56 L 179 65" strokeWidth="1.2" />
      {/* Central Watchtower / Chhatri pavilion above Gate */}
      <path d="M 125 56 L 125 38 L 155 38 L 155 56" strokeWidth="1" />
      {/* Domed Roof & Finial */}
      <path d="M 122 38 Q 140 22 158 38" strokeWidth="1.2" />
      <line x1="140" y1="22" x2="140" y2="12" strokeWidth="1" />
      <circle cx="140" cy="11" r="1.5" strokeWidth="0.8" />
      {/* Chhatri Pillars */}
      <line x1="133" y1="38" x2="133" y2="56" strokeWidth="0.8" />
      <line x1="147" y1="38" x2="147" y2="56" strokeWidth="0.8" />

      {/* Massive Arched Fort Entrance */}
      <path d="M 122 160 L 122 118 Q 140 98 158 118 L 158 160" strokeWidth="1.3" />
      <path d="M 126 160 L 126 122 Q 140 106 154 122 L 154 160" strokeWidth="0.8" opacity="0.6" />
      {/* Fortress Wooden Door details (Iron Studs & Center line) */}
      <line x1="140" y1="108" x2="140" y2="160" strokeWidth="0.9" />
      <line x1="124" y1="135" x2="156" y2="135" strokeWidth="0.8" opacity="0.5" />
      <line x1="124" y1="150" x2="156" y2="150" strokeWidth="0.8" opacity="0.5" />

      {/* Right Curtain Wall */}
      <path d="M 175 108 L 212 108 L 212 160" strokeWidth="1.2" />
      <path d="M 175 108 L 181 108 L 181 102 L 187 102 L 187 108 L 193 108 L 193 102 L 199 102 L 199 108 L 205 108 L 205 102 L 212 102 L 212 108" strokeWidth="0.9" />

      {/* Outer Fort Right Bastion */}
      <path d="M 212 160 L 212 95 Q 212 80 230 80 Q 248 80 248 95 L 248 160" strokeWidth="1.2" />
      <path d="M 210 80 L 210 72 L 218 72 L 218 80 L 226 80 L 226 72 L 234 72 L 234 80 L 242 80 L 242 72 L 250 72 L 250 80" strokeWidth="1" />
      <line x1="230" y1="98" x2="230" y2="114" strokeWidth="1.5" />
      <line x1="230" y1="126" x2="230" y2="142" strokeWidth="1.5" />

      {/* Subtle masonry hatching lines */}
      <line x1="72" y1="120" x2="88" y2="120" strokeWidth="0.6" opacity="0.4" />
      <line x1="82" y1="136" x2="98" y2="136" strokeWidth="0.6" opacity="0.4" />
      <line x1="180" y1="120" x2="196" y2="120" strokeWidth="0.6" opacity="0.4" />
      <line x1="190" y1="136" x2="206" y2="136" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

// 2. Nashik: Ram Mandir (Shri Kalaram / Ram Mandir temple architecture - Shikhara tower, Amalaka, Kalasha, Mandapa pillars)
function RamMandirSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Architectural pencil drawing of Nashik Ram Mandir"
    >
      {/* Plinth (Adhishthana / Raised Temple Platform) */}
      <line x1="15" y1="165" x2="265" y2="165" strokeWidth="1.3" />
      <line x1="25" y1="160" x2="255" y2="160" strokeWidth="1" />
      <line x1="35" y1="155" x2="245" y2="155" strokeWidth="1" />

      {/* Front Entrance Steps (Sopana) */}
      <path d="M 220 165 L 220 155 L 245 155" strokeWidth="0.9" opacity="0.7" />

      {/* Main Garbhagriha & Shikhara (Sanctum Tower on Left/Center) */}
      {/* Vertical stepped profile of traditional Nagara/Hemadpanthi Shikhara */}
      <path
        d="M 65 155 L 65 105 L 75 105 L 75 75 L 85 75 L 85 50 L 95 50 L 95 30 L 105 30 L 105 18 L 115 18 L 115 30 L 125 30 L 125 50 L 135 50 L 135 75 L 145 75 L 145 105 L 155 105 L 155 155"
        strokeWidth="1.3"
      />

      {/* Curved Shikhara Urushringa (Miniature subsidiary spires) */}
      <path d="M 85 105 Q 110 35 110 18" strokeWidth="0.9" opacity="0.6" />
      <path d="M 135 105 Q 110 35 110 18" strokeWidth="0.9" opacity="0.6" />

      {/* Amalaka (Ribbed Stone Disc at the Peak) */}
      <ellipse cx="110" cy="16" rx="10" ry="3.5" strokeWidth="1.2" />
      {/* Kalasha (Sacred Pot) and Flag (Dhvaja) */}
      <path d="M 107 13 Q 110 9 113 13" strokeWidth="1" />
      <line x1="110" y1="9" x2="110" y2="2" strokeWidth="1.2" />
      {/* Triangular Temple Flag */}
      <path d="M 110 3 L 122 6 L 110 9 Z" strokeWidth="0.9" fill="none" />

      {/* Horizontal Carved Bands (Bhumi tiers) on Tower */}
      <line x1="72" y1="90" x2="148" y2="90" strokeWidth="0.8" opacity="0.7" />
      <line x1="79" y1="75" x2="141" y2="75" strokeWidth="0.8" opacity="0.7" />
      <line x1="86" y1="62" x2="134" y2="62" strokeWidth="0.8" opacity="0.7" />
      <line x1="93" y1="46" x2="127" y2="46" strokeWidth="0.8" opacity="0.7" />
      <line x1="98" y1="34" x2="122" y2="34" strokeWidth="0.8" opacity="0.7" />

      {/* Temple Sabha Mandapa (Pillared Assembly Hall to the right) */}
      {/* Pyramidal Samvarana roof over Mandapa */}
      <path d="M 155 115 L 185 80 L 215 115" strokeWidth="1.2" />
      <path d="M 165 115 L 185 92 L 205 115" strokeWidth="0.8" opacity="0.6" />
      <line x1="185" y1="80" x2="185" y2="73" strokeWidth="1" />
      <circle cx="185" cy="72" r="1.5" strokeWidth="0.9" />

      {/* Mandapa Classical Stone Pillars & Ornate Capitals */}
      {/* Pillar 1 */}
      <line x1="165" y1="115" x2="165" y2="155" strokeWidth="1.4" />
      <path d="M 160 118 L 170 118" strokeWidth="1" />
      <path d="M 161 152 L 169 152" strokeWidth="1" />

      {/* Pillar 2 */}
      <line x1="185" y1="115" x2="185" y2="155" strokeWidth="1.4" />
      <path d="M 180 118 L 190 118" strokeWidth="1" />
      <path d="M 181 152 L 189 152" strokeWidth="1" />

      {/* Pillar 3 */}
      <line x1="205" y1="115" x2="205" y2="155" strokeWidth="1.4" />
      <path d="M 200 118 L 210 118" strokeWidth="1" />
      <path d="M 201 152 L 209 152" strokeWidth="1" />

      {/* Pillar 4 (Front Portico) */}
      <line x1="225" y1="125" x2="225" y2="155" strokeWidth="1.4" />
      <path d="M 215 125 L 235 125" strokeWidth="1.1" />

      {/* Arched Sanctum Entrance & Deity Niche Doorway */}
      <path d="M 98 155 L 98 128 Q 110 120 122 128 L 122 155" strokeWidth="1.2" />
      <line x1="110" y1="120" x2="110" y2="155" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

// 3. Pune: Full Stack Development (Minimalist technical line-art: precision laptop, editor code lines, terminal prompt)
function FullStackLaptopSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Technical pencil drawing of development workspace with laptop and terminal"
    >
      {/* Desk surface horizon */}
      <line x1="20" y1="155" x2="260" y2="155" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

      {/* Laptop Base (Chassis) */}
      <path d="M 45 142 L 235 142 L 225 150 L 55 150 Z" strokeWidth="1.3" />
      {/* Trackpad notch */}
      <line x1="122" y1="144" x2="158" y2="144" strokeWidth="1" opacity="0.6" />

      {/* Laptop Screen Bezel */}
      <rect x="62" y="42" width="156" height="100" rx="4" strokeWidth="1.4" />
      {/* Inner Display Area */}
      <rect x="68" y="48" width="144" height="88" rx="2" strokeWidth="0.9" opacity="0.5" />

      {/* Top Webcam dot */}
      <circle cx="140" cy="45" r="0.9" strokeWidth="0.8" />

      {/* Window Title Bar */}
      <line x1="68" y1="58" x2="212" y2="58" strokeWidth="0.9" />
      {/* Window Controls (Three discrete dots) */}
      <circle cx="75" cy="53" r="1.5" strokeWidth="0.8" />
      <circle cx="81" cy="53" r="1.5" strokeWidth="0.8" />
      <circle cx="87" cy="53" r="1.5" strokeWidth="0.8" />

      {/* Editor Tab outline */}
      <path d="M 97 58 L 99 51 L 138 51 L 140 58" strokeWidth="0.8" opacity="0.6" />
      <line x1="105" y1="55" x2="132" y2="55" strokeWidth="0.7" opacity="0.6" />

      {/* Code Editor Left Pane (Syntax Tree / Code Lines) */}
      {/* Code line 1 */}
      <path d="M 76 68 L 84 68" strokeWidth="1.2" />
      <line x1="88" y1="68" x2="114" y2="68" strokeWidth="0.9" opacity="0.7" />
      <line x1="118" y1="68" x2="134" y2="68" strokeWidth="0.9" opacity="0.5" />

      {/* Code line 2 (indented) */}
      <line x1="84" y1="76" x2="100" y2="76" strokeWidth="1" />
      <line x1="104" y1="76" x2="128" y2="76" strokeWidth="0.8" opacity="0.6" />

      {/* Code line 3 (nested block) */}
      <line x1="90" y1="84" x2="118" y2="84" strokeWidth="0.9" opacity="0.8" />
      <line x1="122" y1="84" x2="142" y2="84" strokeWidth="0.7" opacity="0.5" />

      {/* Code line 4 (return statement) */}
      <line x1="84" y1="92" x2="96" y2="92" strokeWidth="1.2" />
      <line x1="100" y1="92" x2="130" y2="92" strokeWidth="0.8" opacity="0.7" />

      {/* Vertical Pane Divider */}
      <line x1="148" y1="58" x2="148" y2="136" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />

      {/* Right Pane: Embedded Terminal / REPL */}
      <line x1="156" y1="68" x2="204" y2="68" strokeWidth="0.7" opacity="0.4" />
      {/* Terminal prompt $> */}
      <path d="M 156 78 L 160 81 L 156 84" strokeWidth="1.2" />
      <line x1="164" y1="81" x2="194" y2="81" strokeWidth="0.9" opacity="0.8" />

      {/* Terminal response / build success */}
      <line x1="156" y1="92" x2="182" y2="92" strokeWidth="0.8" opacity="0.6" />
      <line x1="156" y1="100" x2="198" y2="100" strokeWidth="0.8" opacity="0.5" />

      {/* Floating Precision Syntax Symbols */}
      {/* Curly Braces { } */}
      <path d="M 40 76 Q 36 76 36 82 Q 36 86 33 87 Q 36 88 36 92 Q 36 98 40 98" strokeWidth="1" opacity="0.4" />
      <path d="M 240 76 Q 244 76 244 82 Q 244 86 247 87 Q 244 88 244 92 Q 244 98 240 98" strokeWidth="1" opacity="0.4" />

      {/* Code tags </ > */}
      <path d="M 48 116 L 40 122 L 48 128" strokeWidth="1" opacity="0.35" />
      <path d="M 232 116 L 240 122 L 232 128" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

// 4. Bangalore: Modern City Skyline (Clean architectural geometry, corporate tech towers, angular rooftops)
function BangaloreSkylineSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Architectural line drawing of Bangalore modern tech skyline"
    >
      {/* Ground baseline */}
      <line x1="15" y1="162" x2="265" y2="162" strokeWidth="1.3" />

      {/* Far Background Skyline Silhouettes (Fine low-opacity lines) */}
      <path d="M 30 162 L 30 115 L 48 115 L 48 162" strokeWidth="0.8" opacity="0.4" />
      <path d="M 52 162 L 52 95 L 68 95 L 68 162" strokeWidth="0.8" opacity="0.4" />
      <path d="M 198 162 L 198 100 L 214 100 L 214 162" strokeWidth="0.8" opacity="0.4" />
      <path d="M 220 162 L 220 110 L 245 110 L 245 162" strokeWidth="0.8" opacity="0.4" />

      {/* Tower 1 (Left Tech Park Tower with Spire) */}
      <path d="M 42 162 L 42 70 L 78 70 L 78 162" strokeWidth="1.2" />
      {/* Slanted glass crown */}
      <path d="M 42 70 L 60 52 L 78 70" strokeWidth="1" />
      <line x1="60" y1="52" x2="60" y2="35" strokeWidth="1.2" />
      {/* Grid of office windows */}
      <line x1="50" y1="82" x2="70" y2="82" strokeWidth="0.8" opacity="0.6" />
      <line x1="50" y1="96" x2="70" y2="96" strokeWidth="0.8" opacity="0.6" />
      <line x1="50" y1="110" x2="70" y2="110" strokeWidth="0.8" opacity="0.6" />
      <line x1="50" y1="124" x2="70" y2="124" strokeWidth="0.8" opacity="0.6" />
      <line x1="50" y1="138" x2="70" y2="138" strokeWidth="0.8" opacity="0.6" />
      <line x1="50" y1="152" x2="70" y2="152" strokeWidth="0.8" opacity="0.6" />

      {/* Tower 2: Tall Central Landmark Tower (Angular Facet) */}
      <path d="M 86 162 L 86 45 L 126 25 L 126 162" strokeWidth="1.4" />
      {/* Slanted glass facade fold line */}
      <line x1="106" y1="35" x2="106" y2="162" strokeWidth="0.9" opacity="0.5" />
      {/* Modern diagonal bracing / curtain-wall mullions */}
      <line x1="86" y1="58" x2="126" y2="58" strokeWidth="0.9" opacity="0.7" />
      <line x1="86" y1="80" x2="126" y2="80" strokeWidth="0.9" opacity="0.7" />
      <line x1="86" y1="102" x2="126" y2="102" strokeWidth="0.9" opacity="0.7" />
      <line x1="86" y1="124" x2="126" y2="124" strokeWidth="0.9" opacity="0.7" />
      <line x1="86" y1="146" x2="126" y2="146" strokeWidth="0.9" opacity="0.7" />
      {/* Communication Spire */}
      <line x1="126" y1="25" x2="126" y2="12" strokeWidth="1.2" />
      <circle cx="126" cy="11" r="1.5" strokeWidth="0.8" />

      {/* Tower 3: Stepped Corporate Campus Block */}
      <path d="M 134 162 L 134 60 L 174 60 L 174 162" strokeWidth="1.3" />
      <path d="M 142 60 L 142 42 L 166 42 L 166 60" strokeWidth="1" />
      {/* Louvers / Window Rows */}
      <line x1="142" y1="74" x2="166" y2="74" strokeWidth="0.9" opacity="0.6" />
      <line x1="142" y1="88" x2="166" y2="88" strokeWidth="0.9" opacity="0.6" />
      <line x1="142" y1="102" x2="166" y2="102" strokeWidth="0.9" opacity="0.6" />
      <line x1="142" y1="116" x2="166" y2="116" strokeWidth="0.9" opacity="0.6" />
      <line x1="142" y1="130" x2="166" y2="130" strokeWidth="0.9" opacity="0.6" />
      <line x1="142" y1="144" x2="166" y2="144" strokeWidth="0.9" opacity="0.6" />

      {/* Tower 4 (Right Curved / Modern Geometric Tower) */}
      <path d="M 182 162 L 182 78 Q 200 68 218 78 L 218 162" strokeWidth="1.2" />
      <line x1="190" y1="92" x2="210" y2="92" strokeWidth="0.8" opacity="0.6" />
      <line x1="190" y1="108" x2="210" y2="108" strokeWidth="0.8" opacity="0.6" />
      <line x1="190" y1="124" x2="210" y2="124" strokeWidth="0.8" opacity="0.6" />
      <line x1="190" y1="140" x2="210" y2="140" strokeWidth="0.8" opacity="0.6" />

      {/* Subtle modern flyover / metro viaduct trace at base */}
      <path d="M 20 152 Q 140 148 260 152" strokeWidth="0.9" opacity="0.3" strokeDasharray="4 4" />
    </svg>
  );
}

// 5. Goa: Goan Portuguese-Style Architecture (Distinctive tiled pitched roof, wooden balcão verandah, arched shuttered windows)
function GoanArchitectureSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Architectural pencil drawing of Goan Portuguese heritage house"
    >
      {/* Ground baseline */}
      <line x1="20" y1="162" x2="260" y2="162" strokeWidth="1.3" />

      {/* Main Terracotta Tiled Roof (Mangalore/Portuguese hip roof) */}
      <path d="M 40 82 L 140 32 L 240 82 Z" strokeWidth="1.4" />
      {/* Roof eaves overhang & cornice */}
      <line x1="32" y1="84" x2="248" y2="84" strokeWidth="1.2" />
      <line x1="35" y1="88" x2="245" y2="88" strokeWidth="0.8" opacity="0.6" />

      {/* Traditional Tile Ridge lines (Hatching details) */}
      <line x1="140" y1="32" x2="80" y2="82" strokeWidth="0.8" opacity="0.5" />
      <line x1="140" y1="32" x2="110" y2="82" strokeWidth="0.8" opacity="0.5" />
      <line x1="140" y1="32" x2="170" y2="82" strokeWidth="0.8" opacity="0.5" />
      <line x1="140" y1="32" x2="200" y2="82" strokeWidth="0.8" opacity="0.5" />

      {/* Roof Dormer Window (Mansard / Attic vent) */}
      <path d="M 125 58 L 140 46 L 155 58 Z" strokeWidth="1" />
      <rect x="130" y="58" width="20" height="14" strokeWidth="0.9" />
      <path d="M 130 58 Q 140 50 150 58" strokeWidth="0.7" />

      {/* Main Villa Facade Walls */}
      <path d="M 48 88 L 48 162 L 232 162 L 232 88" strokeWidth="1.3" />

      {/* Decorative Molded Quoins / Cornerstones */}
      <line x1="48" y1="102" x2="56" y2="102" strokeWidth="0.8" opacity="0.5" />
      <line x1="48" y1="116" x2="56" y2="116" strokeWidth="0.8" opacity="0.5" />
      <line x1="48" y1="130" x2="56" y2="130" strokeWidth="0.8" opacity="0.5" />
      <line x1="224" y1="102" x2="232" y2="102" strokeWidth="0.8" opacity="0.5" />
      <line x1="224" y1="116" x2="232" y2="116" strokeWidth="0.8" opacity="0.5" />
      <line x1="224" y1="130" x2="232" y2="130" strokeWidth="0.8" opacity="0.5" />

      {/* Left Arched Window with Ornamental Stucco Hood (Cornice) */}
      <path d="M 68 100 Q 82 90 96 100" strokeWidth="1" />
      <rect x="70" y="102" width="24" height="34" rx="2" strokeWidth="1" />
      <path d="M 70 102 Q 82 94 94 102" strokeWidth="0.8" />
      {/* Louvered Shutters (Reboco / Oyster shell shutters) */}
      <line x1="82" y1="98" x2="82" y2="136" strokeWidth="0.8" />
      <line x1="72" y1="112" x2="80" y2="112" strokeWidth="0.6" opacity="0.5" />
      <line x1="72" y1="122" x2="80" y2="122" strokeWidth="0.6" opacity="0.5" />
      <line x1="84" y1="112" x2="92" y2="112" strokeWidth="0.6" opacity="0.5" />
      <line x1="84" y1="122" x2="92" y2="122" strokeWidth="0.6" opacity="0.5" />

      {/* Right Arched Window */}
      <path d="M 184 100 Q 198 90 212 100" strokeWidth="1" />
      <rect x="186" y="102" width="24" height="34" rx="2" strokeWidth="1" />
      <path d="M 186 102 Q 198 94 210 102" strokeWidth="0.8" />
      <line x1="198" y1="98" x2="198" y2="136" strokeWidth="0.8" />
      <line x1="188" y1="112" x2="196" y2="112" strokeWidth="0.6" opacity="0.5" />
      <line x1="188" y1="122" x2="196" y2="122" strokeWidth="0.6" opacity="0.5" />
      <line x1="200" y1="112" x2="208" y2="112" strokeWidth="0.6" opacity="0.5" />
      <line x1="200" y1="122" x2="208" y2="122" strokeWidth="0.6" opacity="0.5" />

      {/* Central Goan Balcão (Covered Porch / Verandah) */}
      {/* Porch Gable Roof */}
      <path d="M 115 106 L 140 92 L 165 106" strokeWidth="1.2" />
      {/* Porch Support Pillars */}
      <line x1="122" y1="106" x2="122" y2="152" strokeWidth="1.3" />
      <line x1="158" y1="106" x2="158" y2="152" strokeWidth="1.3" />
      {/* Built-in Stone Bench (Balcão Seats) */}
      <path d="M 116 136 L 126 136 L 126 152" strokeWidth="0.9" opacity="0.6" />
      <path d="M 164 136 L 154 136 L 154 152" strokeWidth="0.9" opacity="0.6" />

      {/* Grand Double Wooden Door */}
      <path d="M 130 162 L 130 118 Q 140 110 150 118 L 150 162" strokeWidth="1.2" />
      <line x1="140" y1="114" x2="140" y2="162" strokeWidth="0.9" />

      {/* Porch Plinth Steps */}
      <line x1="115" y1="156" x2="165" y2="156" strokeWidth="1.1" />
      <line x1="110" y1="162" x2="170" y2="162" strokeWidth="1.2" />
    </svg>
  );
}

// 6. The Journey Continues (Futuristic technical horizon, rising infinite path, precision geometric rays)
function FutureHorizonSvg() {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full stroke-white/85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Minimalist technical drawing of ascending infinite path and horizon"
    >
      {/* Primary Horizon Line */}
      <line x1="10" y1="105" x2="270" y2="105" strokeWidth="1.3" />

      {/* Ascending Perspective Road / Path toward Infinity */}
      <path d="M 140 105 L 45 165" strokeWidth="1.4" />
      <path d="M 140 105 L 235 165" strokeWidth="1.4" />

      {/* Center Dashed Guidance Line */}
      <line x1="140" y1="105" x2="140" y2="165" strokeWidth="1.2" strokeDasharray="6 6" />

      {/* Perspective Transverse Grid Lines on the Ground */}
      <line x1="110" y1="120" x2="170" y2="120" strokeWidth="0.8" opacity="0.5" />
      <line x1="90" y1="134" x2="190" y2="134" strokeWidth="0.8" opacity="0.6" />
      <line x1="68" y1="149" x2="212" y2="149" strokeWidth="0.8" opacity="0.7" />

      {/* Minimalist Celestial / Singularity Circles at the Vanishing Point */}
      <circle cx="140" cy="80" r="28" strokeWidth="1.2" />
      <circle cx="140" cy="80" r="18" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="140" cy="80" r="4" strokeWidth="1" />

      {/* Subtle Radiant Architectural Lines (Sky Rays) */}
      <line x1="140" y1="46" x2="140" y2="22" strokeWidth="1" />
      <line x1="116" y1="56" x2="98" y2="38" strokeWidth="0.8" opacity="0.7" />
      <line x1="164" y1="56" x2="182" y2="38" strokeWidth="0.8" opacity="0.7" />
      <line x1="102" y1="80" x2="78" y2="80" strokeWidth="0.8" opacity="0.7" />
      <line x1="178" y1="80" x2="202" y2="80" strokeWidth="0.8" opacity="0.7" />

      {/* Technical Cartesian Compass / Coordinate Reticle Marks */}
      <line x1="130" y1="80" x2="150" y2="80" strokeWidth="0.8" opacity="0.6" />
      <line x1="140" y1="70" x2="140" y2="90" strokeWidth="0.8" opacity="0.6" />

      {/* Sub-horizon fine grid lines */}
      <line x1="30" y1="165" x2="250" y2="165" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
    </svg>
  );
}

const MILESTONES: MilestoneData[] = [
  {
    number: "01",
    yearWatermark: "2021",
    location: "Malegaon",
    dateLabel: "2018 – 2021",
    badgeType: "Academic",
    title: "10th SSC & 12th Science · Dual Academic Chapter",
    org: "Malegaon, Maharashtra",
    description:
      "Completed both 10th SSC (R. V. Shah High School, 87.40%) and 12th Science (M.S.G. Science College, 83.80%) in Malegaon.",
    tags: ["10th SSC · 87.40%", "12th Science · 83.80%", "Mathematics & Science"],
    illustrationTitle: "Bhuykot Castle (Bhuikot Fort)",
    svg: <BhuykotCastleSvg />,
    subEntries: [
      {
        subCode: "01.A",
        badgeType: "Academic",
        badgeLabel: "10TH SSC",
        dateLabel: "2018 – 2019",
        title: "Secondary School Certificate (10th)",
        org: "R. V. Shah High School, Malegaon",
        statBadge: "87.40%",
        description:
          "Completed 10th SSC board education in Malegaon with 87.40%, building strong analytical and mathematics fundamentals.",
        tags: ["87.40% Score", "2018 – 2019"],
      },
      {
        subCode: "01.B",
        badgeType: "Academic",
        badgeLabel: "12TH SCIENCE",
        dateLabel: "2020 – 2021",
        title: "Higher Secondary Certificate (12th Science)",
        org: "M.S.G. Science College, Malegaon",
        statBadge: "83.80%",
        description:
          "Completed 12th Science stream at M.S.G. Science College in Malegaon with 83.80% before transitioning into engineering.",
        tags: ["83.80% Score", "2020 – 2021"],
      },
    ],
  },
  {
    number: "02",
    yearWatermark: "2024",
    location: "Nashik",
    dateLabel: "2021 – 2025",
    badgeType: "Internship",
    title: "B.E. AI & Data Science + Frontend Internship",
    org: "Nashik, Maharashtra",
    description:
      "Completed B.E. in AI & Data Science at Sandip Institute of Technology (7.88 CGPA) alongside a 6-month Frontend Internship at NerdTech Software Company in Nashik.",
    tags: ["B.E. 7.88 CGPA", "NerdTech Internship", "React.js & Next.js"],
    illustrationTitle: "Nashik Ram Mandir",
    svg: <RamMandirSvg />,
    subEntries: [
      {
        subCode: "02.A",
        badgeType: "Academic",
        badgeLabel: "COLLEGE · B.E.",
        dateLabel: "2021 – 2025",
        title: "B.E. in AI & Data Science",
        org: "Sandip Institute of Technology & Research Centre",
        statBadge: "7.88 CGPA",
        description:
          "Undergraduate engineering in Nashik covering Data Structures, DBMS, OOP, Machine Learning, and Full-Stack Web Engineering.",
        tags: ["7.88 CGPA", "AI & Data Science"],
      },
      {
        subCode: "02.B",
        badgeType: "Internship",
        badgeLabel: "INTERNSHIP",
        dateLabel: "Nov 2023 – May 2024",
        title: "Frontend Development Intern",
        org: "NerdTech Software Company, Nashik",
        statBadge: "~20% Perf Boost",
        description:
          "Built responsive UIs for 5+ product pages using React.js, Next.js, Tailwind CSS & Bootstrap with reusable modular components.",
        tags: ["React.js & Next.js", "5+ Product Pages"],
      },
    ],
  },
  {
    number: "03",
    yearWatermark: "2025",
    location: "Pune",
    dateLabel: "2025 – Before Mar 2026",
    badgeType: "Training",
    title: "Full-Stack Development Trainee (Training — Not Employment)",
    org: "SpeedUp Infotech · Pune, Maharashtra",
    description:
      "Intensive hands-on Full-Stack training (≤ 8 months) in Node.js, Express.js, REST API architecture, PostgreSQL, MySQL, MongoDB, Redis caching, Prisma ORM, and Drizzle ORM.",
    tags: ["Node.js & Express", "PostgreSQL & MySQL", "MongoDB & Redis", "Prisma & Drizzle"],
    illustrationTitle: "Development Workspace & Terminal",
    svg: <FullStackLaptopSvg />,
  },
  {
    number: "04",
    yearWatermark: "2026",
    location: "Bengaluru",
    dateLabel: "March 2026 – May 2026",
    badgeType: "Employment",
    title: "Frontend Developer · Autonomous AI Sales Platform",
    org: "Tvara · Bengaluru, India",
    description:
      "Built frontend features for an autonomous AI sales platform supporting multi-channel workflows across email, WhatsApp, and telephony using Next.js App Router, TypeScript, and Tailwind CSS, integrated with backend microservices.",
    tags: ["Next.js App Router", "TypeScript", "Tailwind CSS", "Multi-Channel AI", "REST APIs"],
    illustrationTitle: "Bangalore Modern Skyline",
    svg: <BangaloreSkylineSvg />,
  },
  {
    number: "05",
    yearWatermark: "NOW",
    location: "Goa",
    dateLabel: "May 2026 – Present",
    badgeType: "Employment",
    title: "Full-Stack Developer · Present Role",
    org: "McFlyworld · Goa, India",
    description:
      "Currently working as a Full-Stack Developer — developing and maintaining 25+ websites using React and Next.js, building 2 software applications using Electron (desktop) and React Native (mobile), and implementing backend services with PHP, Laravel, Node.js, and Express.js.",
    tags: ["Present Role", "25+ React/Next.js Sites", "Electron & React Native", "Node.js & Laravel"],
    illustrationTitle: "Portuguese Architectural Heritage",
    svg: <GoanArchitectureSvg />,
  },
  {
    number: "06",
    yearWatermark: "NEXT",
    location: "The Journey Continues",
    dateLabel: "Horizon & Beyond",
    badgeType: "Present",
    title: "Still Writing the Next Chapters",
    org: "Always Building · Evolving Every Day",
    description:
      "The journey is still unfolding — pushing forward with distributed full-stack architectures, asynchronous worker pipelines, AI-powered workflows, and ambitious new engineering milestones ahead.",
    tags: ["Journey Continues", "Distributed Systems", "AI & Full-Stack Craft", "Onward →"],
    illustrationTitle: "Infinite Horizon & Path",
    svg: <FutureHorizonSvg />,
  },
];

export default function HomeJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgYearsFarRef = useRef<HTMLDivElement>(null);
  const bgSymbolsMidRef = useRef<HTMLDivElement>(null);
  const ledLineProgressRef = useRef<HTMLDivElement>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const revealedNodesRef = useRef<Set<number>>(new Set([0]));
  const [revealedNodes, setRevealedNodes] = useState<number[]>([0]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    const bgYearsFarEl = bgYearsFarRef.current;
    const bgSymbolsMidEl = bgSymbolsMidRef.current;
    const ledLineProgressEl = ledLineProgressRef.current;
    if (!sectionEl || !trackEl) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Responsive setup: Pin and scrub horizontally on desktop/tablet (width >= 1024px)
    const mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP & LARGE TABLET: Horizontal Scroll-Pinned Timeline
    // =========================================================================
    mm.add("(min-width: 1024px)", () => {
      // Calculate total horizontal scroll delta (track moves right -> left, so negative X)
      const getScrollAmount = () => -(trackEl.scrollWidth - window.innerWidth + 120);

      // Opposite direction parallax (left -> right, starting shifted left and moving right)
      // Far Layer (Giant Years: 2021, 2024, 2025, 2026) — slower depth speed
      // Mid Layer (Technical Symbols & Coordinates) — faster depth speed
      if (bgYearsFarEl) {
        gsap.set(bgYearsFarEl, { x: -950 });
      }
      if (bgSymbolsMidEl) {
        gsap.set(bgSymbolsMidEl, { x: -1650 });
      }

      // Velocity-clamped progress state so no matter how fast the user scrolls the mouse wheel,
      // the horizontal timeline and opposite-direction parallax layers advance at a controlled max speed
      let targetProgress = 0;
      let smoothedProgress = 0;
      const MAX_PROGRESS_SPEED_PER_SEC = 0.28; // Hard velocity cap across the 6 milestones
      const MAX_WHEEL_DELTA_PX = 44;

      const horizontalTimeline = gsap.timeline({ paused: true });

      if (!prefersReducedMotion) {
        // 1. Main Foreground Track: moves horizontally right-to-left (negative X)
        horizontalTimeline.to(
          trackEl,
          {
            x: getScrollAmount,
            ease: "none",
          },
          0
        );

        // 2. Far Background Layer (Giant Years 2021 • 2024 • 2025 • 2026): moves opposite direction (left-to-right) at slower far-object speed
        if (bgYearsFarEl) {
          horizontalTimeline.to(
            bgYearsFarEl,
            {
              x: 220,
              ease: "none",
            },
            0
          );
        }

        // 3. Mid Background Layer (Tech Symbols & Coordinates): moves opposite direction (left-to-right) at faster closer-object speed
        if (bgSymbolsMidEl) {
          horizontalTimeline.to(
            bgSymbolsMidEl,
            {
              x: 420,
              ease: "none",
            },
            0
          );
        }
      }

      const applyVisualProgress = (progress: number) => {
        horizontalTimeline.progress(progress);

        // Update active node index based on clamped scroll progress (0 to 5)
        const index = Math.min(
          Math.floor(progress * MILESTONES.length),
          MILESTONES.length - 1
        );
        setActiveMilestoneIndex(index);

        // Unlock reveal state for any milestone reached so illustration drops from top -> location
        if (!revealedNodesRef.current.has(index)) {
          revealedNodesRef.current.add(index);
          setRevealedNodes(Array.from(revealedNodesRef.current));
        }

        // Progress the glowing LED line width
        if (ledLineProgressEl) {
          ledLineProgressEl.style.width = `${progress * 100}%`;
        }
      };

      const st = ScrollTrigger.create({
        trigger: sectionEl,
        pin: true,
        scrub: true,
        refreshPriority: 3,
        start: "top top",
        end: () => `+=${Math.max(trackEl.scrollWidth - window.innerWidth + 800, 1800)}`,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          horizontalTimeline.invalidate();
          targetProgress = self.progress;
          smoothedProgress = self.progress;
          applyVisualProgress(smoothedProgress);
        },
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      const handleWheelClamp = (e: WheelEvent) => {
        if (!st.isActive) return;
        if (
          (e.deltaY < 0 && st.progress <= 0.002 && smoothedProgress <= 0.01) ||
          (e.deltaY > 0 && st.progress >= 0.998 && smoothedProgress >= 0.99)
        ) {
          return;
        }
        e.preventDefault();
        const clampedDelta =
          Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), MAX_WHEEL_DELTA_PX);
        window.scrollBy({ top: clampedDelta, left: 0, behavior: "instant" });
      };

      const tickProgress = () => {
        const diff = targetProgress - smoothedProgress;
        if (Math.abs(diff) < 0.0004) {
          if (smoothedProgress !== targetProgress) {
            smoothedProgress = targetProgress;
            applyVisualProgress(smoothedProgress);
          }
          return;
        }

        const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05);
        const maxStep = MAX_PROGRESS_SPEED_PER_SEC * dt;
        const dampedStep = diff * Math.min(1, dt * 8);
        const step =
          Math.abs(dampedStep) > maxStep
            ? Math.sign(diff) * maxStep
            : dampedStep;

        smoothedProgress = Math.max(0, Math.min(1, smoothedProgress + step));
        applyVisualProgress(smoothedProgress);
      };

      gsap.ticker.add(tickProgress);
      sectionEl.addEventListener("wheel", handleWheelClamp, { passive: false });

      return () => {
        gsap.ticker.remove(tickProgress);
        sectionEl.removeEventListener("wheel", handleWheelClamp);
        st.kill();
        horizontalTimeline.kill();
      };
    });

    // =========================================================================
    // MOBILE & COMPACT TABLET: Smooth Vertical Scroll Progression
    // =========================================================================
    mm.add("(max-width: 1023px)", () => {
      const mobileNodes = sectionEl.querySelectorAll(".mobile-milestone-node");

      mobileNodes.forEach((node, idx) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top 75%",
          end: "bottom 25%",
          onEnter: () => {
            setActiveMilestoneIndex(idx);
            if (!revealedNodesRef.current.has(idx)) {
              revealedNodesRef.current.add(idx);
              setRevealedNodes(Array.from(revealedNodesRef.current));
            }
          },
          onEnterBack: () => setActiveMilestoneIndex(idx),
        });
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionEl) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full bg-[#000000] text-white selection:bg-white selection:text-black overflow-hidden font-sans border-t border-neutral-900 lg:h-screen lg:flex lg:flex-col lg:justify-between"
      aria-label="Chronological Journey Timeline"
    >
      {/* Editorial Header */}
      <div className="relative z-20 w-full pt-16 sm:pt-20 lg:pt-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 lg:pb-5 border-b border-white/10 shrink-0">
        <div>

          <h2 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-extrabold tracking-tight uppercase leading-[0.95] text-white">
            The Journey<span className="text-white/40">.</span>
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 font-mono text-xs text-neutral-400">
          <span className="tracking-widest uppercase">Editorial Timeline</span>
          <span className="text-[11px] text-neutral-500">
            {MILESTONES[activeMilestoneIndex].dateLabel} &middot; {MILESTONES[activeMilestoneIndex].location}
          </span>
        </div>
      </div>

      {/* =======================================================================
          DESKTOP: Continuous Horizontal Timeline (min-width: 1024px)
          ======================================================================= */}
      <div className="hidden lg:block relative w-full flex-1 min-h-0 overflow-hidden">
        {/* ── PARALLAX LAYER 1 (FAR OBJECTS — Slower Reverse Drift): Giant Year Watermarks ── */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center overflow-hidden select-none">
          <div
            ref={bgYearsFarRef}
            className="flex items-center gap-28 whitespace-nowrap font-black tracking-[-0.05em] text-white/[0.045] will-change-transform"
            style={{ fontSize: "clamp(10rem, 21vw, 24rem)", lineHeight: 0.85 }}
          >
            <span>2021</span>
            <span className="text-white/[0.025]">•</span>
            <span>2024</span>
            <span className="text-white/[0.025]">•</span>
            <span>2025</span>
            <span className="text-white/[0.025]">•</span>
            <span>2026</span>
            <span className="text-white/[0.025]">•</span>
            <span>BEYOND</span>
          </div>
        </div>

        {/* ── PARALLAX LAYER 2 (CLOSER MID-GROUND OBJECTS — Faster Reverse Drift): Symbols & Tech Telemetry ── */}
        <div className="absolute inset-0 pointer-events-none z-1 flex flex-col justify-between py-12 overflow-hidden select-none">
          {/* Upper telemetry symbol ribbon */}
          <div
            ref={bgSymbolsMidRef}
            className="flex items-center gap-16 whitespace-nowrap font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-white/[0.13] will-change-transform"
          >
            <span>✦ [ 2021 // B.E. AI &amp; DS · 7.88 CGPA ]</span>
            <span className="text-[#ff5500]/40">❖</span>
            <span>⟪ NERDTECH INTERN · REACT &amp; NEXT.JS ⟫</span>
            <span className="text-[#ff5500]/40">✦</span>
            <span>[ 2025 // SPEEDUP INFOTECH · FULL-STACK TRAINING ]</span>
            <span className="text-[#ff5500]/40">❖</span>
            <span>⟪ 2026 // TVARA · BENGALURU · AI SALES PLATFORM ⟫</span>
            <span className="text-[#ff5500]/40">✦</span>
            <span>[ 2026 // MCFLYWORLD · GOA · 25+ SITES &amp; 2 APPS ]</span>
            <span className="text-[#ff5500]/40">❖</span>
            <span>⟪ PUNE · 18.5204° N, 73.8567° E ⟫</span>
          </div>
        </div>

        {/* Main Central Glowing LED Timeline Axis (Locked vertically at 50% viewport height) */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 z-10 pointer-events-none">
          {/* Base Background Track: Thin white rule */}
          <div className="absolute inset-0 bg-white/15" />

          {/* Active LED Light Strip with Diffusion Halo */}
          <div
            ref={ledLineProgressRef}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-white via-white to-[#ff5500] transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_24px_rgba(255,85,0,0.55)]"
            style={{ width: "16%" }}
          />
        </div>

        {/* Scrollable Track Container */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center pl-16 pr-32 select-none z-15"
          style={{ width: "max-content" }}
        >
          {MILESTONES.map((item, idx) => {
            const isTop = idx % 2 === 0; // Alternating layout: even items above axis, odd items below
            const isActive = activeMilestoneIndex >= idx;
            const isCurrent = activeMilestoneIndex === idx;
            const isRevealed = revealedNodes.includes(idx) || isActive;

            const hasSubEntries = Boolean(item.subEntries && item.subEntries.length > 0);

            const getBadgeStyle = (type: MilestoneData["badgeType"]) =>
              type === "Employment"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : type === "Internship"
                ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                : type === "Training"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : type === "Present"
                ? "bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40"
                : "bg-white/10 text-white/80 border-white/20";

            const badgeColor = getBadgeStyle(item.badgeType);

            return (
              <div
                key={item.number}
                className={`relative flex flex-col items-center justify-center h-full px-6 shrink-0 ${
                  hasSubEntries ? "w-[680px]" : "w-[490px]"
                }`}
              >
                {/* 1. TOP POSITIONED CONTENT (When isTop === true) */}
                {isTop ? (
                  <div className="absolute bottom-[calc(50%+20px)] left-4 right-4 flex flex-col items-center text-center">
                    {/* Architectural Pencil-Line Drawing Card — Appears from opacity 0 and drops from top (-translate-y-12) to its location */}
                    <div
                      className={`milestone-illustration ${
                        hasSubEntries ? "w-[220px] h-[115px] mb-2" : "w-[240px] h-[135px] mb-3"
                      } p-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isCurrent
                          ? "opacity-100 translate-y-0 scale-100 filter drop-shadow-[0_0_18px_rgba(255,85,0,0.28)]"
                          : isRevealed
                          ? "opacity-75 translate-y-0 scale-[0.97]"
                          : "opacity-0 -translate-y-12 scale-90"
                      }`}
                    >
                      {item.svg}
                    </div>

                    {/* Shared City Header */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-1 text-[10px] font-mono tracking-widest uppercase">
                      {hasSubEntries ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold transition-colors duration-500 ${
                            isCurrent
                              ? "bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40"
                              : "bg-white/10 text-white/80 border-white/20"
                          }`}
                        >
                          SAME CITY &middot; {item.subEntries!.length} CHAPTERS
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold transition-colors duration-500 ${badgeColor}`}
                        >
                          {item.badgeType === "Training"
                            ? "TRAINING (NOT EMPLOYMENT)"
                            : item.badgeType === "Present"
                            ? "JOURNEY CONTINUES"
                            : item.number === "05"
                            ? "CURRENT ROLE · EMPLOYMENT"
                            : item.badgeType}
                        </span>
                      )}
                      <span
                        className={`font-semibold transition-colors duration-500 ${
                          isCurrent ? "text-[#ff5500]" : "text-white"
                        }`}
                      >
                        [{item.number}]
                      </span>
                      <span className="text-neutral-500">&middot;</span>
                      <span
                        className={`transition-colors duration-500 ${
                          isCurrent ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        {item.dateLabel}
                      </span>
                    </div>

                    {/* Location & Organization with color animation */}
                    <h3
                      className={`text-lg font-bold tracking-tight mb-0.5 transition-colors duration-500 ${
                        isCurrent
                          ? "text-[#ff5500] drop-shadow-[0_0_12px_rgba(255,85,0,0.35)]"
                          : isActive
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    >
                      {hasSubEntries ? item.location : `${item.location} — ${item.org}`}
                    </h3>

                    {hasSubEntries ? (
                      <>
                        {/* Two Separate Sub-Milestone Cards inside the Same City */}
                        <div className="grid grid-cols-2 gap-3 w-full mt-2 text-left">
                          {item.subEntries!.map((sub) => (
                            <div
                              key={sub.subCode}
                              className={`relative rounded-xl border p-3 transition-all duration-500 backdrop-blur-sm ${
                                isCurrent
                                  ? "bg-white/[0.045] border-[#ff5500]/45 shadow-[0_0_24px_rgba(255,85,0,0.12)]"
                                  : isActive
                                  ? "bg-white/[0.025] border-white/15"
                                  : "bg-white/[0.015] border-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 mb-1 font-mono text-[9px] uppercase tracking-wider">
                                <span
                                  className={`px-1.5 py-0.5 rounded border font-bold ${getBadgeStyle(
                                    sub.badgeType
                                  )}`}
                                >
                                  {sub.badgeLabel}
                                </span>
                                <span
                                  className={
                                    isCurrent ? "text-[#ff5500] font-semibold" : "text-neutral-400"
                                  }
                                >
                                  {sub.dateLabel}
                                </span>
                              </div>

                              <h4
                                className={`text-xs font-bold leading-snug transition-colors duration-500 ${
                                  isCurrent ? "text-white" : "text-neutral-200"
                                }`}
                              >
                                {sub.title}
                              </h4>

                              <p
                                className={`text-[10px] font-mono mt-0.5 transition-colors duration-500 ${
                                  isCurrent ? "text-[#ff5500]" : "text-neutral-400"
                                }`}
                              >
                                {sub.org}
                              </p>

                              <p
                                className={`text-[11px] font-light leading-relaxed mt-1.5 transition-colors duration-500 ${
                                  isCurrent ? "text-zinc-200" : "text-neutral-400"
                                }`}
                              >
                                {sub.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-1 mt-2">
                                {sub.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] border transition-colors duration-500 ${
                                      isCurrent
                                        ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                        : "bg-white/5 border-white/10 text-neutral-400"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className={`text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-500 ${
                            isCurrent
                              ? "text-white"
                              : isActive
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          {item.title}
                        </p>

                        {/* Concise Editorial Description */}
                        <p
                          className={`text-xs font-light leading-relaxed max-w-[390px] transition-colors duration-500 ${
                            isCurrent
                              ? "text-zinc-200"
                              : isActive
                              ? "text-neutral-400"
                              : "text-neutral-600"
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Tech / Achievement Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-md font-mono text-[9px] border transition-all duration-500 ${
                                isCurrent
                                  ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                  : "bg-white/5 border-white/10 text-neutral-400"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Thin Vertical LED Connector Line down to Axis */}
                    <div
                      className={`w-[1px] h-4 mt-2.5 transition-colors duration-500 ${
                        isCurrent
                          ? "bg-gradient-to-b from-[#ff5500] to-white"
                          : "bg-gradient-to-b from-white/40 to-white/90"
                      }`}
                    />
                  </div>
                ) : null}

                {/* 2. CENTRAL MILESTONE NODE (Sits directly on the horizontal axis) */}
                <div
                  className="relative z-20 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: isCurrent ? "scale(1.3)" : "scale(1)" }}
                >
                  {/* Outer Diffused Glow Ring */}
                  <div
                    className={`absolute w-8 h-8 rounded-full transition-opacity duration-500 pointer-events-none ${
                      isCurrent
                        ? "opacity-100 bg-[#ff5500]/20 ring-1 ring-[#ff5500]/70 shadow-[0_0_20px_rgba(255,85,0,0.85)]"
                        : isActive
                        ? "opacity-40 bg-white/5"
                        : "opacity-0"
                    }`}
                  />

                  {/* Core Circular Node */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#ff5500] border-white shadow-[0_0_10px_#ff5500,0_0_20px_#ff5500]"
                        : isActive
                        ? "bg-white border-white"
                        : "bg-black border-white/40"
                    }`}
                  />
                </div>

                {/* 3. BOTTOM POSITIONED CONTENT (When isTop === false) */}
                {!isTop ? (
                  <div className="absolute top-[calc(50%+20px)] left-4 right-4 flex flex-col items-center text-center">
                    {/* Thin Vertical LED Connector Line up from Axis */}
                    <div
                      className={`w-[1px] h-4 mb-2.5 transition-colors duration-500 ${
                        isCurrent
                          ? "bg-gradient-to-t from-[#ff5500] to-white"
                          : "bg-gradient-to-t from-white/40 to-white/90"
                      }`}
                    />

                    {/* Shared City Header */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-1 text-[10px] font-mono tracking-widest uppercase">
                      {hasSubEntries ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold transition-colors duration-500 ${
                            isCurrent
                              ? "bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40"
                              : "bg-white/10 text-white/80 border-white/20"
                          }`}
                        >
                          SAME CITY &middot; {item.subEntries!.length} CHAPTERS
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold transition-colors duration-500 ${badgeColor}`}
                        >
                          {item.badgeType === "Training"
                            ? "TRAINING (NOT EMPLOYMENT)"
                            : item.badgeType === "Present"
                            ? "JOURNEY CONTINUES"
                            : item.number === "05"
                            ? "CURRENT ROLE · EMPLOYMENT"
                            : item.badgeType}
                        </span>
                      )}
                      <span
                        className={`font-semibold transition-colors duration-500 ${
                          isCurrent ? "text-[#ff5500]" : "text-white"
                        }`}
                      >
                        [{item.number}]
                      </span>
                      <span className="text-neutral-500">&middot;</span>
                      <span
                        className={`transition-colors duration-500 ${
                          isCurrent ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        {item.dateLabel}
                      </span>
                    </div>

                    {/* Location & Organization with color animation */}
                    <h3
                      className={`text-lg font-bold tracking-tight mb-0.5 transition-colors duration-500 ${
                        isCurrent
                          ? "text-[#ff5500] drop-shadow-[0_0_12px_rgba(255,85,0,0.35)]"
                          : isActive
                          ? "text-white"
                          : "text-neutral-500"
                      }`}
                    >
                      {hasSubEntries ? item.location : `${item.location} — ${item.org}`}
                    </h3>

                    {hasSubEntries ? (
                      <>
                        {/* Two Separate Sub-Milestone Cards inside the Same City */}
                        <div className="grid grid-cols-2 gap-3 w-full mt-2 mb-2.5 text-left">
                          {item.subEntries!.map((sub) => (
                            <div
                              key={sub.subCode}
                              className={`relative rounded-xl border p-3 transition-all duration-500 backdrop-blur-sm ${
                                isCurrent
                                  ? "bg-white/[0.045] border-[#ff5500]/45 shadow-[0_0_24px_rgba(255,85,0,0.12)]"
                                  : isActive
                                  ? "bg-white/[0.025] border-white/15"
                                  : "bg-white/[0.015] border-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 mb-1 font-mono text-[9px] uppercase tracking-wider">
                                <span
                                  className={`px-1.5 py-0.5 rounded border font-bold ${getBadgeStyle(
                                    sub.badgeType
                                  )}`}
                                >
                                  {sub.badgeLabel}
                                </span>
                                <span
                                  className={
                                    isCurrent ? "text-[#ff5500] font-semibold" : "text-neutral-400"
                                  }
                                >
                                  {sub.dateLabel}
                                </span>
                              </div>

                              <h4
                                className={`text-xs font-bold leading-snug transition-colors duration-500 ${
                                  isCurrent ? "text-white" : "text-neutral-200"
                                }`}
                              >
                                {sub.title}
                              </h4>

                              <p
                                className={`text-[10px] font-mono mt-0.5 transition-colors duration-500 ${
                                  isCurrent ? "text-[#ff5500]" : "text-neutral-400"
                                }`}
                              >
                                {sub.org}
                              </p>

                              <p
                                className={`text-[11px] font-light leading-relaxed mt-1.5 transition-colors duration-500 ${
                                  isCurrent ? "text-zinc-200" : "text-neutral-400"
                                }`}
                              >
                                {sub.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-1 mt-2">
                                {sub.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`px-1.5 py-0.5 rounded font-mono text-[8.5px] border transition-colors duration-500 ${
                                      isCurrent
                                        ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                        : "bg-white/5 border-white/10 text-neutral-400"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className={`text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-500 ${
                            isCurrent
                              ? "text-white"
                              : isActive
                              ? "text-neutral-300"
                              : "text-neutral-500"
                          }`}
                        >
                          {item.title}
                        </p>

                        {/* Concise Editorial Description */}
                        <p
                          className={`text-xs font-light leading-relaxed max-w-[390px] transition-colors duration-500 ${
                            isCurrent
                              ? "text-zinc-200"
                              : isActive
                              ? "text-neutral-400"
                              : "text-neutral-600"
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Tech / Achievement Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 mb-3">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded-md font-mono text-[9px] border transition-all duration-500 ${
                                isCurrent
                                  ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                  : "bg-white/5 border-white/10 text-neutral-400"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Architectural Pencil-Line Drawing Card — Appears from opacity 0 and drops from top (-translate-y-12) to its location */}
                    <div
                      className={`milestone-illustration ${
                        hasSubEntries ? "w-[220px] h-[115px]" : "w-[240px] h-[135px]"
                      } p-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isCurrent
                          ? "opacity-100 translate-y-0 scale-100 filter drop-shadow-[0_0_18px_rgba(255,85,0,0.28)]"
                          : isRevealed
                          ? "opacity-75 translate-y-0 scale-[0.97]"
                          : "opacity-0 -translate-y-12 scale-90"
                      }`}
                    >
                      {item.svg}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Ambient bottom progress indicators */}
        <div className="absolute bottom-6 left-16 right-16 flex items-center justify-between text-[11px] font-mono text-neutral-500 z-10 pointer-events-none">
          <span>01 / MALEGAON</span>
          <div className="flex items-center gap-2">
            {MILESTONES.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeMilestoneIndex === i
                    ? "bg-white scale-125 shadow-[0_0_6px_#ffffff]"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <span>06 / PRESENT &amp; BEYOND</span>
        </div>
      </div>

      {/* =======================================================================
          MOBILE & TABLET: Vertical Stacked Timeline (max-width: 1023px)
          ======================================================================= */}
      <div className="block lg:hidden relative w-full py-12 sm:py-16 px-4 sm:px-8 md:px-12">
        {/* Continuous Left Vertical Glowing Axis Line */}
        <div className="absolute top-12 bottom-12 left-7 sm:left-11 md:left-15 w-[1px] bg-white/20">
          {/* Glowing accent track */}
          <div
            className="w-full bg-white shadow-[0_0_10px_#ffffff]"
            style={{
              height: `${((activeMilestoneIndex + 1) / MILESTONES.length) * 100}%`,
              transition: "height 0.4s ease-out",
            }}
          />
        </div>

        <div className="flex flex-col space-y-12 sm:space-y-16">
          {MILESTONES.map((item, idx) => {
            const isCurrent = activeMilestoneIndex === idx;
            const isRevealed = revealedNodes.includes(idx) || activeMilestoneIndex >= idx;

            const hasSubEntries = Boolean(item.subEntries && item.subEntries.length > 0);

            const getBadgeStyle = (type: MilestoneData["badgeType"]) =>
              type === "Employment"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : type === "Internship"
                ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                : type === "Training"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : type === "Present"
                ? "bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40"
                : "bg-white/10 text-white/80 border-white/20";

            const badgeColor = getBadgeStyle(item.badgeType);

            return (
              <div
                key={item.number}
                className="mobile-milestone-node relative flex items-start gap-4 sm:gap-8 pl-1 sm:pl-4 group overflow-hidden"
              >
                {/* Subtle Background Year Watermark on Mobile */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute right-2 top-0 text-6xl sm:text-7xl font-black tracking-tighter text-white/[0.04]"
                >
                  {item.yearWatermark}
                </span>

                {/* Node circle on the vertical axis */}
                <div className="relative z-10 mt-1 shrink-0 flex items-center justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#ff5500] border-white shadow-[0_0_12px_#ff5500,0_0_20px_#ff5500] scale-125"
                        : "bg-black border-white/50"
                    }`}
                  />
                </div>

                {/* Content Group (To the right of the timeline) */}
                <div className="flex flex-col space-y-2.5 w-full">
                  {/* Meta Label */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                    {hasSubEntries ? (
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${
                          isCurrent
                            ? "bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40"
                            : "bg-white/10 text-white/80 border-white/20"
                        }`}
                      >
                        SAME CITY &middot; {item.subEntries!.length} CHAPTERS
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${badgeColor}`}
                      >
                        {item.badgeType === "Training"
                          ? "TRAINING (NOT EMPLOYMENT)"
                          : item.badgeType === "Present"
                          ? "JOURNEY CONTINUES"
                          : item.number === "05"
                          ? "CURRENT ROLE · EMPLOYMENT"
                          : item.badgeType}
                      </span>
                    )}
                    <span className={isCurrent ? "text-[#ff5500] font-semibold" : "text-white font-semibold"}>
                      [{item.number}]
                    </span>
                    <span className="text-neutral-500">&middot;</span>
                    <span className={isCurrent ? "text-white" : "text-neutral-400"}>
                      {item.dateLabel}
                    </span>
                  </div>

                  {/* Heading & Subtitle */}
                  <div>
                    <h3
                      className={`text-lg sm:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                        isCurrent ? "text-[#ff5500]" : "text-white"
                      }`}
                    >
                      {hasSubEntries ? item.location : `${item.location} — ${item.org}`}
                    </h3>
                    <p
                      className={`text-[11px] sm:text-xs font-mono uppercase tracking-wider mt-0.5 transition-colors duration-500 ${
                        isCurrent ? "text-white" : "text-neutral-400"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>

                  {hasSubEntries ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-2xl">
                      {item.subEntries!.map((sub) => (
                        <div
                          key={sub.subCode}
                          className={`rounded-xl border p-3.5 transition-all duration-500 ${
                            isCurrent
                              ? "bg-white/[0.045] border-[#ff5500]/45 shadow-[0_0_20px_rgba(255,85,0,0.1)]"
                              : "bg-white/[0.02] border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[9px] uppercase tracking-wider">
                            <span
                              className={`px-1.5 py-0.5 rounded border font-bold ${getBadgeStyle(
                                sub.badgeType
                              )}`}
                            >
                              {sub.badgeLabel}
                            </span>
                            <span
                              className={
                                isCurrent ? "text-[#ff5500] font-semibold" : "text-neutral-400"
                              }
                            >
                              {sub.dateLabel}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white leading-snug">
                            {sub.title}
                          </h4>
                          <p
                            className={`text-[11px] font-mono mt-0.5 ${
                              isCurrent ? "text-[#ff5500]" : "text-neutral-400"
                            }`}
                          >
                            {sub.org}
                          </p>
                          <p className="text-xs font-light text-zinc-300 leading-relaxed mt-1.5">
                            {sub.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {sub.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-1.5 py-0.5 rounded font-mono text-[9px] border ${
                                  isCurrent
                                    ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                    : "bg-white/5 border-white/10 text-neutral-400"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Description */}
                      <p
                        className={`text-xs sm:text-sm font-light leading-relaxed max-w-xl transition-colors duration-500 ${
                          isCurrent ? "text-zinc-200" : "text-neutral-400"
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Tech / Achievement Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-md font-mono text-[9px] border transition-colors duration-500 ${
                              isCurrent
                                ? "bg-[#ff5500]/15 border-[#ff5500]/40 text-white"
                                : "bg-white/5 border-white/10 text-neutral-400"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Architectural Illustration — Appears from opacity 0 and drops from top to location */}
                  <div
                    className={`w-full max-w-[280px] h-[150px] pt-2 pb-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isRevealed
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-10"
                    }`}
                  >
                    {item.svg}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
