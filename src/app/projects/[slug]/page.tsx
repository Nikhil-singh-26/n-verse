import { projectsData } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Sparkles, Layers, Cpu } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found | N/VERSE' };

  return {
    title: `${project.title} — Case Study | N/VERSE`,
    description: project.purpose
  };
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-[#f8fafc] px-4 py-8 sm:px-8 md:px-16 max-w-4xl mx-auto space-y-10">
      {/* Top Navigation Back to 3D Universe */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b121e] hover:bg-[#111927] border border-[#1e293b] hover:border-[#00f0ff]/50 text-xs font-mono text-[#00f0ff] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to 3D Laboratory</span>
        </Link>

        <span className="text-xs font-mono text-[#64748b]">
          N/VERSE // ARCHIVE
        </span>
      </div>

      {/* Case Study Header */}
      <header className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-xs uppercase tracking-widest">
          {project.category} &bull; {project.status}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-[#94a3b8] font-mono">
          {project.tagline}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-xs font-mono text-white border border-[#1e293b] hover:border-[#00f0ff]/50 transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-[#00f0ff]" />
              <span>Source Repository</span>
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] border border-[#00f0ff]/50 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>
      </header>

      {/* Purpose & Overview */}
      <section className="p-6 rounded-2xl glass-panel space-y-4 border border-[#00f0ff]/20">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00f0ff]" />
          <span>Project Purpose & Objectives</span>
        </h2>
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          {project.purpose}
        </p>
      </section>

      {/* Technical Architecture & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl bg-[#0b121e] border border-[#1e293b] space-y-3">
          <h3 className="text-sm font-mono font-semibold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>Problem Statement</span>
          </h3>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {project.details.problemStatement}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#0b121e] border border-[#1e293b] space-y-3">
          <h3 className="text-sm font-mono font-semibold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Architecture & Design</span>
          </h3>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {project.details.architectureOverview}
          </p>
        </section>
      </div>

      {/* Key Functionality & Highlights */}
      <section className="p-6 rounded-2xl bg-[#0b121e] border border-[#1e293b] space-y-4">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
          Key Functionality & Verified Highlights
        </h3>
        <ul className="space-y-2">
          {project.keyFunctionality.map((func, i) => (
            <li key={`func-${i}`} className="flex items-start gap-2.5 text-xs text-[#cbd5e1]">
              <span className="text-[#00f0ff] font-bold">&bull;</span>
              <span>{func}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Technology Stack Grid */}
      <section className="p-6 rounded-2xl bg-[#0b121e] border border-[#1e293b] space-y-3">
        <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
          Technologies Implemented
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={`tech-${idx}`}
              className="px-3 py-1.5 rounded-lg bg-[#070b12] text-xs font-mono text-[#38bdf8] border border-[#00f0ff]/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer Return Link */}
      <footer className="text-center pt-8 border-t border-[#1e293b]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00f0ff] hover:bg-white text-black font-mono font-bold text-xs transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to N/VERSE 3D Universe</span>
        </Link>
      </footer>
    </div>
  );
}
