'use client';

import React, { useEffect } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { projectsData } from '@/data/projects';
import { ExternalLink, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

export function ProjectHUD() {
  const {
    activeSection,
    activeProjectIndex,
    setActiveProjectIndex,
    projectPageState,
    setProjectPageState,
    setProjectPresentationState,
    setIsProjectAnimating,
    isProjectAnimating
  } = useExperience();

  if (activeSection !== 'projects') {
    return null;
  }

  const currentProject = projectsData[activeProjectIndex] || projectsData[0];

  const goToProject = (idx: number) => {
    if (idx === activeProjectIndex || isProjectAnimating || projectPageState === 'animating') return;
    setActiveProjectIndex(idx);
    setProjectPresentationState(`PROJECT_${idx + 1}`);
    setProjectPageState('animating');
    setIsProjectAnimating(true);
  };

  const handleNext = () => {
    if (activeProjectIndex < projectsData.length - 1 && !isProjectAnimating && projectPageState !== 'animating') {
      goToProject(activeProjectIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeProjectIndex > 0 && !isProjectAnimating && projectPageState !== 'animating') {
      goToProject(activeProjectIndex - 1);
    }
  };

  // Keyboard navigation for left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSection !== 'projects') return;
      if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, activeProjectIndex, isProjectAnimating, projectPageState]);

  return (
    <div className="fixed top-14 sm:top-5 right-3 sm:right-6 z-40 pointer-events-auto select-none max-w-[95vw] animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-[#0c121d]/90 backdrop-blur-md border border-amber-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.65)] text-white">
        {/* Project Folio & Title */}
        <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-white/10 font-mono">
          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">
              Folio 0{activeProjectIndex + 1} / 0{projectsData.length}
            </span>
            <span className="text-white text-xs font-bold truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[160px]">
              {currentProject.title}
            </span>
          </div>
        </div>

        {/* 4 Direct Project Folio Selector Pills */}
        <div className="flex items-center gap-1">
          {projectsData.map((p, idx) => {
            const isCur = idx === activeProjectIndex;
            return (
              <button
                key={p.id}
                onClick={() => goToProject(idx)}
                disabled={isProjectAnimating || projectPageState === 'animating'}
                title={`Folio 0${idx + 1}: ${p.title}`}
                className={`px-2 py-1.5 sm:py-1 rounded-md text-[11px] font-mono font-bold transition-all touch-manipulation disabled:opacity-50 ${
                  isCur
                    ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    : 'bg-white/5 text-[#94a3b8] hover:text-white hover:bg-white/15'
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Prev & Next Arrow Controls for Switching Projects (Top Right) */}
        <div className="flex items-center gap-1 pl-1 border-l border-white/10">
          <button
            onClick={handlePrev}
            disabled={activeProjectIndex === 0 || isProjectAnimating || projectPageState === 'animating'}
            className="p-2 sm:p-1.5 min-w-[34px] min-h-[34px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white disabled:opacity-30 disabled:border-white/5 disabled:hover:bg-white/5 disabled:cursor-not-allowed transition-all active:scale-95 touch-manipulation"
            title="Previous Project (Arrow Left)"
            aria-label="Previous Project Folio"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeProjectIndex === projectsData.length - 1 || isProjectAnimating || projectPageState === 'animating'}
            className="p-2 sm:p-1.5 min-w-[34px] min-h-[34px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white disabled:opacity-30 disabled:border-white/5 disabled:hover:bg-white/5 disabled:cursor-not-allowed transition-all active:scale-95 touch-manipulation"
            title="Next Project (Arrow Right)"
            aria-label="Next Project Folio"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Links: GitHub & Live App */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10">
          {(currentProject.repositoryUrl || currentProject.links?.github) && (
            <a
              href={currentProject.repositoryUrl || currentProject.links?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#94a3b8] hover:text-white transition-colors"
              title="Examine Source Code"
            >
              <GithubIcon className="w-3.5 h-3.5 text-amber-300" />
            </a>
          )}
          {(currentProject.liveDemoUrl || currentProject.links?.live) && (
            <a
              href={currentProject.liveDemoUrl || currentProject.links?.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 hover:text-white transition-colors"
              title="Observe Live Application"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

