'use client';

import React, { Component, ReactNode, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Fallback Visual when WebGL fails or context is lost ── */
export function FallbackHeroVisual() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Outer Glowing Orbital Rings */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 50px rgba(245, 158, 11, 0.25)',
          animation: 'spin-slow 20s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 390,
          height: 390,
          borderRadius: '50%',
          border: '1px dashed rgba(56, 189, 248, 0.35)',
          animation: 'spin-reverse-slow 25s linear infinite',
        }}
      />

      {/* Center 3D Avatar Image */}
      <div
        style={{
          position: 'relative',
          width: 260,
          height: 260,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(245, 158, 11, 0.6)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.35)',
          background: '#0d1117',
        }}
      >
        <img
          src="/api/avatar"
          alt="3D Developer Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
}

/* ── Error Boundary to catch WebGL Context Crashes ── */
class WebGLErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL Context Warning caught by ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackHeroVisual />;
    }
    return this.props.children;
  }
}

/* ── Two-Sided 3D Avatar Hologram Disc (Front & Back Avatars) ── */
function TwoSidedAvatar3DPortal() {
  const groupRef = useRef<THREE.Group>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const t = Date.now();

    const loadTexture = (paths: string[], setTex: (tex: THREE.Texture) => void) => {
      let index = 0;
      const tryNext = () => {
        if (index >= paths.length) return;
        const currentPath = `${paths[index]}?v=${t}`;
        index++;
        loader.load(
          currentPath,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setTex(tex);
          },
          undefined,
          () => tryNext()
        );
      };
      tryNext();
    };

    loadTexture(['/front.jpg.png', '/front.jpg', '/front.png', '/avatar-3d.png'], setFrontTexture);
    loadTexture(['/back.jpg.png', '/back.jpg', '/back.png', '/avatar-3d-back.png'], setBackTexture);

    return () => {
      setFrontTexture((prev) => {
        prev?.dispose();
        return null;
      });
      setBackTexture((prev) => {
        prev?.dispose();
        return null;
      });
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
      // Smooth 360-degree rotation showing Front 3D Avatar & Back 3D Avatar seamlessly
      groupRef.current.rotation.y = t * 0.55;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* Outer Glowing Gold Cyber Bezel Ring */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[2.0, 2.14, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Secondary Cyan Accent Bezel Ring */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[2.15, 2.19, 64]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* FRONT SIDE: 3D Hoodie Avatar */}
        {frontTexture && (
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[2.0, 64]} />
            <meshBasicMaterial map={frontTexture} side={THREE.FrontSide} />
          </mesh>
        )}

        {/* BACK SIDE: 3D Mountain & Headphones Avatar */}
        {backTexture ? (
          <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[2.0, 64]} />
            <meshBasicMaterial map={backTexture} side={THREE.FrontSide} />
          </mesh>
        ) : frontTexture ? (
          <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[2.0, 64]} />
            <meshBasicMaterial map={frontTexture} side={THREE.FrontSide} />
          </mesh>
        ) : null}

        {/* Dedicated Spotlights on Front & Back */}
        <pointLight position={[0, 0, 2.5]} color="#fcd34d" intensity={2.5} distance={8} />
        <pointLight position={[0, 0, -2.5]} color="#38bdf8" intensity={2.5} distance={8} />
      </group>
    </Float>
  );
}

/* ── Gyroscope Orbital Rings ── */
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3.2 + Math.sin(t * 0.4) * 0.25;
      ring1Ref.current.rotation.y = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3.8 + Math.cos(t * 0.5) * 0.25;
      ring2Ref.current.rotation.z = t * 0.5;
    }
  });

  return (
    <>
      {/* Primary Gold Orbital Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Secondary Cyan Orbital Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.9, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.75}
        />
      </mesh>
    </>
  );
}

/* ── Floating Satellite Nodes ── */
function Satellites() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.35;
    }
  });

  const nodes = [
    { pos: [4.0, 1.2, 0] as const, color: '#f59e0b', size: 0.2 },
    { pos: [-3.6, -1.8, 1.4] as const, color: '#a855f7', size: 0.18 },
    { pos: [1.5, -3.8, -1.8] as const, color: '#38bdf8', size: 0.22 },
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <Sphere args={[node.size, 16, 16]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={2}
              roughness={0.1}
            />
          </Sphere>
          <pointLight color={node.color} intensity={2} distance={3} />
        </group>
      ))}
    </group>
  );
}

/* ── Multi-colored Star Particle Vortex ── */
function ParticleCloud({ count = 250 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#f59e0b'), // Amber
      new THREE.Color('#fcd34d'), // Gold
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#c084fc'), // Purple
    ];

    for (let i = 0; i < count; i++) {
      const r = 5.5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Main Canvas Component ── */
export default function HeroCanvas() {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return <FallbackHeroVisual />;
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 11], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        {/* ── Lighting Setup ── */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#fff" />
        <pointLight position={[8, 8, 8]} color="#f59e0b" intensity={4} distance={20} />
        <pointLight position={[-8, -8, -5]} color="#38bdf8" intensity={3} distance={20} />

        {/* ── Environment Elements ── */}
        <Stars radius={70} depth={50} count={2000} factor={4} fade speed={0.8} />
        <ParticleCloud count={250} />

        {/* ── Two-Sided 3D Avatar Hologram Disc & Orbital Rings ── */}
        <TwoSidedAvatar3DPortal />
        <OrbitalRings />
        <Satellites />

        {/* ── Smooth Camera Control ── */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          rotateSpeed={0.5}
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
