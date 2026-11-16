import { cx } from '@/lib/cx'
import { brand } from '@/data/content'
import logoLight from '@/assets/logo.png'
import logoOnNavy from '@/assets/logo-on-navy.png'

/**
 * The real Kivitronics lockup: a cyan kingfisher between KIVI and TRONICS.
 *
 * Two files rather than one recoloured with a CSS filter, because the lockup is
 * two-tone — the wordmark has to flip to cream on navy while the bird keeps its
 * exact #00B7FF. A filter that lightened the text would drag the cyan with it.
 *
 * Supplied as a 357x140 bitmap. Rendered at 40px tall, which is set by the
 * wordmark rather than the bird: the lockup is 2.55:1, so at 34px the letters
 * fell to ~10px and the whole thing read as a smudge. 40px still leaves 3.5x
 * headroom over the native height, so it stays sharp at 2x and 3x. If the
 * original vector ever arrives, swap the two files for SVGs here and nothing
 * else has to change.
 *
 * The <img> carries the alt text, so there is no separate wordmark element —
 * the company name is already inside the artwork and repeating it beside the
 * logo would have screen readers announce it twice.
 *
 * Imported rather than referenced from /public: the site is served under a base
 * path, and Vite rewrites asset URLs it can see through an import but not
 * string literals inside components. Both files are under the 4 kB inline
 * threshold, so they also end up as data URIs — no extra request, and the
 * single-file preview build keeps working without special-casing them.
 */
export function Logo({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'canvas'
}) {
  const onCanvas = tone === 'canvas'
  return (
    <img
      src={onCanvas ? logoOnNavy : logoLight}
      alt={brand.fullName}
      width={357}
      height={140}
      className={cx('h-10 w-auto shrink-0 select-none', className)}
      draggable={false}
    />
  )
}
