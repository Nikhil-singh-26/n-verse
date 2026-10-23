'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS } from '@/lib/experience-config';

export function ProgressIndicator() {
  const { activeSection, activeIndex, scrollProgress, isExplorationMode } = useExperience();

  if (isExplorationMode) return null;

  const journeySections = SECTIONS.filter(
    (sec) => !['intro', 'about', 'resume', 'contact'].includes(sec.id)
  );
  const curIdx = journeySections.findIndex((s) => s.id === activeSection);
  const currentSection =
    curIdx >= 0 ? journeySections[curIdx] : SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
  const totalCount = journeySections.length;
  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-30 pointer-events-none flex items-center gap-2 sm:gap-3">
      <div className="bg-[#0c1017]/85 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-2 sm:gap-3 border border-white/10 shadow-lg">
        <div className="font-mono text-xs whitespace-nowrap">
          <span className="text-[#38bdf8] font-bold">
            0{curIdx >= 0 ? curIdx + 1 : 1}
          </span>
          <span className="text-[#64748b]"> / 0{totalCount}</span>
        </div>

        <div className="h-3 w-px bg-white/10 shrink-0" />

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white tracking-wide font-['Outfit'] max-w-[85px] xs:max-w-[120px] sm:max-w-none truncate">
            {currentSection.stationName}
          </span>
          <span className="text-[10px] font-mono text-[#94a3b8] max-w-[85px] xs:max-w-[120px] sm:max-w-none truncate">
            {currentSection.label} &bull; {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
