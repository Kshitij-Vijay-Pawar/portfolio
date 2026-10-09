"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Database,
  Globe2,
  GraduationCap,
  Heart,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Flame,
  Zap,
} from "lucide-react";
import Mascot from "@/app/components/Mascot";
import { useNav } from "@/app/context/NavContext";

// Tech stack categories
type SkillTab = "all" | "frontend" | "backend" | "database" | "ai_3d" | "tools";

interface Skill {
  name: string;
  category: SkillTab;
  level: number;
  highlight?: string;
}

const SKILLS: Skill[] = [
  { name: "React 19 / Next.js", category: "frontend", level: 98, highlight: "App Router & Server Actions" },
  { name: "TypeScript", category: "frontend", level: 95, highlight: "Strict Type Safety" },
  { name: "Three.js & WebGL", category: "ai_3d", level: 88, highlight: "3D Shaders & Canvas" },
  { name: "GSAP & Motion", category: "frontend", level: 96, highlight: "ScrollTrigger & Timelines" },
  { name: "Tailwind CSS", category: "frontend", level: 96, highlight: "Custom Tokens & Modern CSS" },
  { name: "Node.js & Express", category: "backend", level: 94, highlight: "REST & Realtime APIs" },
  { name: "PostgreSQL & SQL", category: "database", level: 92, highlight: "Relational Modeling" },
  { name: "MongoDB", category: "database", level: 86, highlight: "Document Store" },
  { name: "Redis & Caching", category: "backend", level: 84, highlight: "In-memory Pub/Sub" },
  { name: "Docker & Linux", category: "tools", level: 88, highlight: "Containers & Environments" },
  { name: "Gemini / GenAI APIs", category: "ai_3d", level: 92, highlight: "Structured Output & Tool Calling" },
  { name: "Git & GitHub Actions", category: "tools", level: 95, highlight: "CI/CD & Versioning" },
  { name: "React Native & Electron", category: "frontend", level: 82, highlight: "Cross-platform Apps" },
  { name: "WebSockets & WebRTC", category: "backend", level: 85, highlight: "Realtime Bidirectional Data" },
];

const PHILOSOPHIES = [
  {
    num: "01",
    title: "Performance & Fluid Motion",
    desc: "A great digital experience must feel instantaneous and alive. I obsess over 60fps micro-animations, layout stability, and zero-jank transitions.",
    icon: Zap,
    tag: "AESTHETICS",
  },
  {
    num: "02",
    title: "Resilient System Architecture",
    desc: "Scalable software begins with clean TypeScript contracts, well-structured database schemas, and modular components that stand the test of time.",
    icon: Terminal,
    tag: "ENGINEERING",
  },
  {
    num: "03",
    title: "AI-Augmented Interfaces",
    desc: "AI isn't just a chatbot; it's a creative primitive. I integrate intelligent generative features directly into modern web workflows.",
    icon: Cpu,
    tag: "INNOVATION",
  },
  {
    num: "04",
    title: "Craft & Detail Obsession",
    desc: "From custom cursor mechanics to tactile sound feedback, every pixel, bezier curve, and typography choice is designed intentionally.",
    icon: Sparkles,
    tag: "QUALITY",
  },
];

