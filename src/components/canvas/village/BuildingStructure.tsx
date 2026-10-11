"use client";

import { BuildingConfig } from "@/types/village";
import { InteractiveDoor } from "./InteractiveDoor";
import { BuildingSign } from "./BuildingSign";

interface BuildingStructureProps {
  config: BuildingConfig;
  isOpen: boolean;
  isNearby: boolean;
}

export function BuildingStructure({
  config,
  isOpen,
  isNearby,
}: BuildingStructureProps) {
  const { id, colors, signText, category } = config;

  return (
    <group position={config.position} rotation={[0, config.rotation, 0]}>
      {/* 1. FOUNDATION / PLINTH */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[6.6, 0.3, 6.6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* 2. MAIN WALLS BODY */}
      <mesh position={[0, 2.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.2, 3.7, 6.2]} />
        <meshStandardMaterial color={colors.walls} roughness={0.8} />
      </mesh>

      {/* 3. WALL CORNER TIMBERS / PILASTERS */}
      {/* 4 corners */}
      {[
        [-3.0, 2.15, -3.0],
        [3.0, 2.15, -3.0],
        [-3.0, 2.15, 3.0],
        [3.0, 2.15, 3.0],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 3.8, 0.45]} />
          <meshStandardMaterial color={colors.trim} roughness={0.85} />
        </mesh>
      ))}

      {/* 4. WINDOWS */}
      {/* Left side window */}
      <group position={[-3.12, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.4, 0.1]} />
          <meshStandardMaterial color={colors.trim} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.3, 1.1, 0.08]} />
          <meshStandardMaterial
            color={colors.windowGlow || "#fef08a"}
            emissive={colors.windowGlow || "#fef08a"}
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right side window */}
      <group position={[3.12, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.4, 0.1]} />
          <meshStandardMaterial color={colors.trim} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.3, 1.1, 0.08]} />
          <meshStandardMaterial
            color={colors.windowGlow || "#fef08a"}
            emissive={colors.windowGlow || "#fef08a"}
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Front facade windows flanking the doorway */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, 2.3, 3.12]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 1.3, 0.1]} />
            <meshStandardMaterial color={colors.trim} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.85, 1.05, 0.08]} />
            <meshStandardMaterial
              color={colors.windowGlow || "#fef08a"}
              emissive={colors.windowGlow || "#fef08a"}
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* 5. DISTINCT ROOF & SILHOUETTE PER BUILDING TYPE */}
      {id === "about" && (
        /* --- ABOUT ME: COTTAGE ROOF & CHIMNEY --- */
        <group>
          {/* Steep gabled roof */}
          <mesh position={[0, 4.6, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
            <coneGeometry args={[4.8, 2.2, 4]} />
            <meshStandardMaterial color={colors.roof} roughness={0.85} />
          </mesh>

          {/* Roof Ridge Beam */}
          <mesh position={[0, 5.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.3, 6.8]} />
            <meshStandardMaterial color={colors.trim} />
          </mesh>

          {/* Stone Chimney */}
          <mesh position={[2.2, 4.8, -1.5]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 2.8, 0.9]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <mesh position={[2.2, 6.3, -1.5]} castShadow>
            <boxGeometry args={[1.05, 0.25, 1.05]} />
            <meshStandardMaterial color="#475569" />
          </mesh>

          {/* Miniature smoke puffs */}
          <mesh position={[2.2, 6.7, -1.5]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} />
          </mesh>
          <mesh position={[2.3, 7.3, -1.4]}>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.4} />
          </mesh>

          {/* Porch overhang */}
          <mesh position={[0, 2.8, 3.6]} castShadow>
            <boxGeometry args={[2.8, 0.15, 1.2]} />
            <meshStandardMaterial color={colors.roof} roughness={0.8} />
          </mesh>
          <mesh position={[-1.2, 1.4, 4.0]} castShadow>
            <boxGeometry args={[0.15, 2.7, 0.15]} />
            <meshStandardMaterial color={colors.trim} />
          </mesh>
          <mesh position={[1.2, 1.4, 4.0]} castShadow>
            <boxGeometry args={[0.15, 2.7, 0.15]} />
            <meshStandardMaterial color={colors.trim} />
          </mesh>

          {/* Flower window boxes */}
          <mesh position={[-1.8, 1.5, 3.25]} castShadow>
            <boxGeometry args={[1.0, 0.25, 0.3]} />
            <meshStandardMaterial color={colors.trim} />
          </mesh>
          <mesh position={[-1.8, 1.7, 3.25]}>
            <boxGeometry args={[0.8, 0.15, 0.2]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {id === "skills" && (
        /* --- SKILLS: CYBER TECH LAB ROOF & SERVER ANTENNA --- */
        <group>
          {/* Slanted modern tech roof */}
          <mesh position={[0, 4.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.4, 0.6, 6.4]} />
            <meshStandardMaterial color={colors.trim} roughness={0.6} />
          </mesh>

          {/* Solar Panel Array Grid on roof */}
          {[-1.6, 0, 1.6].map((x, i) => (
            <mesh key={i} position={[x, 4.65, 0]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[1.3, 0.1, 4.8]} />
              <meshStandardMaterial
                color="#0284c7"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          ))}

          {/* Rooftop Server Antenna Tower */}
          <mesh position={[2.0, 5.8, 2.0]} castShadow>
            <cylinderGeometry args={[0.1, 0.2, 2.8, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* Glowing cyber transmitter beacon */}
          <mesh position={[2.0, 7.3, 2.0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Neon accent stripes on facade */}
          <mesh position={[0, 3.8, 3.12]}>
            <boxGeometry args={[5.8, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.0}
            />
          </mesh>
        </group>
      )}

      {id === "projects" && (
        /* --- PROJECTS: CREATIVE STUDIO SAWTOOTH ROOF & AWNING --- */
        <group>
          {/* Sawtooth / Clerestory Studio Roof */}
          <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.6, 0.5, 6.6]} />
            <meshStandardMaterial color={colors.trim} roughness={0.7} />
          </mesh>
          <mesh position={[0, 5.2, -1.0]} castShadow>
            <boxGeometry args={[5.6, 1.2, 3.2]} />
            <meshStandardMaterial color={colors.roof} roughness={0.7} />
          </mesh>
          {/* Skylight glass band */}
          <mesh position={[0, 5.1, 0.65]}>
            <boxGeometry args={[5.4, 0.9, 0.1]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.8}
              roughness={0.1}
            />
          </mesh>

          {/* Striped studio entrance awning */}
          <mesh position={[0, 2.7, 3.65]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[2.8, 0.12, 1.2]} />
            <meshStandardMaterial color="#f97316" roughness={0.6} />
          </mesh>

          {/* Outside sculptor display pedestal */}
          <mesh position={[-2.4, 0.45, 3.8]} castShadow>
            <boxGeometry args={[0.6, 0.9, 0.6]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[-2.4, 1.15, 3.8]} rotation={[0.4, 0.6, 0.2]} castShadow>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#06b6d4"
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {id === "experience" && (
        /* --- EXPERIENCE: CORPORATE OFFICE NEOCLASSICAL PARAPET --- */
        <group>
          {/* Classical flat roof with cornice parapet */}
          <mesh position={[0, 4.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.8, 0.45, 6.8]} />
            <meshStandardMaterial color={colors.trim} roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.5, 0.35, 6.5]} />
            <meshStandardMaterial color={colors.roof} roughness={0.8} />
          </mesh>

          {/* Facade Pilasters / Columns */}
          {[-1.3, 1.3].map((x, i) => (
            <mesh key={i} position={[x, 2.15, 3.25]} castShadow>
              <boxGeometry args={[0.35, 3.8, 0.35]} />
              <meshStandardMaterial color={colors.trim} roughness={0.8} />
            </mesh>
          ))}

          {/* Modern Steel/Glass Entrance Canopy */}
          <mesh position={[0, 2.7, 3.7]} castShadow>
            <boxGeometry args={[2.4, 0.08, 1.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>

          {/* Landscaped Topiary Urns */}
          {[-2.5, 2.5].map((x, i) => (
            <group key={i} position={[x, 0.45, 3.6]}>
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.6, 0.5]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <mesh position={[0, 0.5, 0]} castShadow>
                <dodecahedronGeometry args={[0.35, 0]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {id === "education" && (
        /* --- EDUCATION: ACADEMIC HALL WITH CLOCK / BELL SPIRE --- */
        <group>
          {/* Mansard / Hipped Academy Roof */}
          <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.6, 0.7, 6.6]} />
            <meshStandardMaterial color={colors.roof} roughness={0.85} />
          </mesh>

          {/* Central Clock / Bell Tower Spire */}
          <mesh position={[0, 5.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 1.8, 2.2]} />
            <meshStandardMaterial color={colors.walls} roughness={0.8} />
          </mesh>
          {/* Clock face */}
          <mesh position={[0, 5.6, 1.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.08, 16]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
          </mesh>
          {/* Spire Pyramidal Cap */}
          <mesh position={[0, 7.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.6, 1.6, 4]} />
            <meshStandardMaterial color={colors.roof} roughness={0.7} />
          </mesh>

          {/* Grand Stepped Entrance Stairs */}
          <mesh position={[0, 0.1, 3.4]} receiveShadow>
            <boxGeometry args={[3.2, 0.2, 0.8]} />
            <meshStandardMaterial color="#78716c" roughness={0.9} />
          </mesh>
        </group>
      )}

      {id === "contact" && (
        /* --- CONTACT: OUTPOST WITH RADAR DISH & POST BOX --- */
        <group>
          {/* Weathered copper roof */}
          <mesh position={[0, 4.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.6, 0.6, 6.6]} />
            <meshStandardMaterial color={colors.roof} roughness={0.7} />
          </mesh>

          {/* Communications Mast & Radar Dish */}
          <mesh position={[-1.8, 5.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 2.2, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Angled Radar Dish */}
          <group position={[-1.8, 6.3, 0]} rotation={[0.4, 0.5, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.8, 0.4, 0.25, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
            </mesh>
          </group>

          {/* Curbside Postal Dispatch Box */}
          <group position={[2.4, 0.6, 3.6]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.9, 0.5]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.54, 0.15, 0.54]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
          </group>
        </group>
      )}

      {/* 6. SIGNBOARD: Mounted above the entrance */}
      <group position={[0, 2.9, 3.2]}>
        <BuildingSign
          text={signText}
          category={category}
          signColor="#0f172a"
          accentColor={colors.accent}
        />
      </group>

      {/* 7. INTERACTIVE DOORWAY: Located at the front center */}
      <group position={[0, 0, 3.1]}>
        <InteractiveDoor
          isOpen={isOpen}
          isNearby={isNearby}
          doorWidth={config.doorWidth}
          doorHeight={config.doorHeight}
          doorColor={colors.door}
          frameColor={colors.trim}
          accentColor={colors.accent}
        />
      </group>
    </group>
  );
}
