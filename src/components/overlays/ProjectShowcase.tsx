'use client';

import React, { useEffect } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { projectsData } from '@/data/projects';
import { ProjectData } from '@/types';
import { ExternalLink, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export function ProjectShowcase() {
  const {
    activeSection,
    activeProjectSlug,
    setActiveProjectSlug,
    activeProjectIndex,
    setActiveProjectIndex
  } = useExperience();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProjectSlug) {
        setActiveProjectSlug(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectSlug, setActiveProjectSlug]);

  if (activeSection !== 'projects') return null;

  const currentProject = projectsData[activeProjectIndex] || projectsData[0];
  const detailedProject: ProjectData | undefined = projectsData.find(
    (p) => p.slug === activeProjectSlug
  );

  const handleScrollIsolation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Wall Projection HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 z-20">
        <div
          role="region"
          aria-label="Cinematic Project Showcase"
          className="w-full max-w-4xl glass-panel rounded-2xl p-5 sm:p-7 shadow-2xl pointer-events-auto border border-[#00f0ff]/30 animate-in fade-in zoom-in-95 duration-400 max-h-[88vh] flex flex-col backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#00f0ff]/20 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tracking-wide">
                  Cinematic Project Showcase
                </h2>
              </div>
              <p className="text-xs font-mono text-[#94a3b8] mt-0.5">
                Volumetric Projection // Verified Engineering Solutions
              </p>
            </div>

            {/* Quick Project Switcher Pills */}
            <div role="tablist" aria-label="Project list" className="flex items-center gap-1.5 flex-wrap">
              {projectsData.map((proj, idx) => {
                const isSelected = activeProjectIndex === idx;
                return (
                  <button
                    key={proj.id}
                    role="tab"
                    id={`tab-project-${proj.id}`}
                    aria-selected={isSelected}
                    onClick={() => setActiveProjectIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                      isSelected
                        ? 'bg-[#00f0ff]/20 text-white border-[#00f0ff] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-[#0b121e]/80 text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
                    }`}
                  >
                    {proj.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Project Card Content with Isolated Scroll */}
          <div
            onWheel={handleScrollIsolation}
            onTouchMove={handleScrollIsolation}
            className="py-5 overflow-y-auto space-y-4 flex-1 pr-1"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 uppercase tracking-wider">
                    {currentProject.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111927] text-[#94a3b8] border border-[#1e293b]">
                    {currentProject.status}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-['Outfit']">
                  {currentProject.title}
                </h3>
                <p className="text-xs font-mono text-[#38bdf8] mt-0.5">
                  {currentProject.tagline}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                {(currentProject.repositoryUrl || currentProject.links.github) && (
                  <a
                    href={currentProject.repositoryUrl || currentProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-xs font-mono text-white border border-[#1e293b] hover:border-[#00f0ff]/50 transition-colors shadow-sm"
                    aria-label={`View ${currentProject.title} repository`}
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Repository</span>
                  </a>
                )}
                {(currentProject.liveDemoUrl || currentProject.links.live) && (
                  <a
                    href={currentProject.liveDemoUrl || currentProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 transition-colors shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    aria-label={`Open ${currentProject.title} demo`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo Link</span>
                  </a>
                )}
              </div>
            </div>

            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              {currentProject.purpose}
            </p>

            {/* Key Functionality List */}
            <div className="space-y-2 bg-[#060a12]/90 p-4 rounded-xl border border-[#00f0ff]/15">
              <div className="text-xs font-mono text-[#00f0ff] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Functionality & Architecture Highlights</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#94a3b8]">
                {currentProject.keyFunctionality.map((func, fIdx) => (
                  <li key={`feat-${fIdx}`} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                    <span className="text-[#cbd5e1]">{func}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div>
              <span className="text-[11px] font-mono text-[#64748b] block mb-2 uppercase tracking-wider">
                Technologies Implemented:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProject.technologies.map((tech, tIdx) => (
                  <span
                    key={`tech-${tIdx}`}
                    className="px-2.5 py-1 rounded-lg bg-[#0f172a] text-[#38bdf8] text-xs font-mono border border-[#00f0ff]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Card Navigation */}
          <div className="pt-3.5 border-t border-[#00f0ff]/15 flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748b]">
              Project {activeProjectIndex + 1} of {projectsData.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveProjectSlug(currentProject.slug)}
                className="px-3.5 py-1.5 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center gap-1.5 transition-colors font-semibold"
                aria-label={`Inspect case study for ${currentProject.title}`}
              >
                <span>Inspect Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Project Detail Modal */}
      {detailedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detailed Case Study for ${detailedProject.title}`}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
        >
          <div
            onWheel={handleScrollIsolation}
            onTouchMove={handleScrollIsolation}
            className="w-full max-w-3xl glass-panel rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-[#00f0ff]/40 shadow-2xl relative"
          >
            <button
              onClick={() => setActiveProjectSlug(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#1e293b]/70 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
                  Case Study // {detailedProject.category}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#111927] text-[#94a3b8] border border-[#1e293b]">
                  {detailedProject.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-['Outfit']">
                {detailedProject.title}
              </h2>
              <p className="text-sm font-mono text-[#94a3b8] mt-1">
                {detailedProject.tagline}
              </p>
            </div>

            <div className="space-y-4 text-sm text-[#cbd5e1] leading-relaxed">
              <div className="bg-[#0b121e] p-4 rounded-xl border border-[#00f0ff]/15">
                <h4 className="font-mono text-xs font-semibold text-[#00f0ff] uppercase tracking-wider mb-1.5">
                  Problem Statement
                </h4>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {detailedProject.details.problemStatement}
                </p>
              </div>

              <div className="bg-[#0b121e] p-4 rounded-xl border border-[#00f0ff]/15">
                <h4 className="font-mono text-xs font-semibold text-[#00f0ff] uppercase tracking-wider mb-1.5">
                  Architecture Overview & Status
                </h4>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {detailedProject.details.architectureOverview}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs font-semibold text-[#00f0ff] uppercase tracking-wider mb-2">
                  Key Technical Highlights
                </h4>
                <ul className="space-y-2">
                  {detailedProject.details.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-mono text-[#cbd5e1]">
                      <span className="text-[#00f0ff] font-bold">&rsaquo;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1e293b]">
              <div className="flex flex-wrap gap-2">
                {(detailedProject.repositoryUrl || detailedProject.links.github) && (
                  <a
                    href={detailedProject.repositoryUrl || detailedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e293b] text-xs font-mono text-white hover:border-[#00f0ff] border border-transparent transition-colors"
                  >
                    <GithubIcon className="w-4 h-4 text-[#00f0ff]" />
                    <span>View Repository</span>
                  </a>
                )}
                {(detailedProject.liveDemoUrl || detailedProject.links.live) && (
                  <a
                    href={detailedProject.liveDemoUrl || detailedProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff]/20 text-xs font-mono text-[#00f0ff] hover:bg-[#00f0ff]/30 border border-[#00f0ff]/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Live Demo</span>
                  </a>
                )}
                <Link
                  href={`/projects/${detailedProject.slug}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111927] hover:bg-[#1a2538] text-xs font-mono text-[#94a3b8] hover:text-white border border-[#1e293b] transition-colors"
                >
                  <span>Standalone Route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <button
                onClick={() => setActiveProjectSlug(null)}
                className="px-5 py-2 rounded-xl bg-[#00f0ff] text-black font-semibold text-xs font-mono hover:bg-white transition-colors"
              >
                Return to Room (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
