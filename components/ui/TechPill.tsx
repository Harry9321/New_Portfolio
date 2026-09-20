export function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-800/60 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:text-violet-300">
      {label}
    </span>
  );
}
