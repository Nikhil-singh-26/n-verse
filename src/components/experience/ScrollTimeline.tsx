'use client';

import React, { useEffect, useRef } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS, SECTION_IDS } from '@/lib/experience-config';
import { gsap, ScrollTrigger, registerGsapPlugins } from '@/lib/motion';
import { SectionId } from '@/types';

export function ScrollTimeline() {
  const {
    setScrollProgress,
    setActiveSection,
    isExplorationMode,
    nextSection,
    prevSection
  } = useExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const currentSectionRef = useRef<SectionId>('gate');

  // Master GSAP ScrollTrigger timeline configuration
  useEffect(() => {
    registerGsapPlugins();

    if (!containerRef.current) return;

    // Define section threshold intervals for all 7 ordered stops
    const getSectionFromProgress = (p: number): SectionId => {
      if (p < 0.08) return 'gate';
      if (p < 0.22) return 'welcome';
      if (p < 0.38) return 'about';
      if (p < 0.54) return 'skills';
      if (p < 0.70) return 'projects';
      if (p < 0.86) return 'achievements';
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
          currentSectionRef.current = newSection;
          setActiveSection(newSection);
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [setScrollProgress, setActiveSection, isExplorationMode]);

  // Mobile Swipe Gesture Listener (without trapping inner scrollable modal panels)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.overflow-y-auto') || target?.closest('button') || target?.closest('a') || target?.closest('input')) {
        touchStartY.current = null;
        return;
      }
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || isExplorationMode) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // 45px swipe threshold
      if (Math.abs(deltaY) > 45) {
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

  // Accessible Keyboard Navigation (Arrow Keys, PageUp/PageDown, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
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
  }, [nextSection, prevSection]);

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
