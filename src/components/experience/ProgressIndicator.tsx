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
      <div className="bg-[#0c1017]/85 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-3 border border-white/10 shadow-lg">
        <div className="font-mono text-xs">
          <span className="text-[#38bdf8] font-bold">
            0{activeIndex + 1}
          </span>
          <span className="text-[#64748b]"> / 0{totalCount}</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white tracking-wide font-['Outfit']">
            {currentSection.stationName}
          </span>
          <span className="text-[10px] font-mono text-[#94a3b8]">
            {currentSection.label} &bull; {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
