"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { articles } from "@/lib/data";

export function Insights() {
  return (
    <section id="articles" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Insights"
          title="Notes from the field"
          description="Write-ups on the systems problems I've actually run into — latency, reliability, and building GenAI features that hold up."
        />

        <div className="flex flex-col divide-y divide-zinc-800/60 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
          {articles.map((article, i) => (
            <Reveal key={article.id} delay={i * 0.06}>
              <motion.a
                href={article.url}
                whileHover={{ backgroundColor: "rgba(63,63,70,0.15)" }}
                transition={{ duration: 0.25 }}
                className="group flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-zinc-100 transition-colors group-hover:text-violet-300 sm:text-lg">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-400">
                    {article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border border-zinc-800/60 text-zinc-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-violet-500/40 group-hover:text-violet-300 sm:self-center">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
