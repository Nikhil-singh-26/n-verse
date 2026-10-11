"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  type?: "oak" | "pine";
}

function VoxelTree({ position, scale = 1, type = "oak" }: TreeProps) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tree Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 3, 0.7]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>

      {/* Tree Foliage */}
      {type === "oak" ? (
        <group position={[0, 3.2, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.4, 2.8]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 1.2, 2.1]} />
            <meshStandardMaterial color="#388e3c" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.9, 1.3]} />
            <meshStandardMaterial color="#4caf50" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 3.4, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.2, 2.4]} />
            <meshStandardMaterial color="#1b5e20" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.1, 1.8]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 1, 1.1]} />
            <meshStandardMaterial color="#388e3c" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function VoxelRock({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.4, 0.25, 0.3]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function VoxelFlower({
  position,
  color = "#ef4444",
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.26, 0.22, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
    </group>
  );
}

function VoxelFence({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Left post */}
      <mesh position={[-0.9, 0.45, 0]} castShadow>
        <boxGeometry args={[0.16, 0.9, 0.16]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Right post */}
      <mesh position={[0.9, 0.45, 0]} castShadow>
        <boxGeometry args={[0.16, 0.9, 0.16]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Top rail */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.9, 0.1, 0.08]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Bottom rail */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.9, 0.1, 0.08]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloatingClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x += delta * 0.4;
      if (cloudsRef.current.position.x > 45) {
        cloudsRef.current.position.x = -45;
      }
    }
  });

  const cloudClusters = useMemo(() => {
    return [
      { pos: [-24, 18, -18] as [number, number, number], size: [7, 1.8, 4] as [number, number, number] },
      { pos: [-16, 19, -15] as [number, number, number], size: [5, 2.0, 3] as [number, number, number] },
      { pos: [12, 20, -22] as [number, number, number], size: [9, 1.8, 5] as [number, number, number] },
      { pos: [22, 18, 8] as [number, number, number], size: [8, 1.6, 4] as [number, number, number] },
      { pos: [-10, 19, 18] as [number, number, number], size: [7, 1.8, 5] as [number, number, number] },
      { pos: [16, 17, 20] as [number, number, number], size: [8, 1.9, 4.5] as [number, number, number] },
      { pos: [-26, 18, 10] as [number, number, number], size: [8, 2.0, 5] as [number, number, number] },
    ];
  }, []);

  return (
    <group ref={cloudsRef}>
      {cloudClusters.map((cloud, index) => (
        <mesh key={index} position={cloud.pos}>
          <boxGeometry args={cloud.size} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.88}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function World() {
  // Connected village pathway network
  const pathTiles = useMemo(() => {
    const tiles: Array<{
      pos: [number, number, number];
      size: [number, number, number];
      rot: number;
      color: string;
    }> = [];

    const colors = ["#94a3b8", "#64748b", "#78716c", "#cbd5e1"];

    const addSegment = (
      from: [number, number],
      to: [number, number],
      width = 1.4,
      steps = 10
    ) => {
      const [fx, fz] = from;
      const [tx, tz] = to;
      const dx = tx - fx;
      const dz = tz - fz;
      const len = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const stepCount = Math.max(3, Math.floor(len / 1.1));

      for (let i = 0; i <= stepCount; i++) {
        const t = i / stepCount;
        const cx = fx + dx * t;
        const cz = fz + dz * t;
        // Two parallel stepping tiles
        [-0.45, 0.45].forEach((offset, idx) => {
          const perpAngle = angle + Math.PI / 2;
          const px = cx + Math.sin(perpAngle) * offset;
          const pz = cz + Math.cos(perpAngle) * offset;
          tiles.push({
            pos: [px, 0.04, pz],
            size: [0.85, 0.08, 0.95],
            rot: angle + (Math.sin(i * 3 + idx) * 0.08),
            color: colors[(i * 2 + idx) % colors.length],
          });
        });
      }
    };

    // 1. Center to About Me (Cottage): [-11.4, -8.0]
    addSegment([0, -2.5], [-11.4, -8.0]);

    // 2. Center to Skills (Lab): [11.4, -8.0]
    addSegment([0, -2.5], [11.4, -8.0]);

    // 3. Center to Projects (Studio): [12.3, 2.0]
    addSegment([2.5, 0], [12.3, 2.0]);

    // 4. Center to Experience (Office): [10.1, 10.6]
    addSegment([2.0, 2.0], [10.1, 10.6]);

    // 5. Center to Education (Academy): [-10.1, 10.6]
    addSegment([-2.0, 2.0], [-10.1, 10.6]);

    // 6. Center to Contact (Outpost): [-12.3, 2.0]
    addSegment([-2.5, 0], [-12.3, 2.0]);

    // Outer Village Ring Paths connecting adjacent buildings
    addSegment([-11.4, -8.0], [-12.3, 2.0]); // About -> Contact
    addSegment([-12.3, 2.0], [-10.1, 10.6]); // Contact -> Education
    addSegment([-10.1, 10.6], [10.1, 10.6]); // Education -> Experience
    addSegment([10.1, 10.6], [12.3, 2.0]);   // Experience -> Projects
    addSegment([12.3, 2.0], [11.4, -8.0]);   // Projects -> Skills
    addSegment([11.4, -8.0], [-11.4, -8.0]); // Skills -> About

    return tiles;
  }, []);

  // Trees framing the village perimeter and filling gardens
  const treePlacements = useMemo(
    () => [
      // Behind About Me (NW)
      { pos: [-16, 0, -16] as [number, number, number], scale: 1.3, type: "oak" as const },
      { pos: [-19, 0, -12] as [number, number, number], scale: 1.2, type: "pine" as const },
      { pos: [-12, 0, -17] as [number, number, number], scale: 1.1, type: "oak" as const },

      // Behind Skills (NE)
      { pos: [16, 0, -16] as [number, number, number], scale: 1.3, type: "pine" as const },
      { pos: [19, 0, -12] as [number, number, number], scale: 1.2, type: "oak" as const },
      { pos: [12, 0, -17] as [number, number, number], scale: 1.15, type: "pine" as const },

      // Behind Projects (East)
      { pos: [21, 0, 2] as [number, number, number], scale: 1.3, type: "oak" as const },
      { pos: [20, 0, 7] as [number, number, number], scale: 1.1, type: "pine" as const },
      { pos: [20, 0, -3] as [number, number, number], scale: 1.2, type: "oak" as const },

      // Behind Experience (SE)
      { pos: [16, 0, 18] as [number, number, number], scale: 1.2, type: "pine" as const },
      { pos: [11, 0, 19] as [number, number, number], scale: 1.3, type: "oak" as const },

      // Behind Education (SW)
      { pos: [-16, 0, 18] as [number, number, number], scale: 1.25, type: "pine" as const },
      { pos: [-11, 0, 19] as [number, number, number], scale: 1.35, type: "oak" as const },

      // Behind Contact (West)
      { pos: [-21, 0, 2] as [number, number, number], scale: 1.3, type: "pine" as const },
      { pos: [-20, 0, -3] as [number, number, number], scale: 1.15, type: "oak" as const },
      { pos: [-20, 0, 7] as [number, number, number], scale: 1.2, type: "pine" as const },

      // North village boundary grove
      { pos: [-4, 0, -19] as [number, number, number], scale: 1.2, type: "oak" as const },
      { pos: [4, 0, -19] as [number, number, number], scale: 1.1, type: "pine" as const },
      { pos: [0, 0, -21] as [number, number, number], scale: 1.3, type: "pine" as const },

      // South village boundary grove
      { pos: [0, 0, 21] as [number, number, number], scale: 1.25, type: "oak" as const },
      { pos: [-4, 0, 20] as [number, number, number], scale: 1.1, type: "pine" as const },
      { pos: [4, 0, 20] as [number, number, number], scale: 1.2, type: "oak" as const },
    ],
    []
  );

  // Rocks flanking path borders and natural areas
  const rockPlacements = useMemo(
    () => [
      { pos: [-7, 0, -8] as [number, number, number], scale: 1.1, rot: [0, 0.4, 0] as [number, number, number] },
      { pos: [7, 0, -8] as [number, number, number], scale: 1.0, rot: [0, 1.2, 0] as [number, number, number] },
      { pos: [8, 0, 1] as [number, number, number], scale: 0.9, rot: [0, -0.6, 0] as [number, number, number] },
      { pos: [-8, 0, 1] as [number, number, number], scale: 1.0, rot: [0, 0.9, 0] as [number, number, number] },
      { pos: [6, 0, 8] as [number, number, number], scale: 1.2, rot: [0, 2.1, 0] as [number, number, number] },
      { pos: [-6, 0, 8] as [number, number, number], scale: 1.15, rot: [0, -1.3, 0] as [number, number, number] },
      { pos: [-18, 0, -8] as [number, number, number], scale: 1.4, rot: [0, 0.7, 0] as [number, number, number] },
      { pos: [18, 0, -8] as [number, number, number], scale: 1.3, rot: [0, -0.5, 0] as [number, number, number] },
    ],
    []
  );

  // Flower meadow clusters
  const flowerPlacements = useMemo(
    () => [
      // Central plaza ring flowers
      { pos: [-3.2, 0, -2.5] as [number, number, number], color: "#ef4444" },
      { pos: [3.2, 0, -2.5] as [number, number, number], color: "#38bdf8" },
      { pos: [3.5, 0, 2.5] as [number, number, number], color: "#fbbf24" },
      { pos: [-3.5, 0, 2.5] as [number, number, number], color: "#ec4899" },
      { pos: [0, 0, 3.8] as [number, number, number], color: "#a855f7" },
      { pos: [0, 0, -3.8] as [number, number, number], color: "#f59e0b" },

      // Around Cottage (About Me)
      { pos: [-8.5, 0, -9.5] as [number, number, number], color: "#ef4444" },
      { pos: [-9.2, 0, -9.0] as [number, number, number], color: "#fbbf24" },
      { pos: [-13.5, 0, -6.5] as [number, number, number], color: "#ec4899" },

      // Around Skills Lab
      { pos: [8.5, 0, -9.5] as [number, number, number], color: "#38bdf8" },
      { pos: [9.2, 0, -9.0] as [number, number, number], color: "#06b6d4" },

      // Around Projects Studio
      { pos: [13.2, 0, 4.8] as [number, number, number], color: "#f97316" },
      { pos: [11.8, 0, -0.5] as [number, number, number], color: "#fbbf24" },

      // Around Experience Office
      { pos: [8.5, 0, 11.5] as [number, number, number], color: "#64748b" },
      { pos: [12.5, 0, 8.5] as [number, number, number], color: "#e2e8f0" },

      // Around Education Hall
      { pos: [-8.5, 0, 11.5] as [number, number, number], color: "#dc2626" },
      { pos: [-12.5, 0, 8.5] as [number, number, number], color: "#d97706" },

      // Around Contact Outpost
      { pos: [-13.2, 0, 4.8] as [number, number, number], color: "#f59e0b" },
      { pos: [-11.8, 0, -0.5] as [number, number, number], color: "#14b8a6" },
    ],
    []
  );

  // Village fences
  const fencePlacements = useMemo(
    () => [
      { pos: [-5, 0, -5] as [number, number, number], rot: -0.6 },
      { pos: [5, 0, -5] as [number, number, number], rot: 0.6 },
      { pos: [-6, 0, 5] as [number, number, number], rot: 0.7 },
      { pos: [6, 0, 5] as [number, number, number], rot: -0.7 },
    ],
    []
  );

  // Perimeter boundary hills (expanded island)
  const perimeterHills = useMemo(() => {
    return [
      { pos: [-22, 0.75, -12] as [number, number, number], size: [7, 1.5, 12] as [number, number, number] },
      { pos: [-22, 0.6, 12] as [number, number, number], size: [7, 1.2, 12] as [number, number, number] },
      { pos: [22, 0.7, -12] as [number, number, number], size: [7, 1.4, 12] as [number, number, number] },
      { pos: [22, 0.8, 12] as [number, number, number], size: [7, 1.6, 12] as [number, number, number] },
      { pos: [0, 0.65, -24] as [number, number, number], size: [18, 1.3, 6] as [number, number, number] },
      { pos: [0, 0.65, 24] as [number, number, number], size: [18, 1.3, 6] as [number, number, number] },
    ];
  }, []);

  return (
    <group>
      {/* Expanded Main Ground Platform: 52 x 52 Voxel Grass Layer */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[52, 0.5, 52]} />
        <meshStandardMaterial color="#3ea832" roughness={0.8} />
      </mesh>

      {/* Earth/Dirt Sub-layer */}
      <mesh position={[0, -1.75, 0]} receiveShadow>
        <boxGeometry args={[52.2, 2.5, 52.2]} />
        <meshStandardMaterial color="#5a3d28" roughness={0.95} />
      </mesh>

      {/* Bedrock / Dark Stone Foundation */}
      <mesh position={[0, -3.5, 0]}>
        <boxGeometry args={[52.4, 1, 52.4]} />
        <meshStandardMaterial color="#292524" roughness={1.0} />
      </mesh>

      {/* Perimeter Hill Voxel Blocks */}
      {perimeterHills.map((hill, i) => (
        <mesh key={`hill-${i}`} position={hill.pos} castShadow receiveShadow>
          <boxGeometry args={hill.size} />
          <meshStandardMaterial color="#35982a" roughness={0.8} />
        </mesh>
      ))}

      {/* Cobblestone Village Pathways */}
      {pathTiles.map((tile, i) => (
        <mesh
          key={`path-${i}`}
          position={tile.pos}
          rotation={[0, tile.rot, 0]}
          receiveShadow
        >
          <boxGeometry args={tile.size} />
          <meshStandardMaterial color={tile.color} roughness={0.85} />
        </mesh>
      ))}

      {/* Fences */}
      {fencePlacements.map((fence, i) => (
        <VoxelFence key={`fence-${i}`} position={fence.pos} rotation={fence.rot} />
      ))}

      {/* Trees */}
      {treePlacements.map((tree, i) => (
        <VoxelTree
          key={`tree-${i}`}
          position={tree.pos}
          scale={tree.scale}
          type={tree.type}
        />
      ))}

      {/* Rocks */}
      {rockPlacements.map((rock, i) => (
        <VoxelRock
          key={`rock-${i}`}
          position={rock.pos}
          scale={rock.scale}
          rotation={rock.rot}
        />
      ))}

      {/* Flowers */}
      {flowerPlacements.map((flower, i) => (
        <VoxelFlower
          key={`flower-${i}`}
          position={flower.pos}
          color={flower.color}
        />
      ))}

      {/* Floating voxel clouds */}
      <FloatingClouds />
    </group>
  );
}
