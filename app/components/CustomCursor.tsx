"use client";

import React, { useEffect, useRef } from "react";

/**
 * Custom Three-State Cursor System
 * 
 * State 1: DEFAULT CURSOR — Small vibrant orange dot (#ff5500) with subtle smooth easing.
 * State 2: INTERACTIVE CURSOR — Large inverted/contrast circle using `mix-blend-mode: difference`
 *          and crisp white fill, expanding outward smoothly from the cursor center.
 * State 3: FLUID GLASS CURSOR — The DOM cursor hides itself and hands off to the real 3D
 *          FluidGlass lens (`ui/FluidGlass.tsx`, mode "lens") rendered inside elements marked
 *          with `data-cursor="fluid-glass"` (e.g. ProjectsShowcase cards).
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run on client with fine pointer (mouse / trackpad)
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    // Mouse coordinates (target) and current coordinates (interpolated)
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    let isVisible = false;
    type CursorMode = "default" | "interactive" | "fluid-glass";
    let currentMode: CursorMode = "default";
    let animationFrameId: number;

    // Linear interpolation easing factor
    const lerpFactor = prefersReducedMotion ? 1 : 0.22;

    const render = () => {
      if (isVisible) {
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        // Position using translate3d for hardware acceleration
        cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        cursorEl.style.visibility = "visible";
      }

      if (e.target instanceof Element && e.target.closest('[data-cursor="hide"]')) {
        cursorEl.style.opacity = "0";
      } else {
        cursorEl.style.opacity = "1";
      }
    };

    // Helper to determine active cursor mode from target hierarchy
    const detectCursorMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return "default";

      // Explicit opt-outs
      if (target.closest('[data-cursor="default"], [data-cursor="none"]')) {
        return "default";
      }

      // Check for 3rd state: Fluid Glass Cursor
      if (target.closest('[data-cursor="fluid-glass"]')) {
        return "fluid-glass";
      }

      // Check nearest interactive target for inverted interactive cursor
      const interactiveEl = target.closest(
        'a, button, [role="button"], [role="option"], [data-cursor="interactive"], input, select, textarea, .cursor-pointer'
      );

      if (interactiveEl) {
        return "interactive";
      }

      return "default";
    };

    const updateCursorClass = (mode: CursorMode) => {
      cursorEl.classList.remove("is-interactive", "is-fluid-glass");
      if (mode === "interactive") {
        cursorEl.classList.add("is-interactive");
      } else if (mode === "fluid-glass") {
        cursorEl.classList.add("is-fluid-glass");
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const mode = detectCursorMode(e.target);
      if (mode !== currentMode) {
        currentMode = mode;
        updateCursorClass(currentMode);
      }
    };

    const onDocumentMouseLeave = () => {
      isVisible = false;
      cursorEl.style.visibility = "hidden";
    };

    const onDocumentMouseEnter = () => {
      isVisible = true;
      cursorEl.style.visibility = "visible";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onDocumentMouseLeave);
    document.addEventListener("mouseenter", onDocumentMouseEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onDocumentMouseLeave);
      document.removeEventListener("mouseenter", onDocumentMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{ visibility: "hidden" }}
      className="custom-cursor-follower pointer-events-none fixed top-0 left-0 z-[9999]"
    >
      <div className="custom-cursor-dot" />
    </div>
  );
}
