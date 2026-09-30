// Data source: Remotive's public remote-jobs API (remotive.com/api/remote-jobs).
// Documented and unauthenticated, returning JSON — no HTML parsing.
//
// ATTRIBUTION IS REQUIRED. Remotive's own API response carries a legal notice:
// results must link back to the Remotive URL and name Remotive as the source.
// The CLI therefore always emits the posting `url` and an `attribution` field,
// and never strips them.
//
// RATE LIMITS ARE UNUSUALLY STRICT. Remotive advises fetching "a couple of times
// a day (max. 4)" and says excessive requests will be blocked; their data is
// intentionally delayed 24h. This CLI makes exactly ONE request per invocation
// and filters locally, rather than issuing a request per filter combination.

export const API_URL = "https://remotive.com/api/remote-jobs"
export const ATTRIBUTION = "Source: Remotive (https://remotive.com)"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

export async function jsonFetch<T>(url: string): Promise<T | null> {
  const maxRetries = 4
  let delay = 1000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(
          `Request failed: ${response.status} ${response.statusText}. Remotive blocks ` +
            `excessive requests — they advise at most a few calls per day.`,
        )
      }
      const jitter = Math.floor(Math.random() * 750)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 10000)
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

export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name?: string | null
  category?: string | null
  tags?: string[] | null
  job_type?: string | null
  publication_date?: string | null
  candidate_required_location?: string | null
  salary?: string | null
  description?: string | null
}

export interface RemotiveResponse {
  "job-count"?: number
  "total-job-count"?: number
  jobs?: RemotiveJob[]
}

export interface JobResult {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  category: string | null
  jobType: string | null
  salary: string | null
  tags: string[]
  attribution: string
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
    .replace(/&#(\d+);/g, (_, d) => numericEntity(parseInt(d, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, h) => numericEntity(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")
}

export function descriptionToText(html: string): string {
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

export function normalizeJob(job: RemotiveJob): JobResult {
  return {
    id: String(job.id),
    title: decodeHtmlEntities(job.title ?? "(untitled)"),
    company: job.company_name ? decodeHtmlEntities(job.company_name) : null,
    location: job.candidate_required_location ?? null,
    date: job.publication_date ?? null,
    url: job.url,
    category: job.category ?? null,
    jobType: job.job_type ?? null,
    salary: job.salary && job.salary.trim() !== "" ? job.salary : null,
    tags: job.tags ?? [],
    attribution: ATTRIBUTION,
  }
}

/**
 * Remotive's own `search` parameter is fuzzy — a search for "bioinformatics"
 * returns unrelated design roles. This tightens matching locally against the
 * title, category and tags, requiring every term to appear.
 */
export function matchesQuery(job: JobResult, query: string | undefined): boolean {
  if (!query) return true
  const hay = `${job.title} ${job.category ?? ""} ${job.tags.join(" ")} ${job.company ?? ""}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

export function ageInDays(iso: string | null): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (isNaN(t)) return null
  return (Date.now() - t) / 86400000
}
