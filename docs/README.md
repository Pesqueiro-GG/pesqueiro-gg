# Pesqueiro.GG documentation

This documentation follows [Diátaxis](https://diataxis.fr), which splits docs by what the reader needs at that moment. Pick the section that matches your goal.

| You want to… | Read |
|---|---|
| learn the project by doing something end to end | [Tutorials](#tutorials) |
| get a specific task done | [How-to guides](#how-to-guides) |
| look up an exact fact: a table, a rule, a variable | [Reference](#reference) |
| understand why something works the way it does | [Explanation](#explanation) |

## Tutorials

Step-by-step lessons for someone new to the project.

- [Tutorials overview](tutorials/README.md): what's coming and when.

## How-to guides

Directions for a specific task, for someone who already knows the basics.

- [Pick up a backlog item](how-to/pick-up-a-backlog-item.md)
- [Sync the board with the backlog files](how-to/sync-the-board.md)
- [Release to production](how-to/release-to-production.md)
- [Fix production with a hotfix](how-to/hotfix-production.md)
- [Apply migrations to a cloud database](how-to/apply-migrations-to-a-cloud-database.md)

Planned with their backlog items: reset the demo ([#52](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/52)), handle an incident ([#42](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/42)).

## Reference

Exact descriptions of the system, kept in sync with the code.

- [Code conventions](reference/code-conventions.md): layout, server actions, events, database, privacy rules, languages, tests, error codes.
- [Data model](reference/data-model.md): every table, who owns it, and its indexes.
- [XP, levels and rarity](reference/xp-and-levels.md): rules, numbers, career titles, challenge templates.
- [Environments](reference/environments.md): branches, environments, environment variables, secrets.
- [Design system](reference/design-system.md): tokens, fonts, components, voice.
- [Observability](reference/observability.md): tools, targets and alerts.
- [Glossary](reference/glossary.md): fishing, product and technical terms, including the Portuguese ones in the interface.

## Explanation

Background and reasoning, for when you want to understand the design.

- [Product](explanation/product.md): problem, audience, journeys, scope.
- [Architecture](explanation/architecture.md): the modular monolith, its modules and data flows.
- [Gamification](explanation/gamification.md): why the XP engine replays instead of counting.
- [Privacy and trust](explanation/privacy-and-trust.md): location privacy, visibility, proof levels, moderation.
- [Feeds and the path to scale](explanation/scaling.md): how feeds work now and how they grow.
- [Decision records](explanation/decisions/README.md): each major decision, its alternatives and why.

## Design source files

- [`design/`](../design/README.md) holds the design system: tokens, brand book, component guidelines and a working prototype of each component.

## Not part of the docs

- [`backlog/`](backlog/README.md) holds the work items synced to the [project board](https://github.com/orgs/Pesqueiro-GG/projects/1). It's the work plan, not documentation of the system.
