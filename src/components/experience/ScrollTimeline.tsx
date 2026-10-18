'use client';

import React, { useEffect, useRef } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS, SECTION_IDS } from '@/lib/experience-config';
import { gsap, ScrollTrigger, registerGsapPlugins } from '@/lib/motion';
import { SectionId } from '@/types';
import { projectsData } from '@/data/projects';

export function ScrollTimeline() {
  const {
    activeSection,
    activeProjectIndex,
    setScrollProgress,
    setActiveSection,
    setActiveProjectIndex,
    setIsContactCardRevealed,
    setIsMailOpen,
    isExplorationMode,
    jumpToSection,
    nextSection,
    prevSection
  } = useExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const currentSectionRef = useRef<SectionId>('intro');
  const activeSectionRef = useRef<SectionId>(activeSection);
  const activeProjectIndexRef = useRef<number>(activeProjectIndex);
  const lastGestureTimeRef = useRef<number>(0);

  // Synchronize ref values
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    activeProjectIndexRef.current = activeProjectIndex;
  }, [activeProjectIndex]);

  // Helper to sync window scrollbar to discrete project progress
  const syncScrollToProject = (idx: number) => {
    const scrollContainer = document.getElementById('scroll-timeline-container');
    if (!scrollContainer || typeof window === 'undefined') return;
    const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
    // Map project index evenly into [0.54, 0.76]
    const projT = (idx + 0.5) / projectsData.length;
    const targetP = 0.54 + projT * (0.76 - 0.54);
    window.scrollTo({ top: targetP * maxScroll, behavior: 'smooth' });
  };

  // Master GSAP ScrollTrigger timeline configuration
  useEffect(() => {
    registerGsapPlugins();

    if (!containerRef.current) return;

    // Define section threshold intervals for all 7 ordered stops
    const getSectionFromProgress = (p: number): SectionId => {
      if (p < 0.08) return 'intro';
      if (p < 0.22) return 'room';
      if (p < 0.38) return 'about';
      if (p < 0.54) return 'skills';
      if (p < 0.76) return 'projects';
      if (p < 0.88) return 'achievements';
      return 'contact';
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
          } else if (prevSectionId === 'skills' && newSection === 'projects') {
            activeProjectIndexRef.current = 0;
            setActiveProjectIndex(0);
          }
        }

        // Contact Section: Reveal Display B Mail client and contact channels
        if (progress >= 0.88) {
          setIsMailOpen(true);
          setIsContactCardRevealed(true);
        } else {
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
    setIsContactCardRevealed,
    setIsMailOpen,
    isExplorationMode
  ]);

  // Discrete Wheel Controller for 1-Project-Per-Step Experience
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isExplorationMode) return;

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

      if (activeSectionRef.current === 'projects') {
        // Intentional scroll threshold to ignore minor trackpad jitter
        if (Math.abs(e.deltaY) < 16) return;

        // Sensible cooldown (~520ms) to absorb trackpad momentum / inertia flings
        const now = Date.now();
        if (now - lastGestureTimeRef.current < 520) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        lastGestureTimeRef.current = now;

        const curIdx = activeProjectIndexRef.current;
        const total = projectsData.length;

        if (e.deltaY > 0) {
          // Intentional downward gesture
          if (curIdx < total - 1) {
            const nextIdx = curIdx + 1;
            activeProjectIndexRef.current = nextIdx;
            setActiveProjectIndex(nextIdx);
            syncScrollToProject(nextIdx);
          } else {
            // Past final project -> advance to Achievements station
            jumpToSection('achievements');
          }
        } else {
          // Intentional upward gesture
          if (curIdx > 0) {
            const prevIdx = curIdx - 1;
            activeProjectIndexRef.current = prevIdx;
            setActiveProjectIndex(prevIdx);
            syncScrollToProject(prevIdx);
          } else {
            // Past first project -> return to Skills station
            jumpToSection('skills');
          }
        }
      } else if (activeSectionRef.current === 'achievements' && e.deltaY < 0) {
        // Intentional upward scroll from achievements -> cleanly restore last project
        if (Math.abs(e.deltaY) < 16) return;
        const now = Date.now();
        if (now - lastGestureTimeRef.current < 520) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        lastGestureTimeRef.current = now;
        const lastIdx = projectsData.length - 1;
        activeProjectIndexRef.current = lastIdx;
        setActiveProjectIndex(lastIdx);
        syncScrollToProject(lastIdx);
        setActiveSection('projects');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isExplorationMode, setActiveProjectIndex, jumpToSection, setActiveSection]);

  // Mobile Swipe Gesture Listener (with 1-project-per-swipe in Projects)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
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
      if (touchStartY.current === null || isExplorationMode) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // 40px swipe threshold
      if (Math.abs(deltaY) > 40) {
        if (activeSectionRef.current === 'projects') {
          const now = Date.now();
          if (now - lastGestureTimeRef.current < 450) return;
          lastGestureTimeRef.current = now;

          const curIdx = activeProjectIndexRef.current;
          const total = projectsData.length;

          if (deltaY > 0) {
            // Swiped up -> advance
            if (curIdx < total - 1) {
              const nextIdx = curIdx + 1;
              activeProjectIndexRef.current = nextIdx;
              setActiveProjectIndex(nextIdx);
              syncScrollToProject(nextIdx);
            } else {
              jumpToSection('achievements');
            }
          } else {
            // Swiped down -> retreat
            if (curIdx > 0) {
              const prevIdx = curIdx - 1;
              activeProjectIndexRef.current = prevIdx;
              setActiveProjectIndex(prevIdx);
              syncScrollToProject(prevIdx);
            } else {
              jumpToSection('skills');
            }
          }
        } else if (activeSectionRef.current === 'achievements' && deltaY < 0) {
          // Swiped down from achievements -> restore last project
          const lastIdx = projectsData.length - 1;
          activeProjectIndexRef.current = lastIdx;
          setActiveProjectIndex(lastIdx);
          syncScrollToProject(lastIdx);
          setActiveSection('projects');
        } else {
          if (deltaY > 0) {
            nextSection();
          } else {
            prevSection();
          }
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
  }, [isExplorationMode, nextSection, prevSection, setActiveProjectIndex, jumpToSection, setActiveSection]);

  // Accessible Keyboard Navigation (One-Project-Per-Key in Projects)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (activeSectionRef.current === 'projects') {
        if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
          e.preventDefault();
          const curIdx = activeProjectIndexRef.current;
          if (curIdx < projectsData.length - 1) {
            const nextIdx = curIdx + 1;
            activeProjectIndexRef.current = nextIdx;
            setActiveProjectIndex(nextIdx);
            syncScrollToProject(nextIdx);
          } else {
            jumpToSection('achievements');
          }
        } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
          e.preventDefault();
          const curIdx = activeProjectIndexRef.current;
          if (curIdx > 0) {
            const prevIdx = curIdx - 1;
            activeProjectIndexRef.current = prevIdx;
            setActiveProjectIndex(prevIdx);
            syncScrollToProject(prevIdx);
          } else {
            jumpToSection('skills');
          }
        }
        return;
      }

      if (activeSectionRef.current === 'achievements' && ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const lastIdx = projectsData.length - 1;
        activeProjectIndexRef.current = lastIdx;
        setActiveProjectIndex(lastIdx);
        syncScrollToProject(lastIdx);
        setActiveSection('projects');
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSection, prevSection, setActiveProjectIndex, jumpToSection, setActiveSection]);

  return (
    <div
      id="scroll-timeline-container"
      ref={containerRef}
      className="w-full pointer-events-none relative"
      style={{ height: '700vh' }}
      aria-hidden="true"
    />
  );
}
