import type { Metadata } from "next";
import AnimatedTypewriter from "@/app/components/AnimatedTypewriter/AnimatedTypewriter";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Component Sandbox",
  path: "/test",
  noIndex: true,
});

export default function TestPage() {
  const sampleStrings = ["Creating thoughtful digital experiences."];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-8">
      <AnimatedTypewriter strings={sampleStrings} />
    </div>
  );
}