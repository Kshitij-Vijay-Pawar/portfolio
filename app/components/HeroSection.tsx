"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TechText from "./ui/TechText";
import heroImage from "@/public/images/Hero.png";
import OptionWheel from "./ui/OptionWheel";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";

gsap.registerPlugin(ScrollTrigger);

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Cloud & Tools"
  | "Languages"
  | "Concepts";

export interface SkillItem {
  name: string;
  level?: number;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud & Tools",
  "Languages",
  "Concepts",
];

export const SKILLS_DATA: Record<SkillCategory, SkillItem[]> = {
  Frontend: [
    { name: "HTML & CSS", level: 100 },
    { name: "React", level: 100 },
    { name: "Next.js", level: 100 },
    { name: "React Native", level: 90 },
    { name: "Electron", level: 75 },
  ],
  Backend: [
    { name: "Node.js", level: 100 },
    { name: "Express", level: 100 },
    { name: "JavaScript", level: 100 },
    { name: "TypeScript", level: 100 },
  ],
  Database: [
    { name: "PostgreSQL", level: 100 },
    { name: "MySQL", level: 90 },
    { name: "MongoDB", level: 80 },
    { name: "SQL", level: 100 },
  ],
  "Cloud & Tools": [
    { name: "Docker", level: 90 },
    { name: "Redis", level: 80 },
    { name: "Git & GitHub", level: 95 },
    { name: "Postman", level: 100 },
    { name: "Linux", level: 85 },
  ],
  Languages: [
    { name: "Hindi", level: 100 },
    { name: "Marathi", level: 100 },
    { name: "English", level: 100 },
  ],
  Concepts: [
    { name: "Authentication" },
    { name: "Authorization" },
    { name: "API Security" },
    { name: "Database Design" },
    { name: "Microservices" },
    { name: "Asynchronous" },
  ],
};

