"use client";

import { useVillage } from "@/context/VillageContext";

interface InteractionPromptProps {
  isExploring: boolean;
}

export function InteractionPrompt({ isExploring }: InteractionPromptProps) {
  const { activeBuilding, doorsOpen, toggleDoor } = useVillage();

  if (!isExploring || !activeBuilding) return null;

  const isOpen = !!doorsOpen[activeBuilding.id];

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        onClick={() => toggleDoor(activeBuilding.id)}
        className="group flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-950/90 hover:bg-slate-900/95 backdrop-blur-xl border border-emerald-400/50 hover:border-emerald-400 shadow-2xl shadow-emerald-500/20 text-white cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {/* Animated [E] Key Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm tracking-wider font-mono shadow-md shadow-emerald-500/40 group-hover:bg-emerald-400 transition-colors">
          E
        </div>

        {/* Prompt Information */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isOpen ? "Close Door" : "Enter Building"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="text-xs font-medium text-slate-300">
              {activeBuilding.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">
            {activeBuilding.category}
          </span>
        </div>

        {/* Action arrow / icon */}
        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700 transition-colors">
          <svg
            className={`w-3.5 h-3.5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
