import { section, headline, esc, isPlaceholder, placeholder } from '../components/ui.js';
import { faq } from '../content.js';

const answer = (a) => (isPlaceholder(a) ? placeholder(a, 'p') : `<p>${esc(a)}</p>`);

export const faqSection = () =>
  section({
    id: faq.id,
    chapter: faq.chapter,
    tone: 'paper',
    className: 'faq',
    body: `
      <div class="faq__head">
        <p class="eyebrow" data-reveal>Questions</p>
        ${headline(faq.headline, { size: 'lg' })}
      </div>

      <div class="faq__tabs" data-faq>
        <div class="faq__tablist" role="tablist" aria-label="Frequently asked questions">
          ${faq.tabs
            .map(
              (t, i) => `
            <button type="button" role="tab" id="faq-tab-${esc(t.id)}" aria-controls="faq-panel-${esc(t.id)}"
                    aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-faq-tab>
              ${esc(t.label)}
            </button>`
            )
            .join('')}
          <span class="faq__tabmark" aria-hidden="true" data-faq-mark></span>
        </div>

        ${faq.tabs
          .map(
            (t, i) => `
          <div class="faq__panel" role="tabpanel" id="faq-panel-${esc(t.id)}" aria-labelledby="faq-tab-${esc(t.id)}"
               data-faq-panel${i === 0 ? '' : ' hidden'}>
            <ul class="faq__list">
              ${t.items
                .map(
                  (item, j) => `
                <li class="faq__item">
                  <h3>
                    <button type="button" class="faq__q" aria-expanded="false"
                            aria-controls="faq-a-${esc(t.id)}-${j}" id="faq-q-${esc(t.id)}-${j}" data-faq-q>
                      <span>${esc(item.q)}</span>
                      <span class="faq__sign" aria-hidden="true"><i></i><i></i></span>
                    </button>
                  </h3>
                  <div class="faq__a" id="faq-a-${esc(t.id)}-${j}" role="region"
                       aria-labelledby="faq-q-${esc(t.id)}-${j}" data-faq-a>
                    <div class="faq__a-in">${answer(item.a)}</div>
                  </div>
                </li>`
                )
                .join('')}
            </ul>
          </div>`
          )
          .join('')}
      </div>`,
  });
