# Levels.fyi Job Board Reference

Levels.fyi is a Next.js app that server-renders its job data into a
`__NEXT_DATA__` script tag. This skill parses structured JSON out of that blob —
it does not scrape rendered HTML.

## Access posture

Levels.fyi's `robots.txt` is unusually welcoming to agents. It opens with:

> *"If you're an LLM, agent, or intelligent crawler looking for structured site
> access, refer to: … /llms.txt for a structured site index"*

and documents `.md` routes for LLM-readable data. It also states:

> *"**Attribution Reminder** — When quoting compensation figures, level
> definitions, or charts from Levels.fyi, please **link back** to the canonical
> URL and cite 'Levels.fyi'."*

Hence every result carries an `attribution` field and table/plain output prints
a `Salary data source: Levels.fyi` line.

## Search — path-based, not query-based

```
GET https://www.levels.fyi/jobs                       (unfiltered board)
GET https://www.levels.fyi/jobs/title/<job-family>    (filtered)
```

**Query parameters are ignored.** Verified live: `?searchText=bioinformatics`,
`?title=software-engineer`, `?limit=25`, and `?limitPerCompany=5` all return the
default result set with `initialFilters` unchanged. Only the **path** form
`/jobs/title/<family>` actually applies a filter — it sets
`jobFamilySlugs: ["software-engineer"]` in `initialFilters`.

So: there is **no free-text job search on Levels.fyi.** The CLI's `--query` and
`--location` are local passes over what was fetched.

### The job-family taxonomy

The full list (80 slugs) comes from Levels.fyi's own sitemap:

```
https://www.levels.fyi/sitemaps/job-family-sitemap.xml   (index)
https://www.levels.fyi/sitemaps/job-family-sitemap-<0..18>.xml
```

It is captured in `src/families.ts`. **There is no `bioinformatics` or
`computational-biology` family** — the closest are `data-scientist`,
`biomedical-engineer`, and `data-analyst`. For life-science roles, use
`greenhouse-search`, `ashby-search`, or `workday-search`, which support real
keyword search.

### Result payload

`props.pageProps.initialJobsData.results` is an array of **companies**, each
with a nested `jobs` array — the CLI flattens it. One fetch yields roughly 11
companies × up to 3 jobs, and there is no working limit/offset, so there is no
deep pagination.

Per-job fields:

| Field | Meaning |
|-------|---------|
| `id` | Job id — used for the permalink |
| `title` | Job title |
| `locations[]` | Locations |
| `applicationUrl` | **External** apply link (often LinkedIn or the employer's ATS) |
| `postingDate` / `expiryDate` | ISO timestamps |
| `minBaseSalary` / `maxBaseSalary` / `baseSalaryCurrency` | Base pay range |
| `minTotalSalary` / `maxTotalSalary` | Total comp range — the reason to use this source |

## Detail

```
GET https://www.levels.fyi/jobs?jobId=<id>
```

Populates `props.pageProps.initialJobDetails` with everything above plus
`description` (**raw HTML** — converted to text by the CLI), `workArrangement`,
`employmentTypes`, `jobFamilySlug`, `postalAddresses`, and
`totalCompensationEstimates`.

**Schema inconsistency to watch:** the detail payload nests company under
`companyInfo.name` / `companyInfo.slug`, whereas search results use
`companyName` / `companySlug`. Reading the search field names against a detail
payload silently yields a null company.

## Two links per result

| Field | Points to |
|-------|-----------|
| `url` | `https://www.levels.fyi/jobs?jobId=<id>` — Levels.fyi's own page (verified HTTP 200) |
| `applicationUrl` | The employer's actual application page, off-site |

`url` is the one to open to verify a listing on Levels.fyi itself.

## Rate limiting

Levels.fyi throttles aggressively and responds with **HTTP 200 and a body
containing no `__NEXT_DATA__`** rather than a 429. The CLI detects that, backs
off, retries, and finally reports an explicit rate-limit message instead of a
confusing parse error. Keep request volume low.
