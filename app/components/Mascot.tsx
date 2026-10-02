"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { useNav, MascotEmotion } from "../context/NavContext";

export interface MascotRef {
  doubleBlink: () => void;
  surprise: () => void;
  angry: () => void;
  happy: () => void;
  normal: () => void;
  reset: () => void;
  setEmotion: (emotion: MascotEmotion) => void;
}

interface MascotProps {
  className?: string;
  emotion?: MascotEmotion;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Mascot = forwardRef<MascotRef, MascotProps>(function Mascot(
  {
    className = "",
    emotion: propEmotion,
    onClick,
    onMouseEnter,
    onMouseLeave,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyesGroupRef = useRef<SVGGElement>(null);

  // Nav context connection (safe fallback if used outside NavProvider)
  let navContext: ReturnType<typeof useNav> | null = null;
  try {
    navContext = useNav();
  } catch {
    navContext = null;
  }

  // Active emotion state
  const [currentEmotion, setCurrentEmotion] = useState<MascotEmotion>("normal");

  // State for blinking (0 = open, 1 = shut)
  const [blinkState, setBlinkState] = useState(false);

  // State for surprise phase (blinking first, then large round eyes)
  const [surprisePhase, setSurprisePhase] = useState<"idle" | "blink" | "round">("idle");

  // Animation sequence cancelation token / timer refs
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // 1. EMOTION FUNCTION: Normal / Reset
  const normal = useCallback(() => {
    clearAllTimers();
    setCurrentEmotion("normal");
    setBlinkState(false);
    setSurprisePhase("idle");
    if (navContext && navContext.mascotEmotion !== "normal") {
      navContext.setMascotEmotion("normal");
    }
  }, [clearAllTimers, navContext]);

  // 2. EMOTION FUNCTION: Double Blink
  const doubleBlink = useCallback(() => {
    clearAllTimers();
    setCurrentEmotion("doubleBlink");
    setSurprisePhase("idle");

    // Sequence: Blink 1 shut -> open -> Blink 2 shut -> open -> normal
    setBlinkState(true);

    const t1 = setTimeout(() => {
      setBlinkState(false);
    }, 90);

    const t2 = setTimeout(() => {
      setBlinkState(true);
    }, 180);

    const t3 = setTimeout(() => {
      setBlinkState(false);
      const t4 = setTimeout(() => {
        normal();
      }, 100);
      timersRef.current.push(t4);
    }, 280);

    timersRef.current.push(t1, t2, t3);
  }, [clearAllTimers, normal]);

  // 3. EMOTION FUNCTION: Surprise (blinks then big round eyes)
  const surprise = useCallback(() => {
    clearAllTimers();
    setCurrentEmotion("surprise");

    // Phase 1: Quick surprise blink
    setSurprisePhase("blink");
    setBlinkState(true);

    const t1 = setTimeout(() => {
      // Phase 2: Pop open into big round eyes
      setBlinkState(false);
      setSurprisePhase("round");
    }, 100);

    timersRef.current.push(t1);
  }, [clearAllTimers]);

  // 4. EMOTION FUNCTION: Angry
  const angry = useCallback(() => {
    clearAllTimers();
    setCurrentEmotion("angry");
    setBlinkState(false);
    setSurprisePhase("idle");
  }, [clearAllTimers]);

  // 5. EMOTION FUNCTION: Happy
  const happy = useCallback(() => {
    clearAllTimers();
    setCurrentEmotion("happy");
    setBlinkState(false);
    setSurprisePhase("idle");
  }, [clearAllTimers]);

  // Expose imperative functions via ref
  useImperativeHandle(
    ref,
    () => ({
      doubleBlink,
      surprise,
      angry,
      happy,
      normal,
      reset: normal,
      setEmotion: (emo: MascotEmotion) => {
        switch (emo) {
          case "doubleBlink":
            doubleBlink();
            break;
          case "surprise":
            surprise();
            break;
          case "angry":
            angry();
            break;
          case "happy":
            happy();
            break;
          default:
            normal();
        }
      },
    }),
    [doubleBlink, surprise, angry, happy, normal]
  );

  // Sync external emotion changes from props or NavContext
  const activeExternalEmotion = propEmotion ?? navContext?.mascotEmotion;
  useEffect(() => {
    if (!activeExternalEmotion) return;

    if (activeExternalEmotion === "doubleBlink") {
      doubleBlink();
    } else if (activeExternalEmotion === "surprise") {
      surprise();
    } else if (activeExternalEmotion === "angry") {
      angry();
    } else if (activeExternalEmotion === "happy") {
      happy();
    } else if (activeExternalEmotion === "normal") {
      normal();
    }
  }, [activeExternalEmotion, doubleBlink, surprise, angry, happy, normal]);

  // Smooth 60fps cursor pupil/eye tracking with zero React re-render lag
  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance and angle from mascot center to mouse
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Max eye offset inside the head (in SVG coordinates)
      const maxDistance = 15;
      const pull = Math.min(distance / 280, 1);
      const clampedDistance = Math.sin((pull * Math.PI) / 2) * maxDistance;

      targetX = Math.cos(angle) * clampedDistance;
      targetY = Math.sin(angle) * clampedDistance;
    };

    const render = () => {
      // Fluid linear interpolation (0.08 = very silky, organic lag)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (eyesGroupRef.current) {
        eyesGroupRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Periodic idle blinking (only active when idle/normal)
  useEffect(() => {
    if (currentEmotion !== "normal") return;

    let blinkTimeout: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = Math.random() * 3200 + 2800;
      blinkTimeout = setTimeout(() => {
        setBlinkState(true);

        closeTimeout = setTimeout(() => {
          setBlinkState(false);
          scheduleBlink();
        }, 140);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(closeTimeout);
    };
  }, [currentEmotion]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Hover & Click handlers on the Mascot
  const handleMouseEnter = () => {
    happy();
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    normal();
    onMouseLeave?.();
  };

  const handleClick = () => {
    // Joyful double blink or surprise on click
    if (currentEmotion === "happy") {
      doubleBlink();
    } else {
      happy();
    }
    onClick?.();
  };

  // Visual states
  const isHappy = currentEmotion === "happy";
  const isAngry = currentEmotion === "angry";
  const isSurprise = currentEmotion === "surprise" && surprisePhase === "round";

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="interactive"
      className={`mascot-icon opacity-0 hidden sm:flex flex-col items-center justify-center pointer-events-auto cursor-pointer select-none transition-transform duration-500 hover:scale-105 active:scale-95 ${className}`}
    >
      <svg
        className={`w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 drop-shadow-sm transition-transform duration-300 ${
          isHappy ? "rotate-[-2deg]" : isAngry ? "scale-[1.02]" : ""
        }`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Red App Icon Box */}
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="56"
          fill="#f03e2f"
          className="transition-colors duration-300"
        />

        {/* EYES GROUP with 60fps tracking */}
        <g ref={eyesGroupRef} className="will-change-transform">
          {/* 1. NORMAL & ANGRY PILL EYES */}
          <g
            className="transition-opacity duration-200"
            style={{
              opacity: isHappy || isSurprise ? 0 : 1,
            }}
          >
            {/* Left Eye */}
            <rect
              x="65"
              y="82"
              width="20"
              height="38"
              rx="10"
              fill="white"
              style={{
                transformOrigin: "75px 101px",
                transform: blinkState
                  ? "scaleY(0.06)"
                  : isAngry
                  ? "rotate(25deg)"
                  : "rotate(0deg)",
                transition: blinkState
                  ? "transform 0.08s ease-in"
                  : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />

            {/* Right Eye */}
            <rect
              x="115"
              y="80"
              width="20"
              height="38"
              rx="10"
              fill="white"
              style={{
                transformOrigin: "125px 99px",
                transform: blinkState
                  ? "scaleY(0.06)"
                  : isAngry
                  ? "rotate(-25deg)"
                  : "rotate(0deg)",
                transition: blinkState
                  ? "transform 0.08s ease-in"
                  : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </g>

          {/* 2. SURPRISED BIG ROUND CIRCLE EYES */}
          <g
            className="transition-all duration-250 ease-out"
            style={{
              opacity: isSurprise && !blinkState ? 1 : 0,
              transform: isSurprise && !blinkState ? "scale(1)" : "scale(0.3)",
              transformOrigin: "100px 100px",
            }}
          >
            {/* Left Round Eye */}
            <circle
              cx="75"
              cy="101"
              r="17"
              fill="white"
            />
            {/* Right Round Eye */}
            <circle
              cx="125"
              cy="99"
              r="17"
              fill="white"
            />
          </g>

          {/* 3. HAPPY CURVED ARCH EYES (^ ^) */}
          <g
            className="transition-all duration-200 ease-out"
            style={{
              opacity: isHappy ? 1 : 0,
              transform: isHappy ? "scale(1)" : "scale(0.4)",
              transformOrigin: "100px 100px",
            }}
          >
            {/* Left Happy Curved Arc */}
            <path
              d="M 64 108 Q 75 84 86 108"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Happy Curved Arc */}
            <path
              d="M 114 106 Q 125 82 136 106"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
});

export default Mascot;
