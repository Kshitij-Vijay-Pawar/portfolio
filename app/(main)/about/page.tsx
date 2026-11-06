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
  Terminal,
  GraduationCap,
  Briefcase,
  Flame,
  Zap,
  CheckCircle2,
} from "lucide-react";
import HomeJourneySection from "@/app/components/HomeJourneySection";
import ProjectsCtaTransition from "@/app/components/ProjectsCtaTransition";
import { useNav } from "@/app/context/NavContext";
import ArchitecturalBackground from "@/app/components/ui/ArchitecturalBackground";
import { PROFILE } from "@/data/profile";

// Tech stack categories
type SkillTab =
  | "all"
  | "frontend"
  | "backend"
  | "database"
  | "queues_ai"
  | "languages_tools";

interface Skill {
  name: string;
  category: SkillTab;
  level: number;
  highlight?: string;
}

const SKILLS: Skill[] = [
  {
    name: "React.js & Next.js",
    category: "frontend",
    level: 95,
    highlight: "App Router, Server Actions & SSR",
  },
  {
    name: "TypeScript & JavaScript (ES6+)",
    category: "frontend",
    level: 95,
    highlight: "Type-Safe Full-Stack Contracts",
  },
  {
    name: "Tailwind CSS, Bootstrap & Radix UI",
    category: "frontend",
    level: 95,
    highlight: "Responsive UI & Accessible Primitives",
  },
  {
    name: "Redux Toolkit, Zustand & Context API",
    category: "frontend",
    level: 90,
    highlight: "Client State Management",
  },
  {
    name: "React Native (Expo) & Electron",
    category: "frontend",
    level: 85,
    highlight: "Mobile & Desktop Applications",
  },
  {
    name: "GSAP Animations",
    category: "frontend",
    level: 88,
    highlight: "ScrollTrigger & Interactive Timelines",
  },
  {
    name: "Node.js & Express.js",
    category: "backend",
    level: 95,
    highlight: "RESTful APIs, Middleware & MVC",
  },
  {
    name: "PHP & Laravel",
    category: "backend",
    level: 82,
    highlight: "Server-Side Web Applications & APIs",
  },
  {
    name: "JWT, bcryptjs, Clerk & Stripe",
    category: "backend",
    level: 92,
    highlight: "Authentication, Security & Subscriptions",
  },
  {
    name: "PostgreSQL & MySQL (SQL)",
    category: "database",
    level: 94,
    highlight: "Relational Schema Design & Queries",
  },
  {
    name: "Drizzle ORM & Prisma ORM",
    category: "database",
    level: 92,
    highlight: "Type-Safe Migrations & Transactions",
  },
  {
    name: "MongoDB & Mongoose",
    category: "database",
    level: 88,
    highlight: "Document Data Modeling",
  },
  {
    name: "BullMQ & Redis",
    category: "queues_ai",
    level: 90,
    highlight: "Asynchronous Job Queues & Caching",
  },
  {
    name: "Playwright, Puppeteer & Cheerio",
    category: "queues_ai",
    level: 90,
    highlight: "Headless Browser Scraping & PDF Generation",
  },
  {
    name: "Google Gemini & Anthropic Claude APIs",
    category: "queues_ai",
    level: 88,
    highlight: "Structured LLM Outputs & AI Workflows",
  },
  {
    name: "Docker, Git, GitHub & Linux",
    category: "languages_tools",
    level: 90,
    highlight: "Containerized Dev, Bun, Vite & Postman",
  },
  {
    name: "Python, C, C++ & C#",
    category: "languages_tools",
    level: 80,
    highlight: "Programming Foundations, DSA & OOP",
  },
];

