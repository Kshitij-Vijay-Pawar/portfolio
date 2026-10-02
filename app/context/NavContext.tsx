"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NavContextType {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navColor: string;
  setNavColor: React.Dispatch<React.SetStateAction<string>>;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [navColor, setNavColor] = useState("black");

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
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <NavContext.Provider value={{ navOpen, setNavOpen, navColor, setNavColor }}>
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
