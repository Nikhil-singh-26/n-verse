'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Text } from '@react-three/drei';
import { achievementsData } from '@/data/achievements';

export function AchievementBoard() {
  const { activeSection, activeAchievementId, isReducedMotion } = useExperience();
  const trackRef = useRef<THREE.MeshBasicMaterial>(null);
  const boardGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const isAchievements = activeSection === 'achievements';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerpSpeed = isReducedMotion ? 0.3 : 0.08;

    if (trackRef.current) {
      const targetPulse = isAchievements
        ? 0.85 + Math.sin(t * 3.5) * 0.12
        : 0.25;
      trackRef.current.opacity = THREE.MathUtils.lerp(
        trackRef.current.opacity,
        targetPulse,
        lerpSpeed
      );
    }

    if (boardGlowRef.current) {
      const targetGlow = isAchievements ? 0.45 : 0.08;
      boardGlowRef.current.opacity = THREE.MathUtils.lerp(
        boardGlowRef.current.opacity,
        targetGlow,
        lerpSpeed
      );
    }

    if (lightRef.current) {
      const targetLight = isAchievements ? 1.8 : 0.3;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetLight,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[10.75, 3.2, -3.5]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Wall Mounting Metal Brackets */}
      <mesh position={[0, 0, -0.06]} receiveShadow>
        <boxGeometry args={[6.0, 3.8, 0.08]} />
        <meshStandardMaterial color="#060910" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Main Exhibition Display Surface */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[5.8, 3.6]} />
        <meshStandardMaterial
          color="#0a121e"
          roughness={0.25}
          metalness={0.75}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Ambient Board Accent Glow Light */}
      <pointLight ref={lightRef} position={[0, 0, 0.8]} color="#00f0ff" intensity={0.4} distance={5} />

      {/* Frame Edge Neon Lines */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.8, 3.6)]} />
        <lineBasicMaterial color="#00f0ff" opacity={isAchievements ? 0.8 : 0.25} transparent />
      </lineSegments>

      {/* Board Header Title & Telemetry Status */}
      <group position={[-2.6, 1.48, 0.02]}>
        <Text
          fontSize={0.2}
          color="#00f0ff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
        >
          TELEMETRY // MILESTONE TIMELINE
        </Text>
      </group>
      <group position={[2.6, 1.48, 0.02]}>
        <Text
          fontSize={0.11}
          color="#38bdf8"
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.08}
        >
          [VERIFIED ACADEMIC & TECHNICAL RECORDS]
        </Text>
      </group>

      {/* Horizontal Timeline Track */}
      <mesh position={[0, 0.95, 0.02]}>
        <planeGeometry args={[5.2, 0.035]} />
        <meshBasicMaterial ref={trackRef} color="#00f0ff" transparent opacity={0.3} />
      </mesh>

      {/* Timeline Milestone Nodes */}
      {[-2.0, -1.0, 0, 1.0, 2.0].map((x, i) => (
        <group key={`node-${i}`} position={[x, 0.95, 0.03]}>
          <mesh>
            <circleGeometry args={[0.075, 16]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <mesh>
            <ringGeometry args={[0.1, 0.12, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* 3D Visual Cards corresponding to Achievements */}
      {[
        { id: 'edu-btech', x: -1.8, y: -0.2, label: 'B.TECH CSE', sub: '2022 — 2026', org: 'GEC BILASPUR' },
        { id: 'cert-dsa', x: 0, y: -0.2, label: 'ALGORITHMS & DSA', sub: 'VERIFIED', org: 'PROBLEM SOLVING' },
        { id: 'cert-fullstack', x: 1.8, y: -0.2, label: 'FULL-STACK ENG', sub: 'VERIFIED', org: 'SYSTEMS BUILD' }
      ].map((card) => {
        const isSelected = activeAchievementId === card.id;
        return (
          <group key={card.id} position={[card.x, card.y, 0.02]}>
            <mesh>
              <planeGeometry args={[1.55, 1.5]} />
              <meshBasicMaterial
                color={isSelected ? '#0e2338' : '#08101e'}
                opacity={0.85}
                transparent
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(1.55, 1.5)]} />
              <lineBasicMaterial
                color={isSelected ? '#00f0ff' : '#1e3a5f'}
                opacity={isSelected ? 0.9 : 0.4}
                transparent
              />
            </lineSegments>
            <group position={[0, 0.45, 0.01]}>
              <Text
                fontSize={0.11}
                color={isSelected ? '#00f0ff' : '#ffffff'}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.04}
              >
                {card.label}
              </Text>
            </group>
            <group position={[0, 0.18, 0.01]}>
              <Text
                fontSize={0.09}
                color="#00f0ff"
                anchorX="center"
                anchorY="middle"
              >
                {card.sub}
              </Text>
            </group>
            <group position={[0, -0.15, 0.01]}>
              <Text
                fontSize={0.08}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.06}
              >
                {card.org}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}
