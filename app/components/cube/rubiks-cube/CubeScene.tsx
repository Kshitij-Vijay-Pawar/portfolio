'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CubeColors,
  CubieSticker,
  CubieTransform,
  DEFAULT_CUBE_COLORS,
} from '@/lib/cube/cube-state';
import {
  FaceName,
  MOVE_DEFINITIONS,
  MoveNotation,
} from '@/lib/cube/cube-moves';

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [4.6, 3.8, 5.2];

export interface ActiveMoveAnimation {
  move: MoveNotation;
  durationMs: number;
}

export interface CubeSceneProps {
  cubies: CubieTransform[];
  activeAnimation: ActiveMoveAnimation | null;
  onAnimationComplete: (move: MoveNotation) => void;
  onInteractiveMove?: (move: MoveNotation) => void;
  /** Fired when user starts orbiting the whole cube or dragging a face */
  onUserInteractStart?: () => void;
  /** Fired when user finishes orbiting the whole cube or releasing pointer */
  onUserInteractEnd?: () => void;
  /** Fired when user single-clicks on the 3D cube without dragging */
  onCubeClick?: () => void;
  /** Enable interactive hover tilt & float reaction when pointer moves over the cube */
  hoverTilt?: boolean;
  /** Increment to smoothly animate the camera back to the default orientation */
  resetCameraToken?: number;
  /** Enable mouse-wheel / pinch zoom (default: true) */
  enableZoom?: boolean;
  colors?: Partial<CubeColors>;
  cubeSize?: number;
  interactive?: boolean;
}

interface DragStartInfo {
  pointerId: number;
  faceNormal: THREE.Vector3;
  cubiePosition: [number, number, number];
  hitPoint: THREE.Vector3;
  screenX: number;
  screenY: number;
}

const CUBIE_GAP = 0.96; // Slightly less than 1.0 so cubies have a realistic seam
const STICKER_SIZE = 0.82;
const STICKER_OFFSET = 0.485;

/**
 * Determines which Rubik's Cube move corresponds to a 3D swipe vector on a clicked face.
 * Projects the swipe onto the face's tangent plane and resolves all 6 outer faces (U, D, L, R, F, B).
 */
function resolveSwipeMove(
  faceNormal: THREE.Vector3,
  cubiePos: [number, number, number],
  worldSwipeDir: THREE.Vector3
): MoveNotation | null {
  // Project swipe onto the tangent plane of the clicked face so camera perspective skew doesn't corrupt the axis
  const tangentSwipe = worldSwipeDir
    .clone()
    .sub(faceNormal.clone().multiplyScalar(worldSwipeDir.dot(faceNormal)));
  if (tangentSwipe.lengthSq() < 1e-6) return null;
  tangentSwipe.normalize();

  // Rotation axis is perpendicular to both the face normal and the tangent swipe direction:
  // torque = normal × tangentSwipe
  const torque = new THREE.Vector3().crossVectors(faceNormal, tangentSwipe);
  if (torque.lengthSq() < 1e-5) return null;

  // Zero out the component along the face normal so we strictly pick one of the two orthogonal rotation axes
  if (Math.abs(faceNormal.x) > 0.5) torque.x = 0;
  if (Math.abs(faceNormal.y) > 0.5) torque.y = 0;
  if (Math.abs(faceNormal.z) > 0.5) torque.z = 0;

  // Pick dominant principal axis (x, y, or z)
  const ax = Math.abs(torque.x);
  const ay = Math.abs(torque.y);
  const az = Math.abs(torque.z);

  let axis: 'x' | 'y' | 'z';
  let sign: number;
  let layerCoord: number;

  if (ax >= ay && ax >= az) {
    axis = 'x';
    sign = Math.sign(torque.x);
    layerCoord = Math.round(cubiePos[0]);
  } else if (ay >= ax && ay >= az) {
    axis = 'y';
    sign = Math.sign(torque.y);
    layerCoord = Math.round(cubiePos[1]);
  } else {
    axis = 'z';
    sign = Math.sign(torque.z);
    layerCoord = Math.round(cubiePos[2]);
  }

  // Only outer layers (-1 or +1) correspond to standard U, D, L, R, F, B moves.
  // If the user swiped a center or edge cubie with layerCoord === 0 on the chosen axis,
  // snap to the non-zero outer layer of the cubie or clicked face so every drag produces a responsive outer-face turn.
  if (layerCoord === 0) {
    if (axis === 'x' && Math.round(faceNormal.x) !== 0) {
      layerCoord = Math.round(faceNormal.x);
    } else if (axis === 'y' && Math.round(faceNormal.y) !== 0) {
      layerCoord = Math.round(faceNormal.y);
    } else if (axis === 'z' && Math.round(faceNormal.z) !== 0) {
      layerCoord = Math.round(faceNormal.z);
    } else {
      // User dragged across a center/middle slice: turn the clicked outer face itself
      const nx = Math.round(faceNormal.x);
      const ny = Math.round(faceNormal.y);
      const nz = Math.round(faceNormal.z);
      if (nx !== 0) {
        axis = 'x';
        layerCoord = nx;
        sign = (tangentSwipe.y * nx + tangentSwipe.z * nx) >= 0 ? 1 : -1;
      } else if (ny !== 0) {
        axis = 'y';
        layerCoord = ny;
        sign = (tangentSwipe.x * ny - tangentSwipe.z * ny) >= 0 ? 1 : -1;
      } else if (nz !== 0) {
        axis = 'z';
        layerCoord = nz;
        sign = (-tangentSwipe.x * nz + tangentSwipe.y * nz) >= 0 ? 1 : -1;
      } else {
        return null;
      }
    }
  }

  // Find the 90-degree move matching (axis, layerCoord, sign of angle)
  for (const def of Object.values(MOVE_DEFINITIONS)) {
    if (
      def.quarterTurns === 1 &&
      def.axis === axis &&
      def.layerCoord === layerCoord &&
      Math.sign(def.angle) === sign
    ) {
      return def.notation;
    }
  }

  return null;
}

