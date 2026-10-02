"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, X } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================================
   Project Data
   ========================================================================= */
export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  client?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "codenarts",
    title: "CODENARTS",
    category: "CREATIVE AGENCY / 3D",
    year: "2025",
    desc: "A bold creative agency website featuring futuristic Golden and purple visuals, seamless animations, and immersive storytelling.",
    image: "/assets/images/projects/cod-1.avif",
    tags: ["Next.js", "Three.js", "GSAP", "WebGL", "Creative Dev"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Codenarts Studio",
  },
  {
    id: "az-digital",
    title: "AZ-DIGITAL-VENTURES",
    category: "BRANDING / WEB APP",
    year: "2025",
    desc: "A bold digital agency website showcasing premium branding, striking typography, and conversion-focused services with a modern editorial aesthetic.",
    image: "/assets/images/projects/az-1.avif",
    tags: ["React 19", "Tailwind CSS", "Motion", "Editorial"],
    liveUrl: "https://www.meermohsin.me/",
    client: "AZ Digital Ventures",
  },
  {
    id: "amron",
    title: "AMRON",
    category: "MOTION & 3D DESIGN",
    year: "2025",
    desc: "A futuristic creative agency concept featuring bold 3D visuals, cinematic motion, and a premium digital aesthetic that emphasizes storytelling and visual impact.",
    image: "/assets/images/projects/am-1.avif",
    tags: ["WebGL", "Three.js", "FBO Shaders", "3D Optic"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Amron Creative Lab",
  },
  {
    id: "chatone",
    title: "CHATONE",
    category: "PRODUCT DESIGN / SAAS",
    year: "2025",
    desc: "A clean, light-themed messaging app designed for effortless conversations, real-time communication, and an intuitive user experience.",
    image: "/assets/images/projects/chat-1.avif",
    tags: ["Product Design", "TypeScript", "Realtime WebSocket"],
    liveUrl: "https://www.meermohsin.me/",
    client: "ChatOne Global",
  },
  {
    id: "finance",
    title: "FINANCE AI",
    category: "FINTECH / DESIGN SYSTEM",
    year: "2026",
    desc: "A futuristic finance platform combining glowing green visuals, intuitive dashboards, and seamless banking for modern users.",
    image: "/assets/images/projects/fi-1.avif",
    tags: ["Fintech", "Dark Mode UI", "Data Visualization", "GSAP"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Finance AI Technologies",
  },
];

/* =========================================================================
   Constants
   ========================================================================= */
// Scroll architecture: each project occupies vhPerProject of pinned scroll.
// localProgress 0 → HOLD_END: project is stable (only circle updates).
// localProgress HOLD_END → 1: the stack slides to the next project.
const HOLD_END = 0.78; // 78% of each segment is stable hold
const CIRCUMFERENCE = 2 * Math.PI * 32; // SVG circle r=32 → ≈ 201.06px

// Card stack visual constants
const PREVIEW_SCALE = 0.38; // scale of the previous/next preview cards
const PREVIEW_OPACITY = 0.52;
const PREVIEW_BLUR = 3; // px
const PREVIEW_BRIGHTNESS = 0.65;

// Y offsets: how far above/below center the preview cards sit (in px)
// These are set via JS so they can react to window.innerHeight
const getPreviewOffsets = (vh: number) => ({
  // top preview: center of card is approx (active card height / 2 * scale + gap) above center
  prevY: -(vh * 0.5 + vh * 0.08), // well above center, partially clipped
  nextY: vh * 0.5 + vh * 0.08, // well below center, partially clipped
});

/* =========================================================================
   Project Modal
   ========================================================================= */
interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = React.memo(function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close Preview"
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#ff5500] uppercase tracking-wider">
              {project.category} • {project.year}
            </span>
            {project.client && (
              <span className="text-xs font-mono text-zinc-400">
                Client: {project.client}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            {project.desc}
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-6 flex items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                <span>Launch Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/* =========================================================================
   Main Component

   Visual layout:
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       [prev card – small]                           │
   │                                                                     │
   │   TITLE           [active card – large]         DESCRIPTION         │
   │                                                                     │
   │                            ○ 02                                     │
   │                       [next card – small]                           │
   └─────────────────────────────────────────────────────────────────────┘

   Each card is absolutely positioned at the viewport center.
   Y-transform moves it to prev/active/next position.
   During hold: only the circle strokeDashoffset changes.
   During transition: the entire stack slides upward (all three positions).
   ========================================================================= */
export default function ProjectsShowcase() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // One DOM ref per project for the card wrapper
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // One DOM ref per project for the blurred background layer
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // One DOM ref per project for the left title block
  const titleBlockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // One DOM ref per project for the right description block
  const descBlockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Progress ring and step counter
  const circleRef = useRef<SVGCircleElement>(null);
  const stepNumberRef = useRef<HTMLSpanElement>(null);

  // Modal
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  // Guard: only the active card should open the modal on click
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const total = PROJECTS.length;
    const maxIdx = total - 1;

    // Initialise circle dasharray
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${CIRCUMFERENCE}`;
      circleRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`;
    }

    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    // Hermite smoothstep
    const ss = (t: number) => t * t * (3 - 2 * t);

    /* ------------------------------------------------------------------
       applyCardState — set a card's transform, opacity, filter, z-index
       position: -1 = prev preview (above), 0 = active (center), 1 = next preview (below)
       t: 0 = fully in that position, used during transition blending
    ------------------------------------------------------------------ */
    const applyCardState = (
      el: HTMLDivElement | null,
      position: -1 | 0 | 1 | "hidden",
      vh: number
    ) => {
      if (!el) return;
      const { prevY, nextY } = getPreviewOffsets(vh);

      if (position === "hidden") {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.zIndex = "1";
        return;
      }

      if (position === 0) {
        // Active
        el.style.transform = `translate(-50%, calc(-50%))`;
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.zIndex = "20";
        el.style.pointerEvents = "auto";
      } else if (position === -1) {
        // Previous preview (above)
        el.style.transform = `translate(-50%, calc(-50% + ${prevY}px)) scale(${PREVIEW_SCALE})`;
        el.style.opacity = `${PREVIEW_OPACITY}`;
        el.style.filter = `blur(${PREVIEW_BLUR}px) brightness(${PREVIEW_BRIGHTNESS})`;
        el.style.zIndex = "10";
        el.style.pointerEvents = "none";
      } else {
        // Next preview (below)
        el.style.transform = `translate(-50%, calc(-50% + ${nextY}px)) scale(${PREVIEW_SCALE})`;
        el.style.opacity = `${PREVIEW_OPACITY}`;
        el.style.filter = `blur(${PREVIEW_BLUR}px) brightness(${PREVIEW_BRIGHTNESS})`;
        el.style.zIndex = "10";
        el.style.pointerEvents = "none";
      }
    };

    /* ------------------------------------------------------------------
       setStack — set the whole 3-card stack to a stable state for project[idx]
    ------------------------------------------------------------------ */
    const setStack = (idx: number) => {
      const vh = window.innerHeight;
      for (let i = 0; i < total; i++) {
        const el = cardRefs.current[i];
        if (i === idx - 1) applyCardState(el, -1, vh);
        else if (i === idx) applyCardState(el, 0, vh);
        else if (i === idx + 1) applyCardState(el, 1, vh);
        else applyCardState(el, "hidden", vh);
      }
    };

    /* ------------------------------------------------------------------
       setBg — show only the active background
    ------------------------------------------------------------------ */
    const setBg = (idx: number) => {
      for (let i = 0; i < total; i++) {
        const el = bgRefs.current[i];
        if (!el) continue;
        el.style.opacity = i === idx ? "0.85" : "0";
      }
    };

    /* ------------------------------------------------------------------
       setTextBlock — show only the title/desc for project[idx]
    ------------------------------------------------------------------ */
    const setTextBlock = (idx: number) => {
      for (let i = 0; i < total; i++) {
        const title = titleBlockRefs.current[i];
        const desc = descBlockRefs.current[i];
        if (title) {
          title.style.opacity = i === idx ? "1" : "0";
          title.style.transform = "translateY(0px)";
        }
        if (desc) {
          desc.style.opacity = i === idx ? "1" : "0";
          desc.style.transform = "translateY(0px)";
        }
      }
    };

    // Bootstrap initial state
    setStack(0);
    setBg(0);
    setTextBlock(0);

    /* ------------------------------------------------------------------
       Core update — one ScrollTrigger onUpdate drives all of this
    ------------------------------------------------------------------ */
    let lastCurrentIndex = 0;

    const updateShowcase = (progress: number) => {
      const vh = window.innerHeight;
      const { prevY, nextY } = getPreviewOffsets(vh);

      // projectProgress: 0 → maxIdx
      const projectProgress = progress * maxIdx;

      // currentIndex: which project is "active" (being held or leaving)
      const currentIndex = clamp(Math.floor(projectProgress), 0, maxIdx);
      const localProgress =
        currentIndex === maxIdx ? 1 : projectProgress - currentIndex;

      currentIndexRef.current = currentIndex;

      /* ── 1. Progress circle (only continuously-changing element) ── */
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - localProgress)}`;
      }

      /* ── 2. Step number — update instantly on index change ── */
      if (currentIndex !== lastCurrentIndex) {
        lastCurrentIndex = currentIndex;
        if (stepNumberRef.current) {
          stepNumberRef.current.textContent = String(currentIndex + 1).padStart(
            2,
            "0"
          );
        }
      }

      /* ── 3. Transition window ── */
      const rawT = (localProgress - HOLD_END) / (1 - HOLD_END);
      const transitionProgress = clamp(rawT, 0, 1);
      const t = ss(transitionProgress); // smoothstepped 0→1

      /* ── 4. HOLD phase: set stable 3-card stack, return early ── */
      if (transitionProgress === 0) {
        setStack(currentIndex);
        setBg(currentIndex);
        setTextBlock(currentIndex);
        return;
      }

      /* ── 5. LAST project: stay permanently visible ── */
      if (currentIndex === maxIdx) {
        setStack(maxIdx);
        setBg(maxIdx);
        setTextBlock(maxIdx);
        return;
      }

      /* ── 6. TRANSITION phase: slide the whole stack upward ──
         The entire stack translates upward such that:
           - currentIndex  : active → prev position (shrinks, fades)
           - currentIndex+1: next preview → active (grows, sharpens)
           - currentIndex-1: prev preview → further offscreen (disappears)
           - currentIndex+2: hidden → next preview (appears)
      ── */
      const nextIndex = currentIndex + 1;

      for (let i = 0; i < total; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        // Determine this card's start and end position in the transition
        let startY = 0;
        let endY = 0;
        let startScale = 1;
        let endScale = 1;
        let startOpacity = 0;
        let endOpacity = 0;
        let startBlur = 0;
        let endBlur = 0;
        let startBrightness = 1;
        let endBrightness = 1;
        let startZ = 1;
        let endZ = 1;
        let participates = false;

        if (i === currentIndex) {
          // Active → becomes top preview (moves up, shrinks)
          startY = 0;
          endY = prevY;
          startScale = 1;
          endScale = PREVIEW_SCALE;
          startOpacity = 1;
          endOpacity = PREVIEW_OPACITY;
          startBlur = 0;
          endBlur = PREVIEW_BLUR;
          startBrightness = 1;
          endBrightness = PREVIEW_BRIGHTNESS;
          startZ = 20;
          endZ = 10;
          participates = true;
        } else if (i === nextIndex) {
          // Bottom preview → becomes active (moves up to center, grows)
          startY = nextY;
          endY = 0;
          startScale = PREVIEW_SCALE;
          endScale = 1;
          startOpacity = PREVIEW_OPACITY;
          endOpacity = 1;
          startBlur = PREVIEW_BLUR;
          endBlur = 0;
          startBrightness = PREVIEW_BRIGHTNESS;
          endBrightness = 1;
          startZ = 10;
          endZ = 20;
          participates = true;
        } else if (i === currentIndex - 1) {
          // Top preview → slides further up off-screen (disappears)
          startY = prevY;
          endY = prevY * 1.8;
          startScale = PREVIEW_SCALE;
          endScale = PREVIEW_SCALE * 0.6;
          startOpacity = PREVIEW_OPACITY;
          endOpacity = 0;
          startBlur = PREVIEW_BLUR;
          endBlur = PREVIEW_BLUR + 2;
          startBrightness = PREVIEW_BRIGHTNESS;
          endBrightness = PREVIEW_BRIGHTNESS * 0.5;
          startZ = 10;
          endZ = 5;
          participates = true;
        } else if (i === nextIndex + 1 && nextIndex + 1 < total) {
          // Hidden → slides in from below (becomes new bottom preview)
          startY = nextY * 1.8;
          endY = nextY;
          startScale = PREVIEW_SCALE * 0.6;
          endScale = PREVIEW_SCALE;
          startOpacity = 0;
          endOpacity = PREVIEW_OPACITY;
          startBlur = PREVIEW_BLUR + 2;
          endBlur = PREVIEW_BLUR;
          startBrightness = PREVIEW_BRIGHTNESS * 0.5;
          endBrightness = PREVIEW_BRIGHTNESS;
          startZ = 5;
          endZ = 10;
          participates = true;
        }

        if (!participates) {
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
          card.style.zIndex = "1";
          continue;
        }

        // Interpolate using smoothstepped t
        const y = startY + (endY - startY) * t;
        const scale = startScale + (endScale - startScale) * t;
        const opacity = startOpacity + (endOpacity - startOpacity) * t;
        const blur = startBlur + (endBlur - startBlur) * t;
        const brightness =
          startBrightness + (endBrightness - startBrightness) * t;
        const z = Math.round(startZ + (endZ - startZ) * t);

        card.style.transform = `translate(-50%, calc(-50% + ${y}px)) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter =
          blur < 0.1
            ? "none"
            : `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;
        card.style.zIndex = `${z}`;
        card.style.pointerEvents = i === currentIndex && t < 0.4 ? "auto" : "none";
      }

      /* ── 7. Background crossfade during transition ── */
      const outBg = bgRefs.current[currentIndex];
      const inBg = bgRefs.current[nextIndex];
      if (outBg) outBg.style.opacity = `${(1 - t) * 0.85}`;
      if (inBg) inBg.style.opacity = `${t * 0.85}`;
      // Hide any others
      for (let i = 0; i < total; i++) {
        if (i !== currentIndex && i !== nextIndex) {
          const bg = bgRefs.current[i];
          if (bg) bg.style.opacity = "0";
        }
      }

      /* ── 8. Text transition — simple fade + subtle Y shift ── */
      const outTitle = titleBlockRefs.current[currentIndex];
      const outDesc = descBlockRefs.current[currentIndex];
      const inTitle = titleBlockRefs.current[nextIndex];
      const inDesc = descBlockRefs.current[nextIndex];

      if (outTitle) {
        outTitle.style.opacity = `${1 - t}`;
        outTitle.style.transform = `translateY(${-t * 12}px)`;
      }
      if (outDesc) {
        outDesc.style.opacity = `${1 - t}`;
        outDesc.style.transform = `translateY(${-t * 8}px)`;
      }
      if (inTitle) {
        inTitle.style.opacity = `${t}`;
        inTitle.style.transform = `translateY(${(1 - t) * 12}px)`;
      }
      if (inDesc) {
        inDesc.style.opacity = `${t}`;
        inDesc.style.transform = `translateY(${(1 - t) * 8}px)`;
      }
      // Hide other text blocks
      for (let i = 0; i < total; i++) {
        if (i !== currentIndex && i !== nextIndex) {
          const title = titleBlockRefs.current[i];
          const desc = descBlockRefs.current[i];
          if (title) { title.style.opacity = "0"; title.style.transform = "translateY(0px)"; }
          if (desc) { desc.style.opacity = "0"; desc.style.transform = "translateY(0px)"; }
        }
      }
    };

    // Bootstrap
    updateShowcase(0);

    /* ------------------------------------------------------------------
       Single ScrollTrigger.
       550vh per project on desktop → very long hold before transition.
       The transition itself is the last 22% of the segment (HOLD_END=0.78).
    ------------------------------------------------------------------ */
    const isMobile = window.innerWidth < 768;
    const vhPerProject = isMobile ? 380 : 550;
    const totalScrollDistance = `${maxIdx * vhPerProject}vh`;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${totalScrollDistance}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateShowcase(self.progress);
        },
      });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleCardClick = (project: Project, index: number) => {
    if (index === currentIndexRef.current) {
      setActiveModal(project);
    }
  };

  return (
    <div
      ref={pinWrapperRef}
      className="relative w-full max-w-none bg-[#0a0a0d] select-none text-white overflow-clip"
    >
      {/* ── Pinned Showcase Viewport ── */}
      <div
        ref={containerRef}
        id="work"
        className="relative h-screen overflow-hidden bg-[#09090b] m-0"
        style={{
          width: "100vw",
          maxWidth: "none",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {/* ── Blurred full-screen backgrounds ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {PROJECTS.map((project, i) => (
            <div
              key={`bg-${project.id}`}
              ref={(el) => { bgRefs.current[i] = el; }}
              className="absolute inset-0 w-full h-full will-change-[opacity]"
              style={{ opacity: i === 0 ? 0.85 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover filter blur-[28px] scale-110 transform-gpu brightness-[0.9] contrast-[1.02]"
              />
            </div>
          ))}
          {/* Dark overlay + vignette */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_60%,rgba(9,9,11,0.65)_100%)] pointer-events-none" />
        </div>

        {/* ── Top-left emblem ── */}
        <div className="absolute top-8 left-6 sm:left-10 md:left-14 z-30 pointer-events-none">
          <svg
            width="44"
            height="44"
            viewBox="0 0 100 100"
            fill="none"
            className="text-white opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            <path
              d="M50 8 C48 24 38 35 24 38 C14 40 8 48 10 54 C12 60 22 56 30 64 C38 72 44 85 50 94 C56 85 62 72 70 64 C78 56 88 60 90 54 C92 48 86 40 76 38 C62 35 52 24 50 8 Z"
              fill="currentColor"
            />
            <path
              d="M50 25 C45 35 34 42 20 45 C28 50 36 50 42 58 C46 64 48 74 50 80 C52 74 54 64 58 58 C64 50 72 50 80 45 C66 42 55 35 50 25 Z"
              fill="#09090b"
            />
            <circle cx="50" cy="50" r="3.5" fill="currentColor" />
          </svg>
        </div>

        {/* ── Left: title blocks — positioned at vertical center, left side ── */}
        {/*
            On desktop: `left-[5vw]` max-width ~240px — sits comfortably
            between the viewport edge and the centered card.
        */}
        <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 z-25 pointer-events-none w-[22vw] max-w-[260px] min-w-[160px]">
          <div className="relative w-full min-h-[10rem] flex items-center">
            {PROJECTS.map((project, i) => (
              <div
                key={`title-${project.id}`}
                ref={(el) => { titleBlockRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: "translateY(0px)",
                  pointerEvents: "none",
                }}
              >
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-[#ff5500] mb-2 block leading-tight">
                  {project.category}
                  <br />
                  <span className="text-white/40">•</span> {project.year}
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
                  {project.title}
                </h1>
              </div>
            ))}
          </div>
        </div>

        {/* ── Project cards: all absolutely centered, transformed by JS ── */}
        {/*
            The card wrapper sits at left:50%, top:50%.
            JS applies: translate(-50%, calc(-50% + Ypx)) scale(s)
            This moves cards to their prev/active/next positions.
        */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              id={`project-card-${project.id}`}
              onClick={() => handleCardClick(project, index)}
              className="absolute left-1/2 top-1/2 will-change-[opacity,transform,filter] cursor-pointer select-none
                         w-[72vw] h-[50vh] sm:w-[60vw] sm:h-[52vh] md:w-[50vw] md:h-[56vh] lg:w-[44vw] lg:h-[58vh]
                         max-w-[820px] max-h-[540px]"
              style={{
                opacity: index === 0 ? 1 : index === 1 ? PREVIEW_OPACITY : 0,
                transform:
                  index === 0
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(1)", // JS sets proper Y on first run
                pointerEvents: index === 0 ? "auto" : "none",
                zIndex: index === 0 ? 20 : 10,
              }}
            >
              <div className="w-full h-full relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] group">
                <div className="relative w-full h-full overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-105"
                    loading="eager"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="px-5 py-2.5 bg-white/20 border border-white/40 text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <span>View Case Study</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: description blocks ── */}
        {/*
            Positioned so it sits in the gap between the card's right edge
            and the viewport right edge. On a typical 1440px screen with a
            44vw card (≈ 634px wide), the card right edge is at ~73vw.
            We place the description starting at ~76vw, capped at a comfortable
            max-width so it doesn't bleed to the edge.
        */}
        <div className="absolute top-1/2 -translate-y-1/2 z-25 pointer-events-none hidden sm:block"
          style={{ left: "calc(50% + min(22vw, 420px) + 3vw)", maxWidth: "clamp(180px, 18vw, 300px)" }}>
          <div className="relative w-full min-h-[140px] flex items-center">
            {PROJECTS.map((project, i) => (
              <div
                key={`desc-${project.id}`}
                ref={(el) => { descBlockRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: "translateY(0px)",
                  pointerEvents: "none",
                }}
              >
                <p className="text-[11px] sm:text-[12px] md:text-[13px] text-zinc-200 font-normal leading-[1.7] tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  {project.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Circular progress indicator ── */}
        {/*
            Sits below the center card. On desktop: centered horizontally,
            offset downward from center to roughly where the bottom of the
            active card sits.
        */}
        <div className="absolute left-1/2 -translate-x-1/2 z-25 pointer-events-none flex items-center justify-center"
          style={{ top: "calc(50% + min(29vh, 300px))" }}>
          <div className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] flex items-center justify-center">
            <svg
              width="60"
              height="60"
              viewBox="0 0 80 80"
              className="w-full h-full -rotate-90"
            >
              {/* Track */}
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.6"
                fill="none"
              />
              {/* Animated fill */}
              <circle
                ref={circleRef}
                cx="40"
                cy="40"
                r="32"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={`${CIRCUMFERENCE}`}
                className="will-change-[stroke-dashoffset]"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                ref={stepNumberRef}
                className="text-sm sm:text-base font-serif italic text-white tracking-tight leading-none"
              >
                01
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom ledger bar ── */}
        <div className="absolute bottom-4 left-0 w-full z-30 flex items-center justify-around px-6 sm:px-8 pointer-events-none text-[9px] sm:text-[10px] md:text-xs font-mono tracking-[0.28em] text-white/55 uppercase">
          <span className="text-white/30 font-light">✕</span>
          <span>TENSION</span>
          <span className="text-white/30 font-light">✕</span>
          <span>IMMERSION</span>
          <span className="text-white/30 font-light">✕</span>
          <span>IMPACT</span>
          <span className="text-white/30 font-light">✕</span>
        </div>
      </div>

      {/* ── Project detail modal ── */}
      {activeModal && (
        <ProjectModal
          project={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
