export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  client?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "codenarts",
    title: "CODENARTS",
    category: "CREATIVE AGENCY / 3D",
    year: "2025",
    desc: "A bold creative agency website featuring futuristic Golden and purple visuals, seamless animations, and immersive storytelling.",
    image: "/assets/images/projects/cod-1.avif",
    tags: ["Next.js", "Three.js", "GSAP", "WebGL", "Creative Dev"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Codenarts Studio",
  },
  {
    id: "az-digital",
    title: "AZ-DIGITAL-VENTURES",
    category: "BRANDING / WEB APP",
    year: "2025",
    desc: "A bold digital agency website showcasing premium branding, striking typography, and conversion-focused services with a modern editorial aesthetic.",
    image: "/assets/images/projects/az-1.avif",
    tags: ["React 19", "Tailwind CSS", "Motion", "Editorial"],
    liveUrl: "https://www.meermohsin.me/",
    client: "AZ Digital Ventures",
  },
  {
    id: "amron",
    title: "AMRON",
    category: "MOTION & 3D DESIGN",
    year: "2025",
    desc: "A futuristic creative agency concept featuring bold 3D visuals, cinematic motion, and a premium digital aesthetic that emphasizes storytelling and visual impact.",
    image: "/assets/images/projects/am-1.avif",
    tags: ["WebGL", "Three.js", "FBO Shaders", "3D Optic"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Amron Creative Lab",
  },
  {
    id: "chatone",
    title: "CHATONE",
    category: "PRODUCT DESIGN / SAAS",
    year: "2025",
    desc: "A clean, light-themed messaging app designed for effortless conversations, real-time communication, and an intuitive user experience.",
    image: "/assets/images/projects/chat-1.avif",
    tags: ["Product Design", "TypeScript", "Realtime WebSocket"],
    liveUrl: "https://www.meermohsin.me/",
    client: "ChatOne Global",
  },
  {
    id: "finance",
    title: "FINANCE AI",
    category: "FINTECH / DESIGN SYSTEM",
    year: "2026",
    desc: "A futuristic finance platform combining glowing green visuals, intuitive dashboards, and seamless banking for modern users.",
    image: "/assets/images/projects/fi-1.avif",
    tags: ["Fintech", "Dark Mode UI", "Data Visualization", "GSAP"],
    liveUrl: "https://www.meermohsin.me/",
    client: "Finance AI Technologies",
  },
];
