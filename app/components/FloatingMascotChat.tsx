"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Send,
  Square,
  X,
  Maximize2,
  Bot,
  Terminal,
  PlusCircle,
  Loader2,
} from "lucide-react";
import Mascot, { MascotRef } from "@/app/components/Mascot";
import { MascotFeeling } from "@/lib/ai/schema";
import { useChat } from "@/app/context/ChatContext";
import ChatMessageBubble from "@/app/(main)/ai/components/ChatMessageBubble";

export default function FloatingMascotChat() {
  const pathname = usePathname();
  const router = useRouter();

  // If already on the dedicated /ai page, don't show the duplicate floating trigger
  const isAiPage = pathname === "/ai";

  const [isOpen, setIsOpen] = useState(false);

  const mascotRef = useRef<MascotRef>(null);
  const floatingMascotRef = useRef<MascotRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isOpen]);

  // Synchronize feeling with both mascot component instances (floating orb and open modal)
  useEffect(() => {
    const applyFeeling = (feeling: MascotFeeling) => {
      const targetRef = isOpen ? mascotRef.current : floatingMascotRef.current;
      if (!targetRef) return;

      switch (feeling) {
        case "Happy":
          targetRef.happy();
          break;
        case "Feisty":
          targetRef.angry();
          break;
        case "Surprise":
          targetRef.surprise();
          break;
        case "Double Blink":
          targetRef.doubleBlink();
          break;
        default:
          targetRef.normal();
          break;
      }
    };

    // Apply current feeling immediately on change or modal open
    applyFeeling(activeFeeling);

    // Register listener for reactive feeling changes
    const unregister = registerMascotFeelingHandler(applyFeeling);
    return unregister;
  }, [isOpen, activeFeeling, registerMascotFeelingHandler]);

  const handleNavigateFullscreen = () => {
    setIsOpen(false);
    router.push("/ai");
  };

  if (isAiPage) {
    return null;
  }

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING TRIGGER (Bottom Right)                          */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-auto">
        {/* Mascot Floating Orb Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Companion" : "Open AI Companion"}
          data-cursor="interactive"
          className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full to-neutral-100 hover:border-neutral-900 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-visible"
        >
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-1 rounded-full animate-pulse pointer-events-none" />

          {/* Eye-tracking Mascot Ref */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <Mascot
              ref={floatingMascotRef}
              sizeClassName="w-12 h-12 sm:w-14 sm:h-14"
              className="drop-shadow-xs pointer-events-none hover:shadow-2xl"
            />
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* BACKDROP OVERLAY (Subtle black & blur)                   */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
          aria-hidden="true"
        />
      )}

      {/* ========================================================= */}
      {/* FLOATING AI CHAT MODAL DIALOG                            */}
      {/* ========================================================= */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-28 sm:right-6 z-50 w-full sm:w-[420px] md:w-[460px] h-full sm:h-[620px] max-h-screen sm:max-h-[85vh] flex flex-col bg-white sm:rounded-3xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Modal Header */}
          <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    KSHITIJ AI COMPANION
                  </h3>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Grounded in verified portfolio engineering
                </p>
              </div>
            </div>

            {/* Action Buttons: Fullscreen, New Chat & Close */}
            <div className="flex items-center gap-1.5">
              {/* Fullscreen / Navigate to /ai page button */}
              <button
                onClick={handleNavigateFullscreen}
                title="Open full-screen AI experience (/ai)"
                data-cursor="interactive"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Full screen AI page"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Reset/New Chat */}
              <button
                onClick={startNewConversation}
                title="New chat session"
                data-cursor="interactive"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                aria-label="New chat"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              {/* Close Modal */}
              <button
                onClick={() => setIsOpen(false)}
                data-cursor="interactive"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans bg-[#fafaf9]">
            {isLoadingHistory ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-neutral-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#f03e2f]" />
                <span>Restoring conversation history...</span>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))
            )}

            {/* Thinking status */}
            {isThinking && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white border border-neutral-200 text-xs font-mono text-neutral-500 flex items-center gap-2 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#f03e2f] animate-ping" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
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
              <div className="flex-1 flex items-center px-3 py-2 rounded-xl bg-neutral-100/90 border border-neutral-200 focus-within:border-neutral-900 focus-within:bg-white transition-all">
                <Terminal className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  maxLength={400}
                  disabled={isThinking}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isThinking
                      ? "AI is responding... (click Stop to cancel)"
                      : "Ask a question (max 400 chars)..."
                  }
                  className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium disabled:opacity-60"
                />
              </div>

              {isThinking ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  data-cursor="interactive"
                  className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer shadow-xs flex items-center justify-center"
                  aria-label="Stop generation"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  data-cursor="interactive"
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white transition-all disabled:opacity-40 cursor-pointer shadow-xs flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
