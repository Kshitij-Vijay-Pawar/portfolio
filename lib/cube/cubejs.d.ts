declare module 'cubejs' {
  export interface CubeJSON {
    center: number[];
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];
  }

  export default class Cube {
    center: number[];
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];

    constructor(other?: Cube | CubeJSON);

    init(state: Cube | CubeJSON): void;
    identity(): void;
    toJSON(): CubeJSON;
    asString(): string;
    clone(): Cube;
    randomize(): Cube;
    isSolved(): boolean;
    move(alg: string | number[] | number): this;
    upright(): string;
    solve(maxDepth?: number): string;

    static fromString(str: string): Cube;
    static random(): Cube;
    static inverse(alg: string): string;
    static inverse(alg: number[]): number[];
    static inverse(alg: number): number;
    static initSolver(): void;
    static scramble(): string;
  }
}

