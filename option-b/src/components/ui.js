/**
 * Shared render primitives.
 * Every component is a pure function returning an HTML string, so sections
 * compose the same way regardless of how complex their motion is.
 */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);

export const isPlaceholder = (value) => Boolean(value && value.__placeholder);

/** Renders unverified content as a visible, unmistakable placeholder. */
export const placeholder = (value, tag = 'span') =>
  `<${tag} class="placeholder" data-placeholder>${esc(value.label)}<span class="placeholder__flag" aria-hidden="true">to confirm</span></${tag}>`;

/** Text that may be either a verified string or a `todo()` placeholder. */
export const text = (value, tag = 'span') =>
  isPlaceholder(value) ? placeholder(value, tag) : esc(value);

export const classes = (...parts) => parts.filter(Boolean).join(' ');

export const attrs = (map = {}) =>
  Object.entries(map)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');

/**
 * Section shell. Owns the chapter marker that hangs off the page rail, so the
 * whole page reads as one continuous track rather than stacked blocks.
 */
export const section = ({ id, chapter, tone = 'paper', flush = false, className, extra = {}, body }) => `
<section${attrs({ id, class: classes('section', `section--${tone}`, flush && 'section--flush', className), 'data-chapter': chapter, ...extra })}>
  ${chapter ? `<p class="section__chapter" aria-hidden="true"><span class="section__chapter-tick"></span>${esc(chapter)}</p>` : ''}
  <div class="section__inner">${body}</div>
</section>`;

export const eyebrow = (value) =>
  value ? `<p class="eyebrow" data-reveal>${esc(value)}</p>` : '';

/**
 * Display headline. An array of strings becomes one line each, so long
 * statements break exactly where the editorial rhythm needs them to.
 */
export const headline = (value, { level = 2, size = 'lg', id } = {}) => {
  const lines = Array.isArray(value) ? value : [value];
  const inner = lines
    .map(
      (line, i) =>
        `<span class="headline__line" style="--i:${i}"><span class="headline__line-in">${esc(line)}</span></span>`
    )
    .join('');
  return `<h${level}${attrs({ id, class: `headline headline--${size}`, 'data-reveal': true })}>${inner}</h${level}>`;
};

export const lede = (value, { delay = 1 } = {}) =>
  value ? `<p class="lede" data-reveal style="--i:${delay}">${text(value)}</p>` : '';

export const button = ({ label, href, variant = 'primary', extra = {} }) => `
<a${attrs({ href, class: `btn btn--${variant}`, ...extra })}>
  <span class="btn__label">${esc(label)}</span>
  ${variant === 'primary' ? '<span class="btn__dot" aria-hidden="true"></span>' : '<span class="btn__rule" aria-hidden="true"></span>'}
</a>`;

/** Odometer-style number that counts up once on entry. */
export const metric = ({ value, suffix = '', label, index = 0, size = 'lg' }) => `
<div class="metric metric--${size}" data-reveal style="--i:${index}">
  <p class="metric__value"><span class="metric__num" data-count="${esc(value)}">0</span><span class="metric__suffix">${esc(suffix)}</span></p>
  <p class="metric__label">${esc(label)}</p>
</div>`;
