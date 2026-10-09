"use client";

import React, { useState } from "react";
import Mascot from "@/app/components/Mascot";
import { Mail, ArrowUpRight, Check, Send } from "lucide-react";

export default function ContactPage() {
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setResult("Sending message...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setResult("Thank you! Your message has been sent successfully.");
        form.reset();
      } else {
        setStatus("error");
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setResult("Network error. Please try again later.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-16 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 font-sans">

      {/* 1. Background Grid & Dot Matrix Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-pattern opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />

        {/* Subtle Architectural Cross-lines for Technical Editorial Aesthetic */}
        <div className="absolute top-24 left-0 w-full h-[1px] bg-neutral-200/60" />
        <div className="absolute top-0 left-12 md:left-20 w-[1px] h-full bg-neutral-200/50" />
        <div className="absolute top-0 right-12 md:right-20 w-[1px] h-full bg-neutral-200/50" />

        {/* Soft Ambient Radial Glow Behind Mascot */}
        <div className="absolute top-1/3 right-1/4 w-[400px] sm:w-[550px] lg:w-[700px] h-[400px] sm:h-[550px] lg:h-[700px] bg-gradient-to-tr from-orange-100/40 via-red-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Header Content & Status Badge */}
      <div className="relative z-20 w-full flex items-center justify-between pb-6 mb-6 sm:mb-8 border-b border-neutral-200/80">
        {/* Left Sub-Header Detail */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
          <span className="font-mono text-xs text-neutral-400">LOC</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=43.978412,15.383477"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="font-mono text-xs font-semibold text-neutral-800 tracking-wider hover:opacity-75 transition-opacity"
          >
            [43.978412° N, 15.383477° E] &middot; PUNE, IN
          </a>
        </div>

        {/* Right Sub-Header Detail */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">STACK</span>
          <span className="font-mono text-xs font-semibold text-neutral-800 tracking-wider uppercase">
            NEXT.JS // GSAP // THREE
          </span>
        </div>
      </div>

      {/* 3. Central Canvas: Smooth natural flow with responsive layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center my-auto py-4 sm:py-8">

        {/* Top Section: Headline + Description + Mascot on Top Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-12">

          {/* Left Column: Big Headline */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] inline-block" />
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                06 // CONTACT
              </span>
            </div>

            <h1 className="text-[clamp(2.4rem,5.6vw,4.8rem)] font-black uppercase tracking-[-0.04em] leading-[0.92] text-neutral-950">
              LET’S BUILD<br />
              SOMETHING<br />
              GREAT<span className="text-[#ff5500]">.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-xl">
              Have a project in mind, a job opportunity, or just want to say hi? Send me a message below or reach out directly via email.
            </p>
          </div>

          {/* Right Column: Narrative Callout + Interactive Mascot */}
          <div className="lg:col-span-5 flex items-center justify-end gap-6 sm:gap-10 relative">
            {/* Mascot with orbit and cursor pupil tracking */}
            <div className="relative flex flex-col items-center shrink-0 pr-4 sm:pr-8">
              {/* Elliptical Orbit Ring */}
              <div className="absolute -inset-6 sm:-inset-8 rounded-full border border-neutral-300/70 pointer-events-none transform -rotate-12 scale-y-45" />
              <div className="absolute -top-2 right-4 w-2 h-2 rounded-full bg-[#ff5500]" />

              <Mascot
                sizeClassName="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48"
                className="drop-shadow-lg"
              />

              {/* Annotation labels */}
              <div className="absolute -right-6 -top-2 hidden md:flex flex-col text-[9px] font-mono uppercase tracking-wider text-neutral-400 rotate-6 leading-tight">
                <span>IDEAS</span>
                <span>COLLABORATIONS</span>
                <span>OPPORTUNITIES</span>
                <span>JUST HI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Form & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-8 border-t border-neutral-200/80">

          {/* Left Column: Social Badges */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-1">
              CONNECT &middot; DIRECT
            </span>

            {/* Email */}
            <a
              href="mailto:kshitij.vijay.pawar@gmail.com"
              data-cursor="interactive"
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">EMAIL</span>
                <span className="text-xs font-semibold text-neutral-800 truncate">kshitij.vijay.pawar@gmail.com</span>
              </div>
            </a>

            {/* Github */}
            <a
              href="https://github.com/Kshitij-Vijay-Pawar"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">GITHUB</span>
                <span className="text-xs font-semibold text-neutral-800">Kshitij-Vijay-Pawar</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">LINKEDIN</span>
                <span className="text-xs font-semibold text-neutral-800">Kshitij Pawar</span>
              </div>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-neutral-200/80 hover:border-neutral-900 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">TWITTER / X</span>
                <span className="text-xs font-semibold text-neutral-800">@kshitij_pawar</span>
              </div>
            </a>
          </div>

          {/* Center Column: Contact Form */}
          <div className="lg:col-span-6 flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
              SEND A MESSAGE
            </span>

            <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="flex flex-col px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-2xl focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                    <span>NAME</span>
                    <span className="text-[#ff5500] font-bold">*</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-2xl focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                    <span>EMAIL</span>
                    <span className="text-[#ff5500] font-bold">*</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-2xl focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all shadow-2xs">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">SUBJECT</span>
                <input
                  type="text"
                  name="subject"
                  placeholder="Project, Job Opportunity, Collaboration..."
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col px-3.5 py-2.5 bg-white border border-neutral-200/90 rounded-2xl focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all shadow-2xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                  <span>MESSAGE</span>
                  <span className="text-[#ff5500] font-bold">*</span>
                </div>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your idea or project..."
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                data-cursor="interactive"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#09090b] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-md"
              >
                <span>{status === "loading" ? "SENDING MESSAGE..." : "SEND MESSAGE"}</span>
                {status === "loading" ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Status Feedback Message */}
              {result && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono text-center transition-all ${
                    status === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : status === "error"
                        ? "bg-red-50 border border-red-200 text-red-800"
                        : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {result}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Availability & Based in */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-6">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  AVAILABILITY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950 leading-tight mb-4">
                Currently<br />Open to Work<span className="text-[#ff5500]">.</span>
              </h2>

              <ul className="flex flex-col gap-2 text-xs font-mono text-neutral-700">
                <li className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                  <span>Full-time Roles</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </li>
                <li className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                  <span>Freelance Projects</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </li>
                <li className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                  <span>Creative Tech Collabs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </li>
                <li className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                  <span>AI Applications</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </li>
              </ul>
            </div>

            {/* Location indicator */}
            <div className="p-4 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-2xs flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">BASED IN</span>
                <span className="text-xs font-semibold text-neutral-800">PUNE, MAHARASHTRA, INDIA</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
