import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomCursor from "@/app/components/CustomCursor";
import CookieConsent from "@/app/components/CookieConsent";
import CustomContextMenu from "@/app/components/CustomContextMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kshitij Pawar | Full-Stack Developer",
  description:
    "Portfolio of Kshitij Pawar — Full-Stack Developer in Pune, India building React, Next.js, TypeScript, Node.js, Express, PostgreSQL, and BullMQ/Redis systems.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawContextMenuFlag =
    process.env.NEXT_PUBLIC_CUSTOM_CONTEXT_MENU ??
    process.env.CUSTOM_CONTEXT_MENU ??
    "false";
  const isCustomContextMenuEnabled =
    rawContextMenuFlag.trim().toLowerCase() === "true";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <CustomContextMenu enabled={isCustomContextMenuEnabled} />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
