import type { Metadata } from "next";
import ProjectsHero from "@/app/components/ProjectsHero";
import ProjectsShowcase from "@/app/components/ProjectsShowcase";
import ProjectsCtaTransition from "@/app/components/ProjectsCtaTransition";

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

      {/* 3. Cinematic Transition CTA Section */}
      <ProjectsCtaTransition />
    </div>
  );
}
