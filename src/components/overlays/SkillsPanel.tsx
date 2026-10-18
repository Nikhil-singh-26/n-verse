'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { skillCategories } from '@/data/skills';
import {
  Code2,
  Layout,
  Server,
  Database,
  Smartphone,
  Wrench,
  Globe,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Cloud
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4" />,
  frontend: <Layout className="w-4 h-4" />,
  graphics3d: <Sparkles className="w-4 h-4" />,
  backend: <Server className="w-4 h-4" />,
  databases: <Database className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  cloud: <Cloud className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />
};

const skillToIconMap: Record<string, string> = {
  'Java': 'java',
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'C': 'c',
  'Dart': 'dart',
  'HTML5': 'html5',
  'CSS3': 'css3',
  'Tailwind CSS': 'tailwindcss',
  'Bootstrap': 'bootstrap',
  'React.js': 'react',
  'Next.js': 'nextjs',
  'GSAP': 'gsap',
  'Three.js': 'threejs',
  'React Three Fiber': 'r3f',
  'Drei': 'drei',
  'Node.js': 'nodejs',
  'Express.js': 'express',
  'MongoDB': 'mongodb',
  'Mongoose': 'mongoose',
  'PostgreSQL': 'postgresql',
  'Flutter': 'flutter',
  'Firebase': 'firebase',
  'Vercel': 'vercel',
  'Render': 'render',
  'Git': 'git',
  'GitHub': 'github',
  'VS Code': 'vscode',
  'Android Studio': 'androidstudio',
  'Postman': 'postman'
};

export function SkillsPanel() {
  const {
    activeSection,
    activeSkillCategoryId,
    setActiveSkillCategoryId,
    isSkillsPanelOpen,
    setIsSkillsPanelOpen
  } = useExperience();

  if (activeSection !== 'skills') return null;

  const currentCategory =
    skillCategories.find((c) => c.id === activeSkillCategoryId) || skillCategories[0];

  // If user minimized the panel to observe the 3D planet in full view
  if (!isSkillsPanelOpen) {
    return (
      <div className="fixed bottom-20 right-6 sm:right-8 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => setIsSkillsPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-mono text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-[#00f0ff] transition-all hover:scale-105 active:scale-95"
          aria-label="Show skills details panel"
        >
          <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Show Skills Matrix</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Skills and Technical Stack Matrix"
      className="fixed inset-y-0 right-0 sm:right-6 md:right-8 pointer-events-none flex items-center justify-end p-4 sm:p-0 z-20"
    >
      <div className="w-full max-w-md sm:max-w-lg glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl pointer-events-auto border border-[#00f0ff]/30 animate-in fade-in slide-in-from-right-6 duration-400 max-h-[85vh] flex flex-col backdrop-blur-md">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
              <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-wide">
                Technical Skills Planet
              </h2>
              <p className="text-[11px] font-mono text-[#94a3b8]">
                Interactive 3D Orbital Stack Core
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSkillCategoryId('languages')}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors"
              title="Reset to Core Languages"
              aria-label="Reset to default category"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsSkillsPanelOpen(false)}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors"
              title="Minimize panel to view 3D Planet"
              aria-label="Hide skills panel"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 Category Tabs - Keyboard accessible & Touch friendly */}
        <div
          role="tablist"
          aria-label="Skill categories"
          className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-4"
        >
          {skillCategories.map((cat) => {
            const isActive = cat.id === activeSkillCategoryId;
            return (
              <button
                key={cat.id}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                onClick={() => setActiveSkillCategoryId(cat.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-mono transition-all border outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                  isActive
                    ? 'bg-[#00f0ff]/20 text-white border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)] font-semibold'
                    : 'bg-[#0b121e]/80 text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
                }`}
                title={cat.title}
              >
                <span className={isActive ? 'text-[#00f0ff]' : 'text-[#64748b]'}>
                  {categoryIcons[cat.id]}
                </span>
                <span className="text-[10px] mt-1 truncate max-w-full">
                  {cat.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Content Box */}
        <div
          role="tabpanel"
          id={`panel-${currentCategory.id}`}
          aria-labelledby={`tab-${currentCategory.id}`}
          className="bg-[#070b12] rounded-xl p-4 border border-[#00f0ff]/15 flex-1 overflow-y-auto space-y-4"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <h3>{currentCategory.title}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                {currentCategory.skills.length} Technologies
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] font-mono mt-1.5 leading-relaxed">
              {currentCategory.description}
            </p>
          </div>

          {/* Technology Badges Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
              Verified Technologies:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentCategory.skills.map((skill, sIdx) => {
                const icon = skillToIconMap[skill];
                return (
                  <div
                    key={`skill-${sIdx}`}
                    className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-[#e2e8f0] text-xs font-mono border border-[#00f0ff]/25 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all flex items-center gap-2 shadow-sm hover:scale-105"
                  >
                    {icon ? (
                      <img
                        src={`/skills/${icon}.svg`}
                        alt={skill}
                        className="w-4 h-4 object-contain"
                      />
                    ) : (
                      <span className="text-[#00f0ff] text-xs font-bold">&bull;</span>
                    )}
                    <span>{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Footer verification note */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-[10px] text-[#64748b] font-mono">
            <span>Verified in project code & coursework</span>
            <span className="text-[#00f0ff]/70">Nikhil Singh &bull; CSE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
