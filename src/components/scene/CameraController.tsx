'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS, OVERVIEW_CAMERA } from '@/lib/experience-config';

// Hermite cubic smoothstep interpolation
function smooth(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function CameraController() {
  const { camera, size } = useThree();
  const { scrollProgress, isExplorationMode, isReducedMotion } = useExperience();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Reusable pooled vectors to avoid garbage collection allocations inside animation frames
  const currentPos = useRef(new THREE.Vector3(0, 1.75, 15.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.6, 10.5));
  const destPos = useRef(new THREE.Vector3(0, 1.75, 15.2));
  const destLookAt = useRef(new THREE.Vector3(0, 1.6, 10.5));

  // Determine mobile aspect ratio and screen width
  const isMobile = size.width < 768 || size.width / Math.max(1, size.height) < 1.0;

  // Compute camera waypoints along the 6 trajectory segments (7 stations)
  useEffect(() => {
    if (isExplorationMode) return;

    const segmentCount = SECTIONS.length - 1; // 6 segments for 7 stations
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const floatIdx = clampedProgress * segmentCount;
    const startIndex = Math.min(Math.floor(floatIdx), segmentCount - 1);
    const endIndex = Math.min(startIndex + 1, segmentCount);
    const localT = smooth(floatIdx - startIndex);

    const fromSection = SECTIONS[startIndex];
    const toSection = SECTIONS[endIndex];

    // Responsive mobile framing adjustments
    const mobileZOffset = isMobile ? 0.85 : 0;
    const mobileYOffset = isMobile ? 0.2 : 0;

    destPos.current.set(
      THREE.MathUtils.lerp(fromSection.cameraPosition[0], toSection.cameraPosition[0], localT),
      THREE.MathUtils.lerp(fromSection.cameraPosition[1] + mobileYOffset, toSection.cameraPosition[1] + mobileYOffset, localT),
      THREE.MathUtils.lerp(fromSection.cameraPosition[2] + mobileZOffset, toSection.cameraPosition[2] + mobileZOffset, localT)
    );

    destLookAt.current.set(
      THREE.MathUtils.lerp(fromSection.cameraTarget[0], toSection.cameraTarget[0], localT),
      THREE.MathUtils.lerp(fromSection.cameraTarget[1], toSection.cameraTarget[1], localT),
      THREE.MathUtils.lerp(fromSection.cameraTarget[2], toSection.cameraTarget[2], localT)
    );
  }, [scrollProgress, isExplorationMode, isMobile]);

  useFrame((_, delta) => {
    if (isExplorationMode) {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      return;
    }

    // Smooth lerp factor based on motion preference
    const lerpFactor = isReducedMotion ? 0.35 : Math.min(1, delta * 4.2);

    currentPos.current.lerp(destPos.current, lerpFactor);
    currentLookAt.current.lerp(destLookAt.current, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return isExplorationMode ? (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.85}
      rotateSpeed={0.55}
      enableDamping
      dampingFactor={0.06}
      target={OVERVIEW_CAMERA.target}
    />
  ) : null;
}
