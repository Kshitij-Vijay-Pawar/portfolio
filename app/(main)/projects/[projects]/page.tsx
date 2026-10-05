import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, User, Tag } from "lucide-react";
import { PROJECTS, type Project } from "@/app/data/projects";

interface PageProps {
  params: Promise<{
    projects: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { projects: slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Project Not Found | Kshitij",
    };
  }

  return {
    title: `${project.title} | Projects | Kshitij`,
    description: project.desc,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projects: slug } = await params;
  const project: Project | undefined = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-white pt-24 sm:pt-28 pb-20 selection:bg-[#ff5500] selection:text-white">
      {/* Top back navigation */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 mb-8">
        <Link
          href="/projects"
          data-cursor="interactive"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Main project header */}
      <header className="max-w-6xl mx-auto px-6 sm:px-8 mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#ff5500] tracking-wider uppercase mb-4">
          <span>{project.category}</span>
          <span className="text-zinc-600">•</span>
          <span>{project.year}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl font-light leading-relaxed mb-8">
          {project.desc}
        </p>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-white/10 text-xs font-mono">
          <div>
            <span className="text-zinc-500 uppercase block mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Client
            </span>
            <span className="text-white font-medium">{project.client || "Self / Concept"}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Year
            </span>
            <span className="text-white font-medium">{project.year}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Role / Domain
            </span>
            <span className="text-white font-medium">{project.category}</span>
          </div>
          {project.liveUrl && (
            <div>
              <span className="text-zinc-500 uppercase block mb-1">Live Preview</span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="interactive"
                className="inline-flex items-center gap-1 text-[#ff5500] hover:text-[#ff7733] font-semibold underline underline-offset-4"
              >
                <span>Visit Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Visual Image */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 mb-16">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Tech Stack & Details */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-10 mb-12">
          <h2 className="text-sm font-mono uppercase text-zinc-400 tracking-widest mb-6">
            Technologies & Tools
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-xs font-mono bg-white/5 border border-white/15 text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-mono font-semibold text-xs uppercase tracking-widest transition-transform hover:scale-105"
            >
              <span>Launch Live Site</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          <Link
            href="/projects"
            data-cursor="interactive"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            <span>All Projects</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
