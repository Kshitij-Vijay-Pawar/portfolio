"use client";

import React, { useRef, useEffect } from "react";
import Mascot, { MascotRef } from "@/app/components/Mascot";
import {
  Sparkles,
  Send,
  Square,
  PlusCircle,
  Bot,
  Terminal,
  ArrowDown,
  ArrowUpRight,
  Database,
  Lock,
  Loader2,
} from "lucide-react";
import ChatMessageBubble from "./components/ChatMessageBubble";
import { MascotFeeling } from "@/lib/ai/schema";
import { useChat } from "@/app/context/ChatContext";

const PRESET_PROMPTS = [
  {
    label: "🚀 Tech Stack & Engineering",
    query: "What are Kshitij's core engineering skills and tech stack?",
  },
  {
    label: "💼 Featured Projects",
    query: "Can you tell me about the featured projects in this portfolio?",
  },
  {
    label: "📄 Download Resume",
    query: "Where can I download Kshitij's resume?",
  },
  {
    label: "🔥 Roast the Portfolio",
    query: "Give me a playful, witty roast of this portfolio!",
  },
  {
    label: "📫 Is Kshitij available to hire?",
    query: "Is Kshitij currently open for full-time or freelance engineering work?",
  },
  {
    label: "🎨 3D & WebGL Shaders",
    query: "How are 3D WebGL shaders and 60fps animations engineered here?",
  },
];

