---
name: muse-search
version: 1.0.0
description: >
  Use this skill to search a large general job catalogue (~400k postings) via
  The Muse's public API, filtered by location, category, seniority level, or
  company. Good for broad Bay Area / remote searches across many employers at
  once. Trigger phrases: job search, jobs in San Jose, jobs in San Francisco,
  remote jobs, senior level jobs, The Muse.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/muse-search/cli/src/cli.ts *)
---

# The Muse Search Skill

Search a large general job catalogue (~400,000 postings) via **The Muse's**
public API. No authentication, no API key, and **zero runtime dependencies**.

## How search works here

The Muse filters by a **fixed taxonomy**, applied server-side and verified to
work: `--location`, `--category`, `--level`, `--company`.

It has **no free-text keyword parameter**. `--query` is therefore a *local*
narrowing pass over the pages actually fetched.

**Always pair `--query` with a taxonomy filter.** A bare `--query` across a
400k-job catalogue only sees the first `--pages × 20` jobs, which is an
arbitrary slice. `--location "San Jose, CA" --category "Data and Analytics"`
first narrows to ~1.5k, and *then* `--query` is meaningful.

## Commands

```bash
bun run .agents/skills/muse-search/cli/src/cli.ts search [flags]
```

**Server-side (real filtering):**
- `--location <text>` / `-l <text>` — exact Muse location, e.g. `"San Jose, CA"`, `"San Francisco, CA"`, `"Flexible / Remote"`.
- `--category <name>` — e.g. `"Data and Analytics"`, `"Science and Engineering"`, `"Software Engineering"`.
- `--level <name>` — e.g. `"Senior Level"`, `"Mid Level"`.
- `--company <slug>` — Muse company `short_name`.

**Local:**
- `--query <text>` / `-q <text>` — keyword narrowing on title/category/company/level.
- `--jobage <days>` — only postings within N days.

**Output:**
- `--pages <n>` — upstream pages to pull (20 jobs each). Default `3`.
- `--page <n>` / `--limit <n>` / `--with-description` / `--format json|table|plain`.

## Verifying results yourself

Every result carries a `url` field holding the **public Muse posting link**
(`https://www.themuse.com/jobs/<company>/<slug>`), taken from the API's
`refs.landing_page` and verified to resolve with HTTP 200. When that ref is
missing, the CLI falls back to the company's Muse page so a result is never
returned without an openable link.

## Usage examples

```bash
# Data roles in San Jose
bun run .agents/skills/muse-search/cli/src/cli.ts search -l "San Jose, CA" --category "Data and Analytics" --format table

# Scientist roles, deeper crawl before local keyword narrowing
bun run .agents/skills/muse-search/cli/src/cli.ts search -q "scientist" --category "Science and Engineering" --pages 5 --format table

# Senior remote roles
bun run .agents/skills/muse-search/cli/src/cli.ts search -l "Flexible / Remote" --level "Senior Level" --format table
```

## Notes

- There is no `detail` command — descriptions ship inline; use `--with-description`.
- `meta.upstreamTotal` is The Muse's own match count for the taxonomy filters; `meta.upstreamFetched` is how many were actually pulled; `meta.matched` is after local filtering. Compare them to tell "no matches" from "didn't crawl deep enough".
- The Muse's categorization is broad — a job's listed category is not always intuitive.
- The title field in the API is `name`, not `title`.
- See `url-reference.md` for the verified filter behaviour.
