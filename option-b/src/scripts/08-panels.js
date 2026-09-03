/** Solutions index and the FAQ tabs + accordion. */
(function () {
  'use strict';
  var KV = window.KV;

  /* Each solution lights a different configuration of the same 16 cells:
     one engine, five arrangements. */
  var FIELDS = [
    [0, 1, 4, 5, 8, 9, 10, 13],
    [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15],
    [5, 6, 9, 10],
    [0, 3, 5, 6, 9, 10, 12, 15],
    [0, 1, 2, 3, 12, 13, 14, 15],
  ];

  KV.initSolutions = function () {
    var list = document.querySelector('[data-sol]');
    if (!list) return;
    var triggers = [].slice.call(list.querySelectorAll('[data-sol-trigger]'));
    var panels = [].slice.call(list.querySelectorAll('[data-sol-panel]'));
    var cells = [].slice.call(document.querySelectorAll('[data-sol-field] .sol__cell'));

    function paint(index) {
      var lit = FIELDS[index % FIELDS.length];
      cells.forEach(function (cell, i) {
        cell.classList.toggle('is-lit', lit.indexOf(i) !== -1);
        cell.classList.toggle('is-half', lit.indexOf(i) === -1 && (i + index) % 3 === 0);
      });
    }

    function open(index) {
      triggers.forEach(function (t, i) { t.setAttribute('aria-expanded', String(i === index)); });
      panels.forEach(function (p, i) {
        if (i === index) p.setAttribute('data-open', '');
        else p.removeAttribute('data-open');
      });
      paint(index);
    }

    triggers.forEach(function (t, i) {
      t.addEventListener('click', function () {
        open(t.getAttribute('aria-expanded') === 'true' ? -1 : i);
      });
      // Hovering previews the configuration without changing the open row.
      t.addEventListener('mouseenter', function () { if (!KV.reduced) paint(i); });
    });
    list.addEventListener('mouseleave', function () {
      var current = triggers.findIndex(function (t) { return t.getAttribute('aria-expanded') === 'true'; });
      if (current > -1) paint(current);
    });

    open(0);
  };

  KV.initFaq = function () {
    var root = document.querySelector('[data-faq]');
    if (!root) return;

    var tabs = [].slice.call(root.querySelectorAll('[data-faq-tab]'));
    var panels = [].slice.call(root.querySelectorAll('[data-faq-panel]'));
    var mark = root.querySelector('[data-faq-mark]');

    function moveMark(tab) {
      if (!mark || !tab) return;
      mark.style.setProperty('--mark-w', tab.offsetWidth + 'px');
      mark.style.setProperty('--mark-x', tab.offsetLeft + 'px');
    }

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        t.setAttribute('aria-selected', String(i === index));
        t.tabIndex = i === index ? 0 : -1;
        if (i === index && focus) t.focus();
      });
      panels.forEach(function (p, i) { p.hidden = i !== index; });
      moveMark(tabs[index]);
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1
          : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (next === null) return;
        e.preventDefault();
        select((next + tabs.length) % tabs.length, true);
      });
    });

    // Accordion: one answer open at a time, per panel.
    root.querySelectorAll('[data-faq-q]').forEach(function (q) {
      q.addEventListener('click', function () {
        var isOpen = q.getAttribute('aria-expanded') === 'true';
        var panel = q.closest('[data-faq-panel]');
        panel.querySelectorAll('[data-faq-q]').forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          var a = document.getElementById(other.getAttribute('aria-controls'));
          if (a) a.removeAttribute('data-open');
        });
        if (!isOpen) {
          q.setAttribute('aria-expanded', 'true');
          var answer = document.getElementById(q.getAttribute('aria-controls'));
          if (answer) answer.setAttribute('data-open', '');
        }
      });
    });

    KV.onResize(function () {
      var active = tabs.find(function (t) { return t.getAttribute('aria-selected') === 'true'; });
      moveMark(active || tabs[0]);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moveMark(tabs[0]); });
    }
  };
})();
