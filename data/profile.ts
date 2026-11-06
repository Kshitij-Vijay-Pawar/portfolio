export interface ExperienceEntry {
  company: string;
  role: string;
  type: "Employment" | "Internship" | "Training";
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  qualification: string;
  institution: string;
  location: string;
  period: string;
  score: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  education: {
    degree: string;
    field: string;
    institution: string;
    institutionPeriod: string;
    location: string;
    cgpa: string;
    details: string;
    topics: string[];
    history: EducationEntry[];
  };
  experience: ExperienceEntry[];
  contact: {
    email: string;
    phone: string;
    portfolio: string;
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
  name: "Kshitij Pawar",
  role: "Full-Stack Developer",
  bio: "Full-Stack Developer based in Pune, India, with hands-on experience building responsive web applications, multi-channel product interfaces, asynchronous background job pipelines, and database-driven backends using React, Next.js, TypeScript, Node.js, Express.js, PostgreSQL, Prisma, Drizzle ORM, Redis, and BullMQ.",
  education: {
    degree: "Bachelor of Engineering (B.E.)",
    field: "Artificial Intelligence and Data Science",
    institution: "Sandip Institute of Technology and Research Centre, Nashik",
    institutionPeriod: "2021 - 2025",
    location: "Nashik, Maharashtra, India",
    cgpa: "7.88 CGPA",
    details:
      "Completed B.E. in Artificial Intelligence and Data Science (7.88 CGPA) with strong foundations in Data Structures & Algorithms, Database Management Systems, Object-Oriented Programming, Machine Learning fundamentals, and Full-Stack Web Engineering.",
    topics: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Database Systems (SQL & NoSQL)",
      "RESTful API Design",
      "Asynchronous Worker Queues",
    ],
    history: [
      {
        qualification: "B.E. in Artificial Intelligence and Data Science",
        institution: "Sandip Institute of Technology and Research Centre",
        location: "Nashik, Maharashtra",
        period: "2021 – 2025",
        score: "7.88 CGPA",
      },
      {
        qualification: "12th Science (HSC)",
        institution: "M.S.G. Science College",
        location: "Malegaon, Maharashtra",
        period: "2020 – 2021",
        score: "83.80%",
      },
      {
        qualification: "10th SSC",
        institution: "R. V. Shah High School",
        location: "Malegaon, Maharashtra",
        period: "2018 – 2019",
        score: "87.40%",
      },
    ],
  },
  experience: [
    {
      company: "McFlyworld",
      role: "Full-Stack Developer",
      type: "Employment",
      period: "May 2026 – September 2026",
      location: "Goa, India",
      summary:
        "Worked on client and internal web, desktop, and mobile deliverables across frontend, backend, and deployment workflows.",
      highlights: [
        "Developed and maintained 25+ websites using React and Next.js with responsive UI and clean component structure.",
        "Built 2 software applications using Electron (desktop) and React Native (mobile).",
        "Implemented backend services and REST APIs using PHP, Laravel, Node.js, and Express.js, handling database integration and deployment.",
      ],
      technologies: [
        "React",
        "Next.js",
        "Electron",
        "React Native",
        "Node.js",
        "Express.js",
        "PHP",
        "Laravel",
        "REST APIs",
      ],
    },
    {
      company: "Tvara",
      role: "Frontend Developer",
      type: "Employment",
      period: "March 2026 – May 2026",
      location: "Bengaluru, India",
      summary:
        "Built frontend product features for an Autonomous AI Sales Platform supporting multi-channel outreach workflows.",
      highlights: [
        "Built frontend features for an autonomous AI sales platform supporting multi-channel workflows across email, WhatsApp, and telephony.",
        "Developed responsive interfaces using Next.js (App Router), TypeScript, and Tailwind CSS.",
        "Integrated frontend components with backend microservices and APIs for real-time data handling and workflow automation.",
      ],
      technologies: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "REST APIs",
        "Microservices Integration",
      ],
    },
    {
      company: "SpeedUp Infotech",
      role: "Full-Stack Development Trainee (Training — Not Employment)",
      type: "Training",
      period: "2025 – Before March 2026",
      location: "Pune, Maharashtra, India",
      summary:
        "Intensive hands-on Full-Stack Development training program (duration ≤ 8 months) focused on backend engineering, relational & NoSQL databases, caching, and ORMs.",
      highlights: [
        "Trained in backend API architecture using Node.js, Express.js, and RESTful API design patterns.",
        "Worked extensively with PostgreSQL, MySQL, SQL, MongoDB, and Redis caching.",
        "Built data models and type-safe queries using Prisma ORM and Drizzle ORM.",
      ],
      technologies: [
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Prisma ORM",
        "Drizzle ORM",
        "REST APIs",
      ],
    },
    {
      company: "NerdTech Software Company",
      role: "Frontend Development Intern",
      type: "Internship",
      period: "November 2023 – May 2024",
      location: "Nashik, Maharashtra, India",
      summary:
        "Frontend engineering internship focused on building responsive product pages and reusable UI components.",
      highlights: [
        "Developed responsive user interfaces for 5+ product pages using React.js, Next.js, Tailwind CSS, and Bootstrap.",
        "Improved application performance by ~20% through code optimization and reusable component design.",
        "Collaborated with backend developers and designers to deliver production-ready features.",
      ],
      technologies: [
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "Bootstrap",
        "JavaScript",
      ],
    },
  ],
  contact: {
    email: "kshitij.vijay.pawar@gmail.com",
    phone: "+91 8149661601",
    portfolio: "https://kshitij-pawar.is-a.dev",
    github: "https://github.com/Kshitij-Vijay-Pawar",
    location: "Pune, Maharashtra, India",
  },
  verifiedSkills: {
    frontend: [
      "React.js & Next.js (App Router, Server Actions)",
      "TypeScript & JavaScript (ES6+)",
      "Tailwind CSS, Bootstrap & Radix UI",
      "Redux Toolkit, Zustand & Context API",
      "GSAP Animations, React Native (Expo) & Electron",
    ],
    backend: [
      "Node.js & Express.js (RESTful APIs & MVC)",
      "PHP & Laravel",
      "BullMQ & Redis (Asynchronous Job Queues & Workers)",
      "JWT Auth, bcryptjs, Clerk & Stripe Webhooks",
    ],
    database: [
      "PostgreSQL, MySQL & SQL",
      "MongoDB & Mongoose",
      "Prisma ORM & Drizzle ORM",
      "Redis (Caching & Queue Backing)",
    ],
    creative3d: [
      "Google Gemini API (@google/generative-ai)",
      "Anthropic Claude API (Structured Analysis)",
      "Playwright, Puppeteer & Cheerio (Browser Automation & Crawling)",
    ],
    tools: [
      "Git, GitHub, Docker & Linux",
      "Bun, Vite, Postman & Vercel",
      "Languages: JavaScript, TypeScript, Python, C, C++, C#",
    ],
  },
  philosophies: [
    {
      num: "01",
      title: "Asynchronous Reliability",
      desc: "Long-running work like browser scraping, SEO crawls, and PDF generation belongs in resilient BullMQ + Redis worker pipelines—keeping HTTP APIs fast and responsive.",
    },
    {
      num: "02",
      title: "Type-Safe Data Modeling",
      desc: "Clean TypeScript contracts paired with relational PostgreSQL schemas via Drizzle ORM and Prisma prevent runtime surprises and keep full-stack codebases maintainable.",
    },
    {
      num: "03",
      title: "Responsive Product Craft",
      desc: "From multi-channel AI sales workflows to gamified learning interfaces, every screen is built with accessible primitives, clean component boundaries, and smooth motion.",
    },
    {
      num: "04",
      title: "Practical AI Integration",
      desc: "Integrating LLMs like Google Gemini and Anthropic Claude where they add real product value—structured SEO auditing, interactive grammar coaching, and automated workflows.",
    },
  ],
};
