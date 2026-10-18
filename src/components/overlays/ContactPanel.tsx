'use client';

import React, { useState } from 'react';
import { useExperience } from '@/context/ExperienceContext';
import { contactData } from '@/data/contact';
import { profileData } from '@/data/profile';
import {
  Mail,
  Code2,
  FileText,
  Copy,
  Check,
  Send,
  ExternalLink,
  Minimize2,
  Maximize2,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function ContactPanel() {
  const { activeSection, jumpToSection } = useExperience();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (activeSection !== 'contact') return null;

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(contactData.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = contactData.email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      }
    } catch {
      // Graceful fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleScrollIsolation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  // If minimized, display a floating pill so the 3D telephone station remains 100% visible
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel text-xs font-mono text-[#00f0ff] hover:text-white border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-[#00f0ff] transition-all hover:scale-105 active:scale-95"
          aria-label="Expand contact panel"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Comms Console Active &bull; Show Contact Card</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-6 md:p-10 z-20">
      <div
        role="region"
        aria-label="Contact Station & Communications Terminal"
        onWheel={handleScrollIsolation}
        onTouchMove={handleScrollIsolation}
        className="w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl pointer-events-auto border border-[#00f0ff]/40 animate-in fade-in zoom-in-95 duration-400 max-h-[90vh] overflow-y-auto space-y-6 backdrop-blur-md"
      >
        {/* Header with Title and Minimize Control */}
        <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[10px] sm:text-xs uppercase tracking-widest">
              <PhoneCall className="w-3 h-3 text-[#00f0ff] animate-pulse" />
              <span>COMMUNICATIONS CONSOLE // ONLINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-wide">
              {contactData.headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#cbd5e1] font-mono max-w-lg leading-relaxed">
              {contactData.subheadline}
            </p>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 border border-[#1e293b] hover:border-[#00f0ff]/40 transition-colors self-start"
            title="Minimize to view 3D Telephone"
            aria-label="Minimize contact card"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Direct Transmission Email Channel */}
        <div className="bg-[#070b12]/95 rounded-xl p-4 sm:p-5 border border-[#00f0ff]/25 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span className="uppercase tracking-wider">Direct Transmission Channel:</span>
            <span className="text-[#00f0ff] text-[11px] font-mono font-semibold">Ready</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xs sm:text-sm text-white font-medium select-all block">
                  {contactData.email}
                </span>
                <span className="text-[10px] font-mono text-[#94a3b8]">
                  Verified response time: &lt; 24h
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111927] hover:bg-[#1e293b] text-xs font-mono text-[#cbd5e1] hover:text-white border border-[#1e293b] hover:border-[#00f0ff]/40 transition-colors"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${contactData.email}?subject=N-VERSE%20Portfolio%20Inquiry`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-white text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95"
                aria-label="Send email via mail client"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Verified Professional Channels Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] block">
            Verified External Channels:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {contactData.github && (
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0b121e]/90 hover:bg-[#111927] border border-[#1e293b] hover:border-[#00f0ff]/50 transition-all text-center group shadow-sm hover:scale-105"
                aria-label="Open GitHub Profile"
              >
                <GithubIcon className="w-5 h-5 text-[#94a3b8] group-hover:text-[#00f0ff] transition-colors mb-1.5" />
                <span className="text-xs font-semibold text-white">GitHub</span>
                <span className="text-[10px] font-mono text-[#64748b]">Code & Repos</span>
              </a>
            )}

            {contactData.linkedin && (
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0b121e]/90 hover:bg-[#111927] border border-[#1e293b] hover:border-[#00f0ff]/50 transition-all text-center group shadow-sm hover:scale-105"
                aria-label="Open LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5 text-[#94a3b8] group-hover:text-[#00a3ff] transition-colors mb-1.5" />
                <span className="text-xs font-semibold text-white">LinkedIn</span>
                <span className="text-[10px] font-mono text-[#64748b]">Professional</span>
              </a>
            )}

            {contactData.leetcode && (
              <a
                href={contactData.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0b121e]/90 hover:bg-[#111927] border border-[#1e293b] hover:border-[#00f0ff]/50 transition-all text-center group shadow-sm hover:scale-105"
                aria-label="Open LeetCode Profile"
              >
                <Code2 className="w-5 h-5 text-[#94a3b8] group-hover:text-amber-400 transition-colors mb-1.5" />
                <span className="text-xs font-semibold text-white">LeetCode</span>
                <span className="text-[10px] font-mono text-[#64748b]">Problem Solving</span>
              </a>
            )}

            {contactData.resumeUrl && (
              <a
                href={contactData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0b121e]/90 hover:bg-[#111927] border border-[#1e293b] hover:border-[#00f0ff]/50 transition-all text-center group shadow-sm hover:scale-105"
                aria-label="View or Download Resume"
              >
                <FileText className="w-5 h-5 text-[#94a3b8] group-hover:text-emerald-400 transition-colors mb-1.5" />
                <span className="text-xs font-semibold text-white">Resume</span>
                <span className="text-[10px] font-mono text-[#64748b]">PDF Document</span>
              </a>
            )}
          </div>
        </div>

        {/* Ending Philosophy & Quick Journey Restart */}
        <div className="pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#64748b] uppercase">
              Developer Universe Mantra
            </div>
            <div className="text-sm font-extrabold tracking-wider text-[#00f0ff] font-['Outfit']">
              {profileData.tagline}
            </div>
          </div>

          <button
            onClick={() => jumpToSection('gate')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b121e] hover:bg-[#111927] text-xs font-mono text-[#cbd5e1] hover:text-[#00f0ff] border border-[#1e293b] hover:border-[#00f0ff]/40 transition-colors"
            title="Return to N/VERSE Gateway"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Gateway</span>
          </button>
        </div>
      </div>
    </div>
  );
}
