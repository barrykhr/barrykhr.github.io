import { section, headline, lede, esc } from '../components/ui.js';
import { problem } from '../content.js';

const UNITS = 12;

/**
 * THE GAP — leakage.
 * Twelve units enter at the requirement. Between each stage a share of them
 * drops out of the track. The point of the animation is the count that
 * survives to day one, which is why the section exists at all.
 */
export const problemSection = () =>
  section({
    id: problem.id,
    chapter: problem.chapter,
    tone: 'paper',
    className: 'gap',
    extra: { 'data-scrub': 'gap' },
    body: `
      <div class="gap__head">
        ${headline(problem.headline, { size: 'lg' })}
        ${lede(problem.lede)}
      </div>

      <figure class="gap__figure" data-gap>
        <div class="gap__track">
          <ol class="gap__stages">
            ${problem.stages
              .map(
                (s, i) => `
              <li class="gap__stage" data-gap-stage style="--i:${i}">
                <span class="gap__node" aria-hidden="true"></span>
                <span class="gap__label">${esc(s)}</span>
              </li>`
              )
              .join('')}
          </ol>
          <div class="gap__flow" aria-hidden="true">
            <span class="gap__rule"></span>
            ${problem.stages
              .map((_, i) => `<span class="gap__guide" style="--g:${i / (problem.stages.length - 1)}"></span>`)
              .join('')}
            <div class="gap__units">
              ${Array.from({ length: UNITS }, (_, i) => `<span class="gap__unit" data-gap-unit style="--i:${i}"></span>`).join('')}
            </div>
          </div>
        </div>
        <figcaption class="gap__caption" data-reveal>${esc(problem.caption)}</figcaption>
      </figure>`,
  });
