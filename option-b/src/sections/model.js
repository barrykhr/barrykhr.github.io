import { esc, headline } from '../components/ui.js';
import { model } from '../content.js';

/**
 * THE MODEL — signature interaction.
 * Desktop: the section pins and the nine stages travel horizontally under a
 * fixed playhead, so scrolling *is* the journey. Mobile: the same track turns
 * vertical and draws downward — reinterpreted, not shrunk.
 */
export const modelSection = () => `
<section class="model" id="${esc(model.id)}" data-chapter="${esc(model.chapter)}" data-model>
  <div class="model__pin">
    <div class="model__head">
      <p class="eyebrow">${esc(model.eyebrow)}</p>
      ${headline(model.headline, { size: 'md' })}
      <p class="lede">${esc(model.lede)}</p>
    </div>

    <div class="model__viewport">
      <span class="model__playhead" aria-hidden="true"></span>
      <ol class="model__track" data-model-track>
        ${model.stages
          .map(
            (s, i) => `
          <li class="stage" data-model-stage style="--i:${i}">
            <span class="stage__rule" aria-hidden="true"></span>
            <span class="stage__node" aria-hidden="true"></span>
            <p class="stage__n">${esc(s.n)}</p>
            <h3 class="stage__name">${esc(s.name)}</h3>
            <p class="stage__note">${esc(s.note)}</p>
          </li>`
          )
          .join('')}
      </ol>
      <span class="model__unit" aria-hidden="true" data-model-unit></span>
    </div>

    <div class="model__meter" aria-hidden="true">
      <span class="model__meter-fill" data-model-meter></span>
      <span class="model__meter-count"><em data-model-count>01</em> / 09</span>
    </div>
  </div>
</section>`;
