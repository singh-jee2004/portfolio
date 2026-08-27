'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useLipSync } from './LipSync';

/* ── Fallback Ready Player Me / Custom GLB loader ── */
function ModelAvatar({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { isSpeaking } = useLipSync();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && isSpeaking) {
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.005) * 0.05;
    }
  });

  return <primitive ref={groupRef} object={scene} scale={2} position={[0, -2, 0]} />;
}

/* ── Developer at Desk with Headphones, Clean Expressive Eyes & No Laptop ── */
function DeveloperDeskAvatar() {
  const headGroupRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Group>(null);
  const rightPupilRef = useRef<THREE.Group>(null);
  const leftEyelidRef = useRef<THREE.Mesh>(null);
  const rightEyelidRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { isSpeaking } = useLipSync();

  // 🌐 GLOBAL WINDOW POINTER REF - Tracks cursor across entire website page!
  const globalPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      globalPointerRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Eyelid Blinking
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { x: px, y: py } = globalPointerRef.current;

    // 1. GLOBAL CURSOR HEAD TRACKING
    if (headGroupRef.current) {
      const targetYaw = px * 0.75;
      const targetPitch = py * 0.45;

      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        targetYaw + (isSpeaking ? Math.sin(t * 3.5) * 0.04 : Math.sin(t * 0.8) * 0.02),
        0.1
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        targetPitch + Math.sin(t * 1.2) * 0.02 + (isSpeaking ? Math.cos(t * 4) * 0.03 : 0),
        0.1
      );
    }

    // 2. HIGH-PRECISION SMOOTH PUPIL TRACKING (Tight Clamped Bounds)
    if (leftPupilRef.current && rightPupilRef.current) {
      const pupilX = px * 0.05;
      const pupilY = -py * 0.05;
      leftPupilRef.current.position.x = pupilX;
      leftPupilRef.current.position.y = pupilY;
      rightPupilRef.current.position.x = pupilX;
      rightPupilRef.current.position.y = pupilY;
    }

    // 3. Eyelid Blinking
    if (leftEyelidRef.current && rightEyelidRef.current) {
      const targetScaleY = blink ? 1.0 : 0.01;
      leftEyelidRef.current.scale.y = THREE.MathUtils.lerp(leftEyelidRef.current.scale.y, targetScaleY, 0.45);
      rightEyelidRef.current.scale.y = THREE.MathUtils.lerp(rightEyelidRef.current.scale.y, targetScaleY, 0.45);
    }

    // 4. SMOOTH JAW MORPHING FOR SPEECH
    if (jawRef.current) {
      const speechT = t * 9.5;
      const mouthTarget = isSpeaking
        ? (Math.sin(speechT) * 0.35 + 0.35) * (0.8 + Math.sin(speechT * 0.4) * 0.2)
        : 0;

      const targetJawY = -0.38 - mouthTarget * 0.22;
      jawRef.current.position.y = THREE.MathUtils.lerp(jawRef.current.position.y, targetJawY, 0.2);
      jawRef.current.scale.x = THREE.MathUtils.lerp(
        jawRef.current.scale.x,
        1.0 + (isSpeaking ? Math.sin(speechT * 0.5) * 0.1 : 0),
        0.2
      );
    }

    // 5. Body Idle Breathing Animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      {/* ── 1. STUDIO DESK SURFACE ── */}
      <mesh position={[0, -1.85, 0.5]}>
        <boxGeometry args={[5.8, 0.18, 3.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Desk Glowing Crimson Trim Line */}
      <mesh position={[0, -1.75, 2.18]}>
        <boxGeometry args={[5.8, 0.04, 0.06]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
      </mesh>

      {/* ── 2. DEVELOPER BODY & ARMS RESTING ON DESK (NO LAPTOP) ── */}
      <group position={[0, 0, 0]}>
        {/* Torso in Dark Hoodie */}
        <mesh position={[0, -1.25, -0.1]}>
          <cylinderGeometry args={[0.9, 1.25, 1.3, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Left Arm Resting on Desk */}
        <mesh position={[-0.85, -1.45, 0.35]} rotation={[0.4, 0.4, -0.3]}>
          <cylinderGeometry args={[0.22, 0.2, 1.2, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        <mesh position={[-0.55, -1.72, 0.85]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fca5a5" roughness={0.5} />
        </mesh>

        {/* Right Arm Resting on Desk */}
        <mesh position={[0.85, -1.45, 0.35]} rotation={[0.4, -0.4, 0.3]}>
          <cylinderGeometry args={[0.22, 0.2, 1.2, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        <mesh position={[0.55, -1.72, 0.85]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fca5a5" roughness={0.5} />
        </mesh>
      </group>

      {/* ── 3. HEAD, PERFECT STYLIZED EYES & WHITE HEADPHONES ── */}
      <group ref={headGroupRef} position={[0, 0, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.5, -0.05]}>
          <cylinderGeometry args={[0.35, 0.4, 0.45, 32]} />
          <meshStandardMaterial color="#fca5a5" roughness={0.5} />
        </mesh>

        {/* Head Mesh */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshStandardMaterial color="#fecdd3" roughness={0.4} />
        </mesh>

        {/* Dark Hair */}
        <mesh position={[0, 0.84, -0.05]} rotation={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.88, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
        </mesh>

        {/* Front Bangs */}
        <mesh position={[0, 0.78, 0.52]} rotation={[0.25, 0, 0]}>
          <coneGeometry args={[0.62, 0.35, 32]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.9} />
        </mesh>

        {/* Dark Expressive Eyebrows */}
        <mesh position={[-0.32, 0.42, 0.78]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.32, 0.045, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.32, 0.42, 0.78]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.32, 0.045, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* ── CLEAN PERFECT EYES ASSEMBLY ── */}
        <group position={[0, 0.26, 0.76]}>
          {/* Facial Lighting */}
          <pointLight position={[0, 0.2, 1.2]} color="#ffffff" intensity={2.8} distance={4} />

          {/* LEFT EYE */}
          <group position={[-0.32, 0, 0]}>
            {/* White Sclera Eyeball */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            {/* Tracked Pupil & Iris Group */}
            <group ref={leftPupilRef} position={[0, 0, 0]}>
              {/* Deep Blue/Cyan Iris */}
              <mesh position={[0, 0, 0.17]}>
                <sphereGeometry args={[0.11, 32, 32]} />
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
              </mesh>
              {/* Core Black Pupil */}
              <mesh position={[0, 0, 0.21]}>
                <sphereGeometry args={[0.065, 16, 16]} />
                <meshStandardMaterial color="#020617" roughness={0.1} />
              </mesh>
              {/* Specular White Glint */}
              <mesh position={[0.035, 0.035, 0.24]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
            {/* Eyelid */}
            <mesh ref={leftEyelidRef} position={[0, 0, 0.22]}>
              <boxGeometry args={[0.44, 0.44, 0.05]} />
              <meshStandardMaterial color="#fecdd3" />
            </mesh>
          </group>

          {/* RIGHT EYE */}
          <group position={[0.32, 0, 0]}>
            {/* White Sclera Eyeball */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            {/* Tracked Pupil & Iris Group */}
            <group ref={rightPupilRef} position={[0, 0, 0]}>
              {/* Deep Blue/Cyan Iris */}
              <mesh position={[0, 0, 0.17]}>
                <sphereGeometry args={[0.11, 32, 32]} />
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.6} />
              </mesh>
              {/* Core Black Pupil */}
              <mesh position={[0, 0, 0.21]}>
                <sphereGeometry args={[0.065, 16, 16]} />
                <meshStandardMaterial color="#020617" roughness={0.1} />
              </mesh>
              {/* Specular White Glint */}
              <mesh position={[0.035, 0.035, 0.24]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
            {/* Eyelid */}
            <mesh ref={rightEyelidRef} position={[0, 0, 0.22]}>
              <boxGeometry args={[0.44, 0.44, 0.05]} />
              <meshStandardMaterial color="#fecdd3" />
            </mesh>
          </group>
        </group>

        {/* Sleek Over-Ear White Headphones */}
        <group position={[0, 0.2, 0]}>
          <mesh position={[-0.94, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
          </mesh>
          <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.36, 0.06, 16, 32]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          <mesh position={[0.94, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
          </mesh>
          <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.36, 0.06, 16, 32]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.74, 0]}>
            <torusGeometry args={[0.94, 0.07, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
          </mesh>
        </group>

        {/* Upper Lip Mesh */}
        <mesh position={[0, -0.22, 0.8]}>
          <boxGeometry args={[0.36, 0.06, 0.1]} />
          <meshStandardMaterial color="#e11d48" roughness={0.6} />
        </mesh>

        {/* Animated Lower Jaw / Mouth Morph Mesh for Lip Sync */}
        <mesh ref={jawRef} position={[0, -0.38, 0.78]}>
          <boxGeometry args={[0.34, 0.1, 0.1]} />
          <meshStandardMaterial color="#fecdd3" emissive={isSpeaking ? '#ef4444' : '#000000'} emissiveIntensity={isSpeaking ? 0.6 : 0} />
        </mesh>
      </group>

      {/* Warm Crimson & Amber Studio Spotlights */}
      <pointLight position={[-3, 2, 3]} color="#ef4444" intensity={4.5} distance={12} />
      <pointLight position={[3, 3, 2]} color="#f59e0b" intensity={4.0} distance={12} />
      <pointLight position={[0, -2, -2]} color="#6366f1" intensity={2.5} distance={8} />
    </group>
  );
}

export default function Avatar() {
  const [hasGlb, setHasGlb] = useState(false);

  useEffect(() => {
    fetch('/models/avatar.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasGlb(true);
      })
      .catch(() => setHasGlb(false));
  }, []);

  if (hasGlb) {
    return <ModelAvatar url="/models/avatar.glb" />;
  }

  return <DeveloperDeskAvatar />;
}
