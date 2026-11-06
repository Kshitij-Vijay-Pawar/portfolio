"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNav } from "@/app/context/NavContext";
import {
  Home,
  User,
  FolderGit2,
  Sparkles,
  Mail,
  Copy,
  Check,
  Download,
  Share2,
  X,
  CornerDownLeft,
  Volume2,
  VolumeX,
} from "lucide-react";

interface CustomContextMenuProps {
  enabled?: boolean;
}

interface MenuPosition {
  x: number;
  y: number;
}

interface MenuItem {
  id: string;
  shortcut?: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  section: "selection" | "navigation" | "actions" | "close";
  action: () => void;
}

interface PillGeometry {
  top: number;
  height: number;
  ready: boolean;
}

const MENU_WIDTH = 312;
const MENU_ESTIMATED_HEIGHT = 450;
const EMAIL_ADDRESS = "kshitijpawar9766@gmail.com";

export default function CustomContextMenu({
  enabled = false,
}: CustomContextMenuProps) {
  const { navigateWithTransition } = useNav();
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pillGeometry, setPillGeometry] = useState<PillGeometry>({
    top: 6,
    height: 36,
    ready: false,
  });
  const [recoilDirection, setRecoilDirection] = useState<-1 | 0 | 1>(0);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoilTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cascadeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickTimeRef = useRef<number>(0);
  const selectedIndexRef = useRef<number>(0);
  const wheelAccumRef = useRef<number>(0);

  selectedIndexRef.current = selectedIndex;

  // Ensure or resume Web Audio API context for zero-latency game/phone "tuk" synthesis
  const getAudioContext = useCallback((): AudioContext | null => {
    if (!soundEnabled || typeof window === "undefined") return null;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextClass) return null;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, [soundEnabled]);

  // Trigger physical vibration on supported mobile/haptic devices
  const triggerHaptic = useCallback(
    (pattern: number | number[]) => {
      if (!soundEnabled) return;
      try {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.vibrate === "function"
        ) {
          navigator.vibrate(pattern);
        }
      } catch {
        // Ignore on unsupported devices
      }
    },
    [soundEnabled]
  );

  /**
   * Synthesizes a tactile phone-wheel / game-UI "tuk" sound.
   * Adapts pitch, crispness, and decay to movement velocity:
   * - Fast hover/scrub -> rapid, tight, slightly brighter "tuk tuk"
   * - Slow hover/step  -> deeper, fuller woody "tuk...     tuk"
   */
  const playTukSound = useCallback(
    (velocityHint?: number, stepIndex = 0) => {
      const nowPerf =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const dt = Math.max(12, nowPerf - lastTickTimeRef.current);
      lastTickTimeRef.current = nowPerf;

      // Speed factor: 0 (slow, >220ms between ticks) -> 1 (very fast, <35ms between ticks)
      const speedFactor =
        velocityHint !== undefined
          ? Math.min(1, Math.max(0, velocityHint))
          : Math.min(1, Math.max(0, (220 - dt) / 185));

      // Haptic pulse: shorter crisp tap when moving fast, fuller tap when slow
      triggerHaptic(speedFactor > 0.55 ? 4 : 8);

      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        // Subtle pitch progression across menu index + velocity brightening
        const indexSemitoneOffset = (stepIndex - 4) * 6;
        const startFreq = 265 + speedFactor * 95 + indexSemitoneOffset;
        const endFreq = 78 + speedFactor * 28;
        const duration = 0.028 - speedFactor * 0.011; // ~17ms fast, ~28ms slow

        // 1. Low-mid woody resonance body ("tuk" thump)
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = "triangle";
        bodyOsc.frequency.setValueAtTime(startFreq, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        const peakGain = 0.22 - speedFactor * 0.04;
        bodyGain.gain.setValueAtTime(0.0001, now);
        bodyGain.gain.linearRampToValueAtTime(peakGain, now + 0.0018);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + duration + 0.004);

        // 2. Crisp mechanical click transient ("t-" attack)
        const clickOsc = ctx.createOscillator();
        const clickFilter = ctx.createBiquadFilter();
        const clickGain = ctx.createGain();

        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(1150 + speedFactor * 420, now);
        clickOsc.frequency.exponentialRampToValueAtTime(290, now + 0.007);

        clickFilter.type = "bandpass";
        clickFilter.frequency.setValueAtTime(1100 + speedFactor * 300, now);
        clickFilter.Q.setValueAtTime(2.2, now);

        clickGain.gain.setValueAtTime(0.0001, now);
        clickGain.gain.linearRampToValueAtTime(0.11, now + 0.0008);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.0075);

        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.009);
      } catch {
        // Ignore audio scheduling errors
      }
    },
    [getAudioContext, triggerHaptic]
  );

  // Tactile confirmation sound + double-tap haptic when clicking/activating an item
  const playSelectConfirmSound = useCallback(() => {
    triggerHaptic([10, 22, 16]);
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // First thock (press)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(240, now);
      osc1.frequency.exponentialRampToValueAtTime(92, now + 0.025);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.24, now + 0.002);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.03);

      // Second crisp harmonic pop (confirm release)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const t2 = now + 0.024;
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(520, t2);
      osc2.frequency.exponentialRampToValueAtTime(780, t2 + 0.038);
      gain2.gain.setValueAtTime(0.0001, t2);
      gain2.gain.linearRampToValueAtTime(0.16, t2 + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.042);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.046);
    } catch {
      // Ignore audio errors
    }
  }, [getAudioContext, triggerHaptic]);

  // Subtle pop when menu opens
  const playOpenSound = useCallback(() => {
    triggerHaptic(6);
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.032);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.034);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.038);
    } catch {
      // Ignore
    }
  }, [getAudioContext, triggerHaptic]);

  const clearCascadeTimers = useCallback(() => {
    cascadeTimersRef.current.forEach((t) => clearTimeout(t));
    cascadeTimersRef.current = [];
  }, []);

  // Show/hide the global custom cursor ONLY when the pointer is inside this menu component
  const setCursorHiddenOnMenu = useCallback((hidden: boolean) => {
    if (typeof document === "undefined") return;
    if (hidden) {
      document.documentElement.dataset.contextMenuOpen = "true";
    } else {
      delete document.documentElement.dataset.contextMenuOpen;
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const closeMenu = useCallback(() => {
    clearCascadeTimers();
    setIsOpen(false);
    setPressedIndex(null);
    setCursorHiddenOnMenu(false);
  }, [clearCascadeTimers, setCursorHiddenOnMenu]);

  const handleNavigate = useCallback(
    (route: string) => {
      closeMenu();
      navigateWithTransition(route);
    },
    [closeMenu, navigateWithTransition]
  );

  const handleCopySelection = useCallback(async () => {
    if (!selectedText) return;
    try {
      await navigator.clipboard.writeText(selectedText);
      showToast("Selected text copied");
    } catch {
      showToast("Unable to copy selection");
    }
    closeMenu();
  }, [selectedText, showToast, closeMenu]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      showToast(`Copied ${EMAIL_ADDRESS}`);
    } catch {
      showToast("Unable to copy email");
    }
    closeMenu();
  }, [showToast, closeMenu]);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Page URL copied");
    } catch {
      showToast("Unable to copy link");
    }
    closeMenu();
  }, [showToast, closeMenu]);

  const handleDownloadResume = useCallback(() => {
    closeMenu();
    window.open("/resume", "_blank", "noopener,noreferrer");
    showToast("Opened Resume Preview & Download");
  }, [closeMenu, showToast]);

  // Build ordered list of interactive menu items with number shortcuts 1..8 and ESC at the end
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        id: "nav-home",
        shortcut: "1",
        label: "Home",
        sublabel: "/",
        icon: Home,
        section: "navigation",
        action: () => handleNavigate("/"),
      },
      {
        id: "nav-about",
        shortcut: "2",
        label: "About & Journey",
        sublabel: "/about",
        icon: User,
        section: "navigation",
        action: () => handleNavigate("/about"),
      },
      {
        id: "nav-projects",
        shortcut: "3",
        label: "Selected Projects",
        sublabel: "/projects",
        icon: FolderGit2,
        section: "navigation",
        action: () => handleNavigate("/projects"),
      },
      {
        id: "nav-ai",
        shortcut: "4",
        label: "AI Companion",
        sublabel: "/ai",
        icon: Sparkles,
        section: "navigation",
        action: () => handleNavigate("/ai"),
      },
      {
        id: "nav-contact",
        shortcut: "5",
        label: "Contact",
        sublabel: "/contact",
        icon: Mail,
        section: "navigation",
        action: () => handleNavigate("/contact"),
      },
      {
        id: "act-email",
        shortcut: "6",
        label: "Copy Email",
        sublabel: "Gmail",
        icon: Copy,
        section: "actions",
        action: handleCopyEmail,
      },
      {
        id: "act-url",
        shortcut: "7",
        label: "Copy Page Link",
        sublabel: "URL",
        icon: Share2,
        section: "actions",
        action: handleCopyUrl,
      },
      {
        id: "act-resume",
        shortcut: "8",
        label: "Download Resume",
        sublabel: "PDF",
        icon: Download,
        section: "actions",
        action: handleDownloadResume,
      },
    ];

    if (selectedText) {
      items.unshift({
        id: "act-copy-selection",
        shortcut: "C",
        label: `Copy "${selectedText.slice(0, 22)}${
          selectedText.length > 22 ? "…" : ""
        }"`,
        sublabel: "Selection",
        icon: Copy,
        section: "selection",
        action: handleCopySelection,
      });
    }

    items.push({
      id: "act-close",
      shortcut: "ESC",
      label: "Close Menu",
      sublabel: "Dismiss",
      icon: X,
      section: "close",
      action: closeMenu,
    });

    return items;
  }, [
    selectedText,
    handleNavigate,
    handleCopyEmail,
    handleCopyUrl,
    handleDownloadResume,
    handleCopySelection,
    closeMenu,
  ]);

  /**
   * Updates the active item with game-like spring recoil, velocity-aware "tuk" sound,
   * and rapid cascade ticks if a fast mouse flick jumps across multiple items at once.
   */
  const selectItemWithFeedback = useCallback(
    (nextIndex: number, options?: { allowCascade?: boolean }) => {
      const prevIndex = selectedIndexRef.current;
      if (nextIndex === prevIndex || nextIndex < 0 || nextIndex >= menuItems.length) {
        return;
      }

      selectedIndexRef.current = nextIndex;
      setSelectedIndex(nextIndex);

      // Visual micro-recoil impulse in the direction of movement
      const dir: -1 | 1 = nextIndex > prevIndex ? 1 : -1;
      setRecoilDirection(dir);
      if (recoilTimerRef.current) clearTimeout(recoilTimerRef.current);
      recoilTimerRef.current = setTimeout(() => {
        setRecoilDirection(0);
      }, 95);

      const stepDiff = Math.abs(nextIndex - prevIndex);
      clearCascadeTimers();

      if (options?.allowCascade && stepDiff > 1) {
        // Fast sweep across multiple items -> rapid "tuk-tuk-tuk" burst
        const burstCount = Math.min(stepDiff, 4);
        for (let i = 0; i < burstCount; i++) {
          const intermediateIdx =
            prevIndex + dir * Math.round(((i + 1) / burstCount) * stepDiff);
          if (i === 0) {
            playTukSound(0.95, intermediateIdx);
          } else {
            const timer = setTimeout(() => {
              playTukSound(0.95, intermediateIdx);
            }, i * 24);
            cascadeTimersRef.current.push(timer);
          }
        }
      } else {
        playTukSound(undefined, nextIndex);
      }
    },
    [menuItems.length, clearCascadeTimers, playTukSound]
  );

  // Trigger item execution with tactile confirmation sound & press animation
  const triggerItemAction = useCallback(
    (index: number) => {
      const item = menuItems[index];
      if (!item) return;
      setPressedIndex(index);
      playSelectConfirmSound();
      setTimeout(() => {
        item.action();
      }, 65);
    },
    [menuItems, playSelectConfirmSound]
  );

  // Measure active item DOM rect to drive the smooth sliding selection pill
  useEffect(() => {
    if (!isOpen) {
      setPillGeometry((prev) => ({ ...prev, ready: false }));
      return;
    }

    const activeEl = itemRefs.current[selectedIndex];
    const containerEl = itemsContainerRef.current;
    if (!activeEl || !containerEl) return;

    const updatePill = () => {
      const top = activeEl.offsetTop;
      const height = activeEl.offsetHeight;
      setPillGeometry({
        top,
        height,
        ready: true,
      });
    };

    updatePill();
  }, [isOpen, selectedIndex, menuItems.length]);

  // Cleanup cursor state & timers on unmount
  useEffect(() => {
    return () => {
      setCursorHiddenOnMenu(false);
      clearCascadeTimers();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (recoilTimerRef.current) clearTimeout(recoilTimerRef.current);
    };
  }, [setCursorHiddenOnMenu, clearCascadeTimers]);

  // Right-click listener + outside click / resize listeners + cursor visibility tracking
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const selection = window.getSelection()?.toString().trim() || "";
      setSelectedText(selection);
      selectedIndexRef.current = 0;
      setSelectedIndex(0);
      wheelAccumRef.current = 0;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const extraHeight = selection ? 46 : 0;
      const estimatedTotalHeight = MENU_ESTIMATED_HEIGHT + extraHeight;

      // Offset slightly by (-14, -14) so the pointer starts right inside the menu on open
      const desiredX = e.clientX - 14;
      const desiredY = e.clientY - 14;

      const clampedX = Math.max(16, Math.min(desiredX, vw - MENU_WIDTH - 16));
      const clampedY = Math.max(
        16,
        Math.min(desiredY, vh - estimatedTotalHeight - 16)
      );

      setPosition({ x: clampedX, y: clampedY });
      setIsOpen(true);

      // Hide cursor immediately if the pointer starts inside the menu bounds
      const startsInsideX =
        e.clientX >= clampedX && e.clientX <= clampedX + MENU_WIDTH;
      const startsInsideY =
        e.clientY >= clampedY && e.clientY <= clampedY + estimatedTotalHeight;
      setCursorHiddenOnMenu(startsInsideX && startsInsideY);

      playOpenSound();
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleResize = () => {
      closeMenu();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, closeMenu, playOpenSound, setCursorHiddenOnMenu]);

  // Track pointer position while open so cursor reliably hides on the menu and shows outside
  useEffect(() => {
    if (!enabled || !isOpen) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const menuEl = menuRef.current;
      if (!menuEl) return;

      const rect = menuEl.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setCursorHiddenOnMenu(isInside);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [enabled, isOpen, setCursorHiddenOnMenu]);

  // Keyboard navigation: ArrowUp, ArrowDown, 1-8 shortcuts, C for copy, Enter to execute, Escape to close
  useEffect(() => {
    if (!enabled || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        playTukSound(0.4, 0);
        closeMenu();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        const nextIdx = (selectedIndexRef.current + 1) % menuItems.length;
        selectItemWithFeedback(nextIdx);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        const nextIdx =
          (selectedIndexRef.current - 1 + menuItems.length) % menuItems.length;
        selectItemWithFeedback(nextIdx);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        triggerItemAction(selectedIndexRef.current);
        return;
      }

      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        e.stopPropagation();
        setSoundEnabled((prev) => !prev);
        return;
      }

      // Number shortcut keys (1-8) or C select the corresponding item with tactile feedback
      const pressedKey = e.key.toUpperCase();
      const matchedIdx = menuItems.findIndex(
        (item) => item.shortcut === pressedKey
      );
      if (matchedIdx !== -1) {
        e.preventDefault();
        e.stopPropagation();
        selectItemWithFeedback(matchedIdx, { allowCascade: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [
    enabled,
    isOpen,
    menuItems,
    closeMenu,
    playTukSound,
    selectItemWithFeedback,
    triggerItemAction,
  ]);

  // Continuous vertical pointer scrubbing inside the menu (even across gaps/dividers)
  const handleItemsPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const clientY = e.clientY;
      let closestIdx = selectedIndexRef.current;
      let minDistance = Infinity;

      for (let i = 0; i < menuItems.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          closestIdx = i;
          minDistance = 0;
          break;
        }
        const center = (rect.top + rect.bottom) * 0.5;
        const dist = Math.abs(clientY - center);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }

      if (closestIdx !== selectedIndexRef.current) {
        selectItemWithFeedback(closestIdx, { allowCascade: true });
      }
    },
    [menuItems.length, selectItemWithFeedback]
  );

  // Wheel / trackpad dial scrubbing over the menu (like a phone picker wheel)
  const handleMenuWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      wheelAccumRef.current += e.deltaY;
      const stepThreshold = 26;

      if (Math.abs(wheelAccumRef.current) >= stepThreshold) {
        const steps = Math.trunc(wheelAccumRef.current / stepThreshold);
        wheelAccumRef.current -= steps * stepThreshold;
        const dir = steps > 0 ? 1 : -1;
        const nextIdx = Math.max(
          0,
          Math.min(menuItems.length - 1, selectedIndexRef.current + dir)
        );
        selectItemWithFeedback(nextIdx);
      }
    },
    [menuItems.length, selectItemWithFeedback]
  );

  if (!enabled) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <>
          {/* Outside Backdrop: keeps the custom cursor VISIBLE outside the menu component */}
          <div
            onClick={closeMenu}
            onMouseEnter={() => setCursorHiddenOnMenu(false)}
            className="fixed inset-0 z-[9990] bg-black/[0.06] backdrop-blur-[1.5px]"
          />

          {/* Tactile Game / Phone-Haptic Command Menu */}
          <div
            ref={menuRef}
            role="menu"
            aria-label="Portfolio Command Menu"
            data-cursor="hide"
            onMouseEnter={() => setCursorHiddenOnMenu(true)}
            onMouseLeave={() => setCursorHiddenOnMenu(false)}
            onWheel={handleMenuWheel}
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${MENU_WIDTH}px`,
              transform:
                recoilDirection === 0
                  ? "translate3d(0, 0, 0) scale(1)"
                  : `translate3d(0, ${recoilDirection * 1.4}px, 0) scale(1.004)`,
              transition:
                "transform 120ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease",
            }}
            className="fixed z-[9998] cursor-none rounded-2xl bg-white/88 backdrop-blur-2xl backdrop-saturate-150 border border-black/[0.1] text-neutral-950 shadow-[0_26px_75px_rgba(0,0,0,0.26),0_4px_14px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 font-sans will-change-transform"
          >
            {/* Menu Items List with Continuous Sliding Game/Phone Highlight Pill */}
            <div
              ref={itemsContainerRef}
              onMouseMove={handleItemsPointerMove}
              className="relative p-1.5 space-y-0.5"
            >
              {/* Smooth GPU-accelerated sliding selection pill */}
              <div
                aria-hidden="true"
                style={{
                  transform: `translate3d(0, ${pillGeometry.top}px, 0) scale(${
                    pressedIndex !== null ? 0.975 : 1
                  })`,
                  height: `${pillGeometry.height}px`,
                  opacity: pillGeometry.ready ? 1 : 0,
                  transition:
                    "transform 135ms cubic-bezier(0.22, 1, 0.36, 1), height 135ms cubic-bezier(0.22, 1, 0.36, 1), opacity 90ms ease",
                }}
                className="pointer-events-none absolute top-0 left-1.5 right-1.5 rounded-xl bg-neutral-950 shadow-[0_8px_20px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.14)] will-change-transform flex items-center"
              >
                {/* Left game-style active accent bar */}
                <span className="ml-1.5 w-1 h-4 rounded-full bg-[#ff5500] shadow-[0_0_8px_rgba(255,85,0,0.75)]" />
              </div>

              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                const isPressed = idx === pressedIndex;
                const prevSection = idx > 0 ? menuItems[idx - 1].section : null;
                const showDivider =
                  prevSection !== null && prevSection !== item.section;

                return (
                  <React.Fragment key={item.id}>
                    {showDivider && (
                      <div className="my-1 border-t border-black/[0.07]" />
                    )}

                    <button
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      type="button"
                      role="menuitem"
                      data-cursor="hide"
                      onMouseEnter={() =>
                        selectItemWithFeedback(idx, { allowCascade: true })
                      }
                      onClick={() => triggerItemAction(idx)}
                      style={{
                        transform: isPressed
                          ? "scale(0.975)"
                          : isSelected
                          ? "translate3d(4px, 0, 0)"
                          : "translate3d(0, 0, 0)",
                        transition:
                          "transform 135ms cubic-bezier(0.22, 1, 0.36, 1), color 100ms ease",
                      }}
                      className={`relative z-10 cursor-none w-full pl-3.5 pr-3 py-2 rounded-xl text-left flex items-center justify-between will-change-transform ${
                        isSelected ? "text-white" : "text-neutral-800"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
                            isSelected
                              ? "text-[#ff5500] scale-110"
                              : "text-neutral-500 scale-100"
                          }`}
                        />
                        <span className="text-xs font-medium tracking-tight truncate">
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span
                            className={`text-[10px] font-mono truncate transition-opacity duration-150 ${
                              isSelected
                                ? "text-white/55 opacity-100"
                                : "text-neutral-400 opacity-0"
                            }`}
                          >
                            {item.sublabel}
                          </span>
                        )}
                      </span>

                      <span className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isSelected && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[9px] animate-in fade-in zoom-in-90 duration-100">
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd
                            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold tracking-wider border transition-colors duration-100 ${
                              isSelected
                                ? "bg-white text-neutral-950 border-white shadow-xs"
                                : "bg-black/[0.04] text-neutral-500 border-black/[0.08]"
                            }`}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Minimalist Keyboard + Haptic Audio Legend Footer */}
            <div className="px-3.5 py-2 border-t border-black/[0.07] bg-white/55 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
              <div className="flex items-center gap-2.5">
                <span>↑↓ / 1-8</span>
                <span>↵ Open</span>
              </div>

              <button
                type="button"
                data-cursor="hide"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled((prev) => !prev);
                }}
                title="Toggle haptic sound (M)"
                className="cursor-none inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/[0.05] hover:bg-black/[0.1] text-neutral-700 transition-colors"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-2.5 h-2.5 text-[#ff5500]" />
                    <span>SFX ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-2.5 h-2.5 text-neutral-400" />
                    <span>MUTED</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Minimalist Monochrome Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/15 text-neutral-950 shadow-[0_12px_32px_rgba(0,0,0,0.18)] flex items-center gap-2 font-mono text-xs pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-4 h-4 rounded-full bg-neutral-950 text-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5" />
          </span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </>
  );
}
