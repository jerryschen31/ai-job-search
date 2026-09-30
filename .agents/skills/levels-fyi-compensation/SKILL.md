---
name: levels-fyi-compensation
version: 1.0.0
description: >
  Use this skill for salary and compensation benchmarking via Levels.fyi — what
  a role pays at a specific company, what a job family pays across the market or
  in a given metro, and per-level breakdowns (e.g. Software Engineer I vs Senior
  vs Principal). Also exports a salary_data.json for this repo's salary
  benchmarking tool. Trigger phrases: what does X pay, salary benchmark,
  compensation for this role, is this offer competitive, total comp, negotiate
  salary, Levels.fyi salaries.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts *)
---

# Levels.fyi Compensation Skill

Salary benchmarking via **Levels.fyi's LLM-readable markdown routes** — the
`.md` endpoints Levels.fyi explicitly documents for agent access in its
`robots.txt` and `llms.txt`. No authentication, no API key, **zero runtime
dependencies**.

Use this when evaluating an offer, preparing to negotiate, or sanity-checking
whether a posting's range is competitive. For job *listings* with salary
attached, use the companion **`levels-fyi-search`** skill.

## Attribution is mandatory

Levels.fyi's own documents state that use of the data **requires attribution**:

> "Include: *Data source: Levels.fyi (https://www.levels.fyi)* in any derived work."

Every output carries `attribution` and `dataLicense` fields, table output prints
an attribution line, and `export` writes attribution into the generated file.
**Keep it on anything derived from this data** — including CVs, cover letters,
or negotiation notes that quote these figures. Licence terms:
<https://www.levels.fyi/offerings/data/>.

## Commands

### Company compensation

```bash
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts company <slug> [--role <family>] [--format json|markdown|table]
```

e.g. `company roche --role software-engineer` → median total comp plus a
per-level breakdown (Software Engineer I → Principal).

### Role / market compensation

```bash
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts role <family> [--location <slug>] [--format json|markdown|table]
```

e.g. `role software-engineer --location san-francisco-bay-area`.

### Export for this repo's salary tool

```bash
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts export --company <slug> [--company <slug> ...] [--role <family>] [--out salary_data.json]
```

Writes the `salary_data.json` shape documented in
`tools/README_SALARY_TOOL.md`, so `/apply`'s salary benchmarking step has real
data instead of being skipped. Median total compensation (absolute USD) goes in
the `index` field; each level becomes its own category. A company that fails is
recorded under `_failed` rather than aborting the run.

### Families

```bash
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts families [filter]
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — parsed median, per-level rows, scope, source URL |
| `table` | Quick human-readable benchmark |
| `markdown` | Levels.fyi's original document, passed through unchanged (keeps its own attribution and licence sections) |

Errors go to **stderr** as `{ "error": "...", "code": "..." }`, exit code `1`.

## Verifying figures yourself

Every result carries `sourceUrl` — the human-readable Levels.fyi page the
figures came from, e.g.
`https://www.levels.fyi/companies/roche/salaries/software-engineer`. Open it to
check the numbers against the live site.

## Usage examples

```bash
# What does Roche pay software engineers, by level?
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts company roche --role software-engineer --format table

# Bay Area market rate for the role
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts role software-engineer --location san-francisco-bay-area --format table

# Everything Levels.fyi has on one company, verbatim
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts company genentech --format markdown

# Populate the repo's salary tool
bun run .agents/skills/levels-fyi-compensation/cli/src/cli.ts export --company roche --company gilead --role software-engineer --out salary_data.json
```

## Notes

- **Rate limiting:** Levels.fyi throttles by returning HTTP 200 with an *empty body*, not a 429. The CLI treats an empty body as throttling, backs off, retries, and then says so plainly. Keep volume low — don't loop over many companies rapidly.
- Not every document has a levels table; market/location reports often carry only a median. The parser treats the table as optional.
- Data is self-reported to Levels.fyi — treat it as a directional benchmark, not a guarantee.
- Company and job-family slugs are Levels.fyi's own (`roche`, `software-engineer`). A wrong slug produces a 404 whose message says so.
- See `url-reference.md` for the sanctioned routes, document structure, and terms.
