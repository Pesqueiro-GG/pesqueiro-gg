# Chip

A small pill for filters, tip categories and short facts.

- In filter rows, pass `selected` so the chip becomes a toggle button; the selected chip inverts to `ink`.
- Tip categories keep fixed tones everywhere: Equipamento `water`, Isca `bobber`, Técnica `gold`, Receita `reed`, Outro neutral.
- One or two words. No icons on filter chips unless every chip in the row has one.
- Consumer provides: the label, `tone`, and `selected` plus `onClick` when it filters.
