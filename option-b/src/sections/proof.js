import { section, headline, eyebrow, metric, esc } from '../components/ui.js';
import { proof } from '../content.js';

/** PROOF — the metrics carry the section as type, not as a dashboard. */
export const proofSection = () =>
  section({
    id: proof.id,
    chapter: proof.chapter,
    tone: 'paper',
    className: 'proof',
    extra: { 'data-scrub': 'proof' },
    body: `
      <div class="proof__head">
        ${eyebrow(proof.eyebrow)}
        ${headline(proof.headline, { size: 'md' })}
      </div>
      <div class="proof__grid">
        ${proof.metrics
          .map((m, i) => metric({ ...m, index: i, size: 'xl' }))
          .join('')}
      </div>
      <p class="proof__foot" data-reveal>${esc(proof.footnote)}</p>`,
  });
