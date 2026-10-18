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
      <div className="fixed inset-0 bg-[#000000]" />
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
