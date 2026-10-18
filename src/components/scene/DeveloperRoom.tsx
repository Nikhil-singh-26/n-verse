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

  // Books colors palette
  const bookColors = ['#8c4636', '#2d4059', '#3b5360', '#d4a373', '#ccd5ae', '#4a4e69', '#34495e'];

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

      {/* ================= FLOATING OAK BOOKSHELVES ON BACK WALL ================= */}
      {/* Upper Shelf */}
      <group position={[-1.2, 3.4, -4.38]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.04, 0.28]} />
          <meshStandardMaterial color="#553c29" roughness={0.5} metalness={0.05} />
        </mesh>
        {/* Books on Upper Shelf */}
        <group position={[-1.2, 0.14, 0]}>
          {bookColors.map((color, i) => (
            <mesh key={`book-u-${i}`} position={[i * 0.065, 0, 0]} castShadow>
              <boxGeometry args={[0.05, 0.24 + (i % 3) * 0.04, 0.2]} />
              <meshStandardMaterial color={color} roughness={0.65} />
            </mesh>
          ))}
        </group>
        {/* Decorative small ceramic vase */}
        <mesh position={[1.1, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#f4efe6" roughness={0.3} />
        </mesh>
        {/* Miniature desktop plant in ceramic pot on shelf */}
        <mesh position={[0.75, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 16]} />
          <meshStandardMaterial color="#e2d4c0" roughness={0.4} />
        </mesh>
        <mesh position={[0.75, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#4a7c59" roughness={0.7} />
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

      {/* ================= FINE ART FRAMED PORTRAIT ON RIGHT WALL (NIKHIL SINGH) ================= */}
      <group position={[4.96, 2.3, 2.0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Brass Picture Lamp overhead casting downlight on portrait */}
        <spotLight
          position={[0, 1.35, 0.5]}
          target-position={[0, 0, 0]}
          color="#fff2df"
          intensity={3.2}
          angle={0.68}
          penumbra={0.4}
        />
        {/* Brass Lamp Fixture Arm & Tube */}
        <mesh position={[0, 1.3, 0.32]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.54, 16]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.3, 0.16]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Outer Heavy Beveled Dark Walnut & Brass Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.36, 2.26, 0.05]} />
          <meshStandardMaterial color="#1a1511" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* Brass Fillet Inner Bevel */}
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[1.24, 2.14, 0.02]} />
          <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.3} />
        </mesh>
        {/* Off-White Archival Museum Matting */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.2, 2.1]} />
          <meshStandardMaterial color="#f7f5f0" roughness={0.9} />
        </mesh>

        {/* Fine Art Portrait of Nikhil Singh: public/mypic.png */}
        <mesh position={[0, 0.06, 0.025]}>
          <planeGeometry args={[1.08, 1.92]} />
          {portraitTex ? (
            <meshBasicMaterial map={portraitTex} />
          ) : (
            <meshStandardMaterial color="#181b22" roughness={0.4} />
          )}
        </mesh>

        {/* Engraved Museum Brass Nameplate */}
        <mesh position={[0, -0.96, 0.028]}>
          <planeGeometry args={[0.55, 0.08]} />
          <meshStandardMaterial color="#c5a059" metalness={0.92} roughness={0.25} />
        </mesh>
      </group>

      {/* ================= COZY LOUNGE CORNER (Right Forefront) ================= */}
      <group position={[3.3, 0, 3.6]} rotation={[0, -Math.PI * 0.72, 0]}>
        {/* Armchair / Lounge Chair Base */}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.22, 0.85]} />
          <meshStandardMaterial color="#3d4048" roughness={0.85} metalness={0.02} />
        </mesh>
        {/* Seat Cushion */}
        <mesh position={[0, 0.52, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.12, 0.74]} />
          <meshStandardMaterial color="#505560" roughness={0.9} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.82, 0.36]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.88, 0.65, 0.16]} />
          <meshStandardMaterial color="#3d4048" roughness={0.85} />
        </mesh>
        {/* Left Armrest */}
        <mesh position={[-0.42, 0.62, 0]} castShadow>
          <boxGeometry args={[0.12, 0.36, 0.78]} />
          <meshStandardMaterial color="#3d4048" roughness={0.85} />
        </mesh>
        {/* Right Armrest */}
        <mesh position={[0.42, 0.62, 0]} castShadow>
          <boxGeometry args={[0.12, 0.36, 0.78]} />
          <meshStandardMaterial color="#3d4048" roughness={0.85} />
        </mesh>
        {/* Throw Pillow */}
        <mesh position={[0.16, 0.64, 0.26]} rotation={[0.2, 0.25, 0.1]} castShadow>
          <boxGeometry args={[0.34, 0.34, 0.12]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Tapered Wooden Legs */}
        {[
          [-0.38, -0.34],
          [0.38, -0.34],
          [-0.38, 0.34],
          [0.38, 0.34]
        ].map(([lx, lz], i) => (
          <mesh key={`leg-${i}`} position={[lx, 0.14, lz]} rotation={[0.08, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.016, 0.28, 12]} />
            <meshStandardMaterial color="#5c3d2e" roughness={0.4} />
          </mesh>
        ))}

        {/* Small Round Side Table Beside Armchair */}
        <group position={[-0.95, 0, 0.2]}>
          {/* Tabletop */}
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.035, 24]} />
            <meshStandardMaterial color="#6a4c38" roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Tripod Legs */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, li) => (
            <mesh
              key={`table-leg-${li}`}
              position={[Math.cos(rad) * 0.16, 0.25, Math.sin(rad) * 0.16]}
              rotation={[Math.sin(rad) * 0.1, 0, -Math.cos(rad) * 0.1]}
              castShadow
            >
              <cylinderGeometry args={[0.015, 0.012, 0.52, 8]} />
              <meshStandardMaterial color="#2b231d" roughness={0.4} />
            </mesh>
          ))}
          {/* Coffee Mug on Side Table */}
          <group position={[0.06, 0.55, -0.04]} castShadow>
            <mesh>
              <cylinderGeometry args={[0.042, 0.036, 0.09, 16]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.25} />
            </mesh>
            {/* Coffee inside */}
            <mesh position={[0, 0.038, 0]}>
              <circleGeometry args={[0.038, 16]} />
              <meshBasicMaterial color="#301e12" />
            </mesh>
          </group>
        </group>
      </group>

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
