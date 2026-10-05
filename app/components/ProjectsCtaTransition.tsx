"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsCtaTransition() {
  // Stable root wrapper: acts as the layout trigger in the document flow
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Inner viewport: pinned by GSAP inside wrapperRef
  const viewportRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const firstLetterRef = useRef<HTMLSpanElement>(null);
  const targetARef = useRef<HTMLSpanElement>(null);
  const whiteExpansionRef = useRef<HTMLSpanElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const percentCounterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const viewport = viewportRef.current;
      const sentence = sentenceRef.current;
      const firstLetter = firstLetterRef.current;
      const targetA = targetARef.current;
      const whiteExp = whiteExpansionRef.current;
      const ctaContent = ctaContentRef.current;
      const bgOverlay = bgOverlayRef.current;
      const details = detailsRef.current;
      const percentCounter = percentCounterRef.current;

      if (
        !wrapper ||
        !viewport ||
        !sentence ||
        !firstLetter ||
        !targetA ||
        !whiteExp ||
        !ctaContent ||
        !bgOverlay ||
        !details
      ) {
        return;
      }

      const clamp = (v: number, lo: number, hi: number) =>
        Math.max(lo, Math.min(hi, v));

      let originX = 0;
      let originY = 0;
      let xStart = 0;
      let xEnd = 0;

      const measureLayout = () => {
        sentence.style.transform = "none";

        const sRect = sentence.getBoundingClientRect();
        const hRect = firstLetter.getBoundingClientRect();
        const aRect = targetA.getBoundingClientRect();
        const vRect = viewport.getBoundingClientRect();

        const viewportCenterX = vRect.width / 2;

        // Center of first letter 'H' relative to sentence container
        const hCenterInSentence = (hRect.left - sRect.left) + hRect.width / 2;

        // Focal point inside target letter 'A' relative to sentence container
        // Targeting the solid white junction of the letter A
        const focalInA_X = aRect.width * 0.68;
        const focalInA_Y = aRect.height * 0.52;
        const aFocalInSentence = (aRect.left - sRect.left) + focalInA_X;
        const aFocalInSentenceY = (aRect.top - sRect.top) + focalInA_Y;

        originX = aFocalInSentence;
        originY = aFocalInSentenceY;

        sentence.style.transformOrigin = `${originX}px ${originY}px`;

        // Start position: first letter 'H' is centered in the viewport
        xStart = viewportCenterX - hCenterInSentence;

        // End position: target letter 'A' focal point is centered in the viewport
        // Moving from xStart to xEnd moves the sentence slowly from RIGHT to LEFT!
        xEnd = viewportCenterX - aFocalInSentence;
      };

      measureLayout();

      const updateTransition = (progress: number) => {
        // Live progress counter in editorial HUD
        if (percentCounter) {
          const pct = Math.round(progress * 100);
          percentCounter.textContent = `${String(pct).padStart(2, "0")}%`;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 0: Initial Stationary Hold on Black Screen (0.00 → 0.02)
        // First letter ("H") is calmly framed in the center of viewport
        // ═════════════════════════════════════════════════════════════════
        if (progress <= 0.02) {
          sentence.style.transform = `translate3d(${xStart}px, 0, 0) scale(1)`;
          sentence.style.opacity = "1";
          sentence.style.filter = "none";

          details.style.opacity = "1";
          details.style.transform = "translate3d(0, 0, 0)";

          whiteExp.style.opacity = "0";
          whiteExp.style.transform = "translate(-50%, -50%) scale(1)";

          bgOverlay.style.opacity = "0";
          viewport.style.backgroundColor = "#000000";

          ctaContent.style.opacity = "0";
          ctaContent.style.transform = "translate3d(0, 28px, 0)";
          ctaContent.style.pointerEvents = "none";
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 1: Cinematic Slow Text Glide: RIGHT → LEFT (0.02 → 0.28)
        // Smooth cubic smoothstep curve for natural momentum.
        // ═════════════════════════════════════════════════════════════════
        if (progress <= 0.28) {
          const tRaw = (progress - 0.02) / (0.28 - 0.02);
          // Smooth cubic smoothstep curve for natural momentum
          const tEased = tRaw * tRaw * (3 - 2 * tRaw);
          const currentX = xStart + (xEnd - xStart) * tEased;

          sentence.style.transform = `translate3d(${currentX}px, 0, 0) scale(1)`;
          sentence.style.opacity = "1";
          sentence.style.filter = "none";

          details.style.opacity = "1";
          details.style.transform = "translate3d(0, 0, 0)";

          whiteExp.style.opacity = "0";
          whiteExp.style.transform = "translate(-50%, -50%) scale(1)";

          bgOverlay.style.opacity = "0";
          viewport.style.backgroundColor = "#000000";

          ctaContent.style.opacity = "0";
          ctaContent.style.transform = "translate3d(0, 28px, 0)";
          ctaContent.style.pointerEvents = "none";
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 2: Centering Settle & Cinematic Pause on "A" (0.28 → 0.35)
        // Dedicated scroll hold with target "A" perfectly centered.
        // HUD details gently fade away.
        // ═════════════════════════════════════════════════════════════════
        if (progress <= 0.35) {
          const tHold = (progress - 0.28) / (0.35 - 0.28);

          sentence.style.transform = `translate3d(${xEnd}px, 0, 0) scale(1)`;
          sentence.style.opacity = "1";
          sentence.style.filter = "none";

          // Gentle HUD fadeout during the hold
          const hudFade = clamp(1 - tHold * 1.5, 0, 1);
          details.style.opacity = `${hudFade}`;
          details.style.transform = `translate3d(0, ${-tHold * 12}px, 0)`;

          whiteExp.style.opacity = "0";
          whiteExp.style.transform = "translate(-50%, -50%) scale(1)";

          bgOverlay.style.opacity = "0";
          viewport.style.backgroundColor = "#000000";

          ctaContent.style.opacity = "0";
          ctaContent.style.transform = "translate3d(0, 28px, 0)";
          ctaContent.style.pointerEvents = "none";
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 3: Fast, Silky Zoom into "A" & Bloom (0.35 → 0.45)
        // Swift, punchy, silky camera dive into the letter.
        // Gradual, organic white diffusion blooms seamlessly.
        // ═════════════════════════════════════════════════════════════════
        if (progress <= 0.45) {
          const u = (progress - 0.35) / (0.45 - 0.35);
          const currentX = xEnd;

          details.style.opacity = "0";

          // Fast, balanced camera zoom curve
          const maxScale = 380;
          const uCurve = 0.50 * Math.pow(u, 1.4) + 0.50 * Math.pow(u, 2.4);
          const scale = 1 + (maxScale - 1) * uCurve;

          sentence.style.transform = `translate3d(${currentX}px, 0, 0) scale(${scale})`;
          sentence.style.opacity = "1";
          sentence.style.filter = "none";

          // White expansion blooming smoothly alongside the zoom
          if (u > 0.20) {
            const wRaw = clamp((u - 0.20) / (0.90 - 0.20), 0, 1);
            const wEased = wRaw * wRaw * (3 - 2 * wRaw);

            // Bloom expands and brightens smoothly
            whiteExp.style.opacity = `${wEased}`;
            whiteExp.style.transform = `translate(-50%, -50%) scale(${1 + wEased * 4})`;

            // Background overlay softly transitions to pure white
            const bgAlpha = Math.pow(wRaw, 1.8);
            bgOverlay.style.opacity = `${bgAlpha}`;

            if (wRaw >= 0.98) {
              viewport.style.backgroundColor = "#ffffff";
            } else {
              viewport.style.backgroundColor = "#000000";
            }
          } else {
            whiteExp.style.opacity = "0";
            whiteExp.style.transform = "translate(-50%, -50%) scale(1)";
            bgOverlay.style.opacity = "0";
            viewport.style.backgroundColor = "#000000";
          }

          ctaContent.style.opacity = "0";
          ctaContent.style.transform = "translate3d(0, 28px, 0)";
          ctaContent.style.pointerEvents = "none";
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 4: Pure White Screen Hold (0.45 → 0.49)
        // Serene moment on complete white before the message emerges.
        // ═════════════════════════════════════════════════════════════════
        if (progress <= 0.49) {
          viewport.style.backgroundColor = "#ffffff";
          bgOverlay.style.opacity = "1";
          whiteExp.style.opacity = "1";
          details.style.opacity = "0";

          ctaContent.style.opacity = "0";
          ctaContent.style.transform = "translate3d(0, 28px, 0)";
          ctaContent.style.pointerEvents = "none";
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // PHASE 5: Smooth CTA Reveal (0.49 → 0.62) & Retain (0.62 → 1.00)
        // Gentle fade-in and subtle upward glide into resting place.
        // ═════════════════════════════════════════════════════════════════
        viewport.style.backgroundColor = "#ffffff";
        bgOverlay.style.opacity = "1";
        whiteExp.style.opacity = "1";
        details.style.opacity = "0";

        const cRaw = clamp((progress - 0.49) / (0.62 - 0.49), 0, 1);
        const cEased = cRaw * cRaw * (3 - 2 * cRaw);

        ctaContent.style.opacity = `${cEased}`;
        ctaContent.style.transform = `translate3d(0, ${(1 - cEased) * 28}px, 0)`;
        ctaContent.style.pointerEvents = cEased > 0.5 ? "auto" : "none";
      };

      updateTransition(0);

      // Total scroll distance calibrated for responsive transition
      const isMobile = window.innerWidth < 768;
      const scrollDistance = isMobile ? "2500vh" : "4000vh";

      // scrub: 1.0 gives direct, 1:1, silky control
      const st = ScrollTrigger.create({
        trigger: wrapper,
        pin: viewport,
        start: "top top",
        end: `+=${scrollDistance}`,
        anticipatePin: 1,
        scrub: 1.0,
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measureLayout();
        },
        onUpdate: (self) => {
          updateTransition(self.progress);
        },
      });

      const handleResize = () => {
        measureLayout();
        updateTransition(st.progress);
      };

      window.addEventListener("resize", handleResize);

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: wrapperRef }
  );

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-black select-none"
    >
      {/* ── Pinned Transition Viewport ── */}
      <div
        ref={viewportRef}
        className="relative w-full h-screen overflow-hidden bg-black transition-colors duration-200"
      >
        {/* Full White Overlay that guarantees seamless, unshakeable 100% white saturation */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 w-full h-full bg-white pointer-events-none z-10 opacity-0"
        />

        {/* ── Architectural Structural Guidelines & Blueprint Grid ── */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-16 sm:top-20 left-0 w-full h-[1px] bg-white/[0.06]" />
          <div className="absolute bottom-16 sm:bottom-20 left-0 w-full h-[1px] bg-white/[0.06]" />
          <div className="absolute top-0 left-8 sm:left-16 w-[1px] h-full bg-white/[0.05]" />
          <div className="absolute top-0 right-8 sm:right-16 w-[1px] h-full bg-white/[0.05]" />

          {/* Corner Crosshairs */}
          <span className="absolute top-8 left-8 sm:left-16 font-mono text-[10px] text-white/30 tracking-widest select-none">
            + [ 05 // FINAL ]
          </span>
          <span className="absolute top-8 right-8 sm:right-16 font-mono text-[10px] text-white/30 tracking-widest select-none">
            [ ARCHIVE / 26 ] +
          </span>
          <span className="absolute bottom-8 left-8 sm:left-16 font-mono text-[10px] text-white/30 tracking-widest select-none">
            + [ PULL DOWN ]
          </span>
          <span className="absolute bottom-8 right-8 sm:right-16 font-mono text-[10px] text-white/30 tracking-widest select-none">
            [ COORDINATES: 18.52° N ] +
          </span>
        </div>

        {/* ── Architectural Editorial HUD & Metadata Layer ── */}
        <div
          ref={detailsRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-5 flex flex-col justify-between p-6 sm:p-12 md:p-16 transition-opacity duration-300"
        >
          {/* Top Bar Details */}
          <div className="w-full flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-white/60 uppercase">
                TERMINAL TRANSITION // PHASE 02
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-white/40 uppercase">
              <span className="hidden sm:inline-block">SYS.STATE: ACTIVE</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-400/80 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Bottom Bar Details & Dynamic Percentage Counter */}
          <div className="w-full flex items-center justify-between pb-2">
            <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-white/40 uppercase">
              <span className="text-[#ff5500]">▼</span>
              <span>SCROLL TO ADVANCE TRANSMISSION</span>
            </div>

            {/* Mid Ledger Bar */}
            <div className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
              <span>✦ EXPLORATION</span>
              <span>✦ IMMERSION</span>
              <span>✦ IMPACT</span>
            </div>

            {/* Live Progress Meter */}
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-white/70">
              <span className="text-white/30">SYNC:</span>
              <span
                ref={percentCounterRef}
                className="text-[#ff5500] font-bold tracking-widest min-w-[36px]"
              >
                00%
              </span>
            </div>
          </div>
        </div>

        {/* ── Giant Single-Line Headline Container ── */}
        <div className="absolute inset-0 z-1 flex items-center justify-start overflow-visible pointer-events-none">
          <div
            ref={sentenceRef}
            className="flex items-center whitespace-nowrap font-black uppercase tracking-[-0.04em] text-white will-change-transform select-none"
            style={{
              fontSize: "clamp(4.2rem, 11vw, 14.5rem)",
              lineHeight: 1,
            }}
          >
            {/* First letter 'H' anchored for initial center framing */}
            <span ref={firstLetterRef} className="relative inline-block">
              H
            </span>
            <span>AVE AN AMBITIOUS IDE</span>
            {/* The focal letter "A" with anchored white-expansion core */}
            <span ref={targetARef} className="relative inline-block">
              A
              <span
                ref={whiteExpansionRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0 will-change-transform"
                style={{
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 35%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0) 100%)",
                  filter: "blur(6px)",
                }}
              />
            </span>
            <span>?</span>
          </div>
        </div>

        {/* ── Minimal Editorial Final CTA Revealed on White Screen ── */}
        <div
          ref={ctaContentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none opacity-0"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Subtle chapter label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-100/90 text-[11px] font-mono tracking-widest uppercase text-neutral-600 mb-8 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span>CHAPTER TRANSITION • CONTACT</span>
            </div>

            {/* Giant Editorial Heading */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] text-neutral-950 leading-[0.95] mb-6 drop-shadow-xs">
              Let&apos;s build something<span className="text-[#ff5500]">.</span>
            </h2>

            {/* Subtext with generous editorial whitespace */}
            <p className="text-neutral-500 font-light text-sm sm:text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              Available for selected client projects, bespoke digital experiences, and creative engineering.
            </p>

            {/* Action Button navigating to Contact page */}
            <div className="pointer-events-auto">
              <Link
                href="/contact"
                data-cursor="interactive"
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-neutral-950 hover:bg-[#ff5500] text-white font-mono text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
