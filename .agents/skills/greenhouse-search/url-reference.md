# Greenhouse Job Board API Reference

Greenhouse's **public, documented** job-board API. This is the API Greenhouse
itself provides so companies can embed their own job board — it returns clean
JSON, requires no authentication and no API key, and needs no HTML parsing.

`robots.txt` on `boards-api.greenhouse.io` disallows only `/embed/`; the
`/v1/boards/` API paths used here are not restricted.

## List a board's jobs

```
GET https://boards-api.greenhouse.io/v1/boards/<board_token>/jobs
GET https://boards-api.greenhouse.io/v1/boards/<board_token>/jobs?content=true
```

Returns `{"jobs": [...]}`. With `content=true`, each job also carries `content`
(the full description). The CLI omits `content` on search (keeps responses small
across a fan-out) and fetches it per-job in `detail`.

Job fields used:

| Field | Meaning |
|-------|---------|
| `id` | Numeric job id (used by the detail endpoint) |
| `title` | Job title |
| `absolute_url` | Canonical public posting URL |
| `location.name` | Free-text location, e.g. `"San Carlos, CA"`, `"US Remote"` |
| `first_published` / `updated_at` | ISO timestamps; the CLI prefers `first_published` |
| `company_name` | Display name of the hiring company |
| `departments[].name` | Department, e.g. `"Bioinformatics"` |
| `content` | HTML-escaped description string (only with `content=true`) |

`content` is **double-encoded**: it is an HTML-escaped string containing HTML.
It must be entity-decoded first, then tag-stripped, to render as plain text.

## Single job detail

```
GET https://boards-api.greenhouse.io/v1/boards/<board_token>/jobs/<job_id>
```

Returns one job object including `content`. Both the board token **and** the job
id are required — there is no global id lookup, which is why `detail` needs
either a full posting URL (which carries both) or a bare id plus `--company`.

## No cross-company search

The API is strictly per-board: there is **no keyword parameter and no endpoint
that searches across companies.** Any "search the market" behaviour must fan out
over a known set of board tokens and filter client-side. That is what
`src/companies.ts` is for; `--company` overrides it for ad-hoc boards.

## Finding a company's board token

Open the company's careers page and look for a URL of the form
`boards.greenhouse.io/<token>` or `job-boards.greenhouse.io/<token>`, or an
embedded iframe/script pointing at `boards-api.greenhouse.io/.../boards/<token>`.
The token is usually the company name lowercased with punctuation removed
(`10xgenomics`, `chanzuckerberginitiative`), but not always
(`recursionpharmaceuticals` for Recursion).

## Notes

- No authentication required.
- Boards that 404 (renamed or removed) are reported in `meta.failed` rather than
  failing the whole search.
- The CLI backs off on 429/5xx with exponential backoff + jitter, and sets a
  15s request timeout.
- Verified board tokens as of this writing are listed in `src/companies.ts`; each
  returned a non-empty job list when the list was assembled.
