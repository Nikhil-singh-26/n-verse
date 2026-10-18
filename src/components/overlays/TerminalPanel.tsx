'use client';

import React, { useState, useEffect } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { profileData } from '@/data/profile';
import { Terminal, Send, RotateCcw, Copy, Check, Minimize2, Maximize2, Monitor } from 'lucide-react';
import { TerminalOutputLog } from '@/components/ui/TerminalOutput';

export function TerminalPanel() {
  const {
    activeSection,
    isTerminalExpanded,
    setIsTerminalExpanded,
    terminalHistory,
    selectedTerminalPrompt,
    runTerminalCommand
  } = useExperience();

  const [customInput, setCustomInput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTerminalExpanded) {
        setIsTerminalExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalExpanded, setIsTerminalExpanded]);

  if (activeSection !== 'about') return null;

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

  // If not expanded, display discreet floating action pill so the 3D computer remains 100% visible
  if (!isTerminalExpanded) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
        <button
          onClick={() => setIsTerminalExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-mono text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-[#00f0ff] transition-all hover:scale-105 active:scale-95"
          aria-label="Expand 3D Computer Terminal to Fullscreen"
        >
          <Monitor className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Terminal Active on 3D Monitor &bull; Click to Expand</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-6 md:p-8 z-30">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Developer Terminal Expanded View"
        className="w-full max-w-3xl glass-panel rounded-xl overflow-hidden shadow-2xl pointer-events-auto border border-[#00f0ff]/40 animate-in fade-in zoom-in-95 duration-300 max-h-[88vh] flex flex-col"
      >
        {/* Terminal Header */}
        <div className="bg-[#0b121e] px-4 py-3 border-b border-[#00f0ff]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-mono text-xs text-[#94a3b8] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
              NIKHIL@N-VERSE:~$ [EXPANDED]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyBio}
              className="text-[#94a3b8] hover:text-[#00f0ff] text-xs font-mono flex items-center gap-1 transition-colors p-1"
              title="Copy Profile Text"
              aria-label="Copy Profile Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Bio'}</span>
            </button>
            <button
              onClick={() => runTerminalCommand('clear')}
              className="text-[#94a3b8] hover:text-[#00f0ff] text-xs font-mono flex items-center gap-1 transition-colors p-1"
              title="Clear Terminal Output"
              aria-label="Clear Terminal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={() => setIsTerminalExpanded(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 text-xs font-mono transition-colors ml-2"
              title="Minimize back to 3D Computer Monitor"
              aria-label="Minimize terminal to computer monitor"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minimize (Esc)</span>
            </button>
          </div>
        </div>

        {/* Identity Intro Banner */}
        <div className="bg-[#070c16] px-4 py-3 border-b border-[#00f0ff]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              {profileData.name}
            </h2>
            <div className="text-xs text-[#00f0ff] font-mono tracking-wide">
              {profileData.role}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-[#cbd5e1]">
              {profileData.university}
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8]">
              {profileData.degree}
            </div>
          </div>
        </div>

        {/* Terminal Output Area with isolated scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#050811]/90">
          <TerminalOutputLog history={terminalHistory} isCompact={false} />
        </div>

        {/* Suggested Quick Command Prompts */}
        <div className="bg-[#090d16] px-4 py-2.5 border-t border-[#00f0ff]/15 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-[#64748b] mr-1 hidden sm:inline">
            Quick Prompts:
          </span>
          {commandChips.map((cmd) => (
            <button
              key={cmd}
              onClick={() => runTerminalCommand(cmd)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all border ${
                selectedTerminalPrompt === cmd
                  ? 'bg-[#00f0ff]/25 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : 'bg-[#111927] text-[#94a3b8] border-[#1e293b] hover:text-[#00f0ff] hover:border-[#00f0ff]/40'
              }`}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Interactive Command Input Field */}
        <form
          onSubmit={handleCustomSubmit}
          className="bg-[#06090f] px-4 py-2.5 border-t border-[#00f0ff]/20 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-mono text-sm font-bold">&gt;</span>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type command (about, education, stack, focus, links, help, clear)..."
            className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white placeholder-[#475569] focus:outline-none"
            aria-label="Terminal command input"
          />
          <button
            type="submit"
            className="text-[#94a3b8] hover:text-[#00f0ff] p-1.5 transition-colors rounded hover:bg-[#00f0ff]/10"
            aria-label="Execute command"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
