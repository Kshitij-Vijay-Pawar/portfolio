'use client';

import React from 'react';
import { MoveNotation } from '@/lib/cube/cube-moves';

export interface PlaybackControlsProps {
  solutionMoves: MoveNotation[];
  currentStepIndex: number; // Number of solution moves already completed (0..solutionMoves.length)
  isPlaying: boolean;
  isAnimating: boolean;
  speedMs: number;
  onPlayPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSpeedChange: (speedMs: number) => void;
  activeMove: MoveNotation | null;
  lastScramble: string;
}

const SPEED_PRESETS: Array<{ label: string; ms: number }> = [
  { label: '0.5×', ms: 550 },
  { label: '1×', ms: 300 },
  { label: '2×', ms: 160 },
  { label: '4×', ms: 85 },
];

export default function PlaybackControls({
  solutionMoves,
  currentStepIndex,
  isPlaying,
  isAnimating,
  speedMs,
  onPlayPause,
  onNextStep,
  onPrevStep,
  onSpeedChange,
  activeMove,
  lastScramble,
}: PlaybackControlsProps) {
  const hasSolution = solutionMoves.length > 0;
  const totalSteps = solutionMoves.length;
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStepIndex / totalSteps) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md">
      {/* Header & Active Move Indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Solution Playback
          </span>
          <span className="text-xs text-zinc-500">
            {hasSolution
              ? `Step ${currentStepIndex} of ${totalSteps} (${progressPercent}%)`
              : 'Click "Solve" to calculate optimal Kociemba solution'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            Current Move:
          </span>
          <span
            className={`inline-flex h-8 min-w-10 items-center justify-center rounded-lg border px-2 font-mono text-sm font-bold transition ${
              activeMove
                ? 'border-[#ff5500]/40 bg-[#ff5500]/10 text-[#ff5500]'
                : 'border-zinc-200 bg-zinc-100 text-zinc-400'
            }`}
          >
            {activeMove ?? '—'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-[#ff5500] transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Transport Controls (Prev / Play-Pause / Next) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={!hasSolution || isPlaying || isAnimating || currentStepIndex <= 0}
            title="Previous move (Step backward)"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            disabled={
              !hasSolution ||
              (!isPlaying && currentStepIndex >= totalSteps)
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#ff5500] px-4 text-sm font-medium text-white shadow-xs transition hover:bg-[#e04b00] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Play
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={
              !hasSolution ||
              isPlaying ||
              isAnimating ||
              currentStepIndex >= totalSteps
            }
            title="Next move (Step forward)"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Animation Speed Control */}
        <div className="flex flex-col gap-1 sm:items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              Speed ({speedMs}ms/turn)
            </span>
            <div className="flex items-center gap-1">
              {SPEED_PRESETS.map((preset) => {
                const isSelected = Math.abs(speedMs - preset.ms) < 25;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSpeedChange(preset.ms)}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
          <input
            type="range"
            min={60}
            max={700}
            step={10}
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            aria-label="Animation duration in milliseconds"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-[#ff5500] sm:w-44"
          />
        </div>
      </div>

      {/* Solution Notation Display */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Solution Move Notation
        </span>
        {hasSolution ? (
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-2.5">
            {solutionMoves.map((move, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <span
                  key={`${move}_${idx}`}
                  className={`inline-flex h-7 min-w-8 items-center justify-center rounded-md px-2 font-mono text-xs font-semibold transition ${
                    isCurrent
                      ? 'bg-[#ff5500] text-white shadow-xs ring-2 ring-[#ff5500]/40'
                      : isCompleted
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : 'bg-white text-zinc-700 ring-1 ring-zinc-200'
                  }`}
                >
                  {move}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-xs text-zinc-400">
            No active solution sequence. Scramble or rotate faces, then press Solve.
          </div>
        )}
      </div>

      {/* Scramble Notation Reference */}
      {lastScramble && (
        <div className="flex flex-col gap-1 border-t border-zinc-100 pt-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Last Scramble Applied
          </span>
          <p className="font-mono text-xs text-zinc-600">
            {lastScramble}
          </p>
        </div>
      )}
    </div>
  );
}

