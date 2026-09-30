# Workday Career-Site (CXS) API Reference

Every Workday-hosted career site is backed by the same unauthenticated JSON
endpoint its own front end calls — the "CXS" API. There is no global Workday job
board: each employer runs its own tenant, but the **API shape is identical
across all of them**, so one skill covers every employer once its
`(tenant, wd, site)` triple is known.

This is the only source in this repo that supports **server-side keyword
search**.

## URL anatomy

A public career site looks like:

```
https://<tenant>.<wd>.myworkdayjobs.com/<site>
        roche      wd3                   roche-ext
```

and its JSON API lives at:

```
https://<tenant>.<wd>.myworkdayjobs.com/wday/cxs/<tenant>/<site>
```

`<wd>` is the Workday data-center shard (`wd1`, `wd3`, `wd5`, …) and differs per
employer — it cannot be guessed reliably, so each employer is recorded
explicitly in `src/employers.ts`.

## Search

```
POST https://<tenant>.<wd>.myworkdayjobs.com/wday/cxs/<tenant>/<site>/jobs
Content-Type: application/json

{"appliedFacets": {}, "limit": 20, "offset": 0, "searchText": "bioinformatics"}
```

Response:

```json
{"total": 24, "jobPostings": [...], "facets": [...], "userAuthenticated": false}
```

| Field | Meaning |
|-------|---------|
| `total` | Total matches for the query (not just this page) |
| `jobPostings[].title` | Job title |
| `jobPostings[].externalPath` | Path segment, e.g. `/job/Santa-Clara/Senior-...-Engineer_202607-118174-2` |
| `jobPostings[].locationsText` | Location, or `"N Locations"` for multi-site postings |
| `jobPostings[].postedOn` | **Relative** text, e.g. `"Posted 2 Days Ago"` — no absolute date |
| `jobPostings[].timeType` | e.g. `"Full time"` |
| `jobPostings[].bulletFields[0]` | Requisition id |

### Hard page-size cap of 20

`limit` above **20** makes Workday return a response with **no `jobPostings`
key at all** (not an error, just a missing field). The CLI pins requests to 20
and pages via `offset`.

### No absolute posting date

The search response carries only relative text. `postedOnToIso()` converts
`"Posted N Days/Months/Years Ago"`, `"Posted Today"`, and `"Posted Yesterday"`
into an approximate ISO date so `--jobage` can work without fetching every
posting's detail. Unrecognized phrasing yields `null` rather than a guess, and
`null`-dated postings are kept by `--jobage` rather than silently dropped.

## Detail

```
GET https://<tenant>.<wd>.myworkdayjobs.com/wday/cxs/<tenant>/<site><externalPath>
```

Returns `{"jobPostingInfo": {...}}` with:

| Field | Meaning |
|-------|---------|
| `title`, `jobDescription` | Title and **HTML** description (converted to text by the CLI) |
| `location`, `country.descriptor` | Location and country |
| `postedOn` | Relative posted text |
| `startDate` | Absolute ISO-ish date |
| `timeType`, `jobReqId` | Employment type, requisition id |
| `externalUrl` | Canonical public posting URL |

## Public posting URL (the link to verify a result)

```
https://<tenant>.<wd>.myworkdayjobs.com/<site><externalPath>
```

Verified to be byte-identical to the `externalUrl` the detail endpoint returns,
and to resolve with HTTP 200. This is what `search` puts in each result's `url`.

## Adding an employer

Open the company's careers page, read the tenant/shard/site straight out of the
URL, and add an entry to `src/employers.ts`. For a one-off search, skip the file
and pass `--tenant <t> --wd <wdN> --site <s>`.

Site names are not guessable — they range from `roche-ext` and `Careers` to
`SearchJobs`, `GSKCareers`, and `gileadcareers`.

## Notes

- No authentication required (`userAuthenticated: false` in every response).
- The CLI backs off on 429/5xx with exponential backoff + jitter, 20s timeout.
- An employer whose site errors is reported in `meta.failed`; other employers still return.
