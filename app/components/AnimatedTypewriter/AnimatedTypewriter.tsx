'use client';

import { memo, useEffect, useId, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { FloraDefs, FloraLayer, type Phase } from './FloraLayer';
import { useReducedMotion } from './useReducedMotion';
import styles from './AnimatedTypewriter.module.css';

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export interface AnimatedTypewriterProps {
  /** Sentences to cycle through, in order, forever. An empty array renders just the scene. */
  strings: readonly string[];
  /** Milliseconds per typed character. @default 70 */
  typingSpeed?: number;
  /** Milliseconds per deleted character. @default 38 */
  deletingSpeed?: number;
  /** How long a finished sentence stays on screen (ms). @default 1900 */
  pauseDuration?: number;
  /** Extra class on the root element (e.g. to override `min-height`). */
  className?: string;
  /** Show the blinking cursor. @default true */
  showCursor?: boolean;
  /** Render the growing vines and roses. @default true */
  showFlorals?: boolean;
  /** Accessible label. Defaults to all strings joined, so screen readers never hear every keystroke. */
  ariaLabel?: string;
}

/* -------------------------------------------------------------------------- */
/*  Typewriter                                                                */
/* -------------------------------------------------------------------------- */

const BETWEEN_STRINGS_DELAY = 380;
const REDUCED_MOTION_MIN_HOLD = 3200;

interface TypeState {
  index: number;
  count: number;
  phase: 'typing' | 'deleting';
}
const INITIAL_STATE: TypeState = { index: 0, count: 0, phase: 'typing' };

interface TypedTextProps {
  list: readonly string[];
  typingSpeed: number;
  showCursor: boolean;
  /** Written (never read) here; the floral scene reads it each frame to pace its growth. */
  phaseRef: MutableRefObject<Phase>;
}


/**
 * Owns the per-character state. Only this tiny subtree re-renders while typing;
 * the floral scene lives outside it and never re-renders because of it.
 */
const TypedText = memo(function TypedText({
  list,
  typingSpeed,
  showCursor,
  phaseRef,
}: TypedTextProps) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<TypeState>(INITIAL_STATE);

  // Code-point arrays so emoji / surrogate pairs are never split mid-character.
  const chars = useMemo(() => list.map((s) => Array.from(s)), [list]);
  const total = chars.length;

  useEffect(() => {
    if (total === 0) return;

    // Reduced motion: show full text immediately
    if (reduced) {
      setState({ index: 0, count: chars[0]?.length ?? 0, phase: 'typing' });
      return;
    }

    const current = chars[state.index % total];
    if (!current) return;

    if (state.count < current.length) {
      // Tiny jitter makes the rhythm feel human rather than mechanical.
      const delay = typingSpeed * (0.75 + Math.random() * 0.5);
      const id = window.setTimeout(() => {
        setState((s) => ({ ...s, count: s.count + 1 }));
      }, delay);
      return () => window.clearTimeout(id);
    }
  }, [state, reduced, chars, total, typingSpeed]);

  const current = total ? chars[state.index % total] : [];
  const text = reduced ? current.join('') : current.slice(0, state.count).join('');
  const isComplete = !reduced && state.count === current.length && total > 0;

  useEffect(() => {
    if (reduced) {
      phaseRef.current = 'completed';
    } else if (isComplete) {
      // When typing completes, signal flora layer to bloom and grow out!
      phaseRef.current = 'blooming';
    } else {
      phaseRef.current = 'typing';
    }
  }, [phaseRef, reduced, isComplete]);

  return (
    <span className={styles.live} data-resting={isComplete || undefined}>
      {text}
      {showCursor && <span className={styles.cursor} aria-hidden="true" />}
    </span>
  );
});


/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const cls = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export function AnimatedTypewriter({
  strings,
  typingSpeed = 70,
  deletingSpeed = 38,
  pauseDuration = 1900,
  className,
  showCursor = true,
  showFlorals = true,
  ariaLabel,
}: AnimatedTypewriterProps) {
  // SVG ids must be unique per instance; useId is stable across server + client.
  const id = `tw${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>('typing');

  // Callers usually pass an inline array literal (new identity every render). Keying on
  // the content keeps the typing state alive across parent re-renders, and resets it
  // cleanly (via `key` below) when the strings genuinely change.
  const key = JSON.stringify(strings ?? []);
  const list = useMemo(() => JSON.parse(key) as string[], [key]);

  const label =
    ariaLabel ??
    (list.length ? list.map((s) => (/[.!?…]$/.test(s.trim()) ? s : `${s}.`)).join(' ') : undefined);

  return (
    <div ref={rootRef} className={cls(styles.root, className)} role={label ? 'group' : undefined} aria-label={label}>
      {showFlorals && <FloraDefs id={id} />}
      <div className={styles.ambient} aria-hidden="true" />

      {/* Plants are siblings of the text and carry their own z-index (1 = behind it, 3 = in front of it). */}
      {showFlorals && <FloraLayer id={id} rootRef={rootRef} textRef={textRef} phaseRef={phaseRef} measureKey={key} />}

      <div className={styles.content}>
        {/* Visual only: screen readers get the root's aria-label instead of every keystroke. */}
        <div ref={textRef} className={styles.textGrid} aria-hidden="true">
          {/* Invisible copies of every string reserve the tallest height -> zero layout shift,
              and give the floral layer exact line boxes to grow out of. */}
          {list.map((s, i) => (
            <span key={i} className={styles.ghost} data-ghost="">
              {s}
            </span>
          ))}
          <TypedText
            key={key}
            list={list}
            typingSpeed={typingSpeed}
            showCursor={showCursor}
            phaseRef={phaseRef}
          />

        </div>
      </div>
    </div>
  );
}

export default AnimatedTypewriter;
