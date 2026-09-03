/** Numbers count once on entry, then stop. No looping. */
(function () {
  'use strict';
  var KV = window.KV;

  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  KV.initCounters = function () {
    var nodes = [].slice.call(document.querySelectorAll('[data-count]'));
    if (!nodes.length) return;

    if (KV.reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          run(e.target);
        });
      },
      { threshold: 0.5 }
    );
    nodes.forEach(function (n) { io.observe(n); });

    function run(node) {
      var target = parseFloat(node.getAttribute('data-count')) || 0;
      var duration = 1150;
      var start = 0;
      function step(now) {
        if (!start) start = now;
        var t = KV.clamp((now - start) / duration, 0, 1);
        node.textContent = String(Math.round(easeOut(t) * target));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  };

  /** Client field: 25 marks, 15 of them repeat clients. */
  KV.initClientField = function () {
    var field = document.querySelector('[data-clients-field]');
    if (!field) return;
    if (KV.reduced || !('IntersectionObserver' in window)) { field.classList.add('is-in'); return; }
    var io = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        field.classList.add('is-in');
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(field);
  };
})();
