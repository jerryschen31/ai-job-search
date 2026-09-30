---
name: workday-search
version: 1.0.0
description: >
  Use this skill to search job openings at large pharma and biotech employers
  whose careers sites run on Workday — Roche/Genentech, AstraZeneca, Sanofi,
  Merck (MSD), GSK, Bristol Myers Squibb, Pfizer, Gilead, and Illumina. This is
  the primary source for regulated / GxP pharma roles, and it supports real
  server-side keyword search. Trigger phrases: pharma jobs, Genentech jobs,
  Roche jobs, GxP roles, clinical systems jobs, big pharma careers, bioinformatics
  at pharma, Workday careers.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/workday-search/cli/src/cli.ts *)
---

# Workday Search Skill

Search live job openings across **Workday-hosted career sites**, using the same
public JSON endpoint each site's own search box calls. No authentication, no API
key, and **zero runtime dependencies**.

This is the highest-value skill for the **regulated pharma / GxP market** —
essentially all of big pharma runs its careers site on Workday, including
Roche/Genentech.

## What makes this one different

Unlike the Greenhouse/Ashby/Lever skills, Workday supports **server-side keyword
search**: `--query` is sent to each employer as `searchText`, so you get real
matching rather than local filtering of a full board dump.

**But Workday OR-matches `searchText` across the whole posting**, so on its own a
multi-word query returns anything sharing a single common word — `-q "technical
program manager"` came back with "Key Account Manager" and "Field Medical Director".
The server call supplies recall; this skill then narrows to titles containing **every**
term, the same "all terms must match" rule the Greenhouse/Ashby/Lever skills use. Pass
`--loose` to turn the narrowing off.

Because the strict filter runs over the fetched window, a query overfetches a few
extra pages per employer so a matching title ranked below the noise isn't lost.
Compare `meta.matchedTotal` (server-side hits) against `meta.fetched` (what survived
local filtering); `meta.queryFilter` records which mode was used.

Workday is per-tenant, so each employer is recorded as a `(tenant, wd, site)`
triple in `cli/src/employers.ts`. Nine employers ship verified; any other
Workday site works via `--tenant/--wd/--site`.

## Commands

### Search

```bash
bun run .agents/skills/workday-search/cli/src/cli.ts search [flags]
```

- `--query <text>` / `-q <text>` — keyword search, sent **server-side**, then narrowed locally to titles containing **every** term (see below).
- `--loose` — skip that local narrowing and keep Workday's own OR-matched ranking. Use it when the term you care about lives in the description rather than the title.
- `--location <text>` / `-l <text>` — filter results on location text, e.g. `"Santa Clara"`. Matched on **token boundaries**.
- `--employer <key>` / `-e <key>` — specific employer (see `employers`). **Repeatable.**
- `--sector <name>` — `pharma`, `biotech`, or `tech`.
- `--jobage <days>` — only postings within N days (approximated from Workday's relative posted text).
- `--page <n>` — 1-indexed page. Default `1`.
- `--limit <n>` / `-n <n>` — page size. Default `25`.
- `--format json|table|plain` — default `json`.

Ad-hoc employer not in the list:

```bash
--tenant <tenant> --wd <wdN> --site <site>
```

All three are required together. For
`https://acme.wd5.myworkdayjobs.com/AcmeCareers` use
`--tenant acme --wd wd5 --site AcmeCareers`.

### Detail

```bash
bun run .agents/skills/workday-search/cli/src/cli.ts detail <posting-url> [--format json|plain]
```

No employer flag needed — the posting URL contains the tenant and site. Returns
the full description as plain text, plus req id, time type, and start date.

### Employers

```bash
bun run .agents/skills/workday-search/cli/src/cli.ts employers --format table
```

Lists each employer with its live career-site URL.

## Verifying results yourself

Every result carries a `url` field holding the **public career-site posting
link**, e.g.

```
https://roche.wd3.myworkdayjobs.com/roche-ext/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2
```

This is byte-identical to the `externalUrl` Workday's own detail endpoint
returns, and was verified to resolve with HTTP 200. Open it to see the posting
on the employer's real careers site.

## Usage examples

```bash
# Bioinformatics across every curated pharma employer
bun run .agents/skills/workday-search/cli/src/cli.ts search -q "bioinformatics" --format table

# Roche/Genentech only, Bay Area
bun run .agents/skills/workday-search/cli/src/cli.ts search -q "bioinformatics" -e roche -l "Santa Clara" --format table

# Computational biology at two employers, last 14 days
bun run .agents/skills/workday-search/cli/src/cli.ts search -q "computational biology" -e roche -e gilead --jobage 14 --format table

# Same query, but keep everything Workday matched (term may be in the description)
bun run .agents/skills/workday-search/cli/src/cli.ts search -q "computational biology" --loose --format table

# Full description for one posting
bun run .agents/skills/workday-search/cli/src/cli.ts detail "https://roche.wd3.myworkdayjobs.com/roche-ext/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2" --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing URLs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- **`--location` matches whole tokens.** It also excludes postings whose location Workday collapses to `"2 Locations"` / `"4 Locations"` — those carry no city text, so only a `detail` fetch can tell whether they include the place you asked for. Drop `-l` if you want them back.
- **Two-letter query terms** (`ai`, `ml`, `qa`) match whole tokens; longer terms match as substrings, so `-q "bioinformatic"` still finds "Bioinformatician".
- **Workday caps page size at 20** per request (a larger `limit` makes it return no postings at all); the CLI pages automatically and exposes your own `--limit` on top.
- **Dates are approximate.** Workday's search response gives only relative text (`"Posted 2 Days Ago"`), which the CLI converts to an ISO date for sorting and `--jobage`. Postings whose phrasing isn't recognized keep a `null` date and are **not** filtered out by `--jobage`. The `postedOn` field preserves Workday's original wording.
- `meta.matchedTotal` is the server-side match count across employers; `meta.fetched` is how many were pulled before local filtering.
- An employer whose site fails is reported in `meta.failed`; the rest still return.
- See `url-reference.md` for full API documentation, including how to add employers.
