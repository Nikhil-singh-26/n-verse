'use client';

import React, { useEffect, useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';

export function LoadingScreen() {
  const { isReady, setIsReady } = useExperience();
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Artificial smooth ramp up for asset hydration
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadingOut(true);
            setTimeout(() => setIsReady(true), 600);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [setIsReady]);

  if (isReady) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#05070b] flex flex-col items-center justify-center p-6 transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Brand Wordmark */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wider font-['Outfit']">
            <span className="text-gradient-cyan">N/VERSE</span>
          </h1>
          <p className="text-xs font-mono text-[#94a3b8] tracking-widest uppercase">
            3D Laboratory Systems Initializing...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-[#0e1626] rounded-full overflow-hidden border border-[#00f0ff]/20">
            <div
              className="h-full bg-[#00f0ff] transition-all duration-300 ease-out shadow-[0_0_12px_#00f0ff]"
              style={{ width: `${Math.min(100, loadingProgress)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-[#64748b]">
            <span>LOADING ASSETS</span>
            <span className="text-[#00f0ff]">{Math.min(100, loadingProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
