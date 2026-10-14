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
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const selectedCategory = SKILL_CATEGORIES[selectedIndex];

  // Track window resize for responsive canvas font size and layout tuning
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Dynamic font sizing & reach for TechText canvases based on screen width
  const developerFontSize =
    windowWidth < 480
      ? 88
      : windowWidth < 640
        ? 100
        : windowWidth < 780
          ? 118
          : windowWidth < 1024
            ? 140
            : 160;

  const kshitijFontSize =
    windowWidth < 480
      ? 92
      : windowWidth < 640
        ? 108
        : windowWidth < 780
          ? 130
          : windowWidth < 1024
            ? 152
            : 170;

  const developerReach = windowWidth < 640 ? 150 : 180;
  const kshitijReach = windowWidth < 640 ? 170 : 220;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[660px] max-h-[1200px] flex flex-col justify-between overflow-hidden bg-[#fafaf9] pt-16 sm:pt-20 md:pt-24 pb-0 sm:pb-2 px-3 sm:px-6 md:px-12 lg:px-14 select-none"
    >
      {/* 1. Background Grid & Dot Matrix Layer with Parallax */}
      <div
        ref={dotsRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <ArchitecturalBackground dotOpacity={0.7} glowVariant="center" />
      </div>

      {/* 2. Top Header Content & Status Badge */}
      <div className="relative z-20 w-full flex items-center justify-center sm:justify-between pointer-events-none px-2 sm:px-0">
        {/* Left Sub-Header Detail: On mobile centered with no bg and no border */}
        <div className="hero-corner-item flex items-center gap-2">
          <span className="font-mono text-[10px] sm:text-xs text-neutral-400">LOC</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=43.978412,15.383477"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="font-mono text-[10px] sm:text-xs font-semibold text-neutral-800 tracking-wider cursor-pointer pointer-events-auto hover:opacity-75 transition-opacity"
          >
            [43.978412° N, 15.383477° E]
          </a>
        </div>

        {/* Right Sub-Header Detail: Hidden on mobile (<640px) */}
        <div className="hero-corner-item hidden sm:flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs text-neutral-400">STACK</span>
          <span className="font-mono text-xs font-semibold text-neutral-800 tracking-wider">
            NEXT.JS // GSAP // THREE
          </span>
        </div>
      </div>

      {/* 3. Central Canvas: Big Watermark + Giant TechText + Centered Hero Portrait + Side Badges */}
      <div className="relative w-full flex-1 flex items-center justify-center my-auto">

        {/* DEVELOPER TechText Typography: Top-left / center on mobile */}
        <div
          ref={watermarkRef}
          data-cursor="interactive"
          className="absolute top-1 sm:top-2 md:top-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 md:left-8 w-[320px] sm:w-[420px] md:w-[600px] lg:w-[740px] xl:w-[820px] h-[95px] sm:h-[130px] md:h-[180px] lg:h-[240px] pointer-events-auto z-[5] select-none max-w-full opacity-60 flex items-center justify-center sm:justify-start"
        >
          <TechText
            key={`dev-${developerFontSize}`}
            text="DEVELOPER"
            fontWeight={800}
            fontSize={developerFontSize}
            reveal="letter"
            dashLength={4}
            dashGap={3}
            specks={16}
            fontFamily=""
            color="#676767"
            accentColor="#94a3b8"
            letterSpacing={-0.03}
            reach={developerReach}
            softness={0.7}
            strokeWidth={1.5}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
            canvasPadding={800}
          />
        </div>

        {/* KSHITIJ TechText Layer: Positioned bottom-right on desktop, bottom-center on mobile */}
        <div
          ref={techTextRef}
          data-cursor="interactive"
          className="absolute top-[88px] sm:top-auto sm:bottom-0 md:bottom-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-4 md:right-8 w-[320px] sm:w-[420px] md:w-[600px] lg:w-[720px] xl:w-[780px] h-[95px] sm:h-[130px] md:h-[180px] lg:h-[220px] flex items-center justify-center sm:justify-end z-10 sm:z-30 pointer-events-auto select-none max-w-full drop-shadow-[0_4px_16px_rgba(255,255,255,0.85)] filter"
        >
          <TechText
            key={`ksh-${kshitijFontSize}`}
            text="KSHITIJ"
            fontWeight={800}
            fontSize={kshitijFontSize}
            reveal="letter"
            dashLength={5}
            dashGap={3}
            specks={20}
            fontFamily=""
            color="#080808"
            accentColor="#000000"
            letterSpacing={-0.03}
            reach={kshitijReach}
            softness={0.7}
            strokeWidth={1.8}
            speed={1}
            lineStyle="dashed"
            selection
            labels
            draggable
            sweep
            canvasPadding={800}
          />
        </div>

        {/* Centered Hero Cutout Portrait: Bigger on mobile */}
        <div
          ref={heroImgRef}
          className="relative z-20 flex items-end justify-center pointer-events-none h-full w-full max-w-6xl mt-10 sm:mt-0"
        >
          <div className="relative w-full sm:w-[540px] md:w-[700px] lg:w-[820px] xl:w-[940px] h-[62svh] sm:h-[82svh] md:h-[86svh] max-h-[960px] min-h-[400px]">
            <Image
              src={heroImage}
              alt="Kshitij - Creative Developer"
              priority
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1200px) 820px, 940px"
              className="object-contain object-bottom drop-shadow-[0_24px_50px_rgba(0,0,0,0.22)] filter contrast-[1.03]"
            />
          </div>
        </div>

        {/* Floating Context Badges & Editorial Detail Cards */}
        <div
          ref={badgesRef}
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-2 sm:px-4"
        >
          {/* Left: OptionWheel (hidden on very small screens < 640px) */}
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

          {/* Right Area: Dynamic Category Technical Graph Lines (Visible on all screens >= 768px, and streamlined on tablet) */}
          <div className="parallax-lines-container hidden md:flex flex-col gap-3.5 translate-y-6 max-w-[260px] lg:max-w-[340px] xl:max-w-[390px] w-full pointer-events-auto bg-white/40 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-3 lg:p-0 rounded-xl border border-neutral-200/50 lg:border-none shadow-xs lg:shadow-none">
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
                    <span className="text-neutral-600 lg:text-neutral-500 font-medium group-hover:text-neutral-900 transition-colors">
                      {label} &middot; {skill.name}
                    </span>
                    <span className="text-neutral-900 lg:text-neutral-700 font-semibold font-mono">
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

      {/* 4. Mobile Technical Stat HUD — pinned to bottom, always visible on < 768px */}
      <div className="relative z-30 w-full flex-shrink-0 flex md:hidden flex-col gap-1.5 pb-3 pt-1 px-3 pointer-events-auto bg-gradient-to-t from-[#fafaf9]/95 via-[#fafaf9]/80 to-transparent">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-neutral-500 border-b border-neutral-200/60 pb-1">
          <span className="font-semibold text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
            {selectedCategory}
          </span>
          <span className="text-neutral-400">SYSTEM METRICS</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SKILLS_DATA[selectedCategory].slice(0, 4).map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-neutral-200/70 shadow-sm"
            >
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-neutral-600 truncate max-w-[90px] font-medium">{skill.name}</span>
                <span className="text-neutral-900 font-bold ml-1">
                  {skill.level !== undefined ? `${skill.level}%` : "EXP"}
                </span>
              </div>
              <div className="h-[2px] w-full bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-950 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level ?? 88}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
