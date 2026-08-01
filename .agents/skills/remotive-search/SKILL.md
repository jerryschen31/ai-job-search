---
name: remotive-search
version: 1.0.0
description: >
  Use this skill to browse fully-remote job listings from Remotive's public API
  — remote software, data, DevOps, design, marketing and support roles. Note it
  is a small supplementary feed rather than a full search engine (see Notes).
  Trigger phrases: remote jobs, work from anywhere, remote software jobs,
  Remotive.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/remotive-search/cli/src/cli.ts *)
---

# Remotive Search Skill

Browse fully-remote job listings via **Remotive's** public API. No
authentication, no API key, **zero runtime dependencies**.

## Read this first: what this skill actually is

Remotive's **free** API is an unfiltered feed of roughly **34 current remote
jobs**, and it **ignores every query parameter** — `search`, `category`, and
`limit` all return the identical payload (verified live; see
`url-reference.md`). Their filtered API is a paid product.

So this is a small supplementary source, not a search engine:

- All filtering (`--query`, `--location`, `--category`, `--jobage`) happens
  **locally, over those ~34 jobs**.
- Niche queries will legitimately return nothing. A search for
  `bioinformatics` returns zero because the feed genuinely contains no
  bioinformatics roles — it skews to generalist remote software, data, sales,
  and support work.
- For biotech, pharma, and AI-lab roles use `greenhouse-search`,
  `ashby-search`, and `workday-search` instead.

## Terms you must respect

- **Attribution is required.** Remotive's own legal notice requires linking back
  to the Remotive URL and naming Remotive as the source. Every result carries an
  `attribution` field, and table/plain output prints a `Source: Remotive` line.
  Don't strip it.
- **Don't republish** these listings to other job sites.
- **Keep volume very low.** Remotive advises at most ~4 calls per day and blocks
  excess. This CLI makes exactly **one** request per invocation.

## Commands

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts search [flags]
```

- `--query <text>` / `-q <text>` — local keyword filter over title/category/tags/company.
- `--location <text>` / `-l <text>` — filter on candidate-required location, e.g. `"USA"`.
- `--category <name>` — filter on Remotive category, e.g. `"Software Development"`.
- `--jobage <days>` — only postings published within N days.
- `--with-description` — include full description text (descriptions ship inline, so there is no separate `detail` command).
- `--page <n>` / `--limit <n>` / `--format json|table|plain`.

## Verifying results yourself

Every result carries a `url` field holding the **public Remotive posting link**
(`https://remotive.com/remote-jobs/<category>/<slug>-<id>`), taken straight from
the API. Verified to resolve with HTTP 200.

## Usage examples

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts search --format table
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "data" -l "USA" --format table
bun run .agents/skills/remotive-search/cli/src/cli.ts search --category "Software Development" --with-description --limit 5 --format plain
```

## Notes

- `meta.upstreamReturned` shows how many jobs the feed contained before local filtering, so you can tell "no matches" apart from "feed was empty".
- Remotive's `tags` are noisy: some employers tag every posting with a long generic skill list, so tag-based matches can be loose.
- Listings are delayed ~24h by Remotive.
- See `url-reference.md` for the evidence behind the fixed-feed finding.
