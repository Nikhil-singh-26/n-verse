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

  const journeySections = SECTIONS.filter(
    (sec) => !['intro', 'about', 'resume', 'contact'].includes(sec.id)
  );
  const curIdx = journeySections.findIndex((s) => s.id === activeSection);
  const isLast = curIdx === journeySections.length - 1;
  const isFirst = curIdx <= 0 && activeSection !== 'intro';
  const prevLabel = curIdx > 0 ? journeySections[curIdx - 1].label : '';
  const nextLabel =
    activeSection === 'intro'
      ? 'Studio'
      : curIdx >= 0 && !isLast
      ? journeySections[curIdx + 1].label
      : '';

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-30 pointer-events-none flex items-center gap-2">
      {/* Prev Station button */}
      {!isFirst && (
        <button
          onClick={prevSection}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0c1017]/85 backdrop-blur-md text-xs font-mono text-[#94a3b8] hover:text-white border border-white/10 hover:border-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#38bdf8] shadow-lg"
          aria-label={`Previous station: ${prevLabel}`}
          title={`Previous: ${prevLabel}`}
        >
          <ChevronLeft className="w-4 h-4 text-[#38bdf8]" />
          <span className="hidden sm:inline">Prev ({prevLabel})</span>
          <span className="sm:hidden">Prev</span>
        </button>
      )}

      {/* Visible Skip / Next Station Button */}
      {!isLast ? (
        <button
          onClick={nextSection}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/50 text-xs font-mono text-[#38bdf8] hover:text-white transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] backdrop-blur-md"
          aria-label={`Advance to: ${nextLabel}`}
          title={`Advance to: ${nextLabel}`}
        >
          <span>Skip to {nextLabel}</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={() => jumpToSection('room')}
          className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#38bdf8] hover:bg-white text-black font-semibold text-xs font-mono transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Restart journey from study overview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Journey</span>
        </button>
      )}
    </div>
  );
}
