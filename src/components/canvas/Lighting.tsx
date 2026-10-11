"use client";

import { useRef } from "react";
import * as THREE from "three";

export function Lighting() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Ambient hemisphere light simulating sky and grass ground bounce */}
      <hemisphereLight
        args={["#93c5fd", "#15803d", 0.6]}
      />

      {/* Main warm stylized directional sunlight */}
      <directionalLight
        ref={dirLightRef}
        position={[25, 35, 20]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={90}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
        color="#fffbeb"
      />

      {/* Subtle fill light from the opposite angle for depth */}
      <directionalLight
        position={[-15, 12, -15]}
        intensity={0.3}
        color="#bae6fd"
      />
    </>
  );
}
