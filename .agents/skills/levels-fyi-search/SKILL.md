---
name: levels-fyi-search
version: 1.0.0
description: >
  Use this skill to search tech job listings on Levels.fyi, where each listing
  comes with Levels.fyi's salary ranges (base and total compensation) attached.
  Filters by a fixed job-family taxonomy (software-engineer, data-scientist,
  product-manager, technical-program-manager, and ~76 more) rather than free
  text. Trigger phrases: jobs with salary, what does this role pay, tech jobs
  with compensation, Levels.fyi jobs, software engineer salary jobs.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/levels-fyi-search/cli/src/cli.ts *)
---

# Levels.fyi Job Search Skill

Search tech job listings on **Levels.fyi**, with **salary ranges attached to
every result** — that is the reason to use this source over a general job board.
Zero runtime dependencies.

## Read this first: how filtering works

Levels.fyi has **no free-text job search**. Filtering is **path-based** over a
fixed job-family taxonomy (`/jobs/title/<family>`); query parameters like
`?searchText=` are ignored (verified live — see `url-reference.md`).

- `--family` is the real, server-side filter. Run `families` to list all 80.
- `--query` and `--location` are **local** passes over what was fetched.
- One fetch returns ~11 companies × up to 3 jobs, and Levels.fyi ignores
  limit/offset, so there is **no deep pagination**. Expect a focused slice, not
  an exhaustive list.

**The taxonomy has no `bioinformatics` or `computational-biology` family.** The
closest are `data-scientist`, `biomedical-engineer`, and `data-analyst`. For
biotech and pharma roles use `greenhouse-search`, `ashby-search`, or
`workday-search`, which support real keyword search.

## Attribution

Levels.fyi's robots.txt explicitly welcomes agent access and asks that
compensation figures link back and cite Levels.fyi. Every result carries an
`attribution` field and table/plain output prints a
`Salary data source: Levels.fyi` line. Don't strip it.

## Commands

### Search

```bash
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts search [flags]
```

- `--family <slug>` / `-f <slug>` — job family (**the real filter**).
- `--query <text>` / `-q <text>` — local keyword narrowing on title/company.
- `--location <text>` / `-l <text>` — local filter on location text.
- `--jobage <days>` — only postings within N days.
- `--page <n>` / `--limit <n>` / `--format json|table|plain`.

An unknown family fails fast with suggestions, before any request is made.

### Detail

```bash
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts detail <jobId|url> [--format json|plain]
```

Full description, work arrangement, employment type, and compensation.

### Families

```bash
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts families [filter]
```

Lists the taxonomy; optionally filtered, e.g. `families engineer`.

## Verifying results yourself

Each result carries **two** links:

| Field | Points to |
|-------|-----------|
| `url` | `https://www.levels.fyi/jobs?jobId=<id>` — the posting on Levels.fyi (verified HTTP 200) |
| `applicationUrl` | The employer's own application page (often LinkedIn or their ATS) |

Open `url` to check the listing on Levels.fyi itself; use `applicationUrl` to apply.

## Usage examples

```bash
# Software engineering roles with comp data
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts search -f software-engineer --format table

# Data scientist roles in California
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts search -f data-scientist -l "California" --format table

# What families exist?
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts families engineer

# One posting in full
bun run .agents/skills/levels-fyi-search/cli/src/cli.ts detail 84665402944037574 --format plain
```

## Notes

- **Rate limiting:** Levels.fyi throttles by returning HTTP 200 with an empty page rather than a 429. The CLI detects that, backs off, and reports an explicit rate-limit message. Keep volume low — don't loop over many families back to back.
- `meta.fetched` vs `meta.matched` distinguishes "nothing was returned" from "local filters excluded everything".
- Salary fields are `baseSalary` and `totalSalary`, formatted like `"180K-220K"`; they are `null` when Levels.fyi has no estimate.
- For pure compensation research (not job listings), use the companion **`levels-fyi-compensation`** skill.
- See `url-reference.md` for the verified behaviour and schema quirks.
