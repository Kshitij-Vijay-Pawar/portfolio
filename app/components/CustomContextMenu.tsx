"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
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

const MENU_WIDTH = 304;
const MENU_ESTIMATED_HEIGHT = 440;
const EMAIL_ADDRESS = "kshitijpawar9766@gmail.com";

export default function CustomContextMenu({
  enabled = false,
}: CustomContextMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (typeof document !== "undefined") {
      delete document.documentElement.dataset.contextMenuOpen;
    }
  }, []);

  const handleNavigate = useCallback(
    (route: string) => {
      closeMenu();
      router.push(route);
    },
    [closeMenu, router]
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
    const link = document.createElement("a");
    link.href = "/resume/Kshitij_Resume.pdf";
    link.download = "Kshitij_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading Resume PDF");
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

  // Toggle global cursor hiding attribute when open
  useEffect(() => {
    if (!enabled) return;
    if (isOpen) {
      document.documentElement.dataset.contextMenuOpen = "true";
    } else {
      delete document.documentElement.dataset.contextMenuOpen;
    }
    return () => {
      delete document.documentElement.dataset.contextMenuOpen;
    };
  }, [enabled, isOpen]);

  // Right-click listener + outside click / scroll / resize listeners
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const selection = window.getSelection()?.toString().trim() || "";
      setSelectedText(selection);
      setSelectedIndex(0);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const extraHeight = selection ? 44 : 0;

      const clampedX = Math.max(
        16,
        Math.min(e.clientX, vw - MENU_WIDTH - 16)
      );
      const clampedY = Math.max(
        16,
        Math.min(e.clientY, vh - (MENU_ESTIMATED_HEIGHT + extraHeight) - 16)
      );

      setPosition({ x: clampedX, y: clampedY });
      setIsOpen(true);
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleScrollOrResize = () => {
      closeMenu();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [enabled, closeMenu]);

  // Keyboard navigation: ArrowUp, ArrowDown, 1-8 shortcuts, C for copy, Enter to execute, Escape to close
  useEffect(() => {
    if (!enabled || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(
          (prev) => (prev - 1 + menuItems.length) % menuItems.length
        );
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const activeItem = menuItems[selectedIndex];
        if (activeItem) {
          activeItem.action();
        }
        return;
      }

      // Number shortcut keys (1-8) select the corresponding item (press Enter to go)
      const pressedKey = e.key.toUpperCase();
      const matchedIdx = menuItems.findIndex(
        (item) => item.shortcut === pressedKey
      );
      if (matchedIdx !== -1) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(matchedIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [enabled, isOpen, menuItems, selectedIndex, closeMenu]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <>
          {/* Full-screen transparent backdrop that hides the OS cursor while the menu is open */}
          <div
            data-cursor="hide"
            onClick={closeMenu}
            className="fixed inset-0 z-[9998] cursor-none bg-black/[0.08] backdrop-blur-[1.5px]"
          />

          {/* macOS Frosted White Minimalist Black & White Context Window */}
          <div
            ref={menuRef}
            role="menu"
            aria-label="Portfolio Command Menu"
            data-cursor="hide"
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${MENU_WIDTH}px`,
            }}
            className="fixed z-[9999] cursor-none rounded-2xl bg-white/85 backdrop-blur-2xl backdrop-saturate-150 border border-black/[0.09] text-neutral-950 shadow-[0_24px_70px_rgba(0,0,0,0.24),0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 font-sans"
          >
            {/* Top Minimalist Header with Close Button */}
            <div className="px-3.5 py-2.5 border-b border-black/[0.07] flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-950" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-800 font-bold">
                  QUICK MENU
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/[0.05] font-mono text-[9px] text-neutral-500 uppercase">
                  {pathname === "/" ? "/home" : pathname}
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                data-cursor="hide"
                aria-label="Close context menu"
                className="cursor-none w-6 h-6 rounded-lg bg-black/[0.05] hover:bg-neutral-950 hover:text-white text-neutral-600 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="p-1.5 space-y-0.5">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                const prevSection = idx > 0 ? menuItems[idx - 1].section : null;
                const showDivider =
                  prevSection !== null && prevSection !== item.section;

                return (
                  <React.Fragment key={item.id}>
                    {showDivider && (
                      <div className="my-1 border-t border-black/[0.07]" />
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      data-cursor="hide"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => item.action()}
                      className={`cursor-none w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all duration-100 ${
                        isSelected
                          ? "bg-neutral-950 text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
                          : "bg-transparent text-neutral-800"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-white" : "text-neutral-500"
                          }`}
                        />
                        <span className="text-xs font-medium tracking-tight truncate">
                          {item.label}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isSelected && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[9px]">
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd
                            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold tracking-wider border ${
                              isSelected
                                ? "bg-white text-neutral-950 border-white"
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

            {/* Minimalist Keyboard Legend Footer */}
            <div className="px-3.5 py-2 border-t border-black/[0.07] bg-white/50 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
              <span>↑↓ / 1-8 Select</span>
              <span>↵ Open</span>
              <span>ESC Close</span>
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
