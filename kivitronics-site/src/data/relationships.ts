/**
 * Section 08 — client relationships.
 *
 * We hold 25 client relationships, 15 of which issued more than one mandate.
 * Client names and logos are NOT published here: none were supplied, and we do
 * not invent them. The wall below is generated from the verified counts and
 * renders as an anonymised relationship map, not a logo grid.
 */

export const relationshipFacts = {
  companiesServed: 25,
  repeatClients: 15,
  repeatRate: 60,
  deepestRelationshipHires: '65+',
  deepestRelationshipCount: 3,
}

export const relationshipHeadline = {
  line1: 'The strongest proof isn’t the first mandate.',
  line2: 'It’s the second.',
}

export const relationshipBody =
  'Repeat business is the only client feedback that cannot be written for you. Fifteen of the twenty-five companies we have worked with came back with another role — and three of those relationships have produced more than sixty-five hires between them.'

/**
 * Build the wall: 25 cells, of which 15 are repeat clients and, within those,
 * 3 are the deepest relationships. Deterministic, so the layout never shifts.
 */
export type RelationshipCell = {
  id: number
  tier: 'single' | 'repeat' | 'deepest'
}

export const relationshipWall: RelationshipCell[] = Array.from(
  { length: relationshipFacts.companiesServed },
  (_, i) => {
    const id = i + 1
    if (id <= relationshipFacts.deepestRelationshipCount) return { id, tier: 'deepest' as const }
    if (id <= relationshipFacts.repeatClients) return { id, tier: 'repeat' as const }
    return { id, tier: 'single' as const }
  },
)
