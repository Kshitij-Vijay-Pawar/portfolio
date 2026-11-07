import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "AI Portfolio Companion | Ask About Kshitij Pawar's Work & Skills",
  description:
    "Interactive AI Mascot Companion grounded on Kshitij Pawar's verified engineering experience, projects, technical stack, and resume.",
  path: "/ai",
  keywords: [
    "Kshitij Pawar AI Assistant",
    "Interactive Developer Portfolio AI",
    "Google Gemini Portfolio Chatbot",
  ],
});

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Companion", path: "/ai" },
        ])}
      />
      {children}
    </>
  );
}

