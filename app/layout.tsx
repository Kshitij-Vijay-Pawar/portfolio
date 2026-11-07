import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomCursor from "@/app/components/CustomCursor";
import CookieConsent from "@/app/components/CookieConsent";
import CustomContextMenu from "@/app/components/CustomContextMenu";
import ClarityProvider from "@/app/components/ClarityProvider";
import JsonLd from "@/app/components/JsonLd";
import { NavProvider } from "@/app/context/NavContext";
import {
  constructMetadata,
  getPersonJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Kshitij Pawar | Full-Stack Developer",
    description:
      "Full-Stack Developer in Nashik, India building scalable React, Next.js, Node.js, PostgreSQL & BullMQ/Redis systems.",
    path: "/",
    type: "website",
  }),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        <JsonLd data={[getPersonJsonLd(), getWebSiteJsonLd()]} />
        <ClarityProvider />
        <NavProvider>
          <CustomCursor />
          <CustomContextMenu enabled={isCustomContextMenuEnabled} />
          {children}
          <CookieConsent />
        </NavProvider>
      </body>
    </html>
  );
}
