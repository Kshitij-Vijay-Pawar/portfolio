import type { Metadata } from "next";
import { PROFILE } from "@/data/profile";
import { PROJECTS, type Project } from "@/app/data/projects";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://kshitij-pawar.is-a.dev")
).replace(/\/+$/, "");

export const METADATA_BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://kshitij-pawar.is-a.dev")
).replace(/\/+$/, "");

export const SITE_NAME = "Kshitij Pawar | Full-Stack Developer";
export const SITE_TITLE_DEFAULT = "Kshitij Pawar | Full-Stack Developer";
export const SITE_DESCRIPTION_DEFAULT =
  "Full-Stack Developer in Nashik, India building scalable React, Next.js, Node.js, PostgreSQL & BullMQ/Redis systems.";
export const DEFAULT_OG_IMAGE_PATH = "/og-image.png";
export const DEFAULT_OG_IMAGE_URL = `${METADATA_BASE_URL}${DEFAULT_OG_IMAGE_PATH}`;
export const DEFAULT_OG_IMAGE_ALT =
  "Kshitij Pawar — Full-Stack Developer in Nashik, India | React, Next.js, TypeScript, Node.js, PostgreSQL, Redis, BullMQ";

export const VERIFIED_SAME_AS = [
  "https://github.com/Kshitij-Vijay-Pawar",
  "https://kshitij-pawar.is-a.dev",
];

export const CORE_KEYWORDS = [
  "Kshitij Pawar",
  "Full-Stack Developer",
  "Full-Stack Developer Nashik",
  "Full-Stack Developer India",
  "React Developer India",
  "Next.js Developer",
  "TypeScript Developer",
  "Node.js Developer",
  "Express.js",
  "PostgreSQL",
  "Drizzle ORM",
  "Prisma ORM",
  "BullMQ",
  "Redis",
  "Playwright Web Scraping",
  "React Native Developer",
  "Software Engineer Portfolio",
];

interface PageSeoOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "profile" | "article";
  image?: string;
  imageAlt?: string;
}

export function constructMetadata({
  title,
  description = SITE_DESCRIPTION_DEFAULT,
  path = "/",
  keywords = [],
  noIndex = false,
  type = "website",
  image = DEFAULT_OG_IMAGE_URL,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
}: PageSeoOptions = {}): Metadata {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath || "/"}`;
  const resolvedImageUrl = image.startsWith("http")
    ? image
    : `${METADATA_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  const fullTitle = title
    ? title.includes("Kshitij Pawar")
      ? title
      : `${title} | Kshitij Pawar`
    : SITE_TITLE_DEFAULT;

  const mergedKeywords = Array.from(new Set([...CORE_KEYWORDS, ...keywords]));

  return {
    metadataBase: new URL(METADATA_BASE_URL),
    title: fullTitle,
    description,
    keywords: mergedKeywords,
    authors: [{ name: PROFILE.name, url: SITE_URL }],
    creator: PROFILE.name,
    publisher: PROFILE.name,
    category: "technology",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: "en_IN",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: resolvedImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: resolvedImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PROFILE.name,
    jobTitle: PROFILE.role,
    description: PROFILE.bio,
    url: `${SITE_URL}/`,
    email: `mailto:${PROFILE.contact.email}`,
    telephone: PROFILE.contact.phone,
    image: `${SITE_URL}/images/Hero.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nashik",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sandip Institute of Technology and Research Centre, Nashik",
    },
    worksFor: {
      "@type": "Organization",
      name: "McFlyworld",
    },
    sameAs: VERIFIED_SAME_AS,
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "React Native",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Drizzle ORM",
      "Prisma ORM",
      "Redis",
      "BullMQ",
      "Playwright",
      "Docker",
      "REST APIs",
    ],
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION_DEFAULT,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${SITE_URL}/#person`,
    },
  };
}

export function getProfilePageJsonLd(path = "/") {
  const pageUrl = `${SITE_URL}${path === "/" ? "/" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profilepage`,
    url: pageUrl,
    name: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION_DEFAULT,
    mainEntity: {
      "@id": `${SITE_URL}/#person`,
    },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

export function getProjectsCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects#collection`,
    url: `${SITE_URL}/projects`,
    name: "Selected Projects | Kshitij Pawar",
    description:
      "Full-stack web applications, asynchronous BullMQ + Redis worker systems, AI SaaS platforms, and mobile engineering projects by Kshitij Pawar.",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${project.route}`,
        name: project.title,
        description: project.desc,
      })),
    },
  };
}

export function getProjectCaseStudyJsonLd(project: Project) {
  const projectUrl = `${SITE_URL}${project.route}`;
  return {
    "@context": "https://schema.org",
    "@type": project.repoUrl ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.title,
    description: project.overview,
    url: projectUrl,
    dateCreated: project.year,
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    keywords: project.tags.join(", "),
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    programmingLanguage: project.tags,
  };
}

