# greenhouse-cli

CLI for searching jobs across companies hosted on **Greenhouse**, via Greenhouse's
public job-board API.

**Data source**: `boards-api.greenhouse.io/v1/boards/<token>/jobs` (documented public API, JSON).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

Greenhouse's API is per-company with no keyword parameter, so `search` fans out
over a curated token list (`src/companies.ts`) and filters client-side.

## Installation

```bash
cd .agents/skills/greenhouse-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search across many company boards by keyword/location/sector/age |
| `detail` | Full description for one posting (needs board token + job id) |
| `companies` | List the curated board tokens |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors go to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Bioinformatics across the curated biotech boards
bun run src/cli.ts search -q "bioinformatics" --sector biotech --format table

# Two specific companies, last 14 days
bun run src/cli.ts search -q "engineer" -c anthropic -c databricks --jobage 14 --format table

# One posting in full
bun run src/cli.ts detail https://job-boards.greenhouse.io/natera/jobs/6130549004 --format plain
```

Each result's `url` is the canonical public posting URL on
`job-boards.greenhouse.io`, so you can open it to verify the job on the
company's own board.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keyword filter (title/department/company); all terms must match. |
| `--location` | `-l` | Filter on the posting's location text. |
| `--company` | `-c` | Specific board token. Repeatable. Overrides the curated list. |
| `--sector` | | `biotech` \| `ai` \| `tech` — restricts the curated list. |
| `--jobage` | | Only postings published within N days. |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Page size. Default 25. |
| `--format` | | `json` \| `table` \| `plain`. |

See `../SKILL.md` for the full reference and `../url-reference.md` for API details.
