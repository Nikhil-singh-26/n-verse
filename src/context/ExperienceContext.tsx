'use client';

import '@/lib/react-patch';

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
import { projectsData } from '@/data/projects';

export type ProjectPresentationState =
  | 'ENTERING_PROJECTS'
  | 'CAMERA_READY'
  | `PROJECT_${number}`
  | 'ACHIEVEMENTS'
  | 'IDLE';

export type PagePresentationState = 'waiting' | 'animating' | 'presented';

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
  // Project Presentation State Machine
  projectPresentationState: ProjectPresentationState;
  projectPageState: PagePresentationState;
  isCameraAtProjector: boolean;
  isProjectAnimating: boolean;
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
  setProjectPresentationState: (state: ProjectPresentationState) => void;
  setProjectPageState: (state: PagePresentationState) => void;
  setIsCameraAtProjector: (val: boolean) => void;
  setIsProjectAnimating: (val: boolean) => void;
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

  // Project Presentation State Machine
  const [projectPresentationState, setProjectPresentationState] = useState<ProjectPresentationState>('IDLE');
  const [projectPageState, setProjectPageState] = useState<PagePresentationState>('waiting');
  const [isCameraAtProjector, setIsCameraAtProjector] = useState<boolean>(false);
  const [isProjectAnimating, setIsProjectAnimating] = useState<boolean>(false);

  // Desktop Window State
  const [isAboutWindowOpen, setIsAboutWindowOpen] = useState<boolean>(false);
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
        'Institution: Government Engineering College Bilaspur (2024 — 2028).',
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
    if (id === 'projects') {
      setIsCameraAtProjector(false);
    } else {
      setIsCameraAtProjector(false);
      setIsProjectAnimating(false);
      if (id === 'achievements') {
        setProjectPresentationState('ACHIEVEMENTS');
      } else {
        setProjectPresentationState('IDLE');
      }
    }

    // Workstation window interaction states per destination
    if (id === 'about') {
      setIsAboutWindowOpen(true);
      setIsAboutMinimized(false);
      setIsResumeWindowOpen(false);
      setIsMailOpen(false);
      setActiveZIndex('about');
    } else if (id === 'resume') {
      setIsResumeWindowOpen(true);
      setIsResumeMinimized(false);
      setIsAboutWindowOpen(false);
      setIsMailOpen(false);
      setActiveZIndex('resume');
    } else if (id === 'contact') {
      setIsMailOpen(true);
      setIsContactCardRevealed(true);
      setIsAboutWindowOpen(false);
      setIsResumeWindowOpen(false);
    } else if (['intro', 'room', 'skills', 'projects', 'achievements', 'finale'].includes(id)) {
      setIsAboutWindowOpen(false);
      setIsResumeWindowOpen(false);
      setIsMailOpen(false);
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

    const prevSectionId = activeSection;
    setActiveSection(id);

    if (id === 'projects') {
      const prevIdx = SECTION_IDS.indexOf(prevSectionId);
      const projIdx = SECTION_IDS.indexOf('projects');
      if (prevIdx < projIdx) {
        // Entering forward from skills or earlier -> initialize to project 1
        setActiveProjectIndex(0);
        setProjectPageState('waiting');
        setProjectPresentationState('ENTERING_PROJECTS');
      } else if (prevIdx > projIdx) {
        // Entering backward from achievements -> restore last project
        const lastIdx = projectsData.length - 1;
        setActiveProjectIndex(lastIdx);
        setProjectPageState('presented');
        setProjectPresentationState(`PROJECT_${projectsData.length}`);
      } else {
        // Direct jump to projects when already in projects or re-trigger
        setActiveProjectIndex(0);
        setProjectPageState('waiting');
        setProjectPresentationState('ENTERING_PROJECTS');
      }
    }

    const scrollContainer = document.getElementById('scroll-timeline-container');
    if (scrollContainer && typeof window !== 'undefined') {
      const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
      const targetScroll = (idx / (SECTION_IDS.length - 1)) * maxScroll;

      (window as unknown as { __isNavigating?: boolean }).__isNavigating = true;

      window.scrollTo({
        top: targetScroll,
        behavior: isReducedMotion ? 'instant' : 'smooth'
      });

      const clearNav = () => {
        if (typeof window !== 'undefined') {
          (window as unknown as { __isNavigating?: boolean }).__isNavigating = false;
        }
      };

      if (isReducedMotion) {
        clearNav();
      } else {
        window.addEventListener('scrollend', clearNav, { once: true });
        setTimeout(clearNav, 1400);
      }
    }
  }, [setActiveSection, isReducedMotion, activeSection]);

  const nextSection = useCallback(() => {
    if (activeSection === 'intro') {
      setIsIntroFinished(true);
      jumpToSection('room');
      return;
    }

    if (activeSection === 'projects') {
      if (isProjectAnimating || projectPageState === 'animating') return;
      if (activeProjectIndex < projectsData.length - 1) {
        const nextIdx = activeProjectIndex + 1;
        setActiveProjectIndex(nextIdx);
        setProjectPresentationState(`PROJECT_${nextIdx + 1}`);
        setProjectPageState('animating');
        setIsProjectAnimating(true);
      } else {
        setProjectPresentationState('ACHIEVEMENTS');
        jumpToSection('achievements');
      }
      return;
    }

    const journeyOrder: SectionId[] = [
      'room',
      'workstation',
      'skills',
      'projects',
      'achievements',
      'finale'
    ];

    const curIdx = journeyOrder.indexOf(activeSection);
    if (curIdx !== -1 && curIdx < journeyOrder.length - 1) {
      jumpToSection(journeyOrder[curIdx + 1]);
    }
  }, [
    activeSection,
    activeProjectIndex,
    isProjectAnimating,
    projectPageState,
    jumpToSection,
    setIsIntroFinished
  ]);

  const prevSection = useCallback(() => {
    if (activeSection === 'room' || activeSection === 'intro') {
      return; // Do not return to intro
    }

    if (activeSection === 'finale') {
      jumpToSection('achievements');
      return;
    }

    if (activeSection === 'achievements') {
      const lastIdx = projectsData.length - 1;
      setActiveProjectIndex(lastIdx);
      setProjectPageState('presented');
      setProjectPresentationState(`PROJECT_${projectsData.length}`);
      jumpToSection('projects');
      return;
    }

    if (activeSection === 'projects') {
      if (isProjectAnimating || projectPageState === 'animating') return;
      if (activeProjectIndex > 0) {
        const prevIdx = activeProjectIndex - 1;
        setActiveProjectIndex(prevIdx);
        setProjectPresentationState(`PROJECT_${prevIdx + 1}`);
        setProjectPageState('animating');
        setIsProjectAnimating(true);
      } else {
        setProjectPresentationState('IDLE');
        jumpToSection('skills');
      }
      return;
    }

    const journeyOrder: SectionId[] = [
      'room',
      'workstation',
      'skills',
      'projects',
      'achievements',
      'finale'
    ];

    const curIdx = journeyOrder.indexOf(activeSection);
    if (curIdx > 0) {
      jumpToSection(journeyOrder[curIdx - 1]);
    }
  }, [
    activeSection,
    activeProjectIndex,
    isProjectAnimating,
    projectPageState,
    jumpToSection
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __experience?: unknown }).__experience = {
        jumpToSection,
        openAboutWindow,
        openResumeWindow,
        setIsMailOpen,
        activeSection
      };
    }
  }, [jumpToSection, openAboutWindow, openResumeWindow, setIsMailOpen, activeSection]);

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
        projectPresentationState,
        projectPageState,
        isCameraAtProjector,
        isProjectAnimating,
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
        setProjectPresentationState,
        setProjectPageState,
        setIsCameraAtProjector,
        setIsProjectAnimating,
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
