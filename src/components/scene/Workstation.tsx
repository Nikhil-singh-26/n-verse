'use client';

import '@/lib/react-patch';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
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
  Terminal,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

const HTML_DESKTOP_POSITION: [number, number, number] = [0, 0, 0.02];

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

  // Active top window management (focus z-index)
  const [activeWindow, setActiveWindow] = useState<'about' | 'resume' | 'mail'>('about');
  const [isMailMinimized, setIsMailMinimized] = useState(false);
  const [isMailMaximized, setIsMailMaximized] = useState(false);

  // Draggable window coordinates on the single large screen (1760px x 990px)
  // Left side (x: 0 to 320) reserved for the 3 desktop folders
  const [aboutPos, setAboutPos] = useState({ x: 340, y: 55 });
  const [resumePos, setResumePos] = useState({ x: 420, y: 70 });
  const [mailPos, setMailPos] = useState({ x: 380, y: 80 });

  // Virtual desktop reference for accurate 3D scale tracking
  const desktopScreenRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<string | null>(null);
  const dragStart = useRef({ clientX: 0, clientY: 0, initialX: 0, initialY: 0 });

  // Resume document viewer zoom state (60% to 180%)
  const [resumeZoom, setResumeZoom] = useState<number>(100);

  // Clock state for the taskbar
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [currentDate, setCurrentDate] = useState('10/18/2026');

  // Copy email feedback state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedResumeLink, setCopiedResumeLink] = useState(false);

  // Mail form state
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Terminal Streaming & CLI State
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

  // 3D Screen Canvas Texture (Guaranteed 100% visibly ON with wallpaper & 3 folders)
  const [screenCanvasTexture, setScreenCanvasTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Draw the full desktop screen (wallpaper, 3 folders, taskbar, active window) directly to canvas
  const renderScreenTexture = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Helper for rounded rectangles
    const drawRRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // 1. Wallpaper Background: /background.jpg if loaded, or vibrant sunset ocean
    if (bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0) {
      ctx.drawImage(bgImgRef.current, 0, 0, width, height);
    } else {
      // Stunning cinematic 4K sunset ocean gradient
      const sky = ctx.createLinearGradient(0, 0, 0, 720);
      sky.addColorStop(0, '#090e1a');
      sky.addColorStop(0.35, '#2e1065');
      sky.addColorStop(0.62, '#9d174d');
      sky.addColorStop(0.82, '#ea580c');
      sky.addColorStop(1, '#f59e0b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, 720);

      // Sun disc & glow
      const sun = ctx.createRadialGradient(1280, 640, 10, 1280, 640, 260);
      sun.addColorStop(0, '#fffbeb');
      sun.addColorStop(0.3, 'rgba(254, 240, 138, 0.7)');
      sun.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(1020, 380, 520, 420);

      // Ocean with sunset reflection
      const ocean = ctx.createLinearGradient(0, 720, 0, height);
      ocean.addColorStop(0, '#78350f');
      ocean.addColorStop(0.14, '#1e1b4b');
      ocean.addColorStop(1, '#090d16');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 720, width, height - 720);
    }

    // 2. Subtle glass vignette overlay
    const vig = ctx.createRadialGradient(width / 2, height / 2, 400, width / 2, height / 2, 1200);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);

    // 3. Desktop Folders on Left Side (About, Contact, Resume)
    // Draw Desktop Icon Cards (Terminal for About, Mail for Contact, Document Page for Resume)
    const drawDesktopAppCard = (
      x: number,
      y: number,
      title: string,
      subtitle: string,
      type: 'terminal' | 'mail' | 'file',
      mainColor: string,
      subColor: string
    ) => {
      const w = 180;
      const h = 190;
      const cx = x + w / 2;
      const cy = y + 54;

      // Desktop App Shortcut (Clean rounded icon tile with shadow)
      drawRRect(cx - 36, cy - 36, 72, 72, 16);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.fill();
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (type === 'terminal') {
        // Console badge with >_ prompt
        ctx.font = 'bold 26px monospace';
        ctx.fillStyle = mainColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('>_', cx, cy);
      } else if (type === 'mail') {
        // Mail envelope
        drawRRect(cx - 24, cy - 18, 48, 36, 6);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 18);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 24, cy - 18);
        ctx.stroke();
      } else {
        // Document page with folded top-right corner
        ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy - 24);
        ctx.lineTo(cx + 8, cy - 24);
        ctx.lineTo(cx + 20, cy - 12);
        ctx.lineTo(cx + 20, cy + 24);
        ctx.lineTo(cx - 20, cy + 24);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 24);
        ctx.lineTo(cx + 8, cy - 12);
        ctx.lineTo(cx + 20, cy - 12);
        ctx.stroke();
      }

      // Shortcut Label
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, cx, y + 120);

      // Subtitle
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = subColor;
      ctx.fillText(subtitle, cx, y + 144);
    };

    // Folder 1: About (Terminal Icon, y = 110)
    drawDesktopAppCard(85, 110, 'About', 'Terminal / Bash', 'terminal', '#10b981', '#a7f3d0');

    // Folder 2: Contact (Mail Envelope, y = 340) - Strict White, Black, Blue, Yellow
    drawDesktopAppCard(85, 340, 'Contact', 'Mail & Channels', 'mail', '#2563eb', '#facc15');

    // Folder 3: Resume (Document Page, y = 570)
    drawDesktopAppCard(85, 570, 'Resume', 'CV', 'file', '#facc15', '#ffffff');

    // 5. Active Windows Drawn directly onto Screen
    if (isAboutWindowOpen && !isAboutMinimized) {
      const wx = 360;
      const wy = 90;
      const ww = 1240;
      const wh = 780;

      // Authentic Solid Jet-Black Linux Terminal Window
      drawRRect(wx, wy, ww, wh, 12);
      ctx.fillStyle = '#020408';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Title bar: Linux Dark Bar
      drawRRect(wx, wy, ww, 48, 12);
      ctx.fillStyle = '#0a1017';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Terminal Window dots (Red, Yellow, Green)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(wx + 22, wy + 24, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx + 42, wy + 24, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wx + 62, wy + 24, 6, 0, Math.PI * 2);
      ctx.fill();

      // Title Text
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('bash — nikhil@archlinux: ~ (pts/0)', wx + 85, wy + 24);

      // Terminal Sub-bar / Host info
      ctx.fillStyle = '#060a10';
      ctx.fillRect(wx + 1, wy + 48, ww - 2, 28);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Linux arch-nverse 6.12.8-arch1-1 x86_64 | zsh 5.9 | user: nikhil', wx + 20, wy + 62);

      // Terminal Content (Authentic interactive terminal rendering)
      let ty = wy + 95;
      const visibleLines = terminalHistory.slice(-20);
      const lineSpacing = 24;
      const clipHeight = wh - 120;
      const totalContentHeight = (visibleLines.length + 1) * lineSpacing;
      if (totalContentHeight > clipHeight) {
        ty = wy + 95 - (totalContentHeight - clipHeight);
      }

      ctx.save();
      // Clip within terminal body
      ctx.beginPath();
      ctx.rect(wx + 12, wy + 76, ww - 24, wh - 85);
      ctx.clip();

      visibleLines.forEach((line) => {
        if (line.startsWith('nikhil@')) {
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#10b981';
        } else if (line.startsWith('===') || line.startsWith('NAME=')) {
          ctx.font = '15px monospace';
          ctx.fillStyle = '#22c55e';
        } else if (line.startsWith('[') || line.startsWith('Type "')) {
          ctx.font = 'bold 15px monospace';
          ctx.fillStyle = '#facc15';
        } else if (line.startsWith(' |') || line.startsWith('  _')) {
          ctx.font = 'bold 14px monospace';
          ctx.fillStyle = '#38bdf8';
        } else {
          ctx.font = '15px monospace';
          ctx.fillStyle = '#f1f5f9';
        }
        ctx.fillText(line, wx + 24, ty);
        ty += lineSpacing;
      });

      // Active prompt with blinking block cursor
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('nikhil@n-verse:~$ █', wx + 24, ty);
      ctx.restore();
    } else if (isResumeWindowOpen && !isResumeMinimized) {
      const wx = 360;
      const wy = 90;
      const ww = 1240;
      const wh = 780;

      // Clean Document Viewer Window Frame
      drawRRect(wx, wy, ww, wh, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Title bar: PDF Document Viewer
      drawRRect(wx, wy, ww, 48, 12);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Window dots - ONLY Close dot (Red Cross Dot)
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(wx + 22, wy + 24, 6, 0, Math.PI * 2); ctx.fill();

      // Title
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('PDF Viewer — resume.pdf (Nikhil Singh)', wx + 48, wy + 24);

      // Document Actions Sub-bar
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(wx + 1, wy + 48, ww - 2, 46);

      // Button: Open Full PDF
      drawRRect(wx + 24, wy + 55, 200, 32, 6);
      ctx.fillStyle = '#2563eb';
      ctx.fill();
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('↗ Open Full View', wx + 124, wy + 71);

      // Button: Download
      drawRRect(wx + 280, wy + 55, 180, 32, 6);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.fillText('📥 Download PDF', wx + 370, wy + 71);

      // Document Path Status
      ctx.font = '13px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'right';
      ctx.fillText('Source: public/resume.pdf  [100% Zoom • 1 of 1]', wx + ww - 24, wy + 71);

      // PDF Sheet Preview (Clean white page aesthetic)
      const pw = 800;
      const ph = 620;
      const px = wx + (ww - pw) / 2;
      const py = wy + 110;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, pw, ph);

      // Sheet Content (Matches real resume)
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('NIKHIL SINGH', px + pw / 2, py + 48);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('FULL STACK SOFTWARE ENGINEER | THREE.JS & CLOUD ARCHITECTURES', px + pw / 2, py + 74);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('nikhilsingh260406@gmail.com  •  github.com/Nikhil-singh-26  •  linkedin.com/in/nikhil-singh-dev', px + pw / 2, py + 95);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 40, py + 112);
      ctx.lineTo(px + pw - 40, py + 112);
      ctx.stroke();

      // Document notice
      ctx.textAlign = 'center';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('📄 Official Resume Loaded from public/resume.pdf', px + pw / 2, py + 220);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Click below or the Resume icon to open the complete document in a new tab.', px + pw / 2, py + 250);

      // Big action button inside sheet
      drawRRect(px + pw / 2 - 160, py + 290, 320, 48, 8);
      ctx.fillStyle = '#2563eb';
      ctx.fill();
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('↗ Click to Open Full PDF', px + pw / 2, py + 314);
    } else if (isMailOpen && !isMailMinimized) {
      const wx = 360;
      const wy = 90;
      const ww = 1240;
      const wh = 780;

      // Pure Black Window Frame with Crisp White Border (Strict White, Black, Blue, Yellow)
      drawRRect(wx, wy, ww, wh, 12);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Title bar: Pure Black with White line
      drawRRect(wx, wy, ww, 48, 12);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Window controls: Yellow, Blue, White
      ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(wx + 22, wy + 24, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(wx + 42, wy + 24, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(wx + 62, wy + 24, 6, 0, Math.PI * 2); ctx.fill();

      // Title: White & Yellow
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('CONTACT & CHANNELS — NIKHIL SINGH', wx + 85, wy + 24);

      // Body: Header
      ctx.font = '900 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('GET IN TOUCH', wx + 48, wy + 105);

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText('DIRECT COMMUNICATIONS & VERIFIED CHANNELS', wx + 48, wy + 145);

      // Section 1: Official Email (Black card, Blue 2px border)
      drawRRect(wx + 48, wy + 175, ww - 96, 95, 8);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText('OFFICIAL INBOX', wx + 75, wy + 205);

      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('nikhilsingh260406@gmail.com', wx + 75, wy + 240);

      // Section 2: Send Message (Mailto)
      drawRRect(wx + 48, wy + 290, ww - 96, 175, 8);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText('COMPOSE MESSAGE', wx + 75, wy + 320);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Subject: Software Engineer Opportunity / Project Collaboration', wx + 75, wy + 355);
      ctx.fillText('Recipient: nikhilsingh260406@gmail.com', wx + 75, wy + 385);

      // Button: Send via Email Client (Electric Blue with White text)
      drawRRect(wx + 75, wy + 410, 360, 42, 6);
      ctx.fillStyle = '#2563eb';
      ctx.fill();
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('✉ SEND EMAIL VIA CLIENT', wx + 255, wy + 431);

      // Section 3: Verified Channels
      ctx.textAlign = 'left';
      // GitHub (Yellow accent)
      drawRRect(wx + 48, wy + 485, (ww - 116) / 2, 75, 8);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText('GITHUB', wx + 75, wy + 512);
      ctx.font = '15px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('github.com/Nikhil-singh-26', wx + 75, wy + 540);

      // LinkedIn (Blue accent)
      const lix = wx + 48 + (ww - 116) / 2 + 20;
      drawRRect(lix, wy + 485, (ww - 116) / 2, 75, 8);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('LINKEDIN', lix + 27, wy + 512);
      ctx.font = '15px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('linkedin.com/in/nikhil-singh-dev', lix + 27, wy + 540);

      // Status Badge (Yellow box with Black text)
      drawRRect(wx + 48, wy + 580, ww - 96, 46, 6);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('● STATUS: OPEN FOR SOFTWARE ENGINEER INTERNSHIPS & FULL-TIME OPPORTUNITIES', wx + ww / 2, wy + 603);
    }

    // 6. Windows Taskbar (y = 1076 to 1152)
    const tby = height - 76;
    ctx.fillStyle = 'rgba(10, 15, 26, 0.96)';
    ctx.fillRect(0, tby, width, 76);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, tby);
    ctx.lineTo(width, tby);
    ctx.stroke();

    // Windows 11 Start 4-Square Logo on the Left
    const wlogoX = 36;
    const wlogoY = tby + 26;
    ctx.fillStyle = '#00adef';
    ctx.fillRect(wlogoX, wlogoY, 10, 10);
    ctx.fillRect(wlogoX + 13, wlogoY, 10, 10);
    ctx.fillRect(wlogoX, wlogoY + 13, 10, 10);
    ctx.fillRect(wlogoX + 13, wlogoY + 13, 10, 10);

    // Active Applications in Taskbar (Centered in the Middle - Windows 11 Style)
    const appTabs = [
      { id: 'about', label: '>_ Terminal', isOpen: isAboutWindowOpen, isMin: isAboutMinimized, color: '#10b981' },
      { id: 'mail', label: '✉ Mail', isOpen: isMailOpen, isMin: isMailMinimized, color: '#38bdf8' },
      { id: 'resume', label: '📄 Resume', isOpen: isResumeWindowOpen, isMin: isResumeMinimized, color: '#facc15' }
    ];
    const openTabs = appTabs.filter((t) => t.isOpen);
    const tabWidth = 170;
    const tabGap = 12;
    const totalW = openTabs.length * tabWidth + Math.max(0, openTabs.length - 1) * tabGap;
    let startX = (width - totalW) / 2;

    openTabs.forEach((tab) => {
      const isActive = activeWindow === tab.id && !tab.isMin;
      drawRRect(startX, tby + 16, tabWidth, 44, 8);
      ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.06)';
      ctx.fill();
      ctx.strokeStyle = isActive ? tab.color : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = isActive ? tab.color : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(tab.label, startX + tabWidth / 2, tby + 38);

      // Windows 11 pill indicator underneath
      if (isActive) {
        ctx.fillStyle = tab.color;
        ctx.fillRect(startX + tabWidth / 2 - 16, tby + 56, 32, 3);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(startX + tabWidth / 2, tby + 57, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      startX += tabWidth + tabGap;
    });

    // Right Tray
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`${currentTime}   ${currentDate}`, width - 36, tby + 38);

    const tex = (canvas as unknown as { __texRef?: THREE.CanvasTexture }).__texRef;
    if (tex) {
      tex.needsUpdate = true;
    }
  }, [
    isAboutWindowOpen,
    isAboutMinimized,
    isResumeWindowOpen,
    isResumeMinimized,
    isMailOpen,
    isMailMinimized,
    activeWindow,
    terminalHistory,
    currentTime,
    currentDate
  ]);

  // Initialize Canvas Texture once on mount
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const width = 2048;
    const height = 1152;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    (canvas as unknown as { __texRef?: THREE.CanvasTexture }).__texRef = texture;
    setScreenCanvasTexture(texture);

    // Initial synchronous draw (instant sunset ocean + 3 folders)
    renderScreenTexture();

    // Preload /background.jpg wallpaper
    const img = new Image();
    img.src = '/background.jpg';
    img.onload = () => {
      bgImgRef.current = img;
      renderScreenTexture();
    };

    return () => {
      texture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live Taskbar Clock
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
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Update canvas texture whenever window states or time change
  useEffect(() => {
    if (screenCanvasTexture) {
      renderScreenTexture();
    }
  }, [renderScreenTexture, screenCanvasTexture]);

  // Window drag handlers for all windows on the large monitor (synchronous 1:1 Windows behavior)
  const handleMouseDown = (
    winName: 'about' | 'resume' | 'mail',
    initialPos: { x: number; y: number },
    e: React.MouseEvent
  ) => {
    // Ignore clicks on buttons, links, inputs, or textareas
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('textarea')
    ) {
      return;
    }

    setActiveWindow(winName);

    // If window is currently maximized, restore it on drag just like native Windows OS
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

      // Calculate real scale factor between viewport pixels and virtual desktop (1760px x 990px)
      const rect = desktopScreenRef.current?.getBoundingClientRect();
      const scaleX = rect && rect.width > 0 ? 1760 / rect.width : 1;
      const scaleY = rect && rect.height > 0 ? 990 / rect.height : 1;

      const dx = (e.clientX - dragStart.current.clientX) * scaleX;
      const dy = (e.clientY - dragStart.current.clientY) * scaleY;

      // Virtual Desktop boundaries (1760 width x 990 height, 56px taskbar at bottom)
      // Allow fluid movement anywhere across the monitor while keeping titlebar accessible
      const minX = -120;
      const maxX = 1760 - 240;
      const minY = 0;
      const maxY = 990 - 56 - 60;

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
  }, [isAboutMaximized, isResumeMaximized, isMailMaximized, toggleMaximizeAboutWindow, toggleMaximizeResumeWindow]);

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

  const handleSendEmailViaClient = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const subject = encodeURIComponent(contactSubject.trim() || 'Software Engineer Opportunity / Project Collaboration');
    const body = encodeURIComponent(
      contactMessage.trim() || 'Hello Nikhil,\n\nI came across your portfolio and would like to connect.'
    );
    const mailtoUrl = `mailto:${contactData.email}?subject=${subject}&body=${body}`;
    if (typeof window !== 'undefined') {
      window.location.href = mailtoUrl;
    }
  };

  // Auto-focus terminal command input whenever About window is opened or brought to front
  useEffect(() => {
    if (isAboutWindowOpen && !isAboutMinimized && activeWindow === 'about') {
      const timer = setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isAboutWindowOpen, isAboutMinimized, activeWindow, aboutTab]);

  // Auto-scroll terminal viewport as new lines arrive
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

  const handleShareResume = async () => {
    const resumeUrl = typeof window !== 'undefined' ? `${window.location.origin}/resume.pdf` : '/resume.pdf';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Nikhil Singh — Resume',
          text: 'Official Resume of Nikhil Singh (Full Stack Software Engineer)',
          url: resumeUrl
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(resumeUrl);
        setCopiedResumeLink(true);
        setTimeout(() => setCopiedResumeLink(false), 2200);
      } catch {
        setCopiedResumeLink(true);
        setTimeout(() => setCopiedResumeLink(false), 2000);
      }
    }
  };

  const handleMeshClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;
    const u = e.uv.x; // 0 (left) to 1 (right)
    const v = e.uv.y; // 0 (bottom) to 1 (top)

    // Taskbar (v < 0.07) - toggle active open window tabs in the MIDDLE
    if (v < 0.07) {
      if (u >= 0.35 && u < 0.45 && isAboutWindowOpen) {
        if (isAboutMinimized) {
          openAboutWindow();
          setActiveWindow('about');
        } else if (activeWindow === 'about') {
          minimizeAboutWindow();
        } else {
          setActiveWindow('about');
        }
      } else if (u >= 0.45 && u < 0.55 && isMailOpen) {
        if (isMailMinimized) {
          setIsMailMinimized(false);
          setActiveWindow('mail');
        } else if (activeWindow === 'mail') {
          setIsMailMinimized(true);
        } else {
          setActiveWindow('mail');
        }
      } else if (u >= 0.55 && u <= 0.65 && isResumeWindowOpen) {
        if (isResumeMinimized) {
          openResumeWindow();
          setActiveWindow('resume');
        } else if (activeWindow === 'resume') {
          minimizeResumeWindow();
        } else {
          setActiveWindow('resume');
        }
      }
      return;
    }

    // Left desktop folders (u: 0.035 to 0.165)
    if (u >= 0.035 && u <= 0.165) {
      // Folder 1: About (v: 0.68 to 0.91)
      if (v >= 0.68 && v <= 0.91) {
        openAboutWindow();
        setActiveWindow('about');
        setTimeout(() => terminalInputRef.current?.focus(), 60);
        return;
      }
      // Folder 2: Contact (v: 0.45 to 0.68)
      if (v >= 0.45 && v <= 0.68) {
        handleOpenContact();
        return;
      }
      // Folder 3: Resume (v: 0.22 to 0.45)
      if (v >= 0.22 && v <= 0.45) {
        handleOpenResume();
        return;
      }
    }

    // Active Window Controls (Close, Minimize, Maximize) on 3D Mesh
    const isAnyWinOpen =
      (isAboutWindowOpen && !isAboutMinimized) ||
      (isResumeWindowOpen && !isResumeMinimized) ||
      (isMailOpen && !isMailMinimized);

    if (isAnyWinOpen) {
      // Close button (Left red dot u: [0.20, 0.235] or Right X u: [0.68, 0.73])
      if (
        (u >= 0.20 && u <= 0.235 && v >= 0.85 && v <= 0.92) ||
        (u >= 0.68 && u <= 0.73 && v >= 0.88 && v <= 0.95)
      ) {
        if (activeWindow === 'about' && isAboutWindowOpen) closeAboutWindow();
        else if (activeWindow === 'resume' && isResumeWindowOpen) closeResumeWindow();
        else if (activeWindow === 'mail' && isMailOpen) setIsMailOpen(false);
        else {
          if (isAboutWindowOpen) closeAboutWindow();
          if (isResumeWindowOpen) closeResumeWindow();
          if (isMailOpen) setIsMailOpen(false);
        }
        return;
      }

      // Minimize button (Only for About and Mail - Resume has NO minimize/maximize)
      if (
        (u >= 0.235 && u <= 0.255 && v >= 0.85 && v <= 0.92) ||
        (u >= 0.63 && u <= 0.675 && v >= 0.88 && v <= 0.95)
      ) {
        if (activeWindow === 'about' && isAboutWindowOpen) minimizeAboutWindow();
        else if (activeWindow === 'mail' && isMailOpen) setIsMailMinimized(true);
        return;
      }

      // Maximize button (Only for About and Mail - Resume has NO minimize/maximize)
      if (
        (u >= 0.255 && u <= 0.28 && v >= 0.85 && v <= 0.92) ||
        (u >= 0.675 && u <= 0.70 && v >= 0.88 && v <= 0.95)
      ) {
        if (activeWindow === 'about' && isAboutWindowOpen) toggleMaximizeAboutWindow();
        else if (activeWindow === 'mail' && isMailOpen) setIsMailMaximized((prev) => !prev);
        return;
      }
    }

    // If Contact window is open and user clicks inside copy/mailto
    if (isMailOpen && !isMailMinimized) {
      if (u >= 0.18 && u <= 0.82 && v >= 0.62 && v <= 0.78) {
        handleCopyEmail();
        return;
      }
    }
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
      <pointLight position={[0, 2.22, -1.0]} color="#38bdf8" intensity={2.2} distance={6.0} />

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

      {/* ================= ONE MAIN LARGE WALL DISPLAY ON FRONT WALL ================= */}
      {/* Mounted on the dark accent wall (Z = -1.25). 4.40m length x 2.475m breadth (16:9 ratio) */}
      <group position={[0, 2.22, -1.25]}>
        {/* Wall Mount Heavy Bracket */}
        <mesh position={[0, 0, -0.06]} castShadow>
          <boxGeometry args={[1.0, 1.0, 0.06]} />
          <meshStandardMaterial color="#11141c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Chassis Back Plate (Z = -0.02, thickness 0.02, front face at -0.01) */}
        <mesh position={[0, 0, -0.02]} castShadow>
          <boxGeometry args={[4.56, 2.62, 0.02]} />
          <meshStandardMaterial color="#121620" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* 3D Emissive Backlit Screen Mesh (Self-illuminated, guaranteed 100% visibly ON with wallpaper & 3 folders) */}
        <mesh
          position={[0, 0, 0.005]}
          onClick={handleMeshClick}
        >
          <planeGeometry args={[4.40, 2.475]} />
          {screenCanvasTexture ? (
            <meshBasicMaterial map={screenCanvasTexture} color="#ffffff" toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#0c1524" toneMapped={false} />
          )}
        </mesh>

        {/* Outer Frame Perimeter Strips */}
        <mesh position={[0, 1.275, 0.006]}>
          <boxGeometry args={[4.56, 0.07, 0.015]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.275, 0.006]}>
          <boxGeometry args={[4.56, 0.07, 0.015]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-2.24, 0, 0.006]}>
          <boxGeometry args={[0.08, 2.48, 0.015]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[2.24, 0, 0.006]}>
          <boxGeometry args={[0.08, 2.48, 0.015]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Interactive HTML Windows Desktop (distanceFactor=1.0 maps 1760px x 990px to exactly 4.40m x 2.475m) */}
        <Html
          transform
          distanceFactor={1.0}
          position={HTML_DESKTOP_POSITION}
          className="pointer-events-auto select-none"
        >
          {/* Desktop Screen Boundary (1760px x 990px) */}
          <div
            ref={desktopScreenRef}
            data-desktop-screen="true"
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '1760px',
              height: '990px',
              backgroundImage: "url('/background.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#0c1524'
            }}
            className="rounded-sm flex flex-col justify-between overflow-hidden text-white font-sans relative select-none shadow-2xl"
          >
            {/* Subtle screen scanline / vignette overlay */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/45 pointer-events-none" />

            {/* Desktop Icons Area: Exactly Three Visible Folders (About, Contact, Resume) on the Left */}
            <div className="absolute left-12 top-12 flex flex-col gap-6 pointer-events-auto z-30 select-none">
              {/* Folder 1: About Me (Terminal & Profile Icon) */}
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openAboutWindow();
                  setActiveWindow('about');
                  setTimeout(() => terminalInputRef.current?.focus(), 60);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openAboutWindow();
                  setActiveWindow('about');
                  setTimeout(() => terminalInputRef.current?.focus(), 60);
                }}
                className="flex flex-col items-center justify-center w-28 p-2 rounded-xl hover:bg-white/10 hover:border-white/20 border border-transparent cursor-pointer group text-center transition-all active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open About Me"
              >
                <div className="w-16 h-16 rounded-xl bg-black/60 border border-emerald-400/50 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-emerald-400 transition-transform">
                  <Terminal className="w-8 h-8 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2 tracking-wide">
                  About Me
                </span>
                <span className="text-[11px] font-mono text-emerald-300/80 drop-shadow">terminal</span>
              </div>

              {/* Folder 2: Contact (Mail Envelope) */}
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleOpenContact();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenContact();
                }}
                className="flex flex-col items-center justify-center w-28 p-2 rounded-xl hover:bg-white/10 hover:border-white/20 border border-transparent cursor-pointer group text-center transition-all active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Contact & Mail"
              >
                <div className="w-16 h-16 rounded-xl bg-black/60 border border-blue-500/50 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-blue-400 transition-transform">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2 tracking-wide">
                  Contact
                </span>
                <span className="text-[11px] font-mono text-yellow-400/80 drop-shadow">channels</span>
              </div>

              {/* Folder 3: Resume (Document Page File) */}
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleOpenResume();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenResume();
                }}
                className="flex flex-col items-center justify-center w-28 p-2 rounded-xl hover:bg-white/10 hover:border-white/20 border border-transparent cursor-pointer group text-center transition-all active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Resume Document"
              >
                <div className="w-16 h-16 rounded-xl bg-black/60 border border-yellow-500/50 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-yellow-400 transition-transform">
                  <FileText className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2 tracking-wide">
                  Resume
                </span>
                <span className="text-[11px] font-mono text-yellow-300/80 drop-shadow">resume.pdf</span>
              </div>
            </div>

            {/* ================= 1. ABOUT ME WINDOW (AUTHENTIC INTERACTIVE TERMINAL & PROFILE PAGE) ================= */}
            <div
              onMouseDown={() => setActiveWindow('about')}
              style={{
                display: isAboutWindowOpen && !isAboutMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isAboutMaximized ? 0 : `${aboutPos.x}px`,
                top: isAboutMaximized ? 0 : `${aboutPos.y}px`,
                width: isAboutMaximized ? '100%' : '920px',
                height: isAboutMaximized ? 'calc(100% - 56px)' : '620px',
                zIndex: activeWindow === 'about' ? 50 : 35
              }}
              className="bg-[#070b14]/98 border border-white/20 rounded-xl shadow-2xl flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
            >
              {/* Draggable Terminal Title Bar */}
              <div
                onMouseDown={(e) => handleMouseDown('about', aboutPos, e)}
                className="bg-[#0f172a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wide">
                    About Nikhil Singh — {aboutTab === 'terminal' ? 'bash (~/about-me)' : 'Developer Profile'}
                  </span>
                </div>

                {/* Window Controls (Minimize, Maximize, Close) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      minimizeAboutWindow();
                    }}
                    className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Minimize Window"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximizeAboutWindow();
                    }}
                    className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Maximize or Restore Window"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeAboutWindow();
                    }}
                    className="p-1.5 rounded text-white/70 hover:text-white hover:bg-red-600 transition-colors"
                    aria-label="Close Window"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Toolbar (Switch between Terminal and Profile Page, and quick CLI commands) */}
              <div className="bg-[#0b101c] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAboutTab('terminal');
                      setTimeout(() => terminalInputRef.current?.focus(), 60);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                      aboutTab === 'terminal'
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal (CLI)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAboutTab('page')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                      aboutTab === 'page'
                        ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>About Me (Page)</span>
                  </button>
                </div>

                {aboutTab === 'terminal' ? (
                  <div className="hidden sm:flex items-center gap-1.5">
                    {['help', 'about', 'skills', 'education', 'resume', 'contact', 'clear'].map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => handleTerminalCommand(cmd)}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-white/80 border border-white/10 text-[11px] font-mono transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/50 text-[11px] font-mono">Profile Details • GEC Bilaspur</span>
                )}
              </div>

              {/* Window Body: Either Terminal or Profile Page */}
              {aboutTab === 'terminal' ? (
                /* Authentic Interactive Terminal Body */
                <div
                  ref={terminalScrollRef}
                  onClick={() => terminalInputRef.current?.focus()}
                  onWheel={(e) => e.stopPropagation()}
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 #090d16' }}
                  className="flex-1 min-h-0 p-6 overflow-y-auto space-y-3 bg-[#050811] text-base sm:text-lg md:text-[18px] font-mono leading-relaxed select-text cursor-text"
                >
                  {/* Historical User Commands & Responses */}
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={`hist-${idx}`}
                      className={`whitespace-pre-wrap ${
                        item.startsWith('nikhil@')
                          ? 'text-emerald-400 font-bold text-lg sm:text-xl pt-1'
                          : item.startsWith('===')
                          ? 'text-[#38bdf8] font-bold tracking-wider'
                          : item.startsWith('[')
                          ? 'text-yellow-400 font-bold text-base sm:text-lg pt-1'
                          : item.startsWith('•')
                          ? 'text-white font-medium pl-3'
                          : item.startsWith('bash:')
                          ? 'text-red-400 font-semibold'
                          : 'text-white/90'
                      }`}
                    >
                      {item}
                    </div>
                  ))}

                  {/* Active Interactive Command Line Form (Always Active & Focused) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTerminalCommand(terminalInput);
                    }}
                    className="flex items-center gap-2 pt-3 border-t border-emerald-500/30 cursor-text"
                  >
                    <span className="text-emerald-400 font-bold select-none text-base sm:text-lg flex-shrink-0">
                      nikhil@n-verse:~$
                    </span>
                    <input
                      ref={terminalInputRef}
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTerminalCommand(terminalInput);
                        }
                      }}
                      placeholder='type command ("about", "skills", "education", "resume", "clear")...'
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono text-base sm:text-lg focus:ring-0 p-0 placeholder-white/35"
                      autoFocus
                    />
                    <button
                      type="submit"
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Run ↵
                    </button>
                  </form>
                </div>
              ) : (
                /* Authentic Modern Developer Profile Page */
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 min-h-0 p-6 overflow-y-auto space-y-5 bg-[#090e17] text-white select-text"
                >
                  {/* Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                          B.Tech CSE (2024 — 2028)
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                          CGPA: 7.6 / 10
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                        Nikhil Singh
                      </h2>
                      <p className="text-xs sm:text-sm font-mono text-[#38bdf8] font-semibold mt-0.5">
                        Computer Science Engineering Student & Aspiring Software Engineer
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenResume}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs font-mono transition-colors shadow-sm cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resume PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenContact}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition-colors shadow-sm cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Contact Me</span>
                      </button>
                    </div>
                  </div>

                  {/* Academic Credentials Card */}
                  <div className="bg-black/50 border border-white/15 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic Credentials</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-white/90">
                      <div>
                        <span className="text-white/50 block text-[11px]">Degree:</span>
                        <span className="font-semibold text-white">B.Tech in Computer Science & Engineering</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-[11px]">Duration:</span>
                        <span className="font-semibold text-white">2024 — 2028</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-[11px]">Institution:</span>
                        <span className="font-semibold text-white">Government Engineering College Bilaspur (CG)</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-[11px]">Cumulative GPA:</span>
                        <span className="font-bold text-emerald-400 text-sm">7.6 / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Core Biography */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-white/60 uppercase tracking-wider font-bold">
                      // Core Summary & Philosophy
                    </div>
                    <p className="text-sm font-sans text-slate-300 leading-relaxed">
                      Full-stack developer passionate about building practical web and mobile applications,
                      creating responsive user experiences, and developing scalable solutions using React,
                      Next.js, Node.js, Express, MongoDB, and Flutter.
                    </p>
                    <p className="text-sm font-sans text-slate-300 leading-relaxed">
                      Focused on strong engineering fundamentals, clean modular code, and building genuinely useful products that solve real problems.
                    </p>
                  </div>

                  {/* Technical Stack Grid */}
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-bold">
                      // Technical Skillset & Tools
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <span className="text-emerald-400 font-bold block mb-1.5">Languages & Core:</span>
                        <span className="text-white/80">Java, JavaScript, TypeScript, C, Dart</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <span className="text-[#38bdf8] font-bold block mb-1.5">Frontend & 3D:</span>
                        <span className="text-white/80">React, Next.js, HTML5, CSS3, Tailwind CSS, Drei, Three.js, Gsap</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <span className="text-yellow-400 font-bold block mb-1.5">Backend & Databases:</span>
                        <span className="text-white/80">Node.js, Express.js, MongoDB, Mongoose, PostgreSQL, MySQL</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <span className="text-purple-400 font-bold block mb-1.5">Mobile & DevOps:</span>
                        <span className="text-white/80">Flutter, Git, GitHub, Postman, Linux, Vercel</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= 2. RESUME DOCUMENT VIEWER WINDOW ================= */}
            <div
              onMouseDown={() => setActiveWindow('resume')}
              style={{
                display: isResumeWindowOpen && !isResumeMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isResumeMaximized ? 0 : `${resumePos.x}px`,
                top: isResumeMaximized ? 0 : `${resumePos.y}px`,
                width: isResumeMaximized ? '100%' : '920px',
                height: isResumeMaximized ? 'calc(100% - 56px)' : '640px',
                zIndex: activeWindow === 'resume' ? 50 : 35
              }}
              className="bg-[#0f172a] border-2 border-blue-500 rounded-xl shadow-2xl flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
            >
              {/* Title Bar (ONLY Cross/Close Button as strictly requested - No minimize, no maximize) */}
              <div
                onMouseDown={(e) => handleMouseDown('resume', resumePos, e)}
                className="bg-[#1e293b] px-4 py-2.5 border-b border-blue-500/30 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-mono font-semibold text-white tracking-wide">
                    PDF Viewer — resume.pdf (Nikhil Singh)
                  </span>
                </div>

                {/* Window Controls (Strictly ONLY the close cross button) */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeResumeWindow();
                    }}
                    className="p-1.5 rounded text-white/70 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
                    aria-label="Close Window"
                    title="Close Window"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions Toolbar with Zoom and Full View Options */}
              <div className="bg-[#0b1120] px-4 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nikhil Singh • public/resume.pdf</span>
                  </span>

                  {/* Zoom Controls */}
                  <div className="hidden sm:flex items-center gap-1 ml-2 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => setResumeZoom((z) => Math.max(60, z - 15))}
                      className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="Zoom Out (-)"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] font-mono text-white/90 min-w-[36px] text-center">
                      {resumeZoom}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeZoom((z) => Math.min(180, z + 15))}
                      className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      title="Zoom In (+)"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeZoom(100)}
                      className="px-1.5 py-0.5 text-[10px] text-white/60 hover:text-white rounded transition-colors"
                      title="Reset Zoom"
                    >
                      Fit
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Full View Option (opens /resume.pdf in new tab) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open('/resume.pdf', '_blank');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                    title="Open official PDF in full browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>↗ Open Full View</span>
                  </button>
                  <button
                    onClick={handleShareResume}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                    title="Share or Copy Resume Link"
                  >
                    {copiedResumeLink ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3 h-3 text-yellow-400" />
                    )}
                    <span>{copiedResumeLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href="/resume.pdf"
                    download="Nikhil_Singh_Resume.pdf"
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              {/* Scrollable Document Viewport (Guaranteed 100% visible, smoothly scrollable, native rendering) */}
              <div
                onWheel={(e) => e.stopPropagation()}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#38bdf8 #060a12' }}
                className="flex-1 bg-[#0b101c] overflow-y-auto overflow-x-auto p-4 sm:p-6 flex flex-col items-center select-text relative"
              >
                {/* Header Information Banner */}
                <div className="w-full max-w-[840px] mb-4 p-3 rounded-lg bg-blue-950/70 border border-blue-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-blue-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Official Resume document loaded • Scrollable sheet view</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Full View in New Tab</span>
                  </button>
                </div>

                {/* Clean Document Page Container (High-Resolution 200 DPI Page Canvas) */}
                <div
                  style={{
                    width: `${resumeZoom}%`,
                    maxWidth: '840px',
                    minWidth: '500px',
                    transition: 'width 0.15s ease-out'
                  }}
                  className="bg-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-300 p-2 sm:p-4 my-2 flex flex-col items-center"
                >
                  {/* High-Resolution Document Rendered from public/resume.pdf */}
                  <img
                    src="/resume-preview.png"
                    alt="Nikhil Singh Official Resume Document"
                    className="w-full h-auto rounded block shadow-sm select-none pointer-events-auto"
                    draggable={false}
                  />
                </div>

                {/* Document Footer Banner */}
                <div className="w-full max-w-[840px] mt-6 p-4 rounded-xl bg-black/60 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/90">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>End of Resume Document • Source: public/resume.pdf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') window.open('/resume.pdf', '_blank');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      ↗ Open Full PDF in New Tab
                    </button>
                    <a
                      href="/resume.pdf"
                      download="Nikhil_Singh_Resume.pdf"
                      className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs transition-colors shadow-sm"
                    >
                      📥 Download PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 3. CONTACT & MAIL CLIENT WINDOW (STRICT WHITE, BLACK, BLUE, YELLOW) ================= */}
            <div
              onMouseDown={() => setActiveWindow('mail')}
              style={{
                display: isMailOpen && !isMailMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isMailMaximized ? 0 : `${mailPos.x}px`,
                top: isMailMaximized ? 0 : `${mailPos.y}px`,
                width: isMailMaximized ? '100%' : '880px',
                height: isMailMaximized ? 'calc(100% - 56px)' : '620px',
                zIndex: activeWindow === 'mail' ? 50 : 35
              }}
              className="bg-black border-2 border-white rounded-xl shadow-2xl flex-col overflow-hidden pointer-events-auto"
            >
              {/* Title Bar (Authentic Windows 3-control titlebar: Minimize, Maximize/Restore, Close) */}
              <div
                onMouseDown={(e) => handleMouseDown('mail', mailPos, e)}
                className="bg-[#050505] px-4 py-2.5 border-b border-white flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                    CONTACT & CHANNELS — NIKHIL SINGH
                  </span>
                </div>

                {/* 3 Working Controls: Minimize, Maximize/Restore, Close */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMailMinimized(true);
                    }}
                    className="p-1.5 rounded text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold transition-colors cursor-pointer"
                    aria-label="Minimize Window"
                    title="Minimize"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMailMaximized((prev) => !prev);
                    }}
                    className="p-1.5 rounded text-blue-400 hover:bg-blue-600 hover:text-white font-bold transition-colors cursor-pointer"
                    aria-label={isMailMaximized ? 'Restore Window' : 'Maximize Window'}
                    title={isMailMaximized ? 'Restore' : 'Maximize'}
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMailOpen(false);
                    }}
                    className="p-1.5 rounded text-white hover:bg-white hover:text-black font-bold transition-colors cursor-pointer"
                    aria-label="Close Window"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mail & Channels Content (Strict White, Black, Blue, Yellow - ZERO AI LOOK) */}
              <div
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 p-5 flex flex-col justify-between overflow-y-auto space-y-4 text-xs font-mono bg-black"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <div>
                      <h4 className="font-black text-white text-base tracking-wider uppercase">
                        GET IN TOUCH
                      </h4>
                      <p className="text-[11px] font-mono text-yellow-400 font-semibold">
                        DIRECT COMMUNICATIONS & VERIFIED CHANNELS
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-black bg-yellow-400 px-2.5 py-1 rounded">
                      ● STATUS: OPEN FOR WORK
                    </span>
                  </div>

                  {/* Official Email Card (Black background, Blue 2px border, Yellow label, White text) */}
                  <div className="bg-black rounded-lg p-3.5 border-2 border-blue-600 space-y-1.5 shadow-sm">
                    <div className="text-[11px] font-mono text-yellow-400 font-bold uppercase tracking-wider">
                      OFFICIAL INBOX
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm sm:text-base font-bold text-white select-all">
                        {contactData.email}
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold font-mono text-xs transition-colors shadow-sm"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                        <span>{copiedEmail ? 'COPIED!' : 'COPY EMAIL'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct Message Compose Form (Black, White borders, Blue send button) */}
                  <div className="bg-black rounded-lg p-3.5 border-2 border-white space-y-2.5">
                    <div className="text-[11px] font-mono text-yellow-400 font-bold uppercase tracking-wider">
                      // DIRECT DISPATCHER
                    </div>
                    <input
                      type="text"
                      placeholder="Subject (e.g. Software Engineer Role / Project Collab)"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-black border border-white rounded px-3 py-2 text-xs text-white placeholder-yellow-400/60 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-black border border-white rounded px-3 py-2 text-xs text-white placeholder-yellow-400/60 font-mono focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailViaClient}
                      className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 border border-blue-400 transition-all shadow-md uppercase tracking-wider cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND EMAIL VIA CLIENT</span>
                    </button>
                  </div>
                </div>

                {/* Verified Links (White, Black, Blue, Yellow) */}
                <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white font-bold uppercase">Verified Profiles:</span>
                  <div className="flex items-center gap-3">
                    {contactData.github && (
                      <a
                        href={contactData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black hover:bg-yellow-400 hover:text-black border-2 border-yellow-400 text-yellow-400 text-xs font-mono font-bold transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {contactData.linkedin && (
                      <a
                        href={contactData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-400 text-xs font-mono font-bold transition-colors"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= WINDOWS 11 TASKBAR (BOTTOM OF MAIN WALL SCREEN) ================= */}
            <div className="h-14 bg-[#0e131d]/95 border-t border-white/15 px-6 flex items-center justify-between z-40 select-none pointer-events-auto relative">
              {/* Windows 11 Start Button on the Left */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-[#00adef] rounded-[1px] group-hover:brightness-110" />
                    <div className="bg-[#00adef] rounded-[1px] group-hover:brightness-110" />
                    <div className="bg-[#00adef] rounded-[1px] group-hover:brightness-110" />
                    <div className="bg-[#00adef] rounded-[1px] group-hover:brightness-110" />
                  </div>
                  <span className="font-mono text-xs text-white/80 font-bold hidden sm:inline">Start</span>
                </div>
              </div>

              {/* Running Applications Tabs Centered in the Middle (Windows 11 Style) */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border relative ${
                      activeWindow === 'about' && !isAboutMinimized
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-xs">Terminal — About</span>
                    {activeWindow === 'about' && !isAboutMinimized && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-400 rounded-full" />
                    )}
                  </button>
                )}

                {/* Contact Tab */}
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border relative ${
                      activeWindow === 'mail' && !isMailMinimized
                        ? 'bg-blue-600/30 text-yellow-400 border-blue-500/60 font-bold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono text-xs">Mail — Contact</span>
                    {activeWindow === 'mail' && !isMailMinimized && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-400 rounded-full" />
                    )}
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border relative ${
                      activeWindow === 'resume' && !isResumeMinimized
                        ? 'bg-yellow-500/25 text-yellow-300 border-yellow-500/50 font-bold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-mono text-xs">Resume</span>
                    {activeWindow === 'resume' && !isResumeMinimized && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-yellow-400 rounded-full" />
                    )}
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
