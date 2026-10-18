'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { projectsData } from '@/data/projects';
import { ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, X, FileText, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export function Projector() {
  const {
    activeSection,
    activeProjectIndex,
    setActiveProjectIndex,
    activeProjectSlug,
    setActiveProjectSlug,
    isReducedMotion
  } = useExperience();

  const isProjects = activeSection === 'projects';
  const currentProject = projectsData[activeProjectIndex] || projectsData[0];
  const detailedProject = projectsData.find((p) => p.slug === activeProjectSlug);

  const nextProject = () => {
    if (activeProjectIndex < projectsData.length - 1) {
      setActiveProjectIndex(activeProjectIndex + 1);
    }
  };

  const prevProject = () => {
    if (activeProjectIndex > 0) {
      setActiveProjectIndex(activeProjectIndex - 1);
    }
  };

  return (
    <group>
      {/* Soft Gallery Spotlight Focused on Left Wall Architectural Presentation */}
      <spotLight
        position={[-1.8, 3.8, 0.8]}
        target-position={[-4.96, 2.1, 0.8]}
        color="#f0f9ff"
        intensity={isProjects ? 2.8 : 0.4}
        angle={0.65}
        penumbra={0.5}
        distance={10}
      />

      {/* ================= PROJECTION ON LEFT WALL ================= */}
      <group position={[-4.96, 2.1, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Active Projection Screen Area */}
        <Html
          transform
          distanceFactor={1.42}
          position={[0, 0, 0.01]}
          className="pointer-events-auto select-none"
        >
          <div className="w-[840px] h-[480px] flex flex-col justify-between p-7 text-white font-sans overflow-hidden">
            {!isProjects ? (
              /* Idle Wall Standby State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 opacity-40">
                <div className="font-mono text-xs uppercase tracking-widest text-[#78716c]">
                  ARCHITECTURAL PROJECTION WALL // STANDBY
                </div>
                <div className="text-[11px] font-mono text-[#a8a29e]">
                  Scroll into Projects section to illuminate projector and present verified works.
                </div>
              </div>
            ) : (
              /* Active Sequential Project Presentation */
              <div className="flex-1 flex flex-col justify-between bg-[#0a0f18]/92 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-400">
                {/* Header: Project Index & Category */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-ping" />
                    <span className="font-mono text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                      PROJECT {activeProjectIndex + 1} OF {projectsData.length}
                    </span>
                    <span className="text-white/30">&bull;</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-white/90">
                      {currentProject.category}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {currentProject.status}
                    </span>
                  </div>

                  {/* Navigation Arrows for Sequential Presentation */}
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <button
                      onClick={prevProject}
                      disabled={activeProjectIndex === 0}
                      className={`p-1.5 rounded-lg border transition-all ${
                        activeProjectIndex > 0
                          ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                          : 'border-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      aria-label="Previous Project"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-[#94a3b8] px-1">
                      {activeProjectIndex + 1} / {projectsData.length}
                    </span>
                    <button
                      onClick={nextProject}
                      disabled={activeProjectIndex === projectsData.length - 1}
                      className={`p-1.5 rounded-lg border transition-all ${
                        activeProjectIndex < projectsData.length - 1
                          ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                          : 'border-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      aria-label="Next Project"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Project Typography & Visual Content */}
                <div className="py-4 space-y-3.5 flex-1">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                      {currentProject.title}
                    </h3>
                    <p className="text-sm font-mono text-[#38bdf8] mt-0.5">
                      {currentProject.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-[#cbd5e1] leading-relaxed max-w-2xl">
                    {currentProject.purpose}
                  </p>

                  {/* Key Verified Functionality */}
                  <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] block">
                      Core Implementation Highlights:
                    </span>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-[#cbd5e1]">
                      {currentProject.keyFunctionality.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies Implemented */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-mono text-[#64748b] mr-1">Stack:</span>
                    {currentProject.technologies.map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-[#94a3b8] border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls & Direct Links */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {(currentProject.repositoryUrl || currentProject.links.github) && (
                      <a
                        href={currentProject.repositoryUrl || currentProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141a24] hover:bg-[#1e2634] text-xs font-mono text-white border border-white/15 hover:border-white/30 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {(currentProject.liveDemoUrl || currentProject.links.live) && (
                      <a
                        href={currentProject.liveDemoUrl || currentProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38bdf8]/20 hover:bg-[#38bdf8]/30 text-xs font-mono text-[#38bdf8] hover:text-white border border-[#38bdf8]/40 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveProjectSlug(currentProject.slug)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-white text-black font-semibold text-xs font-mono transition-all shadow-md"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Case Study Details</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* ================= STANDALONE CASE STUDY MODAL ================= */}
      {detailedProject && (
        <Html fullscreen className="z-50 pointer-events-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detailed Case Study: ${detailedProject.title}`}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <div className="w-full max-w-2xl bg-[#0e1420] border border-white/20 rounded-2xl p-6 sm:p-8 max-h-[88vh] overflow-y-auto space-y-5 text-white shadow-2xl relative">
              <button
                onClick={() => setActiveProjectSlug(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#cbd5e1] hover:text-white transition-colors"
                aria-label="Return to Projector"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
                    {detailedProject.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#94a3b8]">
                    {detailedProject.status}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                  {detailedProject.title}
                </h2>
                <p className="text-sm font-mono text-[#94a3b8] mt-0.5">
                  {detailedProject.tagline}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                <div className="bg-[#080d16] p-4 rounded-xl border border-white/10">
                  <h4 className="font-mono text-xs font-bold text-[#38bdf8] uppercase mb-1">
                    Problem Statement
                  </h4>
                  <p>{detailedProject.details.problemStatement}</p>
                </div>

                <div className="bg-[#080d16] p-4 rounded-xl border border-white/10">
                  <h4 className="font-mono text-xs font-bold text-[#38bdf8] uppercase mb-1">
                    Architecture & Implementation Status
                  </h4>
                  <p>{detailedProject.details.architectureOverview}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-xs font-bold text-white uppercase">
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {detailedProject.details.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#cbd5e1]">
                        <span className="text-[#38bdf8]">&bull;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 font-mono text-xs">
                <div className="flex gap-2">
                  {detailedProject.links.github && (
                    <a
                      href={detailedProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Code</span>
                    </a>
                  )}
                  {detailedProject.links.live && (
                    <a
                      href={detailedProject.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38bdf8]/20 text-[#38bdf8] hover:bg-[#38bdf8]/30 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActiveProjectSlug(null)}
                  className="px-4 py-2 rounded-xl bg-[#38bdf8] text-black font-semibold hover:bg-white transition-colors"
                >
                  Return to Room (Esc)
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
