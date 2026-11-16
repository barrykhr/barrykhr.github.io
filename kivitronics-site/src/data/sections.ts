/**
 * Section register — the running order of the page, its numbering, and which
 * hue of the accent family each section owns.
 *
 * Numbering lives here rather than in the components so that reordering the
 * page in `Home.tsx` can never leave a section labelled "03" sitting second.
 * Each section asks for its own metadata by id; the index is derived from this
 * array's order, so there is no number to keep in sync by hand.
 *
 * The hue order is a deliberate sweep, not a shuffle: it starts on the cobalt
 * that is the only colour in the logo mark, travels through the
 * blue-violet-magenta arc, and resolves back to cobalt at the final CTA so the
 * page closes on the brand colour it opened with. `to` is the next hue along,
 * which each section's gradients run toward — so colour visibly travels across
 * the seams between sections rather than restarting at each one.
 *
 * Sky is in the family but holds no section: it is reserved for categorical
 * use (the seven industries), where distinguishing items is the actual job.
 */

export type Hue = 'cobalt' | 'indigo' | 'violet' | 'fuchsia' | 'rose' | 'sky'

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
  { id: 'what-we-do', label: 'Services', hue: 'cobalt', to: 'indigo' },
  { id: 'how-we-work', label: 'How we work', hue: 'indigo', to: 'violet' },
  { id: 'industries', label: 'Industries', hue: 'violet', to: 'fuchsia' },
  { id: 'every-size', label: 'Who we work with', hue: 'fuchsia', to: 'rose' },
  { id: 'faq', label: 'FAQ', hue: 'rose', to: 'cobalt' },
  { id: 'contact', label: 'Contact', hue: 'cobalt', to: 'violet' },
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

/** The categorical rotation, for lists where each item wants its own hue. */
export const hueRotation: readonly Hue[] = [
  'cobalt',
  'indigo',
  'violet',
  'fuchsia',
  'rose',
  'sky',
] as const
