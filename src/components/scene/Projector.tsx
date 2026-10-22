'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { projectsData } from '@/data/projects';
import { drawProjectManuscript } from '@/lib/project-manuscript-canvas';
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

  // Dynamic High-DPI Manuscript Canvas Texture for Physical 3D Flying Page
  const [projectCanvasTexture, setProjectCanvasTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize 2048x1310 manuscript canvas texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1310;
    canvasRef.current = canvas;

    drawProjectManuscript(canvas, currentProject, activeProjectIndex, projectsData.length);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    setProjectCanvasTexture(tex);
  }, []);

  // Redraw canvas texture when active project changes
  useEffect(() => {
    if (canvasRef.current && projectCanvasTexture) {
      drawProjectManuscript(canvasRef.current, currentProject, activeProjectIndex, projectsData.length);
      projectCanvasTexture.needsUpdate = true;
    }
  }, [activeProjectIndex, currentProject, projectCanvasTexture]);

  // Click & pointer raycasting handlers for action buttons on the 3D manuscript
  const handlePageClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const uv = e.uv;
    if (!uv) return;

    // UV bounds for the footer action buttons (y is V: ~0.035 to ~0.098, x is U)
    if (uv.y >= 0.035 && uv.y <= 0.098) {
      // Button 1: GitHub / Source Repo (x: ~0.035 to ~0.255)
      if (uv.x >= 0.035 && uv.x <= 0.255) {
        const url = currentProject.repositoryUrl || currentProject.links?.github;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
      // Button 2: Live Demo / Running Apparatus or Specialized Repo
      else if (uv.x >= 0.262 && uv.x <= 0.485) {
        const url = currentProject.liveDemoUrl || currentProject.links?.live || currentProject.repositoryUrl || currentProject.links?.github;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handlePagePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const uv = e.uv;
    if (uv && uv.y >= 0.035 && uv.y <= 0.098 && uv.x >= 0.035 && uv.x <= 0.485) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  };

  const handlePagePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

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
          {/* Top Sheet on Table Stack displaying archival folio header */}
          <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0.01]}>
            <planeGeometry args={[0.43, 0.31]} />
            {projectCanvasTexture ? (
              <meshStandardMaterial map={projectCanvasTexture} roughness={0.82} />
            ) : (
              <meshStandardMaterial color="#f8eed7" roughness={0.85} />
            )}
          </mesh>
        </group>
      </group>

      {/* ================= 2. 3D FLYING PARCHMENT PAGE ================= */}
      {/* Animated along the Bezier curve: lifts from table, arcs through golden beam, and settles on left wall */}
      <group ref={flyingPageRef} position={[-2.3, 0.775, 1.25]}>
        {/* Physical 3D Archival Manuscript Sheet with high-DPI canvas texture */}
        <mesh
          castShadow
          receiveShadow
          onClick={handlePageClick}
          onPointerMove={handlePagePointerMove}
          onPointerOut={handlePagePointerOut}
        >
          <planeGeometry args={[2.5, 1.6, 8, 6]} />
          {projectCanvasTexture ? (
            <meshStandardMaterial
              map={projectCanvasTexture}
              color="#ffffff"
              roughness={0.42}
              metalness={0.0}
              side={THREE.DoubleSide}
            />
          ) : (
            <meshStandardMaterial
              color="#f7eedb"
              roughness={0.65}
              metalness={0.0}
              side={THREE.DoubleSide}
            />
          )}
        </mesh>
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


    </group>
  );
}
