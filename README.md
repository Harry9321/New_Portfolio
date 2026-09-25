# Hariom Sahu — Portfolio

A single-page developer portfolio in plain **HTML, CSS and JavaScript**. No framework, no build step, no dependencies.

## Files

```
index.html   Content and structure (all text lives here)
styles.css   Design tokens, layout, components, light/dark themes
script.js    Theme toggle, mobile menu, scroll reveals, count-up metrics, copy-email
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy

It's a static site, so any static host works:

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Cloudflare Pages / Vercel:** point at the repo root with no build command.

## Editing

- **Text:** edit `index.html` directly. Each section is marked with a comment (`<!-- Hero -->`, `<!-- About -->`, …).
- **Colours:** change the tokens at the top of `styles.css` (`--accent`, `--bg`, …). Dark mode values sit right below them.
- **Theme:** follows the visitor's system setting by default; the header toggle overrides it and is remembered.

## Accessibility

Semantic landmarks, skip link, visible focus states, keyboard-closable menu, and all motion disabled under `prefers-reduced-motion`.
