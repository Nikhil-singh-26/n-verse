"use client";

import { Text } from "@react-three/drei";

interface BuildingSignProps {
  text: string;
  category?: string;
  signColor?: string;
  textColor?: string;
  accentColor?: string;
}

export function BuildingSign({
  text,
  category,
  signColor = "#1e293b",
  textColor = "#ffffff",
  accentColor = "#38bdf8",
}: BuildingSignProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* Sign Backing Board */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.65, 0.08]} />
        <meshStandardMaterial color={signColor} roughness={0.7} />
      </mesh>

      {/* Decorative Sign Frame Trim */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.28, 0.72, 0.02]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} />
      </mesh>

      {/* Mounting Brackets */}
      <mesh position={[-0.8, 0.42, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.42, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Main Building Name Text (Drei Text) */}
      <Text
        position={[0, category ? 0.08 : 0, 0.06]}
        fontSize={0.22}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        fontWeight={800}
      >
        {text}
      </Text>

      {/* Optional Subtitle Category */}
      {category && (
        <Text
          position={[0, -0.16, 0.06]}
          fontSize={0.09}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          fontWeight={600}
        >
          {category.toUpperCase()}
        </Text>
      )}
    </group>
  );
}
