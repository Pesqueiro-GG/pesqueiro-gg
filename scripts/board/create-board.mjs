#!/usr/bin/env node
// Seeds the GitHub board from seed-backlog.json: labels, milestones, a Projects board with
// custom fields, and one issue per story or task. Safe to run again: existing labels,
// milestones, fields and issues (matched by title) are reused, not duplicated.
//
// Usage:
//   node scripts/board/create-board.mjs --dry-run
//   node scripts/board/create-board.mjs --repo <org>/<repo>
//   node scripts/board/create-board.mjs --repo <org>/<repo> --sync   (copy docs/backlog/*.md into issue bodies)
//
// Needs the GitHub CLI logged in with the "project" scope: gh auth refresh -s project

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const dryRun = flag('dry-run');
const repo = value('repo');
const seed = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'seed-backlog.json'), 'utf8'));

const WS = { A: 'A · Platform', B: 'B · Gamification', C: 'C · Social', all: 'All' };
const WS_LABEL = { A: 'ws: A platform', B: 'ws: B gamification', C: 'ws: C social', all: 'ws: all' };
const PRIORITY = { must: 'Must', should: 'Should', could: 'Could' };

validate(seed);
const backlogDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'backlog');
const sections = readSections(backlogDir);
checkSections(seed, sections);

if (dryRun) {
  printPlan(seed);
  console.log(`\nBacklog sections: ${Object.keys(sections).length} found in docs/backlog, all matching the seed.`);
  process.exit(0);
}
if (!repo || !repo.includes('/')) fail('Pass --repo <org>/<repo>, or --dry-run to preview.');
const owner = repo.split('/')[0];

const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghJson = (...a) => JSON.parse(gh(...a) || 'null');

if (flag('assign')) {
  // Assigns each issue to its workstream's owners. People who haven't accepted the
  // organization invite can't be assigned yet: they're skipped and listed, so run it again later.
  const issues = ghJson('issue', 'list', '-R', repo, '--state', 'all', '--limit', '500', '--json', 'number,title,assignees');
  const canAssign = {};
  const assignable = (login) => {
    if (!(login in canAssign)) {
      try { gh('api', `repos/${repo}/assignees/${login}`); canAssign[login] = true; } catch { canAssign[login] = false; }
    }
    return canAssign[login];
  };
  let added = 0;
  for (const it of seed.items) {
    const issue = issues.find((i) => i.title.startsWith(`${it.id} `));
    if (!issue) fail(`No issue found for ${it.id}`);
    const have = new Set(issue.assignees.map((a) => a.login));
    const want = (seed.owners[it.ws] || []).filter((l) => !have.has(l) && assignable(l));
    if (!want.length) continue;
    gh('issue', 'edit', String(issue.number), '-R', repo, ...want.flatMap((l) => ['--add-assignee', l]));
    added += want.length;
    console.log(`  #${issue.number} ${it.id} → ${want.join(', ')}`);
  }
  const skipped = Object.entries(canAssign).filter(([, ok]) => !ok).map(([l]) => l);
  console.log(`assigned ${added}${skipped.length ? `; skipped (no repo access yet): ${skipped.join(', ')}` : ''}`);
  process.exit(0);
}

