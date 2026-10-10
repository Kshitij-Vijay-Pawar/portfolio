import { NextResponse } from "next/server";
import { ai, geminiModel } from "@/lib/ai/gemini";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { geminiResponseSchema } from "@/lib/ai/response-schema";
import { validateAndFormatResponse, createSafeFallbackResponse } from "@/lib/ai/validate-response";
import { AIErrorPayload } from "@/lib/ai/schema";
import { checkRateLimit, getClientIp } from "@/lib/ai/rate-limiter";
import { sanitizeInput } from "@/lib/ai/sanitize-input";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "portfolio-ai-api",
    model: geminiModel,
    timestamp: new Date().toISOString(),
  });
}

interface IncomingHistoryItem {
  role?: string;
  text?: string;
}

export async function POST(req: Request) {
  // 1. IP Rate Limiting Guard
  const clientIp = getClientIp(req);
  const rateLimitStatus = checkRateLimit(clientIp);

  if (!rateLimitStatus.allowed) {
    const errorPayload: AIErrorPayload = {
      error: "Too many requests. Please wait a moment before sending another message.",
      code: "RATE_LIMITED",
    };
    return NextResponse.json(errorPayload, {
      status: 429,
      headers: {
        "Retry-After": Math.ceil(rateLimitStatus.resetMs / 1000).toString(),
      },
    });
  }

  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    const errorPayload: AIErrorPayload = {
      error: "Invalid JSON in request body",
      code: "INVALID_INPUT",
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const { message, history } = (rawBody as { message?: unknown; history?: unknown }) || {};

  // 2. Input Validation & Sanitation: Strip zero-width chars, cap 400 characters
  const sanitized = sanitizeInput(message);
  if (!sanitized.isValid) {
    const errorPayload: AIErrorPayload = {
      error: sanitized.errorMessage || "Invalid input message.",
      code: "INVALID_INPUT",
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const trimmedMessage = sanitized.sanitized;

  // 2. Untrusted History Validation: Max 10 items, structure check, cap text at 400 chars each
  const validatedHistory: Array<{ role: "user" | "model"; text: string }> = [];
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-10) as IncomingHistoryItem[];
    for (const item of recentHistory) {
      if (item && typeof item === "object") {
        const itemRole = item.role === "model" ? "model" : "user";
        const itemText = typeof item.text === "string" ? item.text.trim().slice(0, 400) : "";
        if (itemText) {
          validatedHistory.push({ role: itemRole, text: itemText });
        }
      }
    }
  }

  // 3. Assemble Gemini Contents
  // Map client history into Gemini content turns
  const contents = validatedHistory.map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }));

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: trimmedMessage }],
  });

  // 4. Request Gemini structured output
  try {
    const systemInstruction = buildSystemPrompt();

    // Generate content with resilient 1-shot retry on transient 503 spikes
    let response;
    try {
      response = await ai.models.generateContent({
        model: geminiModel,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: geminiResponseSchema,
          temperature: 0.7,
        },
      });
    } catch (genErr: unknown) {
      const errStr = genErr instanceof Error ? genErr.message : String(genErr);
      if (errStr.includes("503") || errStr.toLowerCase().includes("unavailable")) {
        // Wait 1.2s and retry once
        await new Promise((resolve) => setTimeout(resolve, 1200));
        response = await ai.models.generateContent({
          model: geminiModel,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: geminiResponseSchema,
            temperature: 0.7,
          },
        });
      } else {
        throw genErr;
      }
    }

    const responseText = response.text?.trim() || "";

    if (!responseText) {
      console.warn("Gemini returned empty text response, applying safe fallback");
      const fallback = createSafeFallbackResponse(trimmedMessage);
      return NextResponse.json(fallback, { status: 200 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn("Failed to parse Gemini JSON output:", parseErr, "Raw output:", responseText);
      const fallback = createSafeFallbackResponse(trimmedMessage);
      return NextResponse.json(fallback, { status: 200 });
    }

    const validatedPayload = validateAndFormatResponse(parsedJson, trimmedMessage);
    return NextResponse.json(validatedPayload, { status: 200 });
  } catch (error: unknown) {
    console.error("Gemini API Error in route handler:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const lowerError = errorMessage.toLowerCase();

    // Distinguish quota/rate limits
    if (lowerError.includes("429") || lowerError.includes("quota") || lowerError.includes("resource_exhausted")) {
      const errorPayload: AIErrorPayload = {
        error: "AI service quota temporarily exceeded. Please try again shortly.",
        code: "QUOTA_EXCEEDED",
      };
      return NextResponse.json(errorPayload, { status: 429 });
    }

    // Distinguish timeouts
    if (lowerError.includes("timeout") || lowerError.includes("deadline")) {
      const errorPayload: AIErrorPayload = {
        error: "AI request timed out. Please try again.",
        code: "API_TIMEOUT",
      };
      return NextResponse.json(errorPayload, { status: 504 });
    }

    // General Service Error
    const errorPayload: AIErrorPayload = {
      error: "AI service encountered an internal error. Please try again.",
      code: "SERVICE_ERROR",
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }
}
