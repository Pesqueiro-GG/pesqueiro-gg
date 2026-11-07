# Design source files

The Pesqueiro.GG design system, kept in the repository so every contributor and every AI agent can read it. These files are the source of truth for how the app looks. A team-only interactive copy with live previews also exists, but nothing here depends on it.

| Path | What it is | Use it for |
|---|---|---|
| [`tokens.json`](tokens.json) | Every color (light and dark), type style, spacing, radius, size and shadow token, each with a usage note | Generating CSS variables and the Tailwind theme ([#6](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/6)) |
| [`brand-book.md`](brand-book.md) | Principles, voice, career titles, color, type, layout, motion, iconography, the album, accessibility | Deciding how something should look or read |
| [`components/`](components/) | One guideline per component: when to use it, its variants, what the caller provides | Building a component in `src/ui/` or a module's `ui/` |
| [`prototype/`](prototype/) | A working reference implementation of the 13 components (`bundle.js` with React, `bundle.css`, types in `index.d.ts`) | Matching structure, class names, spacing and states exactly |
| [`assets/pesqueiro-mark.svg`](assets/pesqueiro-mark.svg) | The app icon: the bobber on a water-blue square | App icon, favicon, PWA icons, link previews |

## How to use the prototype

The prototype is a reference, not a dependency. Don't import it into the app. Rebuild each component in TypeScript in `src/ui/` (primitives) or `src/modules/<module>/ui/` (domain components), using the tokens through Tailwind, and keep the same structure, states and behavior.

To see it running, create an HTML file next to `bundle.js` that loads React 18 and ReactDOM 18 from a CDN, the CSS variables generated from `tokens.json`, `bundle.css`, then `bundle.js`, and render a component from `window.PesqueiroGG`.

## Pending

- The album sticker's final look: Amanda is designing a version that will replace the current `Sticker`. Until it lands, build from `components/Sticker.md` and the prototype.

## Licenses

All files here were created for this project and are MIT licensed with the rest of the repository, except the icon markup inside `prototype/bundle.js`, which is copied from [Lucide](https://lucide.dev) 1.60.0 (ISC license).
