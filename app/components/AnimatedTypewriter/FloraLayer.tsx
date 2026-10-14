'use client';

import { memo, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type RefObject } from 'react';
import { generateFlora, lineRects, summarize, type PlantT } from './flora';
import { useReducedMotion } from './useReducedMotion';
import styles from './AnimatedTypewriter.module.css';

export type Phase = 'typing' | 'blooming' | 'completed' | 'resting' | 'deleting';

/* -------------------------------------------------------------------------- */
/*  Shared SVG art (one hidden <svg>, <use>d by every plant)                  */
/* -------------------------------------------------------------------------- */

const ROSE: Record<'a' | 'b', { outer: string[]; mid: string[]; inner: string[]; spin: number }> = {
  a: {
    outer: ['#1a0105', '#4c0513', '#8a1026', '#bf2b40'],
    mid: ['#210207', '#5c0919', '#9a172e', '#c93448'],
    inner: ['#250309', '#6a0c22', '#ab2038', '#d04256'],
    spin: 0,
  },
  b: {
    outer: ['#170104', '#430412', '#7c0e24', '#b3263a'],
    mid: ['#1d0206', '#520817', '#8a152b', '#bd3144'],
    inner: ['#210208', '#5c0b20', '#982036', '#c63d50'],
    spin: 17,
  },
};
const STOPS = ['0%', '48%', '80%', '100%'];
const PETAL = 'M50 52 C21 55 3 33 15 16 C26 2 43 0 50 6 C57 0 74 2 85 16 C97 33 79 55 50 52 Z';
/** [angle, scale] per petal. Slightly irregular on purpose: perfect symmetry reads as a flower icon, not a rose. */
const RINGS: Record<number, Array<[number, number]>> = {
  3: [[0, 1], [74, 0.96], [147, 1.03], [221, 0.97], [292, 1.02]],
  2: [[30, 0.8], [104, 0.77], [176, 0.82], [250, 0.78], [322, 0.8]],
  1: [[12, 0.58], [96, 0.55], [190, 0.6], [281, 0.56]],
  0: [[50, 0.36], [170, 0.34], [292, 0.37]],
};
const SHADOW_R: Record<number, number> = { 3: 41, 2: 32, 1: 23, 0: 14 };
const at = (a: number, s: number) => `translate(50 50) rotate(${a}) scale(${s}) translate(-50 -50)`;

const LEAF_VEINS =
  'M16 0 Q27 -9 41 -19 M34 0 Q46 -9 62 -21 M54 0 Q64 -7 80 -14 M16 0 Q27 9 41 19 M34 0 Q46 9 62 21 M54 0 Q64 7 80 14';

