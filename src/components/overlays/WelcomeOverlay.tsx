'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { ChevronDown, ArrowDown, Sparkles } from 'lucide-react';

export function WelcomeOverlay() {
  const { activeSection, scrollProgress, doorOpenProgress, jumpToSection } = useExperience();

  // Active in gate or welcome stations
  const isGate = activeSection === 'gate';
  const isWelcome = activeSection === 'welcome';

  if (!isGate && !isWelcome) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between items-center p-6 md:p-12 z-20">
      {/* Top Header Identity */}
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="font-mono text-xs tracking-widest text-[#00f0ff] uppercase">
            {isGate ? 'System Armed // Sector 00: Gateway' : 'Gateway Unlocked // Sector 01: Lab Threshold'}
          </span>
        </div>
        <div className="hidden sm:block font-mono text-xs text-[#94a3b8] tracking-wider">
          EST. 2026 // CSE DEPT
        </div>
      </div>

      {/* Center Titles: Scene A (Gate) vs Scene C (Welcome Reveal) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        {isGate ? (
          /* Scene A: Gate Title & Minimal Prompt */
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-xs uppercase tracking-widest">
              Nikhil Universe
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white font-['Outfit']">
              <span className="text-gradient-cyan">N/VERSE</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#94a3b8] font-mono max-w-xl mx-auto">
              Creative Engineering Laboratory & Developer Portfolio of Nikhil Singh
            </p>
          </div>
        ) : (
          /* Scene C: Welcome Reveal with Blur-to-Sharp Transition */
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Threshold Traversed // System Online
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wider font-['Outfit'] filter drop-shadow-[0_0_35px_rgba(0,240,255,0.35)]">
              WELCOME TO <span className="text-gradient-cyan">N/VERSE</span>
            </h2>

            <p className="text-sm sm:text-base font-mono text-[#cbd5e1] max-w-lg mx-auto">
              Entering Developer Laboratory &bull; Workstation Terminal Ready
            </p>

            <div className="pt-2">
              <span className="text-xs font-mono font-bold text-[#00f0ff] tracking-widest uppercase">
                CODE. LEARN. BUILD. REPEAT.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Understated Navigation Prompt */}
      <div className="w-full flex flex-col items-center gap-4 max-w-md mx-auto pointer-events-auto">
        {isGate ? (
          <button
            onClick={() => jumpToSection('welcome')}
            className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] rounded-lg p-2"
            aria-label="Scroll to enter N/VERSE"
          >
            <span className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase group-hover:text-white transition-colors">
              SCROLL TO ENTER
            </span>
            <div className="w-8 h-12 rounded-full border border-[#00f0ff]/40 flex items-start justify-center p-2 group-hover:border-[#00f0ff] transition-colors">
              <div className="w-1.5 h-3 rounded-full bg-[#00f0ff] animate-bounce" />
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => jumpToSection('gate')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-panel text-xs font-mono text-[#94a3b8] hover:text-[#00f0ff] border border-[#1e293b] hover:border-[#00f0ff]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
              aria-label="Return to Gate"
            >
              <span>&larr; Back to Gate</span>
            </button>
            <button
              onClick={() => jumpToSection('about')}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/50 text-xs font-mono text-[#00f0ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
              aria-label="Proceed to computer workstation terminal"
            >
              <span>Proceed to Terminal</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
