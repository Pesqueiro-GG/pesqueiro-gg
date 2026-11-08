// Public interface of the catalog module. Other modules import only from this file.
// See docs/reference/code-conventions.md and docs/reference/data-model.md.
// Server-only: this entry pulls in the database client and Sentry. Before a client component needs
// RARITY_TIERS, HABITATS or the types, move them to a client-safe file; never import this from the browser.
export { getSpecies, listSpecies, searchSpecies, type Locale, type Species } from './queries'
export { deriveTier, RARITY_TIERS, type RarityRubric, type RarityTier } from './rarity'
export { HABITATS, loadSpeciesFile, type Habitat, type SpeciesEntry } from './species-data'
// Scripts and tests only (scripts/seed-catalog.ts). Not an app write: it has no viewer, so app code
// must not call it. Catalog data changes through species.json and the seed.
export { seedSpecies, type SeedReport } from './seed'