export default function HeroSection() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedCategory = SKILL_CATEGORIES[selectedIndex];

  // Auto-rotate skill categories every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % SKILL_CATEGORIES.length);
    }, 20000);

    return () => clearInterval(timer);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const techTextRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial Reveal Entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-top-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
      })
        .from(
          ".hero-corner-item",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.6"
        )
        .from(
          watermarkRef.current,
          {
            scale: 0.92,
            letterSpacing: "0.2em",
            opacity: 0,
            duration: 1.4,
            ease: "power2.out",
          },
          "-=0.7"
        )
        .from(
          heroImgRef.current,
          {
            scale: 0.88,
            y: 70,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.9"
        )
        .from(
          ".floating-card",
          {
            scale: 0.8,
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.6)",
          },
          "-=0.7"
        )
        .from(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            y: -15,
            duration: 0.6,
          },
          "-=0.4"
        );

      // 2. Parallax on Scroll with Differential Speeds
      // Dots background (slowest)
      gsap.to(dotsRef.current, {
        y: 140,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Giant DEVELOPER watermark typography
      gsap.to(watermarkRef.current, {
        y: -120,
        letterSpacing: "0.12em",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // TechText layer (interactive canvas behind portrait)
      gsap.to(techTextRef.current, {
        y: -90,
        scale: 0.95,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero Image (smooth grounded lift)
      gsap.to(heroImgRef.current, {
        y: 50,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Floating badges / left card (faster upward drift)
      gsap.to(badgesRef.current, {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Right Area Lines Container (Unified scroll speed faster than image)
      gsap.to(".parallax-lines-container", {
        y: -180,
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

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[1200px] flex flex-col justify-between overflow-hidden bg-[#fafaf9] pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 px-3 sm:px-6 md:px-12 lg:px-14 select-none"
    >
      {/* 1. Background Grid & Dot Matrix Layer with Parallax */}
      <div
        ref={dotsRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchitecturalBackground dotOpacity={0.7} glowVariant="center" />
      </div>

      {/* 2. Top Header Content & Status Badge */}
      <div className="relative z-20 w-full flex items-center justify-between pointer-events-none px-2 sm:px-0">
        {/* Left Sub-Header Detail */}
        <div className="hero-corner-item hidden md:flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">LOC</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=43.978412,15.383477"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="font-mono text-xs font-semibold text-neutral-800 tracking-wider cursor-pointer pointer-events-auto hover:opacity-75 transition-opacity"
          >
            [43.978412° N, 15.383477° E]
          </a>
        </div>

        {/* Right Sub-Header Detail */}
        <div className="hero-corner-item hidden md:flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">STACK</span>
          <span className="font-mono text-xs font-semibold text-neutral-800 tracking-wider">
            NEXT.JS // GSAP // THREE
          </span>
        </div>
      </div>

      {/* 3. Central Canvas: Big Watermark + Giant TechText + Centered Hero Portrait + Side Badges */}
      <div className="relative w-full flex-1 flex items-center justify-center my-auto overflow-hidden">

        {/* Giant "DEVELOPER" TechText Typography in Top-Left Area behind Portrait (Subtle Architectural Background Watermark) */}
        <div
          ref={watermarkRef}
          data-cursor="interactive"
          className="absolute -top-4 -left-4 sm:top-0 sm:left-4 md:top-2 md:left-8 w-[280px] sm:w-[480px] md:w-[680px] lg:w-[820px] h-[100px] sm:h-[160px] md:h-[220px] lg:h-[260px] pointer-events-auto z-[5] overflow-visible select-none max-w-full opacity-60"
        >
          <TechText
            text="DEVELOPER"
            fontWeight={800}
            fontSize={160}
            reveal="letter"
            dashLength={4}
            dashGap={3}
            specks={16}
            fontFamily=""
            color="#676767"
            accentColor="#94a3b8"
            letterSpacing={-0.03}
            reach={180}
            softness={0.7}
            strokeWidth={1.5}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
          />
        </div>

        {/* Centered Hero Cutout Portrait (Foreground Focal Point) */}
        <div
          ref={heroImgRef}
          className="relative z-20 flex items-end justify-center pointer-events-none h-full w-full max-w-6xl"
        >
          <div className="relative w-[280px] sm:w-[420px] md:w-[580px] lg:w-[760px] xl:w-[900px] h-[68svh] sm:h-[76svh] md:h-[84svh] max-h-[880px] min-h-[360px]">
            <Image
              src={heroImage}
              alt="Kshitij - Creative Developer"
              priority
              fill
              sizes="(max-width: 640px) 280px, (max-width: 768px) 420px, (max-width: 1200px) 760px, 900px"
              className="object-contain object-bottom drop-shadow-[0_24px_50px_rgba(0,0,0,0.22)] filter contrast-[1.03]"
            />
          </div>
        </div>

        {/* Giant TechText Canvas Layer ON TOP OF IMAGE in Bottom-Right Area (Draggable & Interactive - Primary Focal Text) */}
        <div
          ref={techTextRef}
          data-cursor="interactive"
          className="absolute -bottom-2 -right-4 sm:bottom-0 sm:right-4 md:bottom-2 md:right-8 w-[280px] sm:w-[460px] md:w-[640px] lg:w-[760px] h-[100px] sm:h-[150px] md:h-[200px] lg:h-[240px] flex items-center justify-end z-30 pointer-events-auto select-none max-w-full drop-shadow-[0_4px_16px_rgba(255,255,255,0.85)] filter"
        >
          <TechText
            text="KSHITIJ"
            fontWeight={800}
            fontSize={170}
            reveal="letter"
            dashLength={5}
            dashGap={3}
            specks={20}
            fontFamily=""
            color="#080808"
            accentColor="#000000"
            letterSpacing={-0.03}
            reach={220}
            softness={0.7}
            strokeWidth={1.8}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
          />
        </div>

        {/* Floating Context Badges & Editorial Detail Cards */}
        <div
          ref={badgesRef}
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-2 sm:px-4"
        >
          {/* Left: Scaled down OptionWheel (hidden on very small phones < 640px to prevent visual clash, accessible via bottom tags) */}
          <div data-cursor="default" className="hidden sm:flex h-[200px] sm:h-[260px] w-[180px] sm:w-[260px] pointer-events-auto items-center">
            <OptionWheel
              items={SKILL_CATEGORIES}
              selectedIndex={selectedIndex}
              textColor="#a3a3a3"
              activeColor="#0a0a0a"
              side="left"
              fontSize={1.45}
              spacing={1.6}
              curve={0.85}
              tilt={5.5}
              blur={1.2}
              fade={0.3}
              smoothing={180}
              inset={20}
              loop={true}
              draggable
              soundUrl="/assets/sounds/click-soft.mp3"
              soundVolume={0.5}
              onChange={(index) => setSelectedIndex(index)}
            />
          </div>

          {/* Right Area: Dynamic Category Technical Graph Lines */}
          <div className="parallax-lines-container hidden lg:flex flex-col gap-4 translate-y-6 max-w-[340px] xl:max-w-[390px] w-full pointer-events-auto ">
            {SKILLS_DATA[selectedCategory].slice(0, 4).map((skill, idx) => {
              const skillLevel = skill.level ?? 88;
              const lineLabels = ["VEC // 01", "GRID // 02", "AXIS // 03", "DATUM // 04"];
              const lineTypes = [
                "bg-neutral-950",
                "bg-neutral-800",
                "bg-neutral-700",
                "bg-neutral-900",
              ];
              const label = lineLabels[idx] || `SYS // 0${idx + 1}`;
              const barColor = lineTypes[idx % lineTypes.length];

              return (
                <div key={skill.name} className="flex flex-col gap-1.5 origin-left group">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
                    <span className="text-neutral-500 font-medium group-hover:text-neutral-900 transition-colors">
                      {label} &middot; {skill.name}
                    </span>
                    <span className="text-neutral-700 font-semibold font-mono">
                      {skill.level !== undefined ? `${skill.level}%` : "EXP"}
                    </span>
                  </div>
                  {/* Outer line track */}
                  <div className="h-[3px] w-full bg-neutral-200/80 rounded-full overflow-hidden">
                    {/* Animated dynamic line with smooth transition */}
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${skillLevel}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Footer Bar: Dynamic Selected Category Skills + Scroll Mouse */}
      <div className="relative z-20 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between pointer-events-none pt-2 gap-3 sm:gap-0">
        {/* Left Bottom Tag: Active Category + Skills Count */}
        <div className="hero-corner-item hidden sm:flex flex-col text-left pointer-events-auto">
          <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
            Category // {selectedCategory}
          </span>
          <span className="font-mono text-xs font-semibold text-neutral-800">
            {SKILLS_DATA[selectedCategory].length} PROFICIENCIES
          </span>
        </div>

        {/* Center Scroll Prompt */}
        <div
          ref={scrollIndicatorRef}
          data-cursor="interactive"
          className="pointer-events-auto mx-auto flex flex-col items-center gap-1.5 sm:gap-2 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <span className="font-mono text-[9px] sm:text-[11px] tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border-2 border-neutral-300 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 sm:w-1 sm:h-2 bg-neutral-800 rounded-full animate-bounce" />
          </div>
        </div>

        {/* Right Bottom Tag: Dynamic Category Skills Display */}
        <div className="hero-corner-item pointer-events-auto flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-end max-w-full sm:max-w-[460px]">
          {SKILLS_DATA[selectedCategory].slice(0, 4).map((skill) => (
            <div
              key={skill.name}
              className="font-mono text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/85 border border-neutral-200/90 rounded-md shadow-xs backdrop-blur-sm flex items-center gap-1 transition-all duration-300 hover:border-neutral-900 hover:bg-white"
            >
              <span className="font-medium text-neutral-800">{skill.name}</span>
              {skill.level !== undefined && (
                <span className="text-[9px] sm:text-[10px] text-neutral-400 font-semibold">
                  {skill.level}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
