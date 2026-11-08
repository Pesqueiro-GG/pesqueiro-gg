// Rarity belongs to the species and comes from a public rubric, never from conservation status.
// See docs/reference/xp-and-levels.md#rarity and docs/explanation/gamification.md.

export const RARITY_TIERS = ['comum', 'incomum', 'raro', 'epico'] as const
export type RarityTier = (typeof RARITY_TIERS)[number]

export type RarityRubric = {
  /** 0 (found across Brazil) to 2 (limited to one basin or stretch of coast). */
  range: number
  /** 0 (easy for a recreational angler) to 2 (remote habitat, short season, specific technique). */
  difficulty: number
  /** −1 (commonly stocked in pay-to-fish lakes) to 0. */
  stocking: number
}

/** Total 1 or less is comum, 2 incomum, 3 raro, 4 and above épico. */
export function deriveTier({ range, difficulty, stocking }: RarityRubric): RarityTier {
  const total = range + difficulty + stocking
  if (total >= 4) return 'epico'
  if (total === 3) return 'raro'
  if (total === 2) return 'incomum'
  return 'comum'
}
