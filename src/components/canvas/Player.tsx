"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useVillage } from "@/context/VillageContext";

interface PlayerProps {
  isExploring: boolean;
}

export function Player({ isExploring }: PlayerProps) {
  const keyboard = useKeyboard();
  const { updatePlayerPosition } = useVillage();

  // Root player group reference (handles position and orientation)
  const playerRef = useRef<THREE.Group>(null);

  // Limb references for walking cycle animations
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  // Physics state
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  const walkCycle = useRef(0);

  // Smooth camera target caches
  const currentCamPos = useRef(new THREE.Vector3(0, 10, 16));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  // Expanded boundaries of the 52x52 island platform
  const BOUNDS = 24.0;

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const dt = Math.min(delta, 0.1); // clamp large delta spikes

    // If player is exploring, accept inputs
    const { forward, backward, left, right, sprint, jump } = keyboard;

    // Calculate move direction in world space
    const moveDir = new THREE.Vector3();
    if (isExploring) {
      if (forward) moveDir.z -= 1;
      if (backward) moveDir.z += 1;
      if (left) moveDir.x -= 1;
      if (right) moveDir.x += 1;
    }

    const isMoving = moveDir.lengthSq() > 0;

    if (isMoving) {
      moveDir.normalize();

      // Determine movement speed
      const speed = sprint ? 8.5 : 5.0;
      velocity.current.x = moveDir.x * speed;
      velocity.current.z = moveDir.z * speed;

      // Smoothly rotate character to face movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - playerRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      playerRef.current.rotation.y += diff * 12 * dt;

      // Advance walk cycle
      walkCycle.current += dt * (sprint ? 14 : 9);
    } else {
      // Damping / friction
      velocity.current.x *= Math.max(0, 1 - 14 * dt);
      velocity.current.z *= Math.max(0, 1 - 14 * dt);
    }

    // Handle Jump & Gravity
    const GRAVITY = -22;
    if (isExploring && jump && isGrounded.current) {
      velocity.current.y = 8.0; // Jump impulse
      isGrounded.current = false;
    }

    // Apply gravity
    velocity.current.y += GRAVITY * dt;

    // Apply translation
    playerRef.current.position.x += velocity.current.x * dt;
    playerRef.current.position.z += velocity.current.z * dt;
    playerRef.current.position.y += velocity.current.y * dt;

    // Ground collision: Terrain base height is y = 0
    if (playerRef.current.position.y <= 0) {
      playerRef.current.position.y = 0;
      velocity.current.y = 0;
      isGrounded.current = true;
    }

    // World boundary collision (cannot fall off the perimeter platform)
    playerRef.current.position.x = THREE.MathUtils.clamp(
      playerRef.current.position.x,
      -BOUNDS,
      BOUNDS
    );
    playerRef.current.position.z = THREE.MathUtils.clamp(
      playerRef.current.position.z,
      -BOUNDS,
      BOUNDS
    );

    // Update player position in village context for door proximity detection
    updatePlayerPosition(
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    );

    // Animate Limbs
    const swing = isMoving && isGrounded.current ? Math.sin(walkCycle.current) * 0.7 : 0;
    const bodyBob = isMoving && isGrounded.current ? Math.abs(Math.sin(walkCycle.current * 2)) * 0.08 : 0;

    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (bodyRef.current) bodyRef.current.position.y = 0.95 + bodyBob;

    // CAMERA BEHAVIOR
    const playerPos = playerRef.current.position;

    if (isExploring) {
      // Third-person following camera
      const targetCam = new THREE.Vector3(
        playerPos.x,
        playerPos.y + 4.5,
        playerPos.z + 8.5
      );
      const targetLook = new THREE.Vector3(
        playerPos.x,
        playerPos.y + 1.2,
        playerPos.z
      );

      state.camera.position.lerp(targetCam, 5.0 * dt);
      currentLookAt.current.lerp(targetLook, 6.0 * dt);
      state.camera.lookAt(currentLookAt.current);
    } else {
      // Cinematic landing intro camera: sweeping panoramic view of the portfolio village
      const t = state.clock.getElapsedTime() * 0.12;
      const introCam = new THREE.Vector3(
        Math.sin(t) * 18,
        12 + Math.cos(t * 0.7) * 2,
        20 + Math.cos(t) * 5
      );
      state.camera.position.lerp(introCam, 2.5 * dt);
      currentLookAt.current.lerp(new THREE.Vector3(0, 1.5, 0), 3.0 * dt);
      state.camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {/* Voxel Character Mesh hierarchy */}
      <group ref={bodyRef} position={[0, 0.95, 0]}>
        {/* Head */}
        <group position={[0, 0.72, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.7} />
          </mesh>

          {/* Hair / Cap layer */}
          <mesh position={[0, 0.16, -0.02]} castShadow>
            <boxGeometry args={[0.58, 0.28, 0.58]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>

          {/* Cyber Visor / Tech Goggles (glowing teal/cyan) */}
          <mesh position={[0, 0.05, 0.27]} castShadow>
            <boxGeometry args={[0.46, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>

          {/* Stylized Headphones */}
          <mesh position={[-0.3, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.24]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0.3, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.24]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.62, 0.06, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Torso / Developer Hoodie */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.65, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Emerald Developer Badge on chest */}
        <mesh position={[0, 0.2, 0.18]}>
          <boxGeometry args={[0.16, 0.16, 0.02]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Tech Backpack */}
        <mesh position={[0, 0.15, -0.22]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.16]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.42, 0.42, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.6, 0.22]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.2, 0.15, 0.2]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.42, 0.42, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.6, 0.22]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.2, 0.15, 0.2]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.6, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.55, 0.03]} castShadow>
          <boxGeometry args={[0.25, 0.12, 0.32]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.6, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.55, 0.03]} castShadow>
          <boxGeometry args={[0.25, 0.12, 0.32]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
      </group>

      {/* Ground Shadow Blob */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.45, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
