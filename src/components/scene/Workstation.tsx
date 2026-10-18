'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { Html } from '@react-three/drei';
import { profileData } from '@/data/profile';
import { Terminal, Maximize2, Send, Check, Copy, Power } from 'lucide-react';
import { TerminalOutputLog } from '@/components/ui/TerminalOutput';

export function Workstation() {
  const {
    activeSection,
    setIsTerminalExpanded,
    terminalHistory,
    selectedTerminalPrompt,
    runTerminalCommand,
    isReducedMotion
  } = useExperience();

  const screenRef = useRef<THREE.MeshBasicMaterial>(null);
  const pcLedRef = useRef<THREE.MeshBasicMaterial>(null);
  const isApproaching = activeSection === 'about';

  // Boot sequence state: 'standby' | 'booting' | 'ready'
  const [bootState, setBootState] = useState<'standby' | 'booting' | 'ready'>('standby');
  const [customInput, setCustomInput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Monitor power-on animation when entering About section
  useEffect(() => {
    let bootTimer: NodeJS.Timeout;

    if (activeSection === 'about') {
      if (isReducedMotion) {
        setBootState('ready');
      } else {
        setBootState('booting');
        bootTimer = setTimeout(() => {
          setBootState('ready');
        }, 450);
      }
    } else {
      // Reversible transition: power off back to standby when navigating away
      setBootState('standby');
    }

    return () => {
      if (bootTimer) clearTimeout(bootTimer);
    };
  }, [activeSection, isReducedMotion]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (screenRef.current) {
      if (bootState === 'ready') {
        const pulse = Math.sin(t * 3) * 0.08 + 0.92;
        screenRef.current.opacity = pulse;
      } else if (bootState === 'booting') {
        screenRef.current.opacity = 1.0;
      } else {
        // Dim standby mode
        screenRef.current.opacity = 0.25;
      }
    }

    if (pcLedRef.current) {
      const ledPulse = Math.sin(t * 4) * 0.25 + 0.75;
      pcLedRef.current.opacity = isApproaching ? ledPulse : 0.4;
    }
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    runTerminalCommand(customInput);
    setCustomInput('');
  };

  const copyBio = () => {
    navigator.clipboard.writeText(profileData.bio.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commandChips = ['about', 'education', 'stack', 'focus', 'links', 'help', 'clear'];

  return (
    <group position={[-3.2, 0, 4.0]} rotation={[0, 0.25, 0]}>
      {/* Focused Spot Lamp illuminating the 3D Workstation Desk */}
      <spotLight
        position={[0, 3.2, 0.4]}
        target-position={[0, 0.9, 0.2]}
        color="#a5f3fc"
        intensity={2.6}
        angle={0.7}
        penumbra={0.6}
        castShadow
      />

      {/* Monitor Bias Backlight Glow onto Back Wall */}
      <pointLight position={[0, 1.35, -0.35]} color="#00f0ff" intensity={bootState === 'standby' ? 0.3 : 1.4} distance={2.8} />

      {/* ================= WORKSTATION DESK ================= */}
      {/* Tabletop */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 1.2]} />
        <meshStandardMaterial color="#0f1523" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Desk Accent Glowing Edge */}
      <mesh position={[0, 0.9, 0.6]}>
        <boxGeometry args={[2.4, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.6} transparent />
      </mesh>

      {/* Desk Legs */}
      <mesh position={[-1.05, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 1.0]} />
        <meshStandardMaterial color="#080c14" roughness={0.5} metalness={0.9} />
      </mesh>
      <mesh position={[1.05, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.9, 1.0]} />
        <meshStandardMaterial color="#080c14" roughness={0.5} metalness={0.9} />
      </mesh>

      {/* Large Felt / Cyber Desk Mat */}
      <mesh position={[0.1, 0.942, 0.22]} receiveShadow>
        <boxGeometry args={[1.1, 0.005, 0.44]} />
        <meshStandardMaterial color="#0a0f1a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* ================= CURVED MONITOR & ON-SCREEN TERMINAL ================= */}
      <group position={[0, 1.35, -0.15]}>
        {/* Monitor Stand Base */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.25]} />
          <meshStandardMaterial color="#0a0e17" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Monitor Arm */}
        <mesh position={[0, -0.18, -0.08]}>
          <boxGeometry args={[0.08, 0.44, 0.06]} />
          <meshStandardMaterial color="#111927" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Curved Monitor Frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 0.68, 0.06]} />
          <meshStandardMaterial color="#080d16" roughness={0.4} metalness={0.85} />
        </mesh>

        {/* Monitor Active Screen Backplane */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.44, 0.62]} />
          <meshBasicMaterial
            ref={screenRef}
            color="#041224"
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* ================= INTERACTIVE HTML LAYER ON COMPUTER SCREEN ================= */}
        <Html
          transform
          distanceFactor={0.92}
          position={[0, 0, 0.038]}
          className="pointer-events-auto select-none"
        >
          <div className="w-[580px] h-[250px] bg-[#050912]/95 border border-[#00f0ff]/40 rounded-lg flex flex-col overflow-hidden text-white font-mono shadow-[0_0_25px_rgba(0,240,255,0.3)] terminal-scanlines backdrop-blur-md">
            {bootState === 'standby' ? (
              /* Standby / Powered-Off Screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2 bg-[#03060c]">
                <Power className="w-8 h-8 text-[#00f0ff]/50 animate-pulse" />
                <div className="text-xs text-[#00f0ff] font-bold tracking-widest uppercase">
                  N/VERSE WORKSTATION // STANDBY
                </div>
                <div className="text-[10px] text-[#64748b]">
                  Approach workstation in timeline to power on terminal.
                </div>
              </div>
            ) : bootState === 'booting' ? (
              /* Boot Sequence Animation Screen */
              <div className="flex-1 flex flex-col justify-center p-6 space-y-1.5 bg-[#03060c] text-[11px] text-[#00f0ff]">
                <div className="animate-pulse">&gt; POWER ON SEQUENCE INITIATED...</div>
                <div className="text-[#38bdf8]">&gt; N/VERSE BIOS v2.6.4 OK</div>
                <div className="text-[#94a3b8]">&gt; MOUNTING DEV ENVIRONMENT: NIKHIL SINGH</div>
                <div className="text-emerald-400 font-bold">&gt; SYSTEM INITIALIZED // READY</div>
              </div>
            ) : (
              /* Active Developer Workstation Terminal */
              <>
                {/* Window Header */}
                <div className="bg-[#0b121e] px-3 py-1.5 border-b border-[#00f0ff]/25 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-[#94a3b8] flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-[#00f0ff]" />
                      nikhil@n-verse:~$ [WORKSTATION]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyBio}
                      className="text-[#94a3b8] hover:text-[#00f0ff] flex items-center gap-1 transition-colors text-[10px] p-0.5"
                      title="Copy Profile Summary"
                      aria-label="Copy Profile Summary"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => setIsTerminalExpanded(true)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/40 text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 transition-colors text-[10px]"
                      title="Expand to Fullscreen Modal"
                      aria-label="Expand terminal"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Expand</span>
                    </button>
                  </div>
                </div>

                {/* Suggested Quick Commands Row */}
                <div className="bg-[#070d17] px-2.5 py-1 border-b border-[#00f0ff]/15 flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-[#64748b]">Prompts:</span>
                  {commandChips.map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => runTerminalCommand(cmd)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition-all border ${
                        selectedTerminalPrompt === cmd
                          ? 'bg-[#00f0ff]/25 text-[#00f0ff] border-[#00f0ff]'
                          : 'bg-[#0f172a] text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
                      }`}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>

                {/* Terminal Body Log with isolated scrolling */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="px-2.5 pt-1.5 pb-0.5 text-[#94a3b8] text-[10px] border-b border-[#00f0ff]/10 flex justify-between items-center">
                    <span>
                      <strong className="text-white">{profileData.name}</strong> &bull; {profileData.degree}
                    </span>
                    <span className="text-[#00f0ff] text-[9px] font-mono">GEC BILASPUR</span>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <TerminalOutputLog history={terminalHistory} isCompact={true} />
                  </div>
                </div>

                {/* Safe Command Input Field */}
                <form
                  onSubmit={handleCustomSubmit}
                  className="bg-[#040810] px-2.5 py-1 border-t border-[#00f0ff]/20 flex items-center gap-1.5 text-[11px]"
                >
                  <span className="text-emerald-400 font-bold">&gt;</span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Type command (about, education, stack, focus, links)..."
                    className="flex-1 bg-transparent text-white placeholder-[#475569] focus:outline-none text-[10.5px]"
                    aria-label="Workstation terminal input"
                  />
                  <button
                    type="submit"
                    className="text-[#94a3b8] hover:text-[#00f0ff] p-0.5 transition-colors"
                    aria-label="Submit command"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </>
            )}
          </div>
        </Html>
      </group>

      {/* ================= MECHANICAL KEYBOARD & MOUSE ================= */}
      {/* Keyboard */}
      <mesh position={[-0.1, 0.95, 0.25]} castShadow>
        <boxGeometry args={[0.55, 0.02, 0.2]} />
        <meshStandardMaterial color="#0a0e17" roughness={0.6} metalness={0.6} />
      </mesh>
      {/* Keyboard RGB Glow */}
      <mesh position={[-0.1, 0.94, 0.25]}>
        <boxGeometry args={[0.57, 0.01, 0.22]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.3} transparent />
      </mesh>

      {/* Precision Mouse */}
      <mesh position={[0.35, 0.95, 0.25]} castShadow>
        <boxGeometry args={[0.09, 0.025, 0.14]} />
        <meshStandardMaterial color="#0d1422" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ================= PC TOWER / CHASSIS ================= */}
      <group position={[0.88, 0.45, 0]}>
        {/* Chassis case */}
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.7, 0.6]} />
          <meshStandardMaterial color="#0a0f18" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Tempered Glass Side Window with Cyan Internal Glow */}
        <mesh position={[-0.151, 0, 0]}>
          <planeGeometry args={[0.55, 0.65]} />
          <meshBasicMaterial ref={pcLedRef} color="#00f0ff" opacity={0.35} transparent />
        </mesh>
        {/* Front LED strip */}
        <mesh position={[0, 0, 0.301]}>
          <boxGeometry args={[0.02, 0.6, 0.01]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* ================= WORKSTATION CHAIR ================= */}
      <group position={[0.45, 0, 0.85]} rotation={[0, Math.PI * 0.75, 0]}>
        {/* Seat Base */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.55]} />
          <meshStandardMaterial color="#0b101a" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.95, 0.24]}>
          <boxGeometry args={[0.55, 0.85, 0.08]} />
          <meshStandardMaterial color="#0b101a" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Central stem */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#1a2538" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
