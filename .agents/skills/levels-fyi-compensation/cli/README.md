# levels-fyi-compensation-cli

CLI for salary benchmarking via **Levels.fyi's LLM-readable markdown routes**.

**Data source**: `levels.fyi/companies/<co>/salaries[.../<role>].md` and
`levels.fyi/t/<family>[/locations/<loc>].md` — the `.md` endpoints Levels.fyi
documents for agent access in `robots.txt` / `llms.txt`.
**Authentication**: None.
**Dependencies**: None (plain `bun` + `fetch`).

> **Attribution is mandatory.** Levels.fyi requires
> `Data source: Levels.fyi (https://www.levels.fyi)` on any derived work.
> Every output carries it. Licence: https://www.levels.fyi/offerings/data/

## Installation

```bash
cd .agents/skills/levels-fyi-compensation/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `company <slug>` | Compensation at one company (`--role` to narrow) |
| `role <family>` | Compensation for a job family (`--location` to scope) |
| `export` | Emit `salary_data.json` for this repo's salary tool |
| `families` | List the job-family taxonomy |

## Quick examples

```bash
bun run src/cli.ts company roche --role software-engineer --format table
bun run src/cli.ts role software-engineer --location san-francisco-bay-area --format table
bun run src/cli.ts company genentech --format markdown
bun run src/cli.ts export --company roche --company gilead --out salary_data.json
```

Every result includes `sourceUrl` — the Levels.fyi page to verify figures against.

## Flags

| Flag | Alias | Applies to | Description |
|------|-------|-----------|-------------|
| `--role` | `-r` | company, export | Job-family slug. |
| `--location` | `-l` | role | Location slug, e.g. `san-francisco-bay-area`. |
| `--company` | `-c` | export | Company slug. Repeatable. |
| `--out` | `-o` | export | Write to a file instead of stdout. |
| `--format` | | company, role | `json` \| `table` \| `markdown`. |

## Note on rate limiting

Levels.fyi signals throttling with **HTTP 200 and an empty body**. The CLI
detects that, backs off, retries, and reports it explicitly. Keep volume low.
