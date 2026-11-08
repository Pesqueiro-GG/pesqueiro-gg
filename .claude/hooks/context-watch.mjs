#!/usr/bin/env node
// Claude Code hook (UserPromptSubmit and PostToolUse): an agent can't see how full its
// context is, so this reads the session transcript, takes the token count of the latest
// main-conversation response, and past a threshold tells the agent to save a handoff and
// ask the person to run /clear.
//
// Thresholds (tokens): CLAUDE_CONTEXT_WARN_TOKENS (300000), CLAUDE_CONTEXT_URGENT_TOKENS (350000).
// `--user` is the copy in ~/.claude for every project: it stays quiet in projects that
// have their own copy of this hook, and asks for memory notes instead of /handoff.
//
// Never fails the session: on any error it prints nothing and exits 0.

import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const WARN = Number(process.env.CLAUDE_CONTEXT_WARN_TOKENS || 300_000)
const URGENT = Number(process.env.CLAUDE_CONTEXT_URGENT_TOKENS || 350_000)
const STEP = 25_000 // PostToolUse speaks again only after this many more tokens
const TAIL_BYTES = 8 * 1024 * 1024
const userMode = process.argv.includes('--user')

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

/** Tokens in context at the latest main-conversation response (input + cache + output). */
export function contextTokens(transcriptPath) {
  const size = statSync(transcriptPath).size
  const start = Math.max(0, size - TAIL_BYTES)
  const fd = openSync(transcriptPath, 'r')
  const buf = Buffer.alloc(size - start)
  readSync(fd, buf, 0, buf.length, start)
  closeSync(fd)
  const lines = buf.toString('utf8').split('\n')
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]
    if (!line.includes('"usage"') || !line.includes('"assistant"')) continue
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }
    if (entry.type !== 'assistant' || entry.isSidechain) continue
    const u = entry.message?.usage
    if (!u) continue
    return (
      (u.input_tokens || 0) +
      (u.cache_creation_input_tokens || 0) +
      (u.cache_read_input_tokens || 0) +
      (u.output_tokens || 0)
    )
  }
  return 0
}

function loadState(sessionId) {
  const dir = join(tmpdir(), 'claude-context-watch')
  const file = join(dir, `${String(sessionId).replace(/[^\w-]/g, '_')}.json`)
  let state = { bucket: -1 }
  try {
    state = JSON.parse(readFileSync(file, 'utf8'))
  } catch {}
  return {
    state,
    save: (s) => {
      try {
        mkdirSync(dir, { recursive: true })
        writeFileSync(file, JSON.stringify(s))
      } catch {}
    },
  }
}

function instructions(k, urgent) {
  const save = userMode
    ? 'save what a fresh session would need (the task, decisions made, files touched, what is left, the next step) to your memory directory'
    : 'run the /handoff skill to save the state of this work to .claude/handoff/'
  const ask = `then tell the person: "Context is at ${k}k tokens. I saved where we are; please run /clear and I'll continue from it."`
  return urgent
    ? `Context is at ${k}k tokens, past the ${URGENT / 1000}k limit. Don't start anything new: finish the current edit, ${save} now, ${ask}`
    : `Context is at ${k}k tokens (the warning level is ${WARN / 1000}k). At the next natural stopping point (not mid-edit, and before starting another large step), ${save}, ${ask}`
}

function main() {
  const input = readStdin()
  const event = input.hook_event_name
  if (!input.transcript_path || !existsSync(input.transcript_path)) return
  if (userMode && input.cwd && existsSync(join(input.cwd, '.claude', 'hooks', 'context-watch.mjs'))) return

  const tokens = contextTokens(input.transcript_path)
  if (tokens < WARN) return

  const { state, save } = loadState(input.session_id)
  const bucket = Math.floor(tokens / STEP)
  const urgent = tokens >= URGENT
  // After each prompt, always remind. Between tool calls, only when the count moves up a step.
  if (event === 'PostToolUse' && bucket <= state.bucket) return
  save({ bucket: Math.max(bucket, state.bucket) })

  const k = Math.round(tokens / 1000)
  process.stdout.write(
    JSON.stringify({
      systemMessage: `Context at ${k}k tokens: Claude will save its progress and ask you to run /clear.`,
      hookSpecificOutput: { hookEventName: event, additionalContext: instructions(k, urgent) },
    }),
  )
}

try {
  main()
} catch {}
process.exit(0)
