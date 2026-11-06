"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  FileText,
  Layout,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
} from "lucide-react";
import ArchitecturalBackground from "@/app/components/ui/ArchitecturalBackground";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/app/data/projects";

const RESUME_PDF_URL = "/resume/Kshitij_Resume.pdf";
const RESUME_DOWNLOAD_ENDPOINT = "/api/resume";
const RESUME_DOWNLOAD_FILENAME = "Kshitij_Pawar_Resume.pdf";

export default function ResumePage() {
  const [viewMode, setViewMode] = useState<"pdf" | "interactive">("pdf");
  const [zoom, setZoom] = useState<number>(100);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const hasAutoDownloadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const triggerPdfDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = RESUME_DOWNLOAD_ENDPOINT;
    link.download = RESUME_DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadTriggered(true);
  }, []);

  // Immediately start downloading the PDF the moment the user lands on /resume
  useEffect(() => {
    if (hasAutoDownloadedRef.current) return;
    hasAutoDownloadedRef.current = true;
    triggerPdfDownload();
  }, [triggerPdfDownload]);

  const handleZoomIn = () => setZoom((z) => Math.min(150, z + 15));
  const handleZoomOut = () => setZoom((z) => Math.max(70, z - 15));
  const handleZoomReset = () => setZoom(100);

  const handlePrint = () => {
    if (viewMode === "pdf" && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch {
        // Fallback to window.open print
      }
    }
    window.open(RESUME_PDF_URL, "_blank");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white pt-24 sm:pt-28 pb-24 overflow-x-hidden font-sans">
      <ArchitecturalBackground dotOpacity={0.6} glowVariant="subtle" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col space-y-6">
        {/* Top Breadcrumb & Download Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            data-cursor="interactive"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-900 text-xs font-mono uppercase tracking-widest text-neutral-700 hover:text-neutral-950 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {downloadTriggered && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume PDF Downloaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/90">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-[#ff5500] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
              Curriculum Vitae // Official Document
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 leading-none">
              KSHITIJ PAWAR &mdash; RESUME<span className="text-[#ff5500]">.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={triggerPdfDownload}
              data-cursor="interactive"
              className="px-5 py-3 rounded-xl bg-neutral-950 hover:bg-[#ff5500] text-white font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadTriggered ? "Download PDF Again" : "Download PDF"}</span>
            </button>

            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="px-4 py-3 rounded-xl bg-white border border-neutral-300 hover:border-neutral-950 text-neutral-900 font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all"
            >
              <span>Raw PDF</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>
        </div>

        {/* Custom Portfolio-Styled Viewer Control Deck */}
        <div className="sticky top-20 z-30 rounded-2xl bg-[#09090b]/95 backdrop-blur-xl border border-neutral-800 text-white px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.22)] flex flex-wrap items-center justify-between gap-3">
          {/* Left: View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-white/[0.06] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("pdf")}
              data-cursor="interactive"
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "pdf"
                  ? "bg-[#ff5500] text-white font-bold shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("interactive")}
              data-cursor="interactive"
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "interactive"
                  ? "bg-[#ff5500] text-white font-bold shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Interactive View</span>
            </button>
          </div>

          {/* Center: Custom Zoom Controls */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              data-cursor="interactive"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white font-semibold min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              data-cursor="interactive"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              title="Reset Zoom"
              data-cursor="interactive"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Print & Download */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              data-cursor="interactive"
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 font-mono text-[11px] uppercase tracking-wider text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#ff5500]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={triggerPdfDownload}
              data-cursor="interactive"
              className="px-3.5 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-[#ff5500] hover:text-white font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PDF</span>
            </button>
          </div>
        </div>

        {/* Document Stage */}
        <div className="w-full rounded-3xl bg-[#09090b] border border-neutral-900 p-3 sm:p-6 md:p-8 shadow-2xl overflow-x-auto flex justify-center">
          {viewMode === "pdf" ? (
            <div
              style={{
                width: `${zoom}%`,
                minWidth: "320px",
                maxWidth: "100%",
              }}
              className="transition-all duration-200 ease-out rounded-2xl overflow-hidden bg-white shadow-[0_25px_70px_rgba(0,0,0,0.65)] border border-white/15"
            >
              {/* Clean PDF Frame with native browser toolbar suppressed via #toolbar=0&navpanes=0 */}
              <iframe
                ref={iframeRef}
                src={`${RESUME_PDF_URL}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="Kshitij Pawar Resume PDF"
                className="w-full h-[82vh] min-h-[760px] bg-white border-0"
              />
            </div>
          ) : (
            /* Portfolio-Styled Interactive Web Resume Sheet */
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
              className="w-full max-w-4xl rounded-2xl bg-white text-neutral-900 p-6 sm:p-10 md:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.65)] border border-neutral-200 transition-transform duration-200 space-y-8"
            >
              {/* Resume Sheet Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-neutral-950">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
                    {PROFILE.name}
                  </h2>
                  <p className="text-sm font-mono uppercase tracking-widest text-[#ff5500] font-semibold mt-1">
                    {PROFILE.role}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1 text-xs font-mono text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ff5500]" />
                    {PROFILE.contact.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ff5500]" />
                    {PROFILE.contact.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff5500]" />
                    {PROFILE.contact.location}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold mb-2">
                  Professional Summary
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {PROFILE.bio}
                </p>
              </div>

              {/* Experience & Training */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Experience, Internships &amp; Training</span>
                </h3>
                <div className="space-y-5">
                  {PROFILE.experience.map((exp) => (
                    <div
                      key={`${exp.company}-${exp.period}`}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-neutral-950">
                            {exp.role}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white font-mono text-[9px] uppercase">
                            {exp.type === "Training"
                              ? "Training (Not Employment)"
                              : exp.type}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-neutral-500">
                          {exp.company === "McFlyworld"
                            ? "May 2026 – Present"
                            : exp.period}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#ff5500] font-semibold mb-2">
                        {exp.company} &middot; {exp.location}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700">
                        {exp.highlights.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Projects */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold mb-4 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Key Engineering Projects</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECTS.map((proj) => (
                    <Link
                      key={proj.id}
                      href={proj.route}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-950 transition-all block"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-neutral-950">
                          {proj.title}
                        </h4>
                        <span className="font-mono text-[10px] text-[#ff5500]">
                          {proj.year}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                        {proj.desc}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {proj.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white border border-neutral-200 font-mono text-[9px] text-neutral-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PROFILE.education.history.map((edu) => (
                    <div
                      key={edu.qualification}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80"
                    >
                      <span className="font-mono text-[10px] text-neutral-500">
                        {edu.period}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-950 mt-0.5">
                        {edu.qualification}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {edu.institution}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#ff5500] mt-2">
                        {edu.score}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff5500] font-bold mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>Technical Skills</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ...PROFILE.verifiedSkills.frontend,
                    ...PROFILE.verifiedSkills.backend,
                    ...PROFILE.verifiedSkills.database,
                    ...PROFILE.verifiedSkills.creative3d,
                    ...PROFILE.verifiedSkills.tools,
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 font-mono text-[10px] text-neutral-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
