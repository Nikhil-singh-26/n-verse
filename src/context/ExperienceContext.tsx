'use client';

// Safe DOM removeChild patch to prevent Drei / React fast refresh NotFoundError crashes
if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
  const origRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child && child.parentNode !== this) {
      return child;
    }
    return origRemoveChild.call(this, child) as T;
  };
}

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
  doorOpenProgress: number; // backward compatibility
  characterFade: number; // backward compatibility
  isIntroFinished: boolean;
  isResumeOpen: boolean;
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
  selectedSkill: string | null;
  isTelephoneActive: boolean;
  isContactCardRevealed: boolean;
  isMailOpen: boolean;
  // Windows desktop window management
  isAboutWindowOpen: boolean;
  isResumeWindowOpen: boolean;
  isAboutMinimized: boolean;
  isResumeMinimized: boolean;
  isAboutMaximized: boolean;
  isResumeMaximized: boolean;
  activeZIndex: 'about' | 'resume';
  isLeetCodeModalOpen: boolean;
  terminalHistory: { cmd: string; output: string | string[] }[];
  selectedTerminalPrompt: string;
  // Actions
  setActiveSection: (id: SectionId) => void;
  setScrollProgress: (progress: number) => void;
  setDoorOpenProgress: (val: number) => void;
  setCharacterFade: (val: number) => void;
  setIsIntroFinished: (val: boolean) => void;
  setIsResumeOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsTerminalExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  toggleExplorationMode: (enabled?: boolean) => void;
  toggleReducedMotion: () => void;
  toggleMute: () => void;
  setActiveProjectSlug: (slug: string | null) => void;
  setActiveProjectIndex: (index: number) => void;
  setActiveAchievementId: (id: string | null) => void;
  setActiveSkillCategoryId: (id: string) => void;
  setIsSkillsPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedSkill: (skill: string | null) => void;
  setIsTelephoneActive: (val: boolean) => void;
  setIsContactCardRevealed: (val: boolean) => void;
  setIsMailOpen: (val: boolean) => void;
  openAboutWindow: () => void;
  closeAboutWindow: () => void;
  minimizeAboutWindow: () => void;
  toggleMaximizeAboutWindow: () => void;
  openResumeWindow: () => void;
  closeResumeWindow: () => void;
  minimizeResumeWindow: () => void;
  toggleMaximizeResumeWindow: () => void;
  bringWindowToFront: (win: 'about' | 'resume') => void;
  runTerminalCommand: (cmd: string) => void;
  jumpToSection: (id: SectionId) => void;
  nextSection: () => void;
  prevSection: () => void;
  setIsReady: (ready: boolean) => void;
  setIsLeetCodeModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>('intro');
  const [scrollProgress, setScrollProgressState] = useState<number>(0);
  const [doorOpenProgress, setDoorOpenProgress] = useState<number>(0);
  const [characterFade, setCharacterFade] = useState<number>(1);
  const [isIntroFinished, setIsIntroFinished] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpenState] = useState<boolean>(false);
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
  const [isSkillsPanelOpen, setIsSkillsPanelOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isTelephoneActive, setIsTelephoneActive] = useState<boolean>(false);
  const [isContactCardRevealed, setIsContactCardRevealed] = useState<boolean>(false);
  const [isMailOpen, setIsMailOpen] = useState<boolean>(false);

  // Desktop Window State
  const [isAboutWindowOpen, setIsAboutWindowOpen] = useState<boolean>(true);
  const [isResumeWindowOpen, setIsResumeWindowOpen] = useState<boolean>(false);
  const [isAboutMinimized, setIsAboutMinimized] = useState<boolean>(false);
  const [isResumeMinimized, setIsResumeMinimized] = useState<boolean>(false);
  const [isAboutMaximized, setIsAboutMaximized] = useState<boolean>(false);
  const [isResumeMaximized, setIsResumeMaximized] = useState<boolean>(false);
  const [activeZIndex, setActiveZIndex] = useState<'about' | 'resume'>('about');
  const [isLeetCodeModalOpen, setIsLeetCodeModalOpen] = useState<boolean>(false);

  const [selectedTerminalPrompt, setSelectedTerminalPrompt] = useState<string>('about');
  const [terminalHistory, setTerminalHistory] = useState<
    { cmd: string; output: string | string[] }[]
  >([
    {
      cmd: 'about',
      output: [
        'Nikhil Singh — Computer Science Engineering student & aspiring software engineer.',
        'Institution: Government Engineering College Bilaspur (2022 — 2026).',
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
    if (id === 'about') {
      setIsAboutWindowOpen(true);
      setIsAboutMinimized(false);
    }
    if (id === 'contact') {
      setIsMailOpen(true);
      setIsContactCardRevealed(true);
    }
  }, []);

  const setActiveSkillCategoryId = useCallback((id: string) => {
    setActiveSkillCategoryIdState(id);
    announceToScreenReader(`Selected skills category: ${id}`);
  }, []);

  const openAboutWindow = useCallback(() => {
    setIsAboutWindowOpen(true);
    setIsAboutMinimized(false);
    setActiveZIndex('about');
  }, []);

  const closeAboutWindow = useCallback(() => {
    setIsAboutWindowOpen(false);
  }, []);

  const minimizeAboutWindow = useCallback(() => {
    setIsAboutMinimized(true);
  }, []);

  const toggleMaximizeAboutWindow = useCallback(() => {
    setIsAboutMaximized((prev) => !prev);
  }, []);

  const openResumeWindow = useCallback(() => {
    setIsResumeWindowOpen(true);
    setIsResumeMinimized(false);
    setIsResumeOpenState(true);
    setActiveZIndex('resume');
  }, []);

  const closeResumeWindow = useCallback(() => {
    setIsResumeWindowOpen(false);
    setIsResumeOpenState(false);
  }, []);

  const minimizeResumeWindow = useCallback(() => {
    setIsResumeMinimized(true);
  }, []);

  const toggleMaximizeResumeWindow = useCallback(() => {
    setIsResumeMaximized((prev) => !prev);
  }, []);

  const bringWindowToFront = useCallback((win: 'about' | 'resume') => {
    setActiveZIndex(win);
    if (win === 'about') setIsAboutMinimized(false);
    if (win === 'resume') setIsResumeMinimized(false);
  }, []);

  const setIsResumeOpen = useCallback(
    (open: boolean | ((prev: boolean) => boolean)) => {
      setIsResumeOpenState((prev) => {
        const nextVal = typeof open === 'function' ? open(prev) : open;
        if (nextVal) {
          openResumeWindow();
        } else {
          closeResumeWindow();
        }
        return nextVal;
      });
    },
    [openResumeWindow, closeResumeWindow]
  );

  const runTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setTerminalHistory([]);
      setSelectedTerminalPrompt('');
      return;
    }

    if (trimmed === 'resume') {
      openResumeWindow();
      setTerminalHistory((prev) => [
        ...prev,
        {
          cmd: 'resume',
          output: 'Opening resume.pdf in dedicated desktop window...'
        }
      ]);
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
          output: `Command not recognized: "${trimmed}". Available commands: about, education, stack, focus, links, resume, help, clear.`
        }
      ]);
      announceToScreenReader(`Command ${trimmed} not recognized.`);
    }
  }, [openResumeWindow]);

  const setScrollProgress = useCallback((progress: number) => {
    startTransition(() => {
      setScrollProgressState(progress);
      if (progress >= 0.04) {
        setIsIntroFinished(true);
      }
      if (progress >= 0.90) {
        setIsMailOpen(true);
        setIsContactCardRevealed(true);
      }
    });
  }, []);

  const toggleExplorationMode = useCallback((enabled?: boolean) => {
    setIsExplorationMode((prev) => {
      const nextVal = enabled !== undefined ? enabled : !prev;
      announceToScreenReader(
        nextVal
          ? 'Exploration mode activated.'
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
        isIntroFinished,
        isResumeOpen,
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
        selectedSkill,
        isTelephoneActive,
        isContactCardRevealed,
        isMailOpen,
        isAboutWindowOpen,
        isResumeWindowOpen,
        isAboutMinimized,
        isResumeMinimized,
        isAboutMaximized,
        isResumeMaximized,
        activeZIndex,
        terminalHistory,
        selectedTerminalPrompt,
        setActiveSection,
        setScrollProgress,
        setDoorOpenProgress,
        setCharacterFade,
        setIsIntroFinished,
        setIsResumeOpen,
        setIsTerminalExpanded,
        toggleExplorationMode,
        toggleReducedMotion,
        toggleMute,
        setActiveProjectSlug,
        setActiveProjectIndex,
        setActiveAchievementId,
        setActiveSkillCategoryId,
        setIsSkillsPanelOpen,
        setSelectedSkill,
        setIsTelephoneActive,
        setIsContactCardRevealed,
        setIsMailOpen,
        openAboutWindow,
        closeAboutWindow,
        minimizeAboutWindow,
        toggleMaximizeAboutWindow,
        openResumeWindow,
        closeResumeWindow,
        minimizeResumeWindow,
        toggleMaximizeResumeWindow,
        bringWindowToFront,
        runTerminalCommand,
        jumpToSection,
        nextSection,
        prevSection,
        setIsReady,
        isLeetCodeModalOpen,
        setIsLeetCodeModalOpen
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
