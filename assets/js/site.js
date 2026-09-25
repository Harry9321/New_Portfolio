/* ==========================================================================
   Hariom Sahu — Portfolio
   One dependency-free script for every page. Each page sets
   <body data-page="home|projects|blog|post" data-root="../">.
   Content lives in data/projects.json and data/posts.json.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var ROOT = body.dataset.root || "";
  var PAGE = body.dataset.page || "home";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js");

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function isExternal(url) { return /^https?:\/\//i.test(url); }
  function resolve(url) { return !url || isExternal(url) || url.charAt(0) === "/" ? url : ROOT + url; }

  function loadJSON(path) {
    return fetch(ROOT + path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " → " + r.status);
      return r.json();
    });
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
    if (!m) return esc(iso);
    return parseInt(m[3], 10) + " " + MONTHS[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  function slugify(text) {
    return String(text).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
  }

  function publishedPosts(posts) {
    return (posts || [])
      .filter(function (p) { return p && p.slug && !p.draft; })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  /* ------------------------------------------------------------------ *
   * Theme, menu, header
   * ------------------------------------------------------------------ */
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeBtn = $("#theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  }

  var menuBtn = $("#menu-toggle");
  var nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  var header = $(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight in-page nav links on the home page as sections scroll by.
  if (PAGE === "home" && "IntersectionObserver" in window) {
    var anchors = $$('.nav a[href^="#"]');
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchors.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    anchors.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) navObserver.observe(s); });
  }

  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  var revealObserver = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); revealObserver.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
  }

  function reveal(scope) {
    var groups = new Map();
    $$(".reveal:not(.is-in)", scope).forEach(function (el) {
      if (!revealObserver) { el.classList.add("is-in"); return; }
      var parent = el.parentElement;
      var i = groups.get(parent) || 0;
      el.style.setProperty("--d", Math.min(i * 70, 280) + "ms");
      groups.set(parent, i + 1);
      revealObserver.observe(el);
    });
  }
  reveal(doc);

  /* ------------------------------------------------------------------ *
   * Count-up metrics
   * ------------------------------------------------------------------ */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target, to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.decimals || "0", 10), start = null;
        (function frame(ts) {
          if (start === null) start = ts;
          var t = Math.min((ts - start) / 1400, 1);
          el.textContent = (to * (1 - Math.pow(1 - t, 4))).toFixed(dec);
          if (t < 1) requestAnimationFrame(frame);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$(".count").forEach(function (el) { countObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Toast + copy email + year
   * ------------------------------------------------------------------ */
  var toast = doc.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  body.appendChild(toast);
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2000);
  }

  var copyBtn = $("#copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email, label = $(".copy-label", copyBtn);
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          label.textContent = "Copied";
          showToast("Email copied to clipboard");
          setTimeout(function () { label.textContent = "Copy"; }, 2000);
        }, function () { location.href = "mailto:" + email; });
      } else {
        location.href = "mailto:" + email;
      }
    });
  }

  $$(".year").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------------ *
   * Video: YouTube, Vimeo, Loom, Google Drive, or a direct .mp4/.webm
   * ------------------------------------------------------------------ */
  function parseVideo(url) {
    if (!url) return null;
    var m;
    if ((m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i.exec(url))) {
      return { kind: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0", thumb: "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg" };
    }
    if ((m = /vimeo\.com\/(?:video\/)?(\d+)/i.exec(url))) {
      return { kind: "iframe", src: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&dnt=1" };
    }
    if ((m = /loom\.com\/(?:share|embed)\/([\w-]+)/i.exec(url))) {
      return { kind: "iframe", src: "https://www.loom.com/embed/" + m[1] + "?autoplay=1" };
    }
    if ((m = /drive\.google\.com\/file\/d\/([\w-]+)/i.exec(url))) {
      return { kind: "iframe", src: "https://drive.google.com/file/d/" + m[1] + "/preview" };
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { kind: "file", src: resolve(url) };
    }
    return { kind: "link", src: url };
  }

  var dialog = null;
  function openVideo(url, title) {
    var v = parseVideo(url);
    if (!v) return;
    if (v.kind === "link") { window.open(v.src, "_blank", "noopener"); return; }

    if (!dialog) {
      dialog = doc.createElement("dialog");
      dialog.className = "video-dialog";
      dialog.innerHTML =
        '<div class="video-dialog-bar"><p class="video-dialog-title"></p>' +
        '<button class="icon-btn" type="button" data-close aria-label="Close video">' + ICON.close + "</button></div>" +
        '<div class="video-frame"></div>';
      body.appendChild(dialog);
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
      });
      dialog.addEventListener("close", function () { $(".video-frame", dialog).innerHTML = ""; });
    }

    $(".video-dialog-title", dialog).textContent = title || "Demo video";
    $(".video-frame", dialog).innerHTML = v.kind === "file"
      ? '<video src="' + esc(v.src) + '" controls autoplay playsinline></video>'
      : '<iframe src="' + esc(v.src) + '" title="' + esc(title || "Demo video") + '" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>';

    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.open(url, "_blank", "noopener");
  }

  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-video]");
    if (!trigger || trigger.classList.contains("embed")) return;
    e.preventDefault();
    openVideo(trigger.dataset.video, trigger.dataset.title);
  });

  /* ------------------------------------------------------------------ *
   * Project cards
   * ------------------------------------------------------------------ */
  function projectCard(p) {
    var links = p.links || {};
    var video = parseVideo(links.video);
    var title = esc(p.title);

    // Media: your image → YouTube thumbnail → typographic cover
    var mediaInner;
    if (p.image) {
      mediaInner = '<img src="' + esc(resolve(p.image)) + '" alt="" loading="lazy" decoding="async" />';
    } else if (video && video.thumb) {
      mediaInner = '<img src="' + esc(video.thumb) + '" alt="" loading="lazy" decoding="async" />';
    } else {
      mediaInner =
        '<div class="cover" aria-hidden="true">' +
          '<span class="cover-cat">' + esc(p.category || p.type || "") + "</span>" +
          (p.kpi ? '<span class="cover-kpi">' + esc(p.kpi.value) + "</span><span class=\"cover-label\">" + esc(p.kpi.label) + "</span>" : "") +
        "</div>";
    }

    var media = video
      ? '<button class="card-media is-playable" type="button" data-video="' + esc(links.video) + '" data-title="' + title + '" aria-label="Play demo video: ' + title + '">' +
          mediaInner + '<span class="play" aria-hidden="true">' + ICON.play + "</span></button>"
      : '<div class="card-media">' + mediaInner + "</div>";

    var actions = [];
    if (links.demo) actions.push('<a class="action action-primary" href="' + esc(resolve(links.demo)) + '" target="_blank" rel="noopener">Live demo ' + ICON.ext + "</a>");
    if (video) actions.push('<button class="action" type="button" data-video="' + esc(links.video) + '" data-title="' + title + '">' + ICON.play + " Watch demo</button>");
    if (links.source) actions.push('<a class="action" href="' + esc(resolve(links.source)) + '" target="_blank" rel="noopener">' + ICON.code + " Source</a>");
    if (!actions.length && p.confidential) actions.push('<span class="action action-muted">' + ICON.lock + " Proprietary · details on request</span>");

    var highlights = (p.highlights || []).length
      ? '<details class="card-details"><summary>What I did</summary><ul class="bullets">' +
          p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></details>"
      : "";

    var tags = (p.tags || []).length
      ? '<ul class="tags tags-sm">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"
      : "";

    var meta = [p.type, p.year].filter(Boolean).map(esc).join(" · ");

    return '<article class="card reveal" id="' + esc(p.id) + '">' + media +
      '<div class="card-body">' +
        (meta ? '<p class="card-meta">' + meta + "</p>" : "") +
        "<h3>" + title + "</h3>" +
        '<p class="card-summary">' + esc(p.summary) + "</p>" +
        highlights + tags +
        (actions.length ? '<div class="card-actions">' + actions.join("") + "</div>" : "") +
      "</div></article>";
  }

  function renderProjects(el, list) {
    el.innerHTML = list.length
      ? list.map(projectCard).join("")
      : '<p class="empty">No projects here yet.</p>';
    reveal(el);
  }

  /* ------------------------------------------------------------------ *
   * Post list items
   * ------------------------------------------------------------------ */
  function postItem(p) {
    var href = ROOT + "blog/post.html?slug=" + encodeURIComponent(p.slug);
    var tags = (p.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    return '<li class="post-item reveal"><a href="' + esc(href) + '">' +
      '<time class="post-date" datetime="' + esc(p.date) + '">' + formatDate(p.date) + "</time>" +
      '<div class="post-main"><h3>' + esc(p.title) + "</h3>" +
        (p.summary ? "<p>" + esc(p.summary) + "</p>" : "") +
        (tags ? '<ul class="tags tags-sm">' + tags + "</ul>" : "") +
      "</div>" +
      '<span class="post-arrow" aria-hidden="true">→</span></a></li>';
  }

  /* ------------------------------------------------------------------ *
   * Filter chips
   * ------------------------------------------------------------------ */
  function buildFilters(el, values, onChange) {
    if (values.length < 2) { el.hidden = true; return; }
    var all = ["All"].concat(values);
    el.innerHTML = all.map(function (v, i) {
      return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-value="' + esc(v) + '">' + esc(v) + "</button>";
    }).join("");
    el.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      $$(".chip", el).forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
      onChange(btn.dataset.value === "All" ? null : btn.dataset.value);
    });
  }

  function unique(list) {
    var seen = {}, out = [];
    list.forEach(function (v) { if (v && !seen[v]) { seen[v] = true; out.push(v); } });
    return out;
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function loadError(el, what) {
    el.innerHTML = '<p class="empty">Couldn\'t load ' + what + ". If you opened this file directly, run a local server (see README).</p>";
  }

  /* ------------------------------------------------------------------ *
   * Pages
   * ------------------------------------------------------------------ */
  var pages = {
    home: function () {
      var featuredEl = $("#featured-projects");
      loadJSON("data/projects.json").then(function (projects) {
        var featured = projects.filter(function (p) { return p.featured; });
        renderProjects(featuredEl, (featured.length ? featured : projects).slice(0, 4));
      }).catch(function () { loadError(featuredEl, "projects"); });

      loadJSON("data/posts.json").then(function (posts) {
        var latest = publishedPosts(posts).slice(0, 3);
        if (!latest.length) return;
        var list = $("#latest-posts");
        list.innerHTML = latest.map(postItem).join("");
        $("#writing").hidden = false;
        reveal($("#writing"));
      }).catch(function () { /* section stays hidden */ });
    },

    projects: function () {
      var grid = $("#all-projects"), count = $("#project-count");
      loadJSON("data/projects.json").then(function (projects) {
        function show(type) {
          var list = type ? projects.filter(function (p) { return p.type === type; }) : projects;
          renderProjects(grid, list);
          count.textContent = plural(list.length, "project");
        }
        buildFilters($("#project-filters"), unique(projects.map(function (p) { return p.type; })), show);
        show(null);
        if (location.hash) { var t = $(location.hash); if (t) t.scrollIntoView(); }
      }).catch(function () { loadError(grid, "projects"); });
    },

    blog: function () {
      var list = $("#all-posts"), count = $("#post-count");
      loadJSON("data/posts.json").then(function (raw) {
        var posts = publishedPosts(raw);
        if (!posts.length) {
          list.innerHTML = '<li class="empty empty-card"><strong>First posts are on the way.</strong><span>Write-ups on distributed pipelines, performance and production GenAI are coming soon.</span></li>';
          $("#post-filters").hidden = true;
          return;
        }
        function show(tag) {
          var shown = tag ? posts.filter(function (p) { return (p.tags || []).indexOf(tag) !== -1; }) : posts;
          list.innerHTML = shown.map(postItem).join("");
          count.textContent = plural(shown.length, "post");
          reveal(list);
        }
        var tags = unique([].concat.apply([], posts.map(function (p) { return p.tags || []; })));
        buildFilters($("#post-filters"), tags, show);
        show(null);
      }).catch(function () { loadError(list, "posts"); });
    },

    post: function () {
      var slug = new URLSearchParams(location.search).get("slug") || "";
      var titleEl = $("#post-title"), bodyEl = $("#post-body");

      function notFound() {
        doc.title = "Post not found — Hariom Sahu";
        titleEl.textContent = "Post not found";
        bodyEl.innerHTML = '<p>This post doesn\'t exist or has moved. <a href="./">See all posts</a>.</p>';
      }
      if (!/^[\w-]+$/.test(slug)) { notFound(); return; }

      Promise.all([
        loadJSON("data/posts.json"),
        fetch(ROOT + "blog/posts/" + slug + ".md", { cache: "no-cache" }).then(function (r) {
          if (!r.ok) throw new Error("missing");
          return r.text();
        })
      ]).then(function (res) {
        var posts = publishedPosts(res[0]);
        var meta = (res[0] || []).filter(function (p) { return p.slug === slug; })[0] || { slug: slug, title: slug };
        var md = res[1];

        // Header
        doc.title = meta.title + " — Hariom Sahu";
        titleEl.textContent = meta.title;
        if (meta.summary) {
          $("#post-summary").textContent = meta.summary;
          var d = $('meta[name="description"]'); if (d) d.setAttribute("content", meta.summary);
        }
        var words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
        var mins = Math.max(1, Math.round(words / 220));
        $("#post-meta").innerHTML = (meta.date ? '<time datetime="' + esc(meta.date) + '">' + formatDate(meta.date) + "</time> · " : "") + mins + " min read";
        $("#post-tags").innerHTML = (meta.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

        // Body: Markdown → HTML (sanitised). Falls back to plain text if the CDN is blocked.
        if (window.marked) {
          var html = window.marked.parse(md, { gfm: true });
          bodyEl.innerHTML = window.DOMPurify ? window.DOMPurify.sanitize(html, { ADD_ATTR: ["data-video", "target"] }) : html;
        } else {
          bodyEl.innerHTML = "<pre>" + esc(md) + "</pre>";
        }

        // Heading anchors, external links, code highlighting, video embeds
        $$("h2, h3", bodyEl).forEach(function (h) { if (!h.id) h.id = slugify(h.textContent); });
        $$("a[href]", bodyEl).forEach(function (a) {
          if (isExternal(a.getAttribute("href"))) { a.target = "_blank"; a.rel = "noopener"; }
        });
        if (window.hljs) $$("pre code", bodyEl).forEach(function (c) { window.hljs.highlightElement(c); });
        $$(".embed[data-video]", bodyEl).forEach(function (el) {
          var v = parseVideo(el.dataset.video);
          if (!v) return;
          if (v.kind === "link") {
            el.outerHTML = '<p><a href="' + esc(v.src) + '" target="_blank" rel="noopener">Watch the video ↗</a></p>';
            return;
          }
          el.innerHTML = v.kind === "file"
            ? '<video src="' + esc(v.src) + '" controls playsinline preload="metadata"></video>'
            : '<iframe src="' + esc(v.src.replace("autoplay=1", "autoplay=0")) + '" title="Embedded video" loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>';
        });

        // Previous / next
        var i = posts.map(function (p) { return p.slug; }).indexOf(slug);
        if (i !== -1 && posts.length > 1) {
          var newer = posts[i - 1], older = posts[i + 1], navHTML = "";
          if (older) navHTML += '<a class="post-nav-link" href="?slug=' + encodeURIComponent(older.slug) + '"><span>← Previous</span>' + esc(older.title) + "</a>";
          if (newer) navHTML += '<a class="post-nav-link post-nav-next" href="?slug=' + encodeURIComponent(newer.slug) + '"><span>Next →</span>' + esc(newer.title) + "</a>";
          $("#post-nav").innerHTML = navHTML;
          $("#post-footer").hidden = !navHTML;
        }
      }).catch(notFound);
    }
  };

  if (pages[PAGE]) pages[PAGE]();
})();
