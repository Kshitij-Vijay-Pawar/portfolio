import type { Metadata } from "next";
import ProjectsHero from "@/app/components/ProjectsHero";
import ProjectsShowcase from "@/app/components/ProjectsShowcase";
import ProjectsCtaTransition from "@/app/components/ProjectsCtaTransition";
import JsonLd from "@/app/components/JsonLd";
import {
  constructMetadata,
  getBreadcrumbJsonLd,
  getProjectsCollectionJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Selected Full-Stack & AI Projects | Kshitij Pawar",
  description:
    "Explore verified full-stack engineering case studies by Kshitij Pawar: Google Maps Lead Scraper (Playwright, BullMQ, Redis, PostgreSQL), Accentra AI Language Platform, Edgelink SEO Engine, McFly POS Website, and more.",
  path: "/projects",
  keywords: [
    "Kshitij Pawar Projects",
    "Google Maps Lead Scraper BullMQ Playwright",
    "Accentra Language Learning Next.js",
    "Edgelink AI SEO Engine",
    "Full-Stack Portfolio Case Studies",
  ],
});

export default function ProjectsPage() {
  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white">
      <JsonLd
        data={[
          getProjectsCollectionJsonLd(),
          getBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Selected Projects", path: "/projects" },
          ]),
        ]}
      />

      {/* 1. Projects Hero Section with Clean White Background */}
      <ProjectsHero />

      {/* 2. Main Interactive Pinned Scroll Showcase */}
      <ProjectsShowcase />

      {/* 3. Cinematic Transition CTA Section */}
      <ProjectsCtaTransition />
    </div>
  );
}
