export interface Profile {
  name: string;
  role: string;
  bio: string;
  education: {
    degree: string;
    field: string;
    institutionPeriod: string;
    location: string;
    details: string;
    topics: string[];
  };
  contact: {
    email: string;
    github: string;
    location: string;
  };
  verifiedSkills: {
    frontend: string[];
    backend: string[];
    database: string[];
    creative3d: string[];
    tools: string[];
  };
  philosophies: Array<{
    num: string;
    title: string;
    desc: string;
  }>;
}

export const PROFILE: Profile = {
  name: "Kshitij Vijay Pawar",
  role: "Full Stack Developer & Creative Technologist",
  bio: "Architecting high-performance digital products, interactive 3D web experiences, and AI-enabled platforms with Next.js, WebGL, Three.js, and Node.js. Obsessed with 60fps micro-animations, clean TypeScript architecture, and tactile digital craftsmanship.",
  education: {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Artificial Intelligence & Data Science",
    institutionPeriod: "2022 - 2026",
    location: "Pune, Maharashtra, India",
    details: "Rigorous curriculum covering Data Structures, Machine Learning, Deep Neural Networks, Cloud Systems, and Advanced Web Engineering.",
    topics: [
      "Algorithms & DSA",
      "Deep Learning",
      "Database Systems",
      "Distributed Architecture",
      "AI Ethics",
    ],
  },
  contact: {
    email: "kshitij.vijay.pawar@gmail.com",
    github: "https://github.com/Kshitij-Vijay-Pawar",
    location: "Pune, Maharashtra, India",
  },
  verifiedSkills: {
    frontend: [
      "React 19 / Next.js (App Router, Server Actions)",
      "TypeScript (Strict Type Safety)",
      "Tailwind CSS (Custom Tokens & Modern CSS)",
      "GSAP & Motion (ScrollTrigger, Timelines)",
      "React Native & Electron",
    ],
    backend: [
      "Node.js & Express (REST & Realtime APIs)",
      "WebSockets & WebRTC (Realtime Bidirectional Data)",
      "Redis & Caching (In-memory Pub/Sub)",
    ],
    database: [
      "PostgreSQL & SQL (Relational Modeling)",
      "MongoDB (Document Store)",
    ],
    creative3d: [
      "Three.js & WebGL (3D Shaders, Canvas)",
      "Gemini & GenAI APIs (Structured Output, Tool Calling)",
    ],
    tools: [
      "Docker & Linux (Containers & Environments)",
      "Git & GitHub Actions (CI/CD & Versioning)",
    ],
  },
  philosophies: [
    {
      num: "01",
      title: "Performance & Fluid Motion",
      desc: "A great digital experience must feel instantaneous and alive. I obsess over 60fps micro-animations, layout stability, and zero-jank transitions.",
    },
    {
      num: "02",
      title: "Resilient System Architecture",
      desc: "Scalable software begins with clean TypeScript contracts, well-structured database schemas, and modular components that stand the test of time.",
    },
    {
      num: "03",
      title: "AI-Augmented Interfaces",
      desc: "AI isn't just a chatbot; it's a creative primitive. I integrate intelligent generative features directly into modern web workflows.",
    },
    {
      num: "04",
      title: "Craft & Detail Obsession",
      desc: "From custom cursor mechanics to tactile sound feedback, every pixel, bezier curve, and typography choice is designed intentionally.",
    },
  ],
};