export default function AIPage() {
  const mascotRef = useRef<MascotRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Consume shared persistent global chat context
  const {
    messages,
    isThinking,
    activeFeeling,
    isLoadingHistory,
    inputValue,
    setInputValue,
    sendMessage,
    stopGeneration,
    startNewConversation,
    registerMascotFeelingHandler,
  } = useChat();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Synchronize Mascot feelings with MascotRef imperative methods
  useEffect(() => {
    const applyFeeling = (feeling: MascotFeeling) => {
      if (!mascotRef.current) return;

      switch (feeling) {
        case "Happy":
          mascotRef.current.happy();
          break;
        case "Feisty":
          mascotRef.current.angry(); // Maps Feisty to angry brows
          break;
        case "Surprise":
          mascotRef.current.surprise();
          break;
        case "Double Blink":
          mascotRef.current.doubleBlink(); // Auto-settles to normal
          break;
        default:
          mascotRef.current.normal();
          break;
      }
    };

    // Apply active feeling immediately
    applyFeeling(activeFeeling);

    // Register listener for reactive feeling changes
    const unregister = registerMascotFeelingHandler(applyFeeling);
    return unregister;
  }, [activeFeeling, registerMascotFeelingHandler]);

  return (
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 pt-28 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 selection:bg-[#ff4400] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background Architectural Ambient Grid Lines */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
        <div className="absolute top-0 left-8 sm:left-14 w-[1px] h-full bg-neutral-200/50" />
        <div className="absolute top-0 right-8 sm:right-14 w-[1px] h-full bg-neutral-200/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* ========================================================
            TOP SECTION: HERO BANNER & 60FPS REACTIVE MASCOT STAGE
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-xs">
          {/* Left Column: Title & Description */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f03e2f] animate-pulse" />
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
                04 // NEURAL AI LAB
              </span>
            </div>

            <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] font-black uppercase tracking-[-0.04em] leading-[0.92] text-neutral-950">
              INTELLIGENT<br />
              COMPANION<span className="text-[#f03e2f]">.</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light max-w-xl leading-relaxed">
              Meet Kshitij&apos;s digital AI companion. Grounded in verified engineering data, synchronized with the reactive 60fps Mascot expression engine, and saved locally in your browser.
            </p>
          </div>

          {/* Right Column: Live Interactive Mascot Stage */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5">
            <div className="relative flex flex-col items-center shrink-0 p-4 rounded-3xl">
              {/* Interactive Mascot Component */}
              <Mascot
                ref={mascotRef}
                sizeClassName="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44"
                className="drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM SECTION: INTERACTIVE AI CHAT & STARTERS
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Quick Starters & Local Persistence Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Quick Prompt Starters */}
            <div className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f03e2f]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-800 font-bold">
                    PROMPT STARTERS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400">CLICK TO SEND</span>
              </div>

              <div className="flex flex-col gap-2">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={isThinking}
                    onClick={() => sendMessage(prompt.query)}
                    data-cursor="interactive"
                    className="text-left px-3.5 py-2.5 rounded-2xl bg-neutral-50/90 hover:bg-neutral-950 hover:text-white border border-neutral-200/80 hover:border-neutral-950 transition-all text-xs font-medium text-neutral-800 flex items-center justify-between group cursor-pointer shadow-2xs disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span className="truncate pr-2">{prompt.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Local Privacy & Storage Notice */}
            <div className="p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#f03e2f]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-800 font-bold">
                    LOCAL PERSISTENCE
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-neutral-500">
                  <Lock className="w-2.5 h-2.5" />
                  CLIENT STORAGE
                </span>
              </div>

              <p className="text-[11px] text-neutral-600 leading-relaxed font-light">
                Conversations are saved indefinitely in your browser&apos;s IndexedDB. No conversations are stored on external chat servers.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-700 pt-1">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">STORAGE ENGINE</span>
                  <span className="font-semibold text-neutral-950">INDEXED_DB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">RETENTION POLICY</span>
                  <span className="font-semibold text-neutral-950">INDEFINITE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Conversation Terminal */}
          <div className="lg:col-span-8 flex flex-col h-[520px] sm:h-[560px] rounded-3xl bg-white border border-neutral-200/90 shadow-sm overflow-hidden">
            {/* Terminal Top Bar */}
            <div className="px-5 py-3.5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>
                <span className="text-xs font-mono font-bold text-neutral-200 ml-2">
                  mascot-companion-terminal.sh
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Non-destructive New Chat button */}
                <button
                  onClick={startNewConversation}
                  title="Start a new chat session (preserves past conversations in storage)"
                  data-cursor="interactive"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">NEW CHAT</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Stream Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 font-sans bg-[#fafaf9]"
            >
              {isLoadingHistory ? (
                <div className="h-full flex items-center justify-center text-xs font-mono text-neutral-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#f03e2f]" />
                  <span>Loading conversation history...</span>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessageBubble key={msg.id} message={msg} />
                ))
              )}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/90 text-xs font-mono text-neutral-600 flex items-center gap-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#f03e2f] animate-ping" />
                    <span>Synthesizing response & expressions...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t border-neutral-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isThinking) {
                    stopGeneration();
                  } else {
                    sendMessage();
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center px-4 py-3 rounded-2xl bg-neutral-100/90 border border-neutral-200 focus-within:border-neutral-900 focus-within:bg-white transition-all">
                  <Terminal className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={inputValue}
                    maxLength={400}
                    disabled={isThinking}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      isThinking
                        ? "AI is responding... (click Stop to cancel)"
                        : "Ask anything about Kshitij, projects, or code architecture (max 400 chars)..."
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium disabled:opacity-60"
                  />
                </div>

                {isThinking ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    data-cursor="interactive"
                    className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    title="Stop generating"
                    aria-label="Stop generation"
                  >
                    <span>STOP</span>
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    data-cursor="interactive"
                    className="px-5 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-xs"
                    aria-label="Send message"
                  >
                    <span>SEND</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Metadata Detail */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-neutral-400 text-xs font-mono pt-8 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center">
            <ArrowDown className="w-2.5 h-2.5 text-neutral-600 animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-500">
            KSHITIJ // AI LAB INTERACTION
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-neutral-400 hidden sm:inline-block">
          INDEXED_DB PERSISTENT // STRICT ZERO AUTO-DELETION
        </span>
      </div>
    </div>
  );
}
