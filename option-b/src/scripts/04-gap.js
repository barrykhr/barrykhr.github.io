/**
 * THE GAP — leakage.
 * Units travel the track and leave it at the stage where hiring typically
 * loses them. The distribution is illustrative: it is deliberately NOT one of
 * the KiVitronics metrics, and nothing in this section is labelled as one.
 */
(function () {
  'use strict';
  var KV = window.KV;

  // stop position along the track (0–1); 1 means the unit reaches day one
  var EXITS = [0.29, 0.29, 0.29, 0.55, 0.55, 0.55, 0.8, 0.8, 1, 1, 1, 1];
  var LANES = [-21, -7, 7, 21];

  KV.initGap = function () {
    var section = document.querySelector('[data-scrub="gap"]');
    var figure = document.querySelector('[data-gap]');
    if (!section || !figure) return;
    KV.claimed.gap = true;

    var units = [].slice.call(figure.querySelectorAll('[data-gap-unit]'));
    var stages = [].slice.call(figure.querySelectorAll('[data-gap-stage]'));
    var track = figure.querySelector('.gap__track');

    units.forEach(function (u, i) {
      var stop = EXITS[i % EXITS.length];
      u.style.setProperty('--stop', String(stop));
      u.style.setProperty('--lane', LANES[i % LANES.length] + 'px');
      if (stop >= 1) u.classList.add('is-survivor');
    });

    KV.onResize(function () {
      var w = (track ? track.clientWidth : figure.clientWidth) - 12;
      units.forEach(function (u) { u.style.setProperty('--span', Math.max(w, 80) + 'px'); });
    });

    KV.registerScrub(section, 'enter', function (p) {
      KV.activate(stages, p, stages.length, 0.2);
    });
  };
})();
