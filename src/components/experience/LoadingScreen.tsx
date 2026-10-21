'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';

/**
 * Honest, minimal asset readiness check.
 * Renders only if WebGL / 3D context is actively mounting;
 * never displays fake percentages or arbitrary delays.
 */
export function LoadingScreen() {
  const { isReady } = useExperience();

  if (isReady) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#080b11] flex flex-col items-center justify-center p-6 select-none"
      aria-label="Loading environment"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="font-['Outfit'] text-sm tracking-[0.3em] font-semibold text-white/90 uppercase">
          N<span className="text-[#00f0ff]">/</span>VERSE
        </span>
        <div className="w-16 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#00f0ff] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
