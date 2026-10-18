'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Text } from '@react-three/drei';
import { projectsData } from '@/data/projects';

export function Projector() {
  const { activeSection, activeProjectIndex, isReducedMotion } = useExperience();
  const beamRef = useRef<THREE.MeshBasicMaterial>(null);
  const lensRef = useRef<THREE.MeshBasicMaterial>(null);
  const wallDisplayRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const isProjects = activeSection === 'projects';

  const currentProject = projectsData[activeProjectIndex] || projectsData[0];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerpSpeed = isReducedMotion ? 0.3 : 0.08;

    // Smooth volumetric beam opacity
    const targetBeamOpacity = isProjects
      ? 0.32 + Math.sin(t * 7) * 0.04
      : 0.02;

    if (beamRef.current) {
      beamRef.current.opacity = THREE.MathUtils.lerp(
        beamRef.current.opacity,
        targetBeamOpacity,
        lerpSpeed
      );
    }

    // Lens glow
    if (lensRef.current) {
      const targetLens = isProjects ? 0.95 + Math.sin(t * 5) * 0.05 : 0.2;
      lensRef.current.opacity = THREE.MathUtils.lerp(
        lensRef.current.opacity,
        targetLens,
        lerpSpeed
      );
    }

    // Wall projection illumination
    if (wallDisplayRef.current) {
      const targetWall = isProjects ? 0.85 : 0.08;
      wallDisplayRef.current.opacity = THREE.MathUtils.lerp(
        wallDisplayRef.current.opacity,
        targetWall,
        lerpSpeed
      );
    }

    // Spotlight intensity
    if (lightRef.current) {
      const targetLight = isProjects ? 2.4 : 0.1;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetLight,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[-2.5, 0, -4.5]}>
      {/* ================= PROJECTOR DESK STAND ================= */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.52, 0.9, 24]} />
        <meshStandardMaterial color="#0c121e" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Table accent cyan ring */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.04, 24]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>

      {/* ================= DETAILED COMPACT PROJECTOR UNIT ================= */}
      <group position={[0, 0.98, 0]}>
        {/* Main Chassis - Graphite metallic body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.18, 0.42]} />
          <meshStandardMaterial color="#0e1420" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Chassis Top Panel Accent */}
        <mesh position={[0, 0.091, 0]}>
          <planeGeometry args={[0.48, 0.36]} />
          <meshStandardMaterial color="#162032" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Optical Lens Barrel facing towards -Z */}
        <group position={[0, 0, -0.22]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.095, 0.07, 24]} />
            <meshStandardMaterial color="#080c14" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Lens Glass */}
          <mesh position={[0, 0, -0.036]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.075, 24]} />
            <meshBasicMaterial ref={lensRef} color="#00f0ff" transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Status Indicators & Vent Slits */}
        <mesh position={[-0.16, 0.092, 0]}>
          <boxGeometry args={[0.08, 0.005, 0.015]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[-0.06, 0.092, 0]}>
          <boxGeometry args={[0.08, 0.005, 0.015]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.12, 0.092, 0]}>
          <boxGeometry args={[0.12, 0.005, 0.01]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
      </group>

      {/* Focused Projection Spotlight */}
      <spotLight
        ref={lightRef}
        position={[0, 0.98, -0.25]}
        target-position={[0, 2.8, -6.38]}
        color="#a5f3fc"
        intensity={0.2}
        angle={0.52}
        penumbra={0.5}
        distance={9}
      />

      {/* ================= VOLUMETRIC-STYLE LIGHT BEAM ================= */}
      {/* Frustum light cone starting from lens [0, 0.98, -0.22] to wall [0, 2.8, -6.38] */}
      <group position={[0, 1.89, -3.3]} rotation={[0.29, 0, 0]}>
        <mesh>
          {/* Tapered open-ended cylinder: radiusTop=2.25 (at wall), radiusBottom=0.085 (at lens), height=6.2 */}
          <cylinderGeometry args={[2.25, 0.085, 6.2, 32, 1, true]} />
          <meshBasicMaterial
            ref={beamRef}
            color="#00f0ff"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ================= 3D WALL PROJECTION SURFACE ================= */}
      <group position={[0, 2.8, -6.36]}>
        {/* Projection Backplane Surface */}
        <mesh>
          <planeGeometry args={[7.0, 4.0]} />
          <meshBasicMaterial
            ref={wallDisplayRef}
            color="#021424"
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Projection Wireframe Grid */}
        <lineSegments position={[0, 0, 0.005]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(6.9, 3.9)]} />
          <lineBasicMaterial color="#00f0ff" opacity={isProjects ? 0.6 : 0.15} transparent />
        </lineSegments>

        {/* 3D Dynamic Title Projection on Wall */}
        <group position={[0, 1.55, 0.02]}>
          <Text
            fontSize={0.22}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            N/VERSE // PROJECT ARCHIVE
          </Text>
        </group>

        {/* Projected Active Project Title */}
        <group position={[0, 1.15, 0.02]}>
          <Text
            fontSize={0.28}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
          >
            {currentProject.title.toUpperCase()}
          </Text>
        </group>

        {/* Projected Category & Status */}
        <group position={[0, 0.8, 0.02]}>
          <Text
            fontSize={0.13}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            {`${currentProject.category.toUpperCase()} • ${currentProject.status.toUpperCase()}`}
          </Text>
        </group>
      </group>
    </group>
  );
}
