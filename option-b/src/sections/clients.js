import { section, headline, metric, esc, isPlaceholder, placeholder } from '../components/ui.js';
import { clients } from '../content.js';

/**
 * CLIENTS — the second mandate.
 * Twenty-five marks stand for twenty-five companies; fifteen of them fill,
 * because fifteen came back. The statement and the visual say the same thing.
 */
export const clientsSection = () => {
  const marks = Array.from({ length: clients.field.total }, (_, i) => {
    const repeat = i < clients.field.repeat;
    return `<span class="clients__mark${repeat ? ' is-repeat' : ''}" style="--i:${i}"></span>`;
  }).join('');

  return section({
    id: clients.id,
    chapter: clients.chapter,
    tone: 'paper',
    className: 'clients',
    extra: { 'data-scrub': 'clients' },
    body: `
      <div class="clients__statement">
        ${headline(clients.headline, { size: 'xl' })}
      </div>

      <div class="clients__body">
        <div class="clients__marks">
          <div class="clients__field" aria-hidden="true" data-clients-field>${marks}</div>
          <p class="clients__key" data-reveal>${esc(clients.fieldNote)}</p>
        </div>
        <div class="clients__metrics">
          ${clients.metrics.map((m, i) => metric({ ...m, index: i, size: 'sm' })).join('')}
        </div>
      </div>

      <!-- Client logos are intentionally absent: none are approved for public use. -->
      <p class="clients__note" data-reveal>
        ${isPlaceholder(clients.logosNote) ? placeholder(clients.logosNote) : esc(clients.logosNote)}
      </p>`,
  });
};
