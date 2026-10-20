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
  const [aboutPos, setAboutPos] = useState({ x: 180, y: 35 });
  const [resumePos, setResumePos] = useState({ x: 230, y: 45 });
  const [mailPos, setMailPos] = useState({ x: 200, y: 55 });

  const isDragging = useRef<'about' | 'resume' | 'mail' | null>(null);
  const dragStart = useRef({ clientX: 0, clientY: 0, initialX: 0, initialY: 0 });
  const desktopScreenRef = useRef<HTMLDivElement | null>(null);

  // Resume Document Viewer State
  const [resumeZoom, setResumeZoom] = useState(100);

  // Contact Form State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Terminal State
  const [aboutTab, setAboutTab] = useState<'terminal' | 'page'>('terminal');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'nikhil@n-verse:~$ ./about_me.sh',
    '========================================================================',
    ' [SYSINFO]   Arch Linux (x86_64) | Host: N-VERSE Workstation',
    ' [USER]      nikhil (Nikhil Singh)',
    ' [STATUS]    Active • Full-Stack Software Engineer & 3D Web Creative',
    ' [LOCATION]  Bilaspur, Chhattisgarh, India (Open to Remote / Relocate)',
    '========================================================================',
    '',
    'Code. Learn. Build. Repeat.',
    '',
    '[SUMMARY]',
    'Full-stack developer passionate about building practical web and mobile applications,',
    'creating responsive user experiences, and developing scalable solutions using React,',
    'Next.js, Node.js, Express, MongoDB, and Flutter.',
    '',
    '[ACADEMIC CREDENTIALS]',
    '• Degree:      B.Tech in Computer Science & Engineering (2024 — 2028)',
    '• Institution: Government Engineering College Bilaspur (CG)',
    '• Performance: CGPA 7.6 / 10',
    '',
    'Type "help", "skills", "education", "resume", "contact", or "clear" below.'
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);

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
  }, [terminalHistory]);

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
        '  education  - View B.Tech degree, university, and GPA stats',
        '  resume     - Open official resume in PDF viewer window',
        '  contact    - Launch direct email & communication channels',
        '  page       - Switch to graphical Developer Profile page view',
        '  clear      - Clear terminal screen buffer'
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
      newEntry.push('about.txt   skills.md   education.pdf   resume.pdf   contact.sh');
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
      ref={desktopScreenRef}
      className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 52px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 56px)'
      }}
    >
      {/* 16:9 Screen Display Boundary Matched to the 3D Wall Monitor (100% Transparent - No duplicate wallpaper/border) */}
      <div
        data-desktop-screen="true"
        style={{
          width: '100%',
          maxWidth: 'min(calc(100vw - 40px), calc((100vh - 120px) * (16 / 9)))',
          aspectRatio: '16 / 9'
        }}
        className="relative pointer-events-none overflow-hidden select-none"
      >
        {/* ================= TRANSPARENT INTERACTIVE HOTSPOTS OVER 3 WALL FOLDERS ================= */}
        <div className="absolute left-3 sm:left-5 md:left-7 top-4 sm:top-6 md:top-8 flex flex-col gap-4 sm:gap-6 md:gap-8 pointer-events-auto z-10 select-none">
          {/* Hotspot 1: About Me */}
          <div
            onClick={handleOpenAboutMe}
            className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-2xl cursor-pointer hover:bg-emerald-500/15 hover:ring-1 hover:ring-emerald-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center"
            role="button"
            tabIndex={0}
            title="About Me (Terminal) — Click to open"
          />

          {/* Hotspot 2: Contact */}
          <div
            onClick={handleOpenContact}
            className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-2xl cursor-pointer hover:bg-blue-500/15 hover:ring-1 hover:ring-blue-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center"
            role="button"
            tabIndex={0}
            title="Contact & Mail — Click to open"
          />

          {/* Hotspot 3: Resume */}
          <div
            onClick={handleOpenResume}
            className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-2xl cursor-pointer hover:bg-yellow-500/15 hover:ring-1 hover:ring-yellow-400/40 border border-transparent transition-all active:scale-95 flex flex-col items-center justify-center"
            role="button"
            tabIndex={0}
            title="Resume (PDF Viewer) — Click to open"
          />
        </div>

        {/* ================= WINDOW 1: ABOUT ME (AUTHENTIC LINUX/WINDOWS TERMINAL) ================= */}
        {isAboutWindowOpen && !isAboutMinimized && (
          <div
            onClick={() => setActiveWindow('about')}
            style={{
              position: 'absolute',
              left: isAboutMaximized ? 0 : `${aboutPos.x}px`,
              top: isAboutMaximized ? 0 : `${aboutPos.y}px`,
              width: isAboutMaximized ? '100%' : 'min(780px, calc(100% - 20px))',
              height: isAboutMaximized ? 'calc(100% - 44px)' : 'min(500px, calc(100% - 50px))',
              zIndex: activeWindow === 'about' ? 50 : 35
            }}
            className="bg-[#050912]/98 border border-emerald-500/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (Minimize, Maximize/Restore, Close) */}
            <div
              onMouseDown={(e) => handleMouseDown('about', aboutPos, e)}
              className="bg-[#0b121f] px-3 py-2 border-b border-white/15 flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
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
                onClick={() => terminalInputRef.current?.focus()}
                className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 bg-[#03060c] text-slate-200 select-text cursor-text"
              >
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      line.startsWith('nikhil@')
                        ? 'text-emerald-400 font-bold'
                        : line.startsWith('===') || line.startsWith('Available') || line.startsWith('Core') || line.startsWith('Academic')
                        ? 'text-yellow-400 font-semibold'
                        : line.startsWith('  •') || line.startsWith('  about') || line.startsWith('  skills')
                        ? 'text-sky-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {/* Input Prompt */}
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
            style={{
              position: 'absolute',
              left: isMailMaximized ? 0 : `${mailPos.x}px`,
              top: isMailMaximized ? 0 : `${mailPos.y}px`,
              width: isMailMaximized ? '100%' : 'min(700px, calc(100% - 20px))',
              height: isMailMaximized ? 'calc(100% - 44px)' : 'min(500px, calc(100% - 50px))',
              zIndex: activeWindow === 'mail' ? 50 : 35
            }}
            className="bg-black border-2 border-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (Minimize, Maximize/Restore, Close) */}
            <div
              onMouseDown={(e) => handleMouseDown('mail', mailPos, e)}
              className="bg-[#050505] px-3 py-2 border-b border-white flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
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
            style={{
              position: 'absolute',
              left: isResumeMaximized ? 0 : `${resumePos.x}px`,
              top: isResumeMaximized ? 0 : `${resumePos.y}px`,
              width: isResumeMaximized ? '100%' : 'min(820px, calc(100% - 20px))',
              height: isResumeMaximized ? 'calc(100% - 44px)' : 'min(520px, calc(100% - 50px))',
              zIndex: activeWindow === 'resume' ? 50 : 35
            }}
            className="bg-[#0b121e] border border-yellow-500/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Title Bar (STRICT REQUIREMENT: ONLY CROSS 'X' BUTTON, NO MIN/MAX) */}
            <div
              onMouseDown={(e) => handleMouseDown('resume', resumePos, e)}
              className="bg-[#0f172a] px-3 py-2 border-b border-white/15 flex items-center justify-between cursor-grab active:cursor-grabbing select-none shrink-0"
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
                  <span>Open Full View in New Tab</span>
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
                  minWidth: '420px',
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

        {/* ================= TRANSPARENT INTERACTIVE TASKBAR (BOTTOM) ================= */}
        {(isAboutWindowOpen || isMailOpen || isResumeWindowOpen) && (
          <div className="h-11 sm:h-12 w-full absolute bottom-0 inset-x-0 px-3 sm:px-4 flex items-center justify-between z-40 select-none pointer-events-none">
            {/* Start Logo Hotspot on left */}
            <div
              onClick={handleOpenAboutMe}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors cursor-pointer pointer-events-auto"
              title="Start"
            >
              <div className="w-16 h-7" />
            </div>

            {/* Running Applications Tabs Centered in the Middle (Windows 11 Style) */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border relative cursor-pointer ${
                    activeWindow === 'about' && !isAboutMinimized
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold shadow-md backdrop-blur-sm'
                      : 'bg-black/70 text-white/70 hover:bg-white/10 border-white/20'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px] hidden sm:inline">Terminal — About</span>
                  {activeWindow === 'about' && !isAboutMinimized && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              )}

              {/* Contact Tab */}
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border relative cursor-pointer ${
                    activeWindow === 'mail' && !isMailMinimized
                      ? 'bg-blue-600/40 text-yellow-300 border-blue-400 font-bold shadow-md backdrop-blur-sm'
                      : 'bg-black/70 text-white/70 hover:bg-white/10 border-white/20'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-[11px] hidden sm:inline">Mail — Contact</span>
                  {activeWindow === 'mail' && !isMailMinimized && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                  )}
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border relative cursor-pointer ${
                    activeWindow === 'resume' && !isResumeMinimized
                      ? 'bg-yellow-500/30 text-yellow-300 border-yellow-400 font-bold shadow-md backdrop-blur-sm'
                      : 'bg-black/70 text-white/70 hover:bg-white/10 border-white/20'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-mono text-[11px] hidden sm:inline">Resume.pdf</span>
                  {activeWindow === 'resume' && !isResumeMinimized && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-yellow-400 rounded-full" />
                  )}
                </button>
              )}
            </div>

            <div className="w-20" />
          </div>
        )}
      </div>
    </div>
  );
}
