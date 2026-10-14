/**
 * Procedural, seeded plant generator.
 *
 * Every plant is a small tree of Catmull-Rom stems (main stem -> branches -> twigs). Each stem
 * is cut into segments that carry their own start/duration on a plant-local timeline (0..1),
 * so a branch only starts when its parent's tip has actually passed the attachment point,
 * leaves only start when the stem has reached them, and a rose bud only appears when its stem
 * has finished. The renderer just scrubs that timeline; nothing here knows about the DOM.
 */

export type Layer = 'back' | 'front';

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface FloraInput {
  W: number;
  H: number;
  /** Union box of all strings (container px). */
  text: Rect;
  /** Region that holds letters for *every* string (container px). */
  core: Rect;
  compact: boolean;
}

export interface StemSegT {
  d: string;
  w: number;
  s: number;
  dur: number;
  c: string;
}
export interface ThornT {
  x: number;
  y: number;
  rot: number;
  size: number;
  s: number;
}
export interface LeafT {
  x: number;
  y: number;
  rot: number;
  size: number;
  s: number;
  dur: number;
  tone: 0 | 1 | 2;
  k: 0 | 1 | 2;
  sd: 1 | -1;
}
export interface RoseT {
  x: number;
  y: number;
  rot: number;
  size: number;
  s: number;
  tone: 0 | 1;
  k: 0 | 1 | 2;
}
export interface PlantT {
  id: string;
  layer: Layer;
  /** Box in container px, and the root position inside it. */
  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number;
  stems: StemSegT[];
  thorns: ThornT[];
  leaves: LeafT[];
  roses: RoseT[];
  /** Seconds for one full life cycle at normal speed. */
  period: number;
  /** Initial progress (0..1) so the scene never starts in lock-step. */
  offset: number;
  /** Camera distance (px, + toward the viewer) at the start and end of growth. */
  z0: number;
  z1: number;
  tilt: number;
  phase: number;
}

/* ------------------------------------------------------------------ math */

interface Pt {
  x: number;
  y: number;
}
type Bez = [Pt, Pt, Pt, Pt];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function bezPt(b: Bez, t: number): Pt {
  const m = 1 - t;
  const a = m * m * m;
  const c = 3 * m * m * t;
  const d = 3 * m * t * t;
  const e = t * t * t;
  return {
    x: a * b[0].x + c * b[1].x + d * b[2].x + e * b[3].x,
    y: a * b[0].y + c * b[1].y + d * b[2].y + e * b[3].y,
  };
}
function bezAng(b: Bez, t: number): number {
  const m = 1 - t;
  const dx = 3 * m * m * (b[1].x - b[0].x) + 6 * m * t * (b[2].x - b[1].x) + 3 * t * t * (b[3].x - b[2].x);
  const dy = 3 * m * m * (b[1].y - b[0].y) + 6 * m * t * (b[2].y - b[1].y) + 3 * t * t * (b[3].y - b[2].y);
  return Math.atan2(dy, dx);
}

interface Spline {
  segs: Bez[];
  lens: number[];
  total: number;
}

function buildSpline(pts: Pt[]): Spline {
  const segs: Bez[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    segs.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2,
    ]);
  }
  const lens = segs.map((b) => {
    let l = 0;
    let prev = b[0];
    for (let i = 1; i <= 12; i++) {
      const q = bezPt(b, i / 12);
      l += Math.hypot(q.x - prev.x, q.y - prev.y);
      prev = q;
    }
    return l;
  });
  return { segs, lens, total: lens.reduce((a, b) => a + b, 0) || 1 };
}

function sampleAt(sp: Spline, u: number): { p: Pt; ang: number } {
  const target = clamp(u, 0, 1) * sp.total;
  let acc = 0;
  for (let i = 0; i < sp.segs.length; i++) {
    if (target <= acc + sp.lens[i] || i === sp.segs.length - 1) {
      const t = clamp((target - acc) / (sp.lens[i] || 1), 0, 1);
      return { p: bezPt(sp.segs[i], t), ang: bezAng(sp.segs[i], t) };
    }
    acc += sp.lens[i];
  }
  return { p: sp.segs[0][0], ang: 0 };
}

