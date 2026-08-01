---
name: builtin-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for tech, software, data, or
  startup jobs on Built In (builtin.com) — a US/Canada tech-focused job board
  with national and metro (SF Bay Area, NYC, Austin, Boston, Chicago, LA,
  Seattle, Colorado) editions. Supports keyword search filtered by city/state or
  remote-only listings, and fetching full detail (description, salary,
  employment type, industries) for a specific posting. Trigger phrases: tech
  jobs, startup jobs, Built In, builtin.com, software jobs in the Bay Area,
  remote tech jobs, find a job on Built In.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/builtin-search/cli/src/cli.ts *)
---

# Built In Search Skill

Search live job listings from Built In (builtin.com), a US/Canada tech- and
startup-focused job board with a national edition and several metro editions.
No authentication, no API key, and **zero runtime dependencies** — it runs
with just `bun`.

## ⚠️ Personal use only

builtin.com's `robots.txt` disallows the `search` query parameter and several
facet parameters under its default crawler rule, carving out exceptions only
for four named AI search bots (OpenAI's and Perplexity's). This skill's
requests don't match those exceptions. **Keep volume low, don't use it
commercially or for bulk data collection, and run it on your own
responsibility.**

## When to use this skill

- Search for tech/software/data/startup job openings in a US city, state, or
  nationwide
- Search remote-only tech listings
- Get the full description, salary range, employment type, and industries for
  a specific posting

## Commands

### Search job listings

```bash
bun run .agents/skills/builtin-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keyword search (title, skill, or role). Recommended.
- `--city <text>` — city name, e.g. `"San Jose"`.
- `--state <text>` — state/region, e.g. `"California"`.
- `--country <text>` — defaults to `"USA"` when city/state is set.
- `--radius <text>` — search radius around the city, e.g. `"25mi"`. Default `"25mi"`.
- `--remote` — search remote-only listings instead of a location (omits city/state).
- `--page <n>` — 1-indexed page. Default `1`.
- `--limit <n>` / `-n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.

There is no reliable posting-age filter flag on this portal (see `url-reference.md`
for why) — each result's `date` field carries the site's own relative text
(e.g. `"Reposted 3 Days Ago"`) so recency is still visible.

### Fetch full job detail

```bash
bun run .agents/skills/builtin-search/cli/src/cli.ts detail <url> [--format json|plain]
```

**Requires the full job URL** as returned by `search`'s `url` field (e.g.
`https://builtin.com/job/senior-software-engineer/1234567`) — Built In's job
pages require the correct slug in the path, so a bare numeric id will 404.
Returns the full description, salary range, employment type, and industries.

## Usage examples

```bash
# Senior software engineer roles in San Jose, CA
bun run .agents/skills/builtin-search/cli/src/cli.ts search -q "senior software engineer" --city "San Jose" --state "California" --format table

# Bioinformatics roles anywhere in the US
bun run .agents/skills/builtin-search/cli/src/cli.ts search -q "bioinformatics" --format table

# Remote data engineering roles
bun run .agents/skills/builtin-search/cli/src/cli.ts search -q "data engineer" --remote --format table

# Second page of results
bun run .agents/skills/builtin-search/cli/src/cli.ts search -q "platform engineer" --city "San Jose" --state "California" --page 2 --format table

# Full details for a specific job (URL from a prior search's "url" field)
bun run .agents/skills/builtin-search/cli/src/cli.ts detail https://builtin.com/job/senior-software-developer-test-framework/9553863 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing URLs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Results include salary range, seniority level, and workplace type (remote/hybrid/onsite) when the posting provides them — fields are `null` otherwise.
- Multi-location postings return all locations joined with `; ` in the `location` field.
- Built In may rate-limit; the CLI retries 429/5xx with exponential backoff. Keep volume low (see ToS note above).
- See `url-reference.md` for the full endpoint and markup documentation, including the robots.txt caveats.