const MILESTONES = [
  {
    year: "2024 - Present",
    role: "Full Stack & Creative Technologist",
    subtitle: "Modern Web Apps, Three.js & AI Systems",
    desc: "Architecting high-performance digital products, interactive 3D portfolios, and AI-enabled platforms with Next.js, WebGL, and Node.js.",
  },
  {
    year: "2022 - 2026",
    role: "B.Tech in Artificial Intelligence & Data Science",
    subtitle: "Undergraduate Degree • Pune, India",
    desc: "Specialized in machine learning algorithms, distributed computing, database management systems, and advanced software engineering.",
  },
  {
    year: "2023 - 2024",
    role: "Open Source & Frontend Engineering",
    subtitle: "Community & Interactive UI Labs",
    desc: "Built dynamic web experiments, motion design toolkits, real-time messaging apps, and developer-centric utilities.",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<SkillTab>("all");
  const { triggerSurprise, triggerDoubleBlink, resetMascotEmotion } = useNav();

  const filteredSkills =
    activeTab === "all"
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === activeTab);

  return (
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* 1. Background Grid & Dot Matrix Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]" />

        {/* Subtle Architectural Cross-lines */}
        <div className="absolute top-28 left-0 w-full h-[1px] bg-neutral-200/60" />
        <div className="absolute top-0 left-12 md:left-20 w-[1px] h-full bg-neutral-200/50" />
        <div className="absolute top-0 right-12 md:right-20 w-[1px] h-full bg-neutral-200/50" />

        {/* Soft Ambient Radial Glows */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-neutral-200/40 via-stone-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col space-y-24 sm:space-y-32">
        {/* =================================================================
            SECTION 1: HERO & EDITORIAL INTRO
            ================================================================= */}
        <section className="flex flex-col">
          {/* Top Metadata Header Row */}
          <div className="w-full flex items-center justify-between pb-6 mb-8 border-b border-neutral-200/80 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
              <span className="text-neutral-500 uppercase tracking-widest font-semibold">
                02 // ABOUT ME
              </span>
              <span className="text-neutral-300 hidden sm:inline">|</span>
              <span className="text-neutral-600 hidden sm:inline">
                KSHITIJ VIJAY PAWAR
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-neutral-400">
                <span>LOC:</span>
                <span className="text-neutral-800 font-semibold">
                  [43.978412° N, 15.383477° E] &middot; PUNE, IN
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>OPEN FOR WORK</span>
              </div>
            </div>
          </div>

          {/* Main Hero Headline & Portrait Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column (Headline + Bio + Action CTAs) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff5500] font-bold">
                <Flame className="w-4 h-4 text-[#ff5500]" />
                Full-Stack Engineer &amp; Creative Technologist
              </div>

              <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] font-black uppercase tracking-[-0.04em] leading-[0.92] text-neutral-950">
                CRAFTING MODERN <br />
                WEB EXPERIENCES <br />
                WITH PURPOSE<span className="text-[#ff5500]">.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                Hi, I&apos;m <strong className="font-semibold text-neutral-900">Kshitij Pawar</strong>. 
                I bridge the gap between creative visual design and robust software engineering. 
                With a background in <strong className="font-semibold text-neutral-900">Artificial Intelligence &amp; Data Science</strong>, 
                I build high-performance web applications, interactive 3D environments, and intelligent AI tools that leave a memorable impression.
              </p>

              {/* Stat Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    3+
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    Years Coding
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    100%
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    Type-Safe Code
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-[#ff5500] font-sans tracking-tight">
                    60 FPS
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    Smooth Motion
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/resume/Kshitij_Resume.pdf"
                  download
                  data-cursor="interactive"
                  onMouseEnter={() => triggerDoubleBlink()}
                  onMouseLeave={() => resetMascotEmotion()}
                  className="px-6 py-3.5 rounded-xl bg-neutral-950 text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2.5 hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Resume</span>
                </a>

                <Link
                  href="/projects"
                  data-cursor="interactive"
                  className="px-6 py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 hover:border-neutral-900 transition-all shadow-xs"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                </Link>

                <Link
                  href="/ai"
                  data-cursor="interactive"
                  onMouseEnter={() => triggerSurprise()}
                  onMouseLeave={() => resetMascotEmotion()}
                  className="px-4 py-3.5 rounded-xl bg-orange-50 border border-orange-200 text-[#ff5500] font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-100 transition-all"
                  title="Ask my AI Mascot anything about me!"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI Companion</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Portrait Card with Technical Editorial Framing */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl bg-neutral-100 border border-neutral-200/90 p-3 shadow-xl overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-dot-grid-fine opacity-70" />
                
                {/* Corner Technical Crosshairs */}
                <div className="absolute top-4 left-4 font-mono text-[9px] text-neutral-400 z-20">
                  SYS // P-01
                </div>
                <div className="absolute top-4 right-4 font-mono text-[9px] text-neutral-400 z-20">
                  [DEV_PORTRAIT]
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-neutral-400 z-20">
                  43.978° N &middot; 15.383° E
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-neutral-400 z-20">
                  KSHITIJ // 2026
                </div>

                {/* Inner Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900">
                  <Image
                    src="/images/Modern Developer Profile Portrait.png"
                    alt="Kshitij Pawar"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Live Badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                        PRIMARY FOCUS
                      </span>
                      <span className="text-xs font-semibold tracking-wide">
                        Full-Stack &amp; Creative Dev
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 2: CORE PHILOSOPHY & HOW I WORK (BENTO GRID)
            ================================================================= */}
        <section className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200/80">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                Principles
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                Engineering Philosophy<span className="text-[#ff5500]">.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-mono max-w-sm">
              Standards I follow to deliver scalable, delightful, and high-impact digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHILOSOPHIES.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.num}
                  className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                        {item.tag}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        SYS // {item.num}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-neutral-950 group-hover:text-[#ff5500] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================
            SECTION 3: TECHNICAL ARSENAL & SKILL MATRIX
            ================================================================= */}
        <section className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200/80">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                Stack
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                Technical Arsenal<span className="text-[#ff5500]">.</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  { id: "all", label: "ALL" },
                  { id: "frontend", label: "FRONTEND" },
                  { id: "backend", label: "BACKEND" },
                  { id: "database", label: "DATABASE" },
                  { id: "ai_3d", label: "AI & 3D" },
                  { id: "tools", label: "TOOLS" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-cursor="interactive"
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-neutral-950 text-white font-semibold shadow-xs"
                      : "bg-white/80 border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid of Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-4 rounded-2xl bg-white/85 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-[#ff5500] transition-colors">
                      {skill.name}
                    </span>
                    {skill.highlight && (
                      <span className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        {skill.highlight}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress bar track */}
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 group-hover:bg-[#ff5500] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            SECTION 4: EXPERIENCE & EDUCATION ROADMAP
            ================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Experience Timeline (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="pb-4 border-b border-neutral-200/80">
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                Journey
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
                Experience &amp; Milestones<span className="text-[#ff5500]">.</span>
              </h2>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
              {MILESTONES.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-neutral-900 group-hover:border-[#ff5500] group-hover:scale-125 transition-all" />

                  <div className="p-5 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-xs flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                      <span className="font-semibold text-[#ff5500]">{item.year}</span>
                      <span>STATUS // VERIFIED</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {item.role}
                    </h3>
                    <p className="text-xs font-medium text-neutral-600">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed pt-1 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education & Academic Credentials (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="pb-4 border-b border-neutral-200/80">
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                Academics
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
                Education<span className="text-[#ff5500]">.</span>
              </h2>
            </div>

            {/* Degree Card */}
            <div className="p-6 rounded-3xl bg-white/90 border border-neutral-200/90 shadow-xs flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div className="flex flex-col space-y-1">
                <span className="font-mono text-xs text-[#ff5500] font-semibold">
                  BACHELOR OF TECHNOLOGY (B.TECH)
                </span>
                <h3 className="text-lg font-bold text-neutral-950 leading-snug">
                  Artificial Intelligence &amp; Data Science
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  Pune, Maharashtra, India &middot; 2022 - 2026
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Rigorous curriculum covering Data Structures, Machine Learning, Deep Neural Networks, Cloud Systems, and Advanced Web Engineering.
              </p>

              <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5">
                {[
                  "Algorithms & DSA",
                  "Deep Learning",
                  "Database Systems",
                  "Distributed Architecture",
                  "AI Ethics",
                ].map((course) => (
                  <span
                    key={course}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 text-[10px] font-mono text-neutral-700"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Mascot Feature Callout */}
            <div className="p-6 rounded-3xl bg-neutral-950 text-white flex items-center justify-between gap-4 shadow-lg">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  AI ASSISTANT
                </span>
                <h4 className="text-sm font-bold">Want to chat with me directly?</h4>
                <p className="text-xs text-neutral-400 font-light max-w-[200px]">
                  My custom AI mascot is trained on all my skills &amp; projects.
                </p>
                <Link
                  href="/ai"
                  data-cursor="interactive"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#ff5500] pt-2 hover:underline"
                >
                  <span>Launch AI Chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Link href="/ai" data-cursor="interactive" className="shrink-0">
                <Mascot sizeClassName="w-20 h-20" />
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 5: BOTTOM CTA SECTION
            ================================================================= */}
        <section className="relative w-full rounded-3xl bg-white border border-neutral-200/90 p-8 sm:p-12 md:p-16 shadow-lg overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-dot-grid-fine opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-widest text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
              LET’S COLLABORATE
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 leading-[0.95]">
              HAVE AN IDEA OR <br />
              PROJECT IN MIND<span className="text-[#ff5500]">?</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              I am currently open to full-time engineering roles, freelance opportunities, and ambitious collaborations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contact"
                data-cursor="interactive"
                className="px-8 py-4 rounded-xl bg-neutral-950 text-white font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <a
                href="mailto:kshitij.vijay.pawar@gmail.com"
                data-cursor="interactive"
                className="px-8 py-4 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                kshitij.vijay.pawar@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
