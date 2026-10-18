'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { LoadingScreen } from './LoadingScreen';
import { WelcomeIntro } from './WelcomeIntro';
import { SectionNavigation } from './SectionNavigation';
import { ScrollTimeline } from './ScrollTimeline';
import { PortfolioCanvas } from '../scene/PortfolioCanvas';
import { WebGLFallback } from './WebGLFallback';
import { ProgressIndicator } from './ProgressIndicator';
import { SkipControl } from './SkipControl';
import { LeetCodeInspectionModal } from '../overlays/LeetCodeInspectionModal';

export function ExperienceController() {
  const { hasWebGl, isIntroFinished } = useExperience();

  if (!hasWebGl) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#0e121a] overflow-x-hidden">
      {/* Initial Asset Loader */}
      <LoadingScreen />

      {/* Opening Cinematic Black Screen & GSAP Welcome Animation */}
      <WelcomeIntro />

      {/* Persistent 3D Study Room Scene */}
      <PortfolioCanvas />

      {/* Scroll Timeline Driver */}
      <ScrollTimeline />

      {/* Refined Navigation & HUD Controls (Revealed after intro) */}
      {isIntroFinished && (
        <>
          <SectionNavigation />
          <ProgressIndicator />
          <SkipControl />
        </>
      )}

      {/* Fullscreen LeetCode Inspection Lightbox Modal */}
      <LeetCodeInspectionModal />
    </div>
  );
}
