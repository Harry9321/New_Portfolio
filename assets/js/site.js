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
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/></svg>'
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
  function projectKind(p) {
    return /^(work|professional|company)$/i.test(p.type || "") ? "Work" : "Personal";
  }

  function projectCard(p) {
    var links = p.links || {};
    var video = parseVideo(links.video);
    var title = esc(p.title);
    var kind = projectKind(p);

    // Media: your image → YouTube thumbnail → typographic cover
    var mediaInner;
    if (p.image) {
      mediaInner = '<img src="' + esc(resolve(p.image)) + '" alt="" loading="lazy" decoding="async" />';
    } else if (video && video.thumb) {
      mediaInner = '<img src="' + esc(video.thumb) + '" alt="" loading="lazy" decoding="async" />';
    } else {
      mediaInner =
        '<div class="cover" aria-hidden="true">' +
          '<span class="cover-cat">' + esc(p.category || "") + "</span>" +
          (p.kpi ? '<span class="cover-kpi">' + esc(p.kpi.value) + "</span><span class=\"cover-label\">" + esc(p.kpi.label) + "</span>" : "") +
        "</div>";
    }
    var badge = '<span class="media-badge media-badge-' + kind.toLowerCase() + '">' +
      (kind === "Work" ? ICON.briefcase + " Work" : ICON.spark + " Personal") + "</span>";

    var media = video
      ? '<button class="card-media is-playable" type="button" data-video="' + esc(links.video) + '" data-title="' + title + '" aria-label="Play demo video: ' + title + '">' +
          mediaInner + badge + '<span class="play" aria-hidden="true">' + ICON.play + "</span></button>"
      : '<div class="card-media">' + mediaInner + badge + "</div>";

    // Footer: Live link + Demo video are always shown; unavailable ones are greyed out.
    var why = kind === "Work" ? "Private" : "Soon";
    var whyTitle = kind === "Work" ? "Internal company system: not publicly available" : "Coming soon";
    var live = links.demo
      ? '<a class="action action-primary" href="' + esc(resolve(links.demo)) + '" target="_blank" rel="noopener">' + ICON.globe + " Live link " + ICON.ext + "</a>"
      : '<span class="action is-disabled" title="' + whyTitle + '" aria-disabled="true">' + ICON.globe + " Live link <em>" + why + "</em></span>";
    var vid = video
      ? '<button class="action" type="button" data-video="' + esc(links.video) + '" data-title="' + title + '">' + ICON.play + " Demo video</button>"
      : '<span class="action is-disabled" title="' + whyTitle + '" aria-disabled="true">' + ICON.play + " Demo video <em>" + why + "</em></span>";
    var src = links.source
      ? '<a class="action action-icon" href="' + esc(resolve(links.source)) + '" target="_blank" rel="noopener" aria-label="Source code" title="Source code">' + ICON.code + "</a>"
      : "";

    var highlights = (p.highlights || []).length
      ? '<details class="card-details"><summary>What I did</summary><ul class="bullets">' +
          p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></details>"
      : "";

    var tags = (p.tags || []).length
      ? '<ul class="tags tags-sm">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"
      : "";

    var meta = [kind === "Work" ? (p.org || "Work") : "Solo project", p.year].filter(Boolean).map(esc).join(" · ");

    return '<article class="card card-' + kind.toLowerCase() + ' reveal" id="' + esc(p.id) + '">' + media +
      '<div class="card-body">' +
        '<p class="card-meta">' + meta + "</p>" +
        "<h3>" + title + "</h3>" +
        '<p class="card-summary">' + esc(p.summary) + "</p>" +
        highlights + tags +
      "</div>" +
      '<div class="card-foot">' + live + vid + src + "</div>" +
      "</article>";
  }

  function renderProjects(el, list) {
    el.innerHTML = list.length
      ? list.map(projectCard).join("")
      : '<p class="empty">No projects here yet.</p>';
    reveal(el);
  }

  // Placeholder card for an empty group, shaped like a real card.
  function placeholderCard(kind) {
    var work = kind === "Work";
    return '<article class="card card-placeholder reveal">' +
      '<div class="card-media"><div class="cover cover-empty" aria-hidden="true">' + (work ? ICON.briefcase : ICON.spark) + "</div></div>" +
      '<div class="card-body"><p class="card-meta">' + (work ? "Work" : "Solo project") + "</p>" +
      "<h3>" + (work ? "More work projects soon" : "Solo projects are on the way") + "</h3>" +
      '<p class="card-summary">' + (work
        ? "New systems from work will be added here."
        : "Side projects with live links and demo videos are being built. Check back soon.") + "</p></div>" +
      '<div class="card-foot"><span class="action is-disabled">' + ICON.globe + ' Live link <em>Soon</em></span><span class="action is-disabled">' + ICON.play + " Demo video <em>Soon</em></span></div>" +
      "</article>";
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
   * Contact icons: gentle magnetic pull toward the pointer
   * ------------------------------------------------------------------ */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    $$(".social").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
        el.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * 0.25 - 4).toFixed(1) + "px");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Contact card: live Mumbai time + a (probably accurate) status
   * ------------------------------------------------------------------ */
  var mumbaiTime = $("#mumbai-time"), mumbaiStatus = $("#mumbai-status");
  if (mumbaiTime) {
    var tf = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    var hf = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false });
    var tick = function () {
      var now = new Date();
      mumbaiTime.textContent = tf.format(now).toUpperCase() + " IST";
      var h = parseInt(hf.format(now), 10) % 24;
      mumbaiStatus.textContent =
        h >= 2 && h < 7   ? "Asleep. Probably. 😴" :
        h >= 7 && h < 10  ? "Sipping cutting chai ☕" :
        h >= 10 && h < 19 ? "Shipping code 🚀" :
        h >= 19 && h < 23 ? "Debugging something 🐛" :
                            "Still debugging 🌙";
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ------------------------------------------------------------------ *
   * Cursor trail: fire sparks that leave long, thin, curving threads
   * Desktop only (fine pointer); off when reduced motion is requested.
   * ------------------------------------------------------------------ */
  (function cursorSparks() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    var canvas = doc.createElement("canvas");
    canvas.className = "cursor-trail";
    canvas.setAttribute("aria-hidden", "true");
    body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Warm fire palette: brighter on dark backgrounds, deeper on light ones.
    var PALETTE = {
      dark:  ["#fff1c1", "#ffd27a", "#ffab40", "#ff7a2f"],
      light: ["#f59e0b", "#f97316", "#ea580c", "#d97706"]
    };
    var MAX = 80;        // sparks alive at once
    var TAIL = 26;       // points kept per thread
    var sparks = [];
    var last = null, running = false, prevT = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawn(x, y, dir, speed) {
      if (sparks.length >= MAX) sparks.shift();
      // Mostly thrown backwards and sideways from the direction of travel, like sparks off a grinder.
      var a = dir + Math.PI + rand(-1.2, 1.2);
      var v = rand(1.6, 4.2) + Math.min(speed, 40) * 0.04;
      sparks.push({
        x: x, y: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - rand(0.2, 1.2),
        curl: rand(-0.035, 0.035),        // gentle sideways bend so threads curve
        life: 0, max: rand(700, 1400),
        c: (Math.random() * 4) | 0,
        tw: rand(0, 6.28),                 // twinkle phase
        path: [x, y]
      });
    }

    doc.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (last) {
        var dx = e.clientX - last.x, dy = e.clientY - last.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
          var n = Math.min(4, 1 + Math.floor(dist / 10));
          for (var i = 0; i < n; i++) spawn(e.clientX, e.clientY, Math.atan2(dy, dx), dist);
          last = { x: e.clientX, y: e.clientY };
        }
      } else {
        last = { x: e.clientX, y: e.clientY };
      }
      if (!running) { running = true; prevT = performance.now(); requestAnimationFrame(frame); }
    }, { passive: true });

    doc.addEventListener("pointerleave", function () { last = null; });

    function frame(now) {
      var dt = Math.min(40, now - prevT) / 16.67;
      prevT = now;
      var dark = currentTheme() === "dark";
      var pal = dark ? PALETTE.dark : PALETTE.light;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (var i = sparks.length - 1; i >= 0; i--) {
        var p = sparks[i];
        p.life += dt * 16.67;
        if (p.life >= p.max) { sparks.splice(i, 1); continue; }

        // Physics: drag, a little gravity, and a sideways curl for a curvy thread.
        var drag = Math.pow(0.965, dt);
        p.vx *= drag; p.vy = p.vy * drag + 0.07 * dt;
        var cvx = -p.vy * p.curl, cvy = p.vx * p.curl;
        p.vx += cvx * dt; p.vy += cvy * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.path.push(p.x, p.y);
        if (p.path.length > TAIL * 2) p.path.splice(0, 2);

        var t = p.life / p.max;
        var fade = t < 0.08 ? t / 0.08 : 1 - (t - 0.08) / 0.92;
        var n = p.path.length;
        if (n < 6) continue;
        var col = pal[p.c];

        // Thread: tapered, fading from the tail to the glowing head.
        var g = ctx.createLinearGradient(p.path[0], p.path[1], p.x, p.y);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, col);
        ctx.globalAlpha = fade * (dark ? 0.9 : 1);
        ctx.strokeStyle = g;
        ctx.lineWidth = dark ? 1.2 : 1.45;
        ctx.beginPath();
        ctx.moveTo(p.path[0], p.path[1]);
        for (var k = 2; k < n - 2; k += 2) {
          ctx.quadraticCurveTo(p.path[k], p.path[k + 1], (p.path[k] + p.path[k + 2]) / 2, (p.path[k + 1] + p.path[k + 3]) / 2);
        }
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Sparkling head: a hot core with a soft, flickering glow.
        p.tw += 0.6 * dt;
        var flicker = 0.65 + 0.35 * Math.sin(p.tw);
        ctx.fillStyle = col;
        ctx.globalAlpha = fade * (dark ? 0.28 : 0.35) * flicker;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.6 * flicker + 1, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = fade;
        ctx.fillStyle = dark ? "#fffaf0" : col;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.3, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (sparks.length) requestAnimationFrame(frame);
      else running = false;
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
      var wrap = $("#all-projects");
      var GROUPS = {
        Work: { title: "Work projects", sub: "Production systems I built at Multi Commodity Exchange, India's largest commodity exchange.", icon: ICON.briefcase },
        Personal: { title: "Personal & solo projects", sub: "Things I design, build and ship on my own, with live links and demo videos.", icon: ICON.spark }
      };

      getData("PROJECTS").then(function (projects) {
        var byKind = { Work: [], Personal: [] };
        projects.forEach(function (p) { byKind[projectKind(p)].push(p); });

        $$("[data-count]").forEach(function (el) {
          var k = el.dataset.count;
          el.textContent = k === "all" ? projects.length : byKind[k].length;
        });

        function group(kind) {
          var g = GROUPS[kind], list = byKind[kind];
          return '<section class="proj-group proj-group-' + kind.toLowerCase() + '" aria-labelledby="g-' + kind + '">' +
            '<header class="group-head reveal"><span class="group-icon">' + g.icon + "</span>" +
            '<div><h2 id="g-' + kind + '">' + g.title + "</h2><p>" + g.sub + "</p></div>" +
            '<span class="group-count">' + list.length + "</span></header>" +
            '<div class="project-grid">' + (list.length ? list.map(projectCard).join("") : placeholderCard(kind)) + "</div></section>";
        }

        function show(view) {
          wrap.innerHTML = view === "all" ? group("Work") + group("Personal") : group(view);
          reveal(wrap);
        }

        // Segmented control with sliding indicator
        var seg = $("#project-tabs"), pill = $(".seg-pill", seg);
        function move(btn) {
          pill.style.width = btn.offsetWidth + "px";
          pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
        }
        var tabs = $$(".seg-btn", seg);
        seg.addEventListener("click", function (e) {
          var btn = e.target.closest(".seg-btn");
          if (!btn) return;
          tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t === btn)); });
          move(btn);
          show(btn.dataset.view);
        });
        window.addEventListener("resize", function () { move($('.seg-btn[aria-selected="true"]', seg)); });
        requestAnimationFrame(function () { move(tabs[0]); seg.classList.add("is-ready"); });

        show("all");
        if (location.hash) { var t = $(location.hash); if (t) t.scrollIntoView(); }
      }).catch(function () { loadError(wrap, "projects"); });
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
