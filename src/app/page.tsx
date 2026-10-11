"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LandingHero } from "@/components/ui/LandingHero";
import { ControlsHint } from "@/components/ui/ControlsHint";
import { NavigationHUD } from "@/components/ui/NavigationHUD";
import { InteractionPrompt } from "@/components/ui/InteractionPrompt";
import { VillageProvider } from "@/context/VillageContext";

// Dynamically import Experience with SSR disabled for optimal Three.js / WebGL stability
const Experience = dynamic(
  () => import("@/components/canvas/Experience").then((mod) => mod.Experience),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-0">
        <div className="relative w-16 h-16 mb-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-xl animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-400 rounded-sm rotate-45 animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-semibold tracking-widest text-emerald-400 uppercase font-mono">
          Generating Portfolio Village...
        </p>
      </div>
    ),
  }
);

export default function Home() {
  const [isExploring, setIsExploring] = useState(false);

  return (
    <VillageProvider>
      <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
        {/* 3D WebGL Canvas Layer */}
        <Experience isExploring={isExploring} />

        {/* Top Header Navigation */}
        <NavigationHUD
          isExploring={isExploring}
          onToggleExplore={() => setIsExploring((prev) => !prev)}
        />

        {/* Hero Card & Intro (Active before exploring) */}
        <LandingHero
          isExploring={isExploring}
          onStartExploring={() => setIsExploring(true)}
        />

        {/* Interactive Door Proximity Prompt (Active when near a building entrance) */}
        <InteractionPrompt isExploring={isExploring} />

        {/* Active Keyboard Controls Overlay (Active during exploring) */}
        <ControlsHint isExploring={isExploring} />
      </main>
    </VillageProvider>
  );
}
