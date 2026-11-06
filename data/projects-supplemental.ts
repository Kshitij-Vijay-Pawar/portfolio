/**
 * Supplemental engineering details for verified projects in app/data/projects.ts.
 * Does NOT duplicate project titles, ids, or baseline metadata.
 * Sourced solely by referencing the verified project id.
 */

export interface ProjectSupplementalInfo {
  projectId: string;
  architecturalHighlights: string[];
  keyChallengesSolved: string[];
  engineeringStackDetails: string[];
}

export const PROJECTS_SUPPLEMENTAL: Record<string, ProjectSupplementalInfo> = {
  "google-maps-scraper": {
    projectId: "google-maps-scraper",
    architecturalHighlights: [
      "Asynchronous job queue pipeline using BullMQ and Redis to decouple HTTP API requests from long-running Playwright browser scraping.",
      "Multi-priority deduplication strategy matching business records by website URL, phone number, email, or normalized name + address.",
      "Controlled website enrichment worker (concurrency = 2) using Axios and Cheerio to fill missing emails, phones, and social profiles without overwriting verified Google Maps source fields.",
    ],
    keyChallengesSolved: [
      "Prevented HTTP request timeouts during multi-minute Google Maps feed scrolling by offloading Playwright browser automation to background BullMQ workers.",
      "Eliminated duplicate business listings across overlapping search queries using a deterministic priority matching hierarchy in PostgreSQL with Drizzle ORM.",
    ],
    engineeringStackDetails: [
      "Bun, TypeScript & Express 5 API",
      "Playwright Chromium Automation",
      "BullMQ & Redis Async Job Queue",
      "PostgreSQL & Drizzle ORM",
      "Next.js Frontend Dashboard & ExcelJS/CSV Export",
    ],
  },
  accentra: {
    projectId: "accentra",
    architecturalHighlights: [
      "Relational course hierarchy modeled in PostgreSQL (Neon) with Drizzle ORM across courses, units, lessons, challenges, options, progress, and subscriptions.",
      "Server Actions with Next.js path revalidation managing hearts, XP points, practice mode recovery, and leaderboard state.",
      "Context-aware AI Grammar Coach (/api/chat) powered by Google Gemini (gemini-2.0-flash) and Stripe subscription checkout/webhook integration.",
    ],
    keyChallengesSolved: [
      "Synchronized gamified user state (hearts, points, lesson completion, and practice mode) across multiple routes using server-side Drizzle queries and path revalidation.",
      "Constrained Gemini AI responses with system prompts to deliver concise, level-appropriate language explanations.",
    ],
    engineeringStackDetails: [
      "Next.js 15 App Router & React",
      "PostgreSQL (Neon) & Drizzle ORM",
      "Clerk Authentication & Stripe SDK",
      "Google Gemini (@google/generative-ai)",
      "Tailwind CSS & Zustand",
    ],
  },
  edgelink: {
    projectId: "edgelink",
    architecturalHighlights: [
      "7-step SEO signal pipeline covering HTML crawl, on-page analysis, JSON-LD schema validation, robots.txt/sitemap checks, and external PageSpeed/backlink/ranking adapters.",
      "Background BullMQ + Redis worker processing audits with retries and exponential backoff.",
      "Anthropic Claude structured JSON synthesis combined with transactional Prisma persistence and Puppeteer executive PDF generation.",
    ],
    keyChallengesSolved: [
      "Built dual-mode signal adapters that operate with real third-party API keys or deterministic mock signals so the pipeline runs reliably in any environment.",
      "Used Prisma database transactions to atomically persist audit scores, severity-ranked issues, action items, and executive reports.",
    ],
    engineeringStackDetails: [
      "Next.js 16, React 19 & TypeScript",
      "PostgreSQL & Prisma ORM",
      "BullMQ & Redis Queue Workers",
      "Anthropic Claude API",
      "Puppeteer PDF Generation & Cheerio",
    ],
  },
  "mcfly-pos-website": {
    projectId: "mcfly-pos-website",
    architecturalHighlights: [
      "Component-driven marketing website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.",
      "Structured product storytelling sections covering POS capabilities, restaurant workflows, testimonials, FAQs, and demo requests.",
      "Smooth interactive transitions and visual polish using GSAP.",
    ],
    keyChallengesSolved: [
      "Organized complex POS product features into scannable bento grids, workflow steps, and interactive FAQ accordions for prospective restaurant owners.",
      "Clearly scoped as the product marketing website for McFly POS.",
    ],
    engineeringStackDetails: [
      "Next.js 16 (App Router) & React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "GSAP Animations & Lucide React",
    ],
  },
  "authentication-system": {
    projectId: "authentication-system",
    architecturalHighlights: [
      "Modular Express 5 + MongoDB (Mongoose) authentication backend separating routes, controllers, JWT middleware, and email utilities.",
      "Stateless JWT session tokens stored in HTTP-only cookies with bcrypt password hashing (10 salt rounds).",
      "Time-bound 6-digit email OTP verification flow powered by Nodemailer.",
    ],
    keyChallengesSolved: [
      "Protected user sessions from client-side script access by issuing JWTs inside HTTP-only cookies with strict SameSite policies.",
      "Implemented expiring OTP verification records on the Mongoose user model to validate account ownership.",
    ],
    engineeringStackDetails: [
      "Node.js & Express 5",
      "MongoDB & Mongoose ODM",
      "JWT (jsonwebtoken) & bcryptjs",
      "Nodemailer SMTP & cookie-parser",
    ],
  },
  aharaflow: {
    projectId: "aharaflow",
    architecturalHighlights: [
      "Active product build for an India-first, multi-tenant restaurant POS platform with PostgreSQL Row-Level Security (RLS).",
      "Backend architecture designed around Node.js, Express.js, TypeScript, PostgreSQL, and Redis.",
      "Domain modeling for Indian GST billing (CGST/SGST splits), table management, and Kitchen Display System (KDS) workflows.",
    ],
    keyChallengesSolved: [
      "Designed strict tenant and outlet isolation in PostgreSQL alongside Indian GST tax calculation rules.",
      "Structured as an active phased build with completed foundation, multi-tenant auth, menu/order modules, and Next.js dashboard, with Tauri 2 desktop and React Native (Expo) apps planned next.",
    ],
    engineeringStackDetails: [
      "Node.js, Express.js & TypeScript",
      "PostgreSQL & Redis",
      "Next.js Web Dashboard",
      "Tauri 2 & React Native / Expo (Planned Phases)",
    ],
  },
  "movie-discovery-app": {
    projectId: "movie-discovery-app",
    architecturalHighlights: [
      "Cross-platform mobile movie discovery app built with React Native 0.81, Expo SDK 54, and file-based Expo Router navigation.",
      "Reusable generic useFetch<T> hook with 1-second debounced TMDB API search.",
      "Appwrite database integration logging user search queries and trending movie demand.",
    ],
    keyChallengesSolved: [
      "Prevented redundant network requests while typing by combining a custom generic fetch hook with a 1-second search debounce.",
      "Tracked popular search terms in Appwrite by incrementing query counts or creating new documents per TMDB movie result.",
    ],
    engineeringStackDetails: [
      "React Native 0.81 & Expo SDK 54",
      "Expo Router & TypeScript",
      "TMDB REST API",
      "Appwrite SDK & NativeWind (Tailwind CSS)",
    ],
  },
};
