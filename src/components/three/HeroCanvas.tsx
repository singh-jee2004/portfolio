'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Glowing Cyber Core Sphere ── */
function QuantumCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerWireRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.15;
      coreRef.current.rotation.y = t * 0.25;
    }
    if (outerWireRef.current) {
      outerWireRef.current.rotation.x = -t * 0.2;
      outerWireRef.current.rotation.y = -t * 0.3;
      outerWireRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.8}>
      <group>
        {/* Inner Glowing Distort Sphere */}
        <mesh ref={coreRef} scale={1.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.8}
            distort={0.38}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Outer Geometric Wireframe Cage */}
        <mesh ref={outerWireRef} scale={2.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            wireframe
            wireframeLinewidth={1.5}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Inner High-Glow Light Point */}
        <pointLight color="#fcd34d" intensity={4} distance={6} />
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
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.3;
      ring1Ref.current.rotation.y = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(t * 0.5) * 0.3;
      ring2Ref.current.rotation.z = t * 0.5;
    }
  });

  return (
    <>
      {/* Primary Gold Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.4, 0.035, 16, 100]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Secondary Cyan Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.1, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.7}
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
    { pos: [4.2, 1.2, 0] as const, color: '#f59e0b', size: 0.22 },
    { pos: [-3.8, -1.8, 1.5] as const, color: '#a855f7', size: 0.18 },
    { pos: [1.5, -3.9, -2] as const, color: '#38bdf8', size: 0.25 },
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <Sphere args={[node.size, 32, 32]}>
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
function ParticleCloud({ count = 350 }: { count?: number }) {
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
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = color.r;
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
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      {/* ── Lighting Setup ── */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#fff" />
      <pointLight position={[8, 8, 8]} color="#f59e0b" intensity={4} distance={20} />
      <pointLight position={[-8, -8, -5]} color="#38bdf8" intensity={3} distance={20} />
      <pointLight position={[0, 10, -5]} color="#a855f7" intensity={2} distance={15} />

      {/* ── Environment Elements ── */}
      <Stars radius={70} depth={50} count={3500} factor={4} fade speed={0.8} />
      <ParticleCloud count={400} />

      {/* ── Core 3D Artifacts ── */}
      <QuantumCore />
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
  );
}
