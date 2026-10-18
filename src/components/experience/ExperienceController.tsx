'use client';

import React from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { LoadingScreen } from './LoadingScreen';
import { SectionNavigation } from './SectionNavigation';
import { ScrollTimeline } from './ScrollTimeline';
import { PortfolioCanvas } from '../scene/PortfolioCanvas';
import { WebGLFallback } from './WebGLFallback';
import { WelcomeOverlay } from '../overlays/WelcomeOverlay';
import { TerminalPanel } from '../overlays/TerminalPanel';
import { SkillsPanel } from '../overlays/SkillsPanel';
import { ProjectShowcase } from '../overlays/ProjectShowcase';
import { AchievementPanel } from '../overlays/AchievementPanel';
import { ContactPanel } from '../overlays/ContactPanel';
import { ProgressIndicator } from './ProgressIndicator';
import { SkipControl } from './SkipControl';
import { ExplorationControls } from './ExplorationControls';

export function ExperienceController() {
  const { hasWebGl } = useExperience();

  if (!hasWebGl) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#05070b] overflow-x-hidden">
      {/* Initial Asset Loader */}
      <LoadingScreen />

      {/* Persistent Navigation Header */}
      <SectionNavigation />

      {/* Persistent 3D Three.js Laboratory Scene */}
      <PortfolioCanvas />

      {/* Scroll Timeline Driver */}
      <ScrollTimeline />

      {/* Synchronized Section Overlays */}
      <WelcomeOverlay />
      <TerminalPanel />
      <SkillsPanel />
      <ProjectShowcase />
      <AchievementPanel />
      <ContactPanel />

      {/* Persistent HUD & Skip Controls */}
      <ProgressIndicator />
      <SkipControl />
      <ExplorationControls />
    </div>
  );
}
