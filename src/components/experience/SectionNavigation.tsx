'use client';

import React, { useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS } from '@/lib/experience-config';
import { Compass, Volume2, VolumeX, Eye, Menu, X, ArrowLeft } from 'lucide-react';

export function SectionNavigation() {
  const {
    activeSection,
    jumpToSection,
    isExplorationMode,
    toggleExplorationMode,
    isMuted,
    toggleMute,
    isReducedMotion,
    toggleReducedMotion
  } = useExperience();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter out 'gate' and 'welcome' so the appbar only shows portfolio content stations
  const portfolioSections = SECTIONS.filter(
    (sec) => sec.id !== 'gate' && sec.id !== 'welcome'
  );

  const isEntered = activeSection !== 'gate';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Back to Gate button */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <button
            onClick={() => jumpToSection('gate')}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-panel-subtle hover:border-[#00f0ff]/50 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
            title="Return to N/VERSE Gate"
            aria-label="Return to N/VERSE Gate"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] group-hover:shadow-[0_0_8px_#00f0ff]" />
            <span className="font-extrabold text-white text-sm sm:text-base tracking-wider font-['Outfit']">
              N/VERSE
            </span>
            <span className="hidden md:inline font-mono text-[11px] text-[#64748b]">
              // LAB
            </span>
          </button>

          {/* Prominent 'Back to Gate' button visible whenever inside the lab */}
          {isEntered && (
            <button
              onClick={() => jumpToSection('gate')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-xs font-mono text-[#00f0ff] hover:text-white transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[#00f0ff] animate-in fade-in slide-in-from-left-2 duration-300"
              title="Return to entrance gate"
              aria-label="Return to entrance gate"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Gate</span>
            </button>
          )}
        </div>

        {/* Desktop Station Jump Selector Pills (Only About, Skills, Projects, Timeline, Contact) */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-xl glass-panel-subtle border border-[#00f0ff]/20"
          aria-label="Main Portfolio Stations"
        >
          {portfolioSections.map((sec) => {
            const isActive = activeSection === sec.id && !isExplorationMode;
            return (
              <button
                key={sec.id}
                onClick={() => jumpToSection(sec.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-[#94a3b8] hover:text-[#00f0ff] hover:bg-[#111927]'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Utility Controls: Mobile Menu, 360 Exploration, Audio Mute, Motion Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Station Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl glass-panel-subtle text-[#94a3b8] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-colors"
            aria-label="Toggle Station Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#00f0ff]" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* 360 Free-Look Exploration Mode */}
          <button
            onClick={() => toggleExplorationMode()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isExplorationMode
                ? 'bg-[#00f0ff] text-black font-semibold border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'glass-panel-subtle text-[#94a3b8] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
            }`}
            title="Toggle 360-degree Laboratory Free-Look"
            aria-label="Toggle 360-degree free-look exploration mode"
          >
            <Compass className={`w-3.5 h-3.5 ${isExplorationMode ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isExplorationMode ? 'Exit Free-Look' : '360° Explore'}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl glass-panel-subtle text-[#94a3b8] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleReducedMotion}
            className={`p-2 rounded-xl glass-panel-subtle transition-colors ${
              isReducedMotion ? 'text-[#00f0ff] border-[#00f0ff]' : 'text-[#94a3b8] hover:text-[#00f0ff]'
            }`}
            title={isReducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            aria-label="Toggle reduced motion mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Station Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-sm mx-auto glass-panel p-3 rounded-2xl border border-[#00f0ff]/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
          {/* Explicit Back to Gate Option for Mobile */}
          <button
            onClick={() => {
              jumpToSection('gate');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-xs font-mono text-[#00f0ff] transition-all"
          >
            <span className="flex items-center gap-2 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Entrance Gate</span>
            </span>
            <span className="text-[10px] text-[#94a3b8]">Sector 00</span>
          </button>

          <div className="text-[11px] font-mono text-[#64748b] px-2 py-0.5 uppercase tracking-wider">
            Jump to Station:
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {portfolioSections.map((sec) => {
              const isActive = activeSection === sec.id && !isExplorationMode;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    jumpToSection(sec.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                    isActive
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                      : 'bg-[#0b121e] text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff]'
                  }`}
                >
                  <div className="font-semibold text-white">{sec.label}</div>
                  <div className="text-[10px] text-[#64748b] truncate">{sec.stationName}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
