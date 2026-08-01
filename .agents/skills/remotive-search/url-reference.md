# Remotive Public API Reference

```
GET https://remotive.com/api/remote-jobs
```

Documented, unauthenticated JSON. No API key.

## Verified limitation: the free API is an unfiltered fixed feed

Tested live against the endpoint: **`search`, `category`, and `limit` are all
ignored.** Every one of these returns the identical payload (same job count,
same first result):

```
/api/remote-jobs
/api/remote-jobs?search=python
/api/remote-jobs?search=bioinformatics
/api/remote-jobs?limit=100
/api/remote-jobs?category=software-dev
```

The response's own `job-count` and `total-job-count` are equal (~34), i.e. the
feed is the whole dataset the free tier exposes, not a page of a larger set.
Remotive sells a filtered private API separately (their legal notice quotes a
starting budget of $5k/mo).

Consequence: this CLI sends **no query parameters at all** and does every
filter locally. Sending them would imply server-side filtering that does not
happen.

## Response shape

```json
{
  "0-legal-notice": "...",
  "job-count": 34,
  "total-job-count": 34,
  "jobs": [ ... ]
}
```

| Field | Meaning |
|-------|---------|
| `id` | Numeric job id |
| `url` | Public Remotive posting URL — the link to verify a result |
| `title` | Job title |
| `company_name` | Employer |
| `category` | Remotive category, e.g. `"Data and Analytics"` |
| `tags` | Skill tags (**noisy** — some employers tag every posting with a long generic skill list) |
| `job_type` | e.g. `full_time` |
| `publication_date` | ISO-ish timestamp |
| `candidate_required_location` | e.g. `"USA"`, `"Americas, Europe, Asia"` |
| `salary` | Often an empty string; normalized to `null` |
| `description` | HTML description, included inline in the feed |

Because descriptions ship inline, there is **no `detail` command** — use
`--with-description`.

## Terms of use (from the API's own legal notice)

- **Attribution is required**: link back to the Remotive URL and name Remotive
  as the source. The CLI emits `attribution` on every result and prints a
  `Source: Remotive` line in table/plain output.
- **Do not republish** these listings to third-party job sites.
- **Keep request volume very low** — Remotive advises at most ~4 calls per day
  and says excessive requests are blocked. The CLI makes exactly one request per
  invocation.
- Listings are intentionally delayed ~24h.

## Notes

- Retries back off on 429/5xx, and the 429 error message names the rate-limit
  guidance explicitly.
- Suitable for personal job search; not for building a competing listing site.
