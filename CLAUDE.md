@AGENTS.md
@docs/reference/code-conventions.md

## Claude-specific notes

- For items sized L, or anything touching `gamification`, `logbook` privacy or visibility rules, plan first and show the plan before editing files.
- When working on `species-id`, read the current Anthropic documentation (or the claude-api skill) for image input and structured outputs before writing the call.
- Run `npm run lint`, `npm run typecheck` and the relevant tests before saying something is done, and report failures as they are.
- Don't push, merge or change GitHub settings unless asked.
