'use client';

import React, { Component, ReactNode, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import SkullLoader from '@/components/ui/SkullLoader';
import Avatar from './Avatar';

/* ── Fallback Visual when WebGL fails ── */
export function FallbackAvatarVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <SkullLoader message="LOADING 3D AVATAR SYSTEM..." />
    </div>
  );
}

/* ── WebGL Error Boundary ── */
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
      return <FallbackAvatarVisual />;
    }
    return this.props.children;
  }
}

/* ── Gyroscope Orbital Rings surrounding Avatar ── */
function CyberRings() {
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
      <mesh ref={ring1Ref} position={[0, -0.2, 0]}>
        <torusGeometry args={[3.2, 0.03, 16, 64]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} metalness={1} roughness={0.1} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, -0.2, 0]}>
        <torusGeometry args={[3.8, 0.02, 16, 64]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} metalness={0.9} transparent opacity={0.75} />
      </mesh>
    </>
  );
}

/* ── Multi-colored Star Particle Vortex ── */
function ParticleCloud({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#f59e0b'),
      new THREE.Color('#fcd34d'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#c084fc'),
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
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ── Main Avatar Canvas Component ── */
export default function AvatarScene() {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return <FallbackAvatarVisual />;
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        camera={{ position: [0, -0.1, 7.2], fov: 42 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#fff" />
        <pointLight position={[6, 6, 6]} color="#f59e0b" intensity={4} distance={20} />
        <pointLight position={[-6, -6, -5]} color="#38bdf8" intensity={3} distance={20} />

        {/* Environment Background */}
        <Stars radius={70} depth={50} count={1800} factor={4} fade speed={0.8} />
        <ParticleCloud count={200} />

        {/* 3D Speaking Avatar */}
        <Avatar />
        <CyberRings />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
