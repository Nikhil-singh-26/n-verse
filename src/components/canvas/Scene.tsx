"use client";

import { Lighting } from "./Lighting";
import { World } from "./World";
import { Player } from "./Player";
import { VillageScene } from "./village/VillageScene";
import { Sky } from "@react-three/drei";

interface SceneProps {
  isExploring: boolean;
}

export function Scene({ isExploring }: SceneProps) {
  return (
    <>
      {/* Soft atmospheric distant fog for depth blending */}
      <fog attach="fog" args={["#bae6fd", 25, 75]} />

      {/* Sky background */}
      <color attach="background" args={["#bae6fd"]} />

      {/* Stylized Sky dome from Drei */}
      <Sky
        sunPosition={[28, 38, 22]}
        turbidity={4}
        rayleigh={1.2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Sunlight and ambient bounce */}
      <Lighting />

      {/* Stylized Outdoor World (terrain, pathways, perimeter trees, clouds) */}
      <World />

      {/* Portfolio Village (Six buildings with interactive doors & signs) */}
      <VillageScene />

      {/* Controllable Player Character & Camera Rig */}
      <Player isExploring={isExploring} />
    </>
  );
}
