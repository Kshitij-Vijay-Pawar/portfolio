"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import Link from "next/link";
import { useNav } from "../context/NavContext";
import Mascot from "./Mascot";

const navLinks = [
  { title: "HOME", href: "/" },
  { title: "PROJECTS", href: "/projects" },
  { title: "BLOGS", href: "/blogs" },
  { title: "CONTACT", href: "/contact" },
];

const FullScreenNav = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const {
    navOpen,
    setNavOpen,
    triggerDoubleBlink,
    triggerSurprise,
    resetMascotEmotion,
  } = useNav();

  function gsapAnimation() {
    const tl = gsap.timeline();

    // 1. Show container
    tl.set(fullScreenRef.current, {
      display: "block",
    });

    // 2. Reset positions
    tl.set(".stair-black, .stair-gray, .stair-white", {
      height: 0,
      y: 0,
    });
    tl.set(".menu-link-item", {
      opacity: 0,
      y: 40,
    });
    tl.set(".email-tag, .mascot-icon", {
      opacity: 0,
      scale: 0.85,
    });

    // 3. Staggered Column Cascade Animation (Black -> Gray -> White layers)
    tl.to(".stair-black", {
      height: "100%",
      duration: 0.5,
      stagger: {
        amount: 0.2,
      },
      ease: "power3.inOut",
    });

    tl.to(
      ".stair-gray",
      {
        height: "100%",
        duration: 0.5,
        stagger: {
          amount: 0.2,
        },
        ease: "power3.inOut",
      },
      "-=0.35"
    );

    tl.to(
      ".stair-white",
      {
        height: "100%",
        duration: 0.5,
        stagger: {
          amount: 0.2,
        },
        ease: "power3.inOut",
      },
      "-=0.35"
    );

    // 4. Menu links animate up with bold staggered reveal
    tl.to(
      ".menu-link-item",
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.2"
    );

    // 5. Header email & bottom-right mascot graphic fade/pop in
    tl.to(
      ".email-tag",
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3"
    );

    tl.to(
      ".mascot-icon",
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
      },
      "-=0.35"
    );
  }

  function gsapAnimationReverse() {
    const tl = gsap.timeline();

    // 1. Fade out content quickly and reset item shifts
    tl.to(".menu-link-item, .email-tag, .mascot-icon", {
      opacity: 0,
      y: 20,
      duration: 0.25,
      stagger: 0.03,
      ease: "power2.in",
    });
    tl.set(".menu-link-item", { y: 0 });

    // 2. Retract layers in cascade
    tl.to(".stair-white", {
      height: 0,
      duration: 0.4,
      stagger: {
        amount: 0.15,
      },
      ease: "power3.inOut",
    });

    tl.to(
      ".stair-gray",
      {
        height: 0,
        duration: 0.4,
        stagger: {
          amount: 0.15,
        },
        ease: "power3.inOut",
      },
      "-=0.3"
    );

    tl.to(
      ".stair-black",
      {
        height: 0,
        duration: 0.4,
        stagger: {
          amount: 0.15,
        },
        ease: "power3.inOut",
      },
      "-=0.3"
    );

    // 3. Hide wrapper
    tl.set(fullScreenRef.current, {
      display: "none",
    });
  }

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (!navOpen) return;
      }
      if (navOpen) {
        gsapAnimation();
      } else {
        gsapAnimationReverse();
      }
    },
    { dependencies: [navOpen], scope: fullScreenRef }
  );

  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navTextRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleLinkMouseEnter = (hoveredIndex: number) => {
    const hoveredSpan = navTextRefs.current[hoveredIndex];
    if (!hoveredSpan) return;

    // Hover scale is 1.45. With origin-bottom-left, height expands upward by (1.45 - 1) * height
    const baseHeight = hoveredSpan.offsetHeight;
    const upwardShift = baseHeight * 0.45;

    // All items above the hovered item move upward by upwardShift to preserve the exact visual gap
    navItemRefs.current.forEach((itemEl, idx) => {
      if (!itemEl) return;
      if (idx < hoveredIndex) {
        gsap.to(itemEl, {
          y: -upwardShift,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(itemEl, {
          y: 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  };

  const handleLinkMouseLeave = () => {
    // Return mascot to normal emotion
    resetMascotEmotion();

    // Smoothly restore all items to baseline y: 0
    navItemRefs.current.forEach((itemEl) => {
      if (!itemEl) return;
      gsap.to(itemEl, {
        y: 0,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      ref={fullScreenRef}
      id="fullscreennav"
      className="fullscreennav hidden text-black overflow-hidden h-screen w-full z-40 fixed inset-0 font-sans select-none"
    >
      {/* 5 Column Layered Stairing Backdrop (Black -> Slate/Gray -> Pure Off-White) */}
      <div className="h-screen w-full fixed inset-0 pointer-events-none flex">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative h-full w-1/5 overflow-hidden">
            {/* 1st layer: Deep Black */}
            <div className="stair-black absolute top-0 left-0 w-full h-0 bg-[#0f0f11]" />
            {/* 2nd layer: Smooth Slate Gray */}
            <div className="stair-gray absolute top-0 left-0 w-full h-0 bg-[#32343a]" />
            {/* 3rd final canvas: Clean Off-White as shown in screenshot */}
            <div className="stair-white absolute top-0 left-0 w-full h-0 bg-[#f7f6f4]" />
          </div>
        ))}
      </div>

      {/* Foreground Content (Matches image layout) */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 pointer-events-none">
        {/* Top bar: Left gap for fixed toggle button & Right Email */}
        <div className="flex items-center justify-between w-full">
          {/* Spacer so the top-left button lines up cleanly */}
          <div className="w-12 h-12" />

          {/* Top Right Email */}
          <a
            href="mailto:kshitij.vijay.pawar@gmail.com"
            data-cursor="interactive"
            onMouseEnter={() => triggerDoubleBlink()}
            onMouseLeave={() => resetMascotEmotion()}
            onClick={() => triggerDoubleBlink()}
            className="email-tag pointer-events-auto font-mono text-sm sm:text-base text-zinc-900 hover:opacity-70 transition-opacity tracking-tight opacity-0"
          >
            kshitij.vijay.pawar@gmail.com
          </a>
        </div>

        {/* Bottom Area: Large Left-aligned Links & Bottom-Right Red Mascot Icon */}
        <div className="flex items-end justify-between w-full pb-4">
          {/* Left Column: Bold Typography Menu Links with Responsive Stack Compensation */}
          <nav
            onMouseLeave={handleLinkMouseLeave}
            className="flex flex-col space-y-1 sm:space-y-2 pointer-events-auto"
          >
            {navLinks.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  navItemRefs.current[index] = el;
                }}
                className="menu-link-item opacity-0 overflow-visible py-1 will-change-transform"
              >
                <Link
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  onMouseEnter={() => {
                    handleLinkMouseEnter(index);
                    triggerSurprise();
                  }}
                  data-cursor="interactive"
                  className="group inline-block"
                >
                  <span
                    ref={(el) => {
                      navTextRefs.current[index] = el;
                    }}
                    className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[4.4vw] leading-[0.95] tracking-tighter text-zinc-950 uppercase origin-bottom-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-145 block will-change-transform"
                  >
                    {item.title}
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Bottom Mascot Illustration - Clickable to AI Companion page */}
          <Link
            href="/ai"
            onClick={() => setNavOpen(false)}
            data-cursor="interactive"
            className="pointer-events-auto block"
            title="Talk to AI Mascot"
          >
            <Mascot className="opacity-0 hidden sm:flex" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullScreenNav;