/**
 * Helper to compute sticker local position and Euler rotation from its local normal.
 */
function getStickerTransform(normal: [number, number, number]): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  const [nx, ny, nz] = normal;
  const position: [number, number, number] = [
    nx * STICKER_OFFSET,
    ny * STICKER_OFFSET,
    nz * STICKER_OFFSET,
  ];

  if (nx === 1) return { position, rotation: [0, Math.PI / 2, 0] };
  if (nx === -1) return { position, rotation: [0, -Math.PI / 2, 0] };
  if (ny === 1) return { position, rotation: [-Math.PI / 2, 0, 0] };
  if (ny === -1) return { position, rotation: [Math.PI / 2, 0, 0] };
  if (nz === 1) return { position, rotation: [0, 0, 0] };
  return { position, rotation: [0, Math.PI, 0] };
}

interface CubeMeshGroupProps {
  cubies: CubieTransform[];
  activeAnimation: ActiveMoveAnimation | null;
  onAnimationComplete: (move: MoveNotation) => void;
  onInteractiveMove?: (move: MoveNotation) => void;
  palette: CubeColors;
  scale: number;
  interactive: boolean;
  orbitRef: React.RefObject<OrbitControlsImpl | null>;
  hoverTilt: boolean;
  onUserInteractStart?: () => void;
  onUserInteractEnd?: () => void;
  onCubeClick?: () => void;
}