if (flag('sync')) {
  const issues = ghJson('issue', 'list', '-R', repo, '--state', 'all', '--limit', '500', '--json', 'number,title');
  const numberOf = {};
  for (const it of seed.items) {
    const found = issues.find((i) => i.title.startsWith(`${it.id} `));
    if (!found) fail(`No issue found for ${it.id}; run without --sync first.`);
    numberOf[it.id] = found.number;
  }
  const dir = mkdtempSync(join(tmpdir(), 'backlog-'));
  try {
    for (const it of seed.items) {
      const { file, text } = sections[it.id];
      const resolved = text.replace(/\{\{([A-Z]-\d{2})\}\}/g, (m, id) => (numberOf[id] ? `${id} #${numberOf[id]}` : m));
      const bodyText = `${resolved.trim()}\n\n---\n_Source: \`docs/backlog/${file}\`. Edit it there, then run \`node scripts/board/create-board.mjs --repo ${repo} --sync\`._\n`;
      const path = join(dir, `${it.id}.md`);
      writeFileSync(path, bodyText);
      gh('issue', 'edit', String(numberOf[it.id]), '-R', repo, '--body-file', path);
      console.log(`  synced ${it.id} → #${numberOf[it.id]}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`synced ${seed.items.length} issue bodies from docs/backlog`);
  process.exit(0);
}

// 1. Labels
for (const l of seed.labels) {
  gh('label', 'create', l.name, '--color', l.color, '--description', l.description, '--force', '-R', repo);
}
console.log(`labels: ${seed.labels.length} ensured`);

// 2. Milestones (due at noon UTC so the date shows the same in Brazil)
const existingMs = ghJson('api', `repos/${repo}/milestones?state=all&per_page=100`);
const msNumber = {};
for (const m of seed.milestones) {
  const found = existingMs.find((x) => x.title === m.title);
  if (found) { msNumber[m.id] = found.number; continue; }
  const created = ghJson('api', '-X', 'POST', `repos/${repo}/milestones`, '-f', `title=${m.title}`, '-f', `description=${m.description}`, '-f', `due_on=${m.due}T12:00:00Z`);
  msNumber[m.id] = created.number;
}
console.log(`milestones: ${seed.milestones.length} ensured`);

// 3. Project
const projects = ghJson('project', 'list', '--owner', owner, '--format', 'json', '--limit', '100');
let project = projects.projects.find((p) => p.title === seed.project.title);
if (!project) project = ghJson('project', 'create', '--owner', owner, '--title', seed.project.title, '--format', 'json');
const projectNumber = String(project.number);
try { gh('project', 'link', projectNumber, '--owner', owner, '--repo', repo.split('/')[1]); } catch { /* already linked */ }
const projectId = ghJson('project', 'view', projectNumber, '--owner', owner, '--format', 'json').id;
console.log(`project: #${projectNumber} "${seed.project.title}"`);

// 4. Custom fields
let fields = ghJson('project', 'field-list', projectNumber, '--owner', owner, '--format', 'json', '--limit', '50').fields;
for (const [name, options] of Object.entries(seed.fields)) {
  if (fields.some((f) => f.name === name)) continue;
  gh('project', 'field-create', projectNumber, '--owner', owner, '--name', name, '--data-type', 'SINGLE_SELECT', '--single-select-options', options.join(','));
}
fields = ghJson('project', 'field-list', projectNumber, '--owner', owner, '--format', 'json', '--limit', '50').fields;
const option = (fieldName, optionName) => {
  const f = fields.find((x) => x.name === fieldName);
  const o = f?.options?.find((x) => x.name === optionName);
  if (!f || !o) fail(`Field option not found: ${fieldName} = ${optionName}`);
  return { fieldId: f.id, optionId: o.id };
};
console.log(`fields: ${Object.keys(seed.fields).join(', ')}`);

// 5. Issues, added to the project with their fields
const existingIssues = ghJson('issue', 'list', '-R', repo, '--state', 'all', '--limit', '500', '--json', 'number,title,url');
const msTitle = Object.fromEntries(seed.milestones.map((m) => [m.id, m.title]));
let created = 0;
for (const item of seed.items) {
  const title = `${item.id} ${item.title}`;
  let issue = existingIssues.find((i) => i.title === title);
  if (!issue) {
    const labelArgs = [item.type === 'story' ? 'type: story' : 'type: task', WS_LABEL[item.ws], item.priority, ...(item.labels || [])].flatMap((l) => ['--label', l]);
    const msArgs = item.milestone ? ['--milestone', msTitle[item.milestone]] : [];
    const url = gh('issue', 'create', '-R', repo, '--title', title, '--body', body(item), ...labelArgs, ...msArgs);
    issue = { url };
    created++;
  }
  const added = ghJson('project', 'item-add', projectNumber, '--owner', owner, '--url', issue.url, '--format', 'json');
  const set = (fieldName, optionName) => {
    const { fieldId, optionId } = option(fieldName, optionName);
    gh('project', 'item-edit', '--id', added.id, '--project-id', projectId, '--field-id', fieldId, '--single-select-option-id', optionId);
  };
  set('Workstream', WS[item.ws]);
  set('Priority', PRIORITY[item.priority]);
  set('Size', item.size);
  set('Journey', item.journey);
  console.log(`  ${title}`);
}
console.log(`issues: ${created} created, ${seed.items.length - created} already existed`);
console.log('Done. In the project, add "In review" and "On Dev" to the Status field, then make board, table and roadmap views.');

// ---------- helpers ----------
function body(item) {
  const lines = [];
  if (item.story) lines.push('**Story**', '', item.story, '');
  if (item.summary) lines.push('**Summary**', '', item.summary, '');
  lines.push('**Acceptance criteria**', '', ...item.acceptance.map((a) => `- [ ] ${a}`), '');
  lines.push(`**Milestone** ${item.milestone ?? 'unscheduled'} · **Workstream** ${WS[item.ws]} · **Priority** ${PRIORITY[item.priority]} · **Size** ${item.size} · **Journey** ${item.journey}`, '');
  lines.push('_Seeded from `scripts/board/seed-backlog.json`. Design context lives in `docs/`._');
  return lines.join('\n');
}

function validate(s) {
  const ids = new Set();
  const ms = new Set(s.milestones.map((m) => m.id));
  for (const it of s.items) {
    if (ids.has(it.id)) fail(`Duplicate id ${it.id}`);
    ids.add(it.id);
    if (it.milestone !== null && !ms.has(it.milestone)) fail(`${it.id}: unknown milestone ${it.milestone}`);
    if (!WS[it.ws]) fail(`${it.id}: unknown workstream ${it.ws}`);
    if (!PRIORITY[it.priority]) fail(`${it.id}: unknown priority ${it.priority}`);
    if (!s.fields.Size.includes(it.size)) fail(`${it.id}: unknown size ${it.size}`);
    if (!s.fields.Journey.includes(it.journey)) fail(`${it.id}: unknown journey ${it.journey}`);
    if (!it.story && !it.summary) fail(`${it.id}: needs a story or a summary`);
    if (!it.acceptance?.length) fail(`${it.id}: needs acceptance criteria`);
  }
}

function printPlan(s) {
  console.log(`Project: ${s.project.title}`);
  console.log(`Labels: ${s.labels.length} · Milestones: ${s.milestones.length} · Fields: ${Object.keys(s.fields).join(', ')}`);
  for (const m of [...s.milestones.map((x) => x.id), null]) {
    const items = s.items.filter((i) => i.milestone === m);
    if (!items.length) continue;
    console.log(`\n${m ?? 'Unscheduled'} (${items.length})`);
    for (const i of items) console.log(`  ${i.id.padEnd(5)} ${i.priority.padEnd(6)} ${i.ws.padEnd(3)} ${i.size}  ${i.title}`);
  }
  const by = (k) => Object.entries(s.items.reduce((a, i) => ((a[i[k]] = (a[i[k]] || 0) + 1), a), {})).map(([x, n]) => `${x}: ${n}`).join(' · ');
  console.log(`\nTotal ${s.items.length} · by workstream ${by('ws')} · by priority ${by('priority')} · by size ${by('size')}`);
}

// Splits docs/backlog/*.md into sections keyed by item id, using <!-- item: ID --> markers.
// The section's own "## ID · Title" heading is dropped (the issue title already has it).
function readSections(dir) {
  const out = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
    const text = readFileSync(join(dir, file), 'utf8');
    const parts = text.split(/<!-- item: ([A-Z]-\d{2}) -->/);
    for (let i = 1; i < parts.length; i += 2) {
      const id = parts[i];
      if (out[id]) fail(`Section ${id} appears twice (in ${out[id].file} and ${file})`);
      const body = parts[i + 1].replace(/\n---\s*$/m, '').replace(/^\s*## [^\n]*\n/, '');
      out[id] = { file, text: body.replace(/\n---\s*\n*$/, '').trim() };
    }
  }
  return out;
}

function checkSections(s, secs) {
  const ids = new Set(s.items.map((i) => i.id));
  for (const id of ids) if (!secs[id]) fail(`docs/backlog has no section for ${id}`);
  for (const id of Object.keys(secs)) if (!ids.has(id)) fail(`docs/backlog has a section for unknown item ${id}`);
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}
