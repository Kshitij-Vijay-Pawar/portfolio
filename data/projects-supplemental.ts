/**
 * Supplemental engineering details for verified projects in app/data/projects.ts.
 * Does NOT duplicate project titles, ids, or baseline metadata.
 * Sourced solely by referencing the verified project id.
 */

export interface ProjectSupplementalInfo {
  projectId: string;
  architecturalHighlights: string[];
  keyChallengesSolved: string[];
  engineeringStackDetails: string[];
}

export const PROJECTS_SUPPLEMENTAL: Record<string, ProjectSupplementalInfo> = {
  codenarts: {
    projectId: "codenarts",
    architecturalHighlights: [
      "Custom WebGL shader pipelines utilizing Three.js and custom GLSL uniforms for fluid ambient distortion.",
      "Synchronized GSAP ScrollTrigger timelines driving camera translation and multi-stage typography reveals.",
      "Strict layout preservation ensuring 60fps frame budgeting during 3D model rotation.",
    ],
    keyChallengesSolved: [
      "Mitigated frame drops during intensive 3D canvas rendering via geometry instancing and dynamic device pixel ratio downscaling.",
      "Seamless integration between React component lifecycles and imperative Three.js render loops.",
    ],
    engineeringStackDetails: [
      "Next.js App Router",
      "Three.js & WebGL",
      "GSAP ScrollTrigger & Timelines",
      "Custom GLSL fragment/vertex shaders",
    ],
  },
  "az-digital": {
    projectId: "az-digital",
    architecturalHighlights: [
      "Modern editorial UI with React 19 concurrent features and fluid page transitions using Motion.",
      "Custom design token architecture structured on Tailwind CSS with high-contrast accessibility standards.",
      "Conversion-optimized responsive layout with micro-interactions and magnetic cursor affordances.",
    ],
    keyChallengesSolved: [
      "Maintained zero-cumulative layout shift (CLS) during high-resolution typography and image asset rehydration.",
      "Engineered performant spring physics for interactive hover cards without DOM thrashing.",
    ],
    engineeringStackDetails: [
      "React 19",
      "Tailwind CSS custom tokens",
      "Motion (Framer Motion v14)",
      "TypeScript strict contracts",
    ],
  },
  amron: {
    projectId: "amron",
    architecturalHighlights: [
      "Cinematic 3D particle simulation driven by Frame Buffer Object (FBO) GPU computation.",
      "Realtime optic post-processing passes creating chromatic aberration and depth-of-field effects.",
      "Interactive physics system reacting smoothly to pointer velocity and scroll acceleration.",
    ],
    keyChallengesSolved: [
      "Optimized thousands of floating particles simultaneously on the GPU via FBO texture ping-ponging without CPU memory bottleneck.",
      "Graceful degradation on mobile GPUs with reduced particle density checks.",
    ],
    engineeringStackDetails: [
      "Three.js & Raw WebGL",
      "FBO (Frame Buffer Object) Compute Shaders",
      "Postprocessing shader passes",
      "Pointer velocity mathematics",
    ],
  },
  chatone: {
    projectId: "chatone",
    architecturalHighlights: [
      "Bi-directional realtime WebSocket communication layer with connection state machine and heartbeat reconnection.",
      "Optimistic UI updates with instant message delivery acknowledgement and pending state reconciliation.",
      "Clean, distraction-free light-themed UI engineered with modular component boundaries.",
    ],
    keyChallengesSolved: [
      "Prevented race conditions during rapid message bursts using client-side sequential queue dispatchers.",
      "Handled automatic reconnection and backoff jitter seamlessly when moving across unstable networks.",
    ],
    engineeringStackDetails: [
      "TypeScript full-stack contracts",
      "Realtime WebSocket protocol",
      "Custom state machine hooks",
      "Tailwind CSS responsive design",
    ],
  },
  finance: {
    projectId: "finance",
    architecturalHighlights: [
      "High-contrast dark mode financial dashboard with real-time SVG charting and data visualizations.",
      "GSAP-driven metric counters and staggered timeline entries for portfolio asset distributions.",
      "Secure banking UI primitives focusing on data hierarchy, typography legibility, and numeric clarity.",
    ],
    keyChallengesSolved: [
      "Eliminated UI lag during real-time chart data recalculation via memoized Canvas and SVG rendering pipelines.",
      "Built resilient monetary formatting and numeric balance transitions with zero rounding errors.",
    ],
    engineeringStackDetails: [
      "Next.js App Router",
      "GSAP data visualization animations",
      "High-density SVG / Canvas charts",
      "Tailwind CSS dark mode tokens",
    ],
  },
};
