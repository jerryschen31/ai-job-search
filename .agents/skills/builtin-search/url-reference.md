# Built In (builtin.com) URL Reference

Public, unauthenticated job-search and job-detail pages on builtin.com — a US/Canada
tech-focused job board with a national edition and regional metro editions
(builtinsf.com, builtinnyc.com, etc.). This skill uses the **national domain**
(`builtin.com`), which supports the same city/state filters as the metro sites
without being locked to one region.

> ⚠️ **Personal use only.** builtin.com's `robots.txt` disallows the `search`
> query parameter (`/jobs*?search=`) and several facet parameters for unrecognized
> crawlers under its default `User-agent: *` rule; it only carves out explicit
> exceptions for four named bots (`OAI-SearchBot`, `GPTBot`, `ChatGPT-User`,
> `PerplexityBot`) that get broad `/jobs*` access. This skill's requests don't
> match any of those exceptions, so they fall under the general disallow. Keep
> volume low, don't use this commercially or for bulk data collection, and run it
> on your own responsibility.

## Search

```
GET https://builtin.com/jobs
GET https://builtin.com/jobs/remote     (remote-only listings)
```

Query params:

| Param | Meaning | Example |
|-------|---------|---------|
| `search` | Free-text keyword query | `senior software engineer` |
| `city` | City name | `San Jose` |
| `state` | State/region name | `California` |
| `country` | Defaults to `USA` when city/state is set | `USA` |
| `searcharea` | Radius around city, in miles | `25mi` |
| `page` | 1-indexed page number | `1`, `2`, `3`, … |

When `remote` is requested, the base path becomes `/jobs/remote` and the
city/state/country/searcharea params are omitted entirely (a nationwide/remote
search doesn't take a location).

There is **no reliable posting-age query parameter**. The search UI has a
"New Jobs" dropdown that sets a client-side `daysSinceUpdated` state value, but
appending `?daysSinceUpdated=<n>` to the URL directly did not change the
server-rendered result set in testing — the filter appears to require the
page's client-side JS/session state rather than a plain query param. Each
result's `date` field still carries the site's own relative text (e.g.
"Reposted 3 Days Ago"), so recency is visible, just not filterable via a flag.

### Result markup

Each result is wrapped in a `<div id="job-card-<id>" data-id="job-card">` block
(one `<li>`-equivalent per posting). Within each card:

- **Title + URL**: `<a data-id="job-card-title" data-alias="/job/<slug>/<id>">`
- **Company**: `<a href="/company/<slug>" data-id="company-title"><span>Name</span></a>`
- **Location**: a `data-bs-title="..."` tooltip attribute holding one or more
  `<div>Location</div>` entries (multi-location postings show "N Locations" in
  the visible text but the tooltip carries the full list)
- **Posting recency**: text following a `fa-clock` icon (e.g. "Reposted 13 Hours Ago")
- **Salary / seniority / workplace type**: text in a `<span class="font-barlow
  text-gray-04">` immediately following a `fa-sack-dollar` / `fa-trophy` /
  `fa-house-building` icon, respectively (all three spans share the same class,
  so the preceding icon class is what disambiguates them)

No JSON-LD or embedded JSON gives the full listing set on the search page (a
`jobsListServerData` script tag exists but only carries skill-facet counts, not
job data) — the CLI parses the HTML cards directly.

## Detail

```
GET https://builtin.com/job/<slug>/<id>
```

**The slug is required** — `https://builtin.com/job/<id>` (no slug) and
`https://builtin.com/job/<wrong-slug>/<id>` both 404. There's no known
id-only lookup endpoint, so `detail` requires the full URL from a `search`
result's `url` field, not just the numeric id.

The detail page embeds a `JobPosting` JSON-LD block, which the CLI uses instead
of HTML scraping — it's far more reliable and gives structured fields the
search-card HTML doesn't (full description, salary range, employment type,
industries, exact job locations). One quirk: the page HTML-escapes the `+` in
the script tag's `type` attribute (`application/ld&#x2B;json` instead of
`application/ld+json`), and the JSON body itself carries `&amp;` for literal
ampersands — both need HTML-entity decoding before/after `JSON.parse`.

Key JSON-LD fields used: `title`, `description` (HTML string, converted to
plain text), `hiringOrganization.name` / `.sameAs`, `baseSalary.value.{minValue,
maxValue,unitText}`, `datePosted`, `employmentType`, `industry` (array),
`jobLocation` (array of `{address: {addressLocality, addressRegion,
addressCountry}}`).

## Notes

- No authentication required.
- Respect rate limits — the CLI backs off on 429/5xx with exponential backoff + jitter.
- City-tag pages like `/jobs*san-francisco` (and similarly for other named
  metros) are separately disallowed in robots.txt — this skill only ever
  queries `city`/`state` as URL params, not those tag-style paths, so it
  doesn't hit that specific rule regardless of which city is searched.
