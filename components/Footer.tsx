"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Sparkles, Twitter } from "lucide-react";
import { profile, socials } from "@/lib/data";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
};

function SocialLink({ label, href, iconKey }: { label: string; href: string; iconKey: keyof typeof iconMap }) {
  const [hovered, setHovered] = useState(false);
  const Icon = iconMap[iconKey];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={href}
        target={iconKey === "email" ? undefined : "_blank"}
        rel="noreferrer"
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800/60 bg-zinc-900/60 text-zinc-400 backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:text-violet-300"
      >
        <Icon className="h-4 w-4" />
      </a>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-800/60 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200 shadow-lg"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-zinc-800/60 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-semibold text-zinc-200">
            {profile.name}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            &copy; {year} {profile.name}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <SocialLink
              key={s.key}
              label={s.label}
              href={s.href}
              iconKey={s.key}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-zinc-800/60 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-500">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          Engineered with React &amp; Tailwind
        </div>
      </div>
    </footer>
  );
}
