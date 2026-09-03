/**
 * THE MODEL — nine stages.
 * Wide screens pin the section and pull the track sideways, so the page's
 * vertical scroll literally moves a unit through the journey. Narrow screens
 * get the same nine beats as a vertical track that lights up in sequence.
 */
(function () {
  'use strict';
  var KV = window.KV;

  KV.initModel = function () {
    var section = document.querySelector('[data-model]');
    if (!section) return;

    var track = section.querySelector('[data-model-track]');
    var viewport = section.querySelector('.model__viewport');
    var stages = [].slice.call(section.querySelectorAll('[data-model-stage]'));
    var counter = section.querySelector('[data-model-count]');
    var unit = section.querySelector('[data-model-unit]');
    var wide = window.matchMedia('(min-width: 900px)');

    KV.onResize(function () {
      if (!track || !viewport) return;
      var shift = wide.matches ? Math.max(track.scrollWidth - viewport.clientWidth, 0) : 0;
      section.style.setProperty('--shift', shift + 'px');
    });

    function update(p) {
      var current = 0;

      if (KV.reduced) {
        // Every stage reads at once; nothing is singled out as "now".
        stages.forEach(function (s) { s.classList.add('is-on'); s.classList.remove('is-current'); });
        if (counter) counter.textContent = ('0' + stages.length).slice(-2);
        return;
      }

      if (wide.matches && viewport) {
        // The stage sitting at the playhead is the one being worked, and
        // everything it has already passed stays lit behind it.
        var playX = viewport.getBoundingClientRect().left + 10;
        stages.forEach(function (stage, i) {
          var r = stage.getBoundingClientRect();
          var passed = r.left <= playX;
          stage.classList.toggle('is-on', passed);
          stage.classList.toggle('is-current', passed && r.right > playX);
          if (passed) current = i + 1;
        });
      } else {
        KV.activate(stages, p, stages.length, 0.6);
        current = stages.filter(function (s) { return s.classList.contains('is-on'); }).length;
        stages.forEach(function (s, i) { s.classList.toggle('is-current', i === current - 1); });
      }

      var index = KV.clamp(current || 1, 1, stages.length);
      if (counter) counter.textContent = ('0' + index).slice(-2);
      if (unit) unit.classList.toggle('is-joined', index === stages.length);
    }

    // The pinned container is the scrub on wide screens; the section itself
    // otherwise, so the same code drives both interpretations.
    KV.registerScrub(section, wide.matches ? 'pin' : 'enter', function (p) { update(p); });

    wide.addEventListener('change', function () {
      KV.scrubs.forEach(function (s) {
        if (s.el === section) s.mode = wide.matches ? modePin : modeEnter;
      });
      window.dispatchEvent(new Event('resize'));
    });

    // captured here so the media-query swap can reuse them
    var modePin = function (rect, vh) {
      var travel = rect.height - vh;
      return travel <= 0 ? 1 : -rect.top / travel;
    };
    var modeEnter = function (rect, vh) {
      return (vh * 0.9 - rect.top) / (vh * 0.5 + rect.height);
    };
  };
})();
