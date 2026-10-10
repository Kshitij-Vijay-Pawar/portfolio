"use client";

import React, { useEffect, useState } from "react";
import { useNav } from "../context/NavContext";

const Navbar = () => {
  const { navOpen, setNavOpen, triggerAngry, resetMascotEmotion } = useNav();
  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if the top-left area where the navbar button sits overlaps a dark section
    const checkDarkSection = () => {
      // Button sits around x: 40px to 64px, y: 40px to 64px
      const sampleX = window.innerWidth > 640 ? 56 : 32;
      const sampleY = window.innerWidth > 640 ? 56 : 32;

      // Temporarily hide elements with pointer-events-none or check elementFromPoint
      const elements = document.elementsFromPoint(sampleX, sampleY);

      let foundDark = false;
      for (const el of elements) {
        // Skip header/navbar and cursor itself
        if (el.closest("header") || el.closest(".custom-cursor-follower")) continue;

        // Check explicit section ids or classes
        const darkSection = el.closest(
          '#journey, #projects, [data-theme="dark"], .bg-black, .bg-\\[\\#000000\\], .bg-\\[\\#09090b\\], .bg-neutral-950, .bg-zinc-950'
        );
        if (darkSection) {
          foundDark = true;
          break;
        }

        // Check computed background color
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          // Parse rgb(r, g, b)
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            // Perceived luminance formula (ITU-R BT.709)
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            if (luminance < 0.35) {
              foundDark = true;
            }
            break;
          }
        }
      }

      setIsOverDark(foundDark);
    };

    // Initial check
    checkDarkSection();

    // Listen to scroll and resize
    window.addEventListener("scroll", checkDarkSection, { passive: true });
    window.addEventListener("resize", checkDarkSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkDarkSection);
      window.removeEventListener("resize", checkDarkSection);
    };
  }, []);

  // When nav is open: The open overlay (#fullscreennav) has an off-white final canvas, so cross is dark.
  // When nav is closed: Lines turn crisp white over dark sections (#journey, #projects, etc.), dark over light sections.
  const isLineWhite = !navOpen && isOverDark;

  return (
    <header className="z-50 fixed top-0 left-0 w-full flex items-center justify-between p-4 sm:p-8 md:p-12 lg:p-16 pointer-events-none">
      {/* 2-line Menu Button on top left that morphs into a Cross ('X') */}
      <button
        type="button"
        onClick={() => setNavOpen(!navOpen)}
        onMouseEnter={() => {
          if (navOpen) triggerAngry();
        }}
        onMouseLeave={() => {
          if (navOpen) resetMascotEmotion();
        }}
        aria-label={navOpen ? "Close menu" : "Open menu"}
        data-cursor="interactive"
        className="pointer-events-auto w-12 h-12 flex flex-col items-center justify-center relative cursor-pointer group focus:outline-none"
      >
        {/* Line 1: transforms from top horizontal bar into 45-degree cross stroke */}
        <span
          className={`absolute w-7 h-[2.5px] rounded-full transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            isLineWhite
              ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              : "bg-zinc-950"
          } ${
            navOpen
              ? "rotate-45 translate-y-0"
              : "-translate-y-[4px] group-hover:w-8"
          }`}
        />
        {/* Line 2: transforms from bottom horizontal bar into -45-degree cross stroke */}
        <span
          className={`absolute w-7 h-[2.5px] rounded-full transition-all duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            isLineWhite
              ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              : "bg-zinc-950"
          } ${
            navOpen
              ? "-rotate-45 translate-y-0"
              : "translate-y-[4px] group-hover:w-6"
          }`}
        />
      </button>

      {/* Optional right side */}
      <div className="pointer-events-auto" />
    </header>
  );
};

export default Navbar;
