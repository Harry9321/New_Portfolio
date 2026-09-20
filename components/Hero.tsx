"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileDown, MapPin, Sparkles } from "lucide-react";
import { profile, techStack } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:pt-40"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/60 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Software Engineer &mdash; Backend Systems &amp; AI Applications
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full text-balance text-4xl font-bold leading-[1.1] tracking-tighter text-zinc-50 sm:text-6xl sm:leading-[1.05] md:text-7xl"
        >
          Building systems that{" "}
          <span className="gradient-text animate-gradient-x bg-300%">
            scale, reason, and endure
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-full max-w-2xl text-balance text-lg leading-relaxed text-zinc-400"
        >
          {profile.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 flex items-center gap-1.5 text-sm text-zinc-500"
        >
          <MapPin className="h-3.5 w-3.5" />
          {profile.location}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_0_0_rgba(139,92,246,0.5)] transition-shadow duration-300 hover:shadow-[0_0_40px_4px_rgba(139,92,246,0.45)]"
          >
            View Work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
          >
            <FileDown className="h-4 w-4" />
            Resume / Contact
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-20 w-full max-w-3xl"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-zinc-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-zinc-950 to-transparent" />
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex shrink-0 items-center rounded-full border border-zinc-800/60 bg-zinc-900/40 px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
