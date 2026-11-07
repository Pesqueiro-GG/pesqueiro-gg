# Glossary

Terms used across the code, the docs and the interface. Portuguese terms appear in the interface; use the English term in code and docs unless the table says otherwise.

## Fishing

| Term | Meaning |
|---|---|
| Pesque-pague, pesqueiro | A commercial pay-to-fish lake, usually stocked. In code: water type `pay_to_fish`, place kind `pay_to_fish`. The product's name comes from *pesqueiro*. |
| Represa | A reservoir. Water type `reservoir_lake` (reservoirs and natural lakes). |
| Solto / soltar | Released (catch and release). `catches.released = true`. |
| Piracema | The spawning season of many native river fish, roughly November to February in much of Brazil, when fishing rules tighten. Dates vary by basin and state. Official challenges in that period target pay-to-fish lakes, the sea, or released fish. |
| Defeso | The legal closed season for a species or region. Not modeled in the app. |
| Espécie protegida | A threatened or regulated species. `species.is_protected`. Shown as *Protegida*, never as a rarity tier. |
| Tucunaré, tilápia, pintado, dourado… | Species names. Each species has an `id` slug (`tucunare-acu`), Portuguese and English names, and a scientific name in the catalog. |

## Product

| Term | Meaning |
|---|---|
| Captura, registro | A catch: the structured fishing record. Table `catches`. |
| Post | What people see in feeds, with an audience. Kinds: `catch`, `story`, `tip`. |
| Dica | A tip: a post with a category (equipment, bait, technique, recipe, other). |
| Turma, grupo | A group of people who fish together. Table `groups`. |
| Group captain | The member who creates the group and invites the rest. Not a role in code; the creator becomes `admin`. |
| Audience | Who can see a post: some of the author's groups (`post_groups`) and optionally everyone (`posts.is_public`). |
| Álbum de Espécies | The species album: one numbered slot (*figurinha*, sticker) per catalog species. |
| Figurinha | A sticker in the album. Filled when the angler first catches that species. |
| Raridade | Rarity tier of a species: Comum, Incomum, Raro, Épico (`comum`, `incomum`, `raro`, `epico`). |
| XP | Experience points, awarded only for fishing. Stored as rows in `xp_events`. |
| Cargo | The career title for a level, from *Jovem Aprendiz* to *CEO dos Mares*, in masculine or feminine form (`profiles.title_form`). |
| Temporada | A season: a calendar quarter in Brasília time. Rankings reset each season. |
| Desafio | A challenge built from a template, run by a group admin (`group`) or the platform (`official`). |
| Fisgou | "Hooked": the only reaction, with the fishing-hook icon. |
| Foto conferida | "Photo checked": the catch's proof level is `photo_ai_match`. |
| Peixe do Mês | Fish of the Month voting (a could-have, not scheduled). |

## Technical

| Term | Meaning |
|---|---|
| Replay | Recomputing an angler's XP from all their catches and appending the difference to the ledger. |
| Award key | What an XP row is for, per angler: `species:tucunare-acu`, `catch:<id>:logged`. |
| `replay_seq` | The angler's replay counter; the ledger is unique on (angler, award key, `replay_seq`). |
| `TimelineSource` | The feed interface that returns post IDs and an opaque cursor. |
| `hydratePosts` | Loads posts for a list of IDs and re-checks the viewer may see each one. |
| `OwnCatch` / `PublicCatch` | The owner's view of a catch (with coordinates) and everyone else's (without any coordinate field). |
| Proof level | `reported` or `photo_ai_match` (`catches.verification_level`). |
| Dev, Demo, Production | The three cloud environments. See [Environments](environments.md). |
| Journeys J1–J7 | The core user journeys, defined in [Product](../explanation/product.md#core-journeys). |
