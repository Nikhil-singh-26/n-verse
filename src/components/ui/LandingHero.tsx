"use client";

interface LandingHeroProps {
  isExploring: boolean;
  onStartExploring: () => void;
}

export function LandingHero({
  isExploring,
  onStartExploring,
}: LandingHeroProps) {
  if (isExploring) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      <div className="w-full max-w-xl bg-slate-950/85 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 text-white pointer-events-auto transform transition-all animate-in fade-in zoom-in-95 duration-500">
        {/* Top Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-sm bg-emerald-400 rotate-45" />
            3D Portfolio Village
          </div>
          <span className="text-xs text-slate-400 font-mono">v0.2.0 • Milestone 2</span>
        </div>

        {/* Hero Title */}
        <div className="mb-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            N-VERSE
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest font-mono">
            Interactive Developer Village
          </p>
        </div>

        {/* Developer Introduction */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          Welcome to <span className="text-white font-medium">N-VERSE</span>, an original 3D developer portfolio. Explore six architectural buildings arranged around the village square: <span className="text-emerald-400">About Me</span>, <span className="text-sky-400">Skills</span>, <span className="text-amber-400">Projects</span>, <span className="text-slate-300">Experience</span>, <span className="text-rose-400">Education</span>, and <span className="text-teal-400">Contact</span>. Approach any entrance and press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-emerald-300">E</kbd> to open its door!
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-7 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-base sm:text-lg mb-0.5">🏛️</div>
            <div className="text-[11px] font-semibold text-slate-200">6 Buildings</div>
            <div className="text-[10px] text-slate-400">Unique Silhouettes</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-base sm:text-lg mb-0.5">🚪</div>
            <div className="text-[11px] font-semibold text-slate-200">Interactive Doors</div>
            <div className="text-[10px] text-slate-400">Press E on Proximity</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-base sm:text-lg mb-0.5">🚶</div>
            <div className="text-[11px] font-semibold text-slate-200">Village Paths</div>
            <div className="text-[10px] text-slate-400">Cobblestone Grid</div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onStartExploring}
            className="w-full sm:flex-1 group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Start Exploring Village</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            W
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            A
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            S
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            D
          </kbd>
          <span>to move •</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            E
          </kbd>
          <span>to open/close doors</span>
        </div>
      </div>
    </div>
  );
}
