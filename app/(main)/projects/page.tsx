import type { Metadata } from "next";
import ProjectsHero from "@/app/components/ProjectsHero";
import ProjectsShowcase from "@/app/components/ProjectsShowcase";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects | Kshitij - Creative Developer",
  description:
    "Explore selected creative engineering, 3D web development, and digital product designs.",
};

export default function ProjectsPage() {
  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white">
      {/* 1. Projects Hero Section with Clean White Background */}
      <ProjectsHero />

      {/* 2. Main Interactive Pinned Scroll Showcase */}
      <ProjectsShowcase />

      {/* 3. Bottom CTA Section */}
      <section className="py-24 px-6 sm:px-12 text-center bg-[#070709] border-t border-white/10 flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
          Have an ambitious idea?
        </h2>
        <p className="text-zinc-400 max-w-md text-sm sm:text-base mb-8 font-light">
          Let’s collaborate to build something stunning, immersive, and unforgettable.
        </p>
        <Link
          href="mailto:qudduslarek@gmail.com"
          data-cursor="interactive"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-mono font-semibold text-xs uppercase tracking-widest transition-transform hover:scale-105"
        >
          <span>Get In Touch</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
