"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  playNavSelectClick,
  playNavToggleSound,
} from "@/app/utils/tactileSound";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type MascotEmotion =
  | "normal"
  | "happy"
  | "surprise"
  | "angry"
  | "doubleBlink";

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
  navigateWithTransition: (href: string) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

function scrollToTopInstant() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [navColor, setNavColor] = useState("black");
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("normal");

  const router = useRouter();
  const pathname = usePathname();

  const navOpenRef = useRef(navOpen);
  navOpenRef.current = navOpen;

  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);
  const routeCommitResolverRef = useRef<(() => void) | null>(null);

  const triggerDoubleBlink = useCallback(
    () => setMascotEmotion("doubleBlink"),
    []
  );
  const triggerSurprise = useCallback(() => setMascotEmotion("surprise"), []);
  const triggerAngry = useCallback(() => setMascotEmotion("angry"), []);
  const triggerHappy = useCallback(() => setMascotEmotion("happy"), []);
  const resetMascotEmotion = useCallback(() => setMascotEmotion("normal"), []);

  // Resolve any pending transition waiting for Next.js pathname commit & enforce top scroll
  useEffect(() => {
    setNavColor("black");
    scrollToTopInstant();

    if (routeCommitResolverRef.current) {
      const resolve = routeCommitResolverRef.current;
      routeCommitResolverRef.current = null;
      resolve();
    }
  }, [pathname]);

  // Wait for Next.js route change to commit (with a fast fallback if same route or cached)
  const waitForRouteCommit = useCallback(
    (targetPath: string, timeoutMs = 420): Promise<void> => {
      if (typeof window === "undefined") return Promise.resolve();
      const currentPath = window.location.pathname;
      if (targetPath === currentPath) {
        return new Promise((resolve) => setTimeout(resolve, 60));
      }

      return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          routeCommitResolverRef.current = null;
          resolve();
        };
        routeCommitResolverRef.current = finish;
        setTimeout(finish, timeoutMs);
      });
    },
    []
  );

  /**
   * Unified navigation with 5-column layered stair transition:
   * - If `navOpen` is true (user is inside FullScreenNav or used CustomContextMenu over FullScreenNav):
   *   navigates underneath, forces scroll to top, and closes FullScreenNav so its reverse stair cascade reveals the page.
   * - If `navOpen` is false (direct link click on page or CustomContextMenu on page):
   *   cascades the 5-column stairs down (start), navigates + scrolls to top, then retracts stairs (end).
   */
  const navigateWithTransition = useCallback(
    (rawHref: string) => {
      if (typeof window === "undefined" || !rawHref) return;

      let targetPathname = rawHref;
      try {
        const parsed = new URL(rawHref, window.location.origin);
        targetPathname = parsed.pathname;
      } catch {
        // Keep rawHref
      }

      // CASE 1: FullScreenNav is already open — use its closing stair animation to reveal the target page
      if (navOpenRef.current) {
        playNavToggleSound(false);
        router.push(rawHref);

        waitForRouteCommit(targetPathname, 260).then(() => {
          scrollToTopInstant();
          setNavOpen(false);
          requestAnimationFrame(() => {
            scrollToTopInstant();
            ScrollTrigger.refresh();
          });
        });
        return;
      }

      // CASE 2: FullScreenNav is closed — play full 5-column stair transition (Start -> Navigate + Top -> End)
      if (isTransitioningRef.current) return;
      const overlayEl = transitionOverlayRef.current;
      if (!overlayEl) {
        router.push(rawHref);
        scrollToTopInstant();
        return;
      }

      isTransitioningRef.current = true;
      playNavToggleSound(true);

      const blackStairs = overlayEl.querySelectorAll(".page-stair-black");
      const grayStairs = overlayEl.querySelectorAll(".page-stair-gray");
      const whiteStairs = overlayEl.querySelectorAll(".page-stair-white");

      gsap.killTweensOf([blackStairs, grayStairs, whiteStairs]);

      const coverTl = gsap.timeline({
        onComplete: () => {
          scrollToTopInstant();
          router.push(rawHref);

          waitForRouteCommit(targetPathname, 420).then(() => {
            scrollToTopInstant();
            requestAnimationFrame(() => {
              scrollToTopInstant();
              ScrollTrigger.refresh();
              playNavToggleSound(false);

              const revealTl = gsap.timeline({
                onComplete: () => {
                  gsap.set(overlayEl, { display: "none" });
                  isTransitioningRef.current = false;
                },
              });

              revealTl.to(whiteStairs, {
                height: 0,
                duration: 0.4,
                stagger: { amount: 0.15 },
                ease: "power3.inOut",
              });

              revealTl.to(
                grayStairs,
                {
                  height: 0,
                  duration: 0.4,
                  stagger: { amount: 0.15 },
                  ease: "power3.inOut",
                },
                "-=0.3"
              );

              revealTl.to(
                blackStairs,
                {
                  height: 0,
                  duration: 0.4,
                  stagger: { amount: 0.15 },
                  ease: "power3.inOut",
                },
                "-=0.3"
              );
            });
          });
        },
      });

      coverTl.set(overlayEl, { display: "block" });
      coverTl.set([blackStairs, grayStairs, whiteStairs], {
        height: 0,
        y: 0,
      });

      coverTl.to(blackStairs, {
        height: "100%",
        duration: 0.45,
        stagger: { amount: 0.18 },
        ease: "power3.inOut",
      });

      coverTl.to(
        grayStairs,
        {
          height: "100%",
          duration: 0.45,
          stagger: { amount: 0.18 },
          ease: "power3.inOut",
        },
        "-=0.32"
      );

      coverTl.to(
        whiteStairs,
        {
          height: "100%",
          duration: 0.45,
          stagger: { amount: 0.18 },
          ease: "power3.inOut",
        },
        "-=0.32"
      );
    },
    [router, waitForRouteCommit]
  );

  // Global click interceptor so ALL internal <Link> / <a> elements use the stair transition and land at top
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const anchor = target.closest("a");
      if (!anchor) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("data-no-transition") === "true"
      ) {
        return;
      }

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(rawHref, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      // Let /resume open normally if linked directly
      if (url.pathname === "/resume" || url.pathname.endsWith(".pdf")) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      playNavSelectClick();
      navigateWithTransition(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, [navigateWithTransition]);

  // 🔒 SCROLL + OVERFLOW CONTROL
  useEffect(() => {
    if (navOpen) {
      scrollToTopInstant();
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
        navigateWithTransition,
      }}
    >
      {children}

      {/* Global 5-Column Layered Stair Transition Overlay for Direct Link & Context Menu Navigations */}
      <div
        ref={transitionOverlayRef}
        aria-hidden="true"
        className="hidden fixed inset-0 z-[9995] h-[100dvh] w-full pointer-events-auto overflow-hidden select-none"
      >
        <div className="h-[100dvh] w-full flex">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative h-full w-1/5 overflow-hidden">
              {/* 1st layer: Deep Black */}
              <div className="page-stair-black absolute top-0 left-0 w-full h-0 bg-[#0f0f11]" />
              {/* 2nd layer: Smooth Slate Gray */}
              <div className="page-stair-gray absolute top-0 left-0 w-full h-0 bg-[#32343a]" />
              {/* 3rd layer: Clean Off-White */}
              <div className="page-stair-white absolute top-0 left-0 w-full h-0 bg-[#f7f6f4]" />
            </div>
          ))}
        </div>
      </div>
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
