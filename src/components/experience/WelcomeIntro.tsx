'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { gsap, registerGsapPlugins } from '@/lib/motion';
import { ChevronDown, FastForward } from 'lucide-react';

export function WelcomeIntro() {
  const { isIntroFinished, setIsIntroFinished, isReducedMotion, jumpToSection } = useExperience();
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const sublineRef = useRef<HTMLDivElement>(null);
  const enterPromptRef = useRef<HTMLDivElement>(null);

  const [canEnter, setCanEnter] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const words = ['WELCOME', 'TO', "NIKHIL'S", 'UNIVERSE'];

  useEffect(() => {
    registerGsapPlugins();

    // If reduced motion is preferred, immediately allow entry or skip smoothly
    if (isReducedMotion) {
      setCanEnter(true);
      return;
    }

    setHasStarted(true);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        setCanEnter(true);
      }
    });

    // Animate words with refined cinematic timing
    tl.fromTo(
      wordsRef.current,
      {
        opacity: 0,
        y: 24,
        filter: 'blur(8px)'
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.18,
        delay: 0.3
      }
    );

    // Subtle architectural subline
    if (sublineRef.current) {
      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 0.85, y: 0, duration: 0.8 },
        '-=0.4'
      );
    }

    // Scroll / enter prompt
    if (enterPromptRef.current) {
      tl.fromTo(
        enterPromptRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.2'
      );
    }

    // Failsafe timer: ensure black screen never traps the visitor
    const failsafe = setTimeout(() => {
      setCanEnter(true);
    }, 4500);

    return () => {
      clearTimeout(failsafe);
      tl.kill();
    };
  }, [isReducedMotion]);

  const handleEnterRoom = () => {
    if (!overlayRef.current) {
      setIsIntroFinished(true);
      jumpToSection('room');
      return;
    }

    if (isReducedMotion) {
      setIsIntroFinished(true);
      jumpToSection('room');
      return;
    }

    // Cinematic fade out from black into the warm study room
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.7,
      ease: 'power2.in'
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsIntroFinished(true);
        jumpToSection('room');
      }
    });
  };

  // Allow mouse wheel or key down to trigger transition once title is shown
  useEffect(() => {
    if (isIntroFinished) return;

    const handleWheelOrTouch = (e: WheelEvent | TouchEvent) => {
      if (canEnter) {
        handleEnterRoom();
      }
    };

    window.addEventListener('wheel', handleWheelOrTouch, { passive: true });
    window.addEventListener('touchmove', handleWheelOrTouch, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheelOrTouch);
      window.removeEventListener('touchmove', handleWheelOrTouch);
    };
  }, [canEnter, isIntroFinished]);

  if (isIntroFinished) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-between p-6 sm:p-12 text-white select-none transition-opacity"
      aria-label="Welcome opening sequence"
    >
      {/* Top Bar with Skip Option */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-[11px] font-mono tracking-widest text-[#64748b] uppercase">
          N/VERSE // ARCHITECTURAL STUDY
        </div>
        <button
          onClick={handleEnterRoom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-xs font-mono text-[#94a3b8] hover:text-white transition-colors"
          aria-label="Skip introductory welcome sequence"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3 h-3 text-[#cbd5e1]" />
        </button>
      </div>

      {/* Center Cinematic Title */}
      <div ref={containerRef} className="text-center space-y-6 max-w-4xl mx-auto my-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-['Outfit'] leading-none text-white">
          {words.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="inline-block mr-3 sm:mr-4 md:mr-5 drop-shadow-[0_4px_30px_rgba(255,255,255,0.12)]"
            >
              {word === "NIKHIL'S" ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2dad0] to-[#c4b5a2]">
                  {word}
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <div
          ref={sublineRef}
          className="font-mono text-xs sm:text-sm text-[#94a3b8] tracking-[0.25em] uppercase font-light"
        >
          CREATIVE DEVELOPER STUDY &bull; BILASPUR, INDIA
        </div>
      </div>

      {/* Bottom Scroll / Enter Trigger */}
      <div
        ref={enterPromptRef}
        className="w-full flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        onClick={handleEnterRoom}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleEnterRoom();
          }
        }}
        aria-label="Enter study room"
      >
        <span className="font-mono text-xs text-[#cbd5e1] tracking-widest uppercase">
          {canEnter ? 'CLICK OR SCROLL TO ENTER ROOM' : 'INITIALIZING EXPERIENCE'}
        </span>
        <div className="w-7 h-11 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-white animate-bounce" />
        </div>
      </div>
    </div>
  );
}
