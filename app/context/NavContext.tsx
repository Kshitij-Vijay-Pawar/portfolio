"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type MascotEmotion = "normal" | "happy" | "surprise" | "angry" | "doubleBlink";

interface NavContextType {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navColor: string;
  setNavColor: React.Dispatch<React.SetStateAction<string>>;
  mascotEmotion: MascotEmotion;
  setMascotEmotion: React.Dispatch<React.SetStateAction<MascotEmotion>>;
  triggerDoubleBlink: () => void;
  triggerSurprise: () => void;
  triggerAngry: () => void;
  triggerHappy: () => void;
  resetMascotEmotion: () => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [navColor, setNavColor] = useState("black");
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("normal");

  const triggerDoubleBlink = () => setMascotEmotion("doubleBlink");
  const triggerSurprise = () => setMascotEmotion("surprise");
  const triggerAngry = () => setMascotEmotion("angry");
  const triggerHappy = () => setMascotEmotion("happy");
  const resetMascotEmotion = () => setMascotEmotion("normal");

  const pathname = usePathname();

  // 🎨 Navbar logo color logic (default black for white background)
  useEffect(() => {
    // When white background, logo is black
    setNavColor("black");
  }, [pathname]);

  // 🔒 SCROLL + OVERFLOW CONTROL
  useEffect(() => {
    if (navOpen) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMascotEmotion("normal");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <NavContext.Provider
      value={{
        navOpen,
        setNavOpen,
        navColor,
        setNavColor,
        mascotEmotion,
        setMascotEmotion,
        triggerDoubleBlink,
        triggerSurprise,
        triggerAngry,
        triggerHappy,
        resetMascotEmotion,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};
