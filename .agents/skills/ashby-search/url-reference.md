# Ashby Posting API Reference

Ashby's **public, unauthenticated** posting API — the endpoint Ashby provides so
companies can render their own job boards. Returns JSON with a ready-made
plain-text description per job, so this skill does no HTML parsing.

`api.ashbyhq.com` serves no `robots.txt` restrictions for these paths.

## List an organization's jobs

```
GET https://api.ashbyhq.com/posting-api/job-board/<org_slug>
GET https://api.ashbyhq.com/posting-api/job-board/<org_slug>?includeCompensation=true
```

Returns `{"jobs": [...]}` — the organization's **entire** board in one response.
There is no keyword, location, or paging parameter, and no single-posting
endpoint. `includeCompensation=true` adds published salary tiers.

Job fields used:

| Field | Meaning |
|-------|---------|
| `id` | UUID job id |
| `title` | Job title |
| `jobUrl` | Public posting URL on `jobs.ashbyhq.com` — the link to verify a result |
| `applyUrl` | Direct application link |
| `location` | Primary location string |
| `secondaryLocations[].location` | Additional locations for multi-site postings |
| `publishedAt` | ISO publication timestamp |
| `department` / `team` | Org grouping; the CLI prefers `department`, falls back to `team` |
| `employmentType` | e.g. `FullTime` |
| `workplaceType` / `isRemote` | Onsite/Hybrid/Remote signals |
| `isListed` | `false` means unlisted — the CLI filters these out |
| `descriptionPlain` | Ready-made plain-text description (no HTML parsing needed) |
| `compensation.compensationTierSummary` | Published pay range, e.g. `"$200K – $260K"` |

## Consequences of the API shape

- **No cross-company search.** Searching the market means fanning out over a
  known set of org slugs and filtering client-side — that is what
  `src/companies.ts` is for.
- **Whole-board responses are large.** Because full descriptions are inlined,
  OpenAI's board is ~12MB. Requests use a 30s timeout for this reason, and
  `search` does not echo descriptions into its output.
- **Detail re-fetches the board.** With no per-job endpoint, `detail` fetches the
  org board and selects by id.

## Finding an organization's slug

Look for a `jobs.ashbyhq.com/<slug>` link on the company's careers page. Slugs
are usually the company name lowercased (`insitro`, `benchling`), though some
differ from the brand (`cursor` for Anysphere).

## Notes

- No authentication required.
- The CLI backs off on 429/5xx with exponential backoff + jitter.
- Verified org slugs as of this writing are listed in `src/companies.ts`.
