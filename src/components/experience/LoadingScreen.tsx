'use client';

import React, { useEffect, useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';

export function LoadingScreen() {
  const { isReady, setIsReady, isReducedMotion } = useExperience();
  const [loadingProgress, setLoadingProgress] = useState(25);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isReducedMotion) {
      setIsReady(true);
      return;
    }

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadingOut(true);
          setTimeout(() => setIsReady(true), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 30) + 20;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [setIsReady, isReducedMotion]);

  if (isReady) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-xs space-y-4 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-widest font-['Outfit']">
          N/VERSE
        </h1>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-200 ease-out"
            style={{ width: `${Math.min(100, loadingProgress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
