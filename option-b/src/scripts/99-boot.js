(function () {
  'use strict';
  var KV = window.KV;

  function boot() {
    KV.initHero();
    KV.initGap();
    KV.initModel();
    KV.initSequences();
    KV.autoScrub();
    KV.initNav();
    KV.initCounters();
    KV.initClientField();
    KV.initSolutions();
    KV.initFaq();
    KV.initForm();
    KV.initReveal();
    KV.schedule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
