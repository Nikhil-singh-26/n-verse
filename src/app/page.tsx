export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Clean Foundation Ready
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Nikhil&apos;s Portfolio
        </h1>
        <p className="text-sm text-slate-400">
          The previous implementation has been cleaned up. The workspace is ready for the complete rebuild.
        </p>
      </div>
    </main>
  );
}
