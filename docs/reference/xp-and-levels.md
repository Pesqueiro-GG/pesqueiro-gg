# XP, levels and rarity

The exact rules of the gamification system. For why it works this way, read [Gamification](../explanation/gamification.md). Numbers here are the starting values; changing them means bumping `RULESET_VERSION` and replaying every angler.

## XP rules

XP comes only from fishing. Posts, tips, comments, reactions and follows never award XP.

| Rule | Award key | XP | Conditions |
|---|---|---|---|
| `catch_logged` | `catch:<catchId>:logged` | 20 | 1st–3rd catch of a fishing day: 20; 4th–6th: 10; 7th and later: 0. Zero if logged more than 7 days after the fishing date. Zero for a protected species that was kept. |
| `new_species` | `species:<speciesId>` | 50 / 100 / 200 / 400 | By tier: Comum, Incomum, Raro, Épico. Capped at 100 when the water type is a pay-to-fish lake. Zero for protected or unknown species. |
| `new_water_type` | `water:<type>` | 30 | First catch in each of the four water types |
| `milestone` | `milestone:<id>` | see below | Earned by the catch that reaches it |
| `challenge` | `challenge:<challengeId>:<userId>` | 150 / 100 / 75, or 50 | 1st, 2nd, 3rd place, or completing a species goal. Only when at least 3 people scored. At most 600 challenge XP per angler per season. |

Award keys name *what* was earned for each angler, so an award can move from one catch to another without being counted twice.

### Milestones

| Id | Reached at | XP | Badge |
|---|---|---|---|
| `first_catch` | First catch | 25 | Primeira captura |
| `species_5` | 5 species | 100 | 5 espécies |
| `species_10` | 10 species | 200 | 10 espécies |
| `species_25` | 25 species | 400 | 25 espécies |
| `species_50` | 50 species | 800 | 50 espécies |
| `all_waters` | All four water types | 100 | Todas as águas |

### Seasons

- A season is a calendar quarter in Brasília time: Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec.
- XP goes to the season of the catch's fishing date.
- A catch logged more than 48 hours after its season ended counts for lifetime XP only.

### Example

A first tucunaré-açu (Incomum), caught in a river:

| Rule | XP |
|---|---|
| `catch_logged` | 20 |
| `new_species` (Incomum) | 100 |
| `new_water_type` (river) | 30 |
| `milestone` (`first_catch`) | 25 |
| **Total** | **175** |

## Levels

Level *n* needs 50 × *n* × (*n* − 1) lifetime XP.

| Level | XP needed | Portuguese (masculine) | Portuguese (feminine) | English |
|---|---|---|---|---|
| 1 | 0 | Jovem Aprendiz | Jovem Aprendiz | Young Apprentice |
| 2 | 100 | Estagiário | Estagiária | Intern |
| 3 | 300 | Pescador Júnior | Pescadora Júnior | Junior Angler |
| 4 | 600 | Pescador Pleno | Pescadora Plena | Mid-level Angler |
| 5 | 1,000 | Pescador Sênior | Pescadora Sênior | Senior Angler |
| 6 | 1,500 | Especialista em Anzol | Especialista em Anzol | Hook Specialist |
| 7 | 2,100 | Coordenador de Cardume | Coordenadora de Cardume | Shoal Coordinator |
| 8 | 2,800 | Gerente de Águas | Gerente de Águas | Waters Manager |
| 9 | 3,600 | Diretor de Pescaria | Diretora de Pescaria | Fishing Director |
| 10+ | 4,500 | CEO dos Mares | CEO dos Mares | CEO of the Seas |

Each person picks masculine or feminine in their profile. Above level 10 the title stays the same and the number keeps growing.

## Rarity

Rarity belongs to the species and comes from a public rubric. Conservation status is never part of it.

| Criterion | Score | Meaning |
|---|---|---|
| Range | 0–2 | Found across Brazil (0) to limited to one basin or stretch of coast (2) |
| Difficulty | 0–2 | Easy for a recreational angler (0) to hard: remote habitat, short season, specific technique (2) |
| Stocking | −1–0 | Commonly stocked in pay-to-fish lakes (−1) |

| Total | Tier |
|---|---|
| 0–1 | Comum |
| 2 | Incomum |
| 3 | Raro |
| 4 | Épico |

Threatened or regulated species get the **Protegida** flag instead of a tier: the sticker can be filled, there's no rarity bonus, and keeping one awards no XP.

## Proof levels

| Level | Set when | Needed for |
|---|---|---|
| `reported` | Default | Groups and the public feed |
| `photo_ai_match` | The server's stored identification of the first photo names the chosen species with confidence ≥ 0.6 | Official public challenges |

## Challenge templates

| Template | Score | Parameters |
|---|---|---|
| `most_species` | Distinct species in the window | Shared filters |
| `heaviest` | Highest `weight_g` | Shared filters |
| `longest` | Highest `length_mm` | Shared filters |
| `species_goal` | Complete or not | `speciesIds` (2–10), `target` |
| `most_released` | Number of released catches | Shared filters |

Shared filters: `speciesIds`, `waterTypes`, `releasedOnly`. A catch counts if its fishing date is inside the window, it was logged no later than 48 hours after the end, the group can see it (or, for official challenges, it's public), and its proof level meets the challenge's minimum. Ties go to whoever logged the scoring catch first.

Official challenges that overlap November–February (piracema in much of Brazil) must limit water types to pay-to-fish lakes and the sea, or count released fish only.
