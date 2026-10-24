'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { gsap, registerGsapPlugins } from '@/lib/motion';
import { ArrowRight, CornerDownRight } from 'lucide-react';

export function WelcomeIntro() {
  const { isIntroFinished, setIsIntroFinished, isReducedMotion, jumpToSection } = useExperience();

  const overlayRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const thresholdSeamRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const [hasEntered, setHasEntered] = useState(false);

  // Transition into the 3D studio room
  const handleEnterStudio = useCallback(() => {
    if (hasEntered) return;
    setHasEntered(true);
    jumpToSection('room');

    if (!overlayRef.current || isReducedMotion) {
      setIsIntroFinished(true);
      return;
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsIntroFinished(true);
      }
    });

    // Threshold light seam expands outward like studio doorway opening
    if (thresholdSeamRef.current) {
      exitTl.to(
        thresholdSeamRef.current,
        {
          scaleX: 28,
          opacity: 0.9,
          duration: 0.65,
          ease: 'power2.in'
        },
        0
      );
    }

    // Door panels part horizontally to reveal the live 3D room behind
    if (leftDoorRef.current && rightDoorRef.current) {
      exitTl.to(
        leftDoorRef.current,
        {
          xPercent: -102,
          duration: 0.95,
          ease: 'power3.inOut'
        },
        0.1
      );
      exitTl.to(
        rightDoorRef.current,
        {
          xPercent: 102,
          duration: 0.95,
          ease: 'power3.inOut'
        },
        0.1
      );
    }

    // Title elements fade cleanly
    if (titleGroupRef.current) {
      exitTl.to(
        titleGroupRef.current,
        {
          opacity: 0,
          scale: 0.98,
          duration: 0.5,
          ease: 'power2.in'
        },
        0.05
      );
    }

    // Full overlay dissolve
    exitTl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      },
      0.35
    );
  }, [hasEntered, isReducedMotion, jumpToSection, setIsIntroFinished]);

  // Keyboard accessibility: Enter or Space triggers entry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasEntered || isIntroFinished) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleEnterStudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, isIntroFinished, handleEnterStudio]);

  // Elegant, calm opening sequence (~1.1s total)
  useEffect(() => {
    registerGsapPlugins();

    if (isReducedMotion) {
      return;
    }

    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Threshold light seam awakens
    if (thresholdSeamRef.current) {
      introTl.fromTo(
        thresholdSeamRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.85, duration: 0.9, ease: 'power2.out' },
        0.15
      );
    }

    // 2. Title group settles into place
    if (titleGroupRef.current) {
      introTl.fromTo(
        titleGroupRef.current,
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95 },
        0.35
      );
    }

    // 3. CTA button reveals with subtle readiness
    if (ctaRef.current) {
      introTl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.75
      );
    }

    // Gentle auto-advance timer (~4.8s) so visitors who simply look are smoothly transitioned
    const autoAdvanceTimer = setTimeout(() => {
      handleEnterStudio();
    }, 4800);

    return () => {
      clearTimeout(autoAdvanceTimer);
      introTl.kill();
    };
  }, [isReducedMotion, handleEnterStudio]);

  if (isIntroFinished) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#080b12] text-white select-none overflow-hidden"
      aria-label="Studio Threshold Entrance"
      role="dialog"
      aria-modal="true"
    >
      {/* ================= ARCHITECTURAL STUDIO THRESHOLD DOORS ================= */}
      {/* Left Threshold Panel */}
      <div
        ref={leftDoorRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#080b12] border-r border-white/5 pointer-events-none z-10"
      />
      {/* Right Threshold Panel */}
      <div
        ref={rightDoorRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#080b12] border-l border-white/5 pointer-events-none z-10"
      />

      {/* Vertical Threshold Light Seam (Narrow architectural line of warm-white & cyan light) */}
      <div
        ref={thresholdSeamRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-full pointer-events-none z-15 origin-center"
        style={{
          background: 'linear-gradient(180deg, rgba(0,240,255,0) 0%, rgba(0,240,255,0.7) 35%, rgba(255,255,255,0.95) 50%, rgba(0,240,255,0.7) 65%, rgba(0,240,255,0) 100%)',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.45)'
        }}
      />

      {/* ================= BLUEPRINT / ARCHITECTURAL ALIGNMENT MARKS ================= */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Corner registration marks */}
        <div className="absolute top-5 left-5 text-white/15 font-mono text-xs select-none">┌</div>
        <div className="absolute top-5 right-5 text-white/15 font-mono text-xs select-none">┐</div>
        <div className="absolute bottom-5 left-5 text-white/15 font-mono text-xs select-none">└</div>
        <div className="absolute bottom-5 right-5 text-white/15 font-mono text-xs select-none">┘</div>

        <div className="hidden md:flex absolute bottom-5 right-12 items-center gap-2 text-[10px] font-mono text-white/30 tracking-widest uppercase">
          <span>PRESS ENTER OR CLICK TO CONTINUE</span>
          <CornerDownRight className="w-3 h-3 text-white/40" />
        </div>
      </div>

      {/* ================= TOP NAVIGATION / WORDMARK & DISCREET SKIP ================= */}
      <header className="absolute top-0 inset-x-0 z-30 p-5 sm:p-8 flex justify-between items-center max-w-7xl mx-auto">
        {/* Understated N/VERSE Wordmark */}
        <div className="flex items-center gap-2.5 font-['Outfit'] text-xs sm:text-sm font-semibold tracking-[0.2em] text-white/80 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
          <span>
            N<span className="text-[#00f0ff]">/</span>VERSE
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-normal text-white/40 tracking-widest pl-2 border-l border-white/10">
            STUDIO
          </span>
        </div>

        {/* Discreet Secondary Skip Control */}
        <button
          type="button"
          onClick={handleEnterStudio}
          className="text-xs font-mono text-white/50 hover:text-white border border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/8 rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00f0ff] cursor-pointer active:scale-95"
          aria-label="Skip introduction and enter studio"
        >
          Skip intro
        </button>
      </header>

      {/* ================= MAIN EDITORIAL CONTENT HIERARCHY ================= */}
      <main className="relative z-30 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <div
          ref={titleGroupRef}
          className="max-w-2xl mx-auto flex flex-col items-center gap-4 sm:gap-6"
        >
          {/* Subtle Architectural Category Marker */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-white/10 bg-white/3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#00f0ff]/90">
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]" />
            <span>THRESHOLD // 01</span>
          </div>

          {/* Strong Primary Wordmark Treatment */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight font-['Outfit'] text-[#f8fafc] leading-none select-none">
            N<span className="text-[#00f0ff] font-light">/</span>VERSE
          </h1>

          {/* Developer Identity */}
          <div className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.3em] text-[#94a3b8] font-medium">
            NIKHIL SINGH
          </div>

          {/* First-person Supporting Line (Supported by repository profile data) */}
          <p className="text-sm sm:text-base text-[#cbd5e1] max-w-md mx-auto font-light leading-relaxed pt-1">
            I build interactive digital experiences and software systems.
          </p>

          {/* Subtle Primary "Enter the studio" Action */}
          <div className="pt-3 sm:pt-5">
            <button
              ref={ctaRef}
              type="button"
              onClick={handleEnterStudio}
              className="group relative inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/20 bg-white/6 hover:bg-white/1.2 hover:border-[#00f0ff]/60 text-xs sm:text-sm font-mono text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_24px_rgba(0,240,255,0.22)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
              aria-label="Enter the 3D studio experience"
            >
              <span className="tracking-wider">Enter the studio</span>
              <ArrowRight className="w-4 h-4 text-[#00f0ff] transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