/** A wandering stem: heading drifts by `curve` radians overall, plus some wobble. `grow` tightens it into a tendril. */
function walk(
  rng: () => number,
  start: Pt,
  heading: number,
  length: number,
  n: number,
  curve: number,
  wobble: number,
  grow = 0,
): Pt[] {
  const pts: Pt[] = [start];
  const step = length / n;
  let h = heading;
  let p = start;
  for (let i = 0; i < n; i++) {
    h += (curve / n) * (1 + grow * i) + (rng() - 0.5) * wobble;
    p = { x: p.x + Math.cos(h) * step, y: p.y + Math.sin(h) * step };
    pts.push(p);
  }
  return pts;
}

/** Re-walk a stem a little shorter until its tip lands inside the frame (so roses are never clipped away). */
function fitWalk(
  rng: () => number,
  bounds: Rect,
  start: Pt,
  heading: number,
  length: number,
  n: number,
  curve: number,
  wobble: number,
  grow = 0,
  anchor: Pt = start,
  expand = 1,
): Pt[] {
  let len = length;
  let pts = walk(rng, start, heading, len, n, curve, wobble, grow);
  for (let i = 0; i < 7; i++) {
    const t = pts[pts.length - 1];
    // the plant is scaled about its root as it comes toward the camera, so test where the tip will *be*
    const e = { x: anchor.x + (t.x - anchor.x) * expand, y: anchor.y + (t.y - anchor.y) * expand };
    if (e.x > bounds.x0 && e.x < bounds.x1 && e.y > bounds.y0 && e.y < bounds.y1) break;
    len *= 0.86;
    pts = walk(rng, start, heading, len, n, curve, wobble, grow);
  }
  return pts;
}

/* ----------------------------------------------------------------- specs */

interface Spec {
  id: string;
  layer: Layer;
  /** Root position as a function of the text geometry. */
  root: (t: Rect, c: Rect, W: number, H: number) => Pt;
  heading: number;
  len: number; // fraction of min(W, 1.25 * H) -> stays proportionate on phones
  curve: number;
  branches: number;
  roses: number;
  scale: number;
  tendril?: boolean;
  z0: number;
  z1: number;
  period: number;
  offset: number;
  tilt: number;
  /** Used on phones. */
  compact: boolean;
}

const PI = Math.PI;

