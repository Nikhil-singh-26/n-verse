'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneLighting } from './SceneLighting';
import { DeveloperRoom } from './DeveloperRoom';
import { Gate } from './Gate';
import { Character } from './Character';
import { Workstation } from './Workstation';
import { SkillsPlanet } from './SkillsPlanet';
import { Projector } from './Projector';
import { AchievementBoard } from './AchievementBoard';
import { Telephone } from './Telephone';
import { CameraController } from './CameraController';

export function PortfolioCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        shadows
        camera={{
          fov: 48,
          near: 0.1,
          far: 50,
          position: [0, 1.75, 15.2]
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
        <color attach="background" args={['#05070b']} />
        <fog attach="fog" args={['#05070b', 12, 45]} />

        <Suspense fallback={null}>
          <CameraController />
          <SceneLighting />
          <DeveloperRoom />
          <Gate />
          <Character />
          <Workstation />
          <SkillsPlanet />
          <Projector />
          <AchievementBoard />
          <Telephone />
        </Suspense>
      </Canvas>
    </div>
  );
}
