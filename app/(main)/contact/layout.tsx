import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Contact Kshitij Pawar | Full-Stack Developer",
  description:
    "Contact Kshitij Pawar in Nashik, India for full-stack engineering roles, React/Next.js apps, and Node.js backend work.",
  path: "/contact",
  keywords: [
    "Contact Kshitij Pawar",
    "Hire Full-Stack Developer Nashik",
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

