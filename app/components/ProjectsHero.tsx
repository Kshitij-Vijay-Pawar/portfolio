"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Sparkles, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = [
  "ALL WORKS",
  "CREATIVE DEV",
  "3D / WEBGL",
  "INTERACTION",
  "SYSTEMS",
];

export default function ProjectsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Entrance animation
      tl.from(".hero-crumb", {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
        .from(
          [titleLine1Ref.current, titleLine2Ref.current],
          {
            opacity: 0,
            y: 70,
            skewY: 3,
            stagger: 0.12,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .from(
          metaRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          chipsRef.current?.children || [],
          {
            opacity: 0,
            scale: 0.9,
            y: 15,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        )
        .from(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.6,
          },
          "-=0.3"
        );

      // Subtle parallax on scroll
      gsap.to(titleLine1Ref.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(titleLine2Ref.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  const scrollToWork = () => {
    const workEl = document.getElementById("work");
    if (workEl) {
      workEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#fafaf9] text-zinc-900 pt-28 sm:pt-36 pb-12 px-6 sm:px-12 md:px-16 lg:px-20 select-none border-b border-neutral-200"
    >
      {/* 1. Subtle Architectural Dot Grid & Crosshair Lines */}
      <div
        ref={gridLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

        {/* Structural Blueprint Grid Lines */}
        <div className="absolute top-28 left-0 w-full h-[1px] bg-neutral-200/70" />
        <div className="absolute bottom-24 left-0 w-full h-[1px] bg-neutral-200/70" />
        <div className="absolute top-0 left-12 sm:left-20 w-[1px] h-full bg-neutral-200/60" />
        <div className="absolute top-0 right-12 sm:right-20 w-[1px] h-full bg-neutral-200/60" />

        {/* Soft Ambient Warm Glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Header Metadata Breadcrumb */}
      <div className="relative z-10 w-full flex items-center justify-between hero-crumb">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            data-cursor="interactive"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-[11px] font-mono tracking-wider uppercase text-neutral-700 transition-colors shadow-sm"
          >
            <span>← Home</span>
          </Link>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
            Curated Index • 2025–2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/80 text-[11px] font-mono text-neutral-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>05 FEATURED WORKS</span>
          </div>
        </div>
      </div>

      {/* 3. Central Giant Typography Section */}
      <div className="relative z-10 w-full my-auto py-8 sm:py-12">
        <div className="max-w-6xl">
          {/* Top Label with Icon */}
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300 bg-neutral-100/80 text-xs font-mono tracking-widest uppercase text-neutral-600">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>Archive & Interactive Experiments</span>
          </div>

          {/* Main Giant Headline */}
          <h1
            ref={titleLine1Ref}
            className="text-[clamp(2.8rem,8.5vw,7.5rem)] font-black tracking-[-0.04em] text-neutral-950 uppercase leading-[0.92] will-change-transform"
          >
            SELECTED
          </h1>
          <h1
            ref={titleLine2Ref}
            className="text-[clamp(2.8rem,8.5vw,7.5rem)] font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400 uppercase leading-[0.92] will-change-transform"
          >
            PROJECTS<span className="text-[#ff5500]">.</span>
          </h1>
        </div>

        {/* Narrative Description & Quick Action */}
        <div
          ref={metaRef}
          className="mt-8 sm:mt-10 max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-neutral-200/80"
        >
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
            An exploration of interactive design, bespoke 3D WebGL visuals, and conversion-focused web engineering crafted for award-winning digital experiences.
          </p>

          <button
            onClick={scrollToWork}
            data-cursor="interactive"
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 shadow-md"
          >
            <span>View Deck</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#ff5500]" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Row: Category Chips & Interactive Scroll Indicator */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
        {/* Category Pills */}
        <div
          ref={chipsRef}
          className="flex flex-wrap items-center gap-2 overflow-x-auto"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            FILTER:
          </span>
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              onClick={scrollToWork}
              data-cursor="interactive"
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                idx === 0
                  ? "bg-neutral-900 text-white font-semibold shadow-sm"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Animated Scroll Down Indicator */}
        <div
          ref={scrollIndicatorRef}
          onClick={scrollToWork}
          data-cursor="interactive"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full border border-neutral-300 bg-white flex items-center justify-center group-hover:border-[#ff5500] group-hover:bg-[#ff5500] group-hover:text-white transition-all shadow-sm">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              EXPLORE
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider text-neutral-900 group-hover:text-[#ff5500] transition-colors">
              PINNED SHOWCASE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
