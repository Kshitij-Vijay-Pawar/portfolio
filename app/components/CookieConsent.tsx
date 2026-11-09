"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  OPEN_PRIVACY_SETTINGS_EVENT,
  disableClarity,
  enableClarity,
} from "@/lib/clarity";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type Consent = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<Consent>(null);
  const [customize, setCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Track client-side route changes in GA4 (skip initial mount since @next/third-parties/google fires initial page_view)
  useEffect(() => {
    if (!ready || !analyticsEnabled || !GA_ID) return;
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      try {
        sendGAEvent("event", "page_view", {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      } catch {
        // Ignore if gtag is blocked by extension
      }
    }
  }, [pathname, ready, analyticsEnabled]);

  useEffect(() => {
    const saved = localStorage.getItem(ANALYTICS_CONSENT_KEY);

    if (saved === "accepted") {
      setConsent("accepted");
      setAnalyticsEnabled(true);
      enableClarity();
    } else if (saved === "rejected") {
      setConsent("rejected");
      setAnalyticsEnabled(false);
      disableClarity();
    }

    setReady(true);

    const handleOpenPrivacy = () => setCustomize(true);
    window.addEventListener(OPEN_PRIVACY_SETTINGS_EVENT, handleOpenPrivacy);
    return () => {
      window.removeEventListener(OPEN_PRIVACY_SETTINGS_EVENT, handleOpenPrivacy);
    };
  }, []);

  function saveChoice(enabled: boolean) {
    localStorage.setItem(
      ANALYTICS_CONSENT_KEY,
      enabled ? "accepted" : "rejected"
    );
    setConsent(enabled ? "accepted" : "rejected");
    setCustomize(false);

    if (enabled) {
      enableClarity();
    } else {
      disableClarity();
    }

    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));

    // Reload when revoking previously granted consent.
    // This prevents existing Google Analytics / Microsoft Clarity instances from
    // continuing to run on the current page.
    if (consent === "accepted" && !enabled) {
      window.location.reload();
      return;
    }

    setAnalyticsEnabled(enabled);
  }

  return (
    <>
      {/* Mount GA only when consent is explicitly granted */}
      {ready && analyticsEnabled && GA_ID && <GoogleAnalytics gaId={GA_ID} />}

      {/* Consent banner — shown on first visit or when customising */}
      {ready && (consent === null || customize) && (
        <div
          role="dialog"
          aria-label="Cookie and privacy preferences"
          aria-modal="false"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-xl rounded-2xl border border-white/15 bg-neutral-950/95 p-5 text-white shadow-2xl backdrop-blur-sm sm:inset-x-auto sm:right-6 sm:bottom-6"
        >
          <h2 className="text-lg font-semibold">Your privacy matters</h2>

          <p className="mt-2 text-sm leading-6 text-neutral-300">
            This website uses Google Analytics and Microsoft Clarity to
            understand visitor traffic, session interactions, and improve the
            experience. Analytics stays disabled unless you allow it.
          </p>

          {customize && (
            <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-3">
              <p className="text-sm font-medium text-neutral-200">
                Essential storage
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Used to remember your privacy choice. Always active.
              </p>

              <label
                htmlFor="analytics-toggle"
                className="mt-4 flex cursor-pointer items-center justify-between gap-4 text-sm"
              >
                <span>
                  <span className="block font-medium">
                    Analytics (Google Analytics &amp; Microsoft Clarity)
                  </span>
                  <span className="text-xs text-neutral-400">
                    Helps measure visits, heatmaps, and website usage.
                  </span>
                </span>

                <input
                  id="analytics-toggle"
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-white"
                />
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              id="cookie-accept-btn"
              onClick={() => saveChoice(true)}
              className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-85"
            >
              Accept all
            </button>

            <button
              type="button"
              id="cookie-reject-btn"
              onClick={() => saveChoice(false)}
              className="cursor-pointer rounded-lg border border-white/25 px-4 py-2 text-sm transition-colors hover:border-white/50"
            >
              Reject
            </button>

            {!customize ? (
              <button
                type="button"
                id="cookie-customize-btn"
                onClick={() => setCustomize(true)}
                className="cursor-pointer rounded-lg border border-white/25 px-4 py-2 text-sm transition-colors hover:border-white/50"
              >
                Customize
              </button>
            ) : (
              <button
                type="button"
                id="cookie-save-btn"
                onClick={() => saveChoice(analyticsEnabled)}
                className="cursor-pointer rounded-lg border border-white/25 px-4 py-2 text-sm transition-colors hover:border-white/50"
              >
                Save preferences
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
