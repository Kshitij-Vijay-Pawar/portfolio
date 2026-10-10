"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowUpRight,
  Code2,
  Terminal,
  Cpu,
  Flame,
  CheckCircle2,
  Zap,
  Globe2,
  Compass,
  Layers,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNav } from "@/app/context/NavContext";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HIGHLIGHT_CARDS = [
  {
    tag: "SPECIALTY",
    title: "Full-Stack & Systems",
    desc: "Production-grade Next.js 15+, TypeScript, Node.js, and robust relational schemas designed for scale.",
    icon: Terminal,
    stat: "100%",
    statLabel: "Type Safety",
  },
  {
    tag: "CREATIVE",
    title: "Motion & 3D Shaders",
    desc: "Interactive WebGL, Three.js, and fluid GSAP physics engineered for cinematic, 60fps responsiveness.",
    icon: Cpu,
    stat: "60 FPS",
    statLabel: "Frame Budget",
  },
  {
    tag: "AUGMENTATION",
    title: "Agentic AI Integration",
    desc: "Integrating Gemini GenAI, structured outputs, and real-time mascot companion mechanics into seamless UX.",
    icon: Sparkles,
    stat: "GenAI",
    statLabel: "Gemini 2.5/3",
  },
];

export default function HomeAboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { triggerSurprise, resetMascotEmotion } = useNav();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 1. Reveal header
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // 2. Stagger animate cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".about-bento-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-28 sm:py-36 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#fafaf9] text-zinc-900 overflow-hidden border-t border-neutral-200/80"
    >
      {/* Dynamic Interactive Ambient Spotlight following cursor */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 sm:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 85, 0, 0.05), transparent 70%)`,
        }}
      />

      {/* Unified Architectural Background Pattern */}
      <ArchitecturalBackground dotOpacity={0.6} glowVariant="split" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        {/* Section Header Tag */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-neutral-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/80 text-xs font-mono uppercase tracking-widest text-neutral-600 mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
              <span>01 // WHO I AM</span>
            </div>
            <h2
              ref={headlineRef}
              className="text-[clamp(2.2rem,5vw,4.2rem)] font-black uppercase tracking-tight text-neutral-950 leading-[0.95]"
            >
              Architecting Digital <br />
              With Intent &amp; Detail<span className="text-[#ff5500]">.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
            I am <strong className="font-semibold text-neutral-900">Kshitij Pawar</strong>, a Full-Stack Engineer and Creative Technologist based in Pune, India. I specialize in bridging software architecture with fluid, high-frame-rate interaction design.
          </p>
        </div>

        {/* Bento Grid Showcase */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 items-stretch"
        >
          {/* Main Visual Feature Card (7 cols) */}
          <div className="about-bento-card md:col-span-7 rounded-3xl p-8 sm:p-10 bg-white border border-neutral-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-neutral-900/40 transition-all duration-300">
            {/* Top Badge & Corner Icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200/70 text-[#ff5500] text-xs font-mono font-semibold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>The Vision</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>EST. 2022</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <span>PUNE, IN</span>
              </div>
            </div>

            <div className="space-y-4 my-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-snug">
                Building modern web platforms that don&apos;t just work &mdash; they resonate.
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                From full-scale Next.js architectures with strict TypeScript safety to custom WebGL shaders and AI-driven companions, I create interactive spaces where technical precision meets high aesthetic caliber.
              </p>
            </div>

            {/* Action CTA link */}
            <div className="pt-8 mt-6 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-6 text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Available for Impact
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline">React 19 &middot; Next.js 15 &middot; WebGL</span>
              </div>

              <Link
                href="/about"
                data-cursor="interactive"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-neutral-950 hover:text-[#ff5500] transition-colors group/link"
              >
                <span>Read Full Story</span>
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols) - Stacked Cards */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* AI Companion Quick Card */}
            <div className="about-bento-card rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-neutral-950 to-neutral-900 text-white relative overflow-hidden flex flex-col justify-between group shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-white/90">
                  <Sparkles className="w-3 h-3 text-[#ff5500]" />
                  <span>AI Powered Companion</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div>
                <h4 className="text-lg font-bold tracking-tight text-white mb-2">
                  Have Questions About Me?
                </h4>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  My digital Mascot knows my projects, technical stack, resume, and experience. Ask it in real-time.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  GEMINI 3.8 FLASH ENGINE
                </span>
                <Link
                  href="/ai"
                  data-cursor="interactive"
                  onMouseEnter={() => triggerSurprise()}
                  onMouseLeave={() => resetMascotEmotion()}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#ff5500] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>Chat Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="about-bento-card rounded-3xl p-5 sm:p-6 bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 divide-x divide-neutral-100 text-center">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    3+
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Years Exp
                  </span>
                </div>
                <div className="flex flex-col pl-2 sm:pl-3">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#ff5500] font-sans tracking-tight">
                    100%
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    TypeScript
                  </span>
                </div>
                <div className="flex flex-col pl-2 sm:pl-3">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    60fps
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Smooth Motion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {HIGHLIGHT_CARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="about-bento-card p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-xs hover:border-neutral-900/30 hover:shadow-sm transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff5500] uppercase">
                      {item.tag}
                    </span>
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-950 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">{item.statLabel}</span>
                  <span className="font-bold text-neutral-900">{item.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
