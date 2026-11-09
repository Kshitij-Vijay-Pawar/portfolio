import Cube from 'cubejs';
import * as THREE from 'three';
import {
  FaceName,
  MOVE_DEFINITIONS,
  MoveNotation,
  parseMoveString,
} from './cube-moves';
import {
  CubeJSONState,
  validateFaceletString,
  verifyStateSynchronization,
} from './cube-validation';

export interface CubieSticker {
  localNormal: [number, number, number];
  face: FaceName;
}

export interface CubieTransform {
  id: string;
  initialGrid: [number, number, number];
  position: [number, number, number]; // Discrete grid coordinates in {-1, 0, 1}
  quaternion: [number, number, number, number]; // [x, y, z, w]
  stickers: CubieSticker[];
}

export interface CubeColors {
  U: string;
  D: string;
  R: string;
  L: string;
  F: string;
  B: string;
  core: string;
}

export const DEFAULT_CUBE_COLORS: CubeColors = {
  U: '#FFFFFF', // White (Up)
  D: '#FFD500', // Yellow (Down)
  R: '#B71234', // Red (Right)
  L: '#FF5800', // Orange (Left)
  F: '#009B48', // Green (Front)
  B: '#0046AD', // Blue (Back)
  core: '#141417', // Dark charcoal plastic body
};

export const SOLVED_FACELET_STRING =
  'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';

/**
 * Creates the initial 26 cubies in their solved positions and orientations.
 */
export function createSolvedCubies(): CubieTransform[] {
  const cubies: CubieTransform[] = [];
  const coords: Array<-1 | 0 | 1> = [-1, 0, 1];

  for (const x of coords) {
    for (const y of coords) {
      for (const z of coords) {
        if (x === 0 && y === 0 && z === 0) continue;

        const stickers: CubieSticker[] = [];
        if (y === 1) stickers.push({ localNormal: [0, 1, 0], face: 'U' });
        if (y === -1) stickers.push({ localNormal: [0, -1, 0], face: 'D' });
        if (x === 1) stickers.push({ localNormal: [1, 0, 0], face: 'R' });
        if (x === -1) stickers.push({ localNormal: [-1, 0, 0], face: 'L' });
        if (z === 1) stickers.push({ localNormal: [0, 0, 1], face: 'F' });
        if (z === -1) stickers.push({ localNormal: [0, 0, -1], face: 'B' });

        cubies.push({
          id: `cubie_${x}_${y}_${z}`,
          initialGrid: [x, y, z],
          position: [x, y, z],
          quaternion: [0, 0, 0, 1],
          stickers,
        });
      }
    }
  }

  return cubies;
}

const _tempVec = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _rotQuat = new THREE.Quaternion();
const _axisVec = new THREE.Vector3();
const _normalVec = new THREE.Vector3();
const _targetDir = new THREE.Vector3();

/**
 * Applies a single move to the 26 cubie transforms, snapping positions to exact integer grid coordinates
 * and normalizing quaternions to prevent floating-point drift.
 */
export function applyMoveToCubies(
  cubies: CubieTransform[],
  move: MoveNotation
): CubieTransform[] {
  const def = MOVE_DEFINITIONS[move];
  _axisVec.set(
    def.axis === 'x' ? 1 : 0,
    def.axis === 'y' ? 1 : 0,
    def.axis === 'z' ? 1 : 0
  );
  _rotQuat.setFromAxisAngle(_axisVec, def.angle);

  const axisIdx = def.axis === 'x' ? 0 : def.axis === 'y' ? 1 : 2;

  return cubies.map((cubie) => {
    if (Math.round(cubie.position[axisIdx]) !== def.layerCoord) {
      return cubie;
    }

    _tempVec.set(cubie.position[0], cubie.position[1], cubie.position[2]);
    _tempVec.applyQuaternion(_rotQuat);

    _tempQuat.set(
      cubie.quaternion[0],
      cubie.quaternion[1],
      cubie.quaternion[2],
      cubie.quaternion[3]
    );
    _tempQuat.premultiply(_rotQuat);
    _tempQuat.normalize();

    return {
      ...cubie,
      position: [
        Math.round(_tempVec.x),
        Math.round(_tempVec.y),
        Math.round(_tempVec.z),
      ],
      quaternion: [_tempQuat.x, _tempQuat.y, _tempQuat.z, _tempQuat.w],
    };
  });
}

/**
 * Extracts the 54-character facelet string from the 26 3D cubie transforms
 * in exact Kociemba / cubejs facelet order (U1..U9, R1..R9, F1..F9, D1..D9, L1..L9, B1..B9).
 * Used exclusively to verify that the 3D visual state matches the logical cubejs state.
 */
