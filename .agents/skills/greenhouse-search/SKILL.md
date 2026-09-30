---
name: greenhouse-search
version: 1.0.0
description: >
  Use this skill to search job openings at companies whose careers pages run on
  Greenhouse — which covers a large share of biotech, genomics, and AI-lab
  employers (10x Genomics, Natera, Altos Labs, Recursion, Freenome, Twist
  Bioscience, Arc Institute, Isomorphic Labs, CZI, Ginkgo Bioworks, GeneDx,
  Ultima Genomics, Anthropic, Databricks, Scale AI, Waymo, and more). Searches
  many company boards at once by keyword, location, sector, and posting age.
  Trigger phrases: biotech jobs, bioinformatics jobs, genomics jobs, AI lab
  jobs, computational biology roles, jobs at <company>, Greenhouse.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/greenhouse-search/cli/src/cli.ts *)
---

# Greenhouse Search Skill

Search live job openings across companies hosted on **Greenhouse**, using
Greenhouse's own public, documented job-board API. No authentication, no API
key, and **zero runtime dependencies** — it runs with just `bun`.

This is the highest-coverage skill for **biotech, genomics, and AI-lab roles**:
a large share of that market runs its careers page on Greenhouse.

## How search works here

Greenhouse's API is **per-company** — there is no cross-company search endpoint
and no keyword parameter. So `search` fans out over a curated list of company
board tokens (`cli/src/companies.ts`, ~24 verified companies across biotech, AI,
and tech), fetches each board in parallel, and filters locally by keyword,
location, and posting age.

That means you can ask "every bioinformatics role across the Bay Area biotech
cluster" in one command. Narrow with `--company` or `--sector` to cut request
volume, or point `--company` at any board token not in the curated list.

## Commands

### Search

```bash
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search [flags]
```

- `--query <text>` / `-q <text>` — keyword filter on title/department/company. All terms must match, in any order.
- `--location <text>` / `-l <text>` — filter on the posting's location text, e.g. `"South San Francisco"`, `"Remote"`.
- `--company <token>` / `-c <token>` — search a specific board. **Repeatable.** Overrides the curated list.
- `--sector <name>` — restrict the curated list: `biotech`, `ai`, or `tech`.
- `--jobage <days>` — only postings published within N days.
- `--page <n>` — 1-indexed page. Default `1`.
- `--limit <n>` / `-n <n>` — page size. Default `25`.
- `--format json|table|plain` — default `json`.

### Detail

```bash
bun run .agents/skills/greenhouse-search/cli/src/cli.ts detail <url> [--format json|plain]
bun run .agents/skills/greenhouse-search/cli/src/cli.ts detail <id> --company <token>
```

Greenhouse needs **both** a board token and a job id, so pass either a full
posting URL (which carries both) or a bare id plus `--company`. Returns the full
description text.

### Companies

```bash
bun run .agents/skills/greenhouse-search/cli/src/cli.ts companies --format table
```

Lists the curated board tokens with their sector.

## Verifying results yourself

Every result carries a `url` field holding the **canonical public posting URL**
(`https://job-boards.greenhouse.io/<company>/jobs/<id>`), taken straight from
Greenhouse's `absolute_url`. Open it in a browser to see the same posting on the
company's own job board — that is the link to use to check a result is real and
still live.

## Usage examples

```bash
# Every bioinformatics role across the curated biotech companies
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -q "bioinformatics" --sector biotech --format table

# Computational biology in the Bay Area, posted in the last 30 days
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -q "computational biology" -l "CA" --jobage 30 --format table

# AI/ML roles at two specific labs
bun run .agents/skills/greenhouse-search/cli/src/cli.ts search -q "machine learning" -c anthropic -c databricks --format table

# Full description for one posting
bun run .agents/skills/greenhouse-search/cli/src/cli.ts detail https://job-boards.greenhouse.io/natera/jobs/6130549004 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing URLs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- A company board that fails or 404s is reported under `meta.failed` and the rest of the search still returns — one dead board never kills the run.
- `meta.total` is the full match count before pagination; `meta.companiesSearched` tells you how many boards were queried.
- Results are sorted newest-first by publication date.
- Adding a company: find its board token on its careers page (look for a `job-boards.greenhouse.io/<token>` URL) and add it to `cli/src/companies.ts`, or just pass `--company <token>`.
- See `url-reference.md` for the full API documentation.
