# Design system

A summary of the Pesqueiro.GG design system for building screens. The complete source files (every token with its usage note, the brand book, one guideline per component, and a working prototype of each component) are in [`design/`](../../design/README.md). The values below are what the code uses.

## In the code

- `src/app/tokens.css` holds every token as a CSS variable, light under `:root`, dark under `[data-theme='dark']` and under `prefers-color-scheme: dark` when no theme was chosen. It is generated from `design/tokens.json`: after changing that file, run `node scripts/generate-tokens.mjs` (a unit test fails while the two disagree).
- Tailwind maps the tokens in `src/app/globals.css`, so components write `bg-surface text-ink rounded-md shadow-card text-label font-display`. Tailwind's default palette is removed, so a color that isn't a token doesn't exist. `min-h-tap`, `size-tap` and `max-w-content` use the size tokens; Tailwind's 4 px spacing scale matches the `space-*` tokens.
- The theme comes from the `theme` cookie (`system`, `light`, `dark`), read by the root layout to set `data-theme` on `<html>` before the first paint. Settings changes it.
- Primitives live in `src/ui/`; `Icon` only knows the names listed in `src/ui/Icon.tsx`, so add a name there when an item needs a new icon.

## Colors

Every color is a token with a light and a dark value. Components use tokens only, never literal colors.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#e4eef4` | `#0c1a1d` | Page ground |
| `surface` | `#f8fbfd` | `#14272b` | Cards, sheets, bottom bar |
| `surface-sunken` | `#d6e5ee` | `#0a1517` | Wells, pressed states, neutral chips |
| `line` | `#bcd0de` | `#2a4549` | Decorative hairlines |
| `line-strong` | `#6e899c` | `#6a8b90` | Borders that carry meaning (inputs) |
| `ink` | `#14304a` | `#e6efec` | Primary text |
| `ink-muted` | `#4a6376` | `#97aeab` | Secondary text |
| `water` | `#1d5e7d` | `#63b7bd` | Links, active tab, selected states |
| `water-soft` | `#d2e4ee` | `#1a383d` | Behind water text; your own ranking row |
| `bobber` | `#cf3727` | `#f25d4e` | The one primary action per view; the Log button |
| `bobber-text` | `#ae2c1f` | `#f7796c` | Small red text: errors, destructive actions |
| `bobber-soft` | `#fadbd6` | `#3b1a17` | Behind error notes |
| `on-bobber` | `#ffffff` | `#1f0a07` | Text on a bobber fill |
| `reed` | `#3f6b22` | `#a6cc72` | Released fish, success, protected species |
| `gold` | `#f2a516` | `#f5b43a` | Awards only (a fill, never text) |
| `gold-text` | `#7f5300` | `#f7c25a` | Gold as text |
| `paper` | `#f5eedd` | `#26302a` | The album page |
| `rarity-comum` | `#536573` | `#a3b4bf` | Comum tier |
| `rarity-incomum` | = `reed` | = `reed` | Incomum tier |
| `rarity-raro` | = `water` | = `water` | Raro tier |
| `rarity-epico` | `#8a5a00` | `#f5b43a` | Épico tier |
| `sea-shallow` | `#bfe0ea` | `#123238` | Sea moments, photo placeholder |
| `sea-deep` | `#2c7393` | `#5fa9c4` | Fish silhouettes |

Every text color meets 4.5:1 contrast on the grounds it's used on, in both themes. The full list, including `on-*` tokens and podium colors, is in the design system.

## Typography

| Style | Family | Size / line height | Weight | Use |
|---|---|---|---|---|
| `display-xl` | Big Shoulders Display | 48 / 48 | 900 | Reward moments only |
| `display` | Big Shoulders Display | 34 / 38 | 800 | One page title per screen |
| `title` | Big Shoulders Display | 24 / 28 | 800 | Species names, section headings |
| `stat` | Big Shoulders Display | 24 / 24 | 900 | XP, positions (tabular figures) |
| `heading` | Atkinson Hyperlegible | 18 / 24 | 700 | Card headings, names |
| `body` | Atkinson Hyperlegible | 16 / 24 | 400 | Everything people read |
| `small` | Atkinson Hyperlegible | 14 / 20 | 400 | Metadata |
| `label` | Atkinson Hyperlegible | 14 / 20 | 700 | Buttons, chips |
| `caption` | Atkinson Hyperlegible | 12 / 16 | 700 | Uppercase labels; the smallest size |

## Spacing, radius and size

- Spacing: 4 px base (`space-1` 4, `space-2` 8, `space-3` 12, `space-4` 16, `space-5` 20, `space-6` 24, `space-8` 32, `space-12` 48).
- Radius: `radius-sticker` 6, `radius-sm` 8, `radius-md` 14, `radius-lg` 22, `radius-full` for buttons, chips and avatars.
- Size: `tap-min` 44 px, `content-max` 640 px, `sticker-w` 148 px.

## Components

| Component | Use |
|---|---|
| `Logo` | The bobber mark, with or without the wordmark |
| `Icon` | Lucide 1.60 icons by name |
| `Button` | `primary` (one per view), `secondary`, `text`, `danger` |
| `Chip` | Filters and tip categories |
| `RarityBadge` | Tier word plus color |
| `Avatar` | Photo or initials |
| `Sticker` | An album slot, filled or empty |
| `FishLine` | Progress drawn as a fishing line with the bobber |
| `LeaderboardRow` | One person in a ranking |
| `CatchCard` | A catch in a feed |
| `ChallengeCard` | A challenge in a list |
| `PromotionBanner` | The level-up moment |
| `BottomNav` | The phone tab bar with the raised Log button |

## Icons with fixed meanings

| Icon | Meaning |
|---|---|
| `fishing-hook` | The "Fisgou" reaction |
| `fish` | A species or a catch |
| `sparkles` | A new sticker |
| `shield-check` | A protected species |
| `camera` | A photo-checked catch |
| `map-pin` | An approximate place |
| `globe` | Official and public |
| `users` | Groups |
| `trophy` | Challenges and rankings |
| `medal` | Promotions |

## Voice

- Portuguese first, English second; write both at once.
- Speak to the person as "você", friendly and direct.
- Sentence case everywhere. Buttons are infinitive verbs: "Registrar peixe".
- No emoji in the interface.
- Gender-neutral where Portuguese allows: "Promoção! Seu novo cargo é…".
- Errors say what happened and what to do. No "Ops!" and no apologies.
- Metric units only. Places are always a city and state, or a pay-to-fish lake's name.
