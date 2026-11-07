# Pesqueiro.GG brand book

Pesqueiro.GG is a gamified social network for recreational anglers in Brazil. Every catch counts: it fills a sticker in the angler's species album, moves their group's season ranking, and becomes part of their region's fishing story. The interface is a fishing trip, not a dashboard: calm water around bright moments of reward.

## Principles

- **The catch is the hero.** Photos and species names lead; interface chrome stays quiet so the fish stands out.
- **Celebrate fishing, not scrolling.** Gold, motion and the sea appear only when someone caught something: a new sticker, a promotion, a challenge result.
- **Readable at the water's edge.** People use this on a phone in bright sun, sometimes with wet hands. High contrast, large type, 44px targets.
- **Humor in the moments, calm in the tools.** The career jokes live in promotions and profiles. Forms, settings and privacy texts are plain.
- **Privacy you can see.** Places always show as a city or region; the interface never displays coordinates of another person's catch.

## Voice and copy

- Portuguese (Brazil) first, English second. Write both at once; never ship a screen in one language only.
- Speak to the person as "você", in a friendly, direct tone, like a fishing buddy who knows the rules.
- Sentence case everywhere. Buttons are infinitive verbs: "Registrar peixe", "Criar desafio", "Compartilhar".
- No emoji in the interface. Icons do that job. Emoji are fine in push notification titles and shared-link text.
- Numbers use the language's format: "2,4 kg" and "1.240 XP" in Portuguese, "2.4 kg" and "1,240 XP" in English. Metric units only.
- Keep copy gender-neutral where Portuguese allows: "Promoção! Seu novo cargo é" instead of "Você foi promovido".
- Errors say what happened and what to do: "Essa foto passou de 20 MB. Escolha outra ou tire um print." Never "Ops!" or apologies.

| Moment | Portuguese | English |
| --- | --- | --- |
| Main action | Registrar peixe | Log a catch |
| New sticker | Figurinha nova! Tucunaré-açu entrou no seu álbum. | New sticker! Tucunaré-açu is in your album. |
| Promotion | Promoção! Seu novo cargo é Pescador Pleno | Promotion! Your new position is Mid-level Angler |
| Reaction | Fisgou | Hooked |
| Overtaken | Amanda passou você no ranking da Turma do Tietê. | Amanda passed you in Turma do Tietê's ranking. |
| Empty album slot | Ainda não pescado | Not caught yet |
| Place | Igaratá, SP | Igaratá, SP |

## Career titles

Levels carry the original Pesqueiro.GG joke: your fishing career as a corporate ladder. Show the title under names in rankings and on profiles; announce each one with `PromotionBanner`.

| Level | Portuguese (masculine) | Portuguese (feminine) | English |
| --- | --- | --- | --- |
| 1 | Jovem Aprendiz | Jovem Aprendiz | Young Apprentice |
| 2 | Estagiário | Estagiária | Intern |
| 3 | Pescador Júnior | Pescadora Júnior | Junior Angler |
| 4 | Pescador Pleno | Pescadora Plena | Mid-level Angler |
| 5 | Pescador Sênior | Pescadora Sênior | Senior Angler |
| 6 | Especialista em Anzol | Especialista em Anzol | Hook Specialist |
| 7 | Coordenador de Cardume | Coordenadora de Cardume | Shoal Coordinator |
| 8 | Gerente de Águas | Gerente de Águas | Waters Manager |
| 9 | Diretor de Pescaria | Diretora de Pescaria | Fishing Director |
| 10+ | CEO dos Mares | CEO dos Mares | CEO of the Seas |

Each person picks the form of their title in their profile (masculine or feminine, asked at sign-up and changeable later). Everyone else sees the title in the form its owner chose. English has one form.

## Color

- Ground every screen in `bg`; put content on `surface` cards. Use `surface-sunken` for wells and pressed states.
- `bobber` is the one primary action per view and the Log button. It never means "error" by itself; errors use `bobber-text` on `bobber-soft` with an icon and words.
- `water` is the brand's second color: links, the active tab, selected states and your own row (`water-soft`). `link` is an alias of it.
- `gold` is for awards only: first place, new stickers, promotions, official challenges. Gold text is `gold-text`; text on a gold fill is `on-gold`.
- `reed` means released fish, success and protected species.
- The album page is `paper` with `paper-ink` text; stickers sit on it in `surface`.
- Rarity uses `rarity-comum`, `rarity-incomum` (alias of `reed`), `rarity-raro` (alias of `water`) and `rarity-epico`, always with the tier word beside the color.
- The logo's bobber uses `bobber`, `mark-cream` and `mark-band`; the last two are fixed in both themes.
- Sea moments use `sea-shallow` with `sea-deep` silhouettes.
- Text on a filled color always uses its `on-` token, never a literal white: `on-bobber` is dark in the dark theme.
- Both themes, Light and Dark, are complete. Follow the device setting by default and offer a manual choice in Settings.

