# Hariom Sahu — Portfolio

Personal site with projects, demo videos and a blog. Plain **HTML, CSS and JavaScript**: no framework, no build step, free to host.

## Structure

```
index.html                 Home: hero, about, experience, featured projects, latest posts, contact
projects/index.html        All projects, filterable by type
blog/index.html            All posts, filterable by tag
blog/post.html             Renders a single post (?slug=...)
blog/posts/*.md            Your posts, written in Markdown
data/projects.json         ← add projects here
data/posts.json            ← list posts here
assets/css/styles.css      Design tokens, layout, light + dark themes
assets/js/site.js          All behaviour (one file, no dependencies)
assets/img/                Images: projects/, blog/
```

## Deploy for free (GitHub Pages)

1. In the repo, open **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, then choose `main` and `/ (root)`. Save.
3. After a minute or two the site is live at **https://harry9321.github.io/New_Portfolio/**.

Every push to `main` redeploys automatically. For a custom domain later, add it in the same Pages screen. The site uses relative links, so it works at any address.

## Add a project

Add an entry to `data/projects.json`. Order in the file = order on the site.

```json
{
  "id": "my-project",
  "title": "My Project",
  "type": "Personal",
  "year": "2026",
  "category": "GenAI · Tooling",
  "summary": "One or two sentences on what it is and why it matters.",
  "highlights": ["What you built.", "A hard problem you solved.", "A result."],
  "tags": ["Python", "FastAPI", "React"],
  "kpi": { "value": "10×", "label": "faster than before" },
  "image": "assets/img/projects/my-project.png",
  "links": {
    "demo": "https://my-project.vercel.app",
    "video": "https://www.youtube.com/watch?v=VIDEO_ID",
    "source": "https://github.com/Harry9321/my-project"
  },
  "featured": true
}
```

- **type** becomes a filter chip on the Projects page (e.g. `Professional`, `Personal`, `Open source`, `Hackathon`).
- **featured: true** shows it on the home page (the first 4 featured are shown).
- **links**: leave any empty (`""`) and its button is hidden.
- **video** accepts YouTube, Vimeo, Loom, Google Drive, or a direct `.mp4` / `.webm` link. It plays in a pop-up player.
- **image** is optional. Without one, a YouTube video's thumbnail is used; without either, a clean cover is drawn from `kpi`.
- **confidential: true** shows "Proprietary · details on request" when there are no public links.

**Demo videos:** upload them to YouTube as *Unlisted* (free, fast, no size limit) and paste the link. Keep large video files out of the repo; GitHub Pages has a 1 GB site limit.

**Screenshots:** 1600×900 (16:9) PNG or WebP works best.

## Write a blog post

1. Copy `blog/posts/_template.md` to `blog/posts/my-post-slug.md` and write in Markdown.
2. Add it to `data/posts.json`:

```json
[
  {
    "slug": "my-post-slug",
    "title": "From 40 minutes to 3: re-architecting a validation monolith",
    "date": "2026-10-01",
    "summary": "One line that makes people want to read it.",
    "tags": ["Performance", "Celery"]
  }
]
```

Posts are sorted newest first automatically. Add `"draft": true` to hide a post while you're writing it. The home page shows the latest 3; the "Writing" section stays hidden until you publish your first post.

Markdown supports headings, code blocks with syntax highlighting, tables, quotes and images (`../assets/img/blog/file.png`). To embed a video in a post:

```html
<div class="embed" data-video="https://www.youtube.com/watch?v=VIDEO_ID"></div>
```

## Run locally

Pages load their content from the JSON files, so use a local server rather than opening the file directly:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Edit the design

Colours, fonts and spacing are tokens at the top of `assets/css/styles.css` (`--accent`, `--bg`, …), with dark-mode values right below. The theme follows the visitor's system setting; the header toggle overrides it.
