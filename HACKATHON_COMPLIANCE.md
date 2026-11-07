# Hack Brasil 2026 compliance

This file records how this repository meets the [Hack Brasil 2026 regulation](https://hackbrasil.com/regulamento). The team updates it as dependencies, services and assets are added. The final version is completed before submission ([#54](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/54)).

## Repository

| Item | Value |
|---|---|
| Repository | [Pesqueiro-GG/pesqueiro-gg](https://github.com/Pesqueiro-GG/pesqueiro-gg) |
| Organization created | 7 Nov 2026, 18:57 UTC (15:57 BRT) |
| Repository created | 7 Nov 2026, 19:00 UTC (16:00 BRT) |
| Event start (opening session ended) | 4 Nov 2026, 21:00 BRT |
| Visibility | Public, kept public at least until 15 Dec 2026 |
| License | MIT, so jurors can read, run and test the code |
| Imported history | None. The repository started empty and every commit was made after the event started. |

To verify the commit timeline, run:

```bash
git log --reverse --format='%h %ad %an %s' --date=iso | head
```

## Relationship to earlier work

Item 6.2 of the regulation allows a project to continue an idea or product that existed before the event, as long as no code from before the event is copied into the submitted repository.

- Pesqueiro.GG continues the **idea** of an earlier private app built by two of the same authors for their fishing group ([`Kauecsilva/pesqueiro.gg`](https://github.com/Kauecsilva/pesqueiro.gg)).
- That app was used only to understand the product: its features, what the group used, and what to change.
- **No code, SQL, prompts, styles or assets were copied** from it. The architecture, data model, design system and every file in this repository were created after the event started.
- The logo concept (a fishing bobber) continues, but the artwork was redrawn from scratch for this repository.
- The product's name, career-title joke and the idea of a species ranking are product ideas, not code.

## Dependencies and licenses

Production dependencies and their licenses. Filled in as each dependency is added; the final table is generated with `npx license-checker --production --summary`.

| Dependency | Version | License | Used for |
|---|---|---|---|
| next | 16.4.5 | MIT | Web framework |
| react, react-dom | 19.3.1 | MIT | User interface |
| zod | 4.6.7 | MIT | Input validation |

Development tools (not shipped to users): TypeScript 6.0.3 (Apache-2.0), ESLint 10.14.0 and eslint-config-next 16.4.5 (MIT), eslint-config-prettier 10.1.8 (MIT), Prettier 3.9.10 (MIT), Vitest 5.1.0 and Vite 8.3.6 (MIT), Playwright 1.65.0 (Apache-2.0), @types/node, @types/react, @types/react-dom (MIT).

## External services

| Service | Used for | Plan |
|---|---|---|
| GitHub | Code, issues, project board, Actions | Free |
| Vercel | Hosting (São Paulo region) | Free (Hobby) |
| Supabase | Login, Postgres, photo storage (São Paulo region) | Free |
| Anthropic API (Claude Haiku 5.5) | Species suggestion from photos | Paid per use, with a monthly cap |
| Sentry | Errors, traces and logs | Free |
| Resend | Sign-up and password emails | Free |
| UptimeRobot or Better Stack | Uptime checks | Free |
| Healthchecks.io | Daily job heartbeat | Free |
| Discord | Team alerts | Free |

## Assets

| Asset | Source | License |
|---|---|---|
| Logo and app icon | Drawn for this project | MIT (this repository) |
| Icons | [Lucide](https://lucide.dev) 1.60.0 | ISC |
| Fonts | Big Shoulders Display and Atkinson Hyperlegible from Google Fonts | SIL Open Font License 1.1 |
| Brazilian municipalities | IBGE public data ([#11](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/11)) | To be recorded when imported |
| Demo photos | To be added with the demo seed ([#52](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/52)) | Team-owned or openly licensed, each credited here |

## AI tools

The regulation allows and recommends AI tools. The team uses Claude Code and other coding assistants. All generated code is reviewed by the team, and the repository-originality rules above apply to it like any other code.

## Submission

| Item | Value |
|---|---|
| Track | Cultura & Economia Criativa |
| Demo URL | Added in M6 |
| Demo login for jurors | Added in M6 |
| Video (up to 3 minutes, no login needed) | Added in M6 |

## Status at submission

Filled in before submission: what's working, what's incomplete, and what's planned. Mock or seeded functionality is labeled as such.
