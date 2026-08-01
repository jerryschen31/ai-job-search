# levels-fyi-cli

CLI for searching jobs on **Levels.fyi**, with salary ranges attached.

**Data source**: `levels.fyi/jobs` + `/jobs/title/<family>`, read from the
server-rendered `__NEXT_DATA__` payload.
**Authentication**: None.
**Dependencies**: None (plain `bun` + `fetch`).

> Levels.fyi has **no free-text search** — filtering is path-based over a fixed
> job-family taxonomy. `--query`/`--location` are local. Attribution is
> required. See `../url-reference.md`.

## Installation

```bash
cd .agents/skills/levels-fyi-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search by job family, with local keyword/location narrowing |
| `detail` | Full detail for one posting (`?jobId=`) |
| `families` | List the job-family taxonomy |

## Quick examples

```bash
bun run src/cli.ts search -f software-engineer --format table
bun run src/cli.ts search -f data-scientist -l "California" --format table
bun run src/cli.ts families engineer
bun run src/cli.ts detail 84665402944037574 --format plain
```

Each result carries `url` (the Levels.fyi posting page) and `applicationUrl`
(the employer's apply link).

## Flags

| Flag | Alias | Server-side? | Description |
|------|-------|--------------|-------------|
| `--family` | `-f` | yes (path) | Job family slug. |
| `--query` | `-q` | no (local) | Keyword narrowing on title/company. |
| `--location` | `-l` | no (local) | Location text filter. |
| `--jobage` | | no (local) | Only postings within N days. |
| `--page` | | — | Output page. Default 1. |
| `--limit` | `-n` | — | Page size. Default 25. |
| `--format` | | — | `json` \| `table` \| `plain`. |
