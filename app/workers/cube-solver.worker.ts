/// <reference lib="webworker" />

import Cube from 'cubejs';
import type { CubeJSONState } from '@/lib/cube/cube-validation';

export type SolverWorkerRequest =
  | {
      id: string;
      cmd: 'init';
    }
  | {
      id: string;
      cmd: 'solve';
      state?: CubeJSONState;
      facelets?: string;
      maxDepth?: number;
    }
  | {
      id: string;
      cmd: 'scramble';
    };

export type SolverWorkerResponse =
  | {
      id: string;
      cmd: 'init';
      status: 'ok' | 'error';
      error?: string;
    }
  | {
      id: string;
      cmd: 'solve';
      status: 'ok' | 'error';
      algorithm?: string;
      error?: string;
    }
  | {
      id: string;
      cmd: 'scramble';
      status: 'ok' | 'error';
      algorithm?: string;
      error?: string;
    };

let isInitialized = false;

function ensureInitialized(): void {
  if (!isInitialized) {
    Cube.initSolver();
    isInitialized = true;
  }
}

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<SolverWorkerRequest>) => {
  const data = event.data;
  if (!data || !data.cmd) return;

  try {
    switch (data.cmd) {
      case 'init': {
        ensureInitialized();
        const response: SolverWorkerResponse = {
          id: data.id,
          cmd: 'init',
          status: 'ok',
        };
        ctx.postMessage(response);
        break;
      }

      case 'solve': {
        ensureInitialized();
        let cube: Cube;
        if (data.facelets) {
          cube = Cube.fromString(data.facelets);
        } else if (data.state) {
          cube = new Cube(data.state);
        } else {
          throw new Error('Missing cube state or facelet string for solving.');
        }

        if (cube.isSolved()) {
          const response: SolverWorkerResponse = {
            id: data.id,
            cmd: 'solve',
            status: 'ok',
            algorithm: '',
          };
          ctx.postMessage(response);
          break;
        }

        const rawSolution = cube.solve(data.maxDepth ?? 22);
        const response: SolverWorkerResponse = {
          id: data.id,
          cmd: 'solve',
          status: 'ok',
          algorithm: rawSolution ? rawSolution.trim() : '',
        };
        ctx.postMessage(response);
        break;
      }

      case 'scramble': {
        ensureInitialized();
        const scrambleAlg = Cube.scramble();
        const response: SolverWorkerResponse = {
          id: data.id,
          cmd: 'scramble',
          status: 'ok',
          algorithm: scrambleAlg ? scrambleAlg.trim() : '',
        };
        ctx.postMessage(response);
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown worker error';
    ctx.postMessage({
      id: data.id,
      cmd: data.cmd,
      status: 'error',
      error: message,
    } satisfies SolverWorkerResponse);
  }
};

