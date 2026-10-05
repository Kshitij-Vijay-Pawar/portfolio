'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, Suspense, type ReactNode } from 'react';
import { Canvas, createPortal, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
  Html
} from '@react-three/drei';
import { easing } from 'maath';

if (typeof window !== 'undefined') {
  try {
    useGLTF.preload('/assets/3d/lens.glb');
    useGLTF.preload('/assets/3d/cube.glb');
    useGLTF.preload('/assets/3d/bar.glb');
  } catch {
    // Ignore preload error during build/SSR
  }
}

const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1783394327207-acf441e37dda?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzR8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzZ8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1782094002386-7d9ae1f49f50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDB8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1779684474703-5c0519bcf7e8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NTJ8fHxlbnwwfHx8fHw%3D'
];

type Mode = 'lens' | 'bar' | 'cube';

interface NavItem {
  label: string;
  link: string;
}

type ModeProps = Record<string, unknown>;

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
  backgroundColor?: string;
  textColor?: string;
  imageSrc?: string;
  isHovered?: boolean;
  /** Card mode: px the lens canvas may extend past the card on each side (so the lens is never clipped). */
  overflowPadding?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Card content rendered *behind* the React Bits lens.
 * drei <Image> handles object-cover cropping + sRGB colour space,
 * exactly like the images in the original React Bits demo.
 */
