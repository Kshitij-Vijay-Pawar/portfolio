# Kshitij Pawar — Creative Technologist & Portfolio AI Companion

A modern, high-performance portfolio featuring an authentic personalized AI companion, interactive 60fps Mascot expression engine, WebGL/Three.js showcases, and persistent local chat architecture.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router with Turbopack), React 19
- **Runtime & Package Manager:** Bun
- **Styling & Motion:** Tailwind CSS v4, GSAP 3.15 (`ScrollTrigger`, `Timelines`), Three.js / WebGL, Motion
- **AI Companion:** Google Gemini API (`@google/genai`), server-side structured output with Zod
- **Client Storage:** Dexie (IndexedDB wrapper) with strict zero-automatic deletion

---

## 🛠️ Environment Configuration

Create a `.env` file in the root directory:

```bash
# Google Gemini API Key (Server-only — do NOT expose via NEXT_PUBLIC_*)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Gemini model identifier (defaults to "gemini-2.5-flash")
GEMINI_MODEL=gemini-2.5-flash

# Contact form integration
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key_here
```

> **Security Note:** `GEMINI_API_KEY` is loaded strictly on the server within `/app/api/ai/route.ts` and is never bundled into client scripts.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run local development server:**
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

3. **Build for production:**
   ```bash
   bun run build
   ```

---

## 🤖 Personalized AI Companion Architecture

1. **Next.js Route Handler (`/api/ai`):**
   - Input sanitization (strips zero-width characters, max 400 characters).
   - In-memory sliding-window IP rate limiting safeguard (15 req/min).
   - Validates client history turns as untrusted inputs (bounded to last 10 messages).
   - Structured JSON output enforced via Gemini schema.
   - Separation of failures: HTTP 429 (`QUOTA_EXCEEDED`), HTTP 504 (`API_TIMEOUT`), HTTP 400 (`INVALID_INPUT`), HTTP 500 (`SERVICE_ERROR`).

2. **Deterministic Action Resolver (`lib/ai/action-resolver.ts`):**
   - `navigate`: Internal static routes allowlisted (`/`, `/about`, `/projects`, `/contact`, `/ai`).
   - `show_project`: Dynamically opens verified project slugs (`codenarts`, `az-digital`, `amron`, `chatone`, `finance`).
   - `download_resume`: Deterministically locked to `/resume/Kshitij_Resume.pdf`.
   - `open_url`: Enforces HTTPS and hostname allowlist (`github.com`, `linkedin.com`).

3. **Persistent Local Chat (IndexedDB via Dexie):**
   - Full conversation history is stored locally in the visitor's browser.
   - **Zero automatic deletion:** No TTL, no max stored message caps, and no LRU eviction.
   - **No in-app deletion UI:** Eliminates accidental deletion. Users inspect or clear via browser DevTools.
   - **New Chat:** Spawns a fresh session while keeping all prior conversations safely in IndexedDB.

4. **Production Deployment Requirements:**
   - Production hosting must support Next.js Route Handlers with Node or Edge server execution (e.g. Vercel, Node server).
   - Static GitHub Pages exports cannot execute `/api/ai`.
