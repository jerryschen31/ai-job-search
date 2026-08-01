# ashby-cli

CLI for searching jobs across companies hosted on **Ashby**, via Ashby's public
posting API.

**Data source**: `api.ashbyhq.com/posting-api/job-board/<org>` (public JSON API).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` only pulls dev type defs.

Ashby's API is per-organization with no keyword parameter, so `search` fans out
over a curated slug list (`src/companies.ts`) and filters client-side.

## Installation

```bash
cd .agents/skills/ashby-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search across many org boards by keyword/location/remote/age |
| `detail` | Full description for one posting (needs org slug + job id) |
| `companies` | List the curated org slugs |

All errors go to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
bun run src/cli.ts search -q "scientist" --sector biotech --format table
bun run src/cli.ts search -q "machine learning" -c insitro -c benchling --format table
bun run src/cli.ts detail https://jobs.ashbyhq.com/insitro/<job-id> --format plain
```

Each result's `url` is the public `jobs.ashbyhq.com` posting link, so you can
open it to verify the job on the company's own board.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keyword filter; all terms must match. |
| `--location` | `-l` | Filter on the posting's location text. |
| `--company` | `-c` | Org slug. Repeatable. Overrides the curated list. |
| `--sector` | | `biotech` \| `ai` \| `tech`. |
| `--remote` | | Only remote-flagged postings. |
| `--jobage` | | Only postings published within N days. |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Page size. Default 25. |
| `--format` | | `json` \| `table` \| `plain`. |

See `../SKILL.md` and `../url-reference.md` for full details.
