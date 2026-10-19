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
  X
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

  const isDragging = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

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
  const [terminalStreamIndex, setTerminalStreamIndex] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isTerminalStreamingComplete, setIsTerminalStreamingComplete] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);

  // Full About Me Terminal Content Lines
  const terminalFullBio = [
    'nikhil@n-verse:~$ cat about.txt',
    '',
    '========================================================================',
    '                    NIKHIL SINGH // ABOUT ME',
    '========================================================================',
    '',
    '[STATUS]       Active • Software Engineer & Full-Stack Developer',
    '[LOCATION]     Bilaspur, Chhattisgarh, India (Open to Remote / Relocate)',
    '[DEGREE]       B.Tech in Computer Science & Engineering (2022 — 2026)',
    '[INSTITUTION]  Government Engineering College Bilaspur (CG)',
    '[CGPA]         7.85 / 10',
    '',
    '[CORE BIOGRAPHY]',
    'Passionate Computer Science student and software engineer focused on building',
    'robust, scalable digital experiences and interactive 3D web systems. With deep',
    'experience in modern full-stack development, cloud architecture, and real-time',
    '3D graphics, I transform complex ideas into intuitive, production-grade applications.',
    '',
    '[TECHNICAL SKILLS]',
    '• Languages:      Java, TypeScript, JavaScript, SQL, HTML5, CSS3, Python, C++',
    '• Frontend:       React.js, Next.js, Three.js, React Three Fiber, Tailwind CSS',
    '• Backend:        Node.js, Express.js, RESTful APIs, Microservices Architecture',
    '• Databases:      MongoDB, PostgreSQL, MySQL',
    '• Tools & DevOps: Git, GitHub, Docker, Postman, Linux, Vercel',
    '',
    '[DEVELOPMENT VALUES]',
    '1. Clean Architecture: Modular, maintainable, and type-safe code.',
    '2. High Performance: Fluid 60fps rendering and sub-second response times.',
    '3. Seamless UX: Thoughtfully crafted with precision micro-interactions.',
    '',
    '[CONTACT & CHANNELS]',
    '• Email:     singhnikhil2608@gmail.com',
    '• GitHub:    github.com/Nikhil-singh-26',
    '• LinkedIn:  linkedin.com/in/nikhil-singh-dev',
    '',
    'Type "help", "skills", "education", "contact", "resume", or "clear" below.'
  ];

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
      // Card backing
      drawRRect(x, y, w, h, 20);
      ctx.fillStyle = 'rgba(9, 13, 22, 0.88)';
      ctx.fill();
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      const cx = x + w / 2;
      const cy = y + 68;

      if (type === 'terminal') {
        // Console badge with >_ prompt
        drawRRect(cx - 36, cy - 32, 72, 54, 10);
        ctx.fillStyle = '#061a14';
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = 'bold 26px monospace';
        ctx.fillStyle = mainColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('>_', cx, cy - 5);
      } else if (type === 'mail') {
        // Mail envelope
        drawRRect(cx - 36, cy - 28, 72, 48, 8);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Flap
        ctx.beginPath();
        ctx.moveTo(cx - 36, cy - 28);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 36, cy - 28);
        ctx.stroke();
      } else {
        // Document page with folded top-right corner
        ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.beginPath();
        ctx.moveTo(cx - 28, cy - 34);
        ctx.lineTo(cx + 12, cy - 34);
        ctx.lineTo(cx + 28, cy - 18);
        ctx.lineTo(cx + 28, cy + 30);
        ctx.lineTo(cx - 28, cy + 30);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Corner fold
        ctx.beginPath();
        ctx.moveTo(cx + 12, cy - 34);
        ctx.lineTo(cx + 12, cy - 18);
        ctx.lineTo(cx + 28, cy - 18);
        ctx.stroke();

        // Text lines on document
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 4);
        ctx.lineTo(cx + 18, cy - 4);
        ctx.moveTo(cx - 18, cy + 8);
        ctx.lineTo(cx + 18, cy + 8);
        ctx.moveTo(cx - 18, cy + 20);
        ctx.lineTo(cx + 8, cy + 20);
        ctx.stroke();
      }

      // Title
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, cx, y + 138);

      // Subtitle
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = subColor;
      ctx.fillText(subtitle, cx, y + 162);
    };

    // Folder 1: About (Terminal Icon, y = 110)
    drawDesktopAppCard(85, 110, 'About', 'Profile & Bio', 'terminal', '#10b981', '#a7f3d0');

    // Folder 2: Contact (Mail Envelope, y = 340)
    drawDesktopAppCard(85, 340, 'Contact', 'Mail & Channels', 'mail', '#38bdf8', '#bae6fd');

    // Folder 3: Resume (Document Page, y = 570)
    drawDesktopAppCard(85, 570, 'Resume', 'Resume.pdf', 'file', '#10b981', '#a7f3d0');

    // 5. Active Windows Drawn directly onto Screen
    if (isAboutWindowOpen && !isAboutMinimized) {
      const wx = 360;
      const wy = 100;
      const ww = 1180;
      const wh = 760;

      drawRRect(wx, wy, ww, wh, 18);
      ctx.fillStyle = 'rgba(14, 20, 34, 0.96)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Title bar
      drawRRect(wx, wy, ww, 52, 18);
      ctx.fillStyle = '#1a2336';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx + 26, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('About Me — Nikhil Singh', wx + 42, wy + 26);

      // Window controls
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(wx + ww - 30, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx + ww - 54, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wx + ww - 78, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      // Content inside About Window
      ctx.font = '900 38px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Nikhil Singh', wx + 48, wy + 115);

      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('FULL-STACK DEVELOPER & 3D WEB CREATIVE', wx + 48, wy + 158);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Computer Science Engineer specializing in scalable full-stack web applications,', wx + 48, wy + 208);
      ctx.fillText('immersive 3D interactive experiences with Three.js/R3F, and modern cloud architectures.', wx + 48, wy + 236);

      // Skill badges
      const skills = ['Next.js', 'React.js', 'TypeScript', 'Java', 'Three.js', 'Flutter', 'Node.js', 'PostgreSQL'];
      skills.forEach((sk, i) => {
        const bx = wx + 48 + (i % 4) * 165;
        const by = wy + 300 + Math.floor(i / 4) * 55;
        drawRRect(bx, by, 150, 42, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.stroke();
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(sk, bx + 75, by + 21);
      });

      // Quick links hint
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('Contact: singhnikhil2608@gmail.com  •  Location: India  •  GitHub: github.com/Nikhil-singh-26', wx + 48, wy + 465);
    } else if (isResumeWindowOpen && !isResumeMinimized) {
      const wx = 360;
      const wy = 100;
      const ww = 1180;
      const wh = 760;

      drawRRect(wx, wy, ww, wh, 18);
      ctx.fillStyle = 'rgba(14, 20, 34, 0.96)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Title bar
      drawRRect(wx, wy, ww, 52, 18);
      ctx.fillStyle = '#132322';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wx + 26, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Resume.pdf — Official Resume (Nikhil Singh)', wx + 42, wy + 26);

      // Window controls
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(wx + ww - 30, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx + ww - 54, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wx + ww - 78, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      // Header: Candidate Name & Education
      ctx.font = '900 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Nikhil Singh', wx + 48, wy + 110);

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('B.TECH COMPUTER SCIENCE & ENGINEERING (2022 — 2026)', wx + 48, wy + 152);

      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Government Engineering College Bilaspur (CG) • CGPA: 7.85 / 10', wx + 48, wy + 185);

      // Section: Core Competencies
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('// CORE COMPETENCIES & EXPERTISE', wx + 48, wy + 240);

      const resumeSkills = [
        'Data Structures & Algorithms',
        'Full-Stack Web (MERN / Next.js)',
        '3D Web Graphics (Three.js / WebGL)',
        'Cloud & DevOps (Docker, CI/CD)',
        'Database (MongoDB, PostgreSQL)',
        'Mobile App (Flutter / Dart)'
      ];
      resumeSkills.forEach((item, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const ix = wx + 48 + col * 550;
        const iy = wy + 280 + row * 45;
        drawRRect(ix, iy, 510, 36, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'left';
        ctx.fillText('• ' + item, ix + 16, iy + 18);
      });

      // Section: Leadership & Achievements
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('// LEADERSHIP & RECOGNITION', wx + 48, wy + 440);

      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('• Google Developer Groups (GDG) On Campus — Technical Lead', wx + 48, wy + 480);
      ctx.fillText('• Symbiosis Skill Hackathon — First Place Winner (Feb 2026)', wx + 48, wy + 515);
      ctx.fillText('• 350+ LeetCode problems solved with verified ranking and badges', wx + 48, wy + 550);

      // Download / Print hint
      drawRRect(wx + 48, wy + 600, 340, 48, 10);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#061a14';
      ctx.textAlign = 'center';
      ctx.fillText('📥 Download Full Resume (PDF)', wx + 218, wy + 624);
    } else if (isMailOpen && !isMailMinimized) {
      const wx = 360;
      const wy = 100;
      const ww = 1180;
      const wh = 760;

      drawRRect(wx, wy, ww, wh, 18);
      ctx.fillStyle = 'rgba(14, 20, 34, 0.96)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Title bar
      drawRRect(wx, wy, ww, 52, 18);
      ctx.fillStyle = '#152538';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(wx + 26, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Contact & Channels — Message Dispatcher', wx + 42, wy + 26);

      // Window controls
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(wx + ww - 30, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx + ww - 54, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(wx + ww - 78, wy + 26, 7, 0, Math.PI * 2);
      ctx.fill();

      // Header: Let's Connect
      ctx.font = '900 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Get in Touch', wx + 48, wy + 110);

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('DIRECT COMMUNICATIONS & SOCIAL NETWORKS', wx + 48, wy + 152);

      // Email Card
      drawRRect(wx + 48, wy + 190, 1080, 80, 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('OFFICIAL INBOX', wx + 75, wy + 218);
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('singhnikhil2608@gmail.com', wx + 75, wy + 248);

      // Social Links
      const channels = [
        { label: 'GitHub', value: 'github.com/Nikhil-singh-26', color: '#f59e0b' },
        { label: 'LinkedIn', value: 'linkedin.com/in/nikhil-singh-dev', color: '#0ea5e9' },
        { label: 'Location', value: 'Chhattisgarh, India (Open to Remote / Relocation)', color: '#10b981' }
      ];
      channels.forEach((ch, idx) => {
        const cy = wy + 300 + idx * 75;
        drawRRect(wx + 48, cy, 1080, 62, 10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = ch.color;
        ctx.textAlign = 'left';
        ctx.fillText(ch.label, wx + 75, cy + 31);

        ctx.font = '15px monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(ch.value, wx + 240, cy + 31);
      });

      // Status indicator
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'left';
      ctx.fillText('🟢 Currently open for Software Engineer Internships & New Grad Opportunities', wx + 48, wy + 550);
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

    // Active Applications in Taskbar (Shows only open windows)
    let currentTabX = 24;
    if (isAboutWindowOpen) {
      drawRRect(currentTabX, tby + 16, 200, 44, 8);
      ctx.fillStyle = !isAboutMinimized ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'center';
      ctx.fillText('>_ Terminal — About', currentTabX + 100, tby + 38);
      currentTabX += 215;
    }

    if (isMailOpen) {
      drawRRect(currentTabX, tby + 16, 180, 44, 8);
      ctx.fillStyle = !isMailMinimized ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('✉ Mail — Contact', currentTabX + 90, tby + 38);
      currentTabX += 195;
    }

    if (isResumeWindowOpen) {
      drawRRect(currentTabX, tby + 16, 180, 44, 8);
      ctx.fillStyle = !isResumeMinimized ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.textAlign = 'center';
      ctx.fillText('📄 Resume', currentTabX + 90, tby + 38);
      currentTabX += 195;
    }

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

  // Window drag handlers for all windows on the large monitor
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

  // Stream terminal lines when About window opens
  useEffect(() => {
    if (!isAboutWindowOpen) {
      setTerminalStreamIndex(0);
      setIsTerminalStreamingComplete(false);
      return;
    }

    if (isTerminalStreamingComplete) return;

    const interval = setInterval(() => {
      setTerminalStreamIndex((prev) => {
        if (prev + 1 >= terminalFullBio.length) {
          clearInterval(interval);
          setIsTerminalStreamingComplete(true);
          return terminalFullBio.length;
        }
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [isAboutWindowOpen, isTerminalStreamingComplete, terminalFullBio.length]);

  // Auto-scroll terminal viewport as new lines arrive
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalStreamIndex, terminalHistory]);

  const handleSkipTerminalStream = () => {
    setTerminalStreamIndex(terminalFullBio.length);
    setIsTerminalStreamingComplete(true);
  };

  const handleTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const newEntry = [`nikhil@n-verse:~$ ${trimmed}`];

    if (lower === 'clear' || lower === 'cls') {
      setTerminalHistory([]);
      setTerminalStreamIndex(terminalFullBio.length);
      setIsTerminalStreamingComplete(true);
      setTerminalInput('');
      return;
    } else if (lower === 'help') {
      newEntry.push(
        'Available terminal commands:',
        '  about      - Display developer biography & career overview',
        '  skills     - View core technology stack and tools',
        '  education  - View B.Tech degree, university, and GPA stats',
        '  resume     - Launch the official Resume document viewer',
        '  contact    - Launch direct email & communication channels',
        '  clear      - Clear terminal screen buffer'
      );
    } else if (lower === 'about' || lower === 'cat about.txt' || lower === 'bio') {
      newEntry.push(
        'Nikhil Singh — Software Engineer & Creative Developer',
        'B.Tech CSE @ Government Engineering College Bilaspur (2022-2026) | CGPA: 7.85/10',
        'Specializing in full-stack web applications and real-time 3D spatial graphics.',
        'Email: singhnikhil2608@gmail.com | GitHub: github.com/Nikhil-singh-26'
      );
    } else if (lower === 'skills') {
      newEntry.push(
        'Core Technologies:',
        '  • Languages: Java, TypeScript, JavaScript, SQL, Python, C++',
        '  • Frontend: React.js, Next.js, Three.js, React Three Fiber, Tailwind CSS',
        '  • Backend: Node.js, Express.js, MongoDB, PostgreSQL, REST APIs',
        '  • DevOps & Tools: Git, GitHub, Docker, Postman, Linux, Vercel'
      );
    } else if (lower === 'education') {
      newEntry.push(
        'Academic Credentials:',
        '  • Degree: Bachelor of Technology (B.Tech)',
        '  • Major: Computer Science & Engineering (2022 — 2026)',
        '  • College: Government Engineering College Bilaspur (CG)',
        '  • Cumulative GPA: 7.85 / 10'
      );
    } else if (lower === 'resume') {
      newEntry.push('Opening official Resume document viewer...');
      handleOpenResume();
    } else if (lower === 'contact') {
      newEntry.push('Opening direct communication channels...');
      handleOpenContact();
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

    // Taskbar (v < 0.07) - toggle active open window tabs
    if (v < 0.07) {
      if (u <= 0.18 && isAboutWindowOpen) {
        if (isAboutMinimized) {
          openAboutWindow();
          setActiveWindow('about');
        } else {
          minimizeAboutWindow();
        }
      } else if (u > 0.18 && u <= 0.34 && isMailOpen) {
        setIsMailMinimized((prev) => !prev);
      } else if (u > 0.34 && u <= 0.50 && isResumeWindowOpen) {
        if (isResumeMinimized) {
          openResumeWindow();
          setActiveWindow('resume');
        } else {
          minimizeResumeWindow();
        }
      }
      return;
    }

    // Left desktop folders (u: 0.03 to 0.15)
    if (u >= 0.03 && u <= 0.15) {
      // Folder 1: About (v: 0.68 to 0.88)
      if (v >= 0.68 && v <= 0.88) {
        openAboutWindow();
        setActiveWindow('about');
        return;
      }
      // Folder 2: Contact (v: 0.44 to 0.64)
      if (v >= 0.44 && v <= 0.64) {
        handleOpenContact();
        return;
      }
      // Folder 3: Resume (v: 0.20 to 0.40)
      if (v >= 0.20 && v <= 0.40) {
        handleOpenResume();
        return;
      }
    }

    // Window close button (u: 0.72 to 0.76, v: 0.82 to 0.88)
    if (u >= 0.72 && u <= 0.76 && v >= 0.82 && v <= 0.88) {
      if (isAboutWindowOpen) closeAboutWindow();
      if (isResumeWindowOpen) closeResumeWindow();
      if (isMailOpen) setIsMailOpen(false);
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
            <div className="absolute left-14 top-14 flex flex-col gap-6 pointer-events-auto z-30">
              {/* Folder 1: About (Terminal Icon) */}
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
                className="flex flex-col items-center justify-center w-36 p-3.5 rounded-2xl bg-[#090d16]/85 hover:bg-white/25 border border-white/20 hover:border-emerald-400/80 cursor-pointer group text-center transition-all select-none shadow-[0_8px_28px_rgba(0,0,0,0.65)] backdrop-blur-md active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Terminal About Me"
              >
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 group-hover:bg-emerald-500/35 text-emerald-400 transition-transform group-hover:scale-110 shadow-lg border border-emerald-500/30">
                  <Terminal className="w-14 h-14 text-emerald-400" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  About
                </span>
                <span className="text-xs font-mono text-emerald-300 font-medium">Profile & Bio</span>
              </div>

              {/* Folder 2: Contact (Mail Envelope) */}
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
                <div className="p-3.5 rounded-2xl bg-sky-500/20 group-hover:bg-sky-500/35 text-sky-400 transition-transform group-hover:scale-110 shadow-lg border border-sky-500/30">
                  <Mail className="w-14 h-14 text-sky-400" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  Contact
                </span>
                <span className="text-xs font-mono text-sky-300 font-medium">Mail & Channels</span>
              </div>

              {/* Folder 3: Resume (Document Page File) */}
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
                className="flex flex-col items-center justify-center w-36 p-3.5 rounded-2xl bg-[#090d16]/85 hover:bg-white/25 border border-white/20 hover:border-amber-400/80 cursor-pointer group text-center transition-all select-none shadow-[0_8px_28px_rgba(0,0,0,0.65)] backdrop-blur-md active:scale-95"
                role="button"
                tabIndex={0}
                aria-label="Open Resume Document"
              >
                <div className="p-3.5 rounded-2xl bg-amber-500/20 group-hover:bg-amber-500/35 text-amber-400 transition-transform group-hover:scale-110 shadow-lg border border-amber-500/30">
                  <FileText className="w-14 h-14 text-amber-400" />
                </div>
                <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2.5 tracking-wide">
                  Resume
                </span>
                <span className="text-xs font-mono text-amber-300 font-medium">Resume.pdf</span>
              </div>
            </div>

            {/* ================= 1. ABOUT ME WINDOW (AUTHENTIC INTERACTIVE TERMINAL) ================= */}
            <div
              onMouseDown={() => setActiveWindow('about')}
              style={{
                display: isAboutWindowOpen && !isAboutMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isAboutMaximized ? 0 : `${aboutPos.x}px`,
                top: isAboutMaximized ? 0 : `${aboutPos.y}px`,
                width: isAboutMaximized ? '100%' : '920px',
                height: isAboutMaximized ? 'calc(100% - 56px)' : '620px',
                zIndex: activeWindow === 'about' ? 40 : 30
              }}
              className="bg-[#070b14]/98 border border-white/20 rounded-xl shadow-2xl flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
            >
              {/* Draggable Terminal Title Bar */}
              <div
                onMouseDown={(e) => handleMouseDown('about', aboutPos, e)}
                className="bg-[#0f172a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wide">
                    Terminal — About Nikhil Singh (bash)
                  </span>
                </div>

                {/* Window Controls (Minimize, Maximize, Close) */}
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

              {/* Quick CLI Actions Sub-Toolbar */}
              <div className="bg-[#0b101c] px-4 py-1.5 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-white/50 text-[11px]">nikhil@desktop:~/about-me</span>
                <div className="flex items-center gap-1.5">
                  {!isTerminalStreamingComplete && (
                    <button
                      onClick={handleSkipTerminalStream}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] transition-colors"
                    >
                      Skip Animation ⏩
                    </button>
                  )}
                  <button
                    onClick={() => handleTerminalCommand('skills')}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 text-[11px] transition-colors"
                  >
                    skills
                  </button>
                  <button
                    onClick={() => handleTerminalCommand('education')}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 text-[11px] transition-colors"
                  >
                    education
                  </button>
                  <button
                    onClick={() => handleTerminalCommand('clear')}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 text-[11px] transition-colors"
                  >
                    clear
                  </button>
                </div>
              </div>

              {/* Authentic Terminal Body (Word-by-word Stream & Interactive CLI) */}
              <div
                ref={terminalScrollRef}
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 p-5 overflow-y-auto space-y-2 bg-[#060a12] text-xs sm:text-[13px] font-mono leading-relaxed select-text"
              >
                {/* Streamed Bio Lines */}
                {terminalFullBio.slice(0, terminalStreamIndex).map((line, idx) => (
                  <div
                    key={`stream-${idx}`}
                    className={`whitespace-pre-wrap ${
                      line.startsWith('nikhil@')
                        ? 'text-emerald-400 font-bold'
                        : line.startsWith('===')
                        ? 'text-[#38bdf8] font-bold'
                        : line.startsWith('[')
                        ? 'text-amber-300 font-semibold'
                        : 'text-white/85'
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {/* Blinking Cursor during Streaming */}
                {!isTerminalStreamingComplete && (
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle" />
                )}

                {/* Historical User Commands & Responses */}
                {terminalHistory.map((item, idx) => (
                  <div
                    key={`hist-${idx}`}
                    className={`whitespace-pre-wrap ${
                      item.startsWith('nikhil@')
                        ? 'text-emerald-400 font-bold'
                        : item.startsWith('bash:')
                        ? 'text-red-400'
                        : 'text-white/85'
                    }`}
                  >
                    {item}
                  </div>
                ))}

                {/* Active Interactive Command Line Form */}
                {isTerminalStreamingComplete && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTerminalCommand(terminalInput);
                    }}
                    className="flex items-center gap-2 pt-2 border-t border-white/5"
                  >
                    <span className="text-emerald-400 font-bold select-none text-xs sm:text-[13px]">
                      nikhil@n-verse:~$
                    </span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder='type command (e.g. "skills", "education", "resume", "clear")...'
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-[13px] focus:ring-0 p-0 placeholder-white/30"
                      autoFocus
                    />
                  </form>
                )}
              </div>
            </div>

            {/* ================= 2. RESUME DOCUMENT VIEWER WINDOW ================= */}
            <div
              onMouseDown={() => setActiveWindow('resume')}
              style={{
                display: isResumeWindowOpen && !isResumeMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isResumeMaximized ? 0 : `${resumePos.x}px`,
                top: isResumeMaximized ? 0 : `${resumePos.y}px`,
                width: isResumeMaximized ? '100%' : '880px',
                height: isResumeMaximized ? 'calc(100% - 56px)' : '580px',
                zIndex: activeWindow === 'resume' ? 40 : 30
              }}
              className="bg-[#121824]/98 border border-white/20 rounded-xl shadow-2xl flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
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
                    <button
                      onClick={handleShareResume}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                      title="Share or Copy Resume Link"
                    >
                      {copiedResumeLink ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{copiedResumeLink ? 'Link Copied!' : 'Share / Copy'}</span>
                    </button>
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

            {/* ================= 3. CONTACT & MAIL CLIENT WINDOW ================= */}
            <div
              onMouseDown={() => setActiveWindow('mail')}
              style={{
                display: isMailOpen && !isMailMinimized ? 'flex' : 'none',
                position: 'absolute',
                left: isMailMaximized ? 0 : `${mailPos.x}px`,
                top: isMailMaximized ? 0 : `${mailPos.y}px`,
                width: isMailMaximized ? '100%' : '840px',
                height: isMailMaximized ? 'calc(100% - 56px)' : '580px',
                zIndex: activeWindow === 'mail' ? 40 : 30
              }}
              className="bg-[#121824]/98 border border-white/20 rounded-xl shadow-2xl flex-col overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
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
                  className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-3.5 text-xs font-sans bg-[#0c121d]"
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

            {/* ================= WINDOWS TASKBAR (BOTTOM OF MAIN WALL SCREEN) ================= */}
            <div className="h-14 bg-[#0e131d]/95 border-t border-white/15 px-6 flex items-center justify-between z-40 select-none pointer-events-auto">
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${
                      activeWindow === 'about' && !isAboutMinimized
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-xs">Terminal — About</span>
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${
                      activeWindow === 'mail' && !isMailMinimized
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-mono text-xs">Mail — Contact</span>
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${
                      activeWindow === 'resume' && !isResumeMinimized
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold shadow-sm'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-xs">Resume</span>
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
