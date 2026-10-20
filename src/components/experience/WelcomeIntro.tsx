'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { gsap, registerGsapPlugins } from '@/lib/motion';
import { FastForward, Sparkles } from 'lucide-react';

export function WelcomeIntro() {
  const { isIntroFinished, setIsIntroFinished, isReducedMotion, jumpToSection } = useExperience();

  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const brandBadgeRef = useRef<HTMLDivElement>(null);
  const wordmarkLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const identityLineRef = useRef<HTMLDivElement>(null);
  const credoLineRef = useRef<HTMLDivElement>(null);
  const roleLineRef = useRef<HTMLDivElement>(null);
  const portalGlowRef = useRef<HTMLDivElement>(null);

  const [hasEntered, setHasEntered] = useState(false);

  const wordmark = ['N', '/', 'V', 'E', 'R', 'S', 'E'];

  // Handle transition into the 3D studio room
  const handleEnterStudio = () => {
    if (hasEntered) return;
    setHasEntered(true);
    jumpToSection('room');

    if (!overlayRef.current || isReducedMotion) {
      setIsIntroFinished(true);
      return;
    }

    // Portal expansion & dissolve into the studio room
    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsIntroFinished(true);
      }
    });

    if (portalRef.current) {
      exitTl.to(portalRef.current, {
        scale: 3.2,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.in'
      }, 0);
    }

    if (portalGlowRef.current) {
      exitTl.to(portalGlowRef.current, {
        scale: 4.5,
        opacity: 0.8,
        duration: 0.8,
        ease: 'power2.in'
      }, 0);
    }

    exitTl.to(overlayRef.current, {
      opacity: 0,
      duration: 1.1,
      ease: 'power2.inOut'
    }, 0.2);
  };

  // Background Interactive Star Dust Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 65 atmospheric luminous particles
    const particles = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      baseAlpha: Math.random() * 0.6 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      speedY: -(Math.random() * 0.35 + 0.12),
      speedX: (Math.random() - 0.5) * 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      hue: Math.random() > 0.4 ? 195 : Math.random() > 0.5 ? 40 : 270 // Cyan, warm amber, violet
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha = p.baseAlpha + Math.sin(Date.now() * p.pulseSpeed) * 0.2;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.hue === 195) {
          ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0, p.alpha)})`;
        } else if (p.hue === 40) {
          ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, p.alpha)})`;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0, p.alpha)})`;
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Master Cinematic Opening GSAP Timeline (Autoplays ~6.8 seconds)
  useEffect(() => {
    registerGsapPlugins();

    if (isReducedMotion) {
      // Respect user's motion preference: short reveal then transition
      const quickTimer = setTimeout(() => {
        handleEnterStudio();
      }, 700);
      return () => clearTimeout(quickTimer);
    }

    const masterTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Initial Atmospheric Light & Portal Reveal (0.0s - 1.2s)
    if (portalRef.current) {
      masterTl.fromTo(
        portalRef.current,
        { scale: 0.4, opacity: 0, rotate: -25 },
        { scale: 1.0, opacity: 0.85, rotate: 0, duration: 2.2, ease: 'power2.out' },
        0.2
      );
    }

    if (portalGlowRef.current) {
      masterTl.fromTo(
        portalGlowRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1.2, opacity: 0.45, duration: 2.5, ease: 'power2.out' },
        0.3
      );
    }

    // 2. Brand Badge Tagline (0.6s - 1.4s)
    if (brandBadgeRef.current) {
      masterTl.fromTo(
        brandBadgeRef.current,
        { opacity: 0, y: -16, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0 },
        0.7
      );
    }

    // 3. Staggered N/VERSE Wordmark Reveal with 3D Depth (1.0s - 2.6s)
    const validLetters = wordmarkLettersRef.current.filter((el): el is HTMLSpanElement => el !== null);
    if (validLetters.length > 0) {
      masterTl.fromTo(
        validLetters,
        {
          opacity: 0,
          y: 45,
          scale: 1.35,
          filter: 'blur(12px)',
          rotateX: 40
        },
        {
          opacity: 1,
          y: 0,
          scale: 1.0,
          filter: 'blur(0px)',
          rotateX: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: 'power3.out'
        },
        1.0
      );
    }

    // 4. Reveal Identity Line: NIKHIL SINGH (2.4s - 3.6s)
    if (identityLineRef.current) {
      masterTl.fromTo(
        identityLineRef.current,
        { opacity: 0, y: 18, filter: 'blur(6px)', letterSpacing: '0.4em' },
        { opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.22em', duration: 1.2 },
        2.2
      );
    }

    // 5. Reveal Credo: CODE. LEARN. BUILD. REPEAT. (3.4s - 4.8s)
    if (credoLineRef.current) {
      masterTl.fromTo(
        credoLineRef.current,
        { opacity: 0, y: 15, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
        3.2
      );
    }

    // 6. Sub-role Details (4.2s - 5.2s)
    if (roleLineRef.current) {
      masterTl.fromTo(
        roleLineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.75, y: 0, duration: 1.0 },
        4.0
      );
    }

    // 7. Passage Portal Awakening & Camera Dolly Cue (5.2s - 6.6s)
    masterTl.add(() => {
      if (portalGlowRef.current) {
        gsap.to(portalGlowRef.current, {
          scale: 2.0,
          opacity: 0.85,
          duration: 1.4,
          ease: 'power2.inOut'
        });
      }
    }, 5.2);

    // 8. Automatic Seamless Transition into the Studio Room at ~6.8s
    masterTl.add(() => {
      handleEnterStudio();
    }, 6.8);

    // Failsafe timer (8.5s maximum) to guarantee visitor is never stuck on black screen
    const failsafeTimer = setTimeout(() => {
      handleEnterStudio();
    }, 8500);

    return () => {
      clearTimeout(failsafeTimer);
      masterTl.kill();
    };
  }, [isReducedMotion]);

  if (isIntroFinished) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#030611] flex flex-col items-center justify-between p-6 sm:p-12 text-white select-none overflow-hidden"
      aria-label="Cinematic Opening Sequence"
    >
      {/* Interactive Atmospheric Star Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Atmospheric Multi-Layer Color Vignettes */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_45%,rgba(49,16,102,0.45)_0%,rgba(11,15,36,0.8)_50%,rgba(3,6,17,0.98)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_50%_52%,rgba(245,158,11,0.14)_0%,transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,240,255,0.12)_0%,transparent_45%)]" />

      {/* Volumetric Center Portal Glow */}
      <div
        ref={portalGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none bg-gradient-to-r from-violet-600/30 via-[#00f0ff]/20 to-amber-500/25 blur-3xl"
      />

      {/* Sacred Geometry Concentric Portal Rings */}
      <div
        ref={portalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full pointer-events-none z-10 flex items-center justify-center opacity-80"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full animate-[spin_65s_linear_infinite]"
        >
          {/* Outer Segmented Orbital Ring */}
          <circle
            cx="200"
            cy="200"
            r="185"
            fill="none"
            stroke="url(#portalGradient1)"
            strokeWidth="1.2"
            strokeDasharray="16 12 4 12"
            opacity="0.65"
          />
          {/* Middle Counter-Rotating Ring */}
          <circle
            cx="200"
            cy="200"
            r="155"
            fill="none"
            stroke="url(#portalGradient2)"
            strokeWidth="0.8"
            strokeDasharray="40 10 2 10"
            opacity="0.5"
          />
          {/* Inner Accent Ring */}
          <circle
            cx="200"
            cy="200"
            r="125"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.75"
            strokeDasharray="8 8"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="portalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="portalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Bar: Brand System Identity & Discreet Skip Control */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-widest text-[#94a3b8] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          <span>N/VERSE</span>
        </div>

        {/* Discreet Skip Intro Button */}
        <button
          onClick={handleEnterStudio}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-md text-xs font-mono text-[#cbd5e1] hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)] active:scale-95 cursor-pointer"
          aria-label="Skip cinematic introduction and enter studio"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 text-[#38bdf8]" />
        </button>
      </div>

      {/* Center Cinematic Editorial Identity Showcase */}
      <div className="text-center space-y-7 max-w-4xl mx-auto my-auto relative z-20 px-4">
        {/* Badge Tagline */}
        <div
          ref={brandBadgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 backdrop-blur-md text-[#38bdf8] font-mono text-xs uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Nikhil Universe</span>
        </div>

        {/* N / V E R S E Wordmark with Custom Letter Choreography */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight font-['Outfit'] leading-none text-white select-none">
          {wordmark.map((char, i) => (
            <span
              key={`${char}-${i}`}
              ref={(el) => {
                wordmarkLettersRef.current[i] = el;
              }}
              className="inline-block mx-0.5 sm:mx-1 drop-shadow-[0_4px_35px_rgba(0,240,255,0.3)] transform transition-transform"
            >
              {char === '/' ? (
                <span className="text-[#00f0ff] font-light mx-1 opacity-80">/</span>
              ) : (
                <span className="bg-gradient-to-b from-white via-[#f1f5f9] to-[#94a3b8] text-transparent bg-clip-text">
                  {char}
                </span>
              )}
            </span>
          ))}
        </h1>

        {/* Identity Line: NIKHIL SINGH */}
        <div
          ref={identityLineRef}
          className="font-serif text-lg sm:text-2xl md:text-3xl text-white font-extrabold tracking-[0.22em] uppercase drop-shadow-md"
        >
          <span>NIKHIL SINGH</span>
        </div>

        {/* Credo Line: CODE. LEARN. BUILD. REPEAT. */}
        <div
          ref={credoLineRef}
          className="flex items-center justify-center gap-2 sm:gap-4 font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest text-[#cbd5e1] uppercase"
        >
          <span className="text-[#00f0ff]">CODE.</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-amber-400">LEARN.</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-emerald-400">BUILD.</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-violet-400">REPEAT.</span>
        </div>

        {/* Sub-role Line */}
        <div
          ref={roleLineRef}
          className="font-mono text-[11px] sm:text-xs text-[#94a3b8] tracking-[0.2em] uppercase font-light pt-2"
        >
          CREATIVE DEVELOPER &bull; GEC BILASPUR &bull; EST. 2026
        </div>
      </div>

      {/* Bottom Autoplay Progress Indicator */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 relative z-20 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748b] tracking-wider uppercase">
          <span>Entering Universe</span>
          <span className="animate-pulse text-[#38bdf8]">&bull; Studio Online</span>
        </div>
        <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00f0ff] via-violet-500 to-amber-400 rounded-full animate-[progress_6.8s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