const SPECS: readonly Spec[] = [
  // Left flank hero: climbs up and over, rises out of the page toward the viewer.
  { id: 'L', layer: 'front', root: (_t, c) => ({ x: c.x0 - 10, y: lerp(c.y0, c.y1, 0.7) }), heading: PI + 0.62, len: 0.62, curve: 1.05, branches: 4, roses: 3, scale: 1.15, z0: -430, z1: 360, period: 46, offset: 0.0, tilt: 5, compact: true },
  // Right flank: sweeps down and out, blooming in the middle ground.
  { id: 'R', layer: 'front', root: (_t, c) => ({ x: c.x1 + 10, y: lerp(c.y0, c.y1, 0.42) }), heading: -0.34, len: 0.58, curve: -0.85, branches: 4, roses: 2, scale: 1.0, z0: -380, z1: 210, period: 52, offset: -0.03, tilt: 4, compact: true },
  // Below the text, behind the letters' baseline: two plants that slip out underneath.
  { id: 'BL', layer: 'back', root: (_t, c) => ({ x: lerp(c.x0, c.x1, 0.22), y: c.y1 - 6 }), heading: PI / 2 + 0.55, len: 0.5, curve: 0.9, branches: 3, roses: 2, scale: 0.95, z0: -560, z1: -40, period: 41, offset: 0.05, tilt: 3, compact: true },
  { id: 'BR', layer: 'front', root: (_t, c) => ({ x: lerp(c.x0, c.x1, 0.74), y: c.y1 + 6 }), heading: PI / 2 - 0.4, len: 0.46, curve: -0.75, branches: 3, roses: 1, scale: 0.85, z0: -300, z1: 230, period: 47, offset: -0.06, tilt: 4, compact: true },
  // Above the text.
  { id: 'TL', layer: 'back', root: (_t, c) => ({ x: lerp(c.x0, c.x1, 0.12), y: c.y0 + 6 }), heading: -PI / 2 - 0.55, len: 0.46, curve: -0.7, branches: 3, roses: 1, scale: 0.8, z0: -500, z1: -30, period: 38, offset: 0.1, tilt: 3, compact: false },
  { id: 'TR', layer: 'front', root: (_t, c) => ({ x: lerp(c.x0, c.x1, 0.84), y: c.y0 + 4 }), heading: -PI / 2 + 0.45, len: 0.44, curve: 1.9, branches: 1, roses: 0, scale: 0.7, tendril: true, z0: -260, z1: 260, period: 36, offset: -0.1, tilt: 5, compact: false },
  // A vine that starts deep behind the middle of the letters and curls out through the gaps.
  { id: 'M', layer: 'back', root: (_t, c) => ({ x: lerp(c.x0, c.x1, 0.55), y: lerp(c.y0, c.y1, 0.6) }), heading: -PI / 2 + 1.0, len: 0.6, curve: 1.5, branches: 3, roses: 1, scale: 0.8, tendril: true, z0: -640, z1: -80, period: 56, offset: 0.02, tilt: 3, compact: true },
  // Far, small plants for depth.
  { id: 'FL', layer: 'back', root: (t, _c, W, H) => ({ x: Math.max(W * 0.04, t.x0 - W * 0.14), y: Math.min(H * 0.96, t.y1 + H * 0.14) }), heading: -0.95, len: 0.38, curve: -0.7, branches: 2, roses: 1, scale: 0.6, z0: -760, z1: -330, period: 53, offset: -0.14, tilt: 2, compact: false },
  { id: 'FR', layer: 'back', root: (t, _c, W, H) => ({ x: Math.min(W * 0.96, t.x1 + W * 0.12), y: Math.max(H * 0.05, t.y0 - H * 0.06) }), heading: PI - 0.5, len: 0.34, curve: 0.8, branches: 2, roses: 1, scale: 0.55, z0: -760, z1: -360, period: 58, offset: 0.13, tilt: 2, compact: false },
];

/* ------------------------------------------------------------ generation */

interface RawSeg {
  b: Bez;
  w: number;
  s: number;
  dur: number;
  c: string;
}
interface StemInfo {
  sp: Spline;
  s: number;
  dur: number;
  w: number;
  order: number;
}

const GREEN_DARK: [number, number, number] = [11, 58, 28];
const GREEN_LIGHT: [number, number, number] = [52, 150, 74];
const mix = (t: number) =>
  `rgb(${GREEN_DARK.map((c, i) => Math.round(lerp(c, GREEN_LIGHT[i], t))).join(',')})`;

const f1 = (n: number) => Math.round(n * 10) / 10;

