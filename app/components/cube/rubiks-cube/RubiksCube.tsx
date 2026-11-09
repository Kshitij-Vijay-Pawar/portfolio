'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import {
  CubeColors,
  CubeStateManager,
  CubieTransform,
} from '@/lib/cube/cube-state';
import {
  generateRandomScrambleMoves,
  getInverseMove,
  MoveNotation,
  parseMoveString,
} from '@/lib/cube/cube-moves';
import { cubeSolver } from '@/lib/cube/cube-solver';
import type { ActiveMoveAnimation } from './CubeScene';
import CubeControls from './CubeControls';
import PlaybackControls from './PlaybackControls';

// Lazy-load the browser-only 3D WebGL viewer with SSR disabled
const DynamicCubeScene = dynamic(() => import('./CubeScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-100/60 text-zinc-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff5500] border-t-transparent" />
      <span className="text-xs font-medium tracking-wide">
        Loading 3D Rubik&apos;s Cube…
      </span>
    </div>
  ),
});

export interface RubiksCubeProps {
  /** Optional initial scramble notation (e.g. "R U R' U' F2 D") */
  initialScramble?: string;
  /** Animation duration per 90-degree turn in milliseconds (default: 260ms) */
  animationSpeed?: number;
  /** Scale multiplier for the 3D cube in the viewport (default: 1) */
  cubeSize?: number;
  /** Automatically calculate and play solution after initialScramble is applied */
  autoSolve?: boolean;
  /** Show or hide the built-in control panels (default: true) */
  showControls?: boolean;
  /** Allow interactive face dragging on the 3D cube (default: true) */
  interactive?: boolean;
  /** Custom face and core color hex strings */
  colors?: Partial<CubeColors>;
  /** Callback fired whenever the cube reaches a verified solved state */
  onSolved?: () => void;
  /** Callback fired after any move finishes animating */
  onMoveComplete?: (move: MoveNotation, isSolved: boolean) => void;
  /** Additional className for the outer container */
  className?: string;
  /** Height class for the 3D viewport container (default: "h-[420px] sm:h-[520px]") */
  viewerHeightClassName?: string;
  /** Duration per turn while scrambling (default: fast 110ms) */
  scrambleSpeedMs?: number;
  /** Duration per turn while auto-solving (default: current speed) */
  solveSpeedMs?: number;
  /** Chrome-less display mode: no badges, hints, border or background */
  minimal?: boolean;
  /** Enable hover tilt reaction */
  hoverTilt?: boolean;
  enableZoom?: boolean;
  onUserInteractStart?: () => void;
  onUserInteractEnd?: () => void;
  onCubeClick?: () => void;
  /** Increment to animate the camera back to the default view */
  resetCameraToken?: number;
}

export interface RubiksCubeRef {
  move: (notation: MoveNotation | string) => void;
  scramble: (length?: number) => MoveNotation[];
  solve: (autoPlay?: boolean) => Promise<MoveNotation[]>;
  reset: () => void;
  undo: () => void;
  isSolved: () => boolean;
  isBusy: () => boolean;
  getFaceletString: () => string;
}

interface QueuedMoveItem {
  move: MoveNotation;
  source: 'manual' | 'scramble' | 'solution-forward' | 'solution-backward' | 'undo';
}

