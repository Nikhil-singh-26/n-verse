'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { profileData } from '@/data/profile';
import { contactData } from '@/data/contact';
import {
  Folder,
  FileText,
  Minus,
  Square,
  Copy,
  Check,
  Send,
  Download,
  ExternalLink,
  Mail,
  User,
  GraduationCap,
  Layers,
  Search,
  Wifi,
  Volume2,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function Workstation() {
  const {
    isAboutWindowOpen,
    isResumeWindowOpen,
    isAboutMinimized,
    isAboutMaximized,
    isResumeMinimized,
    isResumeMaximized,
    isMailOpen,
    openAboutWindow,
    closeAboutWindow,
    minimizeAboutWindow,
    toggleMaximizeAboutWindow,
    openResumeWindow,
    closeResumeWindow,
    minimizeResumeWindow,
    toggleMaximizeResumeWindow,
    setIsMailOpen
  } = useExperience();

  // Active top window management
  const [activeWindow, setActiveWindow] = useState<'about' | 'resume' | 'mail'>('about');
  const [isMailMinimized, setIsMailMinimized] = useState(false);
  const [isMailMaximized, setIsMailMaximized] = useState(false);

  // Draggable window coordinates
  // Initial position at x: 340 leaves the 3 desktop folders on the left (x: 56) completely visible and unobstructed!
  const [aboutPos, setAboutPos] = useState({ x: 340, y: 55 });
  const [resumePos, setResumePos] = useState({ x: 380, y: 70 });
  const [mailPos, setMailPos] = useState({ x: 360, y: 60 });

  const isDragging = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  // Clock state for the taskbar
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [currentDate, setCurrentDate] = useState('10/18/2026');

  // Copy email feedback
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Mail form state
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // 3D Texture Loader for guaranteed backlit screen in WebGL
  const [wallpaperTexture, setWallpaperTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/background.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setWallpaperTexture(tex);
      },
      undefined,
      () => {
        // Fallback gracefully
      }
    );
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Window drag handlers
  const handleMouseDown = (winName: 'about' | 'resume' | 'mail', initialPos: { x: number; y: number }, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    setActiveWindow(winName);
    isDragging.current = winName;
    if (typeof window !== 'undefined') {
      (window as unknown as { __isDraggingWindow?: boolean }).__isDraggingWindow = true;
    }
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: initialPos.x,
      initialY: initialPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newX = Math.max(10, Math.min(840, dragStart.current.initialX + dx));
      const newY = Math.max(10, Math.min(340, dragStart.current.initialY + dy));

      if (isDragging.current === 'about') {
        setAboutPos({ x: newX, y: newY });
      } else if (isDragging.current === 'resume') {
        setResumePos({ x: newX, y: newY });
      } else if (isDragging.current === 'mail') {
        setMailPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = null;
      if (typeof window !== 'undefined') {
        (window as unknown as { __isDraggingWindow?: boolean }).__isDraggingWindow = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(contactData.email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = contactData.email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleOpenResume = () => {
    openResumeWindow();
    setActiveWindow('resume');
  };

  const handleOpenContact = () => {
    setIsMailOpen(true);
    setIsMailMinimized(false);
    setActiveWindow('mail');
  };

  return (
    <group position={[-1.2, 0, -3.2]}>
      {/* Warm focused desk lamp downlight */}
      <spotLight
        position={[0.8, 1.8, 0.2]}
        target-position={[0, 0.76, 0]}
        color="#fff0dd"
        intensity={2.8}
        angle={0.65}
        penumbra={0.6}
        castShadow
      />

      {/* Monitor ambient back-glow on the dark accent wall */}
      <pointLight position={[0, 2.22, -1.0]} color="#38bdf8" intensity={1.8} distance={5.5} />

      {/* ================= SOLID STUDY DESK (CLEAN - NO 2ND MONITOR) ================= */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.05, 1.15]} />
        <meshStandardMaterial color="#443022" roughness={0.38} metalness={0.06} />
      </mesh>

      {/* Desk Steel Frame & Legs */}
      <mesh position={[-1.45, 0.36, 0]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.95]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[1.45, 0.36, 0]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.95]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.25, -0.35]}>
        <boxGeometry args={[2.84, 0.04, 0.04]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Minimalist Felt Desk Mat */}
      <mesh position={[0, 0.768, 0.08]} receiveShadow>
        <boxGeometry args={[2.0, 0.004, 0.72]} />
        <meshStandardMaterial color="#1c2028" roughness={0.85} />
      </mesh>

      {/* Keyboard & Mouse on Desk Mat */}
      <mesh position={[-0.1, 0.774, 0.24]} castShadow>
        <boxGeometry args={[0.48, 0.015, 0.16]} />
        <meshStandardMaterial color="#181a20" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0.35, 0.774, 0.24]} castShadow>
        <boxGeometry args={[0.075, 0.022, 0.12]} />
        <meshStandardMaterial color="#13161c" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ================= ONE MAIN WALL SCREEN (EXPANDED TO 4.40m x 2.475m) ================= */}
      {/* Mounted on the dark accent back wall (Z = -1.25) above the desk */}
      <group position={[0, 2.22, -1.25]}>
        {/* Wall Mount Heavy Bracket */}
        <mesh position={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[1.0, 1.0, 0.05]} />
          <meshStandardMaterial color="#11141c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Large Cinematic Monitor Outer Bezel (4.56m length x 2.62m breadth) */}
        <mesh position={[0, 0, -0.02]} castShadow>
          <boxGeometry args={[4.56, 2.62, 0.04]} />
          <meshStandardMaterial color="#121620" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* 3D Emissive Backlit Screen Mesh (4.40m x 2.475m - 16:9 ratio, guaranteed 100% powered ON) */}
        <mesh position={[0, 0, 0.008]}>
          <planeGeometry args={[4.40, 2.475]} />
          {wallpaperTexture ? (
            <meshBasicMaterial map={wallpaperTexture} toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#1e3a5f" />
          )}
        </mesh>

        {/* High-Resolution Windows Desktop Interface (Mathematically matched to 4.40m x 2.475m) */}
        <Html
          transform
          distanceFactor={1.0}
          position={[0, 0, 0.016]}
          className="pointer-events-auto select-none"
        >
          {/* Desktop Screen Boundary (1760px x 990px 16:9 widescreen) */}
          <div
            style={{
              backgroundImage: 'url(/background.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#0c121e'
            }}
            className="w-[1760px] h-[990px] rounded-sm flex flex-col overflow-hidden text-white font-sans relative shadow-[0_0_80px_rgba(0,0,0,0.95)] select-none"
          >
            {/* Desktop Wallpaper: public/background.jpg fallback image tag */}
            <img
              src="/background.jpg"
              alt="Desktop Wallpaper"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Subtle Vignette Overlay for Readability */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Desktop Icons Area: Exactly Three Visible Folders (About, Resume, Contact) on the Left */}
            <div className="absolute left-14 top-12 flex flex-col gap-6 pointer-events-auto z-30">
              {/* Folder 1: About */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openAboutWindow();
                  setActiveWindow('about');
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openAboutWindow();
                  setActiveWindow('about');
                }}
                className="flex flex-col items-center justify-center w-36 p-3.5 rounded-2xl bg-[#090d16]/85 hover:bg-white/25 border border-white/20 hover:border-amber-400/80 cursor-pointer group text-center transition-all select-none shadow-[0_8px_28px_rgba(0,0,0,0.65)] backdrop-blur-md active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open About Folder"
              >
                <div className="p-3.5 rounded-2xl bg-amber-400/25 group-hover:bg-amber-400/40 text-amber-400 transition-transform group-hover:scale-110 shadow-lg">
                  <Folder className="w-14 h-14 fill-amber-400/70" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  About
                </span>
                <span className="text-xs font-mono text-amber-300/90 font-medium">Profile & Bio</span>
              </div>

              {/* Folder 2: Resume */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleOpenResume();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenResume();
                }}
                className="flex flex-col items-center justify-center w-36 p-3.5 rounded-2xl bg-[#090d16]/85 hover:bg-white/25 border border-white/20 hover:border-emerald-400/80 cursor-pointer group text-center transition-all select-none shadow-[0_8px_28px_rgba(0,0,0,0.65)] backdrop-blur-md active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Resume Document"
              >
                <div className="p-3.5 rounded-2xl bg-emerald-400/25 group-hover:bg-emerald-400/40 text-emerald-400 transition-transform group-hover:scale-110 shadow-lg">
                  <Folder className="w-14 h-14 fill-emerald-400/70" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  Resume
                </span>
                <span className="text-xs font-mono text-emerald-300/90 font-medium">Resume.pdf</span>
              </div>

              {/* Folder 3: Contact */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleOpenContact();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenContact();
                }}
                className="flex flex-col items-center justify-center w-36 p-3.5 rounded-2xl bg-[#090d16]/85 hover:bg-white/25 border border-white/20 hover:border-sky-400/80 cursor-pointer group text-center transition-all select-none shadow-[0_8px_28px_rgba(0,0,0,0.65)] backdrop-blur-md active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Contact & Mail"
              >
                <div className="p-3.5 rounded-2xl bg-sky-400/25 group-hover:bg-sky-400/40 text-sky-400 transition-transform group-hover:scale-110 shadow-lg">
                  <Folder className="w-14 h-14 fill-sky-400/70" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  Contact
                </span>
                <span className="text-xs font-mono text-sky-300/90 font-medium">Mail & Links</span>
              </div>
            </div>

            {/* ================= 1. ABOUT ME WINDOW ================= */}
            {isAboutWindowOpen && !isAboutMinimized && (
              <div
                onMouseDown={() => setActiveWindow('about')}
                style={{
                  position: 'absolute',
                  left: isAboutMaximized ? 0 : `${aboutPos.x}px`,
                  top: isAboutMaximized ? 0 : `${aboutPos.y}px`,
                  width: isAboutMaximized ? '100%' : '880px',
                  height: isAboutMaximized ? 'calc(100% - 56px)' : '580px',
                  zIndex: activeWindow === 'about' ? 35 : 25
                }}
                className="bg-[#121824]/98 border border-white/20 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              >
                {/* Draggable Title Bar */}
                <div
                  onMouseDown={(e) => handleMouseDown('about', aboutPos, e)}
                  className="bg-[#1a2232] px-4 py-2.5 border-b border-white/10 flex items-center justify-between cursor-move select-none"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white tracking-wide">
                      About Me — Nikhil Singh
                    </span>
                  </div>

                  {/* Window Controls */}
                  <div className="flex items-center">
                    <button
                      onClick={minimizeAboutWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Minimize Window"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={toggleMaximizeAboutWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Maximize or Restore Window"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                    <button
                      onClick={closeAboutWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-red-600 transition-colors"
                      aria-label="Close Window"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Window Content Layout */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 flex overflow-hidden bg-[#0c121d]"
                >
                  {/* Left Explorer Sidebar */}
                  <div className="w-56 bg-[#0a0e17] border-r border-white/5 p-4 space-y-4 hidden sm:block">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#38bdf8]/50 shadow-sm flex-shrink-0">
                        <img src="/mypic.png" alt={profileData.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{profileData.name}</div>
                        <div className="text-[10px] text-white/60 truncate">{profileData.role}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#38bdf8]/15 text-[#38bdf8] font-medium">
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded text-white/70 hover:bg-white/5 cursor-pointer">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Education</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded text-white/70 hover:bg-white/5 cursor-pointer">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Tech Stack</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Viewport */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
                    {/* Header Bio Card */}
                    <div className="bg-[#141b2a] rounded-lg p-3.5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded">
                          Developer Overview
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {profileData.status}
                        </span>
                      </div>
                      <p className="text-white/90 leading-relaxed">
                        {Array.isArray(profileData.bio) ? profileData.bio.join(' ') : profileData.bio}
                      </p>
                    </div>

                    {/* Education Card */}
                    <div className="bg-[#141b2a] rounded-lg p-3.5 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-semibold">
                        <GraduationCap className="w-4 h-4" />
                        <span>Education</span>
                      </div>
                      <div className="text-white font-medium">{profileData.degree}</div>
                      <div className="text-white/70">{profileData.university}</div>
                      <div className="text-[10px] text-white/50 font-mono">
                        Class of {profileData.graduationYear} &bull; {profileData.location}
                      </div>
                    </div>

                    {/* Technical Stack */}
                    <div className="bg-[#141b2a] rounded-lg p-3.5 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-[#38bdf8] font-semibold">
                        <Layers className="w-4 h-4" />
                        <span>Core Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Java', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Flutter', 'Tailwind CSS', 'Git'].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80 font-mono text-[10px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Document & Contact Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleOpenResume}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#38bdf8] hover:bg-white text-black font-semibold text-xs transition-colors shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Resume Viewer</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </button>
                      <button
                        onClick={handleOpenContact}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-sky-400" />
                        <span>Contact Channels</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. RESUME DOCUMENT VIEWER WINDOW ================= */}
            {isResumeWindowOpen && !isResumeMinimized && (
              <div
                onMouseDown={() => setActiveWindow('resume')}
                style={{
                  position: 'absolute',
                  left: isResumeMaximized ? 0 : `${resumePos.x}px`,
                  top: isResumeMaximized ? 0 : `${resumePos.y}px`,
                  width: isResumeMaximized ? '100%' : '880px',
                  height: isResumeMaximized ? 'calc(100% - 56px)' : '580px',
                  zIndex: activeWindow === 'resume' ? 35 : 25
                }}
                className="bg-[#121824]/98 border border-white/20 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              >
                {/* Title Bar */}
                <div
                  onMouseDown={(e) => handleMouseDown('resume', resumePos, e)}
                  className="bg-[#1a2232] px-3.5 py-2 border-b border-white/10 flex items-center justify-between cursor-move select-none"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white tracking-wide">
                      Resume.pdf — Official Resume
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={minimizeResumeWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Minimize Window"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={toggleMaximizeResumeWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Maximize or Restore Window"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                    <button
                      onClick={closeResumeWindow}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-red-600 transition-colors"
                      aria-label="Close Window"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="bg-[#090e17] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Nikhil Singh • Computer Science</span>
                    </span>
                    <span className="text-white/40 hidden sm:inline">&bull;</span>
                    <span className="text-white/60 text-[11px] hidden sm:inline">GEC Bilaspur (2022-2026)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#38bdf8] text-xs transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open in Tab</span>
                    </a>
                    <a
                      href="/resume.pdf"
                      download="Nikhil_Singh_Resume.pdf"
                      className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shadow-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>

                {/* Document Viewport */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 bg-[#1a202c] overflow-y-auto p-1.5 flex flex-col items-center"
                >
                  <iframe
                    src="/resume.pdf#toolbar=0"
                    title="Nikhil Singh Resume"
                    className="w-full h-full min-h-[380px] border-0 rounded bg-white"
                  />
                </div>
              </div>
            )}

            {/* ================= 3. CONTACT & MAIL CLIENT WINDOW ================= */}
            {isMailOpen && !isMailMinimized && (
              <div
                onMouseDown={() => setActiveWindow('mail')}
                style={{
                  position: 'absolute',
                  left: isMailMaximized ? 0 : `${mailPos.x}px`,
                  top: isMailMaximized ? 0 : `${mailPos.y}px`,
                  width: isMailMaximized ? '100%' : '840px',
                  height: isMailMaximized ? 'calc(100% - 56px)' : '580px',
                  zIndex: activeWindow === 'mail' ? 35 : 25
                }}
                className="bg-[#121824]/98 border border-white/20 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              >
                {/* Title Bar */}
                <div
                  onMouseDown={(e) => handleMouseDown('mail', mailPos, e)}
                  className="bg-[#1a2232] px-3.5 py-2 border-b border-white/10 flex items-center justify-between cursor-move select-none"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#38bdf8]" />
                    <span className="text-xs font-semibold text-white tracking-wide">
                      Mail & Communications — Nikhil Singh
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsMailMinimized(true)}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Minimize Window"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsMailMaximized((prev) => !prev)}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Maximize or Restore Window"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setIsMailOpen(false)}
                      className="px-2.5 py-1 text-white/70 hover:text-white hover:bg-red-600 transition-colors"
                      aria-label="Close Window"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mail & Channels Content */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-3.5 text-xs font-sans"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm font-['Outfit']">
                        Direct Communications Channel
                      </h4>
                      <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded">
                        Available for Opportunities
                      </span>
                    </div>

                    {/* Email Copy Card */}
                    <div className="bg-[#141b2a] rounded-lg p-3 border border-white/10 space-y-1.5">
                      <div className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider">
                        Direct Email Address
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-white select-all">
                          {contactData.email}
                        </span>
                        <button
                          onClick={handleCopyEmail}
                          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
                        >
                          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Message Compose Form */}
                    <div className="bg-[#141b2a] rounded-lg p-3 border border-white/10 space-y-2">
                      <div className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider">
                        Send Message
                      </div>
                      <input
                        type="text"
                        placeholder="Subject (e.g. Software Engineer Opportunity / Project Collab)"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full bg-[#0a0e17] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#38bdf8]"
                      />
                      <textarea
                        rows={3}
                        placeholder="Your message..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-[#0a0e17] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#38bdf8] resize-none"
                      />
                      <a
                        href={`mailto:${contactData.email}?subject=${encodeURIComponent(
                          contactSubject || 'N-VERSE Portfolio Inquiry'
                        )}&body=${encodeURIComponent(contactMessage)}`}
                        className="w-full py-2 rounded bg-[#38bdf8] hover:bg-white text-black font-semibold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via Email Client</span>
                      </a>
                    </div>
                  </div>

                  {/* Verified Links */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/50">Verified Profiles:</span>
                    <div className="flex items-center gap-2">
                      {contactData.github && (
                        <a
                          href={contactData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {contactData.linkedin && (
                        <a
                          href={contactData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono transition-colors"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= WINDOWS TASKBAR (BOTTOM OF MAIN WALL SCREEN) ================= */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0e131d]/95 border-t border-white/15 px-6 flex items-center justify-between z-40 select-none">
              {/* Start Button & Search & Quick-Launch Folders */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    openAboutWindow();
                    setActiveWindow('about');
                  }}
                  className="flex items-center justify-center p-1.5 rounded hover:bg-white/10 text-[#38bdf8] transition-colors group"
                  title="N/VERSE Start Menu"
                  aria-label="Start Menu"
                >
                  <Sparkles className="w-4 h-4 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-white/50 text-xs font-mono">
                  <Search className="w-3 h-3" />
                  <span>Search</span>
                </div>

                {/* Quick Folder Shortcuts right in the Taskbar */}
                <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <button
                    onClick={() => {
                      openAboutWindow();
                      setActiveWindow('about');
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 hover:bg-amber-400/25 border border-amber-400/20 text-amber-300 text-[11px] font-mono transition-colors"
                    title="Open About Folder"
                  >
                    <Folder className="w-3 h-3 fill-amber-400/60" />
                    <span>About</span>
                  </button>
                  <button
                    onClick={handleOpenResume}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-400/10 hover:bg-emerald-400/25 border border-emerald-400/20 text-emerald-300 text-[11px] font-mono transition-colors"
                    title="Open Resume Document"
                  >
                    <Folder className="w-3 h-3 fill-emerald-400/60" />
                    <span>Resume</span>
                  </button>
                  <button
                    onClick={handleOpenContact}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-400/10 hover:bg-sky-400/25 border border-sky-400/20 text-sky-300 text-[11px] font-mono transition-colors"
                    title="Open Contact Folder"
                  >
                    <Folder className="w-3 h-3 fill-sky-400/60" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>

              {/* Running Applications Tabs */}
              <div className="flex items-center gap-2">
                {/* About Tab */}
                {isAboutWindowOpen && (
                  <button
                    onClick={() => {
                      if (isAboutMinimized) {
                        openAboutWindow();
                        setActiveWindow('about');
                      } else if (activeWindow === 'about') {
                        minimizeAboutWindow();
                      } else {
                        setActiveWindow('about');
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors border ${
                      activeWindow === 'about' && !isAboutMinimized
                        ? 'bg-white/20 text-white border-white/30 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs">About</span>
                  </button>
                )}

                {/* Resume Tab */}
                {isResumeWindowOpen && (
                  <button
                    onClick={() => {
                      if (isResumeMinimized) {
                        openResumeWindow();
                        setActiveWindow('resume');
                      } else if (activeWindow === 'resume') {
                        minimizeResumeWindow();
                      } else {
                        setActiveWindow('resume');
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors border ${
                      activeWindow === 'resume' && !isResumeMinimized
                        ? 'bg-white/20 text-white border-white/30 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs">Resume.pdf</span>
                  </button>
                )}

                {/* Mail Tab */}
                {isMailOpen && (
                  <button
                    onClick={() => {
                      if (isMailMinimized) {
                        setIsMailMinimized(false);
                        setActiveWindow('mail');
                      } else if (activeWindow === 'mail') {
                        setIsMailMinimized(true);
                      } else {
                        setActiveWindow('mail');
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors border ${
                      activeWindow === 'mail' && !isMailMinimized
                        ? 'bg-white/20 text-white border-white/30 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs">Contact</span>
                  </button>
                )}
              </div>

              {/* System Tray (Clock, Network, Sound) */}
              <div className="flex items-center gap-3.5 text-white/80 pr-1">
                <div className="flex items-center gap-2 text-white/60">
                  <Wifi className="w-3.5 h-3.5" />
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-right text-[10px] leading-tight font-mono text-white/90">
                  <div>{currentTime}</div>
                  <div className="text-white/60">{currentDate}</div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* ================= ERGONOMIC WORKSTATION CHAIR ================= */}
      {/* Tucked neatly at desk side so it never blocks the large wall display */}
      <group position={[0.42, 0, 0.28]} rotation={[0, Math.PI * 0.88, 0]}>
        {[0, 1, 2, 3, 4].map((ci) => {
          const angle = (ci * Math.PI * 2) / 5;
          return (
            <mesh
              key={`caster-${ci}`}
              position={[Math.sin(angle) * 0.28, 0.06, Math.cos(angle) * 0.28]}
              rotation={[0, angle, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
              <meshStandardMaterial color="#1c1f26" metalness={0.85} roughness={0.3} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.32, 16]} />
          <meshStandardMaterial color="#14161c" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.08, 0.52]} />
          <meshStandardMaterial color="#2b303c" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.82, -0.22]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.48, 0.68, 0.06]} />
          <meshStandardMaterial color="#222630" roughness={0.65} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.22, -0.26]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.14, 0.05]} />
          <meshStandardMaterial color="#2b303c" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
