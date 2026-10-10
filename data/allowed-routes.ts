/**
 * Security Whitelist: approved internal static routes, verified project IDs, and approved external hostnames.
 */

export const ALLOWED_STATIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/ai",
] as const;

export type AllowedStaticRoute = (typeof ALLOWED_STATIC_ROUTES)[number];

export const VERIFIED_PROJECT_IDS = [
  "codenarts",
  "az-digital",
  "amron",
  "chatone",
  "finance",
] as const;

export type VerifiedProjectId = (typeof VERIFIED_PROJECT_IDS)[number];

export const ALLOWED_EXTERNAL_HOSTNAMES = [
  "github.com",
  "linkedin.com",
] as const;

export type AllowedExternalHostname = (typeof ALLOWED_EXTERNAL_HOSTNAMES)[number];

export const VERIFIED_RESUME_PATH = "/resume/Kshitij_Resume.pdf" as const;
