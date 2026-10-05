"use client";

import React, { useState, useRef, useEffect } from "react";
import Mascot, { MascotRef } from "@/app/components/Mascot";
import { MascotEmotion } from "@/app/context/NavContext";
import {
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  Smile,
  Flame,
  Eye,
  Terminal,
  ArrowDown,
  ArrowUpRight,
  Lightbulb,
  Cpu,
  Code2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  emotion?: MascotEmotion;
  timestamp: string;
  isStreaming?: boolean;
}

const PRESET_PROMPTS = [
  {
    label: "🚀 Top Skills & Stack",
    query: "What are Kshitij's core engineering skills and tech stack?",
    emotion: "happy" as MascotEmotion,
    response:
      "Kshitij specializes in high-performance frontend architecture and creative engineering:\n\n• **Core Stack:** Next.js 15, React 19, TypeScript, TailwindCSS\n• **Motion & Creative:** GSAP (ScrollTrigger, Flip, MorphSVG), Framer Motion, Three.js, Canvas & SVG state machines\n• **Fullstack & Tools:** Node.js, REST APIs, WebSockets, Git, Turbopack\n• **Design Philosophy:** 60fps butter-smooth micro-interactions, Swiss minimalism, typography-first layouts.",
  },
  {
    label: "💼 Featured Projects",
    query: "Can you tell me about the featured projects in this portfolio?",
    emotion: "surprise" as MascotEmotion,
    response:
      "Here are some of the standout works in the portfolio:\n\n1. **Cinematic Portfolio Experience:** Custom 60fps eye-tracking mascot, dynamic layered stair navigation, and interactive 3D Globe.\n2. **Interactive Motion Systems:** Physics-based custom cursor, scroll-driven camera zooms, and modular transition pipelines.\n3. **Modern Web Applications:** Fullstack Next.js platforms built for speed, accessibility, and high conversion.\n\nHead over to the **/projects** page to inspect live interactive demos!",
  },
  {
    label: "👀 How Mascot Works",
    query: "How does the Mascot's eye tracking and emotion system work?",
    emotion: "doubleBlink" as MascotEmotion,
    response:
      "I'm powered by a custom React + SVG state machine! Here's how it works under the hood:\n\n• **60fps Eye Tracking:** Uses `requestAnimationFrame` and linear interpolation (`lerp`) to track the cursor with silky organic pupil lag.\n• **Emotion Engine:** Morphable SVG eye geometries for `happy` (curved arcs), `surprise` (expanded pupils), `angry` (angled brows), and `doubleBlink` (dual eyelid compressions).\n• **Zero Layout Shift:** Fully vector-scaled with clean viewBox coordinates.",
  },
  {
    label: "🔥 Roast the Portfolio",
    query: "Give me a playful roast of this portfolio!",
    emotion: "angry" as MascotEmotion,
    response:
      "Oh, you want a roast? 🔥\n\n'Look at me, I have a red mascot with 60fps eye tracking, bespoke GSAP stair transitions, and an obsession with Swiss typography because regular scrollbars are too mainstream!'\n\n...Just kidding! But seriously, if you find a smoother portfolio today, let me know so I can get mad at it! 😈",
  },
  {
    label: "📫 Is Kshitij available to hire?",
    query: "Is Kshitij currently open for full-time or freelance work?",
    emotion: "happy" as MascotEmotion,
    response:
      "Yes! Kshitij is actively open for:\n\n• **Full-time Frontend / Design Engineering Roles**\n• **Freelance & High-Impact Creative Projects**\n• **Technical & Ambitious Collaborations**\n\nFeel free to hop over to the **/contact** page or email directly at **kshitij.vijay.pawar@gmail.com**!",
  },
];

