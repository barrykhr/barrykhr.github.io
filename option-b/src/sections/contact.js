import { esc, headline, isPlaceholder, placeholder, attrs } from '../components/ui.js';
import { contact, footer, site } from '../content.js';

const field = (f) => `
<p class="form__field">
  <label for="f-${esc(f.name)}">${esc(f.label)}${f.required ? '<span aria-hidden="true"> *</span>' : ''}</label>
  <input${attrs({
    id: `f-${f.name}`,
    name: f.name,
    type: f.type,
    autocomplete: f.autocomplete,
    required: f.required,
  })}>
</p>`;

/**
 * START — the track terminates.
 * The tile motif from the hero returns at the end of the page and lands in a
 * single node marked "Join": the journey closes where it said it would.
 */
export const contactSection = () => `
<section class="cta" id="${esc(contact.id)}" data-chapter="${esc(contact.chapter)}" data-scrub="cta">
  <div class="cta__inner">
    <div class="cta__copy">
      ${headline(contact.headline, { size: 'xl', level: 2 })}
      <p class="lede" data-reveal style="--i:2">${esc(contact.lede)}</p>

      <div class="cta__terminal" aria-hidden="true" data-cta-terminal>
        <span class="cta__rail"></span>
        <span class="cta__tile" data-cta-tile></span>
        <span class="cta__node">Join</span>
      </div>
    </div>

    <!-- TODO: set contact.formEndpoint in src/content.js to a verified endpoint before launch. -->
    <form class="form" data-form${attrs({ action: contact.formEndpoint || null, method: contact.formEndpoint ? 'post' : null })} novalidate>
      <div class="form__grid">
        ${contact.fields.map(field).join('')}
      </div>
      <p class="form__field form__field--wide">
        <label for="f-${esc(contact.message.name)}">${esc(contact.message.label)}</label>
        <textarea id="f-${esc(contact.message.name)}" name="${esc(contact.message.name)}" rows="${esc(contact.message.rows)}"></textarea>
      </p>
      <div class="form__foot">
        <button class="btn btn--primary" type="submit">
          <span class="btn__label">${esc(contact.cta)}</span>
          <span class="btn__dot" aria-hidden="true"></span>
        </button>
        <p class="form__direct">
          ${esc(contact.direct.label)}
          ${isPlaceholder(contact.direct.value) ? placeholder(contact.direct.value) : esc(contact.direct.value)}
        </p>
      </div>
      <p class="form__status" role="status" data-form-status></p>
    </form>
  </div>
</section>

<footer class="foot">
  <div class="foot__inner">
    <p class="foot__tagline">${esc(footer.tagline)}</p>
    <ul class="foot__links">
      ${footer.links
        .map(
          (l) =>
            `<li><a href="${esc(l.href)}"${l.external ? ' rel="noopener noreferrer" target="_blank"' : ''}>${esc(l.label)}</a></li>`
        )
        .join('')}
    </ul>
    <p class="foot__legal">
      ${isPlaceholder(footer.legal) ? placeholder(footer.legal) : esc(footer.legal)}
    </p>
    <p class="foot__meta">
      <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
      <span>${esc(footer.note)}</span>
    </p>
  </div>
</footer>`;
