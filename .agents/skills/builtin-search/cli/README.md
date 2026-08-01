# builtin-cli

CLI for searching jobs on **Built In** (builtin.com), a US/Canada tech- and
startup-focused job board with national and metro editions.

**Data source**: builtin.com's public job-search and job-detail pages (search results
parsed from HTML cards; detail parsed from an embedded `JobPosting` JSON-LD block).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **Personal use only.** builtin.com's `robots.txt` disallows the `search` query
> parameter for unrecognized crawlers under its default rule, carving out
> exceptions only for a handful of named AI search bots (not this tool). Keep
> volume low, don't use it commercially or for bulk data collection, and run it
> on your own responsibility.

## Installation

```bash
cd .agents/skills/builtin-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search for job listings (keyword + optional city/state, or `--remote`) |
| `detail` | Fetch full detail for a single job listing — **requires the full URL**, not just an id |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Senior software engineer roles in San Jose, CA
bun run src/cli.ts search -q "senior software engineer" --city "San Jose" --state "California" --format table

# Remote data engineering roles
bun run src/cli.ts search -q "data engineer" --remote --format table

# Full detail for one job (URL from a search result's "url" field)
bun run src/cli.ts detail https://builtin.com/job/senior-software-developer-test-framework/9553863 --format plain
```

See `../SKILL.md` for the full flag reference and the robots.txt/ToS note.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keywords (title / skill / role). Recommended. |
| `--city` | | City name, e.g. `"San Jose"`. |
| `--state` | | State/region, e.g. `"California"`. |
| `--country` | | Defaults to `"USA"` when city/state is set. |
| `--radius` | | Search radius around the city, e.g. `"25mi"`. Default `"25mi"`. |
| `--remote` | | Search remote-only listings; omits city/state. |
| `--page` | | 1-indexed page. |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |
