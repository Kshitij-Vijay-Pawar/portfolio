'use client';

import React, { useRef, useState } from 'react';
import RubiksCube, {
  RubiksCubeRef,
} from '@/app/components/cube/rubiks-cube/RubiksCube';
import type { MoveNotation } from '@/lib/cube/cube-moves';
import ArchitecturalBackground from '@/app/components/ui/ArchitecturalBackground';

const PRESET_SCRAMBLES: Array<{ name: string; notation: string }> = [
  {
    name: 'Superflip (20f*)',
    notation: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
  },
  {
    name: 'Checkerboard Pattern',
    notation: 'U2 D2 F2 B2 L2 R2',
  },
  {
    name: 'Cube in a Cube',
    notation: "F L F U' R U F2 L2 U' L' B D' B' L2 U",
  },
  {
    name: 'Sexy Move × 3',
    notation: "R U R' U' R U R' U' R U R' U'",
  },
];

export default function CubePage() {
  const cubeRef = useRef<RubiksCubeRef | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [cubeScale, setCubeScale] = useState(1);
  const [solveCount, setSolveCount] = useState(0);
  const [recentEvents, setRecentEvents] = useState<string[]>([
    'Initialized 26-cubie procedural 3D Rubik’s Cube & Kociemba solver worker.',
  ]);

  const logEvent = (msg: string) => {
    setRecentEvents((prev) => [msg, ...prev.slice(0, 5)]);
  };

  const handleMoveComplete = (move: MoveNotation, solved: boolean) => {
    logEvent(
      `Move ${move} completed → ${solved ? 'Cube is SOLVED!' : 'State synchronized'}`
    );
  };

  const handleSolved = () => {
    setSolveCount((c) => c + 1);
  };

  const applyPreset = (name: string, notation: string) => {
    if (!cubeRef.current) return;
    cubeRef.current.reset();
    cubeRef.current.move(notation);
    logEvent(`Queued preset "${name}": ${notation}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#fafaf9] pt-24 pb-16 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white sm:pt-28 lg:pt-32">
      {/* Portfolio Architectural Background Layer */}
      <ArchitecturalBackground dotOpacity={0.65} glowVariant="subtle" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16">
        {/* Top Page Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200/80 pb-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff5500]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                INTERACTIVE 3D PLAYGROUND • KOCIEMBA TWO-PHASE SOLVER
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 grid-cols-2 gap-0.5 rounded-xl bg-zinc-900 p-1.5 shadow-sm">
                <span className="rounded-xs bg-red-500" />
                <span className="rounded-xs bg-blue-500" />
                <span className="rounded-xs bg-amber-400" />
                <span className="rounded-xs bg-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                  3D Rubik&apos;s Cube &amp; Solver
                </h1>
                <p className="text-xs text-zinc-500 sm:text-sm">
                  Reusable Three.js + React Three Fiber + Kociemba Two-Phase Web Worker Solver
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs shadow-2xs backdrop-blur-md">
              <span className="text-zinc-500">Scale:</span>
              {[0.85, 1, 1.15].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setCubeScale(sz)}
                  className={`rounded-md px-2 py-0.5 font-mono font-medium transition ${
                    cubeScale === sz
                      ? 'bg-[#ff5500] text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {sz}×
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowControls((v) => !v)}
              className="rounded-xl border border-zinc-200 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs backdrop-blur-md transition hover:bg-zinc-100"
            >
              {showControls ? 'Hide Built-in Controls' : 'Show Built-in Controls'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Reusable <RubiksCube /> Component Instance */}
          <section aria-label="Interactive 3D Rubik's Cube">
            <RubiksCube
              ref={cubeRef}
              cubeSize={cubeScale}
              showControls={showControls}
              onMoveComplete={handleMoveComplete}
              onSolved={handleSolved}
            />
          </section>

          {/* Preset Algorithms & Component Callback Inspector */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Famous Algorithms / Patterns */}
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-2xs backdrop-blur-md lg:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                  Preset Patterns &amp; Scrambles (Imperative Ref API Demo)
                </h2>
                <span className="text-xs text-zinc-400">
                  Click to apply via ref
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PRESET_SCRAMBLES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset.name, preset.notation)}
                    className="flex flex-col items-start gap-1 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 text-left transition hover:border-[#ff5500]/40 hover:bg-orange-50/30"
                  >
                    <span className="text-xs font-semibold text-zinc-800">
                      {preset.name}
                    </span>
                    <span className="line-clamp-1 font-mono text-[11px] text-zinc-500">
                      {preset.notation}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Callback Event Log & Architecture Info */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-2xs backdrop-blur-md lg:col-span-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                    Component Callback Telemetry
                  </h2>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Solved {solveCount} {solveCount === 1 ? 'time' : 'times'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 rounded-xl bg-zinc-50 p-3 font-mono text-xs text-zinc-600">
                  {recentEvents.map((ev, i) => (
                    <div
                      key={`${i}_${ev}`}
                      className={`truncate ${
                        i === 0
                          ? 'font-semibold text-zinc-900'
                          : 'opacity-75'
                      }`}
                    >
                      {i === 0 ? '▸ ' : '  '}
                      {ev}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-500">
                Renders 26 procedural hierarchical cubies with shared geometries and
                materials, synchronized with a background Kociemba Two-Phase Web Worker
                solver for zero-drift layer rotations.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

