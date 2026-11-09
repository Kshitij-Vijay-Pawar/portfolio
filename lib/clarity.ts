"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export const ANALYTICS_CONSENT_KEY = "portfolio-analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "portfolio-analytics-consent-change";
export const OPEN_PRIVACY_SETTINGS_EVENT = "portfolio-open-privacy-settings";

export function openPrivacySettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PRIVACY_SETTINGS_EVENT));
}

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z9rlx3gh6r";

let isClarityInitialized = false;

export function initClarity() {
  if (typeof window === "undefined" || !CLARITY_PROJECT_ID) return;
  if (isClarityInitialized || document.getElementById("clarity-script")) {
    isClarityInitialized = true;
    return;
  }
  try {
    Clarity.init(CLARITY_PROJECT_ID);
    isClarityInitialized = true;
  } catch {
    // Ignore if blocked by browser ad/tracker blocker
  }
}

export function enableClarity() {
  if (typeof window === "undefined") return;
  try {
    initClarity();
    Clarity.consent(true);
    Clarity.consentV2({
      ad_Storage: "denied",
      analytics_Storage: "granted",
    });
  } catch {
    // Ignore initialization errors if blocked by browser extensions
  }
}

export function disableClarity() {
  if (typeof window === "undefined") return;
  try {
    Clarity.consent(false);
    Clarity.consentV2({
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
  } catch {
    // Ignore errors
  }
}

export default function ClarityProvider() {
  useEffect(() => {
    // Always initialize Clarity on mount so the tag loads immediately
    initClarity();

    const syncClarityWithConsent = () => {
      const savedConsent = localStorage.getItem(ANALYTICS_CONSENT_KEY);
      if (savedConsent === "accepted") {
        enableClarity();
      } else if (savedConsent === "rejected") {
        disableClarity();
      }
    };

    syncClarityWithConsent();

    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncClarityWithConsent);
    window.addEventListener("storage", syncClarityWithConsent);

    return () => {
      window.removeEventListener(
        ANALYTICS_CONSENT_EVENT,
        syncClarityWithConsent
      );
      window.removeEventListener("storage", syncClarityWithConsent);
    };
  }, []);

  return null;
}



