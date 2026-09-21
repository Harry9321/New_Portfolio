"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechPill } from "@/components/ui/TechPill";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Production systems, not side projects"
          description="Four pieces of the platform I've built and shipped at Multi Commodity Exchange — from GenAI retrieval to real-time fraud signals."
        />

        <StaggerGroup
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          stagger={0.1}
        >
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm transition-colors hover:border-zinc-700/80"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                  <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-950/80 text-zinc-200 backdrop-blur-sm transition-colors hover:border-violet-500/50 hover:text-violet-300"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-950/80 text-zinc-200 backdrop-blur-sm transition-colors hover:border-violet-500/50 hover:text-violet-300"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
                    {project.category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-zinc-100">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {project.breakdown.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-[13px] leading-relaxed text-zinc-400"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2 pt-1">
                    {project.tech.map((t) => (
                      <TechPill key={t} label={t} />
                    ))}
                  </div>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
