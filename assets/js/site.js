/* ==========================================================================
   Hariom Sahu — Portfolio
   One dependency-free script for every page. Each page sets
   <body data-page="home|projects|blog|post" data-root="../">.
   Content lives in data/projects.js and data/posts.js.
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

  // Data comes from data/projects.js and data/posts.js (window.PROJECTS / window.POSTS),
  // so the site also works when index.html is opened straight from disk.
  function getData(name) {
    return Array.isArray(window[name])
      ? Promise.resolve(window[name])
      : Promise.reject(new Error("data/" + name.toLowerCase() + ".js is missing or has a syntax error"));
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
    el.innerHTML = '<p class="empty">Couldn\'t load ' + what + ". Check data/" + what + ".js for a missing comma or quote.</p>";
    if (window.console) console.error("[site] could not load " + what);
  }

  /* ------------------------------------------------------------------ *
   * Hero name: split into letters so each one can hop on hover
   * ------------------------------------------------------------------ */
  var heroName = $("#hero-name");
  if (heroName) {
    var text = heroName.textContent;
    heroName.setAttribute("aria-label", text);
    heroName.innerHTML = text.split("").map(function (c, i) {
      return '<span class="ch' + (c === " " ? " sp" : "") + '" style="--i:' + i + '" aria-hidden="true">' + (c === " " ? "&nbsp;" : esc(c)) + "</span>";
    }).join("");
    // Tap on touch screens plays the same animation once.
    heroName.addEventListener("click", function () {
      heroName.classList.remove("is-playing");
      void heroName.offsetWidth;
      heroName.classList.add("is-playing");
      setTimeout(function () { heroName.classList.remove("is-playing"); }, 1400);
    });
  }

  /* ------------------------------------------------------------------ *
   * Typewriter: types a paragraph out once it scrolls into view.
   * Untyped text stays in place (transparent) so nothing jumps.
   * ------------------------------------------------------------------ */
  $$(".typewriter").forEach(function (el) {
    var full = el.textContent.replace(/\s+/g, " ").trim();
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    el.setAttribute("aria-label", full);
    el.innerHTML = '<span class="tw-typed" aria-hidden="true"></span><span class="tw-caret" aria-hidden="true"></span><span class="tw-rest" aria-hidden="true">' + esc(full) + "</span>";
    var typed = $(".tw-typed", el), rest = $(".tw-rest", el);

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var i = 0;
      (function step() {
        // Type 1–3 characters per tick with a short pause after punctuation.
        i = Math.min(full.length, i + 1 + (Math.random() < 0.35 ? 1 : 0));
        typed.textContent = full.slice(0, i);
        rest.textContent = full.slice(i);
        if (i >= full.length) { el.classList.add("is-done"); return; }
        var ch = full.charAt(i - 1);
        setTimeout(step, /[.,:;]/.test(ch) ? 180 : 16 + Math.random() * 22);
      })();
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ------------------------------------------------------------------ *
   * Toolbox: soft brand-coloured spotlight follows the pointer
   * ------------------------------------------------------------------ */
  var toolbox = $("#toolbox");
  if (toolbox && !reduceMotion) {
    toolbox.addEventListener("pointermove", function (e) {
      var tile = e.target.closest(".tool");
      if (!tile) return;
      var r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", (e.clientX - r.left) + "px");
      tile.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  /* ------------------------------------------------------------------ *
   * Cursor trail: a light, curvy arrow that follows the mouse
   * Desktop only (fine pointer); off when reduced motion is requested.
   * ------------------------------------------------------------------ */
  (function cursorTrail() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    var canvas = doc.createElement("canvas");
    canvas.className = "cursor-trail";
    canvas.setAttribute("aria-hidden", "true");
    body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = 1, W = 0, H = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    var LIFE = 420;          // ms a point stays in the tail
    var pts = [];            // {x, y, t}
    var running = false;
    var color = "#166a55";
    var lastColorRead = 0;

    function readColor(now) {
      if (now - lastColorRead < 500) return;
      lastColorRead = now;
      color = getComputedStyle(root).getPropertyValue("--accent").trim() || color;
    }

    doc.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var now = performance.now();
      var last = pts[pts.length - 1];
      if (!last || Math.abs(last.x - e.clientX) + Math.abs(last.y - e.clientY) > 2) {
        pts.push({ x: e.clientX, y: e.clientY, t: now });
      }
      if (!running) { running = true; requestAnimationFrame(draw); }
    }, { passive: true });

    doc.addEventListener("pointerleave", function () { pts.length = 0; });

    function draw(now) {
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, W, H);

      if (pts.length < 3) {
        if (!pts.length) { running = false; return; }
        requestAnimationFrame(draw);
        return;
      }

      readColor(now);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Smooth curve through midpoints; tail fades in and thickens toward the head.
      var n = pts.length;
      for (var i = 1; i < n - 1; i++) {
        var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
        var k = i / (n - 1);
        var age = 1 - (now - p1.t) / LIFE;
        ctx.globalAlpha = Math.max(0, 0.55 * k * age);
        ctx.lineWidth = 0.6 + 1.9 * k;
        ctx.beginPath();
        ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        ctx.stroke();
      }

      // Arrowhead at the newest point, pointing along the direction of travel.
      var head = pts[n - 1], ref = pts[Math.max(0, n - 4)];
      var dx = head.x - ref.x, dy = head.y - ref.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var fresh = 1 - (now - head.t) / LIFE;
      if (dist > 4 && fresh > 0) {
        var a = Math.atan2(dy, dx), size = 9, spread = 0.5;
        ctx.globalAlpha = 0.7 * fresh;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(head.x - size * Math.cos(a - spread), head.y - size * Math.sin(a - spread));
        ctx.lineTo(head.x, head.y);
        ctx.lineTo(head.x - size * Math.cos(a + spread), head.y - size * Math.sin(a + spread));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
  })();

  /* ------------------------------------------------------------------ *
   * Pages
   * ------------------------------------------------------------------ */
  var pages = {
    home: function () {
      var featuredEl = $("#featured-projects");
      getData("PROJECTS").then(function (projects) {
        var featured = projects.filter(function (p) { return p.featured; });
        renderProjects(featuredEl, (featured.length ? featured : projects).slice(0, 4));
      }).catch(function () { loadError(featuredEl, "projects"); });

      getData("POSTS").then(function (posts) {
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
      getData("PROJECTS").then(function (projects) {
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
      getData("POSTS").then(function (raw) {
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
        if (location.protocol === "file:") {
          titleEl.textContent = "Open this post through a local server";
          bodyEl.innerHTML = "<p>Browsers block reading Markdown files from disk. In the project folder run <code>python3 -m http.server 8000</code> and open <code>http://localhost:8000</code>.</p>";
          return;
        }
        doc.title = "Post not found — Hariom Sahu";
        titleEl.textContent = "Post not found";
        bodyEl.innerHTML = '<p>This post doesn\'t exist or has moved. <a href="index.html">See all posts</a>.</p>';
      }
      if (!/^[\w-]+$/.test(slug)) { notFound(); return; }

      Promise.all([
        getData("POSTS"),
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
