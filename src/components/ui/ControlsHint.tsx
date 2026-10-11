"use client";

import { useKeyboard } from "@/hooks/useKeyboard";

interface ControlsHintProps {
  isExploring: boolean;
  onResetPlayer?: () => void;
}

export function ControlsHint({ isExploring }: ControlsHintProps) {
  const keys = useKeyboard();

  if (!isExploring) return null;

  return (
    <div className="fixed bottom-6 right-6 z-20 pointer-events-auto select-none">
      <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-200 transition-all duration-300">
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Active Controls
            </span>
          </div>
          <span className="text-[10px] text-slate-400">WASD + Space + E</span>
        </div>

        {/* Directional Pad Visualization */}
        <div className="flex flex-col items-center gap-1.5 mb-3">
          {/* Forward */}
          <div
            className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
              keys.forward
                ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/50 scale-95"
                : "bg-slate-900 border-slate-700 text-slate-300"
            }`}
          >
            W
          </div>

          {/* Left, Backward, Right */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                keys.left
                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/50 scale-95"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              A
            </div>
            <div
              className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                keys.backward
                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/50 scale-95"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              S
            </div>
            <div
              className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                keys.right
                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/50 scale-95"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              D
            </div>
          </div>
        </div>

        {/* Action Keys */}
        <div className="flex items-center gap-1.5 pt-1 text-[11px] flex-wrap justify-center">
          <div
            className={`px-2 py-1 rounded-md border font-mono transition-all ${
              keys.sprint
                ? "bg-sky-500 border-sky-400 text-slate-950 font-bold"
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            Shift: Sprint
          </div>
          <div
            className={`px-2 py-1 rounded-md border font-mono transition-all ${
              keys.jump
                ? "bg-amber-400 border-amber-300 text-slate-950 font-bold"
                : "bg-slate-900 border-slate-700 text-slate-400"
            }`}
          >
            Space: Jump
          </div>
          <div className="px-2 py-1 rounded-md border font-mono bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold">
            E: Door
          </div>
        </div>
      </div>
    </div>
  );
}
