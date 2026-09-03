import { esc, button } from '../components/ui.js';
import { hero } from '../content.js';

/**
 * HERO — "Talent → Match".
 * Talent tiles are scattered across the field and drift. As the hero scrolls,
 * they converge into a single stack against an open mandate: the whole
 * proposition, stated as movement rather than as a sentence.
 */
export const heroSection = () => `
<section class="hero" id="top" data-chapter="Start" data-scrub="hero">
  <div class="hero__grid">
    <div class="hero__copy">
      <p class="eyebrow hero__eyebrow">${esc(hero.eyebrow)}</p>
      <h1 class="hero__headline">
        ${hero.headline
          .map(
            (line, i) =>
              `<span class="hero__line" style="--i:${i}"><span class="hero__line-in">${esc(line)}</span></span>`
          )
          .join('')}
      </h1>
      <p class="hero__lede">${esc(hero.lede)}</p>
      <div class="hero__actions">
        ${button({ ...hero.primary, variant: 'primary' })}
        ${button({ ...hero.secondary, variant: 'ghost' })}
      </div>
    </div>

    <div class="hero__field" data-hero-field>
      <div class="hero__slot" data-hero-slot>
        <span class="hero__slot-frame" aria-hidden="true"></span>
        <span class="hero__slot-role">${esc(hero.slot.role)}</span>
        <span class="hero__slot-meta">
          <span class="hero__slot-state" data-state="idle">${esc(hero.slot.idle)}</span>
          <span class="hero__slot-state" data-state="matched">${esc(hero.slot.matched)}</span>
        </span>
      </div>
      <div class="hero__tiles" data-hero-tiles>
        ${hero.tiles
          .map(
            (label, i) =>
              `<span class="tile" data-hero-tile style="--i:${i}"><span class="tile__in">${esc(label)}</span></span>`
          )
          .join('')}
      </div>
    </div>
  </div>

  <p class="hero__hint" aria-hidden="true"><span class="hero__hint-line"></span>${esc(hero.scrollHint)}</p>
</section>`;
