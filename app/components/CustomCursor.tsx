"use client";

import React, { useEffect, useRef } from "react";

/**
 * Custom Two-State Cursor System
 * 
 * State 1: DEFAULT CURSOR — Small vibrant orange dot (#ff5500) with subtle smooth easing.
 * State 2: INTERACTIVE CURSOR — Large inverted/contrast circle using `mix-blend-mode: difference`
 *          and crisp white fill, expanding outward smoothly from the cursor center.
 *
 * Features:
 * - Fluid 60fps lerp via requestAnimationFrame (no React state updates during movement).
 * - Smooth CSS / GSAP-like cubic bezier transitions for scale, mix-blend-mode, and background color.
 * - Handles interactive elements via `data-cursor="interactive"`, buttons, links, roles, and inputs.
 * - Event delegation for dynamically added/removed elements.
 * - Seamless element switching without glitch or flicker.
 * - Auto-hides on mobile / touch / pointer:coarse devices.
 * - Window mouseleave / mouseenter detection.
 * - Respects prefers-reduced-motion.
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
    let isInteractive = false;
    let animationFrameId: number;

    // Linear interpolation easing factor (0.2 = responsive, smooth, non-sluggish)
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

    // Helper to determine if an element or its ancestor is interactive
    const checkInteractive = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;

      // If target or any ancestor explicitly opts out of custom interactive cursor
      if (target.closest('[data-cursor="default"], [data-cursor="none"]')) {
        return false;
      }

      // Check nearest interactive target
      const interactiveEl = target.closest(
        'a, button, [role="button"], [role="option"], [data-cursor="interactive"], input, select, textarea, .cursor-pointer'
      );

      if (!interactiveEl) return false;

      return true;
    };

    const onMouseOver = (e: MouseEvent) => {
      const match = checkInteractive(e.target);
      if (match !== isInteractive) {
        isInteractive = match;
        if (isInteractive) {
          cursorEl.classList.add("is-interactive");
        } else {
          cursorEl.classList.remove("is-interactive");
        }
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
