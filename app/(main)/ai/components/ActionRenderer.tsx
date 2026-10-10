"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Download, Compass, ExternalLink } from "lucide-react";
import { AIAction } from "@/lib/ai/schema";

interface ActionRendererProps {
  actions: AIAction[];
}

export default function ActionRenderer({ actions }: ActionRendererProps) {
  const router = useRouter();

  if (!actions || actions.length === 0) {
    return null;
  }

  const renderIcon = (type: AIAction["type"]) => {
    switch (type) {
      case "download_resume":
        return <Download className="w-3.5 h-3.5 shrink-0" />;
      case "open_url":
        return <ExternalLink className="w-3.5 h-3.5 shrink-0" />;
      case "show_project":
      case "navigate":
      default:
        return <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <div className="mt-3 pt-2.5 border-t border-neutral-200/80 flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 mr-1">
        <Compass className="w-3 h-3 text-[#f03e2f]" />
        <span>SUGGESTED ACTIONS:</span>
      </div>

      {actions.map((act, index) => {
        // 1. Resume download button
        if (act.type === "download_resume") {
          return (
            <a
              key={`${act.type}-${index}`}
              href={act.target}
              download="Kshitij_Resume.pdf"
              data-cursor="interactive"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-mono font-medium shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {renderIcon(act.type)}
              <span>{act.label}</span>
            </a>
          );
        }

        // 2. External verified URL button
        if (act.type === "open_url") {
          return (
            <a
              key={`${act.type}-${index}`}
              href={act.target}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 text-xs font-mono font-medium shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {renderIcon(act.type)}
              <span>{act.label}</span>
            </a>
          );
        }

        // 3. Internal navigation (navigate or show_project)
        return (
          <button
            key={`${act.type}-${index}`}
            type="button"
            onClick={() => router.push(act.target)}
            data-cursor="interactive"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 text-xs font-mono font-medium shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {renderIcon(act.type)}
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}