const FloraDefs = memo(function FloraDefs({ id }: { id: string }) {
  const g = (n: string) => `${id}-${n}`;
  const url = (n: string) => `url(#${g(n)})`;
  const ref = (n: string) => `#${g(n)}`;
  const leafTones: Array<[string, string, string]> = [
    ['#0a3a1d', '#17702f', '#3fae50'],
    ['#093322', '#146a3c', '#36a35a'],
    ['#12401a', '#2a7d2a', '#6cc04a'],
  ];

  return (
    <svg className={styles.defs} width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {(['a', 'b'] as const).flatMap((v) =>
          (['outer', 'mid', 'inner'] as const).map((layer) => (
            <radialGradient key={`${layer}${v}`} id={g(`rg-${layer}-${v}`)} gradientUnits="userSpaceOnUse" cx="50" cy="50" r="50">
              {ROSE[v][layer].map((c, i) => (
                <stop key={i} offset={STOPS[i]} stopColor={c} />
              ))}
            </radialGradient>
          )),
        )}
        <radialGradient id={g('heart')} gradientUnits="userSpaceOnUse" cx="50" cy="50" r="13">
          <stop offset="0%" stopColor="#090002" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#090002" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('bud')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3a050d" />
          <stop offset="55%" stopColor="#8d1025" />
          <stop offset="100%" stopColor="#c8283e" />
        </linearGradient>
        <linearGradient id={g('sepal')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0c3d1d" />
          <stop offset="100%" stopColor="#2f9a46" />
        </linearGradient>
        {leafTones.map((t, i) => (
          <linearGradient key={i} id={g(`lg${i}`)} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={t[0]} />
            <stop offset="50%" stopColor={t[1]} />
            <stop offset="100%" stopColor={t[2]} />
          </linearGradient>
        ))}

        {/* one rose petal: base at the centre, notched rim, soft crease and highlight */}
        <g id={g('pet')}>
          <path d={PETAL} stroke="#14000300" strokeOpacity="0" strokeWidth="0" />
          <path d={PETAL} stroke="#180104" strokeOpacity="0.8" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M50 50 C49 36 50 22 50 11" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17 17 C26 4 43 2 50 8 C57 2 74 4 83 17" fill="none" stroke="#ff8d99" strokeOpacity="0.38" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 24 C30 14 42 12 49 15" fill="none" stroke="#ffb0ba" strokeOpacity="0.14" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        {(['a', 'b'] as const).map((v) => (
          <g key={v}>
            {([3, 2, 1, 0] as const).map((r) => (
              <g key={r} id={g(`ring-${v}-${r}`)}>
                <circle cx="50" cy="50" r={SHADOW_R[r]} fill="#0d0004" fillOpacity={r === 3 ? 0.5 : 0.62} />
                {RINGS[r].map(([a, sc]) => (
                  <use key={a} href={ref('pet')} fill={url(`rg-${r === 3 ? 'outer' : r === 2 ? 'mid' : 'inner'}-${v}`)} transform={at(a + (v === 'b' ? 17 : 0), sc)} />
                ))}
                {r === 0 && (
                  <>
                    <circle cx="50" cy="50" r="9" fill={url('heart')} />
                    <path d="M47 50 A3 3 0 1 1 53 50 A6 6 0 1 1 41.5 50 A9 9 0 1 1 59 50" fill="none" stroke="#050001" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M48.5 47.5 A3 3 0 0 1 53 49 A6 6 0 0 1 44 53" fill="none" stroke="#ff9aa6" strokeOpacity="0.4" strokeWidth="0.9" strokeLinecap="round" />
                  </>
                )}
              </g>
            ))}
          </g>
        ))}

        {/* closed bud + calyx */}
        <g id={g('budshape')}>
          <path d="M50 72 C35 66 33 45 50 26 C67 45 65 66 50 72 Z" fill={url('bud')} stroke="#220207" strokeOpacity="0.6" strokeWidth="0.8" />
          <path d="M50 28 C44 42 44 58 50 71 M50 28 C57 40 58 58 50 71" fill="none" stroke="#ff7a8c" strokeOpacity="0.28" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g id={g('sepals')}>
          {[-52, -26, 0, 26, 52].map((a) => (
            <path key={a} d="M50 70 C44 60 45 47 50 37 C55 47 56 60 50 70 Z" fill={url('sepal')} stroke="#0a2d15" strokeOpacity="0.5" strokeWidth="0.6" transform={`rotate(${a} 50 70)`} />
          ))}
        </g>

        {/* leaf: base at the origin, tip at +x (100 units long) */}
        {leafTones.map((_, i) => (
          <g key={i} id={g(`leaf-${i}`)}>
            <path d="M-9 0 L0 0" stroke="#10502a" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 0 C16 -36 68 -38 100 0 C68 38 16 36 0 0 Z" fill={url(`lg${i}`)} stroke="#06240f" strokeOpacity="0.6" strokeWidth="1" strokeLinejoin="round" />
            <path d="M0 0 C16 -36 68 -38 100 0 Z" fill="#c8ffb4" fillOpacity="0.11" />
            <path d="M2 0 L96 0" stroke="#d6f7c4" strokeOpacity="0.6" strokeWidth="1.7" strokeLinecap="round" />
            <path d={LEAF_VEINS} fill="none" stroke="#d6f7c4" strokeOpacity="0.36" strokeWidth="1" strokeLinecap="round" />
          </g>
        ))}
      </defs>
    </svg>
  );
});

/* -------------------------------------------------------------------------- */
/*  Timeline -> frame                                                         */
/* -------------------------------------------------------------------------- */

const FADE_AT = 0.9;
const BLOOM_A = 0.33;
const BLOOM_B = 0.78;
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

interface Frame {
  transform: string;
  opacity: number;
  sw: [number, number, number];
}

