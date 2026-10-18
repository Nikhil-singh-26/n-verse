'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';

export function Character() {
  const { doorOpenProgress, characterFade } = useExperience();
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Smooth local tracking to prevent flickering on fast wheel scrubbing
  const currentFade = useRef(1);
  const currentWalk = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentFade.current = THREE.MathUtils.damp(
      currentFade.current,
      characterFade,
      10,
      delta
    );
    currentWalk.current = THREE.MathUtils.damp(
      currentWalk.current,
      doorOpenProgress,
      10,
      delta
    );

    const fade = currentFade.current;
    const walk = currentWalk.current;

    // Optimization: disable rendering if fully dissolved
    if (fade <= 0.01) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Stride forward into the laboratory threshold
    groupRef.current.position.z = 13.4 - walk * 3.2;

    // Procedural walk cycle vs subtle idle breathing
    if (walk > 0.02) {
      const walkTime = state.clock.getElapsedTime() * 7;
      const legAngle = Math.sin(walkTime) * 0.45;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -legAngle * 0.65;
      if (rightArmRef.current) rightArmRef.current.rotation.x = legAngle * 0.65;
    } else {
      const idleTime = state.clock.getElapsedTime() * 2;
      groupRef.current.position.y = Math.sin(idleTime) * 0.025;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }
  });

  const bodyMaterial = (
    <meshStandardMaterial
      color="#141c2c"
      roughness={0.4}
      metalness={0.7}
      transparent
      opacity={Math.max(0, characterFade)}
    />
  );

  const visorMaterial = (
    <meshBasicMaterial
      color="#00f0ff"
      transparent
      opacity={Math.max(0, characterFade)}
    />
  );

  return (
    <group ref={groupRef} position={[0, 0, 13.4]}>
      {/* ================= HUMANOID CYBERNETIC SILHOUETTE ================= */}
      {/* Head */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        {bodyMaterial}
      </mesh>

      {/* Cyber Visor Light Strip */}
      <mesh position={[0, 1.73, -0.1]}>
        <boxGeometry args={[0.18, 0.035, 0.08]} />
        {visorMaterial}
      </mesh>

      {/* Torso & Tech Jacket */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.38, 0.65, 0.22]} />
        {bodyMaterial}
      </mesh>

      {/* Coat Tails / Cyber Trench Backing */}
      <mesh position={[0, 0.95, 0.08]}>
        <boxGeometry args={[0.4, 0.5, 0.08]} />
        {bodyMaterial}
      </mesh>

      {/* Articulated Left Arm */}
      <group ref={leftArmRef} position={[-0.26, 1.48, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.45, 8, 8]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* Articulated Right Arm */}
      <group ref={rightArmRef} position={[0.26, 1.48, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.06, 0.45, 8, 8]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* Articulated Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 8]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* Articulated Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.7, 8, 8]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* Ground Projection Shadow Disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45 * characterFade} />
      </mesh>
    </group>
  );
}
