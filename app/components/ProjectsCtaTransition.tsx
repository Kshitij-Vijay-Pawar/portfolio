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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const firstLetterRef = useRef<HTMLSpanElement>(null);
  const targetARef = useRef<HTMLSpanElement>(null);
  const lastCharRef = useRef<HTMLSpanElement>(null);
  const whiteExpansionRef = useRef<HTMLSpanElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const percentCounterRef = useRef<HTMLSpanElement>(null);
  const bgLayerFarRef = useRef<HTMLDivElement>(null);
  const bgLayerMidTopRef = useRef<HTMLDivElement>(null);
  const bgLayerMidBottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const viewport = viewportRef.current;
      const sentence = sentenceRef.current;
      const firstLetter = firstLetterRef.current;
      const targetA = targetARef.current;
      const lastChar = lastCharRef.current;
      const whiteExp = whiteExpansionRef.current;
      const ctaContent = ctaContentRef.current;
      const bgOverlay = bgOverlayRef.current;
      const details = detailsRef.current;
      const percentCounter = percentCounterRef.current;
      const bgLayerFar = bgLayerFarRef.current;
      const bgLayerMidTop = bgLayerMidTopRef.current;
      const bgLayerMidBottom = bgLayerMidBottomRef.current;

      if (
        !wrapper ||
        !viewport ||
        !sentence ||
        !firstLetter ||
        !targetA ||
        !lastChar ||
        !whiteExp ||
        !ctaContent ||
        !bgOverlay ||
        !details
      ) {
        return;
      }

      let xStart = 0;
      let xEnd = 0;

      // Initial opposite-direction parallax offsets (move left -> right while main text moves right -> left)
      const FAR_START_X = -880;
      const FAR_END_X = 240;
      const MID_START_X = -1550;
      const MID_END_X = 420;

      const measureLayout = () => {
        // Reset transform to measure accurately
        gsap.set(sentence, { clearProps: "transform" });
        sentence.style.transform = "none";

        const sRect = sentence.getBoundingClientRect();
        const hRect = firstLetter.getBoundingClientRect();
        const aRect = targetARef.current!.getBoundingClientRect();
        const qRect = lastChar.getBoundingClientRect();
        const vRect = viewport.getBoundingClientRect();

        const viewportCenterX = vRect.width / 2;

        // Center of first letter 'H' relative to sentence container
        const hCenterInSentence = (hRect.left - sRect.left) + hRect.width / 2;

        // Center of last letter '?' relative to sentence container
        const qCenterInSentence = (qRect.left - sRect.left) + qRect.width / 2;

        // Focal point inside target letter 'A' relative to sentence container
        const focalInA_X = aRect.width * 0.65;
        const focalInA_Y = aRect.height * 0.52;
        const aFocalInSentence = (aRect.left - sRect.left) + focalInA_X;
        const aFocalInSentenceY = (aRect.top - sRect.top) + focalInA_Y;

        sentence.style.transformOrigin = `${aFocalInSentence}px ${aFocalInSentenceY}px`;

        // Start: first letter 'H' centered
        xStart = viewportCenterX - hCenterInSentence;

        // End of scroll roll: '?' is centered in viewport
        xEnd = viewportCenterX - qCenterInSentence;

        gsap.set(sentence, { x: xStart, y: 0, scale: 1 });
        if (bgLayerFar) gsap.set(bgLayerFar, { x: FAR_START_X });
        if (bgLayerMidTop) gsap.set(bgLayerMidTop, { x: MID_START_X });
        if (bgLayerMidBottom) gsap.set(bgLayerMidBottom, { x: MID_START_X * 0.85 });
      };

      measureLayout();

      // Dedicated GSAP Timeline to animate the zoom into 'A' and show the final screen
      const zoomTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
      });

      zoomTimeline
        // 1. Fade out HUD details & background parallax layers smoothly
        .to(
          [details, bgLayerFar, bgLayerMidTop, bgLayerMidBottom].filter(Boolean),
          {
            opacity: 0,
            y: -20,
            duration: 0.35,
            ease: "power2.out",
          },
          0
        )
        // 2. Bloom white expansion sphere & background
        .to(
          whiteExp,
          {
            opacity: 1,
            scale: 6,
            duration: 0.7,
            ease: "power2.inOut",
          },
          0.25
        )
        .to(
          bgOverlay,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power1.inOut",
          },
          0.4
        )
        .set(
          viewport,
          {
            backgroundColor: "#ffffff",
          },
          0.7
        )
        // 3. Reveal final CTA content smoothly
        .to(
          ctaContent,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          0.75
        );

      // Update text horizontal roll and zoom based on scroll progress (0 to 1)
      // 0.00 -> 0.58: Horizontal roll of "HAVE AN AMBITIOUS IDEA?" until '?' is centered
      // 0.58 -> 0.90: Zoom into the letter 'A' and reveal white CTA screen
      // 0.90 -> 1.00: Hold the final white CTA screen before scrolling to Footer
      const ROLL_END = 0.58;
      const ZOOM_END = 0.90;

      // Velocity-clamped progress state so no matter how fast the user scrolls the mouse wheel,
      // the animation progresses at a controlled, capped maximum speed.
      let targetProgress = 0;
      let smoothedProgress = 0;
      const MAX_PROGRESS_SPEED_PER_SEC = 0.38; // Hard velocity cap (~2.6s minimum full traversal)

      const applyVisualProgress = (progress: number) => {
        const rollProgress = Math.min(progress / ROLL_END, 1);

        if (percentCounter) {
          const pct = Math.round(rollProgress * 100);
          percentCounter.textContent = `${String(pct).padStart(2, "0")}%`;
        }

        const currentX = xStart + (xEnd - xStart) * rollProgress;

        // Opposite-direction parallax layers at 2 distinct depth speeds
        const farX = FAR_START_X + (FAR_END_X - FAR_START_X) * rollProgress;
        const midX = MID_START_X + (MID_END_X - MID_START_X) * rollProgress;
        if (bgLayerFar) gsap.set(bgLayerFar, { x: farX });
        if (bgLayerMidTop) gsap.set(bgLayerMidTop, { x: midX });
        if (bgLayerMidBottom) gsap.set(bgLayerMidBottom, { x: midX * 0.85 });

        if (progress <= ROLL_END) {
          zoomTimeline.progress(0);
          gsap.set(sentence, { x: currentX, y: 0, scale: 1 });
          viewport.style.backgroundColor = "#000000";
          ctaContent.style.pointerEvents = "none";
        } else {
          const rawZoom = (progress - ROLL_END) / (ZOOM_END - ROLL_END);
          const zoomProgress = Math.max(0, Math.min(rawZoom, 1));
          // Power-3 ease-in curve for the scale from 1 -> 360
          const easedZoom = zoomProgress * zoomProgress * zoomProgress;
          const currentScale = 1 + 359 * easedZoom;

          gsap.set(sentence, { x: xEnd, y: 0, scale: currentScale });
          zoomTimeline.progress(zoomProgress);
          ctaContent.style.pointerEvents = zoomProgress > 0.6 ? "auto" : "none";
        }
      };

      // Clamp wheel delta while inside the pinned CTA section so rapid mouse wheel flicks
      // cannot skip through the scroll distance faster than the allowed threshold
      const MAX_WHEEL_DELTA_PX = 42;
      const handleWheelClamp = (e: WheelEvent) => {
        const stInstance = stRef;
        if (!stInstance || !stInstance.isActive) return;

        // Allow normal exit at the very top (scrolling up) or very bottom (scrolling down after completion)
        if (
          (e.deltaY < 0 && stInstance.progress <= 0.002 && smoothedProgress <= 0.01) ||
          (e.deltaY > 0 && stInstance.progress >= 0.998 && smoothedProgress >= 0.99)
        ) {
          return;
        }

        e.preventDefault();
        const clampedDelta =
          Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), MAX_WHEEL_DELTA_PX);
        window.scrollBy({ top: clampedDelta, left: 0, behavior: "instant" });
      };

      // Ticker loop enforces the maximum progress velocity cap even if user drags scrollbar or flicks trackpad
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

      const getScrollDistance = () => {
        const isMobile = window.innerWidth < 768;
        return (isMobile ? 2.6 : 3.5) * window.innerHeight;
      };

      const stRef = ScrollTrigger.create({
        trigger: viewport,
        pin: true,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pinSpacing: true,
        scrub: true,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measureLayout();
          targetProgress = self.progress;
          smoothedProgress = self.progress;
          applyVisualProgress(smoothedProgress);
        },
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      const handleResize = () => {
        measureLayout();
        targetProgress = stRef.progress;
        applyVisualProgress(smoothedProgress);
      };

      viewport.addEventListener("wheel", handleWheelClamp, { passive: false });
      window.addEventListener("resize", handleResize);

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => {
        clearTimeout(refreshTimeout);
        gsap.ticker.remove(tickProgress);
        viewport.removeEventListener("wheel", handleWheelClamp);
        window.removeEventListener("resize", handleResize);
        stRef.kill();
        zoomTimeline.kill();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-[#fafaf9] select-none"
    >
      {/* ── Pinned Transition Viewport ── */}
      <div
        ref={viewportRef}
        className="relative w-full h-screen overflow-hidden bg-black"
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

        {/* ── PARALLAX LAYER 1 (FAR OBJECTS — Slower Reverse Drift, Low Opacity): Architectural Watermarks ── */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center overflow-hidden select-none">
          <div
            ref={bgLayerFarRef}
            className="flex items-center gap-24 sm:gap-32 whitespace-nowrap font-black tracking-[-0.05em] text-white/[0.04] uppercase will-change-transform"
            style={{ fontSize: "clamp(8rem, 19vw, 22rem)", lineHeight: 0.85 }}
          >
            <span>ARCHITECT</span>
            <span className="text-white/[0.025]">•</span>
            <span>ENGINEER</span>
            <span className="text-white/[0.025]">•</span>
            <span>COLLABORATE</span>
            <span className="text-white/[0.025]">•</span>
            <span>LAUNCH</span>
            <span className="text-white/[0.025]">•</span>
            <span>BEYOND</span>
          </div>
        </div>

        {/* ── PARALLAX LAYER 2 (MID-GROUND OBJECTS — Faster Reverse Drift, Medium Opacity): Sub-Text Telemetry Ribbons ── */}
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between py-24 sm:py-32 overflow-hidden select-none">
          {/* Upper sub-text ribbon */}
          <div
            ref={bgLayerMidTopRef}
            className="flex items-center gap-12 sm:gap-16 whitespace-nowrap font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.35em] text-white/[0.14] will-change-transform"
          >
            <span>✦ [ FULL-STACK ARCHITECTURE // NEXT.JS &amp; REACT ]</span>
            <span className="text-[#ff5500]/45">❖</span>
            <span>⟪ DISTRIBUTED SYSTEMS · BULLMQ &amp; REDIS ⟫</span>
            <span className="text-[#ff5500]/45">✦</span>
            <span>[ AI WORKFLOWS &amp; INTERACTIVE 3D WEBGL ]</span>
            <span className="text-[#ff5500]/45">❖</span>
            <span>⟪ SCALABLE BACKENDS · POSTGRESQL &amp; NODE.JS ⟫</span>
            <span className="text-[#ff5500]/45">✦</span>
            <span>[ PUNE, IN · 18.5204° N, 73.8567° E ]</span>
          </div>

          {/* Lower sub-text ribbon */}
          <div
            ref={bgLayerMidBottomRef}
            className="flex items-center gap-12 sm:gap-16 whitespace-nowrap font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-white/[0.09] will-change-transform"
          >
            <span>⟪ BESPOKE DIGITAL PRODUCTS // 2026 EDITION ⟫</span>
            <span className="text-[#ff5500]/35">✦</span>
            <span>[ ZERO-LATENCY INTERFACES · PRECISION CRAFT ]</span>
            <span className="text-[#ff5500]/35">❖</span>
            <span>⟪ END-TO-END ENGINEERING · CONCEPT TO PRODUCTION ⟫</span>
            <span className="text-[#ff5500]/35">✦</span>
            <span>[ OPEN FOR SELECTED PROJECTS &amp; ROLES ]</span>
          </div>
        </div>

        {/* ── Giant Single-Line Headline Container (Text made bigger) ── */}
        <div className="absolute inset-0 z-1 flex items-center justify-start overflow-visible pointer-events-none">
          <div
            ref={sentenceRef}
            className="flex items-center whitespace-nowrap font-black uppercase tracking-[-0.03em] text-white will-change-transform select-none"
            style={{
              fontSize: "clamp(4.5rem, 16vw, 24rem)",
              lineHeight: 0.9,
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
                  width: "240px",
                  height: "240px",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 40%, rgba(255,255,255,0.9) 65%, rgba(255,255,255,0) 100%)",
                  filter: "blur(4px)",
                }}
              />
            </span>
            {/* Last character '?' that stops at viewport center before triggering zoom */}
            <span ref={lastCharRef} className="relative inline-block">
              ?
            </span>
          </div>
        </div>

        {/* ── Minimal Editorial Final CTA Revealed on White Screen ── */}
        <div
          ref={ctaContentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 pointer-events-none opacity-0 translate-y-7"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Subtle chapter label */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-neutral-200 bg-neutral-100/90 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-neutral-600 mb-6 sm:mb-8 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
              <span>CHAPTER TRANSITION • CONTACT</span>
            </div>

            {/* Giant Editorial Heading */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-[-0.04em] text-neutral-950 leading-[0.95] mb-4 sm:mb-6 drop-shadow-xs">
              Let&apos;s build something<span className="text-[#ff5500]">.</span>
            </h2>

            {/* Subtext with generous editorial whitespace */}
            <p className="text-neutral-500 font-light text-xs sm:text-base md:text-lg max-w-lg mb-8 sm:mb-10 leading-relaxed px-2">
              Available for selected client projects, bespoke digital experiences, and creative engineering.
            </p>

            {/* Action Button navigating to Contact page */}
            <div>
              <Link
                href="/contact"
                data-cursor="interactive"
                className="inline-flex items-center gap-2.5 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-5 rounded-full bg-neutral-950 hover:bg-[#ff5500] text-white font-mono text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
