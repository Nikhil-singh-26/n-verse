'use client';

import React, { useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS } from '@/lib/experience-config';
import { Menu, X } from 'lucide-react';

export function SectionNavigation() {
  const {
    activeSection,
    jumpToSection
  } = useExperience();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Portfolio stations (skipping intro and desktop inner windows)
  const portfolioSections = SECTIONS.filter(
    (sec) => !['intro', 'about', 'resume', 'contact'].includes(sec.id)
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

        {/* Desktop Station Jump Selector Pills */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-xl bg-[#0c1017]/85 border border-white/10 backdrop-blur-md"
          aria-label="Main Portfolio Stations"
        >
          {portfolioSections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => jumpToSection(sec.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#38bdf8] text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {/* Utility Controls: Mobile Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Station Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-[#0c1017]/80 text-[#94a3b8] hover:text-white border border-white/10 transition-colors backdrop-blur-md"
            aria-label="Toggle Station Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#38bdf8]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Station Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-sm mx-auto bg-[#0c1017]/95 p-3 rounded-2xl border border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-2 backdrop-blur-md">
          <div className="text-[11px] font-mono text-[#64748b] px-2 py-0.5 uppercase tracking-wider">
            Jump to Station:
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {portfolioSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    jumpToSection(sec.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                    isActive
                      ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]'
                      : 'bg-[#121620] text-[#94a3b8] border-white/5 hover:text-white'
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
