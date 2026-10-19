'use client';

import '@/lib/react-patch';
import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { SceneLighting } from './SceneLighting';
import { DeveloperRoom } from './DeveloperRoom';
import { Workstation } from './Workstation';
import { SkillsGlobe } from './SkillsGlobe';
import { Projector } from './Projector';
import { AchievementArea } from './AchievementArea';
import { CameraController } from './CameraController';

function SceneDebugger() {
  const { scene, gl } = useThree();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __scene?: unknown; __gl?: unknown }).__scene = scene;
      (window as unknown as { __scene?: unknown; __gl?: unknown }).__gl = gl;
    }
  }, [scene, gl]);
  return null;
}

export function PortfolioCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        shadows
        camera={{
          fov: 48,
          near: 0.1,
          far: 50,
          position: [0, 2.1, 7.2]
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false
        }}
        dpr={[1, 2]}
        className="pointer-events-auto"
      >
        <color attach="background" args={['#0e121a']} />
        <fog attach="fog" args={['#0e121a', 14, 45]} />

        <Suspense fallback={null}>
          <SceneDebugger />
          <CameraController />
          <SceneLighting />
          <DeveloperRoom />
          <Workstation />
          <SkillsGlobe />
          <Projector />
          <AchievementArea />
        </Suspense>
      </Canvas>
    </div>
  );
}
