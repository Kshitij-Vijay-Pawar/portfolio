"use client";

import React, { useState } from "react";
import { Bot, User, Copy, Check, AlertCircle, RefreshCw } from "lucide-react";
import ActionRenderer from "./ActionRenderer";
import { MascotFeeling, AIAction } from "@/lib/ai/schema";

export interface ChatBubbleMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  feeling?: MascotFeeling;
  actions?: AIAction[];
  timestamp: string;
  isStreaming?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

interface ChatMessageBubbleProps {
  message: ChatBubbleMessage;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isAi = message.sender === "ai";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
      {/* Avatar */}
      {isAi && (
        <div
          className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${
            message.isError ? "bg-amber-600" : "bg-[#f03e2f]"
          }`}
        >
          {message.isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
          isAi
            ? message.isError
              ? "bg-amber-50/90 border border-amber-200 text-amber-900 shadow-2xs"
              : "bg-neutral-50 border border-neutral-200/90 text-neutral-800 shadow-2xs"
            : "bg-neutral-900 text-white rounded-br-none shadow-xs"
        }`}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-1.5 text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-neutral-500">
              {isAi ? "MASCOT COMPANION" : "YOU"}
            </span>
            {message.feeling && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-700 font-mono text-[9px] uppercase">
                {message.feeling}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>{message.timestamp}</span>
            {isAi && !message.isStreaming && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy response"
                data-cursor="interactive"
                className="hover:text-neutral-800 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Message Text Content */}
        <div className="whitespace-pre-line font-normal leading-relaxed">
          {message.text}
          {message.isStreaming && (
            <span className="inline-block w-1.5 h-3.5 bg-[#f03e2f] ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Retry Button if error */}
        {message.isError && message.onRetry && (
          <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center justify-end">
            <button
              type="button"
              onClick={message.onRetry}
              data-cursor="interactive"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 text-xs font-mono transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Deterministic Action Buttons */}
        {!message.isStreaming && message.actions && message.actions.length > 0 && (
          <ActionRenderer actions={message.actions} />
        )}
      </div>

      {!isAi && (
        <div className="w-7 h-7 rounded-lg bg-neutral-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
