'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Text } from '@react-three/drei';

export function Gate() {
  const { doorOpenProgress } = useExperience();

  // Separate pivot groups for left and right blast doors
  const leftPivotRef = useRef<THREE.Group>(null);
  const rightPivotRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const statusLightRef = useRef<THREE.MeshBasicMaterial>(null);
  const portalGlowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Smoothly interpolate door positions and pivot angles to ensure monotonic, flicker-free movement
  const currentProgress = useRef(0);

  useFrame((_, delta) => {
    // Dampened interpolation prevents rapid scroll jumping and ensures reversible fluidity
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      doorOpenProgress,
      12,
      delta
    );

    const p = currentProgress.current;

    // Combined slide + outward mechanical pivot for convincing blast door mechanics
    const slideOffset = p * 2.2;
    const pivotAngle = p * 0.35; // ~20 degrees outward swing

    if (leftPivotRef.current) {
      leftPivotRef.current.position.x = -1.25 - slideOffset;
      leftPivotRef.current.rotation.y = -pivotAngle;
    }

    if (rightPivotRef.current) {
      rightPivotRef.current.position.x = 1.25 + slideOffset;
      rightPivotRef.current.rotation.y = pivotAngle;
    }

    if (statusLightRef.current) {
      const isOpening = p > 0.05;
      statusLightRef.current.color.set(isOpening ? '#00f0ff' : '#0284c7');
    }

    if (portalGlowRef.current) {
      portalGlowRef.current.opacity = 0.15 + p * 0.45;
    }
  });

  return (
    <group position={[0, 0, 11.2]}>
      {/* ================= ARCHWAY INDUSTRIAL FRAME ================= */}
      {/* Heavy top lintel / arch header */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <boxGeometry args={[7.2, 1.4, 1.2]} />
        <meshStandardMaterial color="#0c111c" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Prominent "N/VERSE" Wordmark on Gate Arch Header */}
      <group position={[0, 4.35, 0.62]}>
        <Text
          fontSize={0.52}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          N/VERSE
        </Text>
      </group>

      {/* Emissive sub-header line */}
      <mesh position={[0, 3.75, 0.62]}>
        <boxGeometry args={[4.2, 0.04, 0.02]} />
        <meshBasicMaterial ref={statusLightRef} color="#00f0ff" />
      </mesh>

      {/* Heavy Left Pillar */}
      <mesh position={[-3.1, 2.1, 0]} castShadow>
        <boxGeometry args={[1.0, 4.2, 1.0]} />
        <meshStandardMaterial color="#0e1524" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Heavy Right Pillar */}
      <mesh position={[3.1, 2.1, 0]} castShadow>
        <boxGeometry args={[1.0, 4.2, 1.0]} />
        <meshStandardMaterial color="#0e1524" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Floor Hydraulic Slide Tracks */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[6.2, 0.16, 0.8]} />
        <meshStandardMaterial color="#080c14" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Upper Hydraulic Slide Beam */}
      <mesh position={[0, 3.7, 0]}>
        <boxGeometry args={[6.2, 0.12, 0.6]} />
        <meshStandardMaterial color="#080c14" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ================= PIVOT GROUP: LEFT BLAST DOOR ================= */}
      <group ref={leftPivotRef} position={[-1.25, 1.85, 0]}>
        <group ref={leftDoorRef}>
          {/* Main Reinforced Blast Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 3.7, 0.3]} />
            <meshStandardMaterial
              color="#141c2c"
              roughness={0.35}
              metalness={0.85}
            />
          </mesh>

          {/* Decorative Beveled Armor Inset */}
          <mesh position={[0, 0, 0.17]}>
            <boxGeometry args={[2.0, 3.2, 0.04]} />
            <meshStandardMaterial color="#0b101a" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Vertical Seam Cyan Accent Ribbon */}
          <mesh position={[1.12, 0, 0.18]}>
            <boxGeometry args={[0.04, 3.4, 0.02]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
          </mesh>

          {/* Hinge Joint Bushing */}
          <mesh position={[-1.15, 1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
            <meshStandardMaterial color="#080d16" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-1.15, -1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
            <meshStandardMaterial color="#080d16" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ================= PIVOT GROUP: RIGHT BLAST DOOR ================= */}
      <group ref={rightPivotRef} position={[1.25, 1.85, 0]}>
        <group ref={rightDoorRef}>
          {/* Main Reinforced Blast Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 3.7, 0.3]} />
            <meshStandardMaterial
              color="#141c2c"
              roughness={0.35}
              metalness={0.85}
            />
          </mesh>

          {/* Decorative Beveled Armor Inset */}
          <mesh position={[0, 0, 0.17]}>
            <boxGeometry args={[2.0, 3.2, 0.04]} />
            <meshStandardMaterial color="#0b101a" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Vertical Seam Cyan Accent Ribbon */}
          <mesh position={[-1.12, 0, 0.18]}>
            <boxGeometry args={[0.04, 3.4, 0.02]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
          </mesh>

          {/* Hinge Joint Bushing */}
          <mesh position={[1.15, 1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
            <meshStandardMaterial color="#080d16" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[1.15, -1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
            <meshStandardMaterial color="#080d16" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Threshold Floor Seam Light Spill */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 0.8]} />
        <meshBasicMaterial ref={portalGlowRef} color="#00f0ff" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}
