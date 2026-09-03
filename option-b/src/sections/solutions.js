import { section, headline, eyebrow, esc } from '../components/ui.js';
import { solutions } from '../content.js';

/**
 * SOLUTIONS — an editorial index, not a card grid.
 * One row is open at a time; opening a row re-forms the tile field beside it,
 * so the offering is read as five configurations of the same engine.
 */
export const solutionsSection = () =>
  section({
    id: solutions.id,
    chapter: solutions.chapter,
    tone: 'paper',
    className: 'sol',
    body: `
      <div class="sol__head">
        ${eyebrow(solutions.eyebrow)}
        ${headline(solutions.headline, { size: 'md' })}
      </div>

      <div class="sol__body">
        <ul class="sol__list" data-sol>
          ${solutions.items
            .map(
              (item, i) => `
            <li class="sol__item" data-reveal style="--i:${i}">
              <h3 class="sol__h">
                <button class="sol__trigger" type="button" data-sol-trigger
                        aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="sol-panel-${i}" id="sol-trigger-${i}">
                  <span class="sol__index">0${i + 1}</span>
                  <span class="sol__name">${esc(item.name)}</span>
                  <span class="sol__tag">${esc(item.tag)}</span>
                  <span class="sol__mark" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="sol__panel" id="sol-panel-${i}" role="region" aria-labelledby="sol-trigger-${i}" data-sol-panel${i === 0 ? ' data-open' : ''}>
                <p>${esc(item.line)}</p>
              </div>
            </li>`
            )
            .join('')}
        </ul>

        <div class="sol__field" aria-hidden="true" data-sol-field>
          ${Array.from({ length: 16 }, (_, i) => `<span class="sol__cell" style="--i:${i}"></span>`).join('')}
        </div>
      </div>`,
  });
