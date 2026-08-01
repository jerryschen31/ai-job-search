// Data source: Greenhouse's public job-board API (boards-api.greenhouse.io).
// This is the documented, unauthenticated API that Greenhouse itself provides
// for embedding a company's job board — it returns clean JSON, so there is no
// HTML parsing anywhere in this skill.
//
// Note: the API is per-board (one company per token) and has no keyword
// parameter, so `search` fans out over a curated token list (see companies.ts)
// and filters client-side.

export const API_BASE = "https://boards-api.greenhouse.io/v1/boards"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** Fetch JSON with exponential backoff on 429/5xx. Returns null on a 404. */
export async function jsonFetch<T>(url: string): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
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
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }
  throw new Error("Request failed after max retries")
}

export interface GreenhouseJob {
  id: number
  title: string
  absolute_url: string
  updated_at?: string
  first_published?: string
  company_name?: string
  location?: { name?: string } | null
  content?: string
  departments?: Array<{ name?: string }>
  offices?: Array<{ name?: string }>
}

export interface JobResult {
  id: string
  title: string
  company: string | null
  companyToken: string
  location: string | null
  date: string | null
  url: string
  department: string | null
  description?: string | null
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

/** Greenhouse `content` is an HTML-escaped string; render it as readable text. */
export function contentToText(content: string): string {
  const html = decodeHtmlEntities(content)
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  return decodeHtmlEntities(
    withBreaks
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n *(?:\s*\n)*/g, "\n"),
  ).trim()
}

export function normalizeJob(job: GreenhouseJob, companyToken: string, companyName: string): JobResult {
  return {
    id: String(job.id),
    title: decodeHtmlEntities(job.title ?? "(untitled)"),
    company: job.company_name ? decodeHtmlEntities(job.company_name) : companyName,
    companyToken,
    location: job.location?.name ? decodeHtmlEntities(job.location.name) : null,
    date: job.first_published ?? job.updated_at ?? null,
    url: job.absolute_url,
    department: job.departments?.[0]?.name ? decodeHtmlEntities(job.departments[0].name!) : null,
  }
}

/**
 * Case-insensitive keyword match. Multi-word queries match when every term
 * appears somewhere in the haystack, so "senior bioinformatics" matches
 * "Senior Scientist, Bioinformatics" without needing exact adjacency.
 */
export function matchesQuery(haystack: string, query: string | undefined): boolean {
  if (!query) return true
  const hay = haystack.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

/** Days between an ISO date and now; null when the date is missing/unparseable. */
export function ageInDays(iso: string | null): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (isNaN(t)) return null
  return (Date.now() - t) / 86400000
}
