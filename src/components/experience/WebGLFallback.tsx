'use client';

import React from 'react';
import { profileData } from '@/data/profile';
import { skillCategories } from '@/data/skills';
import { projectsData } from '@/data/projects';
import { achievementsData } from '@/data/achievements';
import {
  Mail,
  Code2,
  ExternalLink,
  Award,
  GraduationCap,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import { formatTerminalLine } from '@/components/ui/TerminalOutput';

export function WebGLFallback() {
  return (
    <main className="min-h-screen bg-[#05070b] text-[#f8fafc] px-4 py-12 sm:px-8 md:px-16 max-w-5xl mx-auto space-y-20">
      {/* Fallback Notice */}
      <div className="p-4 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] flex items-center justify-between">
        <span>Displaying Accessible 2D Portfolio View (WebGL / 3D Hardware Accelerated Mode Unavailable or Bypassed).</span>
      </div>

      {/* Hero / Identity */}
      <header className="space-y-4 border-b border-[#1e293b] pb-10">
        <div className="inline-block px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-xs uppercase tracking-widest">
          {profileData.brand} // Portfolio
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit']">
          {profileData.name}
        </h1>
        <p className="text-lg sm:text-xl text-[#00f0ff] font-mono">
          {profileData.role}
        </p>
        <p className="text-[#94a3b8] max-w-2xl text-sm sm:text-base leading-relaxed">
          {profileData.bio.join(' ')}
        </p>
      </header>

      {/* About & Education */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-[#00f0ff] pl-3">
          About & Engineering Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.terminalPrompts.map((p) => (
            <div key={p.command} className="p-4 rounded-xl bg-[#0b121e] border border-[#1e293b] space-y-2">
              <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase">&gt; {p.command}</span>
              <div className="text-xs text-[#cbd5e1] leading-relaxed space-y-1">
                {Array.isArray(p.output) ? (
                  p.output.map((line, lIdx) => (
                    <div key={lIdx}>{formatTerminalLine(line)}</div>
                  ))
                ) : (
                  <div>{formatTerminalLine(p.output)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-[#00f0ff] pl-3">
          Technical Stack & Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl bg-[#0b121e] border border-[#1e293b] space-y-3">
              <h3 className="font-semibold text-white text-sm">{cat.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#111927] text-xs font-mono text-[#38bdf8] border border-[#1e293b]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-[#00f0ff] pl-3">
          Featured Engineering Projects
        </h2>
        <div className="space-y-6">
          {projectsData.map((project) => (
            <article key={project.id} className="p-6 rounded-2xl bg-[#0b121e] border border-[#1e293b] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase">{project.category}</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{project.title}</h3>
                </div>
                <div className="flex gap-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#111927] hover:bg-[#1e293b] text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/20 text-xs font-mono text-[#00f0ff] flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#cbd5e1]">{project.purpose}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#111927] text-[11px] font-mono text-[#94a3b8]">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-l-4 border-[#00f0ff] pl-3">
          Milestones & Education
        </h2>
        <div className="space-y-3">
          {achievementsData.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-[#0b121e] border border-[#1e293b] flex justify-between items-start gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-[#94a3b8] font-mono mt-0.5">{item.organization}</p>
                <p className="text-xs text-[#cbd5e1] mt-2">{item.description}</p>
                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#00f0ff] hover:underline mt-2"
                  >
                    <span>View Verified Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <span className="text-[11px] font-mono text-[#00f0ff] flex-shrink-0">{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Station */}
      <footer className="space-y-6 border-t border-[#1e293b] pt-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">LET&apos;S CONNECT</h2>
        <p className="text-xs sm:text-sm text-[#cbd5e1] font-mono max-w-lg mx-auto">
          Have an interesting project, an opportunity, or an idea worth building? Let&apos;s talk.
        </p>
        <p className="text-sm text-[#00f0ff] font-mono font-medium">
          <a href={`mailto:${profileData.contactLinks.email}`} className="hover:underline">
            {profileData.contactLinks.email}
          </a>
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
          {profileData.contactLinks.github && (
            <a href={profileData.contactLinks.github} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:text-white transition-colors">
              GitHub
            </a>
          )}
          {profileData.contactLinks.linkedin && (
            <a href={profileData.contactLinks.linkedin} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:text-white transition-colors">
              LinkedIn
            </a>
          )}
          {profileData.contactLinks.leetcode && (
            <a href={profileData.contactLinks.leetcode} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:text-white transition-colors">
              LeetCode
            </a>
          )}
          {profileData.contactLinks.resume && (
            <a href={profileData.contactLinks.resume} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:text-white transition-colors">
              Resume (PDF)
            </a>
          )}
        </div>
        <p className="text-sm font-bold text-[#00f0ff] font-['Outfit'] pt-4">
          {profileData.tagline}
        </p>
      </footer>
    </main>
  );
}
