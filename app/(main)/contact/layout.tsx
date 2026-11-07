import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Contact Kshitij Pawar | Hire Full-Stack Developer in Pune, India",
  description:
    "Get in touch with Kshitij Pawar for full-stack software engineering roles, React/Next.js web applications, Node.js/PostgreSQL backend work, or freelance collaborations.",
  path: "/contact",
  keywords: [
    "Contact Kshitij Pawar",
    "Hire Full-Stack Developer Pune",
    "Hire Next.js Developer India",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      {children}
    </>
  );
}

