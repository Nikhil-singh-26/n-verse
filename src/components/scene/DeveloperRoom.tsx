'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export function DeveloperRoom() {
  // Memoized subtle particle dust in room
  const dustCount = 80;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <group>
      {/* ================= FLOOR ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial
          color="#080c14"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Floor grid line markings */}
      <gridHelper
        args={[22, 22, '#00f0ff', '#14233a']}
        position={[0, 0.01, 0]}
      />

      {/* Central Illuminated Floor Runway strip from Gate into Lab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]}>
        <planeGeometry args={[1.4, 18]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Runway Edge Glowing Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.7, 0.03, 3]}>
        <planeGeometry args={[0.04, 18]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.03, 3]}>
        <planeGeometry args={[0.04, 18]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>

      {/* ================= BACK WALL (with projection screen) ================= */}
      <mesh position={[0, 3.5, -11]} receiveShadow>
        <planeGeometry args={[22, 7]} />
        <meshStandardMaterial
          color="#0b101b"
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>

      {/* Projection Wall Panel Surface at [-2.5, 2.5, -10.9] */}
      <group position={[-2.5, 2.8, -10.88]}>
        {/* Frame */}
        <mesh>
          <planeGeometry args={[7.2, 4.2]} />
          <meshStandardMaterial color="#05080e" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Glowing border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(7.2, 4.2)]} />
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.5} />
        </lineSegments>
      </group>

      {/* ================= LEFT WALL ================= */}
      <mesh position={[-11, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[26, 7]} />
        <meshStandardMaterial
          color="#080c14"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Architectural Wall Ribs / Pillars on Left Wall */}
      {[-7, -2, 3, 8].map((z, i) => (
        <mesh key={`rib-l-${i}`} position={[-10.85, 3.5, z]}>
          <boxGeometry args={[0.3, 7, 0.5]} />
          <meshStandardMaterial color="#111927" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* ================= RIGHT WALL (telemetry / achievement board side) ================= */}
      <mesh position={[11, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[26, 7]} />
        <meshStandardMaterial
          color="#080c14"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Architectural Wall Ribs on Right Wall */}
      {[-7, -2, 3, 8].map((z, i) => (
        <mesh key={`rib-r-${i}`} position={[10.85, 3.5, z]}>
          <boxGeometry args={[0.3, 7, 0.5]} />
          <meshStandardMaterial color="#111927" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* ================= CEILING & TRUSSES ================= */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color="#05070d" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Ceiling Trusses with Recessed Linear Cyan Lights */}
      {[-6, 0, 6].map((z, i) => (
        <group key={`truss-${i}`} position={[0, 6.7, z]}>
          <mesh>
            <boxGeometry args={[21.5, 0.4, 0.4]} />
            <meshStandardMaterial color="#131b28" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Linear Light bar */}
          <mesh position={[0, -0.21, 0]}>
            <boxGeometry args={[16, 0.05, 0.1]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      ))}

      {/* Subtle floating ambient dust particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#00f0ff"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
