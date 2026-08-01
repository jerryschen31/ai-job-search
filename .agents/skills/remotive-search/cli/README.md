# remotive-cli

CLI for browsing remote jobs via **Remotive's** public API.

**Data source**: `remotive.com/api/remote-jobs` (public JSON, no key).
**Authentication**: None.
**Dependencies**: None (plain `bun` + `fetch`).

> **Important:** Remotive's free API is an **unfiltered fixed feed of ~34 jobs**
> and ignores `search`/`category`/`limit`. All filtering here is local. See
> `../url-reference.md`.
>
> **Attribution is required** and request volume must stay very low (~4/day max).
> This CLI makes exactly one request per run and always emits attribution.

## Installation

```bash
cd .agents/skills/remotive-search/cli
bun install   # optional — only installs TypeScript dev types
```

## Commands

| Command | Description |
|---------|-------------|
| `search` | Fetch the feed and filter locally |

There is no `detail` command — descriptions ship inline; use `--with-description`.

## Quick examples

```bash
bun run src/cli.ts search --format table
bun run src/cli.ts search -q "data" -l "USA" --format table
bun run src/cli.ts search --with-description --limit 3 --format plain
```

Each result's `url` is the public Remotive posting link.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Local filter over title/category/tags/company. |
| `--location` | `-l` | Filter on candidate-required location. |
| `--category` | | Filter on Remotive category. |
| `--jobage` | | Only postings within N days. |
| `--with-description` | | Include description text. |
| `--page` | | 1-indexed page. Default 1. |
| `--limit` | `-n` | Page size. Default 25. |
| `--format` | | `json` \| `table` \| `plain`. |
