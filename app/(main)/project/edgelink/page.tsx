import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
} from "lucide-react";
import ProjectsCtaTransition from "@/app/components/ProjectsCtaTransition";

export const metadata: Metadata = {
  title: "Edgelink | Projects | Kshitij Pawar",
  description:
    "Autonomous AI SEO auditing engine with a 7-step signal pipeline, BullMQ workers, Claude AI analysis, and Puppeteer PDF reports.",
};

const ARCHITECTURAL_HIGHLIGHTS = [
  "7-step SEO signal pipeline executing HTML crawl, on-page tag inspection, JSON-LD schema validation, robots.txt/sitemap checks, PageSpeed/CrUX metrics, backlink signals, and keyword rankings.",
  "Background worker architecture using BullMQ and Redis with 2 retries and exponential backoff, keeping heavy audits off the main HTTP thread.",
  "Anthropic Claude integration transforming raw technical audit signals into structured JSON executive summaries, severity-ranked issues, and prioritized action items.",
  "Headless Chromium PDF generator via Puppeteer rendering agency-branded executive audit reports on demand.",
];

const KEY_FEATURES = [
  "Multi-step technical & on-page SEO signal extraction pipeline",
  "Dual-mode external API adapters supporting live keys or deterministic mock signals",
  "Transactional Prisma persistence storing Audit, Issue, ActionItem, and Report records",
  "Shareable client portal with token-based access and downloadable PDF reports",
];

const TAGS = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma ORM",
  "Redis",
  "BullMQ",
  "Anthropic Claude",
  "Puppeteer",
  "Cheerio",
];

export default function EdgelinkProjectPage() {
  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white pt-24 sm:pt-28 pb-20 selection:bg-[#ff5500] selection:text-white">
      {/* Top back navigation */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-8 flex items-center justify-between">
        <Link
          href="/projects"
          data-cursor="interactive"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <span className="text-xs font-mono text-zinc-500">PROJECT 03 / 07</span>
      </div>

      {/* Main project header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#ff5500] tracking-wider uppercase mb-3 sm:mb-4">
          <span>AI SEO ENGINE / ASYNC PIPELINE</span>
          <span className="text-zinc-600">•</span>
          <span>2025</span>
          <span className="text-zinc-600">•</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px]">
            Completed
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6">
          EDGELINK
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-4xl font-light leading-relaxed mb-6 sm:mb-8">
          An AI-assisted SEO auditing platform and client reporting portal built around a 7-step signal collection pipeline (HTML crawling, on-page analysis, JSON-LD schema validation, robots/sitemap verification, and external signal adapters), asynchronous BullMQ + Redis workers, Anthropic Claude structured analysis, transactional PostgreSQL/Prisma persistence, and Puppeteer executive PDF generation.
        </p>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-white/10 text-xs font-mono">
          <div>
            <span className="text-zinc-500 uppercase mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Context / Scope
            </span>
            <span className="text-white font-medium">AI SEO &amp; Reporting Platform</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Year
            </span>
            <span className="text-white font-medium">2025</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Domain
            </span>
            <span className="text-white font-medium">AI SEO ENGINE / ASYNC PIPELINE</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase mb-1 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Source Code
            </span>
            <a
              href="https://github.com/Kshitij-Vijay-Pawar/Edgelink"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="inline-flex items-center gap-1 text-[#ff5500] hover:text-[#ff7733] font-semibold underline underline-offset-4"
            >
              <span>GitHub Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Visual Image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/projects/am-1.avif"
            alt="Edgelink"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Architecture & Implemented Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xs sm:text-sm font-mono uppercase text-[#ff5500] tracking-widest mb-5 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Architecture &amp; Technical Decisions</span>
            </h2>
            <ul className="space-y-3.5">
              {ARCHITECTURAL_HIGHLIGHTS.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed"
                >
                  <span className="font-mono text-xs text-[#ff5500] font-bold mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xs sm:text-sm font-mono uppercase text-[#ff5500] tracking-widest mb-5 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Verified Implemented Scope</span>
            </h2>
            <ul className="space-y-3.5">
              {KEY_FEATURES.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 sm:p-8 md:p-10">
          <h2 className="text-xs sm:text-sm font-mono uppercase text-zinc-400 tracking-widest mb-4 sm:mb-6">
            Technologies &amp; Tools
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono bg-white/5 border border-white/15 text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
          <a
            href="https://github.com/Kshitij-Vijay-Pawar/Edgelink"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-mono font-semibold text-xs uppercase tracking-widest transition-transform hover:scale-105"
          >
            <span>GitHub Repository</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <Link
            href="/projects"
            data-cursor="interactive"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            <span>All Projects</span>
          </Link>
        </div>

        {/* Previous / Next Project Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-white/10">
          <Link
            href="/project/accentra"
            data-cursor="interactive"
            className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#ff5500]/60 transition-all group flex flex-col justify-between"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Previous Project
            </span>
            <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff5500] transition-colors">
              ACCENTRA
            </span>
          </Link>

          <Link
            href="/project/mcfly-pos-website"
            data-cursor="interactive"
            className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#ff5500]/60 transition-all group flex flex-col justify-between sm:text-right sm:items-end"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
              Next Project
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff5500] transition-colors">
              MCFLY POS WEBSITE
            </span>
          </Link>
        </div>
      </section>

      <ProjectsCtaTransition />
    </div>
  );
}