export function extractFaceletsFromCubies(cubies: CubieTransform[]): string {
  const queries: Array<{ pos: [number, number, number]; dir: [number, number, number] }> = [];

  // U: y = 1, z from -1 to 1, x from -1 to 1
  for (const z of [-1, 0, 1]) {
    for (const x of [-1, 0, 1]) {
      queries.push({ pos: [x, 1, z], dir: [0, 1, 0] });
    }
  }
  // R: x = 1, y from 1 to -1, z from 1 to -1
  for (const y of [1, 0, -1]) {
    for (const z of [1, 0, -1]) {
      queries.push({ pos: [1, y, z], dir: [1, 0, 0] });
    }
  }
  // F: z = 1, y from 1 to -1, x from -1 to 1
  for (const y of [1, 0, -1]) {
    for (const x of [-1, 0, 1]) {
      queries.push({ pos: [x, y, 1], dir: [0, 0, 1] });
    }
  }
  // D: y = -1, z from 1 to -1, x from -1 to 1
  for (const z of [1, 0, -1]) {
    for (const x of [-1, 0, 1]) {
      queries.push({ pos: [x, -1, z], dir: [0, -1, 0] });
    }
  }
  // L: x = -1, y from 1 to -1, z from -1 to 1
  for (const y of [1, 0, -1]) {
    for (const z of [-1, 0, 1]) {
      queries.push({ pos: [-1, y, z], dir: [-1, 0, 0] });
    }
  }
  // B: z = -1, y from 1 to -1, x from 1 to -1
  for (const y of [1, 0, -1]) {
    for (const x of [1, 0, -1]) {
      queries.push({ pos: [x, y, -1], dir: [0, 0, -1] });
    }
  }

  let faceletStr = '';
  for (const q of queries) {
    const cubie = cubies.find(
      (c) =>
        c.position[0] === q.pos[0] &&
        c.position[1] === q.pos[1] &&
        c.position[2] === q.pos[2]
    );
    if (!cubie) {
      throw new Error(`Missing cubie at grid position [${q.pos.join(', ')}]`);
    }

    _targetDir.set(q.dir[0], q.dir[1], q.dir[2]);
    _tempQuat.set(
      cubie.quaternion[0],
      cubie.quaternion[1],
      cubie.quaternion[2],
      cubie.quaternion[3]
    );

    let foundFace: FaceName | null = null;
    for (const sticker of cubie.stickers) {
      _normalVec.set(
        sticker.localNormal[0],
        sticker.localNormal[1],
        sticker.localNormal[2]
      );
      _normalVec.applyQuaternion(_tempQuat);
      if (_normalVec.distanceTo(_targetDir) < 0.15) {
        foundFace = sticker.face;
        break;
      }
    }

    if (!foundFace) {
      throw new Error(
        `Missing sticker facing [${q.dir.join(', ')}] on cubie at [${q.pos.join(', ')}]`
      );
    }
    faceletStr += foundFace;
  }

  return faceletStr;
}

/**
 * Immutable snapshot of synchronized logical (cubejs) and 3D cubie states.
 */
export class CubeStateManager {
  private cube: Cube;
  private cubies: CubieTransform[];

  constructor(initialScramble?: string) {
    this.cube = new Cube();
    this.cubies = createSolvedCubies();

    if (initialScramble && initialScramble.trim()) {
      const moves = parseMoveString(initialScramble);
      for (const m of moves) {
        this.applyMove(m);
      }
    }
  }

  /**
   * Applies a single move to both the logical cubejs instance and the 3D cubie transforms,
   * and verifies synchronization.
   */
  public applyMove(move: MoveNotation): void {
    this.cube.move(move);
    this.cubies = applyMoveToCubies(this.cubies, move);

    const logical = this.cube.asString();
    const visual = extractFaceletsFromCubies(this.cubies);
    const sync = verifyStateSynchronization(logical, visual);
    if (!sync.valid) {
      throw new Error(sync.error);
    }
  }

  /**
   * Applies a sequence of moves.
   */
  public applyMoves(moves: MoveNotation[]): void {
    for (const m of moves) {
      this.applyMove(m);
    }
  }

  /**
   * Resets both logical and 3D states to the solved identity cube.
   */
  public reset(): void {
    this.cube.identity();
    this.cubies = createSolvedCubies();
  }

  public isSolved(): boolean {
    return this.cube.isSolved();
  }

  public asFaceletString(): string {
    return this.cube.asString();
  }

  public toJSON(): CubeJSONState {
    return this.cube.toJSON() as CubeJSONState;
  }

  public getCubies(): CubieTransform[] {
    return this.cubies;
  }

  public validate(): { valid: boolean; error?: string } {
    const logical = this.cube.asString();
    const visual = extractFaceletsFromCubies(this.cubies);
    const syncCheck = verifyStateSynchronization(logical, visual);
    if (!syncCheck.valid) return syncCheck;
    return validateFaceletString(logical);
  }
}

