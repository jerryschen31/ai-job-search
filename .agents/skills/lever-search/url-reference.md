# Lever Postings API Reference

Lever's **public, unauthenticated** postings API — the endpoint Lever provides so
companies can render their own job boards. Returns JSON with ready-made
plain-text fields, so this skill does no HTML parsing.

`api.lever.co/robots.txt` is `User-agent: *` / `Allow: /`.

## List an organization's postings

```
GET https://api.lever.co/v0/postings/<org_slug>?mode=json
```

Returns a **JSON array** (not an object) of every public posting on that board.
There is no keyword, location, or paging parameter.

## Single posting

```
GET https://api.lever.co/v0/postings/<org_slug>/<posting_id>?mode=json
```

Returns one posting object. Note the org slug is still required — there is no
global id lookup, which is why `detail` needs a full posting URL or a bare id
plus `--company`.

## Fields used

| Field | Meaning |
|-------|---------|
| `id` | UUID posting id |
| `text` | Job title (note: **not** `title`) |
| `hostedUrl` | Public posting URL on `jobs.lever.co` — the link to verify a result |
| `applyUrl` | Direct application link |
| `createdAt` | **Epoch milliseconds**, not an ISO string — normalized by `toIso()` |
| `categories.location` / `.allLocations` | Location(s) |
| `categories.department` / `.team` / `.commitment` | Org grouping and full-time/part-time |
| `workplaceType` | `onsite` / `remote` / `hybrid` |
| `salaryRange` | `{min, max, currency, interval}` when published |

## The split description fields

Lever does **not** put the whole posting in one field. The prose is spread across
several, any of which may be empty:

| Field | Typically holds |
|-------|-----------------|
| `openingPlain` | Opening blurb |
| `descriptionPlain` | Intro / role summary |
| `descriptionBodyPlain` | Body (often identical to `descriptionPlain`) |
| `additionalPlain` | Responsibilities and qualifications — frequently the bulk of the posting |
| `salaryDescriptionPlain` | Compensation narrative |

Reading only `descriptionPlain` yields an empty or badly truncated description on
many postings. `buildDescription()` concatenates the non-empty fields and
de-duplicates them (`descriptionPlain` and `descriptionBodyPlain` are commonly
the same string).

## Finding an organization's slug

Look for a `jobs.lever.co/<slug>` link on the company's careers page.

## Notes

- No authentication required.
- A slug that isn't a Lever board returns `{"ok": false, ...}` rather than an
  array; the CLI treats a non-array response as "not found" and reports it in
  `meta.failed` instead of crashing.
- The CLI backs off on 429/5xx with exponential backoff + jitter.
