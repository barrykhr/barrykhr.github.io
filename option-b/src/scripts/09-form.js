/**
 * Contact form.
 * Validation is real. Submission is not faked: with no verified endpoint
 * configured, the form says so plainly rather than pretending to send.
 */
(function () {
  'use strict';
  var KV = window.KV;

  KV.initForm = function () {
    var form = document.querySelector('[data-form]');
    if (!form) return;
    var status = form.querySelector('[data-form-status]');
    var hasEndpoint = Boolean(form.getAttribute('action'));

    form.addEventListener('submit', function (e) {
      var invalid = null;
      [].slice.call(form.querySelectorAll('input, textarea')).forEach(function (field) {
        var ok = field.checkValidity();
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !invalid) invalid = field;
      });

      if (invalid) {
        e.preventDefault();
        invalid.focus();
        if (status) status.textContent = 'Check the highlighted fields.';
        return;
      }

      if (!hasEndpoint) {
        e.preventDefault();
        if (status) {
          status.textContent = 'Not wired up yet — add a verified endpoint before launch.';
        }
      }
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  };
})();
