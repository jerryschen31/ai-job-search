# Levels.fyi Compensation (LLM Markdown Routes) Reference

Levels.fyi publishes **LLM-readable markdown versions** of its salary pages.
Appending `.md` to a salary or job-family URL returns a structured document
instead of a rendered page. This skill uses only these sanctioned routes.

## Why these routes are sanctioned

`https://www.levels.fyi/robots.txt` opens with:

> *"If you're an LLM, agent, or intelligent crawler looking for structured site
> access, refer to: … `/sitemaps/companies-sitemap.xml` — only salary routes and
> subroutes (e.g. `/companies/google/salaries`) support the `.md` extension for
> LLM-readable markdown … `/sitemaps/job-family-sitemap.xml` — all job family
> routes (append `.md`)"*

and `https://www.levels.fyi/llms.txt` documents the same. Each returned document
also carries its own Attribution and Data License sections.

## Routes

| Route | Returns |
|-------|---------|
| `/companies/<company>/salaries.md` | All roles at one company |
| `/companies/<company>/salaries/<job-family>.md` | One role at one company |
| `/t/<job-family>.md` | One role across the market |
| `/t/<job-family>/locations/<location>.md` | One role in one location |

All verified live (HTTP 200 with content). Example:
`/t/software-engineer/locations/san-francisco-bay-area.md`.

Only **salary** routes support `.md` — other company subroutes (e.g. `/culture`)
do not.

## Document structure

```markdown
# Levels.fyi – Roche Software Engineer Salaries

**URL:** https://www.levels.fyi/companies/roche/salaries/software-engineer
**Generated:** 2026-08-01T17:55:08.482Z
**Scope:** Software Engineer roles at Roche in United States
**Location:** United States
**Currency:** USD ($)

## Summary
...prose...

## Aggregate Highlights
- Median Total Compensation: $203,000
- Last Updated: August 1, 2026

## Key Breakdowns
### Levels Breakdown
| Level | Median Total Compensation |
| --- | --- |
| Software Engineer I | $138,135 |
| Senior Software Engineer | $203,864 |

## FAQ
...

## Attribution
Use of this data requires attribution to **Levels.fyi**.

## Data License
... https://www.levels.fyi/offerings/data/
```

Not every document has every section — market/location documents often omit the
levels table, so the parser treats it as optional.

### Parsing note

Section extraction is a **line scan**, not a regex lookahead. A terminator like
`(?=^##\s|\Z)` fails silently in JavaScript because `\Z` is not an anchor there
(it is an identity escape matching a literal "Z"), which makes any section that
appears **last** in a document unmatchable — exactly the case when the levels
table is the final block.

## Terms

Levels.fyi's documents state:

> *"Use of this data requires attribution to **Levels.fyi**. Include: 'Data
> source: Levels.fyi (https://www.levels.fyi)' in any derived work."*
> *"Data provided in this file is subject to the Levels.fyi Data License. See
> https://www.levels.fyi/offerings/data/ for terms and permitted use."*

Every CLI output therefore carries `attribution` and `dataLicense`, and the
`export` command writes attribution into `salary_data.json`'s metadata. Keep it.

## Rate limiting

Levels.fyi throttles by returning **HTTP 200 with a zero-length body** rather
than a 429. The CLI treats an empty body as throttling: it backs off, retries,
and then reports it explicitly rather than claiming the document was empty.
Keep request volume low; `export` fetches one document per company sequentially.

## Slugs

Company slugs and job-family slugs are Levels.fyi's own. Job families come from
`/sitemaps/job-family-sitemap.xml` (80 of them, captured in `src/families.ts`).
Company slugs are usually the lowercased name (`roche`, `gilead`).
