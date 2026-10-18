'use client';

import React, { useState, useEffect } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import {
  X,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  Code2,
  Trophy,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export function LeetCodeInspectionModal() {
  const { isLeetCodeModalOpen, setIsLeetCodeModalOpen } = useExperience();
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLeetCodeModalOpen) {
        setIsLeetCodeModalOpen(false);
        setIsZoomed(false);
      }
    };

    if (isLeetCodeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLeetCodeModalOpen, setIsLeetCodeModalOpen]);

  // Reset zoom when modal closes
  useEffect(() => {
    if (!isLeetCodeModalOpen) {
      setIsZoomed(false);
    }
  }, [isLeetCodeModalOpen]);

  if (!isLeetCodeModalOpen) return null;

  const handleClose = () => {
    setIsLeetCodeModalOpen(false);
    setIsZoomed(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="LeetCode Achievement Fullscreen Inspection"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={handleClose}
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex flex-col justify-between items-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
    >
      {/* ================= TOP HEADER BAR ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 bg-[#0c101b]/90 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md"
      >
        {/* Left: Identity & Badges */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide font-['Outfit']">
                LeetCode Profile & Problem Solving Record
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#94a3b8] flex items-center gap-2 mt-0.5">
              <span>Nikhil Singh</span>
              <span className="text-white/30">&bull;</span>
              <span className="text-amber-400/90">@Nikhil_singh_26</span>
              <span className="text-white/30">&bull;</span>
              <span>Govt. Engineering College Bilaspur</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Zoom In/Out Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#cbd5e1] bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
            title={isZoomed ? 'Fit to Screen' : 'View Full Resolution (100%)'}
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Fit Screen</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">100% Zoom</span>
              </>
            )}
          </button>

          {/* External Live Link */}
          <a
            href="https://leetcode.com/u/Nikhil_singh_26/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <span>Live Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-[#94a3b8] hover:text-white bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-4 h-4" />
            <kbd className="hidden sm:inline text-[10px] font-mono text-[#64748b] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              ESC
            </kbd>
          </button>
        </div>
      </div>

      {/* ================= CENTER FULLSCREEN IMAGE VIEWPORT ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-6xl flex-1 flex items-center justify-center my-3 relative overflow-auto rounded-2xl bg-[#070b14]/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
          isZoomed ? 'cursor-zoom-out items-start p-6' : 'cursor-zoom-in p-2 sm:p-4'
        }`}
      >
        <div
          onClick={() => setIsZoomed((prev) => !prev)}
          className="relative transition-transform duration-200"
        >
          <img
            src="/leetcode.png"
            alt="Nikhil Singh LeetCode Profile and Solved Statistics Fullscreen View"
            className={`rounded-xl object-contain shadow-2xl transition-all ${
              isZoomed
                ? 'max-w-none w-auto h-auto'
                : 'max-h-[72vh] sm:max-h-[76vh] max-w-[90vw] w-auto h-auto'
            }`}
          />
        </div>
      </div>

      {/* ================= BOTTOM STATS & GUIDANCE STRIP ================= */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-2 bg-[#0c101b]/90 border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl text-xs font-mono text-[#94a3b8] backdrop-blur-md"
      >
        {/* Left: Solved Categories */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Core DSA & Algorithms</span>
          </span>
          <span className="hidden md:inline text-white/30">&bull;</span>
          <span className="hidden md:inline text-[#cbd5e1]">
            Dynamic Programming, Binary Trees, Graphs, Arrays & Two Pointers
          </span>
        </div>

        {/* Right: Interaction hints */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          <span className="text-[#64748b] hidden sm:inline">
            Click image to {isZoomed ? 'fit screen' : 'zoom 100%'}
          </span>
          <span className="text-white/30 hidden sm:inline">&bull;</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#cbd5e1] hover:text-white underline underline-offset-2 transition-colors"
          >
            Click backdrop or press ESC to close
          </button>
        </div>
      </div>
    </div>
  );
}