function frameOf(pl: PlantT, p: number, T: number, flat: boolean): Frame {
  const sw: [number, number, number] = flat
    ? [0, 0, 0]
    : [Math.sin(T * 0.72 + pl.phase), Math.sin(T * 0.53 + pl.phase * 1.7), Math.sin(T * 0.91 + pl.phase * 2.3)];
  if (flat) return { transform: 'none', opacity: 1, sw };
  // The plant starts small and far (behind the text plane) and ends large and near.
  const z = pl.z0 + (pl.z1 - pl.z0) * smooth(clamp01(p / 0.84));
  const rx = pl.tilt * Math.sin(T * 0.21 + pl.phase);
  const ry = pl.tilt * 1.3 * Math.sin(T * 0.17 + pl.phase * 1.9);
  return {
    transform: `perspective(900px) translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`,
    opacity: p > FADE_AT ? Math.max(0, (1 - p) / (1 - FADE_AT)) : 1,
    sw,
  };
}

function paint(el: SVGSVGElement, f: Frame, p: number) {
  const s = el.style;
  s.setProperty('--p', p.toFixed(4));
  s.setProperty('--sw0', f.sw[0].toFixed(3));
  s.setProperty('--sw1', f.sw[1].toFixed(3));
  s.setProperty('--sw2', f.sw[2].toFixed(3));
  s.transform = f.transform;
  s.opacity = String(f.opacity);
}

/** Growth speed: slow and patient while typing/deleting, quick during the pause - and the roses only really open then. */
function rateFor(p: number, hasRoses: boolean, phase: Phase): number {
  if (hasRoses && p > BLOOM_A && p < BLOOM_B) return phase === 'resting' ? 2.9 : 0.3;
  return phase === 'resting' ? 1.4 : phase === 'deleting' ? 0.75 : 0.95;
}

const v = (o: Record<string, string | number>) => o as CSSProperties;
const cls = (...p: Array<string | false | undefined>) => p.filter(Boolean).join(' ');
const swCls = [styles.k0, styles.k1, styles.k2];

/* -------------------------------------------------------------------------- */
/*  Layer                                                                     */
/* -------------------------------------------------------------------------- */

interface FloraLayerProps {
  id: string;
  rootRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  phaseRef: MutableRefObject<Phase>;
  /** Changes whenever the strings change, so the composition is re-measured. */
  measureKey: string;
}

