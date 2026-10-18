'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS, SECTION_IDS } from '@/lib/experience-config';
import { ChevronLeft, FastForward, RotateCcw } from 'lucide-react';

export function SkipControl() {
  const {
    activeSection,
    activeIndex,
    nextSection,
    prevSection,
    jumpToSection,
    isExplorationMode
  } = useExperience();

  if (isExplorationMode) return null;

  const isLast = activeIndex === SECTION_IDS.length - 1;
  const isFirst = activeIndex === 0;
  const prevLabel = activeIndex > 0 ? SECTIONS[activeIndex - 1].label : '';
  const nextLabel = !isLast ? SECTIONS[activeIndex + 1].label : '';

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-30 pointer-events-none flex items-center gap-2">
      {/* Prev Station button */}
      {!isFirst && (
        <button
          onClick={prevSection}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel-subtle text-xs font-mono text-[#94a3b8] hover:text-white hover:border-[#00f0ff]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
          aria-label={`Previous station: ${prevLabel}`}
          title={`Previous: ${prevLabel}`}
        >
          <ChevronLeft className="w-4 h-4 text-[#00f0ff]" />
          <span className="hidden sm:inline">Prev ({prevLabel})</span>
          <span className="sm:hidden">Prev</span>
        </button>
      )}

      {/* Visible Skip / Next Station Button */}
      {!isLast ? (
        <button
          onClick={nextSection}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/50 text-xs font-mono text-[#00f0ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
          aria-label={`Skip to next station: ${nextLabel}`}
          title={`Skip to: ${nextLabel}`}
        >
          <span>Skip to {nextLabel}</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={() => jumpToSection('gate')}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00f0ff] hover:bg-white text-black font-semibold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Restart journey from gate"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return to Gate</span>
        </button>
      )}
    </div>
  );
}
