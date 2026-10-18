'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export function formatTerminalLine(line: string) {
  // URL matching
  const urlMatch = line.match(/(https?:\/\/[^\s]+|\/resume\.pdf)/);
  if (urlMatch && urlMatch.index !== undefined) {
    const url = urlMatch[1];
    const prefix = line.substring(0, urlMatch.index);
    return (
      <span className="break-all">
        {prefix && <span className="text-[#38bdf8] font-semibold">{prefix}</span>}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00f0ff] hover:text-white underline inline-flex items-center gap-1 font-bold transition-colors"
        >
          {url}
          <ExternalLink className="w-2.5 h-2.5 inline flex-shrink-0" />
        </a>
      </span>
    );
  }

  // Email matching
  const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch && emailMatch.index !== undefined) {
    const email = emailMatch[1];
    const prefix = line.substring(0, emailMatch.index);
    return (
      <span className="break-all">
        {prefix && <span className="text-[#38bdf8] font-semibold">{prefix}</span>}
        <a
          href={`mailto:${email}`}
          className="text-[#00f0ff] hover:text-white underline font-bold transition-colors"
        >
          {email}
        </a>
      </span>
    );
  }

  // Key-value highlight if line starts with key like "Degree:" or "Languages:"
  const colonIdx = line.indexOf(':');
  if (colonIdx > 0 && colonIdx < 28 && !line.startsWith(' ')) {
    const key = line.substring(0, colonIdx + 1);
    const val = line.substring(colonIdx + 1);
    return (
      <span>
        <span className="text-[#38bdf8] font-semibold">{key}</span>
        <span className="text-[#e2e8f0]">{val}</span>
      </span>
    );
  }

  return <span>{line}</span>;
}

interface TerminalOutputLogProps {
  history: { cmd: string; output: string | string[] }[];
  isCompact?: boolean;
}

export function TerminalOutputLog({ history, isCompact = false }: TerminalOutputLogProps) {
  // Isolate scroll so wheel/touch inside does NOT advance GSAP main timeline
  const handleScrollIsolation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const displayedHistory = isCompact ? history.slice(-3) : history;

  return (
    <div
      onWheel={handleScrollIsolation}
      onTouchMove={handleScrollIsolation}
      className={`overflow-y-auto space-y-2.5 font-mono ${
        isCompact ? 'text-[10.5px] leading-relaxed p-2' : 'text-xs sm:text-sm leading-relaxed p-4'
      }`}
    >
      {displayedHistory.length === 0 ? (
        <div className="text-[#64748b] italic py-2">
          Terminal screen cleared. Select a prompt or type a command to continue.
        </div>
      ) : (
        displayedHistory.map((item, idx) => (
          <div key={`hist-${idx}`} className="space-y-1">
            <div className="text-[#00f0ff] font-semibold flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">&gt;</span>
              <span>{item.cmd}</span>
            </div>
            <div className="pl-3 border-l-2 border-[#00f0ff]/30 text-[#cbd5e1] space-y-0.5">
              {Array.isArray(item.output) ? (
                <ul className="space-y-0.5">
                  {item.output.map((line, lIdx) => (
                    <li key={`l-${lIdx}`}>{formatTerminalLine(line)}</li>
                  ))}
                </ul>
              ) : (
                <p>{formatTerminalLine(item.output)}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
