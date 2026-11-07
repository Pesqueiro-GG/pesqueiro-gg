# Backlog

Every item on the [project board](https://github.com/orgs/Pesqueiro-GG/projects/1) is written here first, one section per item, grouped by milestone (`M0.md` … `M6-M7.md`, `could.md`). A script copies each section into its GitHub issue. See [Sync the board with the backlog files](../how-to/sync-the-board.md).

Edit the Markdown here, not the issue body on GitHub: the next sync overwrites issue bodies. Track checkbox progress in the pull request.

In a section, `{{S-09}}` becomes a link to that item's issue when synced.

Every item assumes the [code conventions](../reference/code-conventions.md). To start one, follow [Pick up a backlog item](../how-to/pick-up-a-backlog-item.md).

## Board columns

| Status | Meaning | Moves when |
|---|---|---|
| Backlog | Planned, not ready to start | Its dependencies are merged into `dev` → Todo |
| Todo | Ready to start | Someone starts it and opens a branch → In Progress |
| In Progress | Being worked on | A pull request into `dev` is opened → Review |
| Review | Pull request waiting for review | Merged into `dev` and checked on the Dev environment → Done |
| Done | Merged and checked on Dev | — |

## Item IDs

| Prefix | Meaning |
|---|---|
| `T-` | Task: technical or team work without a user story |
| `S-` | Story (a few are tasks too; the `type:` label is authoritative) |
| `C-` | Could-have: only with spare time, no milestone |

## Section format

```markdown
<!-- item: S-09 -->
## S-09 · Title

**Type** … · **Milestone** … · **Workstream** … · **Priority** … · **Size** …
**Depends on** {{S-03}} · **Blocks** {{S-13}}

### Story | Summary
### Context
### Scope
### Implementation notes
### Acceptance criteria
### Tests
```

The `<!-- item: ID -->` marker must stay: the sync script splits files on it.
