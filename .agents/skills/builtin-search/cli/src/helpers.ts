// Data source: builtin.com's public job search and detail pages (server-rendered
// HTML, US/Canada tech-job board). No authentication required. Search results are
// parsed from per-card HTML chunks (no structured data on the listing page beyond
// title/url); the detail page embeds a full JobPosting JSON-LD block, which we
// prefer over HTML scraping wherever possible.

export const SEARCH_URL = "https://builtin.com/jobs"
export const REMOTE_SEARCH_URL = "https://builtin.com/jobs/remote"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  location: string | null
  date: string | null
  url: string
  salary: string | null
  seniority: string | null
  workplaceType: string | null
}

export interface JobDetail extends JobCard {
  description: string | null
  employmentType: string | null
  datePosted: string | null
  industries: string[] | null
  applyUrl: string | null
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

/** Strip tags, collapsing horizontal whitespace but preserving newlines the
 * caller may have already inserted (e.g. for <br>/block-close conversion). */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n *(?:\s*\n)*/g, "\n")
    .trim()
}

function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

/** Pull the text following a Font-Awesome icon marker, e.g. `fa-sack-dollar ... <span ...>125K-193K Annually</span>`. */
function iconAdjacentText(chunk: string, iconClass: string): string | null {
  const re = new RegExp(
    `${iconClass}[\\s\\S]{0,200}?<span class="font-barlow text-gray-04">([^<]*)</span>`,
  )
  const m = chunk.match(re)
  return m ? clean(m[1]) || null : null
}

/**
 * Parse the search-results page: a flat list of job cards, each anchored by a
 * unique `id="job-card-<id>"` wrapper div. We split on that marker and parse
 * each chunk independently so one malformed card cannot break the rest.
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []
  const chunks = html.split(/id="job-card-(\d+)"/).slice(1)

  // .split() with a capturing group interleaves [id, chunkAfterId, id, chunkAfterId, ...]
  for (let i = 0; i < chunks.length; i += 2) {
    const id = chunks[i]
    const chunk = chunks[i + 1] ?? ""
    if (!id || !chunk) continue

    const titleMatch = chunk.match(
      /data-id="job-card-title"[^>]*data-alias="([^"]+)"[^>]*>([^<]*)</i,
    )
    if (!titleMatch) continue
    const url = "https://builtin.com" + decodeHtmlEntities(titleMatch[1])
    const title = clean(titleMatch[2])
    if (!title) continue

    let company: string | null = null
    let companyUrl: string | null = null
    const companyLinkMatch = chunk.match(
      /<a href="(\/company\/[^"]+)"[^>]*data-id="company-title"[^>]*>[\s\S]*?<span>([^<]*)<\/span>/i,
    )
    if (companyLinkMatch) {
      companyUrl = "https://builtin.com" + decodeHtmlEntities(companyLinkMatch[1])
      company = clean(companyLinkMatch[2]) || null
    }

    // Location: prefer the tooltip's full location list (data-bs-title), which
    // covers multi-location postings; falls back to the visible span text.
    let location: string | null = null
    const tooltipMatch = chunk.match(/data-bs-title="([^"]*)"/i)
    if (tooltipMatch) {
      const decoded = decodeHtmlEntities(tooltipMatch[1])
      const places = [...decoded.matchAll(/<div[^>]*>([^<]*)<\/div>/gi)]
        .map((m) => clean(m[1]))
        .filter(Boolean)
      location = places.length ? places.join("; ") : clean(decoded) || null
    }
    if (!location) {
      const locSpan = chunk.match(
        /fa-location-dot[\s\S]{0,200}?<span[^>]*>([^<]*)<\/span>/i,
      )
      location = locSpan ? clean(locSpan[1]) || null : null
    }

    const dateMatch = chunk.match(/fa-clock[^>]*><\/i>([^<]+)<\/span>/i)
    const date = dateMatch ? clean(dateMatch[1]) || null : null

    const salary = iconAdjacentText(chunk, "fa-sack-dollar")
    const seniority = iconAdjacentText(chunk, "fa-trophy")
    const workplaceType = iconAdjacentText(chunk, "fa-house-building")

    results.push({
      id,
      title,
      company,
      companyUrl,
      location,
      date,
      url,
      salary,
      seniority,
      workplaceType,
    })
  }

  return results
}

interface JsonLdJobPosting {
  title?: string
  description?: string
  identifier?: { name?: string; value?: string }
  baseSalary?: {
    currency?: string
    value?: { minValue?: number; maxValue?: number; unitText?: string }
  }
  datePosted?: string
  employmentType?: string
  hiringOrganization?: { name?: string; sameAs?: string }
  industry?: string[]
  jobLocation?: Array<{
    address?: {
      addressLocality?: string
      addressRegion?: string
      addressCountry?: string
    }
  }>
}

/**
 * Extract the JobPosting JSON-LD block. builtin.com HTML-escapes the `+` in the
 * script type (`application/ld&#x2B;json`), and the JSON body itself carries
 * `&amp;` for literal ampersands, so both need decoding before/after parsing.
 */
function extractJobPostingJsonLd(html: string): JsonLdJobPosting | null {
  const m = html.match(
    /<script type="application\/ld(?:\+|&#x2B;)json">([\s\S]*?)<\/script>/i,
  )
  if (!m) return null
  try {
    const raw = decodeHtmlEntities(m[1])
    const parsed = JSON.parse(raw)
    const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed]
    return graph.find((n: { "@type"?: string }) => n["@type"] === "JobPosting") ?? null
  } catch {
    return null
  }
}

function formatSalary(job: JsonLdJobPosting): string | null {
  const v = job.baseSalary?.value
  if (!v?.minValue || !v?.maxValue) return null
  const fmt = (n: number) => `${Math.round(n / 1000)}K`
  const unit = v.unitText === "YEAR" ? "Annually" : (v.unitText ?? "").toLowerCase()
  return `${fmt(v.minValue)}-${fmt(v.maxValue)} ${unit}`.trim()
}

function formatLocation(job: JsonLdJobPosting): string | null {
  if (!job.jobLocation?.length) return null
  const parts = job.jobLocation.map((loc) => {
    const a = loc.address
    if (!a) return null
    return [a.addressLocality, a.addressRegion, a.addressCountry].filter(Boolean).join(", ")
  })
  const clean = parts.filter((p): p is string => !!p)
  return clean.length ? clean.join("; ") : null
}

/** Convert the JobPosting description HTML into readable plain text. */
function descriptionToText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  return decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim()
}

/** Parse the single-job detail page via its JobPosting JSON-LD block. */
export function parseJobDetail(html: string, id: string, url: string): JobDetail | null {
  const job = extractJobPostingJsonLd(html)
  if (!job) return null

  return {
    id,
    title: job.title ? decodeHtmlEntities(job.title) : "(untitled)",
    company: job.hiringOrganization?.name ? decodeHtmlEntities(job.hiringOrganization.name) : null,
    companyUrl: job.hiringOrganization?.sameAs ?? null,
    location: formatLocation(job),
    date: job.datePosted ?? null,
    url,
    salary: formatSalary(job),
    seniority: null,
    workplaceType: null,
    description: job.description ? descriptionToText(job.description) : null,
    employmentType: job.employmentType ?? null,
    datePosted: job.datePosted ?? null,
    industries: job.industry ?? null,
    applyUrl: url,
  }
}
