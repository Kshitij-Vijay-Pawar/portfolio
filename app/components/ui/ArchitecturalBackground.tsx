import React from "react";

interface ArchitecturalBackgroundProps {
  className?: string;
  /** Dot pattern opacity (default: 0.7) */
  dotOpacity?: number;
  /** Whether to show subtle crosshair blueprint lines (default: true) */
  showGridLines?: boolean;
  /** Radial gradient glow tint color/style (default: warm orange/zinc glow) */
  glowVariant?: "center" | "split" | "subtle" | "none";
}

/**
 * ArchitecturalBackground
 *
 * Unified design token background for light/white surfaces across the portfolio.
 * Features:
 *  - Radial dot matrix pattern (.bg-dot-pattern) with central vignette mask
 *  - Subtle architectural crosshairs & guide lines
 *  - Soft ambient radial glow
 *  - Pointer-events-none & fully responsive
 */
export default function ArchitecturalBackground({
  className = "",
  dotOpacity = 0.7,
  showGridLines = true,
  glowVariant = "center",
}: ArchitecturalBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none ${className}`}
    >
      {/* 1. Dot Matrix Pattern with central radial mask */}
      <div
        className="absolute inset-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
        style={{ opacity: dotOpacity }}
      />

      {/* 2. Technical Blueprint Crosshair Guide Lines */}
      {showGridLines && (
        <>
          <div className="absolute top-20 sm:top-24 left-0 w-full h-[1px] bg-neutral-200/60" />
          <div className="absolute bottom-16 sm:bottom-20 left-0 w-full h-[1px] bg-neutral-200/60" />
          <div className="absolute top-0 left-8 sm:left-16 md:left-24 w-[1px] h-full bg-neutral-200/50" />
          <div className="absolute top-0 right-8 sm:right-16 md:right-24 w-[1px] h-full bg-neutral-200/50" />
        </>
      )}

      {/* 3. Soft Ambient Radial Glows */}
      {glowVariant === "center" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[700px] lg:w-[900px] h-[320px] sm:h-[500px] md:h-[700px] lg:h-[900px] bg-gradient-to-tr from-neutral-200/40 via-zinc-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      )}

      {glowVariant === "split" && (
        <>
          <div className="absolute top-1/4 -left-20 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] bg-gradient-to-tr from-orange-100/35 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-2/3 -right-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-bl from-neutral-200/40 via-stone-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {glowVariant === "subtle" && (
        <div className="absolute top-1/3 right-1/4 w-[360px] sm:w-[550px] lg:w-[700px] h-[360px] sm:h-[550px] lg:h-[700px] bg-gradient-to-tr from-orange-100/35 via-red-50/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      )}
    </div>
  );
}