const EMOTION_SOUNDBOARD = [
  { emotion: "happy" as MascotEmotion, label: "Happy", icon: Smile, color: "text-emerald-600 border-emerald-200 bg-emerald-50/70" },
  { emotion: "surprise" as MascotEmotion, label: "Surprise", icon: Zap, color: "text-amber-600 border-amber-200 bg-amber-50/70" },
  { emotion: "angry" as MascotEmotion, label: "Feisty", icon: Flame, color: "text-red-600 border-red-200 bg-red-50/70" },
  { emotion: "doubleBlink" as MascotEmotion, label: "Double Blink", icon: Eye, color: "text-blue-600 border-blue-200 bg-blue-50/70" },
  { emotion: "normal" as MascotEmotion, label: "Normal", icon: RefreshCw, color: "text-neutral-700 border-neutral-200 bg-white" },
];

export default function AIPage() {
  const mascotRef = useRef<MascotRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [activeEmotion, setActiveEmotion] = useState<MascotEmotion>("happy");
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-ai",
      sender: "ai",
      text: "Hey! I'm the **AI Mascot** & digital companion for Kshitij's portfolio. I react dynamically to conversations and emotions. \n\nAsk me anything about Kshitij's engineering, projects, or click one of the quick starters below!",
      emotion: "happy",
      timestamp: "Just now",
    },
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Apply emotion on mascot
  const triggerEmotion = (emotion: MascotEmotion) => {
    setActiveEmotion(emotion);
    if (!mascotRef.current) return;
    switch (emotion) {
      case "happy":
        mascotRef.current.happy();
        break;
      case "surprise":
        mascotRef.current.surprise();
        break;
      case "angry":
        mascotRef.current.angry();
        break;
      case "doubleBlink":
        mascotRef.current.doubleBlink();
        break;
      case "normal":
      default:
        mascotRef.current.normal();
        break;
    }
  };

  // Simulated AI response generator with typewriter stream effect
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || isThinking) return;

    // 1. Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    // Mascot enters "surprise / thinking" phase
    triggerEmotion("surprise");

    // Match preset or generate contextual intelligent answer
    const matchedPreset = PRESET_PROMPTS.find(
      (p) => p.query.toLowerCase() === text.toLowerCase() || p.label.toLowerCase().includes(text.toLowerCase())
    );

    let targetResponse = "";
    let targetEmotion: MascotEmotion = "happy";

    if (matchedPreset) {
      targetResponse = matchedPreset.response;
      targetEmotion = matchedPreset.emotion;
    } else {
      const lower = text.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        targetResponse = "Hello there! Great to meet you. Ask me about Kshitij's work, design systems, or tech stack!";
        targetEmotion = "happy";
      } else if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("framework")) {
        targetResponse = "Kshitij works with **Next.js, TypeScript, React, GSAP, TailwindCSS**, and modern web architectures with a strong focus on fluid interactive UI.";
        targetEmotion = "happy";
      } else if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
        targetResponse = "Kshitij has built creative web applications, cinematic scroll experiences, and high-performance interactive interfaces. Check out the **/projects** tab for deep dives!";
        targetEmotion = "surprise";
      } else if (lower.includes("roast") || lower.includes("bad") || lower.includes("hate") || lower.includes("mad")) {
        targetResponse = "Hey now! Don't make me angry! 😠 Just kidding — I'm built to handle any challenge with style!";
        targetEmotion = "angry";
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("reach")) {
        targetResponse = "You can reach Kshitij directly at **kshitij.vijay.pawar@gmail.com** or through the **/contact** page. He's currently available for exciting opportunities!";
        targetEmotion = "happy";
      } else {
        targetResponse = `Great question! As an interactive AI prototype, I'm tuned to showcase Kshitij's portfolio capabilities. You asked: "${text}". \n\nFeel free to explore the interactive prompt chips or test my facial expressions using the mood matrix!`;
        targetEmotion = "happy";
      }
    }

    // 2. Stream typewriter response
    setTimeout(() => {
      const aiMsgId = `ai-${Date.now()}`;
      const newAiMessage: Message = {
        id: aiMsgId,
        sender: "ai",
        text: "",
        emotion: targetEmotion,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, newAiMessage]);
      setIsThinking(false);

      // Trigger final emotion
      triggerEmotion(targetEmotion);

      // Stream text chunk by chunk
      let currentIndex = 0;
      const chunkSize = 3;
      const interval = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= targetResponse.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: targetResponse, isStreaming: false } : msg
            )
          );
        } else {
          const currentSub = targetResponse.slice(0, currentIndex);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: currentSub } : msg
            )
          );
        }
      }, 15);
    }, 650);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `initial-${Date.now()}`,
        sender: "ai",
        text: "Chat cleared! How else can I help you explore Kshitij's portfolio?",
        emotion: "happy",
        timestamp: "Just now",
      },
    ]);
    triggerEmotion("happy");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between pt-16 sm:pt-20 lg:pt-14 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 font-sans select-none">
      {/* 1. Background Grid & Architecture Layer (White aesthetic matching Contact & Home) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-pattern opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />

        {/* Subtle Cross-lines */}
        <div className="absolute top-20 left-0 w-full h-[1px] bg-neutral-200/60" />
        <div className="absolute bottom-14 left-0 w-full h-[1px] bg-neutral-200/60" />
        <div className="absolute top-0 left-12 md:left-20 w-[1px] h-full bg-neutral-200/50" />
        <div className="absolute top-0 right-12 md:right-20 w-[1px] h-full bg-neutral-200/50" />

        {/* Ambient Radial Glow Behind Mascot pedestal */}
        <div className="absolute top-1/4 right-1/3 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-red-100/30 via-orange-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Header Technical Metadata */}
      <div className="relative z-20 w-full flex items-center justify-between pointer-events-none mb-3 sm:mb-4 lg:mb-2">
        <div className="hidden md:flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">NODE</span>
          <span className="font-mono text-xs font-semibold text-neutral-800 tracking-wider">
            [AI_MASCOT_CORE // V2.4]
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400">STATUS</span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE // READY</span>
          </div>
        </div>
      </div>

      {/* 3. Main Central Studio Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center my-auto py-2">

        {/* Top Headline + Live Mascot Core Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center mb-4 sm:mb-5">

          {/* Left Column: Bold Headline & Intro */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="w-2 h-2 rounded-full bg-[#f03e2f] inline-block" />
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
                04 // NEURAL AI LAB
              </span>
            </div>

            <h1 className="text-[clamp(2.2rem,4.8vw,4.2rem)] font-black uppercase tracking-[-0.04em] leading-[0.9] text-neutral-950">
              INTELLIGENT<br />
              COMPANION<span className="text-[#f03e2f]">.</span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-light max-w-xl leading-relaxed">
              Experience the reactive AI Mascot engine. Interact, ask about Kshitij&apos;s projects, or trigger real-time emotional state machines.
            </p>
          </div>

          {/* Right Column: Live Interactive Mascot Stage */}
          <div className="lg:col-span-5 flex items-center justify-start lg:justify-end gap-5 sm:gap-8">
            <div className="relative flex flex-col items-center shrink-0 p-2">
              {/* Elliptical Orbit Ring */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-neutral-300/80 pointer-events-none transform -rotate-12 scale-y-50" />
              <div className="absolute -top-1.5 right-6 w-2 h-2 rounded-full bg-[#f03e2f] animate-ping" />

              {/* Interactive Mascot Component */}
              <Mascot
                ref={mascotRef}
                emotion={activeEmotion}
                sizeClassName="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
                className="drop-shadow-md"
                onClick={() => {
                  triggerEmotion("happy");
                }}
              />

              {/* Current Emotion Live Indicator Badge */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/90 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f03e2f]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
                  MOOD: <span className="font-bold text-neutral-900">{activeEmotion.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Quick Mood Soundboard / Reaction Buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mb-0.5">
                EXPRESSIONS
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {EMOTION_SOUNDBOARD.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeEmotion === item.emotion;
                  return (
                    <button
                      key={item.emotion}
                      onClick={() => triggerEmotion(item.emotion)}
                      data-cursor="interactive"
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${isCurrent
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-xs font-semibold scale-105"
                          : "border-neutral-200 bg-white/80 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                        }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Interactive AI Conversation & Capabilities Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch pt-3 sm:pt-4 border-t border-neutral-200/80">

          {/* Left Column: Quick Starters & AI Capabilities Badges */}
          <div className="lg:col-span-4 flex flex-col gap-3">

            {/* Quick Prompt Starters */}
            <div className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f03e2f]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 font-bold">
                    PROMPT STARTERS
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400">CLICK TO ASK</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.query)}
                    data-cursor="interactive"
                    className="text-left px-3 py-2 rounded-xl bg-neutral-50/80 hover:bg-neutral-900 hover:text-white border border-neutral-200/60 hover:border-neutral-900 transition-all text-xs font-medium text-neutral-800 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">{prompt.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Architecture Overview Pills */}
            <div className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 font-bold">
                  AI ARCHITECTURE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-600">
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">ENGINE</span>
                  <span className="font-semibold text-neutral-900">SVG LERP 60FPS</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">STREAMING</span>
                  <span className="font-semibold text-neutral-900">CHUNKED BUFFER</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">REACTION</span>
                  <span className="font-semibold text-neutral-900">STATE HARNESS</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 flex flex-col">
                  <span className="text-neutral-400 text-[9px]">LATENCY</span>
                  <span className="font-semibold text-emerald-600">&lt; 15MS FLUID</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Chat Stream Terminal */}
          <div className="lg:col-span-8 flex flex-col h-[460px] sm:h-[490px] rounded-2xl bg-white border border-neutral-200/90 shadow-sm overflow-hidden">

            {/* Terminal Top Bar */}
            <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>
                <span className="text-xs font-mono font-semibold text-neutral-700 ml-2">
                  mascot-neural-chat.sh
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  data-cursor="interactive"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors text-xs flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline text-[10px]">CLEAR</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Stream Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans"
            >
              {messages.map((msg) => {
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"
                      }`}
                  >
                    {isAi && (
                      <div className="w-7 h-7 rounded-lg bg-[#f03e2f] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${isAi
                          ? "bg-neutral-50 border border-neutral-200/90 text-neutral-800 shadow-2xs"
                          : "bg-neutral-900 text-white rounded-br-none shadow-xs"
                        }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] font-mono text-neutral-400">
                        <span className="font-semibold text-neutral-500">
                          {isAi ? "MASCOT AI" : "YOU"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span>{msg.timestamp}</span>
                          {isAi && (
                            <button
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              title="Copy text"
                              data-cursor="interactive"
                              className="hover:text-neutral-800 transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content with whitespace formatting */}
                      <div className="whitespace-pre-line font-normal">
                        {msg.text}
                        {msg.isStreaming && (
                          <span className="inline-block w-1.5 h-3.5 bg-[#f03e2f] ml-1 animate-pulse" />
                        )}
                      </div>
                    </div>

                    {!isAi && (
                      <div className="w-7 h-7 rounded-lg bg-neutral-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#f03e2f] text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-xs font-mono text-neutral-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f03e2f] animate-ping" />
                    <span>Neural Mascot is processing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-neutral-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 focus-within:border-neutral-900 focus-within:bg-white transition-all">
                  <Terminal className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything or enter a custom prompt..."
                    className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isThinking}
                  data-cursor="interactive"
                  className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                >
                  <span>SEND</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* 4. Bottom Footer Metadata Detail */}
      <div className="relative z-10 w-full flex items-center justify-between text-neutral-400 text-xs font-mono pt-1 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center">
            <ArrowDown className="w-2.5 h-2.5 text-neutral-600 animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-500">
            KSHITIJ // AI LAB INTERACTION
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-neutral-400 hidden sm:inline-block">
          FRONTEND AI PROTOTYPE // REACT 19 & NEXT.JS
        </span>
      </div>

    </div>
  );
}
