"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Architectural SVG Illustrations
// All in crisp, fine white line-drawing style (stroke="#FFFFFF", strokeWidth="1" to "1.5", transparent fills)
export interface MilestoneData {
  number: string;
  location: string;
  dateLabel: string;
  title: string;
  description: string;
  illustrationTitle: string;
  svg: React.ReactNode;
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
    location: "Malegaon",
    dateLabel: "School Years",
    title: "School Education",
    description: "Completed my 10th and 12th education in Malegaon, Maharashtra.",
    illustrationTitle: "Bhuykot Castle (Bhuikot Fort)",
    svg: <BhuykotCastleSvg />,
  },
  {
    number: "02",
    location: "Nashik",
    dateLabel: "Engineering Years",
    title: "Engineering",
    description:
      "Completed my engineering degree in Artificial Intelligence and Data Science in Nashik, Maharashtra.",
    illustrationTitle: "Nashik Ram Mandir",
    svg: <RamMandirSvg />,
  },
  {
    number: "03",
    location: "Pune",
    dateLabel: "Professional Training",
    title: "Full Stack Development",
    description:
      "Completed a Full Stack Development course in Pune, strengthening my practical web development skills.",
    illustrationTitle: "Development Workspace & Terminal",
    svg: <FullStackLaptopSvg />,
  },
  {
    number: "04",
    location: "Bangalore",
    dateLabel: "3 Months",
    title: "Professional Experience",
    description:
      "Completed three months of professional work experience in Bangalore, gaining practical industry exposure.",
    illustrationTitle: "Bangalore Modern Skyline",
    svg: <BangaloreSkylineSvg />,
  },
  {
    number: "05",
    location: "Goa",
    dateLabel: "3 Months",
    title: "Professional Experience",
    description:
      "Completed three months of professional work experience in Goa, continuing to develop my technical and professional skills.",
    illustrationTitle: "Portuguese Architectural Heritage",
    svg: <GoanArchitectureSvg />,
  },
  {
    number: "06",
    location: "The Journey Continues",
    dateLabel: "Present",
    title: "What's Next",
    description:
      "Continuing to build, learn, and create meaningful software products while growing as a developer.",
    illustrationTitle: "Infinite Horizon & Path",
    svg: <FutureHorizonSvg />,
  },
];

