"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Terminal, 
  Bug, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  LifeBuoy,
  FileTerminal,
  Activity
} from "lucide-react";
import ArchitecturalBackground from "@/app/components/ui/ArchitecturalBackground";
import TechText from "@/app/components/ui/TechText";
import Mascot from "@/app/components/Mascot";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [copied, setCopied] = useState(false);
  const [rebooting, setRebooting] = useState(false);
  const [systemUptime, setSystemUptime] = useState("00:00:00");

  useEffect(() => {
    // Log exception to dev console
    console.error("Critical Exception caught by Boundary:", error);
    
    // Simulate real time ticker
    const timer = setInterval(() => {
      const now = new Date();
      setSystemUptime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [error]);

  const handleReboot = () => {
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      reset();
    }, 800);
  };

  const handleCopyCrashDump = () => {
    const crashReport = `ERROR_EXCEPTION: ${error?.message || "Unknown Runtime Failure"}\nDIGEST: ${error?.digest || "NONE"}\nTIMESTAMP: ${new Date().toISOString()}\nAGENT: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}`;
    navigator.clipboard.writeText(crashReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-black overflow-hidden flex flex-col justify-between selection:bg-[#ff4d4f] selection:text-white font-sans">
      {/* Architectural Blueprint Background */}
      <ArchitecturalBackground dotOpacity={0.8} showGridLines glowVariant="center" />

      {/* Top Red Diagnostic Alert Header */}
      <header className="relative z-20 w-full border-b border-red-200/80 bg-red-50/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold text-red-900 tracking-wider">
            KERNEL CRASH INTERCEPT // EXCEPTION_HANDLER
          </span>
          <span className="hidden sm:inline-block text-red-300">|</span>
          <span className="hidden sm:inline-block text-red-700">
            DIGEST: {error?.digest ? error.digest.slice(0, 12) : "SYS_ERR_500"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-red-800">
          <div className="hidden sm:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-red-600" />
            <span>LOCAL_TIME: {systemUptime}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-900 text-[10px] font-bold tracking-widest">
            STATE: RECOVERABLE
          </span>
        </div>
      </header>

      {/* Main Crash Stage */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-8">
        
        {/* Subtle Watermark Behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[180px] sm:h-[240px] pointer-events-none select-none opacity-20 z-0 flex items-center justify-center">
          <TechText
            text="CRASH"
            fontWeight={900}
            fontSize={220}
            color="#ef4444"
            accentColor="#b91c1c"
            specks={28}
            dashLength={6}
            dashGap={4}
            strokeWidth={1.5}
            reveal="letter"
            lineStyle="dashed"
            speed={1.2}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Disoriented Mascot Box */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group p-6 sm:p-8 rounded-3xl bg-white/85 border border-red-200 shadow-[0_20px_50px_rgba(239,68,68,0.08)] backdrop-blur-xl">
              
              {/* Technical Warning Corner Crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-600" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-600" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-600" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-600" />

              {/* Status pill */}
              <div className="absolute top-3 right-4 flex items-center gap-1.5 font-mono text-[10px] text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <span>OVERHEAT PROTECT</span>
              </div>

              {/* Angry / Distressed Mascot */}
              <div 
                className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105" 
                onClick={handleReboot}
                title="Click mascot to reboot runtime"
              >
                <Mascot
                  sizeClassName="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64"
                  emotion="angry"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
                <p className="font-mono text-xs text-neutral-700">
                  Unit <span className="font-semibold text-red-600">BOT-01</span> triggered emergency failsafe.
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Click mascot or trigger recovery below.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Error Telemetry, Crash Dump & Recovery Controls */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-white text-xs font-mono font-medium shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>UNHANDLED EXECUTION FAULT</span>
              <span className="text-red-500">/</span>
              <span className="text-red-400">500</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
                Quantum Glitch in The Memory Pipeline.
              </h1>
              <p className="mt-3 text-base sm:text-lg text-neutral-600 font-normal max-w-xl leading-relaxed">
                An unexpected condition breached our client boundary. The engine safely caught the anomaly to prevent data corruption.
              </p>
            </div>

            {/* Technical Crash Dump Terminal */}
            <div className="w-full rounded-2xl bg-neutral-950 text-neutral-100 p-4 font-mono text-xs shadow-2xl border border-red-950/60">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-neutral-400 text-[11px]">telemetry@crash-dump-inspector</span>
                </div>
                <button
                  onClick={handleCopyCrashDump}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[10px] text-neutral-300 transition-colors"
                >
                  <FileTerminal className="w-3 h-3 text-[#D3FD50]" />
                  <span>{copied ? "COPIED" : "COPY DUMP"}</span>
                </button>
              </div>

              {/* Stack Trace / Exception Message */}
              <div className="space-y-1 text-[11px] text-neutral-300 overflow-x-auto p-2 bg-neutral-900/60 rounded-lg border border-neutral-800/80">
                <div className="text-red-400 font-bold">
                  FATAL: {error?.message || "Render pipeline execution error."}
                </div>
                {error?.digest && (
                  <div className="text-neutral-500">
                    DIGEST_ID: <span className="text-neutral-300">{error.digest}</span>
                  </div>
                )}
                <div className="text-neutral-500">
                  RECOVERY_PROCEDURE: Reset React Fiber subtree via Hot Reboot.
                </div>
              </div>
            </div>

            {/* Recovery Action Triggers */}
            <div className="w-full pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleReboot}
                disabled={rebooting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-all hover:scale-[1.02] shadow-md group disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${rebooting ? "animate-spin" : "group-hover:-rotate-45 transition-transform"}`} />
                <span>{rebooting ? "Rebooting Core..." : "Initiate Quantum Reboot"}</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-neutral-300 text-neutral-800 font-medium text-sm hover:bg-neutral-50 hover:border-neutral-400 transition-all hover:scale-[1.02] shadow-sm"
              >
                <Home className="w-4 h-4 text-neutral-600" />
                <span>Safe Mode (Home)</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-neutral-600 hover:text-neutral-950 text-sm font-medium transition-colors"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Report Telemetry</span>
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Technical Bar */}
      <footer className="relative z-20 w-full border-t border-neutral-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-red-500" />
            ENGINE: NEXT.JS APP ROUTER BOUNDARY
          </span>
          <span className="hidden md:inline-block text-neutral-300">•</span>
          <span className="hidden md:inline-block">AUTO_FAILOVER: ACTIVE</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-600">
          <Link href="/" className="hover:text-neutral-950 transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-neutral-950 transition-colors">PROJECTS</Link>
          <span>/</span>
          <Link href="/contact" className="hover:text-neutral-950 transition-colors">CONTACT</Link>
        </div>
      </footer>
    </div>
  );
}
