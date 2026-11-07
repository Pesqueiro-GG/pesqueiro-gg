# Button

Pill button: one primary per view, everything else secondary or text.

- `primary` (bobber red) is the one thing the screen is for, such as "Registrar peixe" or "Salvar". Never two on one screen.
- `secondary` for other real actions, with an icon ("Compartilhar").
- `text` for navigation and low-stakes actions ("Ver no mapa", "Editar").
- `danger` for destructive actions; ask for a second tap before deleting.
- Labels are infinitive verbs in sentence case: "Registrar peixe", never "REGISTRAR" or "Registre seu peixe!".
- Minimum height is `tap-min` (44px). `size="sm"` (36px) only in dense rows with space around it.
- Put `space-2` between buttons in a group. Disable Save until something has changed.
- Consumer provides: the label, `onClick` or `type="submit"`, and an optional `icon` name.
