'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useTransition } from 'react';
import { SectionId } from '@/types';
import { SECTIONS, SECTION_IDS } from '@/lib/experience-config';
import { checkPrefersReducedMotion, announceToScreenReader } from '@/lib/accessibility';
import { gsap, registerGsapPlugins } from '@/lib/motion';
import { profileData } from '@/data/profile';

interface ExperienceContextType {
  activeSection: SectionId;
  activeIndex: number;
  scrollProgress: number; // 0 to 1
  doorOpenProgress: number; // 0 (closed) to 1 (fully open)
  characterFade: number; // 1 (visible) to 0 (faded)
  isExplorationMode: boolean;
  isReducedMotion: boolean;
  isMuted: boolean;
  activeProjectSlug: string | null;
  activeProjectIndex: number;
  activeAchievementId: string | null;
  isTerminalExpanded: boolean;
  hasWebGl: boolean;
  isReady: boolean;
  activeSkillCategoryId: string;
  isSkillsPanelOpen: boolean;
  terminalHistory: { cmd: string; output: string | string[] }[];
  selectedTerminalPrompt: string;
  // Actions
  setActiveSection: (id: SectionId) => void;
  setScrollProgress: (progress: number) => void;
  setDoorOpenProgress: (val: number) => void;
  setCharacterFade: (val: number) => void;
  setIsTerminalExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  toggleExplorationMode: (enabled?: boolean) => void;
  toggleReducedMotion: () => void;
  toggleMute: () => void;
  setActiveProjectSlug: (slug: string | null) => void;
  setActiveProjectIndex: (index: number) => void;
  setActiveAchievementId: (id: string | null) => void;
  setActiveSkillCategoryId: (id: string) => void;
  setIsSkillsPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  runTerminalCommand: (cmd: string) => void;
  jumpToSection: (id: SectionId) => void;
  nextSection: () => void;
  prevSection: () => void;
  setIsReady: (ready: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>('gate');
  const [scrollProgress, setScrollProgressState] = useState<number>(0);
  const [doorOpenProgress, setDoorOpenProgress] = useState<number>(0);
  const [characterFade, setCharacterFade] = useState<number>(1);
  const [isExplorationMode, setIsExplorationMode] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [activeAchievementId, setActiveAchievementId] = useState<string | null>(null);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState<boolean>(false);
  const [hasWebGl, setHasWebGl] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [activeSkillCategoryId, setActiveSkillCategoryIdState] = useState<string>('languages');
  const [isSkillsPanelOpen, setIsSkillsPanelOpen] = useState<boolean>(true);
  const [selectedTerminalPrompt, setSelectedTerminalPrompt] = useState<string>('about');
  const [terminalHistory, setTerminalHistory] = useState<
    { cmd: string; output: string | string[] }[]
  >([
    {
      cmd: 'about',
      output: [
        'Nikhil Singh — Computer Science Engineering student & aspiring software engineer / full-stack developer.',
        'Learning, experimenting, and building practical projects across web and mobile technologies.',
        'Philosophy: Strong engineering fundamentals, clean modular code, and creating genuinely useful products.'
      ]
    }
  ]);
  const [, startTransition] = useTransition();

  const activeIndex = SECTION_IDS.indexOf(activeSection);

  // Initialize plugins, reduced motion, and WebGL support on mount
  useEffect(() => {
    registerGsapPlugins();
    setIsReducedMotion(checkPrefersReducedMotion());

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGl(!!gl);
    } catch {
      setHasWebGl(false);
    }
  }, []);

  const setActiveSection = useCallback((id: SectionId) => {
    setActiveSectionState(id);
    const sec = SECTIONS.find((s) => s.id === id);
    if (sec) {
      announceToScreenReader(`Arrived at ${sec.label}: ${sec.stationName}`);
    }
  }, []);

  const setActiveSkillCategoryId = useCallback((id: string) => {
    setActiveSkillCategoryIdState(id);
    announceToScreenReader(`Selected skills category: ${id}`);
  }, []);

