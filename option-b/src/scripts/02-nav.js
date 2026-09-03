/** Nav: hides on the way down, inverts over dark sections, tracks position. */
(function () {
  'use strict';
  var KV = window.KV;

  KV.initNav = function () {
    var nav = document.querySelector('[data-nav]');
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-drawer]');
    var rail = document.querySelector('[data-rail]');
    if (!nav) return;

    var lastY = window.scrollY;
    var navH = nav.offsetHeight;
    var darkSections = [];
    var linkMap = [];

    KV.onResize(function () {
      navH = nav.offsetHeight;
      darkSections = [].slice.call(
        document.querySelectorAll('.section--night, .model, .cta, .foot')
      );
      linkMap = [].slice.call(document.querySelectorAll('[data-nav-link]')).map(function (a) {
        return { link: a, target: document.querySelector(a.getAttribute('href')) };
      });
      positionRailTicks();
    });

    function positionRailTicks() {
      if (!rail) return;
      var docH = document.documentElement.scrollHeight;
      rail.querySelectorAll('[data-rail-tick]').forEach(function (li) {
        var target = document.getElementById(li.getAttribute('data-rail-tick'));
        if (!target) { li.style.display = 'none'; return; }
        var top = target.getBoundingClientRect().top + window.scrollY;
        li.style.setProperty('--tick-p', (top / docH).toFixed(4));
      });
    }

    KV.onFrame(function () {
      var y = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docH > 0 ? KV.clamp(y / docH, 0, 1) : 0;

      nav.style.setProperty('--scroll-p', progress.toFixed(4));
      if (rail) rail.style.setProperty('--rail-p', progress.toFixed(4));

      nav.classList.toggle('is-stuck', y > 8);

      var open = drawer && !drawer.hidden;
      nav.classList.toggle('is-hidden', !open && y > 240 && y > lastY + 4);
      if (Math.abs(y - lastY) > 3) lastY = y;

      // invert whenever the nav sits over a dark surface
      var probe = navH * 0.5;
      var inverse = darkSections.some(function (s) {
        var r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom > probe;
      });
      nav.classList.toggle('is-inverse', inverse);
      if (rail) rail.classList.toggle('is-inverse', inverse);

      // current chapter
      var currentId = null;
      linkMap.forEach(function (m) {
        if (!m.target) return;
        var r = m.target.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45) {
          currentId = m.link;
        }
      });
      linkMap.forEach(function (m) { m.link.classList.toggle('is-current', m.link === currentId); });

      if (rail) {
        var vhMid = window.innerHeight * 0.45;
        rail.querySelectorAll('[data-rail-tick]').forEach(function (li) {
          var t = document.getElementById(li.getAttribute('data-rail-tick'));
          if (!t) return;
          var r = t.getBoundingClientRect();
          li.classList.toggle('is-active', r.top <= vhMid && r.bottom > vhMid);
        });
      }
    });

    /* ---------- drawer ---------- */
    if (toggle && drawer) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        drawer.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          nav.classList.remove('is-hidden');
          var first = drawer.querySelector('a');
          if (first) first.focus({ preventScroll: true });
        }
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      drawer.querySelectorAll('[data-drawer-link]').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !drawer.hidden) { setOpen(false); toggle.focus(); }
      });
    }
  };
})();
