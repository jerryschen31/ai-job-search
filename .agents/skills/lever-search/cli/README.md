# lever-cli

CLI for searching jobs across companies hosted on **Lever**, via Lever's public
postings API.

**Data source**: `api.lever.co/v0/postings/<org>?mode=json` (public JSON API).
**Authentication**: None required. `api.lever.co/robots.txt` is `Allow: /`.
**Dependencies**: None (plain `bun` + `fetch`).

Lever's API is per-organization with no keyword parameter, so `search` fans out
over a curated slug list (`src/companies.ts`) and filters client-side.

## Installation

```bash
cd .agents/skills/lever-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search across org boards by keyword/location/age |
| `detail` | Full description for one posting |
| `companies` | List the curated org slugs |

All errors go to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
bun run src/cli.ts search -q "software engineer" --format table
bun run src/cli.ts search -q "engineer" -c zoox -c palantir --jobage 30 --format table
bun run src/cli.ts detail https://jobs.lever.co/zoox/<posting-id> --format plain
```

Each result's `url` is the public `jobs.lever.co` posting link, so you can open
it to verify the job on the company's own board.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keyword filter on title/department/team/company. |
| `--location` | `-l` | Filter on the posting's location text. |
| `--company` | `-c` | Org slug. Repeatable. Overrides the curated list. |
| `--sector` | | `biotech` \| `ai` \| `tech`. |
| `--jobage` | | Only postings created within N days. |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Page size. Default 25. |
| `--format` | | `json` \| `table` \| `plain`. |

See `../SKILL.md` and `../url-reference.md` for full details.
