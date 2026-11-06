export interface Project {
  id: string;
  route: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  overview: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  repoLabel?: string;
  secondaryRepoUrl?: string;
  secondaryRepoLabel?: string;
  client?: string;
  status?: string;
  architecturalHighlights?: string[];
  keyFeatures?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "google-maps-scraper",
    route: "/project/google-maps-scraper",
    title: "GOOGLE MAPS LEAD SCRAPER",
    category: "FULL-STACK / DISTRIBUTED SYSTEMS",
    year: "2025",
    desc: "Async Google Maps lead scraper & enrichment platform built with Bun, Express 5, Playwright, BullMQ, Redis, PostgreSQL, and Next.js.",
    overview:
      "A full-stack lead-generation system that scrapes business listings from Google Maps, processes scraping tasks asynchronously with BullMQ and Redis, stores leads in PostgreSQL via Drizzle ORM, deduplicates records using priority business identifiers, enriches missing contact and social data from company websites without overwriting source data, and exports results to CSV and Excel (.xlsx).",
    image: "/assets/images/projects/cod-1.avif",
    tags: [
      "Next.js",
      "TypeScript",
      "Bun",
      "Express 5",
      "Playwright",
      "BullMQ",
      "Redis",
      "PostgreSQL",
      "Drizzle ORM",
      "Cheerio",
      "Docker",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/scraper",
    repoLabel: "Backend API & Workers Repo",
    secondaryRepoUrl: "https://github.com/Kshitij-Vijay-Pawar/scraper-ui",
    secondaryRepoLabel: "Next.js Dashboard Repo",
    client: "Full-Stack Product Build",
    status: "Completed",
    architecturalHighlights: [
      "Separated API request handling from browser automation using BullMQ and Redis so long-running Playwright scraping jobs never block HTTP responses.",
      "Multi-priority deduplication hierarchy matching existing business records by website domain, phone number, email address, or normalized name + address.",
      "Controlled concurrency and enrichment pipeline (concurrency = 2) that crawls business websites and contact pages via Axios/Cheerio to fill missing emails, phones, and social links without overwriting verified Google Maps fields.",
      "Multi-format data export supporting raw JSON, flattened CSV, and styled Excel (.xlsx) workbooks via ExcelJS.",
    ],
    keyFeatures: [
      "POST /api/v1/scrape/google-maps job enqueueing with Zod request validation",
      "Asynchronous Playwright worker scrolling Google Maps feeds and extracting ratings, reviews, coordinates, and hours",
      "Automatic website contact enrichment for emails, phone numbers, Facebook, Instagram, LinkedIn, and Twitter/X",
      "Paginated lead filtering by category, city, search term, rating, and email presence",
    ],
  },
  {
    id: "accentra",
    route: "/project/accentra",
    title: "ACCENTRA",
    category: "AI SAAS / EDTECH PLATFORM",
    year: "2025",
    desc: "Gamified AI language learning platform with interactive lessons, Clerk auth, Stripe subscriptions, and a Google Gemini grammar coach.",
    overview:
      "A full-stack gamified language-learning web application built with Next.js 15 App Router, PostgreSQL (Neon), and Drizzle ORM. Accentra features structured courses, units, lessons, SELECT and ASSIST challenge mechanics, hearts/points/XP progression, quests, leaderboards, Stripe subscription checkout/webhook handlers, and an AI grammar conversation assistant powered by Google Gemini (gemini-2.0-flash).",
    image: "/assets/images/projects/az-1.avif",
    tags: [
      "Next.js 15",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL (Neon)",
      "Drizzle ORM",
      "Clerk Auth",
      "Google Gemini AI",
      "Stripe",
      "Zustand",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/accentra",
    repoLabel: "GitHub Repository",
    client: "Full-Stack AI EdTech App",
    status: "Completed",
    architecturalHighlights: [
      "Relational schema designed with Drizzle ORM and Neon PostgreSQL modeling courses, units, lessons, challenges, challengeOptions, challengeProgress, userProgress, and userSubscription.",
      "Server Actions with path revalidation managing lesson completion, heart deduction, practice mode recovery, and point-based heart refills.",
      "Context-aware AI grammar tutor (/api/chat) using @google/generative-ai (gemini-2.0-flash) constrained with system instructions for concise explanations and target-language examples.",
      "Stripe Checkout, Billing Portal, and webhook handlers synchronizing subscription lifecycle events with PostgreSQL.",
    ],
    keyFeatures: [
      "Interactive lesson quiz flow with audio feedback, progress bar, and practice mode",
      "Gamification loop with hearts, points, daily quests, shop refills, and global leaderboard",
      "AI Grammar Coach modal for real-time language & grammar Q&A",
      "Role-guarded Admin dashboard for managing courses, units, lessons, and challenges",
    ],
  },
  {
    id: "edgelink",
    route: "/project/edgelink",
    title: "EDGELINK",
    category: "AI SEO ENGINE / ASYNC PIPELINE",
    year: "2025",
    desc: "Autonomous AI SEO auditing engine with a 7-step signal pipeline, BullMQ workers, Claude AI analysis, and Puppeteer PDF reports.",
    overview:
      "An AI-assisted SEO auditing platform and client reporting portal built around a 7-step signal collection pipeline (HTML crawling, on-page analysis, JSON-LD schema validation, robots/sitemap verification, and external signal adapters), asynchronous BullMQ + Redis workers, Anthropic Claude structured analysis, transactional PostgreSQL/Prisma persistence, and Puppeteer executive PDF generation.",
    image: "/assets/images/projects/am-1.avif",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma ORM",
      "Redis",
      "BullMQ",
      "Anthropic Claude",
      "Puppeteer",
      "Cheerio",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/Edgelink",
    repoLabel: "GitHub Repository",
    client: "AI SEO & Reporting Platform",
    status: "Completed",
    architecturalHighlights: [
      "7-step SEO signal pipeline executing HTML crawl, on-page tag inspection, JSON-LD schema validation, robots.txt/sitemap checks, PageSpeed/CrUX metrics, backlink signals, and keyword rankings.",
      "Background worker architecture using BullMQ and Redis with 2 retries and exponential backoff, keeping heavy audits off the main HTTP thread.",
      "Anthropic Claude integration transforming raw technical audit signals into structured JSON executive summaries, severity-ranked issues, and prioritized action items.",
      "Headless Chromium PDF generator via Puppeteer rendering agency-branded executive audit reports on demand.",
    ],
    keyFeatures: [
      "Multi-step technical & on-page SEO signal extraction pipeline",
      "Dual-mode external API adapters supporting live keys or deterministic mock signals",
      "Transactional Prisma persistence storing Audit, Issue, ActionItem, and Report records",
      "Shareable client portal with token-based access and downloadable PDF reports",
    ],
  },
  {
    id: "mcfly-pos-website",
    route: "/project/mcfly-pos-website",
    title: "MCFLY POS WEBSITE",
    category: "PRODUCT MARKETING WEBSITE",
    year: "2026",
    desc: "Responsive product marketing website for McFly POS built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and GSAP animations.",
    overview:
      "A modern, conversion-focused product marketing website built for McFly POS (Point of Sale). Engineered with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and GSAP animations, structured into reusable sections for product capabilities, POS workflows, customer testimonials, pricing/FAQs, company story, and demo request capture.",
    image: "/assets/images/projects/chat-1.avif",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "GSAP",
      "Lucide React",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/pos-landing",
    repoLabel: "GitHub Repository",
    client: "McFlyworld (Marketing Website)",
    status: "Completed",
    architecturalHighlights: [
      "Modular component architecture in Next.js App Router separating hero showcase, feature bento grid, POS workflow walkthroughs, testimonials, FAQ accordion, and contact sections.",
      "Responsive layout and typography system built with Tailwind CSS 4 and Plus Jakarta Sans for clean multi-device readability.",
      "Interactive product showcase and smooth visual transitions powered by GSAP.",
    ],
    keyFeatures: [
      "Interactive POS feature showcase and workflow breakdown sections",
      "Dedicated About page and customer FAQ accordion",
      "Demo request and contact inquiry capture interface",
      "Clearly scoped as the product marketing website for McFly POS",
    ],
  },
  {
    id: "authentication-system",
    route: "/project/authentication-system",
    title: "AUTHENTICATION SYSTEM",
    category: "BACKEND SECURITY / REST API",
    year: "2025",
    desc: "Node.js, Express 5, and MongoDB auth backend featuring bcrypt password hashing, HTTP-only JWT cookies, and Nodemailer OTP verification.",
    overview:
      "A focused backend authentication service built with Node.js, Express 5, and MongoDB (Mongoose). Implements user registration, duplicate-email guards, bcrypt password hashing, JWT session issuance in HTTP-only cookies, custom authentication middleware, logout session clearing, and 6-digit email OTP verification powered by Nodemailer.",
    image: "/assets/images/projects/fi-1.avif",
    tags: [
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "JWT",
      "bcryptjs",
      "Nodemailer",
      "REST API",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/Authentication_System",
    repoLabel: "GitHub Repository",
    client: "Backend Engineering Module",
    status: "Completed",
    architecturalHighlights: [
      "Layered MVC backend structure separating Express routers, authentication controllers, JWT middleware, MongoDB connection management, and Mongoose user models.",
      "Stateless JWT authentication stored inside HTTP-only cookies with strict SameSite and environment-aware secure flags.",
      "Time-bound 6-digit OTP generation and verification flow delivered via Nodemailer SMTP transport.",
    ],
    keyFeatures: [
      "User registration & login with bcrypt password hashing (salt rounds = 10)",
      "HTTP-only cookie session management & protected route middleware",
      "Email OTP generation, expiration validation, and account verification",
      "Welcome and security notification emails via Nodemailer",
    ],
  },
  {
    id: "aharaflow",
    route: "/project/aharaflow",
    title: "AHARAFLOW POS",
    category: "MULTI-TENANT RESTAURANT POS (IN PROGRESS)",
    year: "2026",
    desc: "Multi-tenant restaurant POS & kitchen operations platform in active development with Node.js, Express.js, PostgreSQL, Redis, and Next.js.",
    overview:
      "An active product build for an India-focused, multi-tenant restaurant POS and operations platform designed around Indian GST billing, Kitchen Display Systems (KDS), Captain ordering workflows, and offline-first resilience. Currently in active phased development using Node.js, Express.js, TypeScript, PostgreSQL, Redis, and Next.js, with planned Tauri 2 desktop and React Native (Expo) captain apps.",
    image: "/assets/images/projects/cod-1.avif",
    tags: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Next.js",
      "Tauri 2 (Planned)",
      "React Native / Expo (Planned)",
    ],
    client: "Active Product Build (In Progress)",
    status: "In Progress — Active Build",
    architecturalHighlights: [
      "Multi-tenant PostgreSQL schema with Row-Level Security (RLS) isolating tenant, outlet, menu, order, and billing records.",
      "Backend architecture designed around Node.js, Express.js, TypeScript, PostgreSQL, and Redis for real-time kitchen event pub/sub and session caching.",
      "India-specific restaurant domain modeling including CGST/SGST tax splits, round-off rules, modifiers, combos, and table/section management.",
    ],
    keyFeatures: [
      "Completed Foundation: Monorepo & Dockerized PostgreSQL + Redis local environment",
      "Completed Core Modules: Multi-tenant auth, outlet/staff/role management, and menu CRUD with Indian GST logic",
      "Completed Web UI: Next.js dashboard for menu management, table/floor layout, and POS order creation",
      "Upcoming Phases: Tauri 2 offline desktop terminal, React Native (Expo) captain app, and payment/aggregator integrations",
    ],
  },
  {
    id: "movie-discovery-app",
    route: "/project/movie-discovery-app",
    title: "MOVIE DISCOVERY APP",
    category: "MOBILE APP / REACT NATIVE",
    year: "2025",
    desc: "Cross-platform mobile movie discovery and search app built with React Native, Expo Router, TypeScript, TMDB API, NativeWind, and Appwrite.",
    overview:
      "A mobile movie discovery application built with React Native (0.81), Expo SDK 54, Expo Router, TypeScript, and NativeWind (Tailwind CSS). Integrates with the TMDB REST API for trending and search feeds, implements a reusable generic useFetch hook with 1-second debounced search, and logs search demand metrics to an Appwrite database to surface trending user queries.",
    image: "/assets/images/projects/az-1.avif",
    tags: [
      "React Native",
      "Expo SDK 54",
      "Expo Router",
      "TypeScript",
      "TMDB API",
      "Appwrite",
      "NativeWind",
    ],
    repoUrl: "https://github.com/Kshitij-Vijay-Pawar/react-native-movie-app",
    repoLabel: "GitHub Repository",
    client: "Mobile App Project",
    status: "Completed",
    architecturalHighlights: [
      "File-based mobile navigation using Expo Router with bottom tab navigation (Home, Search, Saved, Profile) and dynamic movie detail routes (movies/[id]).",
      "Custom generic useFetch<T> hook encapsulating loading, error, manual trigger, and state reset lifecycles across screens.",
      "1-second debounced search pipeline preventing excessive TMDB API calls while automatically syncing top search terms and poster counts to Appwrite.",
    ],
    keyFeatures: [
      "Popular and trending movies feed with 3-column responsive poster grid",
      "Debounced real-time movie search with Appwrite search-count tracking",
      "Detailed movie view displaying runtime, ratings, genres, budget, revenue, and production companies",
      "NativeWind utility styling optimized for iOS and Android viewports",
    ],
  },
];
