'use client';

import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

export function DeveloperRoom() {
  const [portraitTex, setPortraitTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/mypic.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setPortraitTex(tex);
    });
  }, []);


  // Procedural leaves for the indoor potted plant
  const plantLeaves = useMemo(() => {
    const leaves = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + (i % 2) * 0.2;
      const height = 0.55 + (i % 3) * 0.22;
      const reach = 0.35 + (i % 2) * 0.12;
      const tilt = 0.4 + (i % 3) * 0.15;
      leaves.push({ angle, height, reach, tilt, scale: 0.9 + (i % 4) * 0.1 });
    }
    return leaves;
  }, []);

  return (
    <group>
      {/* ================= FLOOR ================= */}
      {/* Warm natural wood parquet floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.0]} receiveShadow>
        <planeGeometry args={[11, 12]} />
        <meshStandardMaterial
          color="#3e2e23"
          roughness={0.42}
          metalness={0.06}
        />
      </mesh>

      {/* Decorative large wool/linen area rug under workstation and lounge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.005, -1.0]} receiveShadow>
        <planeGeometry args={[7.2, 5.8]} />
        <meshStandardMaterial
          color="#d5ccc1"
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>
      {/* Rug border stitching */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.007, -1.0]}>
        <ringGeometry args={[3.45, 3.55, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color="#b8aca0" />
      </mesh>

      {/* ================= BACK WALL: DARK ACCENT WALL BEHIND WORKSTATION ================= */}
      <mesh position={[0, 2.1, -4.5]} receiveShadow>
        <planeGeometry args={[11, 4.2]} />
        <meshStandardMaterial
          color="#181e28"
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* Acoustic Vertical Wood Slat Wall Feature on Right Side of Back Wall */}
      <group position={[3.2, 2.1, -4.48]}>
        {Array.from({ length: 18 }).map((_, idx) => (
          <mesh key={`slat-${idx}`} position={[-1.2 + idx * 0.14, 0, 0]} castShadow>
            <boxGeometry args={[0.07, 4.18, 0.025]} />
            <meshStandardMaterial color="#6a4a35" roughness={0.45} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {/* Baseboard molding on back wall */}
      <mesh position={[0, 0.07, -4.48]}>
        <boxGeometry args={[11, 0.14, 0.04]} />
        <meshStandardMaterial color="#10141c" roughness={0.5} />
      </mesh>

      {/* ================= LEFT WALL: LIGHT WARM NEUTRAL PLASTER ================= */}
      <mesh position={[-5.0, 2.1, 1.0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 4.2]} />
        <meshStandardMaterial
          color="#ded6cc"
          roughness={0.78}
          metalness={0.02}
        />
      </mesh>

      {/* Baseboard molding on left wall */}
      <mesh position={[-4.98, 0.07, 1.0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.14, 0.04]} />
        <meshStandardMaterial color="#cfc7bd" roughness={0.5} />
      </mesh>

      {/* Architectural Projection Area Frame on Left Wall */}
      <group position={[-4.97, 2.1, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Subtle architectural wall inset board */}
        <mesh receiveShadow>
          <planeGeometry args={[5.8, 3.2]} />
          <meshStandardMaterial color="#ece5db" roughness={0.82} metalness={0.01} />
        </mesh>
        {/* Fine oak perimeter frame */}
        <lineSegments position={[0, 0, 0.005]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(5.8, 3.2)]} />
          <lineBasicMaterial color="#a8998a" />
        </lineSegments>
      </group>

      {/* ================= RIGHT WALL: LIGHT WARM NEUTRAL PLASTER ================= */}
      <mesh position={[5.0, 2.1, 1.0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 4.2]} />
        <meshStandardMaterial
          color="#ded6cc"
          roughness={0.78}
          metalness={0.02}
        />
      </mesh>

      {/* Baseboard molding on right wall */}
      <mesh position={[4.98, 0.07, 1.0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.14, 0.04]} />
        <meshStandardMaterial color="#cfc7bd" roughness={0.5} />
      </mesh>

      {/* ================= CEILING & CROWN MOLDING ================= */}
      <mesh position={[0, 4.2, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 12]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Ceiling Architectural Recessed Downlight Fixtures */}
      {[
        [-2.0, -1.5],
        [2.0, -1.5],
        [-2.0, 1.8],
        [2.0, 1.8],
        [-2.0, 4.2],
        [2.0, 4.2]
      ].map(([x, z], idx) => (
        <group key={`downlight-${idx}`} position={[x, 4.19, z]}>
          {/* Bezel Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.07, 0.11, 24]} />
            <meshStandardMaterial color="#e5dec9" metalness={0.3} roughness={0.4} />
          </mesh>
          {/* Recessed Warm Light Source */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 24]} />
            <meshBasicMaterial color="#fff4e0" />
          </mesh>
        </group>
      ))}

      {/* ================= FINE ART FRAMED PORTRAIT ON FRONT WALL ON BROWN WOOD SLAT FEATURE (NIKHIL SINGH) ================= */}
      {/* Positioned directly on the vertical wood slats (X = 3.1, Y = 2.22, Z = -4.44) to the right of the main display */}
      <group position={[3.1, 2.22, -4.44]}>
        {/* Brass Picture Lamp overhead casting warm focused downlight onto portrait */}
        <spotLight
          position={[0, 1.15, 0.45]}
          target-position={[0, 0, 0]}
          color="#fff2df"
          intensity={3.2}
          angle={0.68}
          penumbra={0.4}
        />
        {/* Brass Lamp Fixture Arm & Tube */}
        <mesh position={[0, 1.05, 0.28]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.52, 16]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0.14]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Outer Heavy Beveled Dark Walnut & Brass Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.18, 1.82, 0.04]} />
          <meshStandardMaterial color="#1a1511" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* Brass Fillet Inner Bevel */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[1.08, 1.72, 0.015]} />
          <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.3} />
        </mesh>
        {/* Off-White Archival Museum Matting */}
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[1.04, 1.68]} />
          <meshStandardMaterial color="#f7f5f0" roughness={0.9} />
        </mesh>

        {/* Fine Art Portrait of Nikhil Singh: public/mypic.png */}
        <mesh position={[0, 0.05, 0.022]}>
          <planeGeometry args={[0.94, 1.52]} />
          {portraitTex ? (
            <meshBasicMaterial map={portraitTex} />
          ) : (
            <meshStandardMaterial color="#181b22" roughness={0.4} />
          )}
        </mesh>

        {/* Engraved Museum Brass Nameplate */}
        <mesh position={[0, -0.76, 0.024]}>
          <planeGeometry args={[0.52, 0.075]} />
          <meshStandardMaterial color="#c5a059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* ================= BACK ENCLOSURE WALL (BEHIND VISITOR, FACING WORKSTATION) ================= */}
      <mesh position={[0, 2.1, 6.8]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[11, 4.2]} />
        <meshStandardMaterial
          color="#ded6cc"
          roughness={0.78}
          metalness={0.02}
        />
      </mesh>
      {/* Baseboard molding on back enclosure wall */}
      <mesh position={[0, 0.07, 6.78]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[11, 0.14, 0.04]} />
        <meshStandardMaterial color="#cfc7bd" roughness={0.5} />
      </mesh>

      {/* ================= TALL INDOOR POTTED PLANT (Left Forefront) ================= */}
      <group position={[-4.2, 0, 3.8]}>
        {/* Ceramic Planter Pot */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.22, 0.64, 24]} />
          <meshStandardMaterial color="#f0ece6" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Pot Saucer Base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
          <meshStandardMaterial color="#332c25" roughness={0.4} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.62, 0]}>
          <circleGeometry args={[0.27, 24]} />
          <meshStandardMaterial color="#2d2218" roughness={0.9} />
        </mesh>
        {/* Plant Stems and Leaves */}
        {plantLeaves.map((leaf, li) => {
          const x = Math.cos(leaf.angle) * leaf.reach;
          const z = Math.sin(leaf.angle) * leaf.reach;
          return (
            <group key={`leaf-${li}`} position={[0, 0.6, 0]}>
              {/* Arching Stem */}
              <mesh
                position={[x * 0.5, leaf.height * 0.5, z * 0.5]}
                rotation={[Math.sin(leaf.angle) * leaf.tilt, 0, -Math.cos(leaf.angle) * leaf.tilt]}
                castShadow
              >
                <cylinderGeometry args={[0.012, 0.018, leaf.height, 8]} />
                <meshStandardMaterial color="#3f663b" roughness={0.6} />
              </mesh>
              {/* Broad Leaf Blade */}
              <mesh
                position={[x, leaf.height, z]}
                rotation={[leaf.tilt, leaf.angle, 0]}
                scale={[leaf.scale, leaf.scale, leaf.scale]}
                castShadow
              >
                <boxGeometry args={[0.22, 0.01, 0.34]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.45} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
