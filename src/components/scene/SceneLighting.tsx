'use client';

import React from 'react';

export function SceneLighting() {
  return (
    <>
      {/* Warm natural ambient illumination */}
      <ambientLight color="#fff6eb" intensity={1.1} />

      {/* Primary architectural window / sunlight direction */}
      <directionalLight
        position={[-3.5, 4.5, 4.0]}
        color="#fffaf0"
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0001}
      />

      {/* Secondary warm bounce fill light */}
      <directionalLight position={[4.0, 3.2, -2.0]} color="#eddcc9" intensity={0.65} />

      {/* Ceiling recessed warm ambient spots */}
      <pointLight position={[0, 3.8, 1.0]} color="#fffaed" intensity={1.2} distance={8} decay={2} />
    </>
  );
}
