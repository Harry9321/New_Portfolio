export function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="bg-noise absolute inset-0" />
      <div className="bg-glow-violet absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full blur-3xl" />
      <div className="bg-glow-cyan absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full blur-3xl" />
      <div className="bg-glow-emerald absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