  const runTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setTerminalHistory([]);
      setSelectedTerminalPrompt('');
      return;
    }

    const match = profileData.terminalPrompts.find(
      (p: { command: string }) => p.command.toLowerCase() === trimmed
    );

    if (match) {
      setSelectedTerminalPrompt(match.command);
      setTerminalHistory((prev) => [...prev, { cmd: match.command, output: match.output }]);
      announceToScreenReader(`Terminal output for ${match.command} updated.`);
    } else {
      setSelectedTerminalPrompt(trimmed);
      setTerminalHistory((prev) => [
        ...prev,
        {
          cmd: trimmed,
          output: `Command not recognized: "${trimmed}". Available commands: about, education, stack, focus, links, help, clear.`
        }
      ]);
      announceToScreenReader(`Command ${trimmed} not recognized.`);
    }
  }, []);

  const setScrollProgress = useCallback((progress: number) => {
    startTransition(() => {
      setScrollProgressState(progress);
      // Continuous, reversible gate opening & character dissolve logic
      if (progress <= 0.02) {
        setDoorOpenProgress(0);
        setCharacterFade(1);
      } else if (progress < 0.16) {
        const doorT = Math.min(1, Math.max(0, (progress - 0.02) / 0.12));
        setDoorOpenProgress(doorT);
        setCharacterFade(Math.max(0, 1 - doorT * 1.25));
      } else {
        setDoorOpenProgress(1);
        setCharacterFade(0);
      }
    });
  }, []);

  const toggleExplorationMode = useCallback((enabled?: boolean) => {
    setIsExplorationMode((prev) => {
      const nextVal = enabled !== undefined ? enabled : !prev;
      announceToScreenReader(
        nextVal
          ? 'Exploration mode activated. Drag to look around the 360 degree laboratory.'
          : 'Returned to cinematic timeline.'
      );
      return nextVal;
    });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const jumpToSection = useCallback((id: SectionId) => {
    const idx = SECTION_IDS.indexOf(id);
    if (idx === -1) return;

    setIsExplorationMode(false);
    setIsTerminalExpanded(false);
    setActiveSection(id);

    const scrollContainer = document.getElementById('scroll-timeline-container');
    if (scrollContainer && typeof window !== 'undefined') {
      const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
      const targetScroll = (idx / (SECTION_IDS.length - 1)) * maxScroll;

      if (isReducedMotion) {
        window.scrollTo({ top: targetScroll, behavior: 'auto' });
      } else {
        gsap.to(window, {
          scrollTo: targetScroll,
          duration: 1.1,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      }
    }
  }, [setActiveSection, isReducedMotion]);

  const nextSection = useCallback(() => {
    const currentIndex = SECTION_IDS.indexOf(activeSection);
    if (currentIndex < SECTION_IDS.length - 1) {
      jumpToSection(SECTION_IDS[currentIndex + 1]);
    }
  }, [activeSection, jumpToSection]);

  const prevSection = useCallback(() => {
    const currentIndex = SECTION_IDS.indexOf(activeSection);
    if (currentIndex > 0) {
      jumpToSection(SECTION_IDS[currentIndex - 1]);
    }
  }, [activeSection, jumpToSection]);

  return (
    <ExperienceContext.Provider
      value={{
        activeSection,
        activeIndex,
        scrollProgress,
        doorOpenProgress,
        characterFade,
        isExplorationMode,
        isReducedMotion,
        isMuted,
        activeProjectSlug,
        activeProjectIndex,
        activeAchievementId,
        isTerminalExpanded,
        hasWebGl,
        isReady,
        activeSkillCategoryId,
        isSkillsPanelOpen,
        terminalHistory,
        selectedTerminalPrompt,
        setActiveSection,
        setScrollProgress,
        setDoorOpenProgress,
        setCharacterFade,
        setIsTerminalExpanded,
        toggleExplorationMode,
        toggleReducedMotion,
        toggleMute,
        setActiveProjectSlug,
        setActiveProjectIndex,
        setActiveAchievementId,
        setActiveSkillCategoryId,
        setIsSkillsPanelOpen,
        runTerminalCommand,
        jumpToSection,
        nextSection,
        prevSection,
        setIsReady
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