export function generateFlora(input: FloraInput): PlantT[] {
  const { W, H, text, core, compact } = input;
  const U = clamp(Math.min(W / 1000, H / 640), 0.6, 1.35);
  const ref = Math.min(W, H * 1.25);
  const tc: Pt = { x: (text.x0 + text.x1) / 2, y: (text.y0 + text.y1) / 2 };
  const inner: Rect = { x0: 26, y0: 22, x1: W - 26, y1: H - 22 };
  const avoid: Rect = { x0: core.x0 + 20, y0: text.y0 - 4, x1: core.x1 - 20, y1: text.y1 + 4 };
  const specs = SPECS.filter((s) => !compact || s.compact);
  const plants: PlantT[] = [];

  specs.forEach((spec, si) => {
    const rng = mulberry32(0x9e3779b1 ^ (si * 7919 + 17));
    const raw: RawSeg[] = [];
    const thorns: ThornT[] = [];
    const leaves: LeafT[] = [];
    const roses: RoseT[] = [];
    const root = spec.root(text, core, W, H);
    const zEnd = compact && spec.layer === 'front' ? Math.min(spec.z1, 130) : spec.z1;
    const zBloom = spec.z0 + (zEnd - spec.z0) * (0.714 * 0.714 * (3 - 2 * 0.714)); // z when the first bud opens (p ~ 0.6)
    const expand = Math.max(1, 900 / (900 - zBloom)) * 1.04;
    const baseW = Math.max(2.4, 6.2 * U * spec.scale);
    const leafLen = (compact ? 27 : 32) * U * spec.scale;
    const spacing = (compact ? 62 : 48) * U * Math.max(0.75, spec.scale);

    const addStem = (pts: Pt[], w0: number, s: number, dur: number, order: number): StemInfo => {
      const sp = buildSpline(pts);
      let acc = 0;
      sp.segs.forEach((b, i) => {
        const a0 = acc / sp.total;
        acc += sp.lens[i];
        const a1 = acc / sp.total;
        raw.push({
          b,
          w: Math.max(1.3, w0 * (1 - 0.62 * ((a0 + a1) / 2))),
          s: s + dur * a0,
          dur: dur * (a1 - a0),
          c: mix(clamp(0.1 + 0.8 * ((a0 + a1) / 2) - order * 0.02, 0, 1)),
        });
      });
      return { sp, s, dur, w: w0, order };
    };

    const addLeaves = (st: StemInfo, size: number, startU: number, tipLeaf: boolean) => {
      let pos = startU * st.sp.total;
      let side: 1 | -1 = rng() < 0.5 ? 1 : -1;
      while (pos < st.sp.total * 0.92) {
        const u = pos / st.sp.total;
        const { p, ang } = sampleAt(st.sp, u);
        const spread = ((46 + rng() * 28) * PI) / 180;
        leaves.push({
          x: p.x,
          y: p.y,
          rot: ((ang + side * spread) * 180) / PI,
          size: size * (1.0 - 0.4 * u) * (0.86 + rng() * 0.28),
          s: st.s + st.dur * u + 0.012,
          dur: 0.1 + rng() * 0.06,
          tone: Math.floor(rng() * 3) as 0 | 1 | 2,
          k: Math.floor(rng() * 3) as 0 | 1 | 2,
          sd: side,
        });
        pos += spacing * (0.8 + rng() * 0.5);
        side = side === 1 ? -1 : 1;
      }
      if (tipLeaf) {
        const { p, ang } = sampleAt(st.sp, 1);
        leaves.push({
          x: p.x,
          y: p.y,
          rot: (ang * 180) / PI + (rng() - 0.5) * 24,
          size: size * 0.62,
          s: st.s + st.dur + 0.004,
          dur: 0.11,
          tone: Math.floor(rng() * 3) as 0 | 1 | 2,
          k: Math.floor(rng() * 3) as 0 | 1 | 2,
          sd: rng() < 0.5 ? 1 : -1,
        });
      }
    };

    const addRose = (st: StemInfo, size: number) => {
      const { p, ang } = sampleAt(st.sp, 1);
      roses.push({
        x: p.x,
        y: p.y,
        rot: (rng() - 0.5) * 60 + (ang * 180) / PI * 0.0,
        size,
        s: st.s + st.dur,
        tone: rng() < 0.5 ? 0 : 1,
        k: Math.floor(rng() * 3) as 0 | 1 | 2,
      });
    };

    /* ---- main stem ---- */
    const mainLen = spec.len * ref;
    const mainN = spec.tendril ? 7 : 5;
    const mainPts = fitWalk(rng, inner, root, spec.heading, mainLen, mainN, spec.curve, 0.34, spec.tendril ? 0.55 : 0, root, expand);
    const mainS = 0.02 + rng() * 0.03;
    const mainDur = spec.tendril ? 0.36 : 0.32 + Math.min(0.08, spec.len * 0.1);
    const main = addStem(mainPts, baseW, mainS, mainDur, 0);
    addLeaves(main, leafLen * 1.05, 0.14, !spec.roses);

    // thorns on the thick stems
    if (spec.roses > 0) {
      let pos = main.sp.total * 0.18;
      let side: 1 | -1 = 1;
      while (pos < main.sp.total * 0.85) {
        const u = pos / main.sp.total;
        const { p, ang } = sampleAt(main.sp, u);
        thorns.push({ x: p.x, y: p.y, rot: ((ang + side * 1.25) * 180) / PI, size: 6.5 * U * spec.scale, s: main.s + main.dur * u + 0.01 });
        pos += 64 * U;
        side = side === 1 ? -1 : 1;
      }
    }

    /* ---- branches ---- */
    const stems: StemInfo[] = [main];
    const branchStems: StemInfo[] = [];
    const nb = compact ? Math.max(1, spec.branches - 1) : spec.branches;
    let side: 1 | -1 = rng() < 0.5 ? 1 : -1;
    for (let i = 0; i < nb; i++) {
      const u = lerp(0.24, 0.74, (i + rng() * 0.6) / nb);
      const { p, ang } = sampleAt(main.sp, u);
      // alternate sides along the stem; flip only if the branch would head straight through the words
      const spread = 0.6 + rng() * 0.5;
      let curlDir: 1 | -1 = side;
      let useSide = ang + side * spread;
      const probe = { x: p.x + Math.cos(useSide) * 90, y: p.y + Math.sin(useSide) * 90 };
      if (probe.x > avoid.x0 && probe.x < avoid.x1 && probe.y > avoid.y0 && probe.y < avoid.y1) {
        curlDir = side === 1 ? -1 : 1;
        useSide = ang + curlDir * spread;
      }
      side = side === 1 ? -1 : 1;
      const bl = mainLen * lerp(0.55, 0.26, u) * (0.7 + rng() * 0.55);
      const bs = main.s + main.dur * u + 0.006;
      const bd = 0.16 + rng() * 0.1;
      const bw = Math.max(1.6, baseW * 0.58);
      const pts = fitWalk(rng, inner, p, useSide, bl, 4, curlDir * (0.35 + rng() * 0.8) * (rng() < 0.28 ? -0.7 : 1), 0.34, 0, root, expand);
      const br = addStem(pts, bw, bs, bd, 1);
      stems.push(br);
      branchStems.push(br);
      addLeaves(br, leafLen * 0.82, 0.2, true);

      // a twig off the longer branches
      if (!compact && bl > 90 * U && rng() < 0.75) {
        const u2 = lerp(0.45, 0.7, rng());
        const q = sampleAt(br.sp, u2);
        const a2 = q.ang + (rng() < 0.5 ? 1 : -1) * (0.6 + rng() * 0.4);
        const twig = addStem(fitWalk(rng, inner, q.p, a2, bl * 0.45, 3, (rng() - 0.5) * 1.6, 0.3, 0, root, expand), Math.max(1.3, bw * 0.6), br.s + br.dur * u2 + 0.005, 0.11 + rng() * 0.05, 2);
        addLeaves(twig, leafLen * 0.64, 0.25, true);
      }
    }

    /* ---- roses: main tip first, then the longest branches ---- */
    const roseBase = 92 * U * spec.scale;
    if (spec.roses > 0) addRose(main, roseBase);
    const byLen = [...branchStems].sort((a, b) => b.sp.total - a.sp.total);
    for (let i = 0; i < spec.roses - 1 && i < byLen.length; i++) {
      // the rose replaces the branch's tip leaf
      addRose(byLen[i], roseBase * (0.72 - i * 0.08));
    }

    /* ---- bounding box ---- */
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const grow = (x: number, y: number, r: number) => {
      minX = Math.min(minX, x - r);
      minY = Math.min(minY, y - r);
      maxX = Math.max(maxX, x + r);
      maxY = Math.max(maxY, y + r);
    };
    raw.forEach((r) => r.b.forEach((q) => grow(q.x, q.y, r.w)));
    leaves.forEach((l) => grow(l.x, l.y, l.size * 1.05));
    roses.forEach((r) => grow(r.x, r.y, r.size * 0.75));
    const pad = 14;
    const bx = Math.floor(minX - pad);
    const by = Math.floor(minY - pad);
    const bw = Math.ceil(maxX - minX + pad * 2);
    const bh = Math.ceil(maxY - minY + pad * 2);

    const L = (n: number) => f1(n);
    plants.push({
      id: spec.id,
      layer: spec.layer,
      x: bx,
      y: by,
      w: bw,
      h: bh,
      ox: root.x - bx,
      oy: root.y - by,
      stems: raw.map((r) => ({
        d: `M${L(r.b[0].x - bx)} ${L(r.b[0].y - by)}C${L(r.b[1].x - bx)} ${L(r.b[1].y - by)} ${L(r.b[2].x - bx)} ${L(r.b[2].y - by)} ${L(r.b[3].x - bx)} ${L(r.b[3].y - by)}`,
        w: f1(r.w),
        s: Math.round(r.s * 1e4) / 1e4,
        dur: Math.max(0.0005, Math.round(r.dur * 1e4) / 1e4),
        c: r.c,
      })),
      thorns: thorns.map((t) => ({ ...t, x: L(t.x - bx), y: L(t.y - by) })),
      leaves: leaves.map((l) => ({ ...l, x: L(l.x - bx), y: L(l.y - by), rot: L(l.rot), size: L(l.size) })),
      roses: roses.map((r) => ({ ...r, x: L(r.x - bx), y: L(r.y - by), rot: L(r.rot), size: L(r.size) })),
      period: spec.period,
      offset: spec.offset,
      z0: spec.z0,
      z1: zEnd,
      tilt: spec.tilt,
      phase: si * 1.7,
    });
  });

  return plants;
}