export function FloraLayer({ id, rootRef, textRef, phaseRef, measureKey }: FloraLayerProps) {
  const reduced = useReducedMotion();
  const [plants, setPlants] = useState<PlantT[] | null>(null);
  const els = useRef<Array<SVGSVGElement | null>>([]);
  const progress = useRef<Map<string, number>>(new Map());
  const clock = useRef(0);

  /* --- measure the text and (re)generate the composition --- */
  useEffect(() => {
    const root = rootRef.current;
    const textEl = textRef.current;
    if (!root || !textEl) return;
    let raf = 0;
    let last = '';

    const build = () => {
      const rr = root.getBoundingClientRect();
      if (rr.width < 10 || rr.height < 10) return;
      const boxes = Array.from(textEl.querySelectorAll('[data-ghost]')).map((n) => lineRects(n, rr));
      const { text, core } = summarize(boxes, rr.width, rr.height);
      const compact = rr.width < 640;
      const sig = [rr.width, rr.height, text.x0, text.y0, text.x1, text.y1, core.x0, core.x1, core.y1, compact].map((n) => (typeof n === 'number' ? Math.round(n) : n)).join('|');
      if (sig === last) return;
      last = sig;
      const next = generateFlora({ W: rr.width, H: rr.height, text, core, compact });
      next.forEach((pl) => {
        if (!progress.current.has(pl.id)) progress.current.set(pl.id, 0);
      });
      setPlants(next);

    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };

    build();
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    ro.observe(textEl);
    document.fonts?.ready.then(schedule).catch(() => undefined);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rootRef, textRef, measureKey]);

  /* --- the growth clock --- */
  useEffect(() => {
    if (!plants || reduced) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let lastT = 0;
    let visible = true;
    let tick = 0;
    const stride = plants.length <= 6 ? 2 : 1; // compact scenes repaint at ~30fps
    const MATURE_TARGET = 0.88;

    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? true;
    });
    io.observe(root);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      if (!visible) return;
      clock.current += dt;
      tick++;

      const phase = phaseRef.current;
      const isBlooming = phase === 'blooming' || phase === 'completed';

      plants.forEach((pl, i) => {
        let p = progress.current.get(pl.id) ?? 0;

        if (isBlooming && p < MATURE_TARGET) {
          // Plants grow out smoothly and deliberately over ~3.5 to 5.5 seconds
          const growthSpeed = 0.22;
          p = Math.min(MATURE_TARGET, p + dt * growthSpeed);
          progress.current.set(pl.id, p);
        }

        const el = els.current[i];
        if (el && tick % stride === 0) {
          paint(el, frameOf(pl, p, clock.current, false), p);
        }
      });
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [plants, reduced, rootRef, phaseRef]);

  if (!plants) return null;

  const mature = 0.88;
  const base = (pl: PlantT) => {
    const p = reduced ? mature : (progress.current.get(pl.id) ?? 0);
    const f = frameOf(pl, p, clock.current, reduced);
    return { p, f };
  };


  return (
    <div className={styles.plants} aria-hidden="true">
      {plants.map((pl, i) => {
        const { p, f } = base(pl);
        return (
          <svg
            key={`${pl.id}-${pl.x}-${pl.y}-${pl.w}`}
            ref={(el) => {
              els.current[i] = el;
            }}
            className={cls(styles.plant, pl.layer === 'back' ? styles.pBack : styles.pFront, reduced && styles.still)}
            viewBox={`0 0 ${pl.w} ${pl.h}`}
            focusable="false"
            style={v({
              left: pl.x,
              top: pl.y,
              width: pl.w,
              height: pl.h,
              transformOrigin: `${pl.ox}px ${pl.oy}px`,
              transform: f.transform,
              opacity: f.opacity,
              '--p': p.toFixed(4),
              '--sw0': f.sw[0].toFixed(3),
              '--sw1': f.sw[1].toFixed(3),
              '--sw2': f.sw[2].toFixed(3),
            })}
          >
            {pl.stems.map((s, j) => (
              <path key={j} className={styles.stem} d={s.d} pathLength={1} stroke={s.c} strokeWidth={s.w} style={v({ '--s': s.s, '--d': s.dur })} />
            ))}
            {pl.thorns.map((t, j) => (
              <path key={j} className={styles.thorn} d="M0 -1.8 L1.2 0 L0 1.8 Z" transform={`translate(${t.x} ${t.y}) rotate(${t.rot}) scale(${t.size})`} style={v({ '--s': t.s })} />
            ))}
            {pl.leaves.map((l, j) => (
              <g key={j} className={styles.leaf} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`} style={v({ '--s': l.s, '--d': l.dur, '--sd': l.sd })}>
                <g className={cls(styles.lSway, swCls[l.k])}>
                  <g className={styles.lUnf}>
                    <use href={`#${id}-leaf-${l.tone}`} transform={`scale(${(l.size / 100).toFixed(3)})`} />
                  </g>
                </g>
              </g>
            ))}
            {pl.roses.map((r, j) => (
              <g key={j} className={styles.rose} transform={`translate(${r.x} ${r.y}) rotate(${r.rot}) scale(${(r.size / 100).toFixed(3)}) translate(-50 -50)`} style={v({ '--s': r.s })}>
                <g className={cls(styles.rSway, swCls[r.k])}>
                  <g className={styles.spin}>
                    <use href={`#${id}-sepals`} className={styles.sepals} />
                    <use href={`#${id}-budshape`} className={styles.bud} />
                    <use href={`#${id}-ring-${r.tone === 0 ? 'a' : 'b'}-3`} className={cls(styles.ring, styles.r3)} />
                    <use href={`#${id}-ring-${r.tone === 0 ? 'a' : 'b'}-2`} className={cls(styles.ring, styles.r2)} />
                    <use href={`#${id}-ring-${r.tone === 0 ? 'a' : 'b'}-1`} className={cls(styles.ring, styles.r1)} />
                    <use href={`#${id}-ring-${r.tone === 0 ? 'a' : 'b'}-0`} className={cls(styles.ring, styles.r0)} />
                  </g>
                </g>
              </g>
            ))}
          </svg>
        );
      })}
    </div>
  );
}

export { FloraDefs };
