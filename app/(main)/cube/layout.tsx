import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { constructMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "3D Rubik's Cube & Kociemba Solver | Kshitij Pawar",
  description:
    "Interactive 3D Rubik's Cube playground built with Three.js, React Three Fiber, and a Kociemba Two-Phase Web Worker solver.",
  path: "/cube",
  keywords: [
    "3D Rubik's Cube Three.js",
    "React Three Fiber Rubik's Cube",
    "Kociemba Two-Phase Solver Web Worker",
    "Interactive 3D WebGL Portfolio",
  ],
});

export default function CubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "3D Rubik's Cube", path: "/cube" },
        ])}
      />
      {children}
    </>
  );
}

