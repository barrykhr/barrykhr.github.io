/**
 * Section register — the running order of the page, its numbering, and which
 * hue of the accent family each section owns.
 *
 * Numbering lives here rather than in the components so that reordering the
 * page in `Home.tsx` can never leave a section labelled "03" sitting second.
 * Each section asks for its own metadata by id; the index is derived from this
 * array's order, so there is no number to keep in sync by hand.
 *
 * Every hue is a brand colour: the logo cyan at text weight, the navy at accent
 * weight, and coral. The page opens on the logo's own blue and closes on it
 * again at the final CTA. `to` is the hue each section's gradients run toward —
 * so colour visibly travels across the seams between sections rather than
 * restarting at each one.
 *
 * `every-size` is the navy section, and it is the payoff: on that ground the
 * cyan is substituted for its `-lift` value, which is #00B7FF — the logo colour
 * at full strength. It is the only place on the site where that exact value
 * appears outside the mark itself, because it is the only ground it is legible
 * on (6.75:1 there, against 2.11:1 on cream).
 */

export type Hue = 'cyan' | 'blue' | 'coral'

type SectionDef = {
  /** Matches the section's DOM id and its nav anchor. */
  id: string
  /** The eyebrow text. Real content, so it is not aria-hidden. */
  label: string
  hue: Hue
  /** The hue this section's gradients run toward — the next one along. */
  to: Hue
}

export const sectionRegister: readonly SectionDef[] = [
  { id: 'what-we-do', label: 'Services', hue: 'cyan', to: 'blue' },
  { id: 'how-we-work', label: 'How we work', hue: 'blue', to: 'coral' },
  { id: 'industries', label: 'Industries', hue: 'coral', to: 'cyan' },
  // the navy ground — here `cyan` resolves to #00B7FF, the logo colour
  { id: 'every-size', label: 'Who we work with', hue: 'cyan', to: 'coral' },
  { id: 'faq', label: 'FAQ', hue: 'coral', to: 'blue' },
  { id: 'contact', label: 'Contact', hue: 'cyan', to: 'blue' },
] as const

export type SectionMeta = SectionDef & {
  /** 1-based position, rendered as "01", "02", … */
  index: number
  /** "01" — precomputed so no component repeats the padStart. */
  number: string
  /** Total sections, for the "01 / 06" form. */
  total: number
}

/**
 * Look up a section by id. Throws rather than returning a fallback: a typo in
 * an id would otherwise ship as a silently mis-numbered, mis-coloured section,
 * and this runs at render time in dev long before it could reach anyone.
 */
export function sectionMeta(id: string): SectionMeta {
  const index = sectionRegister.findIndex((s) => s.id === id)
  if (index === -1) {
    throw new Error(
      `sectionMeta("${id}"): not in the section register. Add it to sectionRegister in src/data/sections.ts.`,
    )
  }
  const def = sectionRegister[index]
  return {
    ...def,
    index: index + 1,
    number: String(index + 1).padStart(2, '0'),
    total: sectionRegister.length,
  }
}

/**
 * Non-throwing lookup, for callers iterating a list that is not the register —
 * the nav, whose items may legitimately point somewhere that is not one of
 * these sections. Those callers want to fall back, not to crash.
 */
export function findSectionMeta(id: string): SectionMeta | null {
  return sectionRegister.some((s) => s.id === id) ? sectionMeta(id) : null
}

/**
 * The categorical rotation, for lists where each item wants its own hue.
 *
 * Cyan and coral only, deliberately: `blue` is in the family but at dot size it
 * is indistinguishable from `cyan` — the two differ by about as much as two
 * neighbouring pixels of the same blue, so a three-hue rotation read as a
 * two-hue one with a mistake in it. Alternating two hues that genuinely differ
 * separates neighbours at a glance, which is all these dots have to do; they
 * are not a legend anyone has to decode.
 */
export const hueRotation: readonly Hue[] = ['cyan', 'coral'] as const
