import HeroSection from "../components/HeroSection";
import ScrollReveal from "../components/ui/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* 1. Modern Hero Section */}
      <HeroSection />

      {/* 2. Scroll Narrative Statement Section */}
      <section className="relative w-full py-32 sm:py-40 px-6 sm:px-12 md:px-20 max-w-6xl mx-auto flex flex-col justify-center items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 bg-white/70 text-xs font-mono uppercase tracking-widest text-neutral-600">
          Philosophy
        </div>

        <ScrollReveal
          baseOpacity={0.08}
          enableBlur
          baseRotation={2}
          blurStrength={5}
          textClassName="text-[clamp(1.8rem,4.5vw,3.8rem)] font-extrabold tracking-tight text-neutral-900 leading-[1.25]"
        >
          When does a man die? When he is hit by a bullet? No! When he suffers a
          disease? No! When he ate a soup made out of a poisonous mushroom? No!
          A man dies when he is forgotten!
        </ScrollReveal>

        <div className="mt-12 flex items-center gap-3 text-neutral-400 font-mono text-xs tracking-wider">
          <span className="w-10 h-[1px] bg-neutral-300" />
          <span>DR. HILULUK • ONE PIECE</span>
          <span className="w-10 h-[1px] bg-neutral-300" />
        </div>
      </section>
    </main>
  );
}