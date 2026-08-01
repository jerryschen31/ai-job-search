# The Muse Public Jobs API Reference

```
GET https://www.themuse.com/api/public/jobs?page=<n>
```

Documented, unauthenticated JSON. No API key. ~400,000 jobs, 20 per page.

## Server-side filters (verified working)

| Param | Example | Effect (verified live) |
|-------|---------|------------------------|
| `page` | `1` | 1-indexed; 20 results per page |
| `category` | `Data and Analytics` | total 405,667 → 17,822 |
| `level` | `Senior Level` | total → 146,722 |
| `location` | `San Jose, CA` | total → 8,607, results genuinely in San Jose |
| `company` | `bankofamerica` | Muse company `short_name`; a wrong slug yields total 0 |

Location values must match The Muse's own strings exactly — `"San Jose, CA"`,
`"San Francisco, CA"`, `"Flexible / Remote"`.

## No keyword search

There is **no free-text/keyword parameter**. This is the API's main limitation:
you filter by taxonomy, not by search terms. The CLI's `--query` is therefore a
**local** narrowing pass over whatever pages were fetched — which is why
`--query` should always be combined with `--location`/`--category` and a
suitable `--pages`, or it is filtering an arbitrary slice of a 400k-job
catalogue.

## Response shape

```json
{"page": 1, "page_count": 892, "items_per_page": 20, "total": 17822, "results": [...]}
```

| Field | Meaning |
|-------|---------|
| `id` | Numeric job id |
| `name` | Job title (**not** `title`) |
| `refs.landing_page` | Public Muse posting URL — the link to verify a result |
| `company.name` / `.short_name` | Employer and its Muse slug |
| `locations[].name` | One or more locations |
| `categories[].name` | Muse category |
| `levels[].name` | Seniority |
| `publication_date` | ISO timestamp |
| `contents` | HTML description, included inline |
| `type` | e.g. `external` |

Because `contents` ships inline, there is **no `detail` command** — use
`--with-description`.

## Notes

- No authentication required.
- The CLI backs off on 429/5xx with exponential backoff + jitter.
- `refs.landing_page` was verified to resolve with HTTP 200; when it is absent
  the CLI falls back to the company page so a result never lacks a link.
