"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useVillage } from "@/context/VillageContext";
import {
  resolveVillageCollisions,
  getCameraOcclusionFraction,
} from "@/utils/collision";

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

  // Expanded boundaries of the 52x52 island platform
  const BOUNDS = 24.0;

  // --- THIRD-PERSON CAMERA ORBIT STATE ---
  // Yaw: horizontal angle (radians), 0 looks toward -Z
  const cameraYaw = useRef(0);
  // Pitch: vertical elevation angle (radians), default ~22 degrees
  const cameraPitch = useRef(0.38);
  // Distance from player
  const cameraDistance = useRef(6.8);
  // User mouse interaction tracking
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastUserOrbitTime = useRef(0);

  // Camera target interpolation caches (prevents GC pressure)
  const currentCamPos = useRef(new THREE.Vector3(0, 10, 16));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.35, 0));

  // Mouse / Pointer Event Listeners for 360-degree camera orbit
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Allow interaction if exploring and not clicking on HUD inputs
      if (!isExploring) return;
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement ||
        (e.target as HTMLElement)?.closest("button")
      ) {
        return;
      }
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isExploring) return;

      // Handle pointer movement if dragging or if pointer-lock is active
      const isLocked = document.pointerLockElement !== null;
      if (!isDragging.current && !isLocked) return;

      const deltaX = isLocked
        ? e.movementX
        : e.clientX - lastMousePos.current.x;
      const deltaY = isLocked
        ? e.movementY
        : e.clientY - lastMousePos.current.y;

      lastMousePos.current = { x: e.clientX, y: e.clientY };

      const SENSITIVITY = 0.004;
      cameraYaw.current -= deltaX * SENSITIVITY;

      // Vertical pitch: clamp between -0.05 (~-3 deg) and 1.15 (~66 deg)
      // Prevents flipping upside down or dipping through the ground
      cameraPitch.current = THREE.MathUtils.clamp(
        cameraPitch.current + deltaY * SENSITIVITY,
        -0.05,
        1.15
      );

      lastUserOrbitTime.current = performance.now() * 0.001;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isExploring) return;
      // Mouse wheel zoom
      cameraDistance.current = THREE.MathUtils.clamp(
        cameraDistance.current + e.deltaY * 0.004,
        3.5,
        9.0
      );
      lastUserOrbitTime.current = performance.now() * 0.001;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isExploring]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const dt = Math.min(delta, 0.1); // clamp large delta spikes
    const currentTime = state.clock.getElapsedTime();

    // 1. GATHER INPUTS
    const { forward, backward, left, right, sprint, jump } = keyboard;

    // Movement direction relative to camera horizontal yaw
    let inputX = 0;
    let inputZ = 0;

    if (isExploring) {
      if (forward) inputZ -= 1;
      if (backward) inputZ += 1;
      if (left) inputX -= 1;
      if (right) inputX += 1;
    }

    const hasInput = inputX !== 0 || inputZ !== 0;
    const moveDir = new THREE.Vector3();

    if (hasInput) {
      // Camera horizontal forward and right vectors
      const camYaw = cameraYaw.current;
      const forwardVec = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
      const rightVec = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

      // Compose movement in world space relative to camera orientation
      moveDir.addScaledVector(rightVec, inputX);
      moveDir.addScaledVector(forwardVec, -inputZ); // forward inputZ is -1
      moveDir.normalize();

      // Determine movement speed
      const speed = sprint ? 8.5 : 5.0;
      velocity.current.x = moveDir.x * speed;
      velocity.current.z = moveDir.z * speed;

      // 2. CHARACTER FACING DIRECTION
      // The character smoothly rotates to face the direction of travel
      // Backward movement moves toward the camera; character faces toward screen naturally
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - playerRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      playerRef.current.rotation.y += diff * 12 * dt;

      // Advance walking cycle animation
      walkCycle.current += dt * (sprint ? 14 : 9);

      // 3. CAMERA AUTO-FOLLOW (GENTLE SETTLE)
      // If moving forward and the user has not touched mouse orbit for > 1.4s,
      // gently rotate camera to settle behind character's facing direction.
      // NEVER auto-flip 180 degrees when moving backward (S key)!
      const timeSinceMouseOrbit = currentTime - lastUserOrbitTime.current;
      if (forward && !backward && timeSinceMouseOrbit > 1.4) {
        // Ideal behind yaw is opposite to travel angle
        const behindYaw = targetAngle;
        let yawDiff = behindYaw - cameraYaw.current;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        cameraYaw.current += yawDiff * (1.6 * dt);
      }
    } else {
      // Damping / friction
      velocity.current.x *= Math.max(0, 1 - 14 * dt);
      velocity.current.z *= Math.max(0, 1 - 14 * dt);
    }

    // 4. JUMP & GRAVITY PHYSICS
    const GRAVITY = -22;
    if (isExploring && jump && isGrounded.current) {
      velocity.current.y = 8.0; // Jump impulse
      isGrounded.current = false;
    }

    velocity.current.y += GRAVITY * dt;

    // Proposed new player coordinates
    const nextX = playerRef.current.position.x + velocity.current.x * dt;
    const nextZ = playerRef.current.position.z + velocity.current.z * dt;
    const nextY = playerRef.current.position.y + velocity.current.y * dt;

    // 5. BUILDING & OBSTACLE COLLISION RESOLUTION
    // Prevents walking through walls, corners, closed doorways, or empty building interiors
    const resolved = resolveVillageCollisions(nextX, nextZ, 0.45);

    // Apply resolved X & Z positions
    playerRef.current.position.x = resolved.x;
    playerRef.current.position.z = resolved.z;
    playerRef.current.position.y = nextY;

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

    // Report player position for village interaction proximity detection
    updatePlayerPosition(
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    );

    // 6. ANIMATE AVATAR LIMBS
    const isMoving = hasInput || velocity.current.lengthSq() > 0.1;
    const swing = isMoving && isGrounded.current ? Math.sin(walkCycle.current) * 0.7 : 0;
    const bodyBob = isMoving && isGrounded.current ? Math.abs(Math.sin(walkCycle.current * 2)) * 0.08 : 0;

    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (bodyRef.current) bodyRef.current.position.y = 0.95 + bodyBob;

    // 7. THIRD-PERSON CAMERA RIG
    const playerPos = playerRef.current.position;

    if (isExploring) {
      // Focus target: slightly above the character's center
      const targetLook = new THREE.Vector3(
        playerPos.x,
        playerPos.y + 1.35,
        playerPos.z
      );

      // Spherical coordinates from yaw, pitch, and distance
      const yaw = cameraYaw.current;
      const pitch = cameraPitch.current;
      const dist = cameraDistance.current;

      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const sinYaw = Math.sin(yaw);
      const cosYaw = Math.cos(yaw);

      // Ideal camera position in world space
      const idealCamX = targetLook.x + sinYaw * cosPitch * dist;
      const idealCamY = targetLook.y + sinPitch * dist;
      const idealCamZ = targetLook.z + cosYaw * cosPitch * dist;

      // Camera Occlusion Check:
      // Prevents the camera from clipping through building walls or solid objects
      const occlusionFraction = getCameraOcclusionFraction(
        targetLook.x,
        targetLook.z,
        idealCamX,
        idealCamZ
      );

      // If obstructed, pull camera along the ray in front of the wall
      let actualDist = dist;
      if (occlusionFraction < 1.0) {
        actualDist = Math.max(2.4, dist * occlusionFraction - 0.4);
      }

      const safeCamX = targetLook.x + sinYaw * cosPitch * actualDist;
      // Clamp camera Y so it never dips below the ground
      const safeCamY = Math.max(0.6, targetLook.y + sinPitch * actualDist);
      const safeCamZ = targetLook.z + cosYaw * cosPitch * actualDist;

      const targetCam = new THREE.Vector3(safeCamX, safeCamY, safeCamZ);

      // Smooth interpolation for jitter-free tracking
      currentCamPos.current.lerp(targetCam, 9.0 * dt);
      currentLookAt.current.lerp(targetLook, 11.0 * dt);

      state.camera.position.copy(currentCamPos.current);
      state.camera.lookAt(currentLookAt.current);
    } else {
      // Cinematic landing intro camera: sweeping panoramic view of the portfolio village
      const t = currentTime * 0.12;
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