function CardImage({
  url,
  padding = 0,
  isHovered = false,
}: {
  url: string;
  padding?: number;
  isHovered?: boolean;
}) {
  const { viewport, size } = useThree();
  const fx = size.width > 0 ? Math.max(0, size.width - padding * 2) / size.width : 1;
  const fy = size.height > 0 ? Math.max(0, size.height - padding * 2) / size.height : 1;
  return (
    <>
      {padding > 0 && (
        <Image url={url} scale={[viewport.width, viewport.height]} position={[0, 0, -0.01]} color="#3a3a3a" />
      )}
      <Image url={url} scale={[viewport.width * fx, viewport.height * fy]} position={[0, 0, 0]} />

      {/* 3D "VIEW CASE STUDY" pill inside the scene so the glass lens refracts it! */}
      <group position={[0, 0, 0.05]} visible={isHovered}>
        {/* Pill background */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.54, 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} toneMapped={false} />
        </mesh>
        {/* Pill border */}
        <lineSegments position={[0, 0, 0.001]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.54, 0.12)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </lineSegments>
        {/* Text */}
        <Text
          position={[-0.03, 0, 0.002]}
          fontSize={0.038}
          letterSpacing={0.05}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          VIEW CASE STUDY
        </Text>
        {/* Simple external link arrow glyph */}
        <Text
          position={[0.2, 0.005, 0.002]}
          fontSize={0.045}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ↗
        </Text>
      </group>
    </>
  );
}

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundColor = '#120F17',
  textColor = '#ffffff',
  imageSrc,
  isHovered = true,
  overflowPadding = 160,
  className,
  children
}: FluidGlassProps) {
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  // Single-image card mode (project showcase cards) — same React Bits Lens, image as the scene
  if (imageSrc) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { navItems: _navItems, ...cardModeProps } = rawOverrides;
    const pad = overflowPadding;
    return (
      <div
        className={`pointer-events-none absolute ${className ?? ''}`}
        style={{ top: -pad, left: -pad, right: -pad, bottom: -pad }}
      >
        <Canvas
          camera={{ position: [0, 0, 20], fov: 15 }}
          gl={{ alpha: true, toneMapping: THREE.NoToneMapping }}
          style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Lens modeProps={cardModeProps} backgroundColor={backgroundColor} active={isHovered} padding={pad}>
              <CardImage url={imageSrc} padding={pad} isHovered={isHovered} />
              <Preload />
            </Lens>
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // Standalone showcase mode
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <div className={`w-full h-full relative ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ backgroundColor: backgroundColor || '#120F17' }}
      >
        <ScrollControls damping={0.2} pages={3} distance={0.4}>
          {mode === 'bar' && <NavItems items={navItems as NavItem[]} textColor={textColor} />}
          <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
            {children ? (
              children
            ) : (
              <Scroll>
                <Typography textColor={textColor} />
                <Images />
              </Scroll>
            )}
            <Scroll html />
            <Preload />
          </Wrapper>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

type MeshProps = ThreeElements['mesh'];

interface ModeWrapperProps extends MeshProps {
  children?: ReactNode;
  glb: string;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  /** Optional: when defined, lens scales to 0 when false (used for hover on cards). */
  active?: boolean;
  /**
   * Optional (card mode): px the canvas overflows its card on each side. Enables window-level
   * pointer tracking, keeps the lens the same on-screen size, and hides the backdrop quad so
   * only the lens is drawn (the DOM image underneath stays visible).
   */
  padding?: number;
  modeProps?: ModeProps;
  backgroundColor?: string;
}

type ModeComponentProps = Omit<ModeWrapperProps, 'glb' | 'geometryKey'>;

interface ZoomMaterial extends THREE.Material {
  zoom: number;
}

interface ZoomMesh extends THREE.Mesh<THREE.BufferGeometry, ZoomMaterial> {}

type ZoomGroup = THREE.Group & { children: ZoomMesh[] };

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  backgroundColor = '#120F17',
  active,
  padding,
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);
  const isCardMode = padding !== undefined;
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox!.max.x - geo.boundingBox!.min.x || 1;
  }, [nodes, geometryKey]);

  // Card mode: canvas is click-through, so track the mouse on window instead
  useEffect(() => {
    if (!isCardMode) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isCardMode]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera, size } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    let px = pointer.x;
    let py = pointer.y;
    if (isCardMode && mouseRef.current) {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        px = ((mouseRef.current.x - rect.left) / rect.width) * 2 - 1;
        py = -((mouseRef.current.y - rect.top) / rect.height) * 2 + 1;
      }
    }

    const destX = followPointer ? (px * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (py * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (active !== undefined) {
      const userScale = (modeProps as { scale?: number }).scale;
      // Keep lens the same on-screen size as if the canvas were exactly the card
      const sizeFactor =
        isCardMode && size.height > 0 ? Math.max(0, size.height - padding! * 2) / size.height : 1;
      const target = active ? (userScale ?? 0.15) * sizeFactor : 0;
      easing.damp3(ref.current.scale, [target, target, target], 0.15, delta);
    } else if ((modeProps as { scale?: number }).scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as {
    scale?: number;
    ior?: number;
    thickness?: number;
    anisotropy?: number;
    chromaticAberration?: number;
    [key: string]: unknown;
  };

  return (
    <>
      {createPortal(
        <>
          {backgroundColor !== 'transparent' && (
            <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
              <planeGeometry />
              <meshBasicMaterial color={backgroundColor} toneMapped={false} />
            </mesh>
          )}
          {children}
        </>,
        scene
      )}
      {!isCardMode && (
        <mesh scale={[vp.width, vp.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
        </mesh>
      )}
      <mesh
        ref={ref}
        scale={active !== undefined ? 0 : scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={(nodes[geometryKey] as THREE.Mesh)?.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...(typeof extraMat === 'object' && extraMat !== null ? extraMat : {})}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: ModeComponentProps) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: ModeComponentProps) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: ModeComponentProps) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items, textColor }: { items: NavItem[]; textColor: string }) {
  const group = useRef<THREE.Group>(null!);
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.045 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.045 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef<ZoomGroup>(null!);
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={IMAGE_URLS[0]} />
      <Image position={[2, 0, 3]} scale={3} url={IMAGE_URLS[1]} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={IMAGE_URLS[2]} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={IMAGE_URLS[3]} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={IMAGE_URLS[4]} />
    </group>
  );
}

function Typography({ textColor }: { textColor: string }) {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}
