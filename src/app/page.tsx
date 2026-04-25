export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="mb-8 text-7xl font-black tracking-tighter text-white">
          Guidotti
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-zinc-400 uppercase tracking-widest font-medium">
            Sito in costruzione
          </span>
        </div>

        <p className="text-zinc-400 text-lg leading-relaxed">
          Il portfolio sta per arrivare. Torna presto.
        </p>

        <div className="mt-12 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />

        <p className="mt-6 text-xs text-zinc-600">
          © {new Date().getFullYear()} Guidotti
        </p>
      </div>
    </main>
  );
}
