'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { projectsData } from '@/data/projects';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Network,
  Activity,
  Scroll,
  ArrowRight
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

// Cubic Bezier interpolation helper for 3D vector flight path
function getCubicBezierPoint(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number
): THREE.Vector3 {
  const oneMinusT = 1 - t;
  const oneMinusTSq = oneMinusT * oneMinusT;
  const tSq = t * t;

  return new THREE.Vector3()
    .copy(p0)
    .multiplyScalar(oneMinusTSq * oneMinusT)
    .addScaledVector(p1, 3 * oneMinusTSq * t)
    .addScaledVector(p2, 3 * oneMinusT * tSq)
    .addScaledVector(p3, tSq * t);
}

// Hermite cubic ease-in-out
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Projector() {
  const {
    activeSection,
    activeProjectIndex,
    setActiveProjectIndex,
    activeProjectSlug,
    setActiveProjectSlug,
    isReducedMotion,
    projectPresentationState,
    setProjectPresentationState,
    projectPageState,
    setProjectPageState,
    isCameraAtProjector,
    setIsProjectAnimating
  } = useExperience();

  const isProjects = activeSection === 'projects';
  const currentProject = projectsData[activeProjectIndex] || projectsData[0];
  const detailedProject = projectsData.find((p) => p.slug === activeProjectSlug);

  // 3D Object references
  const upperReelRef = useRef<THREE.Group>(null);
  const lowerReelRef = useRef<THREE.Group>(null);
  const lensGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const flyingPageRef = useRef<THREE.Group>(null);
  const wallShadowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Flight progress ref (0 = on wooden table stack, 1 = settled flush on left wall)
  const flightProgress = useRef<number>(0);
  const prevIndexRef = useRef<number>(activeProjectIndex);

  // Dedicated 3D target for spotlight illumination on the left wall board
  const spotTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-4.945, 2.15, 0.8);
    return obj;
  }, []);

  // Flight trajectory definition (from table stack to left wall)
  const trajectory = useMemo(() => {
    return {
      p0: new THREE.Vector3(-2.3, 0.775, 1.25), // On the wooden table stack
      p1: new THREE.Vector3(-2.8, 1.55, 1.15),  // Lift-off upward arc
      p2: new THREE.Vector3(-3.85, 2.15, 0.95), // Swooping through the golden projector beam
      p3: new THREE.Vector3(-4.94, 2.15, 0.8)   // Flush settlement on the left wall
    };
  }, []);

  // When camera arrives at the projector station, begin first project flight
  useEffect(() => {
    if (isProjects && isCameraAtProjector && projectPageState === 'waiting') {
      setProjectPresentationState('CAMERA_READY');
      const timer = setTimeout(() => {
        setProjectPresentationState('PROJECT_1');
        setProjectPageState('animating');
        setIsProjectAnimating(true);
        flightProgress.current = 0;
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [
    isProjects,
    isCameraAtProjector,
    projectPageState,
    setProjectPresentationState,
    setProjectPageState,
    setIsProjectAnimating
  ]);

  // When activeProjectIndex changes while in projects and camera ready, trigger page flight
  useEffect(() => {
    if (isProjects && isCameraAtProjector && prevIndexRef.current !== activeProjectIndex) {
      prevIndexRef.current = activeProjectIndex;
      if (projectPageState === 'animating') {
        flightProgress.current = 0;
      }
    }
  }, [activeProjectIndex, isProjects, isCameraAtProjector, projectPageState]);

  // Navigation handlers
  const nextProject = () => {
    if (activeProjectIndex < projectsData.length - 1 && projectPageState !== 'animating') {
      const nextIdx = activeProjectIndex + 1;
      setActiveProjectIndex(nextIdx);
      setProjectPresentationState(`PROJECT_${nextIdx + 1}`);
      setProjectPageState('animating');
      setIsProjectAnimating(true);
    }
  };

  const prevProject = () => {
    if (activeProjectIndex > 0 && projectPageState !== 'animating') {
      const prevIdx = activeProjectIndex - 1;
      setActiveProjectIndex(prevIdx);
      setProjectPresentationState(`PROJECT_${prevIdx + 1}`);
      setProjectPageState('animating');
      setIsProjectAnimating(true);
    }
  };

  // Continuous animation frame loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Advance flight progress during animating state
    if (isProjects) {
      if (projectPageState === 'animating') {
        const animSpeed = isReducedMotion ? 4.0 : 1.35;
        flightProgress.current = Math.min(1.0, flightProgress.current + delta * animSpeed);
        if (flightProgress.current >= 1.0) {
          flightProgress.current = 1.0;
          setProjectPageState('presented');
          setIsProjectAnimating(false);
        }
      } else if (projectPageState === 'presented') {
        flightProgress.current = 1.0;
      } else if (projectPageState === 'waiting') {
        flightProgress.current = 0.0;
      }
    } else {
      flightProgress.current = 0.0;
    }

    const curFlightT = flightProgress.current;

    // 1. Vintage Film Reels Rotation
    const isPageFlying = isProjects && projectPageState === 'animating';
    const reelSpeed = isProjects ? (isPageFlying ? 3.8 : 0.85) : 0.08;
    if (upperReelRef.current) {
      upperReelRef.current.rotation.z += delta * reelSpeed;
    }
    if (lowerReelRef.current) {
      lowerReelRef.current.rotation.z += delta * reelSpeed * 1.05;
    }

    // 2. Projector Lens & Beam Warmup and Subtle Film Flutter
    const targetLampIntensity = isProjects ? 3.2 : 0.1;
    const targetBeamOpacity = isProjects
      ? 0.18 + Math.sin(t * 16) * 0.015 + Math.sin(t * 31) * 0.008
      : 0.0;
    const lerpSpeed = isReducedMotion ? 0.4 : 0.08;

    if (spotlightRef.current) {
      spotlightRef.current.intensity = THREE.MathUtils.lerp(
        spotlightRef.current.intensity,
        targetLampIntensity,
        lerpSpeed
      );
    }
    if (lensGlowRef.current) {
      lensGlowRef.current.opacity = THREE.MathUtils.lerp(
        lensGlowRef.current.opacity,
        isProjects ? 0.95 : 0.15,
        lerpSpeed
      );
    }
    if (beamMaterialRef.current) {
      beamMaterialRef.current.opacity = THREE.MathUtils.lerp(
        beamMaterialRef.current.opacity,
        targetBeamOpacity,
        lerpSpeed
      );
    }

    // 3. 3D Flying Parchment Page Animation
    if (flyingPageRef.current) {
      const curT = isProjects ? curFlightT : 0;

      // Calculate 3D position along Bezier curve
      const pos = getCubicBezierPoint(
        trajectory.p0,
        trajectory.p1,
        trajectory.p2,
        trajectory.p3,
        curT
      );
      flyingPageRef.current.position.copy(pos);

      // Aerodynamic rotational easing & flutter during flight
      const flutterRoll = Math.sin(curT * Math.PI) * 0.14 * Math.cos(t * 6);
      const flutterPitch = Math.sin(curT * Math.PI) * 0.08 * Math.sin(t * 8);

      // Pitch: from flat on table (-PI/2) to vertical on wall (0)
      const pitch = THREE.MathUtils.lerp(-Math.PI / 2, 0, curT) + flutterPitch;
      // Yaw: from 0 to facing +X into room (PI/2)
      const yaw = THREE.MathUtils.lerp(0, Math.PI / 2, curT);
      // Roll: subtle paper orientation on table to clean zero on wall
      const roll = THREE.MathUtils.lerp(0.05, 0, curT) + flutterRoll;

      flyingPageRef.current.rotation.set(pitch, yaw, roll);

      // Scale: from table size (0.42) to full wall size (1.0)
      const scale = THREE.MathUtils.lerp(0.42, 1.0, curT);
      flyingPageRef.current.scale.set(scale, scale, scale);

      // Wall shadow opacity increases as page nears the wall
      if (wallShadowRef.current) {
        wallShadowRef.current.opacity = Math.max(0, (curT - 0.3) / 0.7) * 0.45;
      }
    }
  });

  return (
    <group>
      {/* Dedicated 3D target for spotlight illumination on the left wall board */}
      <primitive object={spotTarget} />

      {/* ================= 1. PHYSICAL PROJECTOR DISPLAY TABLE & VINTAGE FILM PROJECTOR ================= */}
      {/* Positioned on the left side of the room beside the left wall (X = -2.3, Z = 0.95) */}
      <group position={[-2.3, 0, 0.95]}>
        {/* Solid Dark Walnut Display Table */}
        <group position={[0, 0, 0]}>
          {/* Beveled Tabletop (0.85m wide x 1.35m long x 0.045m thick) */}
          <mesh position={[0, 0.725, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.045, 1.35]} />
            <meshStandardMaterial color="#382618" roughness={0.42} metalness={0.06} />
          </mesh>

          {/* Table Apron Rim */}
          <mesh position={[0, 0.68, 0]}>
            <boxGeometry args={[0.78, 0.05, 1.28]} />
            <meshStandardMaterial color="#2c1d12" roughness={0.45} />
          </mesh>

          {/* 4 Turned Wooden Legs with Brass Foot Sleeves */}
          {[
            [-0.36, -0.61],
            [0.36, -0.61],
            [-0.36, 0.61],
            [0.36, 0.61]
          ].map(([lx, lz], li) => (
            <group key={`leg-${li}`} position={[lx, 0.35, lz]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.024, 0.016, 0.7, 16]} />
                <meshStandardMaterial color="#2d1e13" roughness={0.4} />
              </mesh>
              {/* Brass Foot Sleeve */}
              <mesh position={[0, -0.32, 0]}>
                <cylinderGeometry args={[0.018, 0.019, 0.06, 16]} />
                <meshStandardMaterial color="#c59b27" metalness={0.88} roughness={0.25} />
              </mesh>
            </group>
          ))}

          {/* Lower Shelf Tier */}
          <mesh position={[0, 0.22, 0]} receiveShadow>
            <boxGeometry args={[0.75, 0.025, 1.25]} />
            <meshStandardMaterial color="#2b1c11" roughness={0.5} />
          </mesh>

          {/* Metal Film Canisters Stored on Lower Shelf */}
          <group position={[-0.15, 0.26, -0.2]}>
            <mesh castShadow rotation={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.055, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.75} roughness={0.35} />
            </mesh>
            <mesh position={[0.08, 0.05, 0.12]} castShadow rotation={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.05, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ================= DETAILED VINTAGE 35mm FILM PROJECTOR ================= */}
        {/* Placed firmly on the wooden table, facing directly toward the left wall (-X) */}
        <group position={[0, 0.75, -0.38]} rotation={[0, Math.PI + 0.087, 0]}>
          {/* Heavy Cast-Iron Stepped Base with Vibration Absorbers */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.42, 0.038, 0.28]} />
            <meshStandardMaterial color="#14171d" roughness={0.48} metalness={0.85} />
          </mesh>
          {/* Knurled Brass Leveling Feet */}
          {[
            [-0.18, -0.11],
            [0.18, -0.11],
            [-0.18, 0.11],
            [0.18, 0.11]
          ].map(([fx, fz], fi) => (
            <mesh key={`foot-${fi}`} position={[fx, 0.006, fz]}>
              <cylinderGeometry args={[0.018, 0.022, 0.014, 16]} />
              <meshStandardMaterial color="#c59b27" metalness={0.9} roughness={0.25} />
            </mesh>
          ))}

          {/* Main Projector Body Chassis (Vintage Industrial Dark Enamel) */}
          <mesh position={[-0.04, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.28, 0.22]} />
            <meshStandardMaterial color="#1a1e26" roughness={0.42} metalness={0.82} />
          </mesh>

          {/* Side Cooling Ventilation Louvers */}
          {[-0.06, -0.02, 0.02, 0.06].map((sy, si) => (
            <mesh key={`slat-${si}`} position={[-0.04, 0.18 + sy, 0.112]}>
              <boxGeometry args={[0.22, 0.014, 0.008]} />
              <meshStandardMaterial color="#0f1217" roughness={0.3} metalness={0.9} />
            </mesh>
          ))}

          {/* Embossed Brass Nameplate */}
          <mesh position={[-0.04, 0.26, 0.112]}>
            <boxGeometry args={[0.16, 0.035, 0.004]} />
            <meshStandardMaterial color="#c59b27" metalness={0.88} roughness={0.3} />
          </mesh>

          {/* Rear Lamp House Bulge with Heat Chimney */}
          <mesh position={[-0.18, 0.22, 0]} castShadow>
            <boxGeometry args={[0.08, 0.22, 0.18]} />
            <meshStandardMaterial color="#161920" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[-0.18, 0.35, 0]}>
            <cylinderGeometry args={[0.03, 0.035, 0.06, 16]} />
            <meshStandardMaterial color="#11141a" metalness={0.85} roughness={0.4} />
          </mesh>

          {/* ================= DUAL 35mm FILM REELS ================= */}
          {/* 1. Upper Feed Reel & Support Arm */}
          <group position={[-0.08, 0.32, 0]}>
            {/* Cast Metal Feed Arm angled upward */}
            <mesh position={[-0.04, 0.12, 0]} rotation={[0, 0, -0.35]}>
              <boxGeometry args={[0.025, 0.26, 0.03]} />
              <meshStandardMaterial color="#242a35" metalness={0.88} roughness={0.3} />
            </mesh>

            {/* Rotating Upper Film Reel Assembly */}
            <group ref={upperReelRef} position={[-0.08, 0.22, 0.02]}>
              {/* Brass Center Spindle & Nut */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
                <meshStandardMaterial color="#c59b27" metalness={0.92} roughness={0.25} />
              </mesh>
              {/* Outer Reel Rim Flanges (Dual discs) */}
              {[-0.015, 0.015].map((rz, ri) => (
                <mesh key={`u-flange-${ri}`} position={[0, 0, rz]}>
                  <ringGeometry args={[0.03, 0.165, 32]} />
                  <meshStandardMaterial
                    color="#b88c22"
                    metalness={0.85}
                    roughness={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
              {/* 5 Delicate Spool Spokes */}
              {Array.from({ length: 5 }).map((_, si) => {
                const angle = (si * Math.PI * 2) / 5;
                return (
                  <mesh key={`u-spoke-${si}`} rotation={[0, 0, angle]}>
                    <boxGeometry args={[0.012, 0.155, 0.01]} />
                    <meshStandardMaterial color="#c59b27" metalness={0.88} roughness={0.3} />
                  </mesh>
                );
              })}
              {/* Wound 35mm Dark Celluloid Film Stock */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.115, 0.115, 0.026, 32]} />
                <meshStandardMaterial color="#1a140f" roughness={0.65} metalness={0.2} />
              </mesh>
            </group>
          </group>

          {/* 2. Lower Takeup Reel & Support Arm */}
          <group position={[-0.14, 0.08, 0]}>
            {/* Cast Metal Takeup Arm angled rearward/downward */}
            <mesh position={[-0.1, -0.06, 0]} rotation={[0, 0, 0.45]}>
              <boxGeometry args={[0.025, 0.2, 0.03]} />
              <meshStandardMaterial color="#242a35" metalness={0.88} roughness={0.3} />
            </mesh>

            {/* Rotating Lower Takeup Reel Assembly */}
            <group ref={lowerReelRef} position={[-0.18, -0.12, 0.02]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
                <meshStandardMaterial color="#c59b27" metalness={0.92} roughness={0.25} />
              </mesh>
              {[-0.015, 0.015].map((rz, ri) => (
                <mesh key={`l-flange-${ri}`} position={[0, 0, rz]}>
                  <ringGeometry args={[0.03, 0.165, 32]} />
                  <meshStandardMaterial
                    color="#b88c22"
                    metalness={0.85}
                    roughness={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ))}
              {Array.from({ length: 5 }).map((_, si) => {
                const angle = (si * Math.PI * 2) / 5;
                return (
                  <mesh key={`l-spoke-${si}`} rotation={[0, 0, angle]}>
                    <boxGeometry args={[0.012, 0.155, 0.01]} />
                    <meshStandardMaterial color="#c59b27" metalness={0.88} roughness={0.3} />
                  </mesh>
                );
              })}
              {/* Coiled Film on Takeup Reel */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.085, 0.085, 0.026, 32]} />
                <meshStandardMaterial color="#1a140f" roughness={0.65} metalness={0.2} />
              </mesh>
            </group>
          </group>

          {/* ================= OPTICAL LENS BARREL ================= */}
          {/* Telescoping Brass Lens Assembly tilted upward toward the left wall board */}
          <group position={[0.18, 0.18, 0]} rotation={[0, 0, 0.38]}>
            {/* Outer Lens Housing */}
            <mesh rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.065, 0.09, 24]} />
              <meshStandardMaterial color="#11141a" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Knurled Brass Focus Ring */}
            <mesh position={[0.03, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.058, 0.058, 0.024, 24]} />
              <meshStandardMaterial color="#c59b27" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Front Aperture Collar */}
            <mesh position={[0.055, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.048, 0.052, 0.02, 24]} />
              <meshStandardMaterial color="#1a1d24" metalness={0.85} roughness={0.3} />
            </mesh>

            {/* Glowing Front Optical Lens Glass Element */}
            <mesh position={[0.066, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.046, 24]} />
              <meshBasicMaterial
                ref={lensGlowRef}
                color="#fff8e7"
                transparent
                opacity={0.15}
              />
            </mesh>
          </group>

          {/* Vintage Toggle Switches & Speed Control Dial */}
          <group position={[0.06, 0.06, 0.114]}>
            {/* Brass Bat-Handle Toggle Switch */}
            <mesh position={[-0.04, 0.02, 0]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.004, 0.005, 0.022, 12]} />
              <meshStandardMaterial color="#c59b27" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Rotary Speed Selector Knob */}
            <mesh position={[0.04, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />
              <meshStandardMaterial color="#0c0e12" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>

          {/* Braided Cloth Power Cable */}
          <mesh position={[-0.18, 0.02, -0.06]} rotation={[0.3, 0, 0.8]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 12]} />
            <meshStandardMaterial color="#2d2822" roughness={0.9} />
          </mesh>

          {/* Projector Spotlight Aimed Directly at Left Wall Presentation Surface */}
          <spotLight
            ref={spotlightRef}
            position={[0.18, 0.18, 0]}
            target={spotTarget}
            color="#fff6e0"
            intensity={0.1}
            angle={0.55}
            penumbra={0.45}
            distance={8.5}
            castShadow
          />

          {/* Atmospheric Conical Light Beam Frustum pointing directly at the left wall board */}
          <group position={[1.5, 0.71, 0]} rotation={[0, 0, -Math.PI / 2 + 0.38]}>
            <mesh>
              <cylinderGeometry args={[1.45, 0.06, 2.85, 24, 1, true]} />
              <meshBasicMaterial
                ref={beamMaterialRef}
                color="#fff5db"
                transparent
                opacity={0.0}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>

        {/* ================= 4 PARCHMENT SHEETS LOOSELY STACKED ON TABLE ================= */}
        {/* Stacked beside the projector with slight natural offsets and curled edges */}
        <group position={[0, 0.755, 0.35]}>
          {/* Base Sheet 0 */}
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, -0.05]}>
            <planeGeometry args={[0.44, 0.32]} />
            <meshStandardMaterial color="#eedcb8" roughness={0.88} />
          </mesh>
          {/* Base Sheet 1 */}
          <mesh position={[0.01, 0.005, -0.01]} rotation={[-Math.PI / 2, 0, 0.04]}>
            <planeGeometry args={[0.44, 0.32]} />
            <meshStandardMaterial color="#f2e2c2" roughness={0.88} />
          </mesh>
          {/* Base Sheet 2 */}
          <mesh position={[-0.01, 0.008, 0.01]} rotation={[-Math.PI / 2, 0, -0.02]}>
            <planeGeometry args={[0.44, 0.32]} />
            <meshStandardMaterial color="#f6e8cc" roughness={0.88} />
          </mesh>
          {/* Static Table Label */}
          <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0.01]}>
            <planeGeometry args={[0.43, 0.31]} />
            <meshStandardMaterial color="#f8eed7" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ================= 2. 3D FLYING PARCHMENT PAGE ================= */}
      {/* Animated along the Bezier curve: lifts from table, arcs through golden beam, and settles on left wall */}
      <group ref={flyingPageRef} position={[-2.3, 0.775, 1.25]}>
        {/* Physical 3D Parchment Sheet with double-sided aged paper appearance */}
        <mesh castShadow receiveShadow>
          <planeGeometry args={[2.5, 1.6, 8, 6]} />
          <meshStandardMaterial
            color="#f7eedb"
            roughness={0.86}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Deckled Aged Border Inset */}
        <lineSegments position={[0, 0, 0.002]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.46, 1.56)]} />
          <lineBasicMaterial color="#a88c68" />
        </lineSegments>

        {/* Embossed Wax Seal Badge on Front Face of 3D Page */}
        <group position={[1.05, 0.62, 0.005]}>
          <mesh>
            <circleGeometry args={[0.08, 24]} />
            <meshStandardMaterial color="#943823" roughness={0.4} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.065, 24]} />
            <meshStandardMaterial color="#782d1c" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Soft Contact Drop Shadow on the Left Wall as Page Settles */}
      <mesh
        position={[-4.955, 2.15, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[2.8, 1.8]} />
        <meshBasicMaterial
          ref={wallShadowRef}
          color="#120c06"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ================= 3. ANCIENT PROJECT PAGES (GENUINE AGED ARCHIVAL MANUSCRIPTS) ================= */}
      {/* Mounted flush on the Left Wall (X = -4.945, Y = 2.15, Z = 0.8) inside the architectural frame */}
      <group position={[-4.945, 2.15, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        <Html
          transform
          distanceFactor={1.42}
          position={[0, 0, 0.015]}
          className="pointer-events-auto select-none"
        >
          {/* Main Ancient Archival Manuscript Sheet (960px x 580px) */}
          <div
            key={currentProject.id}
            style={{
              opacity: isProjects && projectPageState !== 'waiting' ? 1 : 0,
              pointerEvents: isProjects && projectPageState === 'presented' ? 'auto' : 'none',
              transform: isProjects && projectPageState === 'presented' ? 'scale(1)' : 'scale(0.97)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              boxShadow: '0 25px 65px rgba(18, 12, 6, 0.8), 0 4px 14px rgba(0,0,0,0.4), inset 0 0 90px rgba(110, 75, 35, 0.22)'
            }}
            className="w-[960px] h-[580px] bg-gradient-to-br from-[#f8f1de] via-[#eee0c1] to-[#ddcaa3] border border-[#7d6040]/70 rounded-xs p-8 flex flex-col justify-between text-[#241a10] font-serif relative overflow-hidden select-none animate-in fade-in duration-300"
          >
            {/* Realistic Paper Fibers, Uneven Discoloration & Tea-Stain Patina */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(100,65,25,0.22)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute inset-2 border border-[#9a7852]/50 pointer-events-none" />
            <div className="absolute inset-3 border border-[#bfa078]/35 pointer-events-none border-dashed" />

            {/* Antique Forged-Iron Map Tacks Pinning the Corners to the Wall */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-[#4a3b2c] via-[#241c14] to-[#120d09] shadow-[0_2px_5px_rgba(0,0,0,0.6)] border border-[#73583c] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#120d09]" />
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-[#4a3b2c] via-[#241c14] to-[#120d09] shadow-[0_2px_5px_rgba(0,0,0,0.6)] border border-[#73583c] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#120d09]" />
            </div>
            <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-gradient-to-br from-[#4a3b2c] via-[#241c14] to-[#120d09] shadow-[0_2px_5px_rgba(0,0,0,0.6)] border border-[#73583c] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#120d09]" />
            </div>
            {/* Curled dog-eared corner on bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
              <div className="w-12 h-12 bg-gradient-to-tl from-[#cbb18a] to-[#ebd9b8] rotate-45 transform origin-bottom-right shadow-[-3px_-3px_7px_rgba(0,0,0,0.25)] border-t border-l border-[#8b6b47]/60" />
            </div>

            {/* ================= MANUSCRIPT ARCHIVAL HEADER ================= */}
            <div className="border-b-2 border-[#826444]/60 pb-3 relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#694c30] uppercase mb-1">
                  <span>ARCHIVUM N-VERSE</span>
                  <span>&bull;</span>
                  <span>FOLIO NO. 0{activeProjectIndex + 1}</span>
                  <span>&bull;</span>
                  <span className="italic font-serif capitalize text-[#8b3d22]">
                    {currentProject.category}
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-[#17100a] leading-none drop-shadow-xs font-serif">
                  {currentProject.title}
                </h2>
                <p className="italic text-sm text-[#5a3b22] mt-1 font-serif">
                  &ldquo;{currentProject.tagline}&rdquo;
                </p>
              </div>

              {/* Hand-Stamped Archival Seal Motif */}
              <div className="text-right flex flex-col items-end">
                <div className="px-3 py-1 border-2 border-[#8b321e]/70 rounded-xs text-[#8b321e] font-mono text-[10px] font-bold tracking-wider rotate-[-2deg] bg-[#8b321e]/5">
                  VERIFIED INVENTOR SPECIFICATION
                </div>
                <span className="text-[10px] font-mono text-[#6c5137] mt-1 italic">
                  Status: {currentProject.status}
                </span>
              </div>
            </div>

            {/* ================= MANUSCRIPT BODY (TWO-COLUMN ARCHIVAL SPECIFICATION) ================= */}
            <div className="grid grid-cols-12 gap-7 my-3 relative z-10 flex-1 overflow-hidden">
              {/* Left Column: Abstract, Purpose, and Handwritten Specifications */}
              <div className="col-span-7 flex flex-col justify-between space-y-3">
                {/* Motivation / Purpose Paragraph */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#63452b] font-bold flex items-center gap-1.5">
                    <span>&sect; I.</span>
                    <span>System Abstract & Motivation:</span>
                  </span>
                  <p className="text-xs text-[#241a10] leading-relaxed font-serif pl-3 border-l-2 border-[#8f6d49]/60 italic">
                    {currentProject.purpose}
                  </p>
                </div>

                {/* Engineering Functionalities (Archival Section § II) */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#63452b] font-bold flex items-center gap-1.5">
                    <span>&sect; II.</span>
                    <span>Inventor&apos;s Operational Heuristics:</span>
                  </span>
                  <ul className="space-y-1.5 pl-3 text-xs text-[#1e150d] font-serif">
                    {currentProject.keyFunctionality.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 leading-snug">
                        <span className="text-[#8b321e] font-bold text-sm mt-[-1px]">&#9877;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stamped Technology Matrix */}
                <div className="pt-2 border-t border-[#9c7b56]/40 flex items-center gap-2 flex-wrap text-xs font-mono text-[#332214]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b4c30]">
                    Configured Apparatus:
                  </span>
                  {currentProject.technologies.slice(0, 6).map((tech, ti) => (
                    <span
                      key={ti}
                      className="px-2 py-0.5 border border-[#8f6e4a]/60 bg-[#ead9b8]/50 text-[10.5px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Handcrafted Ink Schematic Sketch & Verified Technical Notes */}
              <div className="col-span-5 flex flex-col justify-between border-l border-[#8f6e4a]/40 pl-6 space-y-2">
                <div>
                  <div className="flex items-center justify-between border-b border-[#9c7b56]/40 pb-1 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#573d26] font-bold">
                      &sect; III. Technical Diagram
                    </span>
                    <span className="text-[9px] font-mono text-[#78593a] italic">
                      Ink Spec // Fig. {activeProjectIndex + 1}
                    </span>
                  </div>

                  {/* Authentic Hand-Drawn Ink Schematic Sketch per Project */}
                  <div className="p-2 border border-[#9a764f]/40 bg-[#f4e9d2]/60 rounded-xs shadow-inner">
                    {currentProject.id === 'the-brew-club' && (
                      <svg viewBox="0 0 240 140" className="w-full h-32 stroke-[#4a331e] fill-none">
                        <path d="M120 18 L120 125 M85 125 L155 125 M100 130 L140 130" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="120" cy="18" r="4.5" className="fill-[#ebd6b2] stroke-[#4a331e]" strokeWidth="1.5" />
                        <path d="M40 38 L200 24" strokeWidth="2" strokeLinecap="round" />
                        <path d="M40 38 L22 72 M40 38 L58 72 M18 72 Q40 82 62 72 Z" strokeWidth="1.2" />
                        <ellipse cx="40" cy="68" rx="8" ry="3" className="fill-[#ebd6b2]" strokeWidth="1" />
                        <ellipse cx="40" cy="64" rx="8" ry="3" className="fill-[#ebd6b2]" strokeWidth="1" />
                        <path d="M200 24 L182 58 M200 24 L218 58 M178 58 Q200 68 222 58 Z" strokeWidth="1.2" />
                        <path d="M178 116 C178 112 186 112 186 116 L188 126 L176 126 Z" strokeWidth="1.2" />
                        <path d="M182 112 Q194 94 206 82 Q202 91 186 110" strokeWidth="1.2" className="fill-[#ebd6b2]" />
                        <text x="25" y="105" className="font-serif text-[9px] fill-[#6b492b] italic">Fig. I — Direct Ledger</text>
                        <text x="135" y="105" className="font-serif text-[9px] fill-[#6b492b] italic">0% Comm. Ratio</text>
                      </svg>
                    )}

                    {currentProject.id === 'ecotrack-ai' && (
                      <svg viewBox="0 0 240 140" className="w-full h-32 stroke-[#4a331e] fill-none">
                        <circle cx="120" cy="65" r="44" strokeWidth="1.8" />
                        <circle cx="120" cy="65" r="38" strokeWidth="0.8" strokeDasharray="3 3" />
                        <path d="M120 65 L142 42" strokeWidth="1.8" strokeLinecap="round" stroke="#8b2514" />
                        <circle cx="120" cy="65" r="3.5" className="fill-[#4a331e]" />
                        <path d="M20 120 L60 120 Q75 120 85 110 L95 125 L105 95 L115 122 Q130 120 150 120 L170 108 L185 126 L220 120" strokeWidth="1.4" />
                        <line x1="20" y1="125" x2="220" y2="125" strokeWidth="0.8" strokeDasharray="4 4" />
                        <text x="25" y="24" className="font-serif text-[9px] fill-[#6b492b] italic">Fig. II — Telemetry Waveform</text>
                        <text x="130" y="132" className="font-serif text-[8.5px] fill-[#8b2514] italic">&Delta; Load Anomaly Heuristic</text>
                      </svg>
                    )}

                    {currentProject.id === 'know-via' && (
                      <svg viewBox="0 0 240 140" className="w-full h-32 stroke-[#4a331e] fill-none">
                        <circle cx="120" cy="70" r="12" className="fill-[#ebd6b2]" strokeWidth="1.5" />
                        <circle cx="120" cy="70" r="5" className="fill-[#4a331e]" />
                        <circle cx="60" cy="45" r="9" className="fill-[#ebd6b2]" strokeWidth="1.2" />
                        <circle cx="68" cy="105" r="8" className="fill-[#ebd6b2]" strokeWidth="1.2" />
                        <circle cx="180" cy="48" r="10" className="fill-[#ebd6b2]" strokeWidth="1.2" />
                        <circle cx="172" cy="106" r="8" className="fill-[#ebd6b2]" strokeWidth="1.2" />
                        <path d="M68 49 L109 66 M113 63 L65 45" strokeWidth="1" strokeDasharray="4 2" />
                        <path d="M76 101 L109 76 M111 80 L79 105" strokeWidth="1" />
                        <path d="M131 65 L171 52 M170 56 L130 69" strokeWidth="1" strokeDasharray="4 2" />
                        <path d="M130 76 L165 101 M163 97 L128 72" strokeWidth="1" />
                        <circle cx="120" cy="70" r="54" strokeWidth="0.8" strokeDasharray="3 3" />
                        <text x="25" y="22" className="font-serif text-[9px] fill-[#6b492b] italic">Fig. III — Associative Synapse Graph</text>
                        <text x="135" y="132" className="font-serif text-[8.5px] fill-[#6b492b] italic">Bidirectional [[Links]]</text>
                      </svg>
                    )}

                    {currentProject.id === 'roadvision' && (
                      <svg viewBox="0 0 240 140" className="w-full h-32 stroke-[#4a331e] fill-none">
                        <path d="M30 128 L115 56 M210 128 L125 56" strokeWidth="1.6" />
                        <path d="M120 56 L120 128" strokeWidth="1" strokeDasharray="5 3" />
                        <line x1="20" y1="56" x2="220" y2="56" strokeWidth="0.8" strokeDasharray="4 2" />
                        <rect x="70" y="78" width="30" height="24" strokeWidth="1.4" stroke="#8b2514" strokeDasharray="2 2" className="fill-[#8b2514]/10" />
                        <rect x="142" y="68" width="22" height="18" strokeWidth="1.2" stroke="#8b2514" strokeDasharray="2 2" className="fill-[#8b2514]/10" />
                        <circle cx="120" cy="56" r="26" strokeWidth="1" strokeDasharray="4 3" />
                        <circle cx="120" cy="56" r="3.5" className="fill-[#4a331e]" />
                        <text x="25" y="22" className="font-serif text-[9px] fill-[#6b492b] italic">Fig. IV — Spatial Hazard Reticle</text>
                        <text x="135" y="132" className="font-serif text-[8.5px] fill-[#8b2514] italic">YOLO Frame Coordinate</text>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Engineering Highlights */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#63452b] font-bold">
                    &sect; IV. Key Architectural Notes:
                  </span>
                  <ul className="space-y-1 text-[11px] text-[#2c1d11] font-serif leading-snug">
                    {currentProject.details.highlights.slice(0, 2).map((item, hi) => (
                      <li key={hi} className="flex items-start gap-1.5">
                        <span className="text-[#8b321e] font-bold">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ================= MANUSCRIPT FOOTER (FUNCTIONAL ARCHIVAL LINKS ONLY) ================= */}
            <div className="border-t-2 border-[#826444]/60 pt-3 relative z-10 flex items-center justify-between">
              {/* Authentic Archival Wax / Ink Seal Links */}
              <div className="flex items-center gap-3">
                {(currentProject.repositoryUrl || currentProject.links?.github) && (
                  <a
                    href={currentProject.repositoryUrl || currentProject.links?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#3d2919] bg-[#2d1e12] hover:bg-[#4a3320] text-[#f7eedb] font-mono text-xs transition-colors shadow-xs active:scale-95"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#ebd6b2]" />
                    <span>⚓ Examine Source Repository</span>
                  </a>
                )}

                {(currentProject.liveDemoUrl || currentProject.links?.live) && (
                  <a
                    href={currentProject.liveDemoUrl || currentProject.links?.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#7a2917] bg-[#8b321e] hover:bg-[#a83d25] text-white font-mono text-xs transition-colors shadow-xs active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#ebd6b2]" />
                    <span>✦ Observe Running Apparatus</span>
                  </a>
                )}
              </div>

              {/* Subdued Archival Verification Stamp */}
              <div className="text-[11px] font-serif italic text-[#63462d] tracking-wide">
                Manuscript Folio 0{activeProjectIndex + 1} of 0{projectsData.length} &bull; Scroll to inspect subsequent record
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
