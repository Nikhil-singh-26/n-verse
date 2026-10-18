'use client';

import dynamic from 'next/dynamic';
import { ExperienceProvider } from '@/context/ExperienceContext';

// Dynamic import with SSR disabled to guarantee Three.js / WebGL only initializes client-side
const ExperienceController = dynamic(
  () =>
    import('@/components/experience/ExperienceController').then(
      (mod) => mod.ExperienceController
    ),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#05070b] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wider font-['Outfit']">
          <span className="text-gradient-cyan">N/VERSE</span>
        </h1>
        <p className="text-xs font-mono text-[#00f0ff] animate-pulse">
          PREPARING 3D ENVIRONMENT...
        </p>
      </div>
    )
  }
);

export default function HomePage() {
  return (
    <ExperienceProvider>
      <ExperienceController />
    </ExperienceProvider>
  );
}
