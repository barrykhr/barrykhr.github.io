import { section, headline, lede, esc } from '../components/ui.js';
import { journey } from '../content.js';

/**
 * CANDIDATE JOURNEY — one unbroken line.
 * A single stroke is drawn from the first conversation to day one, lighting
 * each touchpoint as it passes. The line never breaks: that is the claim.
 */
export const journeySection = () =>
  section({
    id: journey.id,
    chapter: journey.chapter,
    tone: 'night',
    className: 'journey',
    extra: { 'data-scrub': 'journey' },
    body: `
      <div class="journey__head">
        ${headline(journey.headline, { size: 'lg' })}
        ${lede(journey.lede)}
      </div>

      <div class="journey__line" data-journey>
        <span class="journey__stroke" aria-hidden="true"><i data-journey-stroke></i></span>
        <ol class="journey__steps">
          ${journey.steps
            .map(
              (s, i) => `
            <li class="journey__step" data-journey-step style="--i:${i}">
              <span class="journey__dot" aria-hidden="true"></span>
              <span class="journey__label">${esc(s)}</span>
            </li>`
            )
            .join('')}
        </ol>
      </div>`,
  });
