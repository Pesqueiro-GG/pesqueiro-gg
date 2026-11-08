// Public interface of the catalog module. Other modules import only from this file.
// See docs/reference/code-conventions.md and docs/reference/data-model.md.
export { getSpecies, listSpecies, searchSpecies, type Locale, type Species } from './queries'
export { deriveTier, RARITY_TIERS, type RarityRubric, type RarityTier } from './rarity'
export { HABITATS, loadSpeciesFile, type Habitat, type SpeciesEntry } from './species-data'
export { seedSpecies, type SeedReport } from './seed'