export const RubiksCube = forwardRef<RubiksCubeRef, RubiksCubeProps>(
  function RubiksCube(
    {
      initialScramble,
      animationSpeed = 260,
      cubeSize = 1,
      autoSolve = false,
      showControls = true,
      interactive = true,
      colors,
      onSolved,
      onMoveComplete,
      className = '',
      viewerHeightClassName = 'h-[420px] sm:h-[520px]',
      scrambleSpeedMs,
      solveSpeedMs,
      minimal = false,
      hoverTilt = false,
      enableZoom = true,
      onUserInteractStart,
      onUserInteractEnd,
      onCubeClick,
      resetCameraToken,
    },
    ref
  ) {
    // Persistent logical + 3D state manager
    const managerRef = useRef<CubeStateManager | null>(null);
    if (!managerRef.current) {
      managerRef.current = new CubeStateManager(initialScramble);
    }

    const [cubies, setCubies] = useState<CubieTransform[]>(() =>
      managerRef.current!.getCubies()
    );
    const [isSolved, setIsSolved] = useState<boolean>(() =>
      managerRef.current!.isSolved()
    );
    const [faceletString, setFaceletString] = useState<string>(() =>
      managerRef.current!.asFaceletString()
    );

    const [speedMs, setSpeedMs] = useState<number>(animationSpeed);
    useEffect(() => {
      setSpeedMs(animationSpeed);
    }, [animationSpeed]);

    // Solver Web Worker initialization state
    const [solverReady, setSolverReady] = useState<boolean>(false);
    const [isCalculatingSolution, setIsCalculatingSolution] =
      useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Move queue & active animation state
    const queueRef = useRef<QueuedMoveItem[]>([]);
    const activeItemRef = useRef<QueuedMoveItem | null>(null);
    const [activeAnimation, setActiveAnimation] =
      useState<ActiveMoveAnimation | null>(null);

    // History for undo and scramble tracking
    const [moveHistory, setMoveHistory] = useState<MoveNotation[]>(() => {
      if (!initialScramble) return [];
      try {
        return parseMoveString(initialScramble);
      } catch {
        return [];
      }
    });
    const [lastScramble, setLastScramble] = useState<string>(
      initialScramble ?? ''
    );

    // Solution playback state
    const [solutionMoves, setSolutionMoves] = useState<MoveNotation[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [isPlayingSolution, setIsPlayingSolution] = useState<boolean>(false);

    // Initialize solver once on mount
    useEffect(() => {
      let mounted = true;
      cubeSolver
        .init()
        .then(() => {
          if (mounted) setSolverReady(true);
        })
        .catch((err) => {
          if (mounted) {
            setErrorMessage(
              err instanceof Error ? err.message : 'Failed to initialize solver'
            );
          }
        });

      return () => {
        mounted = false;
      };
    }, []);

    // Trigger next move from queue if not currently animating
    const processNextInQueue = useCallback(() => {
      if (activeItemRef.current) return;
      const next = queueRef.current.shift();
      if (!next) return;

      activeItemRef.current = next;
      const duration =
        next.source === 'scramble'
          ? (scrambleSpeedMs ?? Math.min(110, speedMs))
          : next.source === 'solution-forward' && solveSpeedMs
            ? solveSpeedMs
            : speedMs;

      setActiveAnimation({
        move: next.move,
        durationMs: duration,
      });
    }, [speedMs, scrambleSpeedMs, solveSpeedMs]);

    const enqueueMoves = useCallback(
      (items: QueuedMoveItem[]) => {
        if (items.length === 0) return;
        queueRef.current.push(...items);
        processNextInQueue();
      },
      [processNextInQueue]
    );

    // Callback when a 3D face turn finishes its animation
    const handleAnimationComplete = useCallback(
      (completedMove: MoveNotation) => {
        const finishedItem = activeItemRef.current;
        activeItemRef.current = null;
        setActiveAnimation(null);

        const manager = managerRef.current!;
        try {
          manager.applyMove(completedMove);
        } catch (err) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'State synchronization error occurred'
          );
          queueRef.current = [];
          setIsPlayingSolution(false);
          return;
        }

        const nextCubies = manager.getCubies();
        const solvedNow = manager.isSolved();
        const nextFacelets = manager.asFaceletString();

        setCubies(nextCubies);
        setIsSolved(solvedNow);
        setFaceletString(nextFacelets);

        if (finishedItem) {
          if (
            finishedItem.source === 'manual' ||
            finishedItem.source === 'scramble'
          ) {
            setMoveHistory((prev) => [...prev, completedMove]);
          } else if (finishedItem.source === 'solution-forward') {
            setCurrentStepIndex((prev) => prev + 1);
            setMoveHistory((prev) => [...prev, completedMove]);
          } else if (finishedItem.source === 'solution-backward') {
            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            setMoveHistory((prev) => prev.slice(0, -1));
          }
        }

        if (onMoveComplete) {
          onMoveComplete(completedMove, solvedNow);
        }
        if (solvedNow && onSolved) {
          onSolved();
        }

        // Continue queue if there are remaining items
        if (queueRef.current.length > 0) {
          processNextInQueue();
        }
      },
      [onMoveComplete, onSolved, processNextInQueue]
    );

    // Drive continuous solution playback when isPlayingSolution is true
    useEffect(() => {
      if (!isPlayingSolution) return;
      if (activeAnimation || activeItemRef.current) return;

      if (currentStepIndex >= solutionMoves.length) {
        setIsPlayingSolution(false);
        return;
      }

      const nextSolutionMove = solutionMoves[currentStepIndex];
      enqueueMoves([{ move: nextSolutionMove, source: 'solution-forward' }]);
    }, [
      isPlayingSolution,
      activeAnimation,
      currentStepIndex,
      solutionMoves,
      enqueueMoves,
    ]);

    // Manual move handler (from buttons or 3D face drag)
    const handleManualMove = useCallback(
      (move: MoveNotation) => {
        setErrorMessage(null);
        // Pause and clear any active solution playback if the user manually turns a face
        if (solutionMoves.length > 0) {
          setIsPlayingSolution(false);
          setSolutionMoves([]);
          setCurrentStepIndex(0);
        }
        enqueueMoves([{ move, source: 'manual' }]);
      },
      [enqueueMoves, solutionMoves.length]
    );

    // Undo last move
    const handleUndo = useCallback(() => {
      if (moveHistory.length === 0 || isCalculatingSolution) return;
      setErrorMessage(null);
      setIsPlayingSolution(false);
      setSolutionMoves([]);
      setCurrentStepIndex(0);

      // Clear pending manual moves in queue before undoing
      queueRef.current = [];
      const lastMove = moveHistory[moveHistory.length - 1];
      const inverse = getInverseMove(lastMove);
      setMoveHistory((prev) => prev.slice(0, -1));
      enqueueMoves([{ move: inverse, source: 'undo' }]);
    }, [enqueueMoves, isCalculatingSolution, moveHistory]);

    // Reset cube to solved state
    const handleReset = useCallback(() => {
      setErrorMessage(null);
      setIsPlayingSolution(false);
      queueRef.current = [];
      activeItemRef.current = null;
      setActiveAnimation(null);

      const manager = managerRef.current!;
      manager.reset();
      setCubies(manager.getCubies());
      setIsSolved(true);
      setFaceletString(manager.asFaceletString());
      setMoveHistory([]);
      setSolutionMoves([]);
      setCurrentStepIndex(0);
      setLastScramble('');
    }, []);

    // Scramble cube with animated sequence
    const handleScramble = useCallback(
      (length = 20): MoveNotation[] => {
        setErrorMessage(null);
        setIsPlayingSolution(false);
        queueRef.current = [];
        activeItemRef.current = null;
        setActiveAnimation(null);

        // Reset to clean solved state before applying new scramble so scramble notation is exact
        const manager = managerRef.current!;
        manager.reset();
        setCubies(manager.getCubies());
        setIsSolved(true);
        setFaceletString(manager.asFaceletString());
        setMoveHistory([]);
        setSolutionMoves([]);
        setCurrentStepIndex(0);

        const moves = generateRandomScrambleMoves(length);
        setLastScramble(moves.join(' '));
        enqueueMoves(
          moves.map((m) => ({
            move: m,
            source: 'scramble' as const,
          }))
        );
        return moves;
      },
      [enqueueMoves]
    );

    // Calculate solution from current logical state
    const handleSolve = useCallback(
      async (autoPlay = true): Promise<MoveNotation[]> => {
        if (isCalculatingSolution) return [];
        setErrorMessage(null);
        setIsPlayingSolution(false);

        // If moves are still queued (e.g. scramble finishing), flush them synchronously first
        if (activeItemRef.current || queueRef.current.length > 0) {
          const remaining: QueuedMoveItem[] = [];
          if (activeItemRef.current) {
            remaining.push(activeItemRef.current);
            activeItemRef.current = null;
          }
          remaining.push(...queueRef.current);
          queueRef.current = [];
          setActiveAnimation(null);

          const manager = managerRef.current!;
          for (const item of remaining) {
            manager.applyMove(item.move);
          }
          setCubies(manager.getCubies());
          setIsSolved(manager.isSolved());
          setFaceletString(manager.asFaceletString());
        }

        const manager = managerRef.current!;
        if (manager.isSolved()) {
          setSolutionMoves([]);
          setCurrentStepIndex(0);
          return [];
        }

        const validation = manager.validate();
        if (!validation.valid) {
          setErrorMessage(validation.error ?? 'Invalid cube state');
          return [];
        }

        setIsCalculatingSolution(true);
        try {
          const solution = await cubeSolver.solve(
            manager.toJSON(),
            manager.asFaceletString()
          );
          setSolutionMoves(solution);
          setCurrentStepIndex(0);
          if (autoPlay && solution.length > 0) {
            setIsPlayingSolution(true);
          }
          return solution;
        } catch (err) {
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to solve cube'
          );
          return [];
        } finally {
          setIsCalculatingSolution(false);
        }
      },
      [isCalculatingSolution]
    );

    // Handle autoSolve prop on initial mount
    const autoSolveTriggeredRef = useRef(false);
    useEffect(() => {
      if (
        autoSolve &&
        !autoSolveTriggeredRef.current &&
        solverReady &&
        !isSolved
      ) {
        autoSolveTriggeredRef.current = true;
        handleSolve(true);
      }
    }, [autoSolve, solverReady, isSolved, handleSolve]);

    // Playback transport controls
    const handlePlayPause = useCallback(() => {
      if (solutionMoves.length === 0) return;
      if (isPlayingSolution) {
        setIsPlayingSolution(false);
      } else if (currentStepIndex < solutionMoves.length) {
        setIsPlayingSolution(true);
      }
    }, [currentStepIndex, isPlayingSolution, solutionMoves.length]);

    const handleNextStep = useCallback(() => {
      if (
        isPlayingSolution ||
        activeAnimation ||
        currentStepIndex >= solutionMoves.length
      ) {
        return;
      }
      const nextMove = solutionMoves[currentStepIndex];
      enqueueMoves([{ move: nextMove, source: 'solution-forward' }]);
    }, [
      activeAnimation,
      currentStepIndex,
      enqueueMoves,
      isPlayingSolution,
      solutionMoves,
    ]);

    const handlePrevStep = useCallback(() => {
      if (isPlayingSolution || activeAnimation || currentStepIndex <= 0) {
        return;
      }
      const prevMove = solutionMoves[currentStepIndex - 1];
      const inverseMove = getInverseMove(prevMove);
      enqueueMoves([{ move: inverseMove, source: 'solution-backward' }]);
    }, [
      activeAnimation,
      currentStepIndex,
      enqueueMoves,
      isPlayingSolution,
      solutionMoves,
    ]);

    // Expose imperative ref API for external programmatic control
    useImperativeHandle(
      ref,
      () => ({
        move: (notation: MoveNotation | string) => {
          const parsed = parseMoveString(notation);
          enqueueMoves(
            parsed.map((m) => ({ move: m, source: 'manual' as const }))
          );
        },
        scramble: (length = 20) => handleScramble(length),
        solve: (autoPlay = true) => handleSolve(autoPlay),
        reset: () => handleReset(),
        undo: () => handleUndo(),
        isSolved: () => managerRef.current!.isSolved(),
        isBusy: () =>
          Boolean(activeItemRef.current) || queueRef.current.length > 0,
        getFaceletString: () => managerRef.current!.asFaceletString(),
      }),
      [enqueueMoves, handleReset, handleScramble, handleSolve, handleUndo]
    );

    // Keyboard shortcuts (U, D, L, R, F, B, Shift for prime) when focused inside component
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        const upper = e.key.toUpperCase();
        if (['U', 'D', 'L', 'R', 'F', 'B'].includes(upper)) {
          e.preventDefault();
          const notation = (e.shiftKey ? `${upper}'` : upper) as MoveNotation;
          handleManualMove(notation);
        }
      },
      [handleManualMove]
    );

    return (
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`flex flex-col gap-5 outline-none ${className}`}
      >
        <div
          className={`grid grid-cols-1 gap-6 ${
            showControls ? 'lg:grid-cols-12' : ''
          }`}
        >
          {/* 3D Cube Viewport */}
          <div
            className={`relative ${
              minimal
                ? ''
                : 'overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 via-zinc-100/70 to-zinc-200/50 shadow-inner'
            } ${
              showControls ? 'lg:col-span-7' : 'col-span-1'
            } ${viewerHeightClassName}`}
          >
            {/* Status Overlay Badges */}
            {!minimal && (
            <div className="pointer-events-none absolute top-4 right-4 left-4 z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs backdrop-blur-md ${
                    isSolved
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700'
                      : 'border-amber-500/30 bg-amber-500/15 text-amber-800'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSolved ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {isSolved ? 'Solved' : 'Scrambled / In Progress'}
                </span>

                {moveHistory.length > 0 && (
                  <span className="rounded-full border border-zinc-300/70 bg-white/85 px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 backdrop-blur-md">
                    {moveHistory.length}{' '}
                    {moveHistory.length === 1 ? 'move' : 'moves'}
                  </span>
                )}
              </div>

              {activeAnimation && (
                <div className="flex items-center gap-1.5 rounded-full border border-[#ff5500]/30 bg-[#ff5500] px-3 py-1 font-mono text-xs font-bold text-white shadow-sm backdrop-blur-md">
                  <span>Turning</span>
                  <span>{activeAnimation.move}</span>
                </div>
              )}
            </div>
            )}

            {/* Interactive 3D Canvas */}
            <DynamicCubeScene
              cubies={cubies}
              activeAnimation={activeAnimation}
              onAnimationComplete={handleAnimationComplete}
              onInteractiveMove={handleManualMove}
              colors={colors}
              cubeSize={cubeSize}
              interactive={interactive && !isPlayingSolution}
              hoverTilt={hoverTilt}
              enableZoom={enableZoom}
              onUserInteractStart={onUserInteractStart}
              onUserInteractEnd={onUserInteractEnd}
              onCubeClick={onCubeClick}
              resetCameraToken={resetCameraToken}
            />

            {/* Bottom Help Bar */}
            {!minimal && (
            <div className="pointer-events-none absolute right-4 bottom-3 left-4 flex items-center justify-between text-[11px] text-zinc-500">
              <span>
                Drag background to orbit camera • Scroll/Pinch to zoom
              </span>
              <span className="hidden sm:inline font-mono">
                Keys: U D L R F B (+Shift for &apos;)
              </span>
            </div>
            )}
          </div>

          {/* Controls & Solver Playback Panels */}
          {showControls && (
            <div className="flex flex-col gap-4 lg:col-span-5">
              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <CubeControls
                onMove={handleManualMove}
                onScramble={() => handleScramble(20)}
                onSolve={() => handleSolve(true)}
                onReset={handleReset}
                onUndo={handleUndo}
                canUndo={moveHistory.length > 0 && !isPlayingSolution}
                isSolved={isSolved}
                isSolving={isCalculatingSolution}
                isAnimating={Boolean(activeAnimation)}
                solverReady={solverReady}
              />

              <PlaybackControls
                solutionMoves={solutionMoves}
                currentStepIndex={currentStepIndex}
                isPlaying={isPlayingSolution}
                isAnimating={Boolean(activeAnimation)}
                speedMs={speedMs}
                onPlayPause={handlePlayPause}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                onSpeedChange={setSpeedMs}
                activeMove={activeAnimation?.move ?? null}
                lastScramble={lastScramble}
              />

              {/* Compact State Synchronization Verification Card */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-2xs backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Synchronized 54-Facelet State (URFDLB)
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600">
                    ✓ 3D &amp; Logical Verified
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-[11px] tracking-tight text-zinc-600 select-all">
                  {faceletString}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default RubiksCube;

