# Search Queries for Job Scraper

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Any skill added with `/add-portal` is included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

**Highest-signal sources for this profile** (bioinformatics + AI engineering, Bay Area):

| Skill | Covers | Keyword search? |
|-------|--------|-----------------|
| `workday-search` | Big pharma incl. **Roche/Genentech**, Gilead, Pfizer, GSK, BMS, AstraZeneca, Sanofi, Merck, Illumina | Yes, server-side |
| `greenhouse-search` | Biotech/genomics + AI labs: 10x, Natera, Altos, Recursion, Freenome, Twist, Arc, Isomorphic, CZI, Anthropic, Databricks | Local, across a curated company list |
| `ashby-search` | Techbio + AI startups: insitro, Benchling, Chai Discovery, OpenAI, Cursor | Local, across a curated company list |
| `linkedin-search`, `builtin-search` | Broad Bay Area coverage incl. Apple and other targets | Yes |
| `lever-search`, `muse-search`, `remotive-search` | Supplementary | Mixed |
| `levels-fyi-search` | Jobs with salary attached (no bioinformatics family) | Family taxonomy only |

For compensation benchmarking (not listings) use the `levels-fyi-compensation` skill.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

## Search Sites

Primary:
- **linkedin.com/jobs** - LinkedIn job listings (filter: US / San Jose, CA and Bay Area); also covered by `linkedin-search` CLI
- **indeed.com** - general US job board
- **freehire.me** - covered by `freehire-search` CLI
- **builtin.com** - US/Canada tech & startup jobs (SF Bay Area, national); covered by `builtin-search` CLI
- **Company ATS boards** - Greenhouse / Ashby / Lever / Workday; covered by the four ATS CLIs above (no `site:` query needed)

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for Apple and other target companies

## Query Categories

Queries are grouped by priority. Each query should be combined with location terms (San Jose, South Bay, Bay Area, or "remote") where the site supports it.

### Priority 1: Principal Engineer / Systems Lead / AI Engineering

These match Jerry's strongest and most desired career direction.

```
site:linkedin.com/jobs "Principal Engineer" "AI" San Jose OR Sunnyvale OR Cupertino OR "Santa Clara" OR "Bay Area"
site:linkedin.com/jobs "Systems Lead" "agentic AI" Bay Area
site:indeed.com "Principal Engineer" "Claude Code" OR "agentic AI" Bay Area
site:linkedin.com/jobs "AI Engineer" "AI adoption" San Jose OR "South Bay"
```

### Priority 2: Bioinformatics / Biotech Systems Leadership

These match Jerry's 20-year domain expertise in bioinformatics, genomics, and GxP-regulated systems.

```
site:linkedin.com/jobs "Bioinformatics" "GxP" South San Francisco OR "Bay Area"
site:linkedin.com/jobs "Head of Bioinformatics" OR "Bioinformatics Lead" Bay Area
site:indeed.com "computational biology" "AWS" South San Francisco OR "Bay Area"
```

### Priority 3: Adjacent Roles (AI/Cloud Program & Systems Leadership)

Adjacent roles Jerry could pivot into.

```
site:linkedin.com/jobs "Technical Program Manager" "AI" Bay Area
site:linkedin.com/jobs "Solutions Architect" AWS Bay Area
site:linkedin.com/jobs "MLOps Lead" OR "DevOps Lead" Bay Area
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical leadership roles.

```
site:linkedin.com/jobs "technical consultant" biotech OR pharma Bay Area
site:indeed.com "software architecture" Bay Area
```

### Target Companies

- **Apple** - ideal given proximity to home (Cupertino); monitor for Principal Engineer / Systems Lead / AI Engineering openings
- Other companies based in Sunnyvale, Santa Clara, or Cupertino are a strong secondary target purely for commute convenience

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from San Jose, CA, or is remote/hybrid-friendly:
- **Ideal:** Cupertino, Sunnyvale, Santa Clara (esp. Apple or nearby employers)
- **Acceptable:** Mountain View, Redwood City, San Jose, San Mateo (South Bay)
- **Borderline:** Broader Bay Area (San Francisco, East Bay, Peninsula) - acceptable as hybrid if only a few in-person visits per year are required
- **Always acceptable:** Fully remote (any location)
- **Too far:** Requires relocation outside the Bay Area with no remote/hybrid option (hard fail per `04-job-evaluation.md`)

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape Apple" -> Priority 1 queries + custom Apple-specific queries
- "/scrape biotech" -> Priority 2 queries + custom domain-specific queries

## Hard Exclusion

Per `04-job-evaluation.md`, algorithm-development-heavy roles are a hard no (self-identified weak spot). Filter out or heavily flag postings that center on algorithm design, competitive-programming-style technical bars, or deep data-structures work as the primary responsibility.
