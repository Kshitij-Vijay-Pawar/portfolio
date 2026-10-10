import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_GOOGLE_API_KEY || "";

if (!apiKey) {
  console.warn("⚠️ Warning: Neither GEMINI_API_KEY nor NEXT_GOOGLE_API_KEY is defined in environment.");
}

export const geminiModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";

/**
 * Server-only GoogleGenAI client singleton.
 * Never expose this client or API keys to the browser.
 */
export const ai = new GoogleGenAI({
  apiKey,
});