/* ---------------------------------------------------- text measurement */

/** Tight line boxes of an element's text (container-relative). */
export function lineRects(el: Element, origin: DOMRect): Rect[] {
  const range = document.createRange();
  range.selectNodeContents(el);
  return Array.from(range.getClientRects())
    .filter((r) => r.width > 1 && r.height > 1)
    .map((r) => ({ x0: r.left - origin.left, y0: r.top - origin.top, x1: r.right - origin.left, y1: r.bottom - origin.top }));
}

export function summarize(boxes: Rect[][], W: number, H: number): { text: Rect; core: Rect } {
  const flat = boxes.flat();
  if (!flat.length) {
    const c = { x0: W * 0.25, y0: H * 0.45, x1: W * 0.75, y1: H * 0.55 };
    return { text: c, core: c };
  }
  const text: Rect = {
    x0: Math.min(...flat.map((r) => r.x0)),
    y0: Math.min(...flat.map((r) => r.y0)),
    x1: Math.max(...flat.map((r) => r.x1)),
    y1: Math.max(...flat.map((r) => r.y1)),
  };
  const per = boxes.filter((b) => b.length).map((b) => ({
    x0: Math.min(...b.map((r) => r.x0)),
    x1: Math.max(...b.map((r) => r.x1)),
    y1: Math.max(...b.map((r) => r.y1)),
  }));
  let core: Rect = {
    x0: Math.max(...per.map((p) => p.x0)),
    x1: Math.min(...per.map((p) => p.x1)),
    y0: text.y0,
    y1: Math.min(...per.map((p) => p.y1)),
  };
  if (core.x1 - core.x0 < 40) {
    const mid = (text.x0 + text.x1) / 2;
    core = { ...core, x0: mid - 40, x1: mid + 40 };
  }
  return { text, core };
}