const PHILOSOPHIES = [
  {
    num: "01",
    title: "Asynchronous Reliability",
    desc: "Long-running tasks like Playwright browser scraping, multi-step SEO crawls, and PDF generation belong in resilient BullMQ + Redis worker pipelines so HTTP APIs remain fast.",
    icon: Zap,
    tag: "SYSTEMS",
  },
  {
    num: "02",
    title: "Type-Safe Data Modeling",
    desc: "Clean TypeScript contracts paired with relational PostgreSQL schemas via Drizzle ORM and Prisma prevent runtime bugs and keep full-stack codebases maintainable.",
    icon: Terminal,
    tag: "ARCHITECTURE",
  },
  {
    num: "03",
    title: "Practical AI Integration",
    desc: "Integrating LLMs like Google Gemini and Anthropic Claude where they solve real problems—structured SEO audit synthesis, interactive grammar coaching, and multi-channel sales workflows.",
    icon: Cpu,
    tag: "AI WORKFLOWS",
  },
  {
    num: "04",
    title: "Responsive Product Craft",
    desc: "Across 25+ websites and cross-platform apps, I focus on clean component hierarchies, accessible UI primitives, and smooth GSAP interactions.",
    icon: Sparkles,
    tag: "FRONTEND",
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
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white pt-24 sm:pt-28 overflow-hidden font-sans">
      {/* 1. Unified Background Grid & Dot Matrix Layer */}
      <ArchitecturalBackground dotOpacity={0.65} glowVariant="split" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col space-y-24 sm:space-y-32">
        {/* =================================================================
            SECTION 1: HERO & EDITORIAL INTRO
            ================================================================= */}
        <section className="flex flex-col">
          {/* Main Hero Headline & Portrait Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column (Headline + Bio + Action CTAs) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff5500] font-bold">
                <Flame className="w-4 h-4 text-[#ff5500]" />
                Full-Stack Developer &middot; Pune, Maharashtra, India
              </div>

              <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] font-black uppercase tracking-[-0.04em] leading-[0.92] text-neutral-950">
                BUILDING FULL-STACK <br />
                WEB SYSTEMS &amp; <br />
                ASYNC PIPELINES<span className="text-[#ff5500]">.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl">
                Hi, I&apos;m <strong className="font-semibold text-neutral-900">Kshitij Pawar</strong>, a{" "}
                <strong className="font-semibold text-neutral-900">Full-Stack Developer</strong> based in Pune, India.
                With a <strong className="font-semibold text-neutral-900">B.E. in Artificial Intelligence and Data Science (7.88 CGPA)</strong> and hands-on industry experience across{" "}
                <strong className="font-semibold text-neutral-900">McFlyworld</strong>,{" "}
                <strong className="font-semibold text-neutral-900">Tvara</strong>, and{" "}
                <strong className="font-semibold text-neutral-900">NerdTech Software Company</strong>, I build responsive React &amp; Next.js applications, Node.js/Express &amp; PHP/Laravel APIs, relational PostgreSQL systems, and BullMQ + Redis worker pipelines.
              </p>

              {/* Stat Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    25+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    Websites Delivered
                  </span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-950 font-sans tracking-tight">
                    2 Apps
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    Electron &amp; React Native
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-neutral-200/90 shadow-xs flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#ff5500] font-sans tracking-tight">
                    7.88
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                    B.E. AI &amp; DS CGPA
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <a
                  href="/resume/Kshitij_Resume.pdf"
                  download
                  data-cursor="interactive"
                  onMouseEnter={() => triggerDoubleBlink()}
                  onMouseLeave={() => resetMascotEmotion()}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-neutral-950 text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group cursor-pointer"
                >
                  <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Resume</span>
                </a>

                <Link
                  href="/projects"
                  data-cursor="interactive"
                  className="flex-1 sm:flex-none justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 hover:border-neutral-900 transition-all shadow-xs"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-neutral-500" />
                </Link>

                <Link
                  href="/ai"
                  data-cursor="interactive"
                  onMouseEnter={() => triggerSurprise()}
                  onMouseLeave={() => resetMascotEmotion()}
                  className="flex-1 sm:flex-none justify-center px-4 py-3 sm:py-3.5 rounded-xl bg-orange-50 border border-orange-200 text-[#ff5500] font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 hover:bg-orange-100 transition-all"
                  title="Ask my AI Mascot anything about me!"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Companion</span>
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
                  PUNE // IN
                </div>
                <div className="absolute top-4 right-4 font-mono text-[9px] text-neutral-400 z-20">
                  [FULL_STACK_DEV]
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-neutral-400 z-20">
                  18.5204° N &middot; 73.8567° E
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-neutral-400 z-20">
                  KSHITIJ // PAWAR
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
                        ROLE &amp; FOCUS
                      </span>
                      <span className="text-xs font-semibold tracking-wide">
                        Full-Stack Developer
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
      </div>

      {/* =================================================================
          SECTION 2: FULL-BLEED CHRONOLOGICAL JOURNEY TIMELINE
          ================================================================= */}
      <div className="relative z-10 w-full mt-24 sm:mt-32">
        <HomeJourneySection />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 mt-24 sm:mt-32 pb-24 sm:pb-32 flex flex-col space-y-24 sm:space-y-32">
        {/* =================================================================
            SECTION 3: CORE PHILOSOPHY & HOW I WORK (BENTO GRID)
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
              Standards I follow to deliver scalable, reliable, and well-structured full-stack applications.
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
            SECTION 4: TECHNICAL ARSENAL & SKILL MATRIX
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
                  { id: "frontend", label: "FRONTEND & APPS" },
                  { id: "backend", label: "BACKEND" },
                  { id: "database", label: "DATABASES & ORMS" },
                  { id: "queues_ai", label: "QUEUES, SCRAPING & AI" },
                  { id: "languages_tools", label: "LANGUAGES & TOOLS" },
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
            SECTION 5: ACADEMIC EDUCATION RECORD
            ================================================================= */}
        <section className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200/80">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                Academic Credentials
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                Education<span className="text-[#ff5500]">.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROFILE.education.history.map((edu, idx) => (
              <div
                key={edu.qualification}
                className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[#ff5500]" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-neutral-500">
                      {edu.period}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-1">
                    {edu.qualification}
                  </h3>
                  <p className="text-xs text-neutral-600 font-medium">
                    {edu.institution}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {edu.location}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    {idx === 0 ? "FINAL GRADE" : "PERCENTAGE"}
                  </span>
                  <span className="font-bold text-[#ff5500]">{edu.score}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* =================================================================
          SECTION 6: CHRONOLOGICAL CINEMATIC TIMELINE COMPONENT
          ================================================================= */}


      {/* =================================================================
          SECTION 7: CINEMATIC TRANSITION CTA SECTION
          ================================================================= */}
      <div className="w-full">
        <ProjectsCtaTransition />
      </div>
    </div>
  );
}
