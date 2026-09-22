# Hariom Sahu — Developer Portfolio

A modern, single-page developer portfolio built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **lucide-react**.

## Stack

- **Framework:** Next.js 15 / React 19, statically exported (no server required — deploys anywhere as static HTML)
- **Styling:** Tailwind CSS, dark-mode-first palette (`zinc-950` base, violet / cyan / emerald accents), glassmorphism, radial glows
- **Animation:** Framer Motion — scroll-triggered reveals, staggered grids, spring micro-interactions
- **Icons:** lucide-react

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & deploy

```bash
npm run build
```

`next.config.mjs` is set to `output: "export"`, so `npm run build` produces a fully static site in `out/` — drag-and-drop it onto Netlify, Cloudflare Pages, GitHub Pages, or any static host. It also deploys directly to **Vercel** with zero config (`vercel deploy`), including as a normal (non-exported) Next.js app if you remove `output: "export"` later and want server features.

## Project structure

```
app/                 Root layout, global styles, the single page that composes every section
components/          One component per section (Navbar, Hero, About, Experience, Projects, Insights, Contact, Footer)
components/ui/       Shared primitives — Reveal/Stagger animation wrappers, SectionHeading, StatCounter, TechPill, BackgroundGlow
lib/data.ts          All content (profile, experience, projects, articles, skills). Edit this file to update the site.
```

## Editing content

Everything text-based — your bio, experience bullets, project descriptions, article list, social links — lives in **`lib/data.ts`**. There's no content hardcoded inside components, so updating the site is a one-file edit.

A few things to personalize before you ship it:

- `profile.github` and `profile.x` in `lib/data.ts` are placeholders — swap in your real handles (only LinkedIn/email came from your resume).
- `articles` in `lib/data.ts` are placeholder blog post titles/links — point `url` at your real posts, or replace them with your actual articles.
- `projects[].image` uses royalty-free Unsplash photos as stand-ins — swap in real product screenshots for the strongest impression.
- The contact form (`components/Contact.tsx`) currently simulates a submit. Wire the `handleSubmit` function to a real endpoint (Formspree, Resend, a serverless function) to receive messages.

## Notes

- Fonts (Inter, JetBrains Mono) load from Google Fonts via a `<link>` tag in `app/layout.tsx` rather than `next/font/google`, so the build never depends on network access — useful for CI/sandboxed build environments.
- All animations respect `prefers-reduced-motion` behavior provided by Framer Motion's defaults.
