'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { profileData } from '@/data/profile';
import { contactData } from '@/data/contact';
import {
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
  Terminal,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function WorkstationDesktop() {
  const {
    activeSection,
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

  // Responsive Draggable window coordinates within the desktop container
  const [aboutPos, setAboutPos] = useState({ x: 260, y: 35 });
  const [resumePos, setResumePos] = useState({ x: 290, y: 45 });
  const [mailPos, setMailPos] = useState({ x: 275, y: 55 });

  const isDragging = useRef<'about' | 'resume' | 'mail' | null>(null);
  const dragStart = useRef({ clientX: 0, clientY: 0, initialX: 0, initialY: 0 });
  const desktopScreenRef = useRef<HTMLDivElement | null>(null);

  // Exact 3D Wall Monitor Screen Projection Bounds (16:9 Cover geometry matching CameraController)
  const [screenBounds, setScreenBounds] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080, left: 0, top: 0 };
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / Math.max(1, h);
    let mw: number;
    let mh: number;
    if (aspect >= 16 / 9) {
      mw = w / 0.985;
      mh = mw * (9 / 16);
    } else {
      mh = h / 0.985;
      mw = mh * (16 / 9);
    }
    return { width: mw, height: mh, left: (w - mw) / 2, top: (h - mh) / 2 };
  });

  // Responsive mobile phone viewport detection
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const updateBounds = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsPhone(w < 768);
      const aspect = w / Math.max(1, h);
      let mw: number;
      let mh: number;
      if (aspect >= 16 / 9) {
        mw = w / 0.985;
        mh = mw * (9 / 16);
      } else {
        mh = h / 0.985;
        mw = mh * (16 / 9);
      }
      const left = (w - mw) / 2;
      const top = (h - mh) / 2;
      setScreenBounds({ width: mw, height: mh, left, top });
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Resume Document Viewer State
  const [resumeZoom, setResumeZoom] = useState(100);

  // Contact Form State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Terminal State & Hacker Typewriter Animation
  const [aboutTab, setAboutTab] = useState<'terminal' | 'page'>('terminal');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);

  const fullTerminalHistory = React.useMemo(
    () => [
      '┌─────────────────────────────────────────────────────────────────────────┐',
      '│  N  I  K  H  I  L                                                       │',
      '│  S  I  N  G  H                                                           │',
      '│  F U L L - S T A C K   E N G I N E E R                                   │',
      '└─────────────────────────────────────────────────────────────────────────┘',
      '',
      '[SYS_BOOT] Mounting N-VERSE cyber mainframe v4.2...',
      '[KERNEL] Arch Linux (x86_64) // Node.js v22.14 & WebGL Engine',
      '[PROFILE] Full-stack engineer crafting practical, high-performance web & mobile systems.',
      '[CORE_STACK] Next.js • React • TypeScript • Node.js • Express • MongoDB • Flutter',
      '[ACADEMICS] B.Tech in Computer Science & Engineering (2024–2028) @ GEC Bilaspur (CGPA: 7.6)',
      '[PROJECTS] 01 The Brew Club • 02 Shrinka URL • 03 RoadVision • 04 KnowVia (APK)',
      '[STATUS] Open for software engineering internships and high-impact roles.',
      '─────────────────────────────────────────────────────────────────────────────',
      "Type 'help' to inspect available commands (skills, projects, education, resume, contact)."
    ],
    []
  );

  const skipTyping = () => {
    if (!isTyping) return;
    setIsTyping(false);
    setCurrentTypingText('');
    setTerminalHistory(fullTerminalHistory);
    setTimeout(() => terminalInputRef.current?.focus(), 60);
  };

  // Trigger letter-by-letter and word-by-word hacker sequence when terminal is opened
  useEffect(() => {
    if (!isAboutWindowOpen || aboutTab !== 'terminal') return;

    let isCancelled = false;
    setIsTyping(true);
    setTerminalHistory([]);
    setCurrentTypingText('');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const nameLines = [
      'N  I  K  H  I  L',
      'S  I  N  G  H',
      'F U L L - S T A C K   E N G I N E E R'
    ];

    const contentLines = [
      '[SYS_BOOT] Mounting N-VERSE cyber mainframe v4.2...',
      '[KERNEL] Arch Linux (x86_64) // Node.js v22.14 & WebGL Engine',
      '[PROFILE] Full-stack engineer crafting practical, high-performance web & mobile systems.',
      '[CORE_STACK] Next.js • React • TypeScript • Node.js • Express • MongoDB • Flutter',
      '[ACADEMICS] B.Tech in Computer Science & Engineering (2024–2028) @ GEC Bilaspur (CGPA: 7.6)',
      '[PROJECTS] 01 The Brew Club • 02 Shrinka URL • 03 RoadVision • 04 KnowVia (APK)',
      '[STATUS] Open for software engineering internships and high-impact roles.',
      '─────────────────────────────────────────────────────────────────────────────',
      "Type 'help' to inspect available commands (skills, projects, education, resume, contact)."
    ];

    const runHackerTypewriter = async () => {
      await sleep(100);
      if (isCancelled) return;

      // Cyber Frame Top
      setTerminalHistory(['┌─────────────────────────────────────────────────────────────────────────┐']);
      await sleep(60);
      if (isCancelled) return;

      // 1. My name letter by letter in three lines
      for (const line of nameLines) {
        let textSoFar = '│  ';
        for (let i = 0; i < line.length; i++) {
          if (isCancelled) return;
          textSoFar += line[i];
          setCurrentTypingText(textSoFar);
          await sleep(22);
        }
        if (isCancelled) return;
        const padded = textSoFar + ' '.repeat(Math.max(1, 74 - textSoFar.length)) + '│';
        setTerminalHistory((prev) => [...prev, padded]);
        setCurrentTypingText('');
        await sleep(60);
      }

      if (isCancelled) return;
      // Cyber Frame Bottom
      setTerminalHistory((prev) => [
        ...prev,
        '└─────────────────────────────────────────────────────────────────────────┘',
        ''
      ]);
      await sleep(90);

      // 2. Content written in hacker way word by word
      for (const line of contentLines) {
        if (isCancelled) return;
        const words = line.split(' ');
        let textSoFar = '';
        for (let w = 0; w < words.length; w++) {
          if (isCancelled) return;
          textSoFar += (w === 0 ? '' : ' ') + words[w];
          setCurrentTypingText(textSoFar);
          await sleep(25);
        }
        if (isCancelled) return;
        setTerminalHistory((prev) => [...prev, textSoFar]);
        setCurrentTypingText('');
        await sleep(50);
      }

      if (isCancelled) return;
      setIsTyping(false);
      setCurrentTypingText('');
      setTimeout(() => terminalInputRef.current?.focus(), 60);
    };

    runHackerTypewriter();

    return () => {
      isCancelled = true;
    };
  }, [isAboutWindowOpen, aboutTab, fullTerminalHistory]);

  // Window drag handlers for synchronous 1:1 mouse movement
  const handleMouseDown = (
    winName: 'about' | 'resume' | 'mail',
    initialPos: { x: number; y: number },
    e: React.MouseEvent
  ) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('textarea')
    ) {
      return;
    }

    setActiveWindow(winName);

    // If maximized, restore on drag like native Windows OS
    if (winName === 'about' && isAboutMaximized) {
      toggleMaximizeAboutWindow();
    } else if (winName === 'resume' && isResumeMaximized) {
      toggleMaximizeResumeWindow();
    } else if (winName === 'mail' && isMailMaximized) {
      setIsMailMaximized(false);
    }

    isDragging.current = winName;
    if (typeof window !== 'undefined') {
      (window as unknown as { __isDraggingWindow?: boolean }).__isDraggingWindow = true;
    }
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialX: initialPos.x,
      initialY: initialPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - dragStart.current.clientX;
      const dy = e.clientY - dragStart.current.clientY;

      const screenWidth = desktopScreenRef.current?.clientWidth || 1000;
      const screenHeight = desktopScreenRef.current?.clientHeight || 600;

      const minX = -60;
      const maxX = Math.max(0, screenWidth - 200);
      const minY = 0;
      const maxY = Math.max(0, screenHeight - 90);

      const newX = Math.round(Math.max(minX, Math.min(maxX, dragStart.current.initialX + dx)));
      const newY = Math.round(Math.max(minY, Math.min(maxY, dragStart.current.initialY + dy)));

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

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory, currentTypingText]);

  const handleTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const newEntry = [`nikhil@n-verse:~$ ${trimmed}`];

    if (lower === 'clear' || lower === 'cls') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lower === 'help') {
      newEntry.push(
        'Available terminal commands:',
        '  about      - Display developer biography & career overview',
        '  skills     - View core technology stack and tools',
        '  projects   - View verified portfolio applications',
        '  education  - View B.Tech degree, university, and GPA stats',
        '  resume     - Open official resume in PDF viewer window',
        '  contact    - Launch direct email & communication channels',
        '  page       - Switch to graphical Developer Profile page view',
        '  clear      - Clear terminal screen buffer'
      );
    } else if (lower === 'projects' || lower === 'work' || lower === 'portfolio') {
      newEntry.push(
        'Verified Portfolio Applications:',
        '  01. The Brew Club - Creator tipping & crowdfunding platform (Next.js, MongoDB)',
        '  02. Shrinka URL   - High-speed URL shortener & analytics (https://shrinka-url.vercel.app/)',
        '  03. RoadVision    - AI computer vision road hazard detection (GitHub repository)',
        '  04. Know Via      - Contextual knowledge engine & markdown graph (Android APK on GitHub)'
      );
    } else if (lower === 'about' || lower === 'cat about.txt' || lower === 'bio') {
      newEntry.push(
        'Nikhil Singh — Software Engineer & Creative Developer',
        'B.Tech CSE @ Government Engineering College Bilaspur (2024-2028) | CGPA: 7.6/10',
        'Full-stack developer passionate about building practical web and mobile applications,',
        'creating responsive user experiences, and developing scalable solutions using React,',
        'Next.js, Node.js, Express, MongoDB, and Flutter.',
        'Email: nikhilsingh260406@gmail.com | GitHub: github.com/Nikhil-singh-26 | LinkedIn: linkedin.com/in/nikhil-singh-dev'
      );
    } else if (lower === 'skills' || lower === 'stack') {
      newEntry.push(
        'Core Technologies:',
        '  • Languages: Java, JavaScript, TypeScript, C, Dart',
        '  • Frontend: HTML5, CSS3, React, Next.js, Tailwind CSS, Drei, Three.js, Gsap',
        '  • Backend: Node.js, Express.js',
        '  • Databases: MongoDB, Mongoose, PostgreSQL, MySQL',
        '  • Mobile: Flutter',
        '  • DevOps & Tools: Git, GitHub, Postman, Linux, Vercel'
      );
    } else if (lower === 'education') {
      newEntry.push(
        'Academic Credentials:',
        '  • Degree: Bachelor of Technology (B.Tech)',
        '  • Major: Computer Science & Engineering (2024 — 2028)',
        '  • Institution: Government Engineering College Bilaspur (CG)',
        '  • CGPA: 7.6 / 10'
      );
    } else if (lower === 'resume' || lower === 'cv') {
      newEntry.push('Opening official resume document on display...');
      handleOpenResume();
    } else if (lower === 'contact' || lower === 'mail' || lower === 'email') {
      newEntry.push('Opening direct communication channels...');
      handleOpenContact();
    } else if (lower === 'page' || lower === 'gui' || lower === 'profile') {
      newEntry.push('Switching to graphical Developer Profile page view...');
      setAboutTab('page');
    } else if (lower === 'cli' || lower === 'term' || lower === 'terminal') {
      newEntry.push('Already in interactive Terminal CLI view.');
      setAboutTab('terminal');
    } else if (lower === 'whoami') {
      newEntry.push('nikhil (Full-Stack Software Engineer & 3D Web Creative)');
    } else if (lower === 'ls' || lower === 'dir') {
      newEntry.push('about.txt   skills.md   projects.json   education.pdf   resume.pdf   contact.sh');
    } else if (lower === 'date') {
      newEntry.push(new Date().toString());
    } else {
      newEntry.push(`bash: command not found: ${trimmed}. Type "help" for available commands.`);
    }

    setTerminalHistory((prev) => [...prev, ...newEntry]);
    setTerminalInput('');
  };

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

  const handleOpenAboutMe = () => {
    openAboutWindow();
    setActiveWindow('about');
    setTimeout(() => terminalInputRef.current?.focus(), 80);
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

  // Only render when user is at the workstation desktop section
  if (activeSection !== 'workstation') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {/* 16:9 Screen Display Boundary Matched 1:1 to the 3D Wall Monitor */}
      <div
        ref={desktopScreenRef}
        data-desktop-screen="true"
        style={
          isPhone
            ? {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%'
              }
            : {
                position: 'absolute',
                left: `${screenBounds.left}px`,
                top: `${screenBounds.top}px`,
                width: `${screenBounds.width}px`,
                height: `${screenBounds.height}px`
              }
        }
        className="pointer-events-none overflow-hidden select-none"
      >
        {/* ================= TRANSPARENT INTERACTIVE HOTSPOTS DIRECTLY OVER 3 WALL FOLDERS ================= */}
        {!isPhone && (
          <>
            {/* Hotspot 1: About Me (Canvas Card: cx=180, cy=154, span y=100..270 on 2048x1152) */}
            <div
              onClick={handleOpenAboutMe}
              style={{
                position: 'absolute',
                left: '8.789%',
                top: '16.32%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(90px, 8.8%, 140px)',
                height: 'clamp(116px, 14.5%, 170px)'
              }}
              className="rounded-2xl cursor-pointer hover:bg-emerald-500/15 hover:ring-1 hover:ring-emerald-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center pointer-events-auto z-10 select-none"
              role="button"
              tabIndex={0}
              title="About Me (Terminal) — Click to open"
            />

            {/* Hotspot 2: Contact (Canvas Card: cx=180, cy=384, span y=330..500 on 2048x1152) */}
            <div
              onClick={handleOpenContact}
              style={{
                position: 'absolute',
                left: '8.789%',
                top: '36.28%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(90px, 8.8%, 140px)',
                height: 'clamp(116px, 14.5%, 170px)'
              }}
              className="rounded-2xl cursor-pointer hover:bg-blue-500/15 hover:ring-1 hover:ring-blue-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center pointer-events-auto z-10 select-none"
              role="button"
              tabIndex={0}
              title="Contact & Mail — Click to open"
            />

            {/* Hotspot 3: Resume (Canvas Card: cx=180, cy=614, span y=560..730 on 2048x1152) */}
            <div
              onClick={handleOpenResume}
              style={{
                position: 'absolute',
                left: '8.789%',
                top: '56.25%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(90px, 8.8%, 140px)',
                height: 'clamp(116px, 14.5%, 170px)'
              }}
              className="rounded-2xl cursor-pointer hover:bg-yellow-500/15 hover:ring-1 hover:ring-yellow-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center pointer-events-auto z-10 select-none"
              role="button"
              tabIndex={0}
              title="Resume (PDF Viewer) — Click to open"
            />
          </>
        )}

        {/* ================= WINDOW 1: ABOUT ME (AUTHENTIC LINUX/WINDOWS TERMINAL) ================= */}
        {isAboutWindowOpen && !isAboutMinimized && (
          <div
            onClick={() => setActiveWindow('about')}
            style={
              isPhone
                ? {
                    position: 'fixed',
                    left: isAboutMaximized ? 0 : '8px',
                    right: isAboutMaximized ? 0 : '8px',
                    top: isAboutMaximized ? 0 : '12px',
                    bottom: '56px',
                    width: 'auto',
                    height: 'auto',
                    zIndex: activeWindow === 'about' ? 50 : 35
                  }
                : {
                    position: 'absolute',
                    left: isAboutMaximized ? 0 : `${aboutPos.x}px`,
                    top: isAboutMaximized ? 0 : `${aboutPos.y}px`,
                    width: isAboutMaximized ? '100%' : 'min(780px, calc(100% - 20px))',
                    height: isAboutMaximized ? 'calc(100% - 44px)' : 'min(500px, calc(100% - 50px))',
                    zIndex: activeWindow === 'about' ? 50 : 35
                  }
            }
            className="bg-[#050912]/98 border border-emerald-500/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (Minimize, Maximize/Restore, Close) */}
            <div
              onMouseDown={(e) => !isPhone && handleMouseDown('about', aboutPos, e)}
              className={`bg-[#0b121f] px-3 py-2 border-b border-white/15 flex items-center justify-between ${
                isPhone ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
              } select-none shrink-0`}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white">
                  bash — nikhil@archlinux: ~
                </span>
                <span className="hidden sm:inline text-[10px] font-mono text-emerald-400/70 border border-emerald-500/30 px-1.5 py-0.2 rounded bg-emerald-950/40">
                  Arch Linux x86_64
                </span>
              </div>

              {/* View Mode Tabs (Terminal CLI vs Developer Profile) */}
              <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-md border border-white/10">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setAboutTab('terminal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    aboutTab === 'terminal'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  &gt;_ CLI
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setAboutTab('page')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    aboutTab === 'page'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Profile
                </button>
              </div>

              {/* 3 Working Controls: Minimize, Maximize/Restore, Close */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeAboutWindow();
                  }}
                  className="p-1 rounded text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  aria-label="Minimize Window"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximizeAboutWindow();
                  }}
                  className="p-1 rounded text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  aria-label={isAboutMaximized ? 'Restore Window' : 'Maximize Window'}
                  title={isAboutMaximized ? 'Restore' : 'Maximize'}
                >
                  {isAboutMaximized ? <Maximize2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAboutWindow();
                  }}
                  className="p-1 rounded text-white/70 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Window"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            {aboutTab === 'terminal' ? (
              <div
                ref={terminalScrollRef}
                onClick={() => {
                  if (isTyping) skipTyping();
                  else terminalInputRef.current?.focus();
                }}
                className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-[#03060c] text-slate-200 select-text cursor-text"
              >
                {/* Skip button during typing */}
                {isTyping && (
                  <div className="flex justify-end pb-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        skipTyping();
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                    >
                      Skip animation ⏭
                    </button>
                  </div>
                )}

                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      line.startsWith('nikhil@')
                        ? 'text-emerald-400 font-bold'
                        : line.startsWith('┌') || line.startsWith('│') || line.startsWith('└')
                        ? 'text-emerald-400 font-bold tracking-wider'
                        : line.startsWith('[SYS_BOOT]') || line.startsWith('[KERNEL]')
                        ? 'text-sky-300 font-semibold'
                        : line.startsWith('[PROFILE]') || line.startsWith('[CORE_STACK]') || line.startsWith('[ACADEMICS]') || line.startsWith('[PROJECTS]') || line.startsWith('[STATUS]')
                        ? 'text-amber-300 font-semibold'
                        : line.startsWith('===') || line.startsWith('Available') || line.startsWith('Core') || line.startsWith('Academic') || line.startsWith('Verified')
                        ? 'text-yellow-400 font-semibold'
                        : line.startsWith('  •') || line.startsWith('  about') || line.startsWith('  skills') || line.startsWith('  0')
                        ? 'text-sky-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {/* Active word/letter streaming line with blinking hacker cursor */}
                {isTyping && (
                  <div className="flex items-center text-emerald-400 font-mono font-bold leading-relaxed whitespace-pre-wrap">
                    <span>{currentTypingText}</span>
                    <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
                  </div>
                )}

                {/* Input Prompt (Focused when typing completes) */}
                {!isTyping && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTerminalCommand(terminalInput);
                    }}
                    className="flex items-center gap-1.5 pt-1 text-emerald-400"
                  >
                    <span className="font-bold select-none">nikhil@n-verse:~$</span>
                    <input
                      ref={terminalInputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent text-white outline-none border-none font-mono text-xs caret-emerald-400 p-0"
                      autoFocus
                      spellCheck={false}
                    />
                  </form>
                )}
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#080d1a] text-slate-200 select-text">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg shrink-0">
                    <img src="/mypic.png" alt={profileData.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">{profileData.name}</h3>
                    <p className="text-xs text-emerald-400 font-mono">{profileData.role}</p>
                    <p className="text-[11px] text-white/60">B.Tech CSE @ Government Engineering College Bilaspur (2024-2028)</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                        CGPA: 7.6 / 10
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono">
                        Open for Opportunities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider font-mono">Core Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Flutter', 'TypeScript', 'Java', 'Tailwind CSS', 'Three.js'].map((sk) => (
                      <span key={sk} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleOpenResume}
                    className="flex-1 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Resume Window</span>
                  </button>
                  <button
                    onClick={handleOpenContact}
                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Contact Window</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= WINDOW 2: CONTACT (STRICT BLACK, WHITE, BLUE, YELLOW) ================= */}
        {isMailOpen && !isMailMinimized && (
          <div
            onClick={() => setActiveWindow('mail')}
            style={
              isPhone
                ? {
                    position: 'fixed',
                    left: isMailMaximized ? 0 : '8px',
                    right: isMailMaximized ? 0 : '8px',
                    top: isMailMaximized ? 0 : '12px',
                    bottom: '56px',
                    width: 'auto',
                    height: 'auto',
                    zIndex: activeWindow === 'mail' ? 50 : 35
                  }
                : {
                    position: 'absolute',
                    left: isMailMaximized ? 0 : `${mailPos.x}px`,
                    top: isMailMaximized ? 0 : `${mailPos.y}px`,
                    width: isMailMaximized ? '100%' : 'min(700px, calc(100% - 20px))',
                    height: isMailMaximized ? 'calc(100% - 44px)' : 'min(500px, calc(100% - 50px))',
                    zIndex: activeWindow === 'mail' ? 50 : 35
                  }
            }
            className="bg-black border-2 border-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (Minimize, Maximize/Restore, Close) */}
            <div
              onMouseDown={(e) => !isPhone && handleMouseDown('mail', mailPos, e)}
              className={`bg-[#050505] px-3 py-2 border-b border-white flex items-center justify-between ${
                isPhone ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
              } select-none shrink-0`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono text-xs font-bold text-white">
                  Direct Communications &amp; Mail — Nikhil Singh
                </span>
              </div>

              {/* 3 Working Controls: Minimize, Maximize/Restore, Close */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMailMinimized(true);
                  }}
                  className="p-1 rounded text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold transition-colors cursor-pointer"
                  aria-label="Minimize Window"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMailMaximized((prev) => !prev);
                  }}
                  className="p-1 rounded text-blue-400 hover:bg-blue-600 hover:text-white font-bold transition-colors cursor-pointer"
                  aria-label={isMailMaximized ? 'Restore Window' : 'Maximize Window'}
                  title={isMailMaximized ? 'Restore' : 'Maximize'}
                >
                  {isMailMaximized ? <Maximize2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMailOpen(false);
                  }}
                  className="p-1 rounded text-white hover:bg-white hover:text-black font-bold transition-colors cursor-pointer"
                  aria-label="Close Window"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content (Strict Black, White, Blue, Yellow) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black text-white select-text">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm font-mono">
                  Direct Communications Channel
                </h4>
                <span className="text-[10px] font-mono text-yellow-400 border border-yellow-400/60 bg-yellow-400/10 px-2 py-0.5 rounded font-bold">
                  ● Available for Opportunities
                </span>
              </div>

              {/* Direct Email Address Copy Card */}
              <div className="bg-[#0c0c0c] rounded-lg p-3 border border-white/20 space-y-1.5">
                <div className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider font-bold">
                  Direct Email Address
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-white select-all">
                    {contactData.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-yellow-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
              </div>

              {/* Compose Message Form */}
              <div className="bg-[#0c0c0c] rounded-lg p-3 border border-white/20 space-y-2">
                <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">
                  Compose Message
                </div>
                <input
                  type="text"
                  placeholder="Subject (e.g. Software Engineer Opportunity / Project Collab)"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full bg-black border border-white/30 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 font-mono"
                />
                <textarea
                  rows={3}
                  placeholder="Your message..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-black border border-white/30 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 resize-none font-mono"
                />
                <a
                  href={`mailto:${contactData.email}?subject=${encodeURIComponent(
                    contactSubject || 'N-VERSE Portfolio Inquiry'
                  )}&body=${encodeURIComponent(contactMessage)}`}
                  className="w-full py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Send via Email Client</span>
                </a>
              </div>

              {/* Verified Profiles */}
              <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-white/70">Verified Channels:</span>
                <div className="flex items-center gap-2">
                  {contactData.github && (
                    <a
                      href={contactData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {contactData.linkedin && (
                    <a
                      href={contactData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black hover:bg-blue-600 hover:text-white border border-blue-500 text-blue-400 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      <LinkedinIcon className="w-3 h-3" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= WINDOW 3: RESUME (PDF DOCUMENT VIEWER - STRICTLY ONLY CROSS 'X') ================= */}
        {isResumeWindowOpen && !isResumeMinimized && (
          <div
            onClick={() => setActiveWindow('resume')}
            style={
              isPhone
                ? {
                    position: 'fixed',
                    left: isResumeMaximized ? 0 : '8px',
                    right: isResumeMaximized ? 0 : '8px',
                    top: isResumeMaximized ? 0 : '12px',
                    bottom: '56px',
                    width: 'auto',
                    height: 'auto',
                    zIndex: activeWindow === 'resume' ? 50 : 35
                  }
                : {
                    position: 'absolute',
                    left: isResumeMaximized ? 0 : `${resumePos.x}px`,
                    top: isResumeMaximized ? 0 : `${resumePos.y}px`,
                    width: isResumeMaximized ? '100%' : 'min(820px, calc(100% - 20px))',
                    height: isResumeMaximized ? 'calc(100% - 44px)' : 'min(520px, calc(100% - 50px))',
                    zIndex: activeWindow === 'resume' ? 50 : 35
                  }
            }
            className="bg-[#0b121e] border border-yellow-500/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (STRICT REQUIREMENT: ONLY CROSS 'X' BUTTON, NO MIN/MAX) */}
            <div
              onMouseDown={(e) => !isPhone && handleMouseDown('resume', resumePos, e)}
              className={`bg-[#0f172a] px-3 py-2 border-b border-white/15 flex items-center justify-between ${
                isPhone ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
              } select-none shrink-0`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-mono text-xs font-bold text-white">
                  Nikhil_Singh_Resume.pdf — Official Document Viewer
                </span>
              </div>

              {/* Title Bar Controls: ONLY CLOSE ('X') BUTTON PER USER REQUIREMENT */}
              <div className="flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeResumeWindow();
                  }}
                  className="p-1 rounded text-white/70 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Resume Window"
                  title="Close Window"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top Toolbar: Full View in New Tab + Zoom Controls + Download */}
            <div className="bg-[#131d2e] px-3 py-1.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setResumeZoom((prev) => Math.min(140, prev + 10))}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setResumeZoom((prev) => Math.max(70, prev - 10))}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-white/60 min-w-[36px] text-center">
                  {resumeZoom}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* STRICT USER REQUIREMENT: Full view option that opens in new tab */}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-sm"
                  title="Open PDF document in external browser tab"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden xs:inline">Open Full View in New Tab</span>
                  <span className="xs:hidden">Full View</span>
                </button>

                <a
                  href="/resume.pdf"
                  download="Nikhil_Singh_Resume.pdf"
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs font-mono transition-colors shadow-sm"
                  title="Download official PDF copy"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Scrollable Document Page Container */}
            <div
              className="flex-1 p-3 overflow-y-auto bg-[#182234] flex flex-col items-center"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div
                style={{
                  width: `${resumeZoom}%`,
                  maxWidth: '740px',
                  minWidth: isPhone ? 'min(100%, 280px)' : '420px',
                  transition: 'width 0.12s ease-out'
                }}
                className="bg-white rounded shadow-2xl border border-slate-300 p-2 sm:p-3 my-1 flex flex-col items-center select-none"
              >
                {/* High-Resolution Document Sheet Rendered from public/resume.pdf */}
                <img
                  src="/resume-preview.png"
                  alt="Nikhil Singh Official Resume Document Sheet"
                  className="w-full h-auto rounded block shadow-sm"
                  draggable={false}
                />
              </div>

              {/* End of Document Banner */}
              <div className="w-full max-w-[740px] mt-3 p-3 rounded-lg bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white/80">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>End of Resume Sheet</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank');
                  }}
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  ↗ Open Full PDF in New Tab
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SOLID NON-OVERLAPPING INTERACTIVE TASKBAR (BOTTOM - DESKTOP ONLY) ================= */}
        {!isPhone && (isAboutWindowOpen || isMailOpen || isResumeWindowOpen) && (
          <div className="h-11 sm:h-12 w-full absolute bottom-0 inset-x-0 px-3 sm:px-4 flex items-center justify-between z-40 select-none pointer-events-none">
            {/* Start Logo Hotspot on left (aligned over canvas Start logo) */}
            <div
              onClick={handleOpenAboutMe}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto"
              title="Start — Click to launch Terminal"
              role="button"
              tabIndex={0}
            >
              <div className="w-16 h-7" />
            </div>

            {/* Running Application Tabs Centered in the Middle (One entry per open window) */}
            <nav
              aria-label="Running Applications Taskbar"
              className="flex items-center gap-2 pointer-events-auto"
            >
              {/* Terminal Tab */}
              {isAboutWindowOpen && (
                <button
                  type="button"
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border relative cursor-pointer select-none ${
                    activeWindow === 'about' && !isAboutMinimized
                      ? 'bg-[#101b2b] text-white border-emerald-400/80 shadow-[0_2px_10px_rgba(16,185,129,0.2)] font-semibold'
                      : isAboutMinimized
                      ? 'bg-[#080d16] text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
                      : 'bg-[#0c1422] text-slate-300 hover:text-white border-white/15 hover:border-white/30'
                  }`}
                  aria-label={`Terminal window (${
                    activeWindow === 'about' && !isAboutMinimized
                      ? 'Active'
                      : isAboutMinimized
                      ? 'Minimized'
                      : 'Inactive'
                  })`}
                  title={`Terminal — About (${
                    activeWindow === 'about' && !isAboutMinimized ? 'Active' : isAboutMinimized ? 'Minimized' : 'Running'
                  })`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] tracking-tight hidden sm:inline whitespace-nowrap">
                    Terminal — About
                  </span>
                  {activeWindow === 'about' && !isAboutMinimized ? (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald-400 rounded-full" />
                  ) : !isAboutMinimized ? (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-500" />
                  ) : null}
                </button>
              )}

              {/* Contact / Mail Tab */}
              {isMailOpen && (
                <button
                  type="button"
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border relative cursor-pointer select-none ${
                    activeWindow === 'mail' && !isMailMinimized
                      ? 'bg-[#0e1d32] text-white border-sky-400/80 shadow-[0_2px_10px_rgba(56,189,248,0.2)] font-semibold'
                      : isMailMinimized
                      ? 'bg-[#080d16] text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
                      : 'bg-[#0c1422] text-slate-300 hover:text-white border-white/15 hover:border-white/30'
                  }`}
                  aria-label={`Mail window (${
                    activeWindow === 'mail' && !isMailMinimized
                      ? 'Active'
                      : isMailMinimized
                      ? 'Minimized'
                      : 'Inactive'
                  })`}
                  title={`Mail — Contact (${
                    activeWindow === 'mail' && !isMailMinimized ? 'Active' : isMailMinimized ? 'Minimized' : 'Running'
                  })`}
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono text-[11px] tracking-tight hidden sm:inline whitespace-nowrap">
                    Mail — Contact
                  </span>
                  {activeWindow === 'mail' && !isMailMinimized ? (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-sky-400 rounded-full" />
                  ) : !isMailMinimized ? (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-500" />
                  ) : null}
                </button>
              )}

              {/* Resume Tab */}
              {isResumeWindowOpen && (
                <button
                  type="button"
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border relative cursor-pointer select-none ${
                    activeWindow === 'resume' && !isResumeMinimized
                      ? 'bg-[#221c0e] text-white border-amber-400/80 shadow-[0_2px_10px_rgba(251,191,36,0.2)] font-semibold'
                      : isResumeMinimized
                      ? 'bg-[#080d16] text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
                      : 'bg-[#0c1422] text-slate-300 hover:text-white border-white/15 hover:border-white/30'
                  }`}
                  aria-label={`Resume viewer (${
                    activeWindow === 'resume' && !isResumeMinimized
                      ? 'Active'
                      : isResumeMinimized
                      ? 'Minimized'
                      : 'Inactive'
                  })`}
                  title={`Resume.pdf (${
                    activeWindow === 'resume' && !isResumeMinimized ? 'Active' : isResumeMinimized ? 'Minimized' : 'Running'
                  })`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-[11px] tracking-tight hidden sm:inline whitespace-nowrap">
                    Resume.pdf
                  </span>
                  {activeWindow === 'resume' && !isResumeMinimized ? (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-amber-400 rounded-full" />
                  ) : !isResumeMinimized ? (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-500" />
                  ) : null}
                </button>
              )}
            </nav>

            {/* Spacer on right ensuring taskbar tabs stay centered */}
            <div className="w-16 sm:w-24 shrink-0" />
          </div>
        )}
      </div>

      {/* ================= MOBILE FLOATING WORKSTATION LAUNCHER DOCK ================= */}
      {isPhone && (
        <div
          className={`fixed inset-x-0 z-40 flex justify-center px-3 pointer-events-none transition-all duration-200 ${
            (isAboutWindowOpen && !isAboutMinimized) ||
            (isMailOpen && !isMailMinimized) ||
            (isResumeWindowOpen && !isResumeMinimized)
              ? 'bottom-2.5'
              : 'bottom-16'
          }`}
        >
          <nav
            aria-label="Mobile Workstation Launcher"
            className="bg-[#0c121d]/95 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 flex items-center gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.85)] pointer-events-auto"
          >
            {/* Terminal tab */}
            <button
              type="button"
              onClick={() => {
                if (isAboutWindowOpen && !isAboutMinimized && activeWindow === 'about') {
                  minimizeAboutWindow();
                } else {
                  handleOpenAboutMe();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border touch-manipulation cursor-pointer ${
                isAboutWindowOpen && !isAboutMinimized && activeWindow === 'about'
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : isAboutWindowOpen
                  ? 'bg-[#101b2b] text-slate-300 border-white/10'
                  : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
              }`}
              aria-label="Terminal"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Terminal</span>
            </button>

            {/* Resume tab */}
            <button
              type="button"
              onClick={() => {
                if (isResumeWindowOpen && !isResumeMinimized && activeWindow === 'resume') {
                  minimizeResumeWindow();
                } else {
                  handleOpenResume();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border touch-manipulation cursor-pointer ${
                isResumeWindowOpen && !isResumeMinimized && activeWindow === 'resume'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : isResumeWindowOpen
                  ? 'bg-[#221c0e] text-slate-300 border-white/10'
                  : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
              }`}
              aria-label="Resume"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Resume</span>
            </button>

            {/* Contact tab */}
            <button
              type="button"
              onClick={() => {
                if (isMailOpen && !isMailMinimized && activeWindow === 'mail') {
                  setIsMailMinimized(true);
                } else {
                  handleOpenContact();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border touch-manipulation cursor-pointer ${
                isMailOpen && !isMailMinimized && activeWindow === 'mail'
                  ? 'bg-sky-500/25 text-sky-300 border-sky-400 font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                  : isMailOpen
                  ? 'bg-[#0e1d32] text-slate-300 border-white/10'
                  : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
              }`}
              aria-label="Contact"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Contact</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
