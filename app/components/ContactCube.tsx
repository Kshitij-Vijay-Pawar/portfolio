"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Shuffle, Box } from "lucide-react";
import RubiksCube, {
  RubiksCubeRef,
} from "@/app/components/cube/rubiks-cube/RubiksCube";
import { useNav } from "@/app/context/NavContext";

const SCRAMBLE_MS = 300;
const SOLVE_MS = 700;
const IDLE_BEFORE_SOLVE_MS = 3000;
const CAMERA_RESET_MS = 1800; // camera glide is 1.6s

/**
 * Decorative interactive Rubik's cube for the contact page.
 * - hover: tilts/floats toward the pointer
 * - drag a face: turns any layer; drag outside the cube: orbits the whole cube
 * - click: opens /cube, right click: small menu with "Open Cube Page"
 * - after 3s idle (scrambled): camera eases to default, then auto-solves at 700ms/turn
 */
export default function ContactCube() {
  const { navigateWithTransition } = useNav();
  const cubeRef = useRef<RubiksCubeRef | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<"idle" | "solving">("idle");
  const viewDirtyRef = useRef(false);
  const [cameraToken, setCameraToken] = useState(0);
  const [scrambling, setScrambling] = useState(false);
  const scramblingRef = useRef(false);
  const scrambleFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const scheduleSolve = useCallback(
    (delay = IDLE_BEFORE_SOLVE_MS) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        const cube = cubeRef.current;
        if (!cube || phaseRef.current === "solving") return;
        if (cube.isBusy()) {
          scheduleSolve(1000);
          return;
        }
        const needsSolve = !cube.isSolved();
        // Always request a camera return; the scene skips it if already home
        const waitForGlide = viewDirtyRef.current;

        if (needsSolve) phaseRef.current = "solving";
        viewDirtyRef.current = false;
        setCameraToken((t) => t + 1);
        if (!needsSolve) return;
        timerRef.current = setTimeout(
          async () => {
            const solution = await cubeRef.current?.solve(true);
            if (!solution || solution.length === 0) phaseRef.current = "idle";
          },
          waitForGlide ? CAMERA_RESET_MS : 0
        );
      }, delay);
    },
    [clearTimer]
  );

  useEffect(
    () => () => {
      clearTimer();
      if (scrambleFallbackRef.current) clearTimeout(scrambleFallbackRef.current);
    },
    [clearTimer]
  );

  const handleInteractStart = useCallback(() => {
    viewDirtyRef.current = true;
    if (phaseRef.current === "solving") return;
    clearTimer();
  }, [clearTimer]);

  const handleInteractEnd = useCallback(() => {
    if (phaseRef.current === "solving") return;
    scheduleSolve();
  }, [scheduleSolve]);

  const finishScramble = useCallback(() => {
    if (scrambleFallbackRef.current) clearTimeout(scrambleFallbackRef.current);
    scrambleFallbackRef.current = null;
    scramblingRef.current = false;
    setScrambling(false);
  }, []);

  const handleMoveComplete = useCallback(() => {
    // Re-enable the Scramble button once every scramble turn has finished animating
    if (scramblingRef.current && !cubeRef.current?.isBusy()) finishScramble();
    if (phaseRef.current === "solving") return;
    scheduleSolve();
  }, [scheduleSolve, finishScramble]);

  const handleSolved = useCallback(() => {
    phaseRef.current = "idle";
    // Always return the view home 3s after solving (covers rotating mid-solve)
    scheduleSolve();
  }, [scheduleSolve]);

  const handleScramble = () => {
    if (scramblingRef.current) return;
    clearTimer();
    phaseRef.current = "idle";
    scramblingRef.current = true;
    setScrambling(true);
    cubeRef.current?.scramble(20);
    // Safety net so the button can never stay locked
    scrambleFallbackRef.current = setTimeout(
      finishScramble,
      20 * SCRAMBLE_MS * 1.3 + 3000
    );
  };

  const goToCube = useCallback(() => {
    setMenu(null);
    navigateWithTransition("/cube");
  }, [navigateWithTransition]);

  // Dismiss context menu
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* Soft orbit ring + accent dot, matching the page's minimal style */}
      <div className="pointer-events-none absolute inset-x-4 top-6 bottom-14 rounded-full border border-neutral-300/60 -rotate-12 scale-y-[0.55]" />
      <div className="pointer-events-none absolute top-10 right-8 h-2 w-2 rounded-full bg-[#ff5500]" />

      <div
        className="relative w-full"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        <RubiksCube
          ref={cubeRef}
          minimal
          showControls={false}
          hoverTilt
          enableZoom={false}
          cubeSize={0.95}
          animationSpeed={SCRAMBLE_MS}
          scrambleSpeedMs={SCRAMBLE_MS}
          solveSpeedMs={SOLVE_MS}
          viewerHeightClassName="h-[260px] sm:h-[320px] lg:h-[360px]"
          onUserInteractStart={handleInteractStart}
          onUserInteractEnd={handleInteractEnd}
          onCubeClick={goToCube}
          onMoveComplete={handleMoveComplete}
          onSolved={handleSolved}
          resetCameraToken={cameraToken}
        />
      </div>

      <button
        type="button"
        onClick={handleScramble}
        disabled={scrambling}
        aria-disabled={scrambling}
        data-cursor={scrambling ? "default" : "interactive"}
        className={`relative z-10 -mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
          scrambling
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400 shadow-none"
            : "bg-[#09090b] text-white shadow-md hover:bg-neutral-800 hover:scale-[1.03] active:scale-95"
        }`}
      >
        <Shuffle className={`h-3.5 w-3.5 ${scrambling ? "animate-spin" : ""}`} />
        {scrambling ? "Scrambling" : "Scramble"}
      </button>

      {menu && (
        <div
          role="menu"
          data-cursor="interactive"
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            top: Math.min(menu.y, window.innerHeight - 64),
            left: Math.min(menu.x, window.innerWidth - 208),
          }}
          className="fixed z-[9990] w-48 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={goToCube}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wider text-neutral-800 transition-colors hover:bg-neutral-950 hover:text-white"
          >
            <Box className="h-3.5 w-3.5" />
            Go to Cube Page
          </button>
        </div>
      )}
    </div>
  );
}

