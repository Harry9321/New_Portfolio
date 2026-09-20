import { Compass, Gauge, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { philosophy, stats } from "@/lib/data";

const icons = [Compass, Gauge, ShieldCheck];

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          title="Systems thinking, applied to real production scale"
          description="A snapshot of the impact I've shipped and the principles that guide how I build."
        />

        <StaggerGroup
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.08}
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="card-glow group h-full rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700/80">
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {philosophy.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="card-glow group h-full rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700/80">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
