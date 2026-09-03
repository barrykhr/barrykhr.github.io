import { section, headline, lede, esc } from '../components/ui.js';
import { intelligence } from '../content.js';

/**
 * DIRECTION — human-led today.
 * Planes assemble behind the statement as the section scrubs: a system taking
 * shape, not a system that already ships. Every roadmap item is tagged.
 */
export const intelligenceSection = () =>
  section({
    id: intelligence.id,
    chapter: intelligence.chapter,
    tone: 'night',
    className: 'intel',
    extra: { 'data-scrub': 'intel' },
    body: `
      <div class="intel__planes" aria-hidden="true" data-intel-planes>
        <span class="intel__plane" style="--i:0"></span>
        <span class="intel__plane" style="--i:1"></span>
        <span class="intel__plane" style="--i:2"></span>
        <span class="intel__plane" style="--i:3"></span>
      </div>

      <div class="intel__copy">
        ${headline(intelligence.headline, { size: 'lg' })}
        ${lede(intelligence.lede)}

        <div class="intel__roadmap">
          <p class="intel__roadmap-label">
            <span class="tagpill">Roadmap</span>
            ${esc(intelligence.roadmapLabel.replace('Roadmap — ', ''))}
          </p>
          <ul class="intel__chips">
            ${intelligence.roadmap
              .map((r, i) => `<li data-reveal style="--i:${i}">${esc(r)}</li>`)
              .join('')}
          </ul>
        </div>
      </div>`,
  });
