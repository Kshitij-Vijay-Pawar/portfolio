import { AIAction, AIActionType } from "./schema";
import {
  ALLOWED_STATIC_ROUTES,
  VERIFIED_PROJECT_IDS,
  ALLOWED_EXTERNAL_HOSTNAMES,
  VERIFIED_RESUME_PATH,
} from "../../data/allowed-routes";

export interface RawActionInput {
  type: string;
  label?: string;
  target?: string;
  description?: string;
}

/**
 * Deterministic Action Resolver.
 * Validates requested actions against approved routes and hostname whitelists.
 * Rejects all unapproved or malformed actions by returning null.
 */
export function resolveAction(action: RawActionInput): AIAction | null {
  if (!action || typeof action !== "object") {
    return null;
  }

  const rawType = (action.type || "").trim() as AIActionType;
  const rawTarget = (action.target || "").trim();
  const label = (action.label || "").trim();

  // If action type is "none", return null (or no executable action)
  if (rawType === "none") {
    return null;
  }

  // 1. Internal Static Route Navigation
  if (rawType === "navigate") {
    // Standardize leading slash and clean trailing slash
    let normalized = rawTarget.startsWith("/") ? rawTarget : `/${rawTarget}`;
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    const isAllowed = (ALLOWED_STATIC_ROUTES as readonly string[]).includes(normalized);
    if (!isAllowed) {
      return null;
    }

    return {
      type: "navigate",
      label: label || `Go to ${normalized === "/" ? "Home" : normalized.slice(1)}`,
      target: normalized,
      description: action.description,
    };
  }

  // 2. Verified Dynamic Project Detail Route
  if (rawType === "show_project") {
    // Extract slug whether model passed "codenarts" or "/projects/codenarts"
    let slug = rawTarget;
    if (slug.startsWith("/projects/")) {
      slug = slug.replace("/projects/", "");
    }
    slug = slug.replace(/^\/+|\/+$/g, ""); // strip any slashes

    const isValidProject = (VERIFIED_PROJECT_IDS as readonly string[]).includes(slug);
    if (!isValidProject) {
      return null;
    }

    return {
      type: "show_project",
      label: label || `View ${slug.toUpperCase()}`,
      target: `/projects/${slug}`,
      description: action.description,
    };
  }

  // 3. Download Verified Resume
  if (rawType === "download_resume") {
    // Deterministically lock destination to verified resume path regardless of model hallucinations
    return {
      type: "download_resume",
      label: label || "Download Kshitij's Resume",
      target: VERIFIED_RESUME_PATH,
      description: action.description || "Download PDF Resume (143 KB)",
    };
  }

  // 4. Open External Verified URL
  if (rawType === "open_url") {
    try {
      const parsedUrl = new URL(rawTarget);

      // Must strictly use HTTPS protocol
      if (parsedUrl.protocol !== "https:") {
        return null;
      }

      // Check hostname against approved whitelist
      const hostname = parsedUrl.hostname.toLowerCase();
      const isAllowedHost = (ALLOWED_EXTERNAL_HOSTNAMES as readonly string[]).some(
        (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
      );

      if (!isAllowedHost) {
        return null;
      }

      return {
        type: "open_url",
        label: label || `Open ${parsedUrl.hostname}`,
        target: parsedUrl.toString(),
        description: action.description,
      };
    } catch {
      // Invalid URL syntax rejected
      return null;
    }
  }

  // Reject any unrecognized action type
  return null;
}

/**
 * Filter and resolve an array of raw actions, discarding invalid actions.
 */
export function resolveActions(rawActions: RawActionInput[] | undefined | null): AIAction[] {
  if (!Array.isArray(rawActions)) {
    return [];
  }

  const resolved: AIAction[] = [];
  for (const raw of rawActions) {
    const action = resolveAction(raw);
    if (action) {
      resolved.push(action);
    }
  }

  return resolved;
}
