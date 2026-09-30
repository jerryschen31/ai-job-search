# muse-cli

CLI for searching jobs via **The Muse's** public API (~400k postings).

**Data source**: `www.themuse.com/api/public/jobs` (public JSON, no key).
**Authentication**: None.
**Dependencies**: None (plain `bun` + `fetch`).

The Muse filters by taxonomy (location/category/level/company) server-side, but
has **no keyword parameter** — `--query` narrows locally over fetched pages, so
pair it with a taxonomy filter.

## Installation

```bash
cd .agents/skills/muse-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Taxonomy-filtered search with local keyword narrowing |

No `detail` command — descriptions ship inline; use `--with-description`.

## Quick examples

```bash
bun run src/cli.ts search -l "San Jose, CA" --category "Data and Analytics" --format table
bun run src/cli.ts search -q "scientist" --category "Science and Engineering" --pages 5 --format table
bun run src/cli.ts search -l "Flexible / Remote" --level "Senior Level" --format table
```

Each result's `url` is the public themuse.com posting link.

## Flags

| Flag | Alias | Server-side? | Description |
|------|-------|--------------|-------------|
| `--location` | `-l` | yes | Exact Muse location string. |
| `--category` | | yes | Muse category. |
| `--level` | | yes | Seniority level. |
| `--company` | | yes | Muse company `short_name`. |
| `--query` | `-q` | no (local) | Keyword narrowing over fetched pages. |
| `--jobage` | | no (local) | Only postings within N days. |
| `--pages` | | — | Upstream pages to pull (20 each). Default 3. |
| `--page` | | — | Output page. Default 1. |
| `--limit` | `-n` | — | Page size. Default 25. |
| `--with-description` | | — | Include description text. |
| `--format` | | — | `json` \| `table` \| `plain`. |
