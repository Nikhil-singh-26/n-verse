"use client";

import { useVillage } from "@/context/VillageContext";

interface NavigationHUDProps {
  isExploring: boolean;
  onToggleExplore: () => void;
}

export function NavigationHUD({
  isExploring,
  onToggleExplore,
}: NavigationHUDProps) {
  const { activeBuilding } = useVillage();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 pointer-events-none select-none">
      {/* Brand mark */}
      <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/90 rounded-2xl px-4 py-2.5 shadow-xl pointer-events-auto">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-emerald-400 rounded-sm rotate-45 shadow-sm shadow-emerald-400" />
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-wider text-white">
            N-VERSE
          </span>
          <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Portfolio Village
          </span>
        </div>
      </div>

      {/* Center Zone Indicator (When exploring and approaching a building) */}
      {isExploring && activeBuilding && (
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl px-4 py-2 shadow-xl animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            Near {activeBuilding.name}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            ({activeBuilding.category})
          </span>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleExplore}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-slate-800/90 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-xl cursor-pointer"
        >
          <span>{isExploring ? "📋 Village Overview" : "🎮 Resume Exploring"}</span>
        </button>
      </div>
    </header>
  );
}
