# workday-cli

CLI for searching jobs on **Workday-hosted career sites** (big pharma, biotech,
enterprise) via the public Workday CXS JSON endpoint.

**Data source**: `https://<tenant>.<wd>.myworkdayjobs.com/wday/cxs/<tenant>/<site>/jobs` (POST, JSON).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`).

Unlike the ATS CLIs in this repo, Workday supports **server-side keyword
search**, so `--query` is pushed to the employer rather than filtered locally.

## Installation

```bash
cd .agents/skills/workday-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Keyword search across one or many Workday employers |
| `detail` | Full description for one posting (URL carries tenant/site) |
| `employers` | List curated employers with their career-site URLs |

All errors go to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
bun run src/cli.ts search -q "bioinformatics" --format table
bun run src/cli.ts search -q "bioinformatics" -e roche -l "Santa Clara" --format table
bun run src/cli.ts search -q "engineer" --tenant acme --wd wd5 --site AcmeCareers --format table
bun run src/cli.ts detail "https://roche.wd3.myworkdayjobs.com/roche-ext/job/..." --format plain
```

Each result's `url` is the public career-site posting link (identical to
Workday's own `externalUrl`), so you can open it to verify the job.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keyword search, sent server-side. |
| `--location` | `-l` | Filter results on location text. |
| `--employer` | `-e` | Employer key. Repeatable. |
| `--sector` | | `pharma` \| `biotech` \| `tech`. |
| `--jobage` | | Only postings within N days (approximate). |
| `--tenant`/`--wd`/`--site` | | Ad-hoc Workday site; all three required together. |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Page size. Default 25 (Workday fetches 20/request internally). |
| `--format` | | `json` \| `table` \| `plain`. |

See `../SKILL.md` and `../url-reference.md` for full details.
