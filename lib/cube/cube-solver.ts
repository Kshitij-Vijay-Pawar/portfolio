import Cube from 'cubejs';
import { MoveNotation, parseMoveString } from './cube-moves';
import { CubeJSONState, validateFaceletString } from './cube-validation';
import type {
  SolverWorkerRequest,
  SolverWorkerResponse,
} from '@/app/workers/cube-solver.worker';

interface PendingRequest {
  resolve: (value: string) => void;
  reject: (reason: Error) => void;
}

class CubeSolverService {
  private worker: Worker | null = null;
  private initPromise: Promise<void> | null = null;
  private isReady = false;
  private fallbackInitialized = false;
  private pending = new Map<string, PendingRequest>();
  private reqCounter = 0;

  /**
   * Initializes the Kociemba two-phase solver once in a Web Worker.
   * Safe to call multiple times; returns the same initialization promise.
   */
  public init(): Promise<void> {
    if (this.isReady) {
      return Promise.resolve();
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      try {
        if (typeof Worker !== 'undefined') {
          this.worker = new Worker(
            new URL('../../app/workers/cube-solver.worker.ts', import.meta.url),
            { type: 'module' }
          );

          this.worker.onmessage = (e: MessageEvent<SolverWorkerResponse>) => {
            this.handleWorkerMessage(e.data);
          };

          this.worker.onerror = (err) => {
            console.warn('Solver Web Worker encountered an error, falling back:', err);
            this.cleanupWorker();
            this.initFallback();
            this.isReady = true;
            resolve();
          };

          const id = this.nextId('init');
          this.pending.set(id, {
            resolve: () => {
              this.isReady = true;
              resolve();
            },
            reject: (err) => {
              this.initPromise = null;
              reject(err);
            },
          });

          const msg: SolverWorkerRequest = { id, cmd: 'init' };
          this.worker.postMessage(msg);
          return;
        }
      } catch (err) {
        console.warn('Could not instantiate Solver Web Worker, using fallback:', err);
      }

      // Fallback if Worker is unavailable
      setTimeout(() => {
        try {
          this.initFallback();
          this.isReady = true;
          resolve();
        } catch (e) {
          this.initPromise = null;
          reject(e instanceof Error ? e : new Error('Failed to initialize solver'));
        }
      }, 16);
    });

    return this.initPromise;
  }

  public getReadyStatus(): boolean {
    return this.isReady;
  }

  /**
   * Computes a Kociemba solution for the given cube state (or facelet string)
   * and verifies that applying the returned solution solves the logical cube.
   */
  public async solve(
    state: CubeJSONState,
    facelets: string,
    maxDepth = 22
  ): Promise<MoveNotation[]> {
    const validation = validateFaceletString(facelets);
    if (!validation.valid) {
      throw new Error(validation.error ?? 'Invalid cube state');
    }

    await this.init();

    // Check if already solved
    const checkCube = new Cube(state);
    if (checkCube.isSolved()) {
      return [];
    }

    let rawAlgorithm = '';

    if (this.worker) {
      const id = this.nextId('solve');
      rawAlgorithm = await new Promise<string>((resolve, reject) => {
        this.pending.set(id, { resolve, reject });
        const msg: SolverWorkerRequest = {
          id,
          cmd: 'solve',
          state,
          facelets,
          maxDepth,
        };
        this.worker!.postMessage(msg);
      });
    } else {
      this.initFallback();
      rawAlgorithm = checkCube.solve(maxDepth) || '';
    }

    const moves = parseMoveString(rawAlgorithm);

    // Verify that the computed solution genuinely solves the logical cube
    const verificationCube = new Cube(state);
    for (const m of moves) {
      verificationCube.move(m);
    }
    if (!verificationCube.isSolved()) {
      throw new Error(
        'Solver verification failed: computed solution did not solve the logical cube.'
      );
    }

    return moves;
  }

  private initFallback(): void {
    if (!this.fallbackInitialized) {
      Cube.initSolver();
      this.fallbackInitialized = true;
    }
  }

  private handleWorkerMessage(data: SolverWorkerResponse): void {
    const pendingReq = this.pending.get(data.id);
    if (!pendingReq) return;
    this.pending.delete(data.id);

    if (data.status === 'error') {
      pendingReq.reject(new Error(data.error ?? 'Unknown solver worker error'));
      return;
    }

    if (data.cmd === 'init') {
      pendingReq.resolve('ok');
    } else {
      pendingReq.resolve(data.algorithm ?? '');
    }
  }

  private cleanupWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  private nextId(prefix: string): string {
    this.reqCounter += 1;
    return `${prefix}_${this.reqCounter}_${Date.now()}`;
  }
}

export const cubeSolver = new CubeSolverService();

