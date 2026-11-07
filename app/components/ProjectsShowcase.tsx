"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useNav } from "@/app/context/NavContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExternalLink, ArrowUpRight } from "lucide-react";

const FluidGlass = dynamic(() => import("@/app/components/ui/FluidGlass"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { PROJECTS, type Project } from "@/app/data/projects";
export { PROJECTS, type Project };

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

  // Guard: only the active card should open the project on click
  const currentIndexRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasFinePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      const pinWrapper = pinWrapperRef.current;
      const container = containerRef.current;
      if (!pinWrapper || !container) return;

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
          el.style.opacity = i === idx ? "0.95" : "0";
        }
      };

      /* ------------------------------------------------------------------
         setWordsProgress — reveal words in descBlockRefs[idx] sequentially (one word at a time)
         revealProgress: 0 = no words visible, 1 = all words visible
      ------------------------------------------------------------------ */
      const setWordsProgress = (idx: number, revealProgress: number) => {
        const desc = descBlockRefs.current[idx];
        if (!desc) return;
        const words = desc.querySelectorAll<HTMLSpanElement>(".desc-word");
        const count = words.length;
        if (count === 0) return;

        // Each word gets a staggered window across 0 -> 1 so they appear one by one
        const spread = 0.82; // start times span 0 -> 0.82, each word takes 0.18 to fade/slide in
        const wordDuration = 1 - spread;

        words.forEach((word, wIdx) => {
          const start = count > 1 ? (wIdx / (count - 1)) * spread : 0;
          const rawW = (revealProgress - start) / wordDuration;
          const w = clamp(rawW, 0, 1);
          const eased = ss(w);
          word.style.opacity = `${eased}`;
          word.style.transform = `translateY(${(1 - eased) * 6}px)`;
          word.style.filter = eased < 0.95 ? `blur(${((1 - eased) * 3).toFixed(1)}px)` : "none";
        });
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
            title.style.pointerEvents = i === idx ? "auto" : "none";
          }
          if (desc) {
            desc.style.opacity = i === idx ? "1" : "0";
            desc.style.transform = "translateY(0px)";
            desc.style.pointerEvents = i === idx ? "auto" : "none";
            setWordsProgress(i, i === idx ? 1 : 0);
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

        // Total of `total` segments (0 to total).
        // Each project from 0 to maxIdx - 1 gets a full segment (hold + transition).
        // The last project (maxIdx) gets a dedicated hold segment so the user can view it before unpinning into the CTA section.
        const totalSegments = maxIdx + HOLD_END;
        const projectProgress = progress * totalSegments;

        // currentIndex: which project is "active" (being held or leaving)
        const currentIndex = clamp(Math.floor(projectProgress), 0, maxIdx);
        const rawSegmentProgress = projectProgress - currentIndex;
        const localProgress =
          currentIndex === maxIdx
            ? clamp(rawSegmentProgress / HOLD_END, 0, 1)
            : clamp(rawSegmentProgress, 0, 1);

        currentIndexRef.current = currentIndex;

        /* ── 1. Progress circle (only continuously-changing element) ── */
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - localProgress)}`;
        }

        /* ── 2. Step number — update instantly on index change ── */
        if (currentIndex !== lastCurrentIndex) {
          lastCurrentIndex = currentIndex;
          setActiveIdx(currentIndex);
          if (stepNumberRef.current) {
            stepNumberRef.current.textContent = String(currentIndex + 1).padStart(
              2,
              "0"
            );
          }
        }

        /* ── 3. LAST project: stay permanently visible during its hold segment ── */
        if (currentIndex === maxIdx) {
          setStack(maxIdx);
          setBg(maxIdx);
          setTextBlock(maxIdx);
          return;
        }

        /* ── 4. Transition window ── */
        const rawT = (localProgress - HOLD_END) / (1 - HOLD_END);
        const transitionProgress = clamp(rawT, 0, 1);
        const t = ss(transitionProgress); // smoothstepped 0→1

        /* ── 5. HOLD phase: set stable 3-card stack, return early ── */
        if (transitionProgress === 0) {
          setStack(currentIndex);
          setBg(currentIndex);
          setTextBlock(currentIndex);
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
        if (outBg) outBg.style.opacity = `${(1 - t) * 0.95}`;
        if (inBg) inBg.style.opacity = `${t * 0.95}`;
        // Hide any others
        for (let i = 0; i < total; i++) {
          if (i !== currentIndex && i !== nextIndex) {
            const bg = bgRefs.current[i];
            if (bg) bg.style.opacity = "0";
          }
        }

        /* ── 8. Text transition — outgoing whole sentence vanishes together; incoming appears one word at a time ── */
        const outTitle = titleBlockRefs.current[currentIndex];
        const outDesc = descBlockRefs.current[currentIndex];
        const inTitle = titleBlockRefs.current[nextIndex];
        const inDesc = descBlockRefs.current[nextIndex];

        if (outTitle) {
          outTitle.style.opacity = `${1 - t}`;
          outTitle.style.transform = `translateY(${-t * 12}px)`;
          outTitle.style.pointerEvents = t < 0.4 ? "auto" : "none";
        }
        if (outDesc) {
          // Whole sentence vanishes together as a single block (keeping all words at full opacity inside)
          setWordsProgress(currentIndex, 1);
          outDesc.style.opacity = `${Math.max(0, 1 - t * 1.4)}`;
          outDesc.style.transform = `translateY(${-t * 8}px)`;
          outDesc.style.pointerEvents = t < 0.4 ? "auto" : "none";
        }
        if (inTitle) {
          inTitle.style.opacity = `${t}`;
          inTitle.style.transform = `translateY(${(1 - t) * 12}px)`;
          inTitle.style.pointerEvents = t >= 0.4 ? "auto" : "none";
        }
        if (inDesc) {
          // Container stays visible while words appear one by one after the outgoing sentence starts vanishing
          inDesc.style.opacity = "1";
          inDesc.style.transform = "translateY(0px)";
          inDesc.style.pointerEvents = t >= 0.4 ? "auto" : "none";
          const wordAppearT = clamp((transitionProgress - 0.15) / 0.85, 0, 1);
          setWordsProgress(nextIndex, wordAppearT);
        }
        // Hide other text blocks
        for (let i = 0; i < total; i++) {
          if (i !== currentIndex && i !== nextIndex) {
            const title = titleBlockRefs.current[i];
            const desc = descBlockRefs.current[i];
            if (title) {
              title.style.opacity = "0";
              title.style.transform = "translateY(0px)";
              title.style.pointerEvents = "none";
            }
            if (desc) {
              desc.style.opacity = "0";
              desc.style.transform = "translateY(0px)";
              desc.style.pointerEvents = "none";
              setWordsProgress(i, 0);
            }
          }
        }
      };

      // Bootstrap
      updateShowcase(0);

      /* ------------------------------------------------------------------
         Single ScrollTrigger.
         Responsive scroll distance per project calculated dynamically on refresh
         so resizing between mobile and desktop recalculates pin spacing cleanly.
      ------------------------------------------------------------------ */
      const getScrollEnd = () => {
        const isMobile = window.innerWidth < 768;
        const vhPerProject = isMobile ? 260 : 380;
        const totalSegments = maxIdx + HOLD_END;
        return (totalSegments * vhPerProject * window.innerHeight) / 100;
      };

      const st = ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: "top top",
        end: () => `+=${getScrollEnd()}`,
        pinSpacing: true,
        scrub: 0.6,
        refreshPriority: 2,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          updateShowcase(self.progress);
        },
        onUpdate: (self) => {
          updateShowcase(self.progress);
        },
      });

      // Wait for all project images to load before final ScrollTrigger refresh
      const imgs = container.querySelectorAll("img");
      let loadedCount = 0;
      const onImgLoad = () => {
        loadedCount++;
        if (loadedCount === imgs.length) {
          ScrollTrigger.refresh();
        }
      };
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", onImgLoad, { once: true });
        }
      });

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        clearTimeout(refreshTimer);
        imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
        st.kill();
      };
    },
    { scope: pinWrapperRef }
  );

  const { navigateWithTransition } = useNav();

  const handleCardClick = (project: Project) => {
    navigateWithTransition(project.route);
  };

  return (
    <div
      ref={pinWrapperRef}
      className="relative w-full max-w-none bg-[#0a0a0d] select-none text-white"
    >
      {/* ── Pinned Showcase Viewport ── */}
      <section
        ref={containerRef}
        id="work"
        aria-label="Featured Full-Stack and AI Engineering Projects"
        className="relative w-full h-screen overflow-hidden bg-[#09090b] m-0"
      >
        <h2 className="sr-only">
          Featured Full-Stack &amp; AI Engineering Projects
        </h2>
        {/* ── Blurred full-screen backgrounds ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {PROJECTS.map((project, i) => (
            <div
              key={`bg-${project.id}`}
              ref={(el) => { bgRefs.current[i] = el; }}
              className="absolute inset-0 w-full h-full will-change-[opacity]"
              style={{ opacity: i === 0 ? 0.95 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover filter blur-[24px] scale-110 transform-gpu brightness-[1.15] contrast-[1.05]"
              />
            </div>
          ))}
          {/* Subtle light overlay + vignette for text contrast without making it too dark */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_60%,rgba(9,9,11,0.45)_100%)] pointer-events-none" />
        </div>



        {/* ── Left / Top-Left: title blocks — responsive & clickable for mobile & desktop ── */}
        <div className="absolute left-5 sm:left-[5vw] top-20 sm:top-1/2 sm:-translate-y-1/2 z-25 pointer-events-none w-[88vw] sm:w-[22vw] sm:max-w-[260px] min-w-[140px]">
          <div className="relative w-full min-h-[4.5rem] sm:min-h-[10rem] flex items-center">
            {PROJECTS.map((project, i) => (
              <div
                key={`title-${project.id}`}
                ref={(el) => { titleBlockRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: "translateY(0px)",
                  pointerEvents: i === 0 ? "auto" : "none",
                }}
              >
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-[#ff5500] mb-1 sm:mb-2 block leading-tight">
                  {project.category} <span className="sm:hidden text-white/40">• {project.year}</span>
                  <br className="hidden sm:block" />
                  <span className="hidden sm:inline"><span className="text-white/40">•</span> {project.year}</span>
                </span>
                <Link
                  href={project.route}
                  data-cursor="interactive"
                  className="group/title inline-flex flex-col items-start focus:outline-none"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white group-hover/title:text-[#ff5500] transition-colors leading-[1.08] drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
                    {project.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/70 group-hover/title:text-white transition-colors">
                    <span>Open Project</span>
                    <ArrowUpRight className="w-3 h-3 text-[#ff5500] group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Project cards: all absolutely centered, transformed by JS ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              id={`project-card-${project.id}`}
              onClick={() => handleCardClick(project)}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              data-cursor="fluid-glass"
              className="absolute left-1/2 top-1/2 will-change-[opacity,transform,filter] cursor-pointer select-none
                         w-[82vw] h-[48svh] sm:w-[62vw] sm:h-[52vh] md:w-[50vw] md:h-[56vh] lg:w-[44vw] lg:h-[58vh]
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
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.category}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 62vw, 820px"
                    className="object-cover object-center transition-[filter] duration-700 ease-out group-hover:brightness-105"
                  />
                  {/* Hover overlay for inactive cards */}
                  {activeIdx !== index && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="px-5 py-2.5 bg-white/20 border border-white/40 text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <span>View Case Study</span>
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Interactive 3D Fluid Glass Lens Cursor (active card, desktop fine pointer only) */}
              {hasFinePointer && activeIdx === index && (
                <FluidGlass
                  mode="lens"
                  lensProps={{
                    scale: 0.15,
                    ior: 1.15,
                    thickness: 2,
                    chromaticAberration: 0.11,
                    anisotropy: 0.03,
                  }}
                  imageSrc={project.image}
                  backgroundColor="transparent"
                  isHovered={hoveredIdx === index}
                  overflowPadding={160}
                  className="z-30"
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Right: description blocks (clickable to project page) ── */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-25 pointer-events-none hidden md:block"
          style={{
            left: "calc(50% + min(22vw, 410px) + 2vw)",
            width: "clamp(220px, 21vw, 340px)",
          }}
        >
          <div className="relative w-full min-h-[140px] flex items-center">
            {PROJECTS.map((project, i) => (
              <div
                key={`desc-${project.id}`}
                ref={(el) => { descBlockRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center will-change-[opacity,transform]"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: "translateY(0px)",
                  pointerEvents: i === 0 ? "auto" : "none",
                }}
              >
                <Link
                  href={project.route}
                  data-cursor="interactive"
                  className="group/desc block focus:outline-none"
                >
                  <p className="text-[11px] sm:text-[12px] md:text-[13px] text-zinc-200 group-hover/desc:text-white font-normal leading-[1.65] tracking-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex flex-wrap gap-x-[0.32em] gap-y-[0.1em]">
                    {project.desc.split(" ").map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="desc-word inline-block will-change-[opacity,transform,filter]"
                        style={{
                          opacity: i === 0 ? 1 : 0,
                          transform: i === 0 ? "translateY(0px)" : "translateY(6px)",
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#ff5500] group-hover/desc:underline underline-offset-4">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3 h-3 group-hover/desc:translate-x-0.5 group-hover/desc:-translate-y-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Circular progress indicator ── */}
        <div className="absolute left-1/2 -translate-x-1/2 z-25 pointer-events-none flex items-center justify-center"
          style={{ top: "calc(50% + min(27vh, 290px))" }}>
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
      </section>
    </div>
  );
}
