"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Sparkles,
  Download,
  Copy,
  Check,
  Flame,
  Globe2,
  Terminal,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNav } from "@/app/context/NavContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeCtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const { triggerDoubleBlink, triggerSurprise, resetMascotEmotion } = useNav();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("kshitij.vijay.pawar@gmail.com");
    setCopied(true);
    triggerDoubleBlink();
    setTimeout(() => {
      setCopied(false);
      resetMascotEmotion();
    }, 2200);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
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
      className="relative w-full py-28 sm:py-36 px-4 sm:px-8 md:px-14 lg:px-20 bg-[#fafaf9] text-zinc-900 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Main CTA Canvas */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="relative w-full rounded-[2.5rem] bg-neutral-950 text-white p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between group"
        >
          {/* Interactive Mouse Gradient Spotlight */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 85, 0, 0.12), transparent 70%)`,
            }}
          />

          {/* Background Technical Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

          {/* Top Status Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Available for New Projects &middot; 2026
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span>RESPONSE TIME // &lt; 24H</span>
              <span className="text-white/20">&bull;</span>
              <span>PUNE, IN &middot; REMOTE</span>
            </div>
          </div>

          {/* Big Editorial Headline */}
          <div className="relative z-10 my-12 sm:my-16 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff5500] font-bold">
              <Flame className="w-4 h-4 text-[#ff5500]" />
              <span>Let&apos;s Build Something Memorable</span>
            </div>

            <h2
              ref={headlineRef}
              className="text-[clamp(2.6rem,6vw,5.5rem)] font-black uppercase tracking-[-0.03em] leading-[0.92] text-white"
            >
              HAVE A PROJECT <br />
              IN MIND? LET&apos;S <br />
              MAKE IT REAL<span className="text-[#ff5500]">.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 font-light max-w-2xl leading-relaxed">
              Whether you need a full-scale web product, interactive 3D visual experience, or high-performance AI integration, I&apos;m always excited to collaborate.
            </p>
          </div>

          {/* Interactive Action Bar */}
          <div className="relative z-10 pt-8 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                data-cursor="interactive"
                className="px-7 py-4 rounded-2xl bg-white text-neutral-950 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-3 hover:bg-[#ff5500] hover:text-white transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg group/btn cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={copyEmail}
                data-cursor="interactive"
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2.5 hover:bg-white/10 transition-all hover:border-white/20 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href="/resume/Kshitij_Resume.pdf"
                download
                data-cursor="interactive"
                className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-neutral-400" />
                <span className="hidden sm:inline">Resume</span>
              </a>
            </div>

            {/* Quick Mascot Companion prompt */}
            <Link
              href="/ai"
              data-cursor="interactive"
              onMouseEnter={() => triggerSurprise()}
              onMouseLeave={() => resetMascotEmotion()}
              className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff5500]/50 hover:bg-white/10 transition-all text-xs font-mono text-neutral-300"
            >
              <div className="w-8 h-8 rounded-xl bg-[#ff5500]/20 border border-[#ff5500]/40 flex items-center justify-center text-[#ff5500]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-semibold">Prefer to chat first?</span>
                <span className="text-[11px] text-neutral-400">Ask my AI Mascot assistant &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
