"use client";

import React from "react";
import { useNav } from "../context/NavContext";

const Navbar = () => {
  const { navOpen, setNavOpen, triggerAngry, resetMascotEmotion } = useNav();

  return (
    <header className="z-50 fixed top-0 left-0 w-full flex items-center justify-between p-6 sm:p-10 md:p-14 lg:p-16 pointer-events-none">
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
          className={`absolute w-7 h-[2.5px] bg-zinc-950 rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            navOpen
              ? "rotate-45 translate-y-0"
              : "-translate-y-[4px] group-hover:w-8"
          }`}
        />
        {/* Line 2: transforms from bottom horizontal bar into -45-degree cross stroke */}
        <span
          className={`absolute w-7 h-[2.5px] bg-zinc-950 rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
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
