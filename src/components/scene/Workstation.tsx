'use client';

import '@/lib/react-patch';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useExperience } from '@/context/ExperienceContext';

export function Workstation() {
  const {
    openAboutWindow,
    openResumeWindow,
    setIsMailOpen,
    jumpToSection
  } = useExperience();

  // 3D Screen Canvas Texture (Guaranteed 100% visibly ON with wallpaper & 3 folders)
  const [screenCanvasTexture, setScreenCanvasTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Live Taskbar Clock strings
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Live Clock updater
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

  // Draw the full desktop screen (wallpaper, 3 folders, taskbar) directly onto 2D canvas texture
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
      // Cinematic 4K sunset ocean gradient
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

    // 3. Desktop Folders on Left Side (About Me, Contact, Resume)
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
      const cx = x + w / 2;
      const cy = y + 54;

      // Rounded icon card
      drawRRect(cx - 38, cy - 38, 76, 76, 18);
      ctx.fillStyle = 'rgba(7, 13, 24, 0.90)';
      ctx.fill();
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      if (type === 'terminal') {
        ctx.font = 'bold 30px monospace';
        ctx.fillStyle = mainColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('>_', cx, cy - 2);

        // CLI Badge
        drawRRect(cx + 12, cy + 14, 30, 18, 4);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#000000';
        ctx.fillText('CLI', cx + 27, cy + 23);
      } else if (type === 'mail') {
        // Mail envelope
        drawRRect(cx - 24, cy - 17, 48, 34, 6);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.35)';
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 17);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 24, cy - 17);
        ctx.stroke();

        // MAIL Badge
        drawRRect(cx + 10, cy + 12, 34, 18, 4);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#000000';
        ctx.fillText('MAIL', cx + 27, cy + 21);
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
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 24);
        ctx.lineTo(cx + 8, cy - 12);
        ctx.lineTo(cx + 20, cy - 12);
        ctx.stroke();

        // Document text lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy - 2);
        ctx.lineTo(cx + 13, cy - 2);
        ctx.moveTo(cx - 13, cy + 6);
        ctx.lineTo(cx + 13, cy + 6);
        ctx.moveTo(cx - 13, cy + 14);
        ctx.lineTo(cx + 5, cy + 14);
        ctx.stroke();

        // PDF Badge
        drawRRect(cx + 10, cy + 12, 32, 18, 4);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#000000';
        ctx.fillText('PDF', cx + 26, cy + 21);
      }

      // Title
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, cx, y + 124);

      // Subtitle Pill
      drawRRect(cx - 52, y + 142, 104, 24, 12);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fill();
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = subColor;
      ctx.fillText(subtitle, cx, y + 154);
    };

    // Folder 1: About Me (Terminal CLI, y = 100)
    drawDesktopAppCard(90, 100, 'About Me', 'terminal', 'terminal', '#10b981', '#6ee7b7');

    // Folder 2: Contact (Mail Channels, y = 330)
    drawDesktopAppCard(90, 330, 'Contact', 'channels', 'mail', '#3b82f6', '#facc15');

    // Folder 3: Resume (Document Page, y = 560)
    drawDesktopAppCard(90, 560, 'Resume', 'document', 'file', '#facc15', '#fef08a');

    // 4. Windows 11 Taskbar along the bottom (base bar, Start logo, clock)
    const tby = height - 68;
    ctx.fillStyle = 'rgba(11, 16, 26, 0.96)';
    ctx.fillRect(0, tby, width, 68);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, tby);
    ctx.lineTo(width, tby);
    ctx.stroke();

    // Windows 11 Start logo on left
    const sx = 36;
    const sy = tby + 22;
    ctx.fillStyle = '#00adef';
    ctx.fillRect(sx, sy, 11, 11);
    ctx.fillRect(sx + 13, sy, 11, 11);
    ctx.fillRect(sx, sy + 13, 11, 11);
    ctx.fillRect(sx + 13, sy + 13, 11, 11);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Start', sx + 32, sy + 12);

    // Clock & Date on right (padded from right bezel to avoid viewport clipping)
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(currentTime || '10:45 PM', width - 80, tby + 26);
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.60)';
    ctx.fillText(currentDate || '10/20/2026', width - 80, tby + 46);

    const tex = (canvas as unknown as { __texRef?: THREE.CanvasTexture }).__texRef;
    if (tex) {
      tex.needsUpdate = true;
    }
  }, [currentDate, currentTime]);

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

    // Initial synchronous draw
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

  // Update canvas texture whenever window states or time change
  useEffect(() => {
    if (screenCanvasTexture) {
      renderScreenTexture();
    }
  }, [renderScreenTexture, screenCanvasTexture]);

  // Handle 3D mesh clicks anywhere on the monitor screen plane
  const handleMeshClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;
    const u = e.uv.x; // 0 (left) to 1 (right)
    const v = e.uv.y; // 0 (bottom) to 1 (top)

    // Left desktop folders (u: 0.02 to 0.22)
    if (u >= 0.02 && u <= 0.22) {
      // Top folder: About Me (v: 0.68 to 0.96)
      if (v >= 0.68 && v <= 0.96) {
        openAboutWindow();
        jumpToSection('workstation');
        return;
      }
      // Middle folder: Contact (v: 0.45 to 0.68)
      if (v >= 0.45 && v < 0.68) {
        setIsMailOpen(true);
        jumpToSection('workstation');
        return;
      }
      // Bottom folder: Resume (v: 0.20 to 0.45)
      if (v >= 0.20 && v < 0.45) {
        openResumeWindow();
        jumpToSection('workstation');
        return;
      }
    }

    // Default: Click on the screen zooms camera into workstation desktop
    jumpToSection('workstation');
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

      {/* ================= SOLID STUDY DESK ================= */}
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
          onPointerOver={() => {
            if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[4.40, 2.475]} />
          {screenCanvasTexture ? (
            <meshBasicMaterial map={screenCanvasTexture} color="#ffffff" toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#0c1524" toneMapped={false} />
          )}
        </mesh>

        {/* Outer Frame Perimeter Strips (Sleek bezels) */}
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
