'use client';

import React from 'react';

export function SceneLighting() {
  return (
    <>
      {/* Base ambient lighting with cool cyan-slate tint */}
      <ambientLight color="#081426" intensity={1.5} />

      {/* Main architectural overhead lights */}
      <directionalLight
        position={[2, 7, 3]}
        color="#cce7ff"
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Secondary fill light */}
      <directionalLight position={[-4, 5, -2]} color="#0055aa" intensity={0.8} />

      {/* Gate Cyan Neon Glow */}
      <pointLight position={[0, 3.2, 10.5]} color="#00f0ff" intensity={3.5} distance={12} decay={2} />

      {/* Workstation Computer Glow */}
      <pointLight position={[-3.2, 1.6, 4.2]} color="#00a3ff" intensity={2.5} distance={6} decay={2} />

      {/* Skills Planet Core Light */}
      <pointLight position={[3.5, 2.2, 0.5]} color="#00f0ff" intensity={4.0} distance={9} decay={2} />

      {/* Telemetry Board Wall Light */}
      <pointLight position={[7.5, 2.5, -3.5]} color="#38bdf8" intensity={2.8} distance={8} decay={2} />

      {/* Telephone / Comms Console Light */}
      <pointLight position={[0, 1.6, 1.5]} color="#00e5ff" intensity={2.2} distance={5} decay={2} />
    </>
  );
}
