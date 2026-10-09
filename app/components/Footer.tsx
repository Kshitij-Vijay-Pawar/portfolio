"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe } from "./ui/Globe";
import Mascot from "@/app/components/Mascot";
import {
  Mail,
  MapPin,
  UserCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
} from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("kshitij.vijay.pawar@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#fafaf9] text-zinc-900 border-t border-neutral-200/90 pt-14 sm:pt-20 pb-10 px-5 sm:px-10 md:px-14 lg:px-16 selection:bg-[#ff4400] selection:text-white"
    >
      {/* Background Architectural Grid Lines & Dot Matrix */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
        <div className="absolute top-0 left-8 sm:left-14 w-[1px] h-full bg-neutral-200/50" />
        <div className="absolute top-0 right-8 sm:right-14 w-[1px] h-full bg-neutral-200/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">


        {/* ========================================================
            BOTTOM SECTION: 4-COLUMN FOOTER NAVIGATION & GLOBE
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-12 sm:py-16 items-start">

          {/* Col 1 (span 4): Brand K Logo, Description & Social Icons */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Logo K. */}
            <div className="flex items-baseline mb-4">
              <span className="text-4xl sm:text-5xl font-black text-neutral-950 font-sans tracking-tighter">
                K
              </span>
              <span className="w-3 h-3 rounded-full bg-[#ff4400] ml-0.5 inline-block" />
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-light max-w-sm mb-6">
              Building digital products, exploring new technologies, and turning ideas into real experiences.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-2.5">
              {/* GitHub */}
              <a
                href="https://github.com/Kshitij-Vijay-Pawar"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="interactive"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="interactive"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="interactive"
                aria-label="Twitter / X"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="interactive"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 (span 2): Navigation Links */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="inline-flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400]" />
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                NAVIGATION
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-sans text-neutral-700">
              <li>
                <Link href="/" className="hover:text-neutral-950 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-neutral-950 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-neutral-950 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 (span 2): Resources Links */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="inline-flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400]" />
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                RESOURCES
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-sans text-neutral-700">
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Kshitij-Vijay-Pawar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Now
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Uses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neutral-950 transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 (span 4): Contact Meta & Interactive 3D Globe with based in indicator */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-row gap-6 items-start justify-between">
            {/* Direct Connect details */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4400]" />
                <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                  LET&apos;S CONNECT
                </span>
              </div>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm font-sans text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a
                    href="mailto:kshitij.vijay.pawar@gmail.com"
                    className="hover:text-neutral-950 transition-colors font-mono text-xs"
                  >
                    kshitij.vijay.pawar@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Pune, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <UserCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Open to opportunities</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff4400] shrink-0" />
                  <span>Let&apos;s build something great!</span>
                </li>
              </ul>
            </div>

            {/* Interactive 3D Globe Display */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden flex items-center justify-center">
                <Globe className="scale-100" />
              </div>

              {/* Based in India / Working Globally text with arrow */}
              <div className="flex items-center justify-between gap-2 w-full pt-1 border-t border-neutral-200/80">
                <div className="flex flex-col text-[9px] font-mono uppercase tracking-wider text-neutral-500 leading-tight">
                  <span>BASED IN INDIA</span>
                  <span>WORKING GLOBALLY</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-600" />
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            SUB-FOOTER: COPYRIGHT & ATTRIBUTION
            ======================================================== */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-neutral-200/80 text-[11px] font-mono text-neutral-400 gap-3">
          <div>
            © 2026 Kshitij Pawar. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-neutral-300 hidden sm:block" />
            <span>Built with Next.js, GSAP &amp; lots of ☕</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
