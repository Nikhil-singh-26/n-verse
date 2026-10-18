'use client';

import React, { useEffect, useRef } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { gsap, ScrollTrigger, registerGsapPlugins } from '@/lib/motion';
import { SectionId } from '@/types';
import { projectsData } from '@/data/projects';

export function ScrollTimeline() {
  const {
    activeSection,
    activeProjectIndex,
    isIntroFinished,
    setScrollProgress,
    setActiveSection,
    setActiveProjectIndex,
    setIsContactCardRevealed,
    setIsMailOpen,
    isExplorationMode,
    jumpToSection,
    nextSection,
    prevSection,
    projectPageState,
    setProjectPageState,
    setProjectPresentationState,
    isProjectAnimating,
    setIsProjectAnimating
  } = useExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const currentSectionRef = useRef<SectionId>('intro');
  const activeSectionRef = useRef<SectionId>(activeSection);
  const activeProjectIndexRef = useRef<number>(activeProjectIndex);
  const projectPageStateRef = useRef(projectPageState);
  const isProjectAnimatingRef = useRef(isProjectAnimating);
  const isIntroFinishedRef = useRef(isIntroFinished);
  const lastGestureTimeRef = useRef<number>(0);

  // Synchronize ref values
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    activeProjectIndexRef.current = activeProjectIndex;
  }, [activeProjectIndex]);

  useEffect(() => {
    projectPageStateRef.current = projectPageState;
  }, [projectPageState]);

  useEffect(() => {
    isProjectAnimatingRef.current = isProjectAnimating;
  }, [isProjectAnimating]);

  useEffect(() => {
    isIntroFinishedRef.current = isIntroFinished;
  }, [isIntroFinished]);

  // Master GSAP ScrollTrigger timeline configuration
  useEffect(() => {
    registerGsapPlugins();

    if (!containerRef.current) return;

    // 10 ordered stops across progress (0.0 to 1.0)
    const getSectionFromProgress = (p: number): SectionId => {
      if (p < 0.0556) return 'intro';
      if (p < 0.1667) return 'room';
      if (p < 0.2778) return 'workstation';
      if (p < 0.3889) return 'about';
      if (p < 0.5000) return 'resume';
      if (p < 0.6111) return 'contact';
      if (p < 0.7222) return 'skills';
      if (p < 0.8333) return 'projects';
      if (p < 0.9444) return 'achievements';
      return 'finale';
    };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        if (isExplorationMode) return;

        const progress = Math.max(0, Math.min(1, self.progress));
        setScrollProgress(progress);

        const newSection = getSectionFromProgress(progress);
        if (newSection !== currentSectionRef.current) {
          const prevSectionId = currentSectionRef.current;
          currentSectionRef.current = newSection;
          setActiveSection(newSection);

          // Bi-directional arrival into projects section
          if (prevSectionId === 'achievements' && newSection === 'projects') {
            const lastIdx = projectsData.length - 1;
            activeProjectIndexRef.current = lastIdx;
            setActiveProjectIndex(lastIdx);
            setProjectPageState('presented');
            setProjectPresentationState(`PROJECT_${projectsData.length}`);
          } else if (prevSectionId === 'skills' && newSection === 'projects') {
            activeProjectIndexRef.current = 0;
            setActiveProjectIndex(0);
            setProjectPageState('waiting');
            setProjectPresentationState('ENTERING_PROJECTS');
          }
        }

        // Contact Section: Reveal Display B Mail client and contact channels
        if (newSection === 'contact') {
          setIsMailOpen(true);
          setIsContactCardRevealed(true);
        } else if (newSection !== 'about' && newSection !== 'resume') {
          setIsMailOpen(false);
          setIsContactCardRevealed(false);
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [
    setScrollProgress,
    setActiveSection,
    setActiveProjectIndex,
    setProjectPageState,
    setProjectPresentationState,
    setIsContactCardRevealed,
    setIsMailOpen,
    isExplorationMode
  ]);

  // Discrete Wheel Controller for 1-Destination-Per-Gesture Game Navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Ignore during free exploration or before intro completes
      if (isExplorationMode || !isIntroFinishedRef.current) return;

      // Check global flags for desktop window drag or globe rotation
      if (typeof window !== 'undefined') {
        const win = window as unknown as {
          __isInteractingWithObject?: boolean;
          __isDraggingWindow?: boolean;
        };
        if (win.__isInteractingWithObject || win.__isDraggingWindow) return;
      }

      // Allow native scrolling inside embedded windows, case study sheets, or textareas
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.overflow-y-auto') ||
        target?.closest('iframe') ||
        target?.closest('textarea') ||
        target?.closest('input')
      ) {
        return;
      }

      // Block advancement while animations are in progress
      if (isProjectAnimatingRef.current || projectPageStateRef.current === 'animating') {
        e.preventDefault();
        return;
      }

      // Intentional scroll threshold to ignore minor trackpad jitter
      if (Math.abs(e.deltaY) < 16) return;

      // Sensible cooldown (~480ms) to absorb trackpad momentum / inertia flings
      const now = Date.now();
      if (now - lastGestureTimeRef.current < 480) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      lastGestureTimeRef.current = now;

      if (e.deltaY > 0) {
        nextSection();
      } else {
        prevSection();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isExplorationMode, nextSection, prevSection]);

  // Mobile Swipe Gesture Listener (1-Destination-Per-Swipe)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!isIntroFinishedRef.current) {
        touchStartY.current = null;
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.overflow-y-auto') ||
        target?.closest('iframe') ||
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input')
      ) {
        touchStartY.current = null;
        return;
      }
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || isExplorationMode || !isIntroFinishedRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // 40px swipe threshold
      if (Math.abs(deltaY) > 40) {
        if (isProjectAnimatingRef.current || projectPageStateRef.current === 'animating') {
          return;
        }
        const now = Date.now();
        if (now - lastGestureTimeRef.current < 450) return;
        lastGestureTimeRef.current = now;

        if (deltaY > 0) {
          nextSection();
        } else {
          prevSection();
        }
      }
      touchStartY.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isExplorationMode, nextSection, prevSection]);

  // Accessible Keyboard Navigation (Arrow Keys / Page Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (!isIntroFinishedRef.current) return;

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        if (isProjectAnimatingRef.current || projectPageStateRef.current === 'animating') {
          return;
        }
        const now = Date.now();
        if (now - lastGestureTimeRef.current < 350) return;
        lastGestureTimeRef.current = now;
        nextSection();
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        if (isProjectAnimatingRef.current || projectPageStateRef.current === 'animating') {
          return;
        }
        const now = Date.now();
        if (now - lastGestureTimeRef.current < 350) return;
        lastGestureTimeRef.current = now;
        prevSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSection, prevSection]);

  return (
    <div
      id="scroll-timeline-container"
      ref={containerRef}
      className="w-full pointer-events-none relative"
      style={{ height: '900vh' }}
      aria-hidden="true"
    />
  );
}
