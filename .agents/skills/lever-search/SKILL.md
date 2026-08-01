---
name: lever-search
version: 1.0.0
description: >
  Use this skill to search job openings at companies whose careers pages run on
  Lever (Zoox, Palantir, Spotify, Gopuff, Synthego, and any other Lever-hosted
  board). Searches multiple company boards at once by keyword, location, and
  posting age, and returns published salary ranges where available. Trigger
  phrases: jobs at Zoox, jobs at Palantir, Lever job board, autonomy jobs,
  robotics jobs.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/lever-search/cli/src/cli.ts *)
---

# Lever Search Skill

Search live job openings across companies hosted on **Lever**, using Lever's
public postings API. No authentication, no API key, and **zero runtime
dependencies**.

Lever's `robots.txt` is `User-agent: *` / `Allow: /` — this is a documented
public API intended for exactly this use.

## How search works here

Lever's API is **per-organization** with no keyword parameter, so `search` fans
out over a curated org list (`cli/src/companies.ts`), fetches each board in
parallel, and filters locally. Narrow with `--company` or `--sector`, or point
`--company` at any Lever slug not in the list.

Lever's coverage in this repo is smaller than Greenhouse's or Ashby's — it is
strongest for autonomy/robotics (Zoox) and data platforms (Palantir). Add slugs
as you find them.

## Commands

### Search

```bash
bun run .agents/skills/lever-search/cli/src/cli.ts search [flags]
```

- `--query <text>` / `-q <text>` — keyword filter on title/department/team/company.
- `--location <text>` / `-l <text>` — filter on location text.
- `--company <slug>` / `-c <slug>` — specific org board. **Repeatable.**
- `--sector <name>` — `biotech`, `ai`, or `tech`.
- `--jobage <days>` — only postings created within N days.
- `--page <n>` / `--limit <n>` / `--format json|table|plain`.

### Detail

```bash
bun run .agents/skills/lever-search/cli/src/cli.ts detail <url> [--format json|plain]
```

Returns the full description, assembled from Lever's several plain-text fields
(see Notes).

### Companies

```bash
bun run .agents/skills/lever-search/cli/src/cli.ts companies --format table
```

## Verifying results yourself

Every result carries a `url` field holding the **public posting link**
(`https://jobs.lever.co/<company>/<id>`), taken straight from Lever's
`hostedUrl`. Open it to see the same posting on the company's own board.
`applyUrl` is returned as well.

## Usage examples

```bash
bun run .agents/skills/lever-search/cli/src/cli.ts search -q "software engineer" --format table
bun run .agents/skills/lever-search/cli/src/cli.ts search -q "simulation" -c zoox --jobage 30 --format table
bun run .agents/skills/lever-search/cli/src/cli.ts search --sector biotech --format table
```

## Notes

- **Descriptions are split across fields.** Lever spreads a posting's prose over `openingPlain`, `descriptionPlain`, `descriptionBodyPlain`, `additionalPlain`, and `salaryDescriptionPlain`; reading only `descriptionPlain` truncates or empties many postings. The CLI concatenates and de-duplicates them.
- `createdAt` is epoch **milliseconds**, normalized to ISO in the output `date` field.
- The title field in Lever's API is `text`, not `title`.
- A slug that isn't a Lever board returns a non-array body; it is reported in `meta.failed` rather than crashing the run.
- See `url-reference.md` for the full API documentation.
