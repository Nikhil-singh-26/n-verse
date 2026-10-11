"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface InteractiveDoorProps {
  isOpen: boolean;
  isNearby: boolean;
  doorWidth?: number;
  doorHeight?: number;
  doorColor: string;
  frameColor: string;
  accentColor: string;
}

export function InteractiveDoor({
  isOpen,
  isNearby,
  doorWidth = 1.1,
  doorHeight = 2.1,
  doorColor,
  frameColor,
  accentColor,
}: InteractiveDoorProps) {
  // Reference to the hinge pivot group
  const hingeRef = useRef<THREE.Group>(null);
  const glowMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Target angle: 0 when closed, ~-1.55 rad (approx 90 deg inward) when open
  const targetAngle = isOpen ? -1.55 : 0;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Smooth hinge rotation interpolation
    if (hingeRef.current) {
      hingeRef.current.rotation.y = THREE.MathUtils.lerp(
        hingeRef.current.rotation.y,
        targetAngle,
        7 * dt
      );
    }

    // Pulse the threshold glow when player is nearby
    if (glowMatRef.current) {
      if (isNearby) {
        const pulse = 0.5 + Math.sin(state.clock.getElapsedTime() * 4) * 0.3;
        glowMatRef.current.emissiveIntensity = pulse;
      } else {
        glowMatRef.current.emissiveIntensity = 0.05;
      }
    }
  });

  const halfWidth = doorWidth / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Door Frame Surround */}
      {/* Left jamb */}
      <mesh position={[-halfWidth - 0.08, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, doorHeight + 0.1, 0.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.9} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[halfWidth + 0.08, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, doorHeight + 0.1, 0.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.9} />
      </mesh>
      {/* Header lintel */}
      <mesh position={[0, doorHeight + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth + 0.3, 0.14, 0.22]} />
        <meshStandardMaterial color={frameColor} roughness={0.9} />
      </mesh>

      {/* Threshold / Doorstep */}
      <mesh position={[0, 0.03, 0.15]} receiveShadow>
        <boxGeometry args={[doorWidth + 0.2, 0.06, 0.4]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Interactive Glowing Entrance Mat (visual feedback when nearby) */}
      <mesh position={[0, 0.04, 0.65]} receiveShadow>
        <boxGeometry args={[doorWidth, 0.02, 0.6]} />
        <meshStandardMaterial
          ref={glowMatRef}
          color={isNearby ? accentColor : "#334155"}
          emissive={accentColor}
          emissiveIntensity={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* HINGE PIVOT GROUP: Located at the left jamb edge */}
      <group ref={hingeRef} position={[-halfWidth, 0, 0]}>
        {/* Door Slab: Offset by +halfWidth so the hinge pivot is exactly on the left edge */}
        <group position={[halfWidth, doorHeight / 2, 0]}>
          {/* Main door panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, 0.08]} />
            <meshStandardMaterial color={doorColor} roughness={0.8} />
          </mesh>

          {/* Decorative panels on door */}
          <mesh position={[0, 0.45, 0.045]}>
            <boxGeometry args={[doorWidth * 0.75, doorHeight * 0.35, 0.02]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.45, 0.045]}>
            <boxGeometry args={[doorWidth * 0.75, doorHeight * 0.35, 0.02]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>

          {/* Door Handle / Latch: on right side of door */}
          <group position={[halfWidth - 0.15, -0.05, 0.06]}>
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.14, 0.05]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0, -0.12]} castShadow>
              <boxGeometry args={[0.04, 0.14, 0.05]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
