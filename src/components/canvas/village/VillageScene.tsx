"use client";

import { useMemo } from "react";
import { BUILDINGS_DATA } from "@/data/buildingsData";
import { BuildingStructure } from "./BuildingStructure";
import { useVillage } from "@/context/VillageContext";

function VillageLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.2, 2.8, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Crossarm */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <boxGeometry args={[0.6, 0.12, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Lantern Housing */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <boxGeometry args={[0.35, 0.45, 0.35]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Glowing Lantern Core */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[0.25, 0.35, 0.25]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
      {/* Point Light for local warm glow */}
      <pointLight position={[0, 2.4, 0]} intensity={0.6} distance={6} color="#fef08a" />
    </group>
  );
}

function VillageCentralPlaza() {
  return (
    <group position={[0, 0.02, 0]}>
      {/* Plaza Center Circular / Octagonal Flagstone Ring */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.3, 0.06, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 2.9, 0.06, 8]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>

      {/* Decorative Center Village Monument / Flower Planter */}
      <group position={[0, 0.4, 0]}>
        {/* Stone Basin */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.6, 0.6, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        {/* Soil top */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.2, 8]} />
          <meshStandardMaterial color="#3f2e1e" />
        </mesh>
        {/* Center Monolith / Voxel Crest */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.7, 1.4, 0.7]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Glowing Emerald Voxel Portfolio Core */}
        <mesh position={[0, 1.8, 0]} rotation={[0.4, 0.4, 0.4]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Plaza Directional Signpost */}
      <group position={[2.5, 0, -2.5]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.2, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* North Signboard */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.2, 0.06]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
        {/* East Signboard */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[0.9, 0.2, 0.06]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
      </group>
    </group>
  );
}

export function VillageScene() {
  const { doorsOpen, activeBuilding } = useVillage();

  // Lamppost placements throughout the village
  const lampPositions = useMemo<Array<[number, number, number]>>(
    () => [
      [-6.5, 0, -4.5],
      [6.5, 0, -4.5],
      [7.5, 0, 4.5],
      [-7.5, 0, 4.5],
      [-5.5, 0, 7.5],
      [5.5, 0, 7.5],
    ],
    []
  );

  return (
    <group>
      {/* Central Village Plaza with Monument */}
      <VillageCentralPlaza />

      {/* Village Lampposts */}
      {lampPositions.map((pos, i) => (
        <VillageLamp key={i} position={pos} />
      ))}

      {/* Six Portfolio Village Buildings */}
      {BUILDINGS_DATA.map((building) => (
        <BuildingStructure
          key={building.id}
          config={building}
          isOpen={!!doorsOpen[building.id]}
          isNearby={activeBuilding?.id === building.id}
        />
      ))}
    </group>
  );
}
