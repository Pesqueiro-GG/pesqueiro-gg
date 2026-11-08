---
name: handoff
description: Save the state of the current work to .claude/handoff/<branch>.md so a fresh session can continue after /clear. Use when the context-watch message says the context is large, before a /clear, or when the person asks to save progress or hand off.
---

# Save a handoff

A new session starts with nothing but the repository. Write what it needs to continue without rereading this conversation; the `SessionStart` hook loads the file for the same branch.

## Write it

1. Find the branch: `git rev-parse --abbrev-ref HEAD`. The file is `.claude/handoff/<branch>.md`, with every character other than letters, digits, `.`, `_` and `-` replaced by `__` (so `feat/s-09-log-a-catch` becomes `feat__s-09-log-a-catch.md`).
2. Collect the facts: `git status --short`, `git log --oneline dev..HEAD`, and the pull request if one exists (`gh pr view --json number,url,state`).
3. Write the file with these sections, in under 80 lines:

```markdown
# Handoff: <item ID and title, or the task in one line>

**Branch** <branch> · **Last commit** <short sha and subject> · **Pull request** <link or "none">

## Goal
<What done looks like; link the issue.>

## Done
- <Each finished piece, with the files it touched.>

## Decisions
- <Each choice made and why, including what the person asked for or ruled out in this session.>

## Waiting on the person
- <Questions asked and not answered, approvals pending (push, merge, setup). "Nothing" if none.>

## Next step
<One concrete action, for example "Make `rankingDelta` pass `tests/integration/ranking.int.test.ts`".>

## Watch out
- <Commands that failed and their fix, traps found in the code, uncommitted changes.>
```

## Rules

- No secrets, tokens, connection strings or personal data.
- Facts the whole team needs (a rule, a command, a changed table) belong in `docs/` in the pull request, not only here. Add them to the branch, then mention them under **Done**.
- A preference of the person's that applies beyond this branch goes to Claude's memory as well.

## Then

Tell the person, in one line, that the handoff is saved at that path and that they can run `/clear`; the next session picks it up.
