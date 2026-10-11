"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

interface ExperienceProps {
  isExploring: boolean;
}

export function Experience({ isExploring }: ExperienceProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-sky-200">
      <Canvas
        shadows
        camera={{ position: [0, 8, 14], fov: 50, near: 0.1, far: 150 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene isExploring={isExploring} />
        </Suspense>
      </Canvas>
    </div>
  );
}
