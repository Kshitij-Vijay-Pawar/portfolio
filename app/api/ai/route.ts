import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "portfolio-ai-api",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message } = body || {};

    return NextResponse.json({
      message: message
        ? `Received: "${message}". AI backend is online.`
        : "Hello! I am Kshitij's AI companion.",
      emotion: "happy",
      actions: [
        {
          type: "navigate",
          label: "View Projects",
          href: "/projects",
        },
      ],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Kshitij-Vijay-Pawar",
        },
      ],
      cv: {
        show: true,
        label: "Download CV",
        href: "/resume/Kshitij_Resume.pdf",
      },
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "AI request processing failed" },
      { status: 500 }
    );
  }
}
