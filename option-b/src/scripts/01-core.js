/**
 * Motion core.
 *
 * One rAF loop, one read pass, one write pass. Sections register a "scrub"
 * and receive a 0→1 progress value as the CSS custom property `--p`; every
 * animation on the page is expressed against that single variable, so motion
 * stays cheap and consistent.
 */
(function () {
  'use strict';

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  var KV = (window.KV = {
    reduced: reduceQuery.matches,
    scrubs: [],
    /** Scrub names claimed by a module, so autoScrub doesn't double-register. */
    claimed: {},
    frameTasks: [],
    resizeTasks: [],
    clamp: function (v, min, max) {
      return v < min ? min : v > max ? max : v;
    },
    /** Deterministic pseudo-random so layouts never jump between loads. */
    rand: function (seed) {
      var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    },
  });

  /* ---------- progress modes ---------- */

  var modes = {
    /* Enters from the bottom, completes as it clears the upper third. */
    enter: function (rect, vh) {
      var start = vh * 0.9;
      var span = vh * 0.5 + rect.height;
      return (start - rect.top) / span;
    },
    /* Completes within the first screen of scrolling. */
    hero: function (rect, vh) {
      return -rect.top / (vh * 0.34);
    },
    /* Runs for the length of a pinned container. */
    pin: function (rect, vh) {
      var travel = rect.height - vh;
      return travel <= 0 ? 1 : -rect.top / travel;
    },
  };

  var MODE_BY_NAME = {
    hero: 'hero',
    proof: 'enter',
    gap: 'enter',
    qual: 'enter',
    journey: 'enter',
    clients: 'enter',
    intel: 'enter',
    cta: 'enter',
  };

  /**
   * Register an element for scroll-scrubbed progress.
   * @param {Element} el
   * @param {string} mode  key of `modes`
   * @param {Function} [onUpdate] called with (p, el) after `--p` is written
   */
  KV.registerScrub = function (el, mode, onUpdate) {
    if (!el) return;
    var entry = { el: el, mode: modes[mode] || modes.enter, onUpdate: onUpdate, p: -1, visible: false };
    KV.scrubs.push(entry);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        function (entries) {
          entry.visible = entries[0].isIntersecting;
          if (entry.visible) schedule();
        },
        { rootMargin: '120px 0px' }
      ).observe(el);
    } else {
      entry.visible = true;
    }

    if (KV.reduced) {
      el.style.setProperty('--p', '1');
      if (onUpdate) onUpdate(1, el);
    }
    return entry;
  };

  KV.onFrame = function (fn) { KV.frameTasks.push(fn); };
  KV.onResize = function (fn) { KV.resizeTasks.push(fn); fn(); };

  /* ---------- the loop ---------- */

  var queued = false;

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(tick);
  }

  function tick() {
    queued = false;
    if (KV.reduced) return;

    var vh = window.innerHeight;
    var i, entry, p;

    for (i = 0; i < KV.scrubs.length; i++) {
      entry = KV.scrubs[i];
      if (!entry.visible) continue;
      p = KV.clamp(entry.mode(entry.el.getBoundingClientRect(), vh), 0, 1);
      if (Math.abs(p - entry.p) < 0.0009) continue;
      entry.p = p;
      entry.el.style.setProperty('--p', p.toFixed(4));
      if (entry.onUpdate) entry.onUpdate(p, entry.el);
    }

    for (i = 0; i < KV.frameTasks.length; i++) KV.frameTasks[i]();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', function () {
    for (var i = 0; i < KV.resizeTasks.length; i++) KV.resizeTasks[i]();
    for (var j = 0; j < KV.scrubs.length; j++) KV.scrubs[j].p = -1;
    schedule();
  });

  reduceQuery.addEventListener('change', function (e) {
    KV.reduced = e.matches;
    if (!KV.reduced) schedule();
  });

  /* ---------- reveal ---------- */

  KV.initReveal = function (root) {
    var nodes = (root || document).querySelectorAll('[data-reveal]');
    if (KV.reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    nodes.forEach(function (n) { io.observe(n); });
  };

  /** Turn a 0→1 progress into "the first N of these are active". */
  KV.activate = function (nodes, p, count, lead) {
    var reached = p * (count + (lead || 0.6));
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle('is-on', reached > i + 0.35);
    }
  };

  KV.autoScrub = function () {
    document.querySelectorAll('[data-scrub]').forEach(function (el) {
      var name = el.getAttribute('data-scrub');
      if (KV.claimed[name]) return;
      KV.registerScrub(el, MODE_BY_NAME[name] || 'enter');
    });
  };

  KV.MODE_BY_NAME = MODE_BY_NAME;
  KV.schedule = schedule;
})();
