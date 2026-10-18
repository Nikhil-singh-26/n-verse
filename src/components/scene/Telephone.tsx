'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';

export function Telephone() {
  const { activeSection, isReducedMotion } = useExperience();
  const ledRef = useRef<THREE.MeshBasicMaterial>(null);
  const pulseRing1Ref = useRef<THREE.Group>(null);
  const pulseRing2Ref = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const isContact = activeSection === 'contact';

  // Keypad button coordinates (3x4 grid)
  const keypadButtons = useMemo(() => {
    const buttons = [];
    const xs = [-0.07, 0, 0.07];
    const zs = [-0.06, -0.02, 0.02, 0.06];
    for (let r = 0; r < zs.length; r++) {
      for (let c = 0; c < xs.length; c++) {
        buttons.push({ x: xs[c], z: zs[r] });
      }
    }
    return buttons;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const lerpSpeed = isReducedMotion ? 0.3 : 0.08;

    // Indicator LED alert pulse
    if (ledRef.current) {
      const targetLed = isContact
        ? Math.sin(t * 8) > 0 ? 1.0 : 0.25
        : 0.15;
      ledRef.current.opacity = THREE.MathUtils.lerp(
        ledRef.current.opacity,
        targetLed,
        lerpSpeed * 2
      );
    }

    // Concentric holographic signal wave rings
    if (pulseRing1Ref.current) {
      if (isContact) {
        const s1 = 1 + ((t * 1.5) % 1) * 1.2;
        pulseRing1Ref.current.scale.set(s1, s1, s1);
      } else {
        pulseRing1Ref.current.scale.set(1, 1, 1);
      }
    }

    if (pulseRing2Ref.current) {
      if (isContact) {
        const s2 = 1 + (((t * 1.5) + 0.5) % 1) * 1.2;
        pulseRing2Ref.current.scale.set(s2, s2, s2);
      } else {
        pulseRing2Ref.current.scale.set(1, 1, 1);
      }
    }

    // Spotlight focus
    if (spotRef.current) {
      const targetIntensity = isContact ? 2.5 : 0.4;
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        targetIntensity,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 1.5]}>
      {/* Focused Downlight Spot illuminating Telephone Stand */}
      <spotLight
        ref={spotRef}
        position={[0, 2.8, 0.2]}
        target-position={[0, 0.95, 0]}
        color="#a5f3fc"
        intensity={0.4}
        angle={0.65}
        penumbra={0.5}
        castShadow
      />

      {/* ================= PEDESTAL / CONSOLE TABLE ================= */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.9, 32]} />
        <meshStandardMaterial color="#0b121e" roughness={0.35} metalness={0.85} />
      </mesh>

      {/* Illuminated Pedestal Rim */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.57, 0.57, 0.04, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>

      {/* Tabletop Accent Plate */}
      <mesh position={[0, 0.902, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.52, 32]} />
        <meshStandardMaterial color="#070c16" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* ================= RETRO-FUTURISTIC TELEPHONE BASE ================= */}
      <group position={[0, 0.96, 0]} rotation={[-0.22, 0, 0]}>
        {/* Sloped Console Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.11, 0.38]} />
          <meshStandardMaterial color="#101827" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Console Faceplate */}
        <mesh position={[0, 0.056, 0]}>
          <planeGeometry args={[0.42, 0.34]} />
          <meshStandardMaterial color="#090f1a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Handset Cradle Mount */}
        <mesh position={[0, 0.075, -0.06]}>
          <boxGeometry args={[0.4, 0.035, 0.12]} />
          <meshStandardMaterial color="#060a12" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* ================= TELEPHONE HANDSET RECEIVER ================= */}
        <group position={[0, 0.13, -0.06]}>
          {/* Central Grip Handle */}
          <mesh castShadow>
            <cylinderGeometry args={[0.032, 0.034, 0.28, 16]} />
            <meshStandardMaterial color="#152136" metalness={0.8} roughness={0.35} />
          </mesh>

          {/* Earpiece Assembly */}
          <group position={[0, 0.16, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.055, 24]} />
              <meshStandardMaterial color="#090e18" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Earpiece Acoustic Face Rim */}
            <mesh position={[0, 0.028, 0]}>
              <ringGeometry args={[0.02, 0.055, 24]} />
              <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Mouthpiece Assembly */}
          <group position={[0, -0.16, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.055, 24]} />
              <meshStandardMaterial color="#090e18" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Mouthpiece Mic Ring */}
            <mesh position={[0, -0.028, 0]}>
              <ringGeometry args={[0.02, 0.055, 24]} />
              <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>

        {/* ================= NUMERIC KEYPAD (3x4 MATRIX) ================= */}
        <group position={[0, 0.065, 0.09]}>
          {keypadButtons.map((btn, idx) => (
            <mesh key={`key-${idx}`} position={[btn.x, 0, btn.z]} castShadow>
              <boxGeometry args={[0.035, 0.015, 0.028]} />
              <meshStandardMaterial color="#1e2c44" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Comms Status Indicator LED */}
        <group position={[0.16, 0.065, -0.12]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
            <meshStandardMaterial color="#060a12" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.008, 0]}>
            <sphereGeometry args={[0.014, 16, 16]} />
            <meshBasicMaterial ref={ledRef} color="#00f0ff" transparent opacity={0.2} />
          </mesh>
        </group>

        {/* Holographic Uplink Concentric Wave Rings */}
        <group position={[0, 0.22, 0]}>
          <group ref={pulseRing1Ref}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.2, 32]} />
              <meshBasicMaterial
                color="#00f0ff"
                transparent
                opacity={isContact ? 0.6 : 0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          <group ref={pulseRing2Ref}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.24, 32]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={isContact ? 0.4 : 0.02}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
