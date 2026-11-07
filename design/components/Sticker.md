# Sticker

One slot of the Álbum de Espécies: a filled sticker or an empty dashed slot.

- Place stickers on the album page (`.pq-album` holding `.pq-album-grid`), which uses the warm `paper` ground. Never on plain `surface`.
- A filled sticker shows its album number, the fish (the angler's best photo, or the silhouette), the name in the `display` family, the scientific name and the rarity badge. The inner frame takes the tier color.
- Raro and Épico stickers get a light sheen that moves on hover; Épico also gets a gold edge. Comum and Incomum stay matte.
- An empty slot keeps its number and the species name so people know what to look for, with a large question mark in `paper-line`.
- `isNew` adds the gold "Nova" flag the first time the angler sees the sticker after the catch that filled it.
- Numbers are fixed per species in the catalog and printed with three digits (#007).
- Consumer provides: `number`, `name`, `tier`, `filled`, and optionally `scientific`, `photo`, `isNew`, `lang`.
