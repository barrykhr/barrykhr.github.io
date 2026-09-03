/**
 * HERO — convergence.
 * Tiles scatter across the field, drift, then travel to a single stack against
 * the open mandate as the hero scrolls. Positions are computed from the field
 * box so the composition holds at any size.
 */
(function () {
  'use strict';
  var KV = window.KV;

  KV.initHero = function () {
    var hero = document.querySelector('[data-scrub="hero"]');
    var field = document.querySelector('[data-hero-field]');
    var slot = document.querySelector('[data-hero-slot]');
    if (!hero || !field || !slot) return;

    var tiles = [].slice.call(field.querySelectorAll('[data-hero-tile]'));
    var compact = window.matchMedia('(max-width: 899px)');
    KV.claimed.hero = true;

    function layout() {
      var fr = field.getBoundingClientRect();
      var sr = slot.getBoundingClientRect();
      if (!fr.width) return;

      // Must match the CSS breakpoint that moves the slot, or the two
      // layouts disagree about where the mandate is.
      var narrow = compact.matches;
      // Everything scatters to the left of the mandate; nothing overlaps it.
      var slotLeft = sr.left - fr.left;
      var zoneW = narrow ? fr.width : Math.max(slotLeft - 28, fr.width * 0.42);
      var zoneH = narrow ? Math.max(fr.height - sr.height - 26, 120) : fr.height;

      var targetX = narrow ? fr.width / 2 - 44 : Math.max(slotLeft - 56, 0);
      var targetY = narrow ? zoneH - 18 : fr.height / 2;

      tiles.forEach(function (tile, i) {
        var w = tile.offsetWidth || 76;
        var h = tile.offsetHeight || 26;
        var rx = KV.rand(i + 1);
        var ry = KV.rand(i + 41);

        // Each tile owns one cell and jitters inside it: never a visible grid,
        // never two labels on top of each other.
        var cols = 3;
        var rows = Math.ceil(tiles.length / cols);
        var col = i % cols;
        var row = Math.floor(i / cols);
        var cellW = zoneW / cols;
        var cellH = zoneH / rows;
        var x = col * cellW + rx * Math.max(cellW - w, 0);
        var y = row * cellH + ry * Math.max(cellH - h, 0);

        tile.style.setProperty('--sx', x.toFixed(1) + 'px');
        tile.style.setProperty('--sy', y.toFixed(1) + 'px');
        tile.style.setProperty('--dx', (targetX - x).toFixed(1) + 'px');
        tile.style.setProperty('--dy', (targetY + (i - tiles.length / 2) * 4.5 - y).toFixed(1) + 'px');
        tile.style.zIndex = String(tiles.length - i);
      });
    }

    KV.onResize(layout);
    compact.addEventListener('change', layout);
    // Fonts change tile widths; re-measure once they land.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    KV.registerScrub(hero, 'hero', function (p) {
      var matched = p > 0.82;
      slot.classList.toggle('is-filled', matched);
      tiles.forEach(function (tile, i) {
        tile.classList.toggle('is-matched', matched && i === 0);
        tile.classList.toggle('is-dim', matched && i !== 0);
      });
    });
  };
})();
