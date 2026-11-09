'use client';

import React from 'react';
import {
  BASIC_FACES,
  FaceName,
  MoveNotation,
} from '@/lib/cube/cube-moves';

export interface CubeControlsProps {
  onMove: (move: MoveNotation) => void;
  onScramble: () => void;
  onSolve: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isSolved: boolean;
  isSolving: boolean;
  isAnimating: boolean;
  solverReady: boolean;
}

const FACE_BADGE_COLORS: Record<FaceName, string> = {
  U: 'bg-white text-zinc-900 border-zinc-300',
  D: 'bg-amber-400 text-zinc-950 border-amber-500',
  R: 'bg-red-600 text-white border-red-700',
  L: 'bg-orange-500 text-white border-orange-600',
  F: 'bg-emerald-600 text-white border-emerald-700',
  B: 'bg-blue-600 text-white border-blue-700',
};

const FACE_LABELS: Record<FaceName, string> = {
  U: 'Up',
  D: 'Down',
  L: 'Left',
  R: 'Right',
  F: 'Front',
  B: 'Back',
};

export default function CubeControls({
  onMove,
  onScramble,
  onSolve,
  onReset,
  onUndo,
  canUndo,
  isSolved,
  isSolving,
  solverReady,
}: CubeControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md">
      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Actions
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <span
              className={`h-2 w-2 rounded-full ${
                solverReady
                  ? 'bg-emerald-500'
                  : 'animate-pulse bg-amber-400'
              }`}
            />
            {solverReady ? 'Kociemba Solver Ready' : 'Initializing Solver…'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={onScramble}
            disabled={isSolving}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            Scramble
          </button>

          <button
            type="button"
            onClick={onSolve}
            disabled={isSolved || isSolving}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#ff5500] px-3.5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#e04b00] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            {isSolving ? 'Solving…' : 'Solve'}
          </button>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo || isSolving}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
            Undo
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSolving}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Face Rotation Controls (U, D, L, R, F, B + Prime + Double) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Manual Face Rotations
          </span>
          <span className="text-[11px] text-zinc-400">
            Or drag directly on cube faces
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BASIC_FACES.map((face) => {
            const cw = face as MoveNotation;
            const ccw = `${face}'` as MoveNotation;
            const dbl = `${face}2` as MoveNotation;

            return (
              <div
                key={face}
                className="flex flex-col gap-1.5 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-2"
              >
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-xs font-medium text-zinc-600">
                    {FACE_LABELS[face]}
                  </span>
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] font-bold ${FACE_BADGE_COLORS[face]}`}
                  >
                    {face}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => onMove(cw)}
                    disabled={isSolving}
                    title={`${FACE_LABELS[face]} clockwise (${cw})`}
                    className="rounded-lg bg-white py-1.5 font-mono text-xs font-semibold text-zinc-800 shadow-2xs ring-1 ring-zinc-200/80 transition hover:bg-zinc-100 active:scale-95 disabled:opacity-40"
                  >
                    {cw}
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(ccw)}
                    disabled={isSolving}
                    title={`${FACE_LABELS[face]} counter-clockwise (${ccw})`}
                    className="rounded-lg bg-white py-1.5 font-mono text-xs font-semibold text-zinc-800 shadow-2xs ring-1 ring-zinc-200/80 transition hover:bg-zinc-100 active:scale-95 disabled:opacity-40"
                  >
                    {ccw}
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(dbl)}
                    disabled={isSolving}
                    title={`${FACE_LABELS[face]} 180° double turn (${dbl})`}
                    className="rounded-lg bg-white py-1.5 font-mono text-xs font-semibold text-zinc-800 shadow-2xs ring-1 ring-zinc-200/80 transition hover:bg-zinc-100 active:scale-95 disabled:opacity-40"
                  >
                    {dbl}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

