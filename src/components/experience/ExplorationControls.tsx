'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';

export function ExplorationControls() {
  const { isExplorationMode, toggleExplorationMode, jumpToSection } = useExperience();

  if (!isExplorationMode) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-[#00f0ff]/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-['Outfit']">
              Laboratory 360° Free-Look Active
            </div>
            <div className="text-xs font-mono text-[#94a3b8]">
              Drag with mouse or swipe touch to rotate around the entire room
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleExplorationMode(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-white text-black font-mono font-semibold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] focus:outline-none focus:ring-2 focus:ring-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
}