export default function HomeJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ledLineProgressRef = useRef<HTMLDivElement>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
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
      // Calculate total horizontal scroll delta
      const getScrollAmount = () => -(trackEl.scrollWidth - window.innerWidth + 120);

      const horizontalTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${Math.max(trackEl.scrollWidth - window.innerWidth + 800, 1800)}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update active node index based on scroll progress (0 to 5)
            const index = Math.min(
              Math.floor(self.progress * MILESTONES.length),
              MILESTONES.length - 1
            );
            setActiveMilestoneIndex(index);

            // Progress the glowing LED line width
            if (ledLineProgressEl) {
              ledLineProgressEl.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      if (!prefersReducedMotion) {
        // Slide track horizontally
        horizontalTimeline.to(trackEl, {
          x: getScrollAmount,
          ease: "none",
        });

        // Stagger subtle parallax on illustrations
        const illustrations = trackEl.querySelectorAll(".milestone-illustration");
        illustrations.forEach((ill) => {
          horizontalTimeline.to(
            ill,
            {
              y: -8,
              ease: "none",
            },
            0
          );
        });
      }

      return () => {
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
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => setActiveMilestoneIndex(idx),
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
      className="relative w-full bg-[#000000] text-white selection:bg-white selection:text-black overflow-hidden font-sans border-t border-neutral-900"
      aria-label="Chronological Journey Timeline"
    >
      {/* Editorial Header */}
      <div className="relative z-20 w-full pt-16 sm:pt-20 lg:pt-24 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <span>Chronology // 01 — 06</span>
          </div>

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
      <div className="hidden lg:block relative w-full h-[78vh] min-h-[640px] overflow-hidden">
        {/* Main Central Glowing LED Timeline Axis (Locked vertically at 50% viewport height) */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 z-10 pointer-events-none">
          {/* Base Background Track: Thin white rule */}
          <div className="absolute inset-0 bg-white/15" />

          {/* Active LED Light Strip with Diffusion Halo */}
          <div
            ref={ledLineProgressRef}
            className="absolute top-0 left-0 h-full bg-white transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_24px_rgba(255,255,255,0.45)]"
            style={{ width: "16%" }}
          />
        </div>

        {/* Scrollable Track Container */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center pl-16 pr-32 select-none"
          style={{ width: "max-content" }}
        >
          {MILESTONES.map((item, idx) => {
            const isTop = idx % 2 === 0; // Alternating layout: even items above axis, odd items below
            const isActive = activeMilestoneIndex >= idx;
            const isCurrent = activeMilestoneIndex === idx;

            return (
              <div
                key={item.number}
                className="relative flex flex-col items-center justify-center w-[460px] h-full px-6 shrink-0"
              >
                {/* 1. TOP POSITIONED CONTENT (When isTop === true) */}
                {isTop ? (
                  <div className="absolute bottom-[calc(50%+24px)] left-6 right-6 flex flex-col items-center text-center">
                    {/* Architectural Pencil-Line Drawing Card */}
                    <div
                      className={`milestone-illustration w-[260px] h-[155px] mb-4 p-2.5 transition-all duration-500 ease-out ${
                        isCurrent
                          ? "opacity-100 scale-100 filter drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]"
                          : isActive
                          ? "opacity-75 scale-[0.98]"
                          : "opacity-35 scale-95"
                      }`}
                    >
                      {item.svg}
                    </div>

                    {/* Meta Label: Date & Milestone Number */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                      <span className="text-white font-semibold">[{item.number}]</span>
                      <span>&middot;</span>
                      <span>{item.dateLabel}</span>
                    </div>

                    {/* Location & Title */}
                    <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                      {item.location}
                    </h3>

                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                      {item.title}
                    </p>

                    {/* Concise Editorial Description */}
                    <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-[340px]">
                      {item.description}
                    </p>

                    {/* Thin Vertical LED Connector Line down to Axis */}
                    <div className="w-[1px] h-6 mt-4 bg-gradient-to-b from-white/40 to-white/90" />
                  </div>
                ) : null}

                {/* 2. CENTRAL MILESTONE NODE (Sits directly on the horizontal axis) */}
                <div
                  className="relative z-20 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: isCurrent ? "scale(1.25)" : "scale(1)" }}
                >
                  {/* Outer Diffused Glow Ring */}
                  <div
                    className={`absolute w-8 h-8 rounded-full transition-opacity duration-500 pointer-events-none ${
                      isCurrent
                        ? "opacity-100 bg-white/10 ring-1 ring-white/60 shadow-[0_0_18px_rgba(255,255,255,0.8)]"
                        : isActive
                        ? "opacity-40 bg-white/5"
                        : "opacity-0"
                    }`}
                  />

                  {/* Core White Circular Node */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border border-white transition-all duration-300 ${
                      isCurrent
                        ? "bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff]"
                        : isActive
                        ? "bg-white/90"
                        : "bg-black border-white/40"
                    }`}
                  />
                </div>

                {/* 3. BOTTOM POSITIONED CONTENT (When isTop === false) */}
                {!isTop ? (
                  <div className="absolute top-[calc(50%+24px)] left-6 right-6 flex flex-col items-center text-center">
                    {/* Thin Vertical LED Connector Line up from Axis */}
                    <div className="w-[1px] h-6 mb-4 bg-gradient-to-t from-white/40 to-white/90" />

                    {/* Meta Label: Date & Milestone Number */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                      <span className="text-white font-semibold">[{item.number}]</span>
                      <span>&middot;</span>
                      <span>{item.dateLabel}</span>
                    </div>

                    {/* Location & Title */}
                    <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                      {item.location}
                    </h3>

                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                      {item.title}
                    </p>

                    {/* Concise Editorial Description */}
                    <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-[340px] mb-4">
                      {item.description}
                    </p>

                    {/* Architectural Pencil-Line Drawing Card */}
                    <div
                      className={`milestone-illustration w-[260px] h-[155px] p-2.5 transition-all duration-500 ease-out ${
                        isCurrent
                          ? "opacity-100 scale-100 filter drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]"
                          : isActive
                          ? "opacity-75 scale-[0.98]"
                          : "opacity-35 scale-95"
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
      <div className="block lg:hidden relative w-full py-16 px-6 sm:px-12">
        {/* Continuous Left Vertical Glowing Axis Line */}
        <div className="absolute top-16 bottom-16 left-9 sm:left-15 w-[1px] bg-white/20">
          {/* Glowing accent track */}
          <div
            className="w-full bg-white shadow-[0_0_10px_#ffffff]"
            style={{
              height: `${((activeMilestoneIndex + 1) / MILESTONES.length) * 100}%`,
              transition: "height 0.4s ease-out",
            }}
          />
        </div>

        <div className="flex flex-col space-y-16 sm:space-y-20">
          {MILESTONES.map((item, idx) => {
            const isCurrent = activeMilestoneIndex === idx;

            return (
              <div
                key={item.number}
                className="mobile-milestone-node relative flex items-start gap-6 sm:gap-10 pl-2 sm:pl-8 group"
              >
                {/* Node circle on the vertical axis */}
                <div className="relative z-10 mt-1 shrink-0 flex items-center justify-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border border-white transition-all duration-300 ${
                      isCurrent
                        ? "bg-white shadow-[0_0_12px_#ffffff,0_0_20px_#ffffff] scale-125"
                        : "bg-black border-white/50"
                    }`}
                  />
                </div>

                {/* Content Group (To the right of the timeline) */}
                <div className="flex flex-col space-y-3 w-full">
                  {/* Meta Label */}
                  <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                    <span className="text-white font-semibold">[{item.number}]</span>
                    <span>&middot;</span>
                    <span>{item.dateLabel}</span>
                  </div>

                  {/* Heading & Subtitle */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {item.location}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 mt-0.5">
                      {item.title}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-xl">
                    {item.description}
                  </p>

                  {/* Architectural Illustration */}
                  <div className="w-full max-w-[280px] h-[160px] pt-3 pb-1 transition-opacity duration-300">
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
