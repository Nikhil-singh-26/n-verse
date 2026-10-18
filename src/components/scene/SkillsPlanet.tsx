'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { skillCategories } from '@/data/skills';
import { Html } from '@react-three/drei';

export function SkillsPlanet() {
  const { activeSection, activeSkillCategoryId, setActiveSkillCategoryId, isReducedMotion } =
    useExperience();

  const planetGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const isFocused = activeSection === 'skills';

  // 6 Orbital nodes corresponding to each skill category
  const orbitalNodes = useMemo(() => {
    return skillCategories.map((cat, idx) => {
      const angle = (idx / skillCategories.length) * Math.PI * 2;
      const radius = 1.95;
      const yOffset = Math.sin(idx * 1.5) * 0.35;
      return {
        id: cat.id,
        title: cat.title,
        skillsCount: cat.skills.length,
        color: cat.color,
        baseAngle: angle,
        radius,
        yOffset
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speedMult = isReducedMotion ? 0.2 : isFocused ? 1.0 : 0.45;

    // Smooth floating bobbing for the planet
    if (planetGroupRef.current) {
      planetGroupRef.current.position.y = 2.2 + Math.sin(t * 1.2) * 0.06;
    }

    // Core spin
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.18 * speedMult;
    }

    // Wireframe grid counter-rotation
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.12 * speedMult;
      wireframeRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    // Gimbal Ring 1
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = 0.4 + Math.sin(t * 0.25) * 0.08;
      ring1Ref.current.rotation.y = t * 0.3 * speedMult;
    }

    // Gimbal Ring 2
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -0.35 + Math.cos(t * 0.25) * 0.08;
      ring2Ref.current.rotation.y = -t * 0.25 * speedMult;
    }

    // Equatorial Ring 3
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.15 * speedMult;
    }

    // Orbital Nodes revolution
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = t * 0.2 * speedMult;
    }
  });

  return (
    <group position={[3.5, 0, 0.5]}>
      {/* ================= PEDESTAL / CONTAINMENT FIELD BASE ================= */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.25, 1.45, 0.2, 32]} />
        <meshStandardMaterial color="#0c121e" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Glowing emitter concentric rings on pedestal */}
      <mesh position={[0, 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.95, 32]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.65} transparent />
      </mesh>
      <mesh position={[0, 0.208, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 32]} />
        <meshBasicMaterial color="#38bdf8" opacity={0.4} transparent />
      </mesh>

      {/* Upward containment holographic laser columns */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={`laser-${i}`}
          position={[Math.cos(angle) * 0.95, 1.15, Math.sin(angle) * 0.95]}
        >
          <cylinderGeometry args={[0.015, 0.015, 2.1, 8]} />
          <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent />
        </mesh>
      ))}

      {/* Ambient Pedestal Glow */}
      <pointLight position={[0, 0.4, 0]} color="#00f0ff" intensity={1.5} distance={2.5} />

      {/* ================= FLOATING PROCEDURAL SKILLS PLANET ================= */}
      <group ref={planetGroupRef} position={[0, 2.2, 0]}>
        {/* Core Sphere */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <sphereGeometry args={[0.88, 36, 36]} />
          <meshStandardMaterial
            color="#08182b"
            roughness={0.2}
            metalness={0.85}
            emissive="#002b4d"
            emissiveIntensity={isFocused ? 0.75 : 0.45}
          />
        </mesh>

        {/* Geometric Wireframe / Technical Grid Shell */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[0.93, 2]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={isFocused ? 0.45 : 0.25}
          />
        </mesh>

        {/* Outer Atmospheric Aura Shell */}
        <mesh>
          <sphereGeometry args={[1.02, 32, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
          />
        </mesh>

        {/* ================= GIMBAL ORBITAL RINGS ================= */}
        {/* Ring 1 - Inclined 40 deg */}
        <group ref={ring1Ref}>
          <mesh rotation={[Math.PI / 4.5, 0, 0]}>
            <torusGeometry args={[1.42, 0.015, 16, 64]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.65}
            />
          </mesh>
        </group>

        {/* Ring 2 - Counter-inclined -30 deg */}
        <group ref={ring2Ref}>
          <mesh rotation={[-Math.PI / 5, 0, 0]}>
            <torusGeometry args={[1.72, 0.012, 16, 64]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* Ring 3 - Outer Orbital Guide */}
        <group ref={ring3Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.95, 0.008, 16, 64]} />
            <meshBasicMaterial color="#00f0ff" opacity={0.3} transparent />
          </mesh>
        </group>

        {/* ================= ORBITAL CATEGORY NODES ================= */}
        <group ref={nodesGroupRef}>
          {orbitalNodes.map((node) => {
            const isSelected = activeSkillCategoryId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const x = Math.cos(node.baseAngle) * node.radius;
            const z = Math.sin(node.baseAngle) * node.radius;

            return (
              <group key={`node-${node.id}`} position={[x, node.yOffset, z]}>
                {/* 3D Interactive Node Octahedron */}
                <mesh
                  castShadow
                  scale={isSelected ? [1.5, 1.5, 1.5] : isHovered ? [1.25, 1.25, 1.25] : [1.0, 1.0, 1.0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSkillCategoryId(node.id);
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredNodeId(node.id);
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={(e) => {
                    e.stopPropagation();
                    setHoveredNodeId(null);
                    document.body.style.cursor = 'auto';
                  }}
                >
                  <octahedronGeometry args={[0.09, 0]} />
                  <meshStandardMaterial
                    color={isSelected ? '#00f0ff' : isHovered ? '#38bdf8' : node.color}
                    emissive={isSelected ? '#00f0ff' : node.color}
                    emissiveIntensity={isSelected ? 1.2 : isHovered ? 0.9 : 0.6}
                  />
                </mesh>

                {/* Selected Active Glow Halo */}
                {isSelected && (
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.12, 0.16, 16]} />
                    <meshBasicMaterial color="#00f0ff" opacity={0.8} transparent side={THREE.DoubleSide} />
                  </mesh>
                )}

                {/* Accessible Hover / Active HTML Marker Tag */}
                <Html
                  position={[0, 0.2, 0]}
                  center
                  distanceFactor={11}
                  className="pointer-events-auto select-none"
                >
                  <button
                    onClick={() => setActiveSkillCategoryId(node.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all border shadow-lg ${
                      isSelected
                        ? 'bg-[#00f0ff]/30 text-white border-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-110'
                        : isHovered
                        ? 'bg-[#0f172a]/95 text-[#00f0ff] border-[#00f0ff]/60 scale-105'
                        : 'bg-[#0a0f18]/90 text-[#94a3b8] border-[#1e293b] hover:text-white hover:border-[#00f0ff]/40'
                    }`}
                    aria-label={`Select ${node.title} skill cluster`}
                  >
                    {node.title.split(' ')[0]}
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}