## Typography

- Two families from Google Fonts. Load them with `next/font/google` in the app.
- `display` is Big Shoulders Display: condensed and bold, like sticker-album lettering and scoreboards. Use it only for titles, species names, numbers and the wordmark (`display-xl`, `display`, `title`, `stat`, `sticker-no`).
- `body` is Atkinson Hyperlegible, designed for legibility: `heading`, `body`, `small`, `label`, `caption`.
- One `display` title per screen. Species names on cards use `title`.
- Numbers people compare (XP, positions, weights) use tabular figures.
- Nothing smaller than `caption` (12px). Body text is never below 16px.

## Spacing and layout

- 4px base: `space-1` to `space-12`. Use `gap` on flex and grid rows rather than margins.
- Phones first: one column, `space-4` side gutters, content no wider than `content-max` (640px).
- From 1024px, add a side rail for navigation and the group ranking; the main column stays the same width.
- Every tappable thing is at least `tap-min` (44px) in both directions.
- The bottom bar adds the safe-area inset to its padding; the Log button rises above the bar.

## Shape and elevation

- Rounded like river stones: `radius-md` for cards, `radius-lg` for sheets and the album page, `radius-full` for buttons, chips, badges and avatars, `radius-sticker` for stickers.
- Flat by default. Cards get `shadow-card`, a hairline lift. Only things that float get `shadow-float`. Stickers get `shadow-sticker`.
- Keyboard focus is `focus-ring` on every control: a 2px gap and 2px of solid water blue.

## Imagery and the sea

- Catch photos are 4:3, full card width, cropped to cover. Never stretch, never add filters.
- Without a photo, show the `sea-shallow` placeholder with the fish silhouette in `sea-deep`.
- The animated sea (swimming fish, bubbles, ripples) appears only in sea moments: the reward screen after logging a catch, the album, onboarding and empty states. Feeds, forms and settings stay calm, for focus and for battery life.
- No stock photos. Demo content uses the team's own photos or openly licensed ones, credited.

## Motion

- Interface transitions: 150ms ease-out for color and position.
- The logo bobber dips on hover, like a fish biting.
- The reward sequence after a catch: the sticker drops onto the album page, the sheen crosses Raro and Épico stickers, XP counts up, then the ranking change shows. Under one and a half seconds in total, and it can be skipped with a tap.
- Respect reduced motion: no sea animation, no sheen sweep, no count-up; show the end state.

## Iconography

- Lucide 1.60.0 (ISC license), via `lucide-react` in the app; the `Icon` component and the Icons group hold the set in use.
- 24px grid, 2px stroke, drawn in the current text color. Default 20px, 16px in chips and badges, 22px in the bottom bar.
- Fixed meanings: `fishing-hook` is the "Fisgou" reaction, `fish` a species or catch, `sparkles` a new sticker, `shield-check` a protected species, `camera` a photo-checked catch, `map-pin` an approximate place, `globe` official and public, `users` groups, `trophy` challenges and rankings, `medal` promotions.
- The SVG files in the Icons group draw with `currentColor`, so inside an `<img>` they render black. Inline them or use `lucide-react` to color them.

## The album and rarity

- The Álbum de Espécies is the product's signature screen: a paper album page (`paper`) with numbered slots, filled stickers and dashed empty slots.
- Rarity comes from the species catalog: Comum, Incomum, Raro, Épico. Protected species show "Protegida" with the shield icon instead of a tier.
- Comum and Incomum stickers are matte. Raro stickers get a sheen; Épico stickers get the sheen and a gold edge.
- A new sticker carries the gold "Nova" flag the first time the angler sees it.

## Accessibility

- Every text color meets 4.5:1 on the grounds its usage note names, in both themes. Borders that carry meaning (`line-strong`, `paper-line`) and the focus ring meet 3:1.
- Never use color alone: rarity shows its word, ranking movement has a tooltip, errors carry an icon and text.
- All interactive elements are reachable by keyboard and show `focus-ring`.
- Icon-only controls (share, the Log button) have accessible names.
- Respect reduced motion and the device's text size.

## Components

`Logo`, `Icon`, `Button`, `Chip`, `RarityBadge`, `Avatar`, `Sticker`, `FishLine`, `LeaderboardRow`, `CatchCard`, `ChallengeCard`, `PromotionBanner` and `BottomNav` live in `components/bundle.js` as `window.PesqueiroGG`, styled by `components/bundle.css`, and expect React 18 on the page. They show the intended look and behavior; the production app rebuilds them in its own codebase from these tokens.

The `Sticker`, `FishLine`, `LeaderboardRow`, `CatchCard`, `ChallengeCard` and `PromotionBanner` components are specific to Pesqueiro.GG and define the product's identity: keep their structure when building screens.
