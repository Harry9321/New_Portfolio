"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechPill } from "@/components/ui/TechPill";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/lib/data";

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <section id="experience" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've built"
          description="From day one at MCX to the foundation laid in university — the path so far."
        />

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-zinc-800 to-transparent sm:left-[23px]" />

          <div className="space-y-4">
            {experience.map((item, i) => {
              const isOpen = openId === item.id;
              const Icon = item.type === "work" ? Briefcase : GraduationCap;
              return (
                <Reveal key={item.id} delay={i * 0.08}>
                  <div className="relative pl-12 sm:pl-14">
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800/60 bg-zinc-900 text-violet-300 shadow-[0_0_0_4px_rgba(9,9,11,1)] sm:h-12 sm:w-12">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <div className="card-glow overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm transition-colors hover:border-zinc-700/80">
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className="flex w-full flex-col gap-2 p-5 text-left sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">
                              {item.role}
                            </h3>
                            {item.type === "work" && (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-zinc-400">
                            {item.org} &middot; {item.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="whitespace-nowrap font-mono text-xs text-zinc-500">
                            {item.start} &ndash; {item.end}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="border-t border-zinc-800/60 px-5 pb-6 pt-4 sm:px-6">
                              <p className="text-sm leading-relaxed text-zinc-400">
                                {item.summary}
                              </p>
                              <ul className="mt-4 space-y-2.5">
                                {item.achievements.map((point) => (
                                  <li
                                    key={point}
                                    className="flex gap-2.5 text-sm leading-relaxed text-zinc-300"
                                  >
                                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-5 flex flex-wrap gap-2">
                                {item.tech.map((t) => (
                                  <TechPill key={t} label={t} />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
