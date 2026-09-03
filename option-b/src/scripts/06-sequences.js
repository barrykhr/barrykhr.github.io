/** Qualification, candidate journey and the closing track. */
(function () {
  'use strict';
  var KV = window.KV;

  KV.initSequences = function () {
    /* ---------- qualification: five assays in sequence ---------- */
    var qual = document.querySelector('[data-scrub="qual"]');
    if (qual) {
      KV.claimed.qual = true;
      var rows = [].slice.call(qual.querySelectorAll('[data-qual-row]'));
      var profile = qual.querySelector('[data-qual-profile]');
      KV.onResize(function () {
        rows.forEach(function (row) {
          var rail = row.querySelector('.qual__assay');
          if (rail) row.style.setProperty('--assay-w', Math.max(rail.clientWidth - 7, 0) + 'px');
        });
      });
      KV.registerScrub(qual, 'enter', function (p) {
        KV.activate(rows, p, rows.length, 0.9);
        if (profile) profile.classList.toggle('is-complete', p > 0.86);
      });
    }

    /* ---------- candidate journey: one unbroken line ---------- */
    var journey = document.querySelector('[data-scrub="journey"]');
    if (journey) {
      KV.claimed.journey = true;
      var steps = [].slice.call(journey.querySelectorAll('[data-journey-step]'));
      KV.registerScrub(journey, 'enter', function (p) {
        KV.activate(steps, p, steps.length, 0.9);
      });
    }

    /* ---------- closing track: the unit arrives ---------- */
    var cta = document.querySelector('[data-scrub="cta"]');
    if (cta) {
      KV.claimed.cta = true;
      var terminal = cta.querySelector('[data-cta-terminal]');
      var tile = cta.querySelector('[data-cta-tile]');
      var node = terminal && terminal.querySelector('.cta__node');
      KV.onResize(function () {
        if (!terminal || !node) return;
        var span = terminal.clientWidth - node.offsetWidth - 16;
        terminal.style.setProperty('--span', Math.max(span, 40) + 'px');
      });
      KV.registerScrub(cta, 'enter', function (p) {
        var joined = p > 0.9;
        if (tile) tile.classList.toggle('is-joined', joined);
        if (terminal) terminal.classList.toggle('is-joined', joined);
      });
    }
  };
})();