function CubeMeshGroup({
  cubies,
  activeAnimation,
  onAnimationComplete,
  onInteractiveMove,
  palette,
  scale,
  interactive,
  orbitRef,
  hoverTilt,
  onUserInteractStart,
  onUserInteractEnd,
  onCubeClick,
}: CubeMeshGroupProps) {
  const { camera, gl } = useThree();
  const tiltRef = useRef<THREE.Group>(null);
  const hoverRef = useRef(false);
  const tiltTarget = useRef({ x: 0, y: 0 });

  // Shared geometries and materials across all 26 cubies and 54 stickers
  const stickerGeometry = useMemo(
    () => new THREE.PlaneGeometry(STICKER_SIZE, STICKER_SIZE),
    []
  );

  // ONE shared rounded body geometry for all 26 cubies. Cubies move between the
  // rotating and static groups (React remounts them), so per-cubie geometry would
  // be rebuilt on every move and cause visible flicker.
  const bodyGeometry = useMemo(
    () => new RoundedBoxGeometry(CUBIE_GAP, CUBIE_GAP, CUBIE_GAP, 4, 0.075),
    []
  );
  useEffect(() => () => bodyGeometry.dispose(), [bodyGeometry]);

  const materials = useMemo(() => {
    const createStickerMat = (hex: string) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness: 0.22,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });

    return {
      core: new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.core),
        roughness: 0.35,
        metalness: 0.12,
      }),
      U: createStickerMat(palette.U),
      D: createStickerMat(palette.D),
      R: createStickerMat(palette.R),
      L: createStickerMat(palette.L),
      F: createStickerMat(palette.F),
      B: createStickerMat(palette.B),
    };
  }, [palette]);

  // Proper Three.js resource cleanup on unmount or material recreation
  useEffect(() => {
    return () => {
      stickerGeometry.dispose();
    };
  }, [stickerGeometry]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  const dragStartRef = useRef<DragStartInfo | null>(null);

  // Animation pivot ref & progress tracking
  const pivotRef = useRef<THREE.Group>(null);
  const animProgressRef = useRef<number>(0);
  const completedAnimRef = useRef<ActiveMoveAnimation | null>(null);

  // Layout effects run synchronously inside the React commit, i.e. BEFORE the next
  // render-loop frame. (A passive useEffect can lag a frame behind: the next move
  // would then inherit progress=1 from the previous one and snap instantly, and
  // the new layer would flash at the previous move's final angle.)
  useLayoutEffect(() => {
    animProgressRef.current = 0;
    completedAnimRef.current = null;
  }, [activeAnimation]);

  useLayoutEffect(() => {
    if (pivotRef.current) {
      pivotRef.current.rotation.set(0, 0, 0);
    }
  }, [activeAnimation, cubies]);

  useFrame((state, delta) => {
    if (tiltRef.current && hoverTilt) {
      const g = tiltRef.current;
      // Freeze the tilt target while a face is being dragged so drag math stays stable
      if (!dragStartRef.current) {
        if (hoverRef.current) {
          tiltTarget.current.x = -state.pointer.y * 0.28;
          tiltTarget.current.y = state.pointer.x * 0.4;
        } else {
          tiltTarget.current.x = 0;
          tiltTarget.current.y = 0;
        }
      }
      const k = 1 - Math.exp(-delta * 7);
      const bob = hoverRef.current ? Math.sin(state.clock.elapsedTime * 2.2) * 0.04 : 0;
      g.rotation.x += (tiltTarget.current.x - g.rotation.x) * k;
      g.rotation.y += (tiltTarget.current.y - g.rotation.y) * k;
      g.position.y += (bob - g.position.y) * k;
      const sc = hoverRef.current ? 1.06 : 1;
      g.scale.setScalar(g.scale.x + (sc - g.scale.x) * k);
    }
    if (!activeAnimation || !pivotRef.current) return;
    if (completedAnimRef.current === activeAnimation) return;

    const def = MOVE_DEFINITIONS[activeAnimation.move];
    // Double turns take slightly longer (1.25x) for smooth visual clarity
    const effectiveDurationSec =
      (Math.max(40, activeAnimation.durationMs) *
        (def.quarterTurns === 2 ? 1.25 : 1)) /
      1000;

    animProgressRef.current += delta / effectiveDurationSec;

    if (animProgressRef.current >= 1) {
      animProgressRef.current = 1;
      pivotRef.current.rotation.set(
        def.axis === 'x' ? def.angle : 0,
        def.axis === 'y' ? def.angle : 0,
        def.axis === 'z' ? def.angle : 0
      );
      completedAnimRef.current = activeAnimation;
      onAnimationComplete(activeAnimation.move);
      return;
    }

    // Smooth cubic ease-in-out
    const t = animProgressRef.current;
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const currentAngle = def.angle * eased;

    pivotRef.current.rotation.set(
      def.axis === 'x' ? currentAngle : 0,
      def.axis === 'y' ? currentAngle : 0,
      def.axis === 'z' ? currentAngle : 0
    );
  });

  // Interactive face drag state
  const [hoveredCubieId, setHoveredCubieId] = useState<string | null>(null);

  useEffect(() => {
    const domElement = gl.domElement;

    const handlePointerMove = (e: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start || e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.screenX;
      const dy = e.clientY - start.screenY;
      const dist = Math.hypot(dx, dy);

      // Require at least 14px drag to trigger a face turn
      if (dist < 14) return;

      // Project screen drag vector into 3D world tangent plane at hitPoint
      const rect = domElement.getBoundingClientRect();
      const ndcStart = new THREE.Vector3(
        ((start.screenX - rect.left) / rect.width) * 2 - 1,
        -((start.screenY - rect.top) / rect.height) * 2 + 1,
        0.5
      );
      const ndcEnd = new THREE.Vector3(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
        0.5
      );

      ndcStart.unproject(camera);
      ndcEnd.unproject(camera);

      const worldSwipe = ndcEnd.sub(ndcStart).normalize();
      const move = resolveSwipeMove(
        start.faceNormal,
        start.cubiePosition,
        worldSwipe
      );

      dragStartRef.current = null;
      if (orbitRef.current) {
        orbitRef.current.enabled = true;
      }

      if (move && onInteractiveMove) {
        onInteractiveMove(move);
      }
      onUserInteractEnd?.();
    };

    const handlePointerUp = (e: PointerEvent) => {
      const start = dragStartRef.current;
      if (start && e.pointerId === start.pointerId) {
        dragStartRef.current = null;
        if (orbitRef.current) {
          orbitRef.current.enabled = true;
        }
        const moved = Math.hypot(e.clientX - start.screenX, e.clientY - start.screenY);
        if (moved < 6 && e.button === 0 && onCubeClick) {
          onCubeClick();
        }
        onUserInteractEnd?.();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [camera, gl.domElement, onInteractiveMove, orbitRef, onCubeClick, onUserInteractEnd]);

  const handleCubiePointerDown = (
    e: ThreeEvent<PointerEvent>,
    cubie: CubieTransform
  ) => {
    if (!interactive || activeAnimation) return;
    e.stopPropagation();

    if (!e.face || e.button !== 0) return;
    onUserInteractStart?.();

    // Transform the local face normal to world space and snap to principal axis
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(e.object.matrixWorld);
    const worldNormal = e.face.normal.clone().applyMatrix3(normalMatrix).normalize();

    const ax = Math.abs(worldNormal.x);
    const ay = Math.abs(worldNormal.y);
    const az = Math.abs(worldNormal.z);
    const snappedNormal = new THREE.Vector3(
      ax >= ay && ax >= az ? Math.sign(worldNormal.x) : 0,
      ay > ax && ay >= az ? Math.sign(worldNormal.y) : 0,
      az > ax && az > ay ? Math.sign(worldNormal.z) : 0
    );

    if (orbitRef.current) {
      orbitRef.current.enabled = false;
    }

    dragStartRef.current = {
      pointerId: e.pointerId,
      faceNormal: snappedNormal,
      cubiePosition: cubie.position,
      hitPoint: e.point.clone(),
      screenX: e.clientX,
      screenY: e.clientY,
    };
  };

  // Partition cubies into rotating layer vs stationary cubies
  const activeDef = activeAnimation
    ? MOVE_DEFINITIONS[activeAnimation.move]
    : null;
  const axisIdx =
    activeDef?.axis === 'x'
      ? 0
      : activeDef?.axis === 'y'
        ? 1
        : activeDef?.axis === 'z'
          ? 2
          : -1;

  const rotatingCubies: CubieTransform[] = [];
  const staticCubies: CubieTransform[] = [];

  for (const c of cubies) {
    if (activeDef && axisIdx !== -1 && c.position[axisIdx] === activeDef.layerCoord) {
      rotatingCubies.push(c);
    } else {
      staticCubies.push(c);
    }
  }

  const renderCubie = (cubie: CubieTransform) => (
    <group
      key={cubie.id}
      position={cubie.position}
      quaternion={cubie.quaternion}
      onPointerDown={(e) => handleCubiePointerDown(e, cubie)}
      onPointerOver={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        hoverRef.current = true;
        setHoveredCubieId(cubie.id);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        hoverRef.current = false;
        if (!interactive) return;
        setHoveredCubieId((prev) => (prev === cubie.id ? null : prev));
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh
        geometry={bodyGeometry}
        material={materials.core}
        castShadow
        receiveShadow
      />
      {cubie.stickers.map((sticker: CubieSticker) => {
        const { position, rotation } = getStickerTransform(sticker.localNormal);
        const mat = materials[sticker.face as FaceName];
        return (
          <mesh
            key={`${cubie.id}_${sticker.face}`}
            geometry={stickerGeometry}
            material={mat}
            position={position}
            rotation={rotation}
          />
        );
      })}
    </group>
  );

  // Maintain hovered cursor state cleanly on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredCubieId]);

  return (
    <group scale={scale}>
      <group ref={tiltRef}>
        <group ref={pivotRef}>{rotatingCubies.map(renderCubie)}</group>
        <group>{staticCubies.map(renderCubie)}</group>
      </group>
    </group>
  );
}

function CameraResetter({ token }: { token: number }) {
  const { camera, controls } = useThree();
  const anim = useRef<{ t: number; from: THREE.Vector3; fromLen: number; toLen: number } | null>(null);
  const lastToken = useRef(token);
  const dest = useMemo(() => new THREE.Vector3(...DEFAULT_CAMERA_POSITION), []);

  useEffect(() => {
    if (token === lastToken.current) return;
    lastToken.current = token;
    // Already at the default view: nothing to animate
    if (camera.position.distanceTo(dest) < 0.02) return;
    const c = controls as unknown as OrbitControlsImpl | null;
    if (c) {
      // Kill leftover damping inertia and lock input so the glide is perfectly smooth
      c.enableDamping = false;
      c.enabled = false;
    }
    anim.current = {
      t: 0,
      from: camera.position.clone().normalize(),
      fromLen: camera.position.length(),
      toLen: dest.length(),
    };
  }, [token, camera, dest, controls]);

  useFrame((_, delta) => {
    const a = anim.current;
    if (!a) return;
    a.t = Math.min(1, a.t + Math.min(delta, 1 / 30) / 1.6);
    const e = -(Math.cos(Math.PI * a.t) - 1) / 2;
    const dir = a.from.clone().lerp(dest.clone().normalize(), e).normalize();
    const len = a.fromLen + (a.toLen - a.fromLen) * e;
    camera.position.copy(dir.multiplyScalar(len));
    camera.lookAt(0, 0, 0);
    (controls as unknown as OrbitControlsImpl | null)?.update();
    if (a.t >= 1) {
      anim.current = null;
      const c = controls as unknown as OrbitControlsImpl | null;
      if (c) {
        c.enableDamping = true;
        c.enabled = true;
      }
    }
  });
  return null;
}

export default function CubeScene({
  cubies,
  activeAnimation,
  onAnimationComplete,
  onInteractiveMove,
  colors,
  cubeSize = 1,
  interactive = true,
  onUserInteractStart,
  onUserInteractEnd,
  onCubeClick,
  hoverTilt = false,
  enableZoom = true,
  resetCameraToken = 0,
}: CubeSceneProps) {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);

  const palette: CubeColors = useMemo(
    () => ({
      ...DEFAULT_CUBE_COLORS,
      ...colors,
    }),
    [colors]
  );

  return (
    <div className="relative h-full w-full select-none touch-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: DEFAULT_CAMERA_POSITION, fov: 40, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[8, 12, 8]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-8, -6, -8]} intensity={0.45} />
        <directionalLight position={[0, 8, -10]} intensity={0.35} />

        <CubeMeshGroup
          cubies={cubies}
          activeAnimation={activeAnimation}
          onAnimationComplete={onAnimationComplete}
          onInteractiveMove={onInteractiveMove}
          palette={palette}
          scale={cubeSize}
          interactive={interactive}
          orbitRef={orbitRef}
          hoverTilt={hoverTilt}
          onUserInteractStart={onUserInteractStart}
          onUserInteractEnd={onUserInteractEnd}
          onCubeClick={onCubeClick}
        />
        <CameraResetter token={resetCameraToken} />

        <ContactShadows
          position={[0, -2.35 * cubeSize, 0]}
          opacity={0.35}
          scale={10 * cubeSize}
          blur={2.4}
          far={4.5 * cubeSize}
        />

        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan={false}
          enableZoom={enableZoom}
          onStart={() => onUserInteractStart?.()}
          onEnd={() => onUserInteractEnd?.()}
          enableDamping
          dampingFactor={0.07}
          minDistance={3.8}
          maxDistance={12}
          rotateSpeed={0.75}
          zoomSpeed={0.85}
        />
      </Canvas>
    </div>
  );
}

