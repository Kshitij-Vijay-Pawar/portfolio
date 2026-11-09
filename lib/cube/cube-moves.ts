export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export type MoveNotation =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'R' | "R'" | 'R2'
  | 'L' | "L'" | 'L2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2';

export interface MoveDefinition {
  notation: MoveNotation;
  face: FaceName;
  axis: 'x' | 'y' | 'z';
  layerCoord: -1 | 1;
  angle: number; // Radians in right-handed Three.js coordinate system (+X=R, +Y=U, +Z=F)
  quarterTurns: 1 | 2;
  inverse: MoveNotation;
  description: string;
}

const HALF_PI = Math.PI / 2;

export const MOVE_DEFINITIONS: Record<MoveNotation, MoveDefinition> = {
  U: {
    notation: 'U',
    face: 'U',
    axis: 'y',
    layerCoord: 1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: "U'",
    description: 'Up clockwise',
  },
  "U'": {
    notation: "U'",
    face: 'U',
    axis: 'y',
    layerCoord: 1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: 'U',
    description: 'Up counter-clockwise',
  },
  U2: {
    notation: 'U2',
    face: 'U',
    axis: 'y',
    layerCoord: 1,
    angle: -Math.PI,
    quarterTurns: 2,
    inverse: 'U2',
    description: 'Up 180°',
  },
  D: {
    notation: 'D',
    face: 'D',
    axis: 'y',
    layerCoord: -1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: "D'",
    description: 'Down clockwise',
  },
  "D'": {
    notation: "D'",
    face: 'D',
    axis: 'y',
    layerCoord: -1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: 'D',
    description: 'Down counter-clockwise',
  },
  D2: {
    notation: 'D2',
    face: 'D',
    axis: 'y',
    layerCoord: -1,
    angle: Math.PI,
    quarterTurns: 2,
    inverse: 'D2',
    description: 'Down 180°',
  },
  R: {
    notation: 'R',
    face: 'R',
    axis: 'x',
    layerCoord: 1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: "R'",
    description: 'Right clockwise',
  },
  "R'": {
    notation: "R'",
    face: 'R',
    axis: 'x',
    layerCoord: 1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: 'R',
    description: 'Right counter-clockwise',
  },
  R2: {
    notation: 'R2',
    face: 'R',
    axis: 'x',
    layerCoord: 1,
    angle: -Math.PI,
    quarterTurns: 2,
    inverse: 'R2',
    description: 'Right 180°',
  },
  L: {
    notation: 'L',
    face: 'L',
    axis: 'x',
    layerCoord: -1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: "L'",
    description: 'Left clockwise',
  },
  "L'": {
    notation: "L'",
    face: 'L',
    axis: 'x',
    layerCoord: -1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: 'L',
    description: 'Left counter-clockwise',
  },
  L2: {
    notation: 'L2',
    face: 'L',
    axis: 'x',
    layerCoord: -1,
    angle: Math.PI,
    quarterTurns: 2,
    inverse: 'L2',
    description: 'Left 180°',
  },
  F: {
    notation: 'F',
    face: 'F',
    axis: 'z',
    layerCoord: 1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: "F'",
    description: 'Front clockwise',
  },
  "F'": {
    notation: "F'",
    face: 'F',
    axis: 'z',
    layerCoord: 1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: 'F',
    description: 'Front counter-clockwise',
  },
  F2: {
    notation: 'F2',
    face: 'F',
    axis: 'z',
    layerCoord: 1,
    angle: -Math.PI,
    quarterTurns: 2,
    inverse: 'F2',
    description: 'Front 180°',
  },
  B: {
    notation: 'B',
    face: 'B',
    axis: 'z',
    layerCoord: -1,
    angle: HALF_PI,
    quarterTurns: 1,
    inverse: "B'",
    description: 'Back clockwise',
  },
  "B'": {
    notation: "B'",
    face: 'B',
    axis: 'z',
    layerCoord: -1,
    angle: -HALF_PI,
    quarterTurns: 1,
    inverse: 'B',
    description: 'Back counter-clockwise',
  },
  B2: {
    notation: 'B2',
    face: 'B',
    axis: 'z',
    layerCoord: -1,
    angle: Math.PI,
    quarterTurns: 2,
    inverse: 'B2',
    description: 'Back 180°',
  },
};

export const ALL_MOVES: MoveNotation[] = Object.keys(MOVE_DEFINITIONS) as MoveNotation[];

export const BASIC_FACES: FaceName[] = ['U', 'D', 'L', 'R', 'F', 'B'];

export function isValidMoveNotation(str: string): str is MoveNotation {
  return Object.prototype.hasOwnProperty.call(MOVE_DEFINITIONS, str);
}

/**
 * Parses an algorithm string (e.g. "R U R' U' F2") into an array of validated MoveNotation tokens.
 */
export function parseMoveString(algorithm: string): MoveNotation[] {
  if (!algorithm || !algorithm.trim()) return [];
  const tokens = algorithm
    .trim()
    .replace(/’/g, "'")
    .split(/\s+/);
  const moves: MoveNotation[] = [];
  for (const token of tokens) {
    if (!token) continue;
    if (!isValidMoveNotation(token)) {
      throw new Error(`Invalid Rubik's Cube move notation: "${token}"`);
    }
    moves.push(token);
  }
  return moves;
}

/**
 * Returns the inverse of a single move notation.
 */
export function getInverseMove(move: MoveNotation): MoveNotation {
  return MOVE_DEFINITIONS[move].inverse;
}

/**
 * Returns the inverse of a sequence of moves.
 */
export function getInverseSequence(moves: MoveNotation[]): MoveNotation[] {
  return [...moves].reverse().map(getInverseMove);
}

/**
 * Generates a high-quality random scramble sequence of specified length,
 * avoiding redundant moves on the same face or opposite parallel faces consecutively.
 */
export function generateRandomScrambleMoves(length = 20): MoveNotation[] {
  const modifiers: Array<'' | "'" | '2'> = ['', "'", '2'];
  const oppositeFace: Record<FaceName, FaceName> = {
    U: 'D',
    D: 'U',
    R: 'L',
    L: 'R',
    F: 'B',
    B: 'F',
  };

  const result: MoveNotation[] = [];
  let lastFace: FaceName | null = null;
  let secondLastFace: FaceName | null = null;

  for (let i = 0; i < length; i++) {
    const candidates = BASIC_FACES.filter((face) => {
      if (face === lastFace) return false;
      if (lastFace && secondLastFace && face === secondLastFace && oppositeFace[face] === lastFace) {
        return false;
      }
      return true;
    });

    const chosenFace = candidates[Math.floor(Math.random() * candidates.length)];
    const chosenMod = modifiers[Math.floor(Math.random() * modifiers.length)];
    const move = `${chosenFace}${chosenMod}` as MoveNotation;

    result.push(move);
    secondLastFace = lastFace;
    lastFace = chosenFace;
  }

  return result;
}

