'use client';

import React, { useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { achievementsData } from '@/data/achievements';
import { AchievementItem } from '@/types';
import { Award, Trophy, Users, ExternalLink, X, CheckCircle, Code2, Maximize2 } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  hackathon: <Trophy className="w-4 h-4 text-amber-400" />,
  milestone: <Code2 className="w-4 h-4 text-[#38bdf8]" />,
  leadership: <Users className="w-4 h-4 text-emerald-400" />
};

export function AchievementArea() {
  const { activeSection, activeAchievementId, setActiveAchievementId, setIsLeetCodeModalOpen } = useExperience();
  const isAchievements = activeSection === 'achievements';
  const [inspectedItem, setInspectedItem] = useState<AchievementItem | null>(null);

  // All 4 achievements shown on 4 distinct boards, all visible at the same time
  const framedMilestones = achievementsData.slice(0, 4);

  return (
    <group position={[0, 2.15, 6.74]} rotation={[0, Math.PI, 0]}>
      {/* Warm gallery picture lamp downlight */}
      <spotLight
        position={[0, 1.8, 1.2]}
        target-position={[0, 0, 0]}
        color="#fff5ea"
        intensity={isAchievements ? 3.0 : 0.8}
        angle={0.72}
        penumbra={0.6}
        castShadow
      />
      <pointLight position={[-1.6, 0.4, 0.8]} color="#fed7aa" intensity={0.5} distance={4.5} />
      <pointLight position={[1.6, 0.4, 0.8]} color="#fed7aa" intensity={0.5} distance={4.5} />

      {/* Gallery Wall Inset Plaster Board */}
      <mesh receiveShadow position={[0, 0, -0.01]}>
        <planeGeometry args={[4.8, 2.8]} />
        <meshStandardMaterial color="#d8d0c5" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Exhibition Area Header Bar: Achievements & Leadership */}
      <group position={[0, 1.25, 0.02]}>
        <Html
          transform
          distanceFactor={1.2}
          position={[0, 0, 0]}
          className="pointer-events-none select-none text-center"
        >
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#44403c] font-bold">
            ACHIEVEMENTS & LEADERSHIP &bull; VERIFIED RECORDS
          </div>
        </Html>
      </group>

      {/* ================= 4 DISTINCT FRAMED BOARDS VISIBLE AT THE SAME TIME ================= */}
      {framedMilestones.map((item, idx) => {
        // 2x2 grid on the wall: Board 1 (LeetCode), Board 2 (SSH), Board 3 (IIIT NR), Board 4 (GDG)
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const posX = -1.15 + col * 2.3;
        const posY = 0.45 - row * 1.15;
        const isSelected = activeAchievementId === item.id || inspectedItem?.id === item.id;
        const isLeetCodeBoard = item.id === 'achievement-leetcode' || !!item.image;

        return (
          <group key={item.id} position={[posX, posY, 0.02]}>
            {/* Gallery Picture Frame (Dark Walnut with gold inner fillet) */}
            <mesh
              castShadow
              onClick={() => {
                setActiveAchievementId(item.id);
                if (isLeetCodeBoard) {
                  setIsLeetCodeModalOpen(true);
                } else {
                  setInspectedItem(item);
                }
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <boxGeometry args={[1.98, 0.98, 0.04]} />
              <meshStandardMaterial
                color={isSelected ? '#251b14' : '#1e1b18'}
                roughness={0.4}
                metalness={0.12}
              />
            </mesh>

            {/* Inner Matting Board */}
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[1.82, 0.82]} />
              <meshStandardMaterial color={isLeetCodeBoard ? '#0f172a' : '#f8f6f0'} roughness={0.9} />
            </mesh>

            {/* Brass Picture Lamp Mini-Fixture above each frame */}
            <group position={[0, 0.54, 0.12]}>
              <mesh>
                <boxGeometry args={[0.44, 0.025, 0.04]} />
                <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
              </mesh>
            </group>

            {/* Credential Content Layer */}
            <Html
              transform
              distanceFactor={1.05}
              position={[0, 0, 0.025]}
              className="pointer-events-auto select-none"
            >
              <div
                onClick={() => {
                  setActiveAchievementId(item.id);
                  if (isLeetCodeBoard) {
                    setIsLeetCodeModalOpen(true);
                  } else {
                    setInspectedItem(item);
                  }
                }}
                className={`w-[364px] h-[156px] p-2.5 flex flex-col justify-between cursor-pointer rounded-sm transition-all overflow-hidden ${
                  isLeetCodeBoard
                    ? 'bg-[#0b101b] border border-amber-500/30 text-white'
                    : isSelected
                    ? 'bg-amber-50/50 shadow-inner'
                    : 'hover:bg-amber-50/20'
                }`}
              >
                {isLeetCodeBoard ? (
                  /* ================= BOARD 1: LEETCODE.PNG VISUAL DISPLAY ================= */
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="p-0.5 rounded bg-amber-500/20 text-amber-400">
                          <Code2 className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                          Achievements & Leadership
                        </span>
                      </div>
                      <span className="font-mono text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Verified Profile</span>
                      </span>
                    </div>

                    {/* Image Viewport: public/leetcode.png (Clickable to inspect full screen) */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLeetCodeModalOpen(true);
                      }}
                      className="flex-1 my-1 relative overflow-hidden rounded bg-black/40 flex items-center justify-center border border-white/5 cursor-pointer group"
                      title="Click to inspect LeetCode stats in full screen"
                    >
                      <img
                        src="/leetcode.png"
                        alt="LeetCode Profile Achievement"
                        className="w-full h-full object-contain transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-mono text-white bg-black/80 px-2 py-1 rounded flex items-center gap-1 border border-white/20 shadow-md">
                          <Maximize2 className="w-3 h-3 text-amber-400" />
                          <span>Inspect Full Screen</span>
                        </span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#94a3b8] pt-1 border-t border-white/10">
                      <span className="text-white font-medium">LeetCode Problem Solving</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLeetCodeModalOpen(true);
                        }}
                        className="text-amber-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 font-semibold transition-all hover:bg-amber-500/40"
                        title="Inspect full screen"
                      >
                        <Maximize2 className="w-2.5 h-2.5" />
                        <span>Inspect Full Screen</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================= BOARDS 2, 3, 4: HACKATHONS & LEADERSHIP ================= */
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {/* Top Category and Period Tag */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded bg-[#1e1b18] text-white">
                          {typeIcons[item.type] || <Award className="w-3.5 h-3.5 text-amber-400" />}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#78716c] font-bold">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-[#8c4636] bg-[#8c4636]/10 px-2 py-0.5 rounded">
                        {item.period}
                      </span>
                    </div>

                    {/* Title and Role / Organization */}
                    <div className="my-auto py-1">
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#1c1917] font-serif leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-mono text-[#8c4636] mt-1 font-semibold">
                        {item.organization}
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#78716c] pt-1 border-t border-[#e7e5e4]">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{item.badge}</span>
                      </span>
                      <span className="text-[#8c4636] underline">Inspect Milestone</span>
                    </div>
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* ================= DETAILED INSPECTION MODAL ================= */}
      {inspectedItem && (
        <Html
          position={[0, -0.65, 0.25]}
          center
          distanceFactor={1.1}
          className="pointer-events-auto select-none z-30"
        >
          <div className="w-[440px] bg-[#12161f]/98 border border-[#38bdf8]/40 rounded-xl p-4 shadow-2xl text-white space-y-2.5 backdrop-blur-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/10 text-[#38bdf8]">
                  {typeIcons[inspectedItem.type] || <Award className="w-4 h-4" />}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Outfit']">{inspectedItem.title}</h4>
                  <p className="text-[11px] font-mono text-[#94a3b8]">{inspectedItem.organization}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setInspectedItem(null);
                  setActiveAchievementId(null);
                }}
                className="p-1 text-[#94a3b8] hover:text-white transition-colors"
                aria-label="Close milestone inspection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If inspecting item with screenshot/image, show preview and full-screen trigger */}
            {inspectedItem.image && (
              <div className="space-y-2">
                <div
                  onClick={() => setIsLeetCodeModalOpen(true)}
                  className="rounded-lg overflow-hidden border border-white/10 max-h-36 bg-black flex items-center justify-center cursor-pointer group relative"
                  title="Click to inspect full screen"
                >
                  <img
                    src={inspectedItem.image}
                    alt={inspectedItem.title}
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs font-mono text-white bg-black/80 px-2.5 py-1 rounded flex items-center gap-1.5 border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Full Screen</span>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeetCodeModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-medium hover:bg-amber-500/30 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Full Screen</span>
                </button>
              </div>
            )}

            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              {inspectedItem.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
              <span className="text-[#38bdf8] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{inspectedItem.badge || 'Official Record'}</span>
              </span>

              {inspectedItem.credentialUrl ? (
                <a
                  href={inspectedItem.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#38bdf8] text-black font-semibold text-xs transition-colors hover:bg-white"
                >
                  <span>Open Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-white/50 text-[10px] font-mono">
                  {inspectedItem.period}
                </span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
