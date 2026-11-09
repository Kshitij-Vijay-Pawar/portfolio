import Cube from 'cubejs';
import { FaceName } from './cube-moves';

export interface CubeJSONState {
  center: number[];
  cp: number[];
  co: number[];
  ep: number[];
  eo: number[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const VALID_FACES = new Set<string>(['U', 'R', 'F', 'D', 'L', 'B']);

const EXPECTED_CORNER_COLORS: ReadonlyArray<ReadonlyArray<FaceName>> = [
  ['U', 'R', 'F'],
  ['U', 'F', 'L'],
  ['U', 'L', 'B'],
  ['U', 'B', 'R'],
  ['D', 'F', 'R'],
  ['D', 'L', 'F'],
  ['D', 'B', 'L'],
  ['D', 'R', 'B'],
];

const EXPECTED_EDGE_COLORS: ReadonlyArray<ReadonlyArray<FaceName>> = [
  ['U', 'R'],
  ['U', 'F'],
  ['U', 'L'],
  ['U', 'B'],
  ['D', 'R'],
  ['D', 'F'],
  ['D', 'L'],
  ['D', 'B'],
  ['F', 'R'],
  ['F', 'L'],
  ['B', 'L'],
  ['B', 'R'],
];

const CORNER_FACELETS: ReadonlyArray<ReadonlyArray<number>> = [
  [8, 9, 20],   // URF
  [6, 18, 38],  // UFL
  [0, 36, 47],  // ULB
  [2, 45, 11],  // UBR
  [29, 26, 15], // DFR
  [27, 44, 24], // DLF
  [33, 53, 42], // DBL
  [35, 17, 51], // DRB
];

const EDGE_FACELETS: ReadonlyArray<ReadonlyArray<number>> = [
  [5, 10],  // UR
  [7, 19],  // UF
  [3, 37],  // UL
  [1, 46],  // UB
  [32, 16], // DR
  [28, 25], // DF
  [30, 43], // DL
  [34, 52], // DB
  [23, 12], // FR
  [21, 41], // FL
  [50, 39], // BL
  [48, 14], // BR
];

/**
 * Counts the number of swaps in a permutation array using cycle decomposition.
 */
function getPermutationParity(perm: number[]): number {
  const seen = new Array<boolean>(perm.length).fill(false);
  let swaps = 0;

  for (let i = 0; i < perm.length; i++) {
    if (!seen[i]) {
      let cycleLen = 0;
      let cur = i;
      while (!seen[cur]) {
        seen[cur] = true;
        cycleLen++;
        cur = perm[cur];
      }
      if (cycleLen > 0) {
        swaps += cycleLen - 1;
      }
    }
  }
  return swaps % 2;
}

/**
 * Validates a 54-character facelet string (UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB)
 * for complete mathematical and physical solvability on a standard 3×3 Rubik's Cube.
 */
export function validateFaceletString(facelets: string): ValidationResult {
  if (typeof facelets !== 'string' || facelets.length !== 54) {
    return {
      valid: false,
      error: `Facelet string must be exactly 54 characters (received ${facelets?.length ?? 0}).`,
    };
  }

  const counts: Record<string, number> = { U: 0, R: 0, F: 0, D: 0, L: 0, B: 0 };
  for (let i = 0; i < 54; i++) {
    const ch = facelets[i];
    if (!VALID_FACES.has(ch)) {
      return { valid: false, error: `Invalid facelet character "${ch}" at index ${i}.` };
    }
    counts[ch]++;
  }

  for (const face of ['U', 'R', 'F', 'D', 'L', 'B']) {
    if (counts[face] !== 9) {
      return {
        valid: false,
        error: `Face "${face}" must appear exactly 9 times (found ${counts[face]}).`,
      };
    }
  }

  // Verify center pieces are U, R, F, D, L, B in standard orientation
  const centerIndices = [4, 13, 22, 31, 40, 49];
  const expectedCenters = ['U', 'R', 'F', 'D', 'L', 'B'];
  for (let i = 0; i < 6; i++) {
    if (facelets[centerIndices[i]] !== expectedCenters[i]) {
      return {
        valid: false,
        error: `Center piece at face ${expectedCenters[i]} is "${facelets[centerIndices[i]]}" instead of "${expectedCenters[i]}".`,
      };
    }
  }

  // Verify corners exist and have valid orientations
  const cp = new Array<number>(8).fill(-1);
  const co = new Array<number>(8).fill(0);
  const seenCorners = new Set<number>();

  for (let i = 0; i < 8; i++) {
    const [f0, f1, f2] = CORNER_FACELETS[i].map((idx) => facelets[idx]);
    let ori = -1;
    if (f0 === 'U' || f0 === 'D') ori = 0;
    else if (f1 === 'U' || f1 === 'D') ori = 1;
    else if (f2 === 'U' || f2 === 'D') ori = 2;

    if (ori === -1) {
      return { valid: false, error: `Corner at position ${i} is missing a U/D sticker.` };
    }

    const c0 = [f0, f1, f2][ori];
    const c1 = [f0, f1, f2][(ori + 1) % 3];
    const c2 = [f0, f1, f2][(ori + 2) % 3];

    let matchedCorner = -1;
    for (let j = 0; j < 8; j++) {
      if (
        EXPECTED_CORNER_COLORS[j][0] === c0 &&
        EXPECTED_CORNER_COLORS[j][1] === c1 &&
        EXPECTED_CORNER_COLORS[j][2] === c2
      ) {
        matchedCorner = j;
        break;
      }
    }

    if (matchedCorner === -1) {
      return {
        valid: false,
        error: `Corner at position ${i} has impossible sticker combination (${f0}, ${f1}, ${f2}).`,
      };
    }
    if (seenCorners.has(matchedCorner)) {
      return { valid: false, error: `Duplicate corner piece detected (${matchedCorner}).` };
    }

    seenCorners.add(matchedCorner);
    cp[i] = matchedCorner;
    co[i] = ori;
  }

  // Verify edges exist and have valid orientations
  const ep = new Array<number>(12).fill(-1);
  const eo = new Array<number>(12).fill(0);
  const seenEdges = new Set<number>();

  for (let i = 0; i < 12; i++) {
    const [e0, e1] = EDGE_FACELETS[i].map((idx) => facelets[idx]);
    let matchedEdge = -1;
    let ori = 0;

    for (let j = 0; j < 12; j++) {
      if (EXPECTED_EDGE_COLORS[j][0] === e0 && EXPECTED_EDGE_COLORS[j][1] === e1) {
        matchedEdge = j;
        ori = 0;
        break;
      }
      if (EXPECTED_EDGE_COLORS[j][1] === e0 && EXPECTED_EDGE_COLORS[j][0] === e1) {
        matchedEdge = j;
        ori = 1;
        break;
      }
    }

    if (matchedEdge === -1) {
      return {
        valid: false,
        error: `Edge at position ${i} has invalid sticker pair (${e0}, ${e1}).`,
      };
    }
    if (seenEdges.has(matchedEdge)) {
      return { valid: false, error: `Duplicate edge piece detected (${matchedEdge}).` };
    }

    seenEdges.add(matchedEdge);
    ep[i] = matchedEdge;
    eo[i] = ori;
  }

  // Verify corner orientation sum (must be divisible by 3)
  const cornerOriSum = co.reduce((acc, v) => acc + v, 0);
  if (cornerOriSum % 3 !== 0) {
    return {
      valid: false,
      error: `Invalid corner twist parity (sum = ${cornerOriSum}, not divisible by 3).`,
    };
  }

  // Verify edge orientation sum (must be divisible by 2)
  const edgeOriSum = eo.reduce((acc, v) => acc + v, 0);
  if (edgeOriSum % 2 !== 0) {
    return {
      valid: false,
      error: `Invalid edge flip parity (sum = ${edgeOriSum}, not divisible by 2).`,
    };
  }

  // Verify permutation parity (corner parity must match edge parity)
  const cornerParity = getPermutationParity(cp);
  const edgeParity = getPermutationParity(ep);
  if (cornerParity !== edgeParity) {
    return {
      valid: false,
      error: 'Invalid permutation parity: a single pair of pieces is swapped.',
    };
  }

  // Double-check round-trip with cubejs
  const parsed = Cube.fromString(facelets);
  if (parsed.asString() !== facelets) {
    return {
      valid: false,
      error: 'Facelet string failed round-trip verification with cubejs.',
    };
  }

  return { valid: true };
}

/**
 * Validates that a 3D visual facelet representation matches the logical cubejs facelet string.
 */
export function verifyStateSynchronization(
  logicalFacelets: string,
  visualFacelets: string
): ValidationResult {
  if (logicalFacelets !== visualFacelets) {
    return {
      valid: false,
      error: `State desynchronization detected! Logical: ${logicalFacelets} vs Visual: ${visualFacelets}`,
    };
  }
  return { valid: true };
}

