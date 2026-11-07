import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import {
  constructMetadata,
  getBreadcrumbJsonLd,
  getProfilePageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About & Engineering Journey | Kshitij Pawar",
  description:
    "Full-Stack Developer in Nashik, India with experience at McFlyworld, Tvara, and NerdTech building web & AI systems.",
  path: "/about",
  type: "profile",
  keywords: [
    "About Kshitij Pawar",
    "McFlyworld Full-Stack Developer",
    "Tvara Frontend Developer",
    "NerdTech Intern",
    "Sandip Institute of Technology AI and Data Science",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          getProfilePageJsonLd("/about"),
          getBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About & Journey", path: "/about" },
          ]),
        ]}
      />
      {children}
    </>
  );
}

