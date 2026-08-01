---
name: ashby-search
version: 1.0.0
description: >
  Use this skill to search job openings at companies whose careers pages run on
  Ashby — heavily used by techbio and AI-lab startups (insitro, Benchling, Chai
  Discovery, Latent Labs, OpenAI, Cursor, ElevenLabs, Fireworks AI, Modal,
  Replit, Suno, SF Compute). Searches many company boards at once by keyword,
  location, remote status, and posting age, and returns compensation ranges
  where the company publishes them. Trigger phrases: techbio jobs, AI startup
  jobs, ML scientist roles, jobs at insitro, jobs at Benchling, Ashby.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/ashby-search/cli/src/cli.ts *)
---

# Ashby Search Skill

Search live job openings across companies hosted on **Ashby**, using Ashby's
public posting API. No authentication, no API key, and **zero runtime
dependencies** — it runs with just `bun`.

Ashby is where a lot of the **techbio and AI-lab startup** market lives —
complementary to `greenhouse-search`, which covers the larger biotech and
established-AI employers.

## How search works here

Ashby's API is **per-organization**: one request returns that company's entire
board (including full descriptions), and there is no keyword parameter. So
`search` fans out over a curated org list (`cli/src/companies.ts`), fetches each
board in parallel, and filters locally.

Narrow with `--company` or `--sector` to cut request volume, or point
`--company` at any Ashby org slug not in the curated list.

## Commands

### Search

```bash
bun run .agents/skills/ashby-search/cli/src/cli.ts search [flags]
```

- `--query <text>` / `-q <text>` — keyword filter on title/department/company. All terms must match.
- `--location <text>` / `-l <text>` — filter on location text, e.g. `"South San Francisco"`.
- `--company <slug>` / `-c <slug>` — search a specific org board. **Repeatable.**
- `--sector <name>` — restrict the curated list: `biotech`, `ai`, or `tech`.
- `--remote` — only postings Ashby flags as remote.
- `--jobage <days>` — only postings published within N days.
- `--page <n>` — 1-indexed page. Default `1`.
- `--limit <n>` / `-n <n>` — page size. Default `25`.
- `--format json|table|plain` — default `json`.

### Detail

```bash
bun run .agents/skills/ashby-search/cli/src/cli.ts detail <url> [--format json|plain]
bun run .agents/skills/ashby-search/cli/src/cli.ts detail <id> --company <slug>
```

Returns the full description. Ashby has no single-posting endpoint, so detail
re-fetches the org's board and selects the job — pass a full posting URL (which
carries org + id) or a bare id plus `--company`.

### Companies

```bash
bun run .agents/skills/ashby-search/cli/src/cli.ts companies --format table
```

## Verifying results yourself

Every result carries a `url` field holding the **public posting link**
(`https://jobs.ashbyhq.com/<company>/<id>`), taken straight from Ashby's
`jobUrl`. Open it in a browser to see the same posting on the company's own
Ashby board. `applyUrl` is also returned where Ashby provides it.

## Usage examples

```bash
# Scientist roles across techbio companies
bun run .agents/skills/ashby-search/cli/src/cli.ts search -q "scientist" --sector biotech --format table

# ML/AI roles at two specific companies
bun run .agents/skills/ashby-search/cli/src/cli.ts search -q "machine learning" -c insitro -c benchling --format table

# Remote research roles posted in the last 30 days
bun run .agents/skills/ashby-search/cli/src/cli.ts search -q "research" --remote --jobage 30 --format table

# Full description for one posting
bun run .agents/skills/ashby-search/cli/src/cli.ts detail https://jobs.ashbyhq.com/insitro/71606d59-a7d1-4246-8fb3-f8c97ba8201b --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing URLs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Results include a `salary` field when the company publishes a compensation tier, plus `employmentType`, `workplaceType`, and `isRemote`.
- Postings Ashby marks unlisted (`isListed: false`) are filtered out.
- Some boards are large — OpenAI's is roughly 12MB because Ashby inlines full descriptions — so requests carry a 30s timeout.
- A board that fails or 404s is reported under `meta.failed`; the rest of the search still returns.
- See `url-reference.md` for the full API documentation.
