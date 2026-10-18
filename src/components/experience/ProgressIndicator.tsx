'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS } from '@/lib/experience-config';

export function ProgressIndicator() {
  const { activeIndex, scrollProgress, isExplorationMode } = useExperience();

  if (isExplorationMode) return null;

  const currentSection = SECTIONS[activeIndex] || SECTIONS[0];
  const totalCount = SECTIONS.length;
  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-30 pointer-events-none flex items-center gap-3">
      <div className="glass-panel-subtle px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-2.5 sm:gap-3 border border-[#00f0ff]/20">
        <div className="font-mono text-xs">
          <span className="text-[#00f0ff] font-bold">
            0{activeIndex + 1}
          </span>
          <span className="text-[#64748b]"> / 0{totalCount}</span>
        </div>

        <div className="h-3 w-px bg-[#1e293b]" />

        <div className="flex flex-col">
          <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide">
            {currentSection.stationName}
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#94a3b8]">
            Sector {currentSection.label} &bull; {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
