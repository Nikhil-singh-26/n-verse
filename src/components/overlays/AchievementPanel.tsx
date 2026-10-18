'use client';

import React, { useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { achievementsData } from '@/data/achievements';
import {
  Award,
  GraduationCap,
  Code,
  Trophy,
  Briefcase,
  ExternalLink,
  RotateCcw,
  CheckCircle,
  Clock
} from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  education: <GraduationCap className="w-4 h-4 text-[#00f0ff]" />,
  certification: <Award className="w-4 h-4 text-[#38bdf8]" />,
  hackathon: <Trophy className="w-4 h-4 text-amber-400" />,
  milestone: <Code className="w-4 h-4 text-emerald-400" />,
  experience: <Briefcase className="w-4 h-4 text-purple-400" />
};

export function AchievementPanel() {
  const { activeSection, activeAchievementId, setActiveAchievementId } = useExperience();
  const [filterType, setFilterType] = useState<string>('all');

  if (activeSection !== 'achievements') return null;

  const filteredItems =
    filterType === 'all'
      ? achievementsData
      : achievementsData.filter((item) => item.type === filterType);

  const handleScrollIsolation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const categories = [
    { id: 'all', label: 'All Records' },
    { id: 'education', label: 'Education' },
    { id: 'certification', label: 'Certifications' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'milestone', label: 'Milestones' }
  ];

  return (
    <aside
      aria-label="Achievements and Timeline Telemetry"
      className="fixed inset-y-0 right-0 sm:right-6 md:right-8 pointer-events-none flex items-center justify-end p-4 sm:p-0 z-20"
    >
      <div className="w-full max-w-lg sm:max-w-xl glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl pointer-events-auto border border-[#00f0ff]/30 animate-in fade-in slide-in-from-right-8 duration-400 max-h-[85vh] flex flex-col backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#00f0ff]/20 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#00f0ff]" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] tracking-wide">
                Telemetry & Milestone Timeline
              </h2>
            </div>
            <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">
              Verified Academic, Technical & Project Milestones
            </p>
          </div>

          {activeAchievementId && (
            <button
              onClick={() => setActiveAchievementId(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-[#94a3b8] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors border border-[#1e293b]"
              title="Clear Selected Milestone"
              aria-label="Clear selection"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div role="tablist" aria-label="Achievement categories" className="flex items-center gap-1.5 py-3 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filterType === c.id}
              onClick={() => setFilterType(c.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all border outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                filterType === c.id
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                  : 'bg-[#0b121e]/80 text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Timeline Items List with Isolated Scrolling */}
        <div
          onWheel={handleScrollIsolation}
          onTouchMove={handleScrollIsolation}
          className="py-2 overflow-y-auto space-y-3 flex-1 pr-1"
        >
          {filteredItems.map((item) => {
            const isSelected = activeAchievementId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveAchievementId(isSelected ? null : item.id)}
                className={`rounded-xl p-4 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0a1829] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)] scale-[1.01]'
                    : 'bg-[#070b12]/90 border-[#00f0ff]/15 hover:border-[#00f0ff]/40 hover:bg-[#09101d]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#111927] border border-[#1e293b] flex-shrink-0">
                      {typeIcons[item.type] || <Award className="w-4 h-4 text-[#00f0ff]" />}
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${
                        isSelected ? 'text-[#00f0ff]' : 'text-white'
                      }`}>
                        {item.title}
                      </h3>
                      <div className="text-[11px] font-mono text-[#94a3b8]">
                        {item.organization}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111927] text-[#38bdf8] border border-[#1e293b]">
                      {item.period}
                    </span>
                    {item.status && (
                      <span className="text-[9px] font-mono text-[#64748b]">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#cbd5e1] leading-relaxed pl-10 pt-2">
                  {item.description}
                </p>

                <div className="pl-10 pt-2 flex flex-wrap items-center justify-between gap-2">
                  {item.badge && (
                    <span className="text-[10px] font-mono text-[#00f0ff] tracking-wider uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </span>
                  )}

                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#38bdf8] hover:text-[#00f0ff] underline transition-colors"
                      aria-label={`Open verified credential for ${item.title}`}
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer verification note */}
        <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#64748b] font-mono">
          <span>Verified records &bull; No fabricated credentials</span>
          <span className="text-[#00f0ff]/70">Nikhil Singh &bull; GEC Bilaspur</span>
        </div>
      </div>
    </aside>
  );
}
