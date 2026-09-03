import { section, headline, lede, esc } from '../components/ui.js';
import { qualification as q } from '../content.js';

/**
 * QUALIFICATION — the assay.
 * One profile is pulled through five dimensions in sequence. Each row is
 * scanned by a cobalt sweep and then resolves. No scores are shown: the
 * dimensions are qualitative and inventing numbers here would be a claim.
 */
export const qualificationSection = () =>
  section({
    id: q.id,
    chapter: q.chapter,
    tone: 'paper',
    className: 'qual',
    extra: { 'data-scrub': 'qual' },
    body: `
      <div class="qual__head">
        ${headline(q.headline, { size: 'lg' })}
        ${lede(q.lede)}
      </div>

      <div class="qual__body">
        <div class="qual__profile" aria-hidden="true" data-qual-profile>
          <span class="qual__profile-tile"></span>
          <span class="qual__profile-line"></span>
          <span class="qual__profile-line"></span>
          <span class="qual__profile-line"></span>
          <span class="qual__profile-stamp">Qualified</span>
        </div>

        <ol class="qual__rows">
          ${q.dimensions
            .map(
              (d, i) => `
            <li class="qual__row" data-qual-row style="--i:${i}">
              <span class="qual__index">0${i + 1}</span>
              <div class="qual__text">
                <h3 class="qual__name">${esc(d.name)}</h3>
                <p class="qual__question">${esc(d.question)}</p>
              </div>
              <span class="qual__assay" aria-hidden="true">
                <span class="qual__assay-track"></span>
                <span class="qual__assay-sweep"></span>
                <span class="qual__assay-mark"></span>
              </span>
            </li>`
            )
            .join('')}
        </ol>
      </div>`,
  });
