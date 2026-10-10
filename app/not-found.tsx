"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Home, 
  Terminal, 
  RefreshCw, 
  Radio, 
  Zap, 
  Compass, 
  Search,
  Sparkles,
  Command,
  FileCode2,
  Cpu
} from "lucide-react";
import ArchitecturalBackground from "@/app/components/ui/ArchitecturalBackground";
import TechText from "@/app/components/ui/TechText";
import Mascot from "@/app/components/Mascot";

export default function NotFound() {
  const router = useRouter();
  const [coordinates, setCoordinates] = useState({ x: "0.00", y: "0.00" });
  const [glitchActive, setGlitchActive] = useState(false);
  const [diagnosticCode, setDiagnosticCode] = useState("HTTP_404_VOID_SECTOR");
  const [commandInput, setCommandInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "[SYSTEM] Deep space scanning initialized...",
    "[STATUS] Target coordinate unmapped in routing mesh.",
    "[ADVISORY] Re-route to authorized telemetry node.",
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = ((e.clientX / window.innerWidth) * 100).toFixed(2);
      const normY = ((e.clientY / window.innerHeight) * 100).toFixed(2);
      setCoordinates({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const triggerDiagnostic = () => {
    setGlitchActive(true);
    setDiagnosticCode("QUANTUM_REROUTE_ACTIVE");
    setTimeout(() => {
      setGlitchActive(false);
      setDiagnosticCode("HTTP_404_VOID_SECTOR");
    }, 1200);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "home" || cmd === "cd /") {
      router.push("/");
    } else if (cmd === "projects" || cmd === "work") {
      router.push("/projects");
    } else if (cmd === "about") {
      router.push("/about");
    } else if (cmd === "contact") {
      router.push("/contact");
    } else if (cmd === "clear") {
      setTerminalHistory([]);
    } else if (cmd === "help") {
      setTerminalHistory((prev) => [
        ...prev,
        `$ ${cmd}`,
        "Available commands: home, projects, about, contact, ping, clear",
      ]);
    } else if (cmd === "ping") {
      setTerminalHistory((prev) => [
        ...prev,
        `$ ${cmd}`,
        "PONG 64 bytes from sector_404: time=0.42ms [STABLE]",
      ]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        `$ ${cmd}`,
        `Command not recognized: '${cmd}'. Type 'help' or 'home'.`,
      ]);
    }
    setCommandInput("");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-black overflow-hidden flex flex-col justify-between selection:bg-[#D3FD50] selection:text-black font-sans">
      {/* Architectural Blueprint Background */}
      <ArchitecturalBackground dotOpacity={0.85} showGridLines glowVariant="center" />

      {/* Top Engineering Telemetry HUD Header */}
      <header className="relative z-20 w-full border-b border-neutral-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="font-semibold text-neutral-800 tracking-wider">
            ANOMALY DETECTED // 404
          </span>
          <span className="hidden sm:inline-block text-neutral-400">|</span>
          <span className="hidden sm:inline-block text-neutral-500">
            SECTOR: VOID_NULL
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-neutral-500">
          <div className="hidden md:flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-neutral-600 animate-pulse" />
            <span>GRID: X:{coordinates.x} Y:{coordinates.y}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] uppercase font-bold tracking-widest">
              {diagnosticCode}
            </span>
          </div>
        </div>
      </header>

      {/* Main Showcase Stage */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-8">
        
        {/* Subtle Watermark Layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[180px] sm:h-[240px] pointer-events-none select-none opacity-25 z-0 flex items-center justify-center">
          <TechText
            text="LOST"
            fontWeight={900}
            fontSize={220}
            color="#9ca3af"
            accentColor="#d1d5db"
            specks={24}
            dashLength={6}
            dashGap={4}
            strokeWidth={1.5}
            reveal="letter"
            lineStyle="dashed"
            speed={0.8}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Mascot & Dimension Breach Box */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group p-6 sm:p-8 rounded-3xl bg-white/80 border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              
              {/* Corner Crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-neutral-900" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-neutral-900" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-neutral-900" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-neutral-900" />

              {/* Status pill */}
              <div className="absolute top-3 right-4 flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>STATE: SURPRISED</span>
              </div>

              {/* The Interactive Mascot */}
              <div className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105" onClick={triggerDiagnostic}>
                <Mascot
                  sizeClassName="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64"
                  emotion={glitchActive ? "angry" : "surprise"}
                />
              </div>

              {/* Mascot Caption */}
              <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
                <p className="font-mono text-xs text-neutral-500">
                  Unit <span className="font-semibold text-neutral-800">BOT-01</span> couldn&apos;t trace that coordinate.
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Click the mascot to recalibrate sensors.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Typography, Technical Terminal & Navigation Routes */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D3FD50]" />
              <span>DIMENSIONAL ANOMALY</span>
              <span className="text-neutral-500">/</span>
              <span className="text-[#D3FD50]">404</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
                Coordinates Lost in The Digital Ether.
              </h1>
              <p className="mt-3 text-base sm:text-lg text-neutral-600 font-normal max-w-xl leading-relaxed">
                The URL you requested slipped into an unindexed dimension. All spatial blueprints have been queried with zero return hits.
              </p>
            </div>

            {/* Showcase Mini Terminal */}
            <div className="w-full rounded-2xl bg-neutral-950 text-neutral-100 p-4 font-mono text-xs shadow-2xl border border-neutral-800">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-neutral-400 text-[11px]">telemetry@kshitij-shell ~ sector_404</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <Terminal className="w-3 h-3 text-[#D3FD50]" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* History */}
              <div className="space-y-1 text-[11px] text-neutral-300 max-h-24 overflow-y-auto pr-1">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith("$") ? "text-[#D3FD50] font-semibold" : ""}>
                    {line}
                  </div>
                ))}
              </div>

              {/* Interactive Input */}
              <form onSubmit={handleCommandSubmit} className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                <span className="text-[#D3FD50] font-bold">&gt;</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="type 'home', 'projects', 'about', 'help'..."
                  className="flex-1 bg-transparent border-none outline-none text-neutral-100 placeholder-neutral-600 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-[#D3FD50] hover:text-black text-neutral-300 transition-colors text-[10px]"
                >
                  RUN
                </button>
              </form>
            </div>

            {/* Action Buttons & Fast Teleport Hub */}
            <div className="w-full pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 text-white font-medium text-sm hover:bg-neutral-800 transition-all hover:scale-[1.02] shadow-md group"
              >
                <Home className="w-4 h-4 text-[#D3FD50]" />
                <span>Return to Headquarters</span>
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-neutral-300/80 text-neutral-800 font-medium text-sm hover:bg-neutral-50 hover:border-neutral-400 transition-all hover:scale-[1.02] shadow-sm"
              >
                <FileCode2 className="w-4 h-4 text-neutral-500" />
                <span>Explore Showcase</span>
              </Link>

              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-neutral-600 hover:text-neutral-950 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Technical HUD Ticker */}
      <footer className="relative z-20 w-full border-t border-neutral-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-neutral-600" />
            CORE ARCHITECTURE: NEXT.JS // TURBOPACK
          </span>
          <span className="hidden md:inline-block text-neutral-300">•</span>
          <span className="hidden md:inline-block">STATUS: QUANTUM RESILIENT</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-600">
          <Link href="/about" className="hover:text-neutral-950 transition-colors">ABOUT</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-neutral-950 transition-colors">PROJECTS</Link>
          <span>/</span>
          <Link href="/contact" className="hover:text-neutral-950 transition-colors">CONTACT</Link>
        </div>
      </footer>
    </div>
  );
}
