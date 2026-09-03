import { esc } from '../components/ui.js';
import { nav, site, chapters } from '../content.js';

const wordmark = `
<a class="wordmark" href="#top" aria-label="${esc(site.shortName)} — home">
  <span class="wordmark__mark" aria-hidden="true"><i></i><i></i><i></i></span>
  <span class="wordmark__text">KiVitronics</span>
</a>`;

export const navbar = () => `
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <div class="nav__progress" aria-hidden="true"><span data-nav-progress></span></div>
  <div class="nav__inner">
    ${wordmark}
    <nav class="nav__links" aria-label="Primary">
      <ul>
        ${nav.links
          .map((l) => `<li><a href="${esc(l.href)}" data-nav-link>${esc(l.label)}</a></li>`)
          .join('')}
      </ul>
    </nav>
    <div class="nav__end">
      <a class="nav__cta" href="${esc(nav.cta.href)}">${esc(nav.cta.label)}</a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-drawer" data-nav-toggle>
        <span class="nav__toggle-label">Menu</span>
        <span class="nav__toggle-bars" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
</header>
<div class="drawer" id="nav-drawer" hidden data-drawer>
  <nav class="drawer__inner" aria-label="Mobile">
    <ul>
      ${nav.links
        .map(
          (l, i) =>
            `<li style="--i:${i}"><a href="${esc(l.href)}" data-drawer-link><span>${esc(l.label)}</span><em aria-hidden="true">0${i + 1}</em></a></li>`
        )
        .join('')}
    </ul>
    <a class="drawer__cta" href="${esc(nav.cta.href)}" data-drawer-link>${esc(nav.cta.label)}</a>
  </nav>
</div>`;

/** The fixed spine on the left edge: one continuous track for the whole page. */
export const rail = () => `
<div class="rail" aria-hidden="true" data-rail>
  <span class="rail__line"></span>
  <span class="rail__travel" data-rail-travel></span>
  <ul class="rail__ticks">
    ${chapters.map((c) => `<li data-rail-tick="${esc(c.id)}"><span></span><em>${esc(c.label)}</em></li>`).join('')}
  </ul>
</div>`;
