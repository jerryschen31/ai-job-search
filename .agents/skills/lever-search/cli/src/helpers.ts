// Data source: Lever's public postings API (api.lever.co/v0/postings/<org>).
// This is the documented, unauthenticated endpoint Lever provides so companies
// can render their own job boards. Returns JSON with a ready-made plain-text
// description, so this skill does no HTML parsing.
//
// api.lever.co/robots.txt is `User-agent: * / Allow: /`.
//
// The API returns a company's entire board in one response (no keyword
// parameter), so search fans out over a curated org list and filters locally.

export const API_BASE = "https://api.lever.co/v0/postings"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

export async function jsonFetch<T>(url: string): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
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

export interface LeverJob {
  id: string
  text: string
  hostedUrl: string
  applyUrl?: string | null
  createdAt?: number | null
  workplaceType?: string | null
  country?: string | null
  // Lever splits a posting's prose across several plain-text fields rather than
  // one: `openingPlain`/`descriptionPlain` hold the intro, `descriptionBodyPlain`
  // the body, and `additionalPlain` usually the responsibilities and
  // qualifications. Any of them can be empty, so a complete description means
  // concatenating whichever are present (see buildDescription).
  openingPlain?: string | null
  descriptionPlain?: string | null
  descriptionBodyPlain?: string | null
  additionalPlain?: string | null
  salaryDescriptionPlain?: string | null
  categories?: {
    commitment?: string | null
    department?: string | null
    location?: string | null
    team?: string | null
    allLocations?: string[] | null
  } | null
  salaryRange?: {
    min?: number
    max?: number
    currency?: string
    interval?: string
  } | null
}

export interface JobResult {
  id: string
  title: string
  company: string
  companySlug: string
  location: string | null
  date: string | null
  url: string
  applyUrl: string | null
  department: string | null
  team: string | null
  commitment: string | null
  workplaceType: string | null
  salary: string | null
  description?: string | null
}

/** Lever's createdAt is epoch milliseconds; normalize to an ISO string. */
export function toIso(createdAt: number | null | undefined): string | null {
  if (typeof createdAt !== "number" || !isFinite(createdAt) || createdAt <= 0) return null
  const d = new Date(createdAt)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

export function formatLocation(job: LeverJob): string | null {
  const all = job.categories?.allLocations ?? []
  const parts = [job.categories?.location, ...all].filter(
    (p): p is string => !!p && p.trim() !== "",
  )
  const unique = [...new Set(parts)]
  return unique.length ? unique.join("; ") : null
}

export function formatSalary(job: LeverJob): string | null {
  const s = job.salaryRange
  if (!s?.min || !s?.max) return null
  const cur = s.currency ?? ""
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n))
  const interval = s.interval ? ` / ${s.interval.replace(/^per-/, "")}` : ""
  return `${cur} ${fmt(s.min)}-${fmt(s.max)}${interval}`.trim()
}

export function normalizeJob(job: LeverJob, slug: string, companyName: string): JobResult {
  return {
    id: job.id,
    title: job.text ?? "(untitled)",
    company: companyName,
    companySlug: slug,
    location: formatLocation(job),
    date: toIso(job.createdAt),
    url: job.hostedUrl,
    applyUrl: job.applyUrl ?? null,
    department: job.categories?.department ?? null,
    team: job.categories?.team ?? null,
    commitment: job.categories?.commitment ?? null,
    workplaceType: job.workplaceType ?? null,
    salary: formatSalary(job),
  }
}

/**
 * Assemble the full posting text from Lever's several plain-text fields,
 * skipping empties and de-duplicating (descriptionPlain and
 * descriptionBodyPlain are frequently identical).
 */
export function buildDescription(job: LeverJob): string | null {
  const parts = [
    job.openingPlain,
    job.descriptionPlain,
    job.descriptionBodyPlain,
    job.additionalPlain,
    job.salaryDescriptionPlain,
  ]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((p) => p !== "")
  const unique = [...new Set(parts)]
  return unique.length ? unique.join("\n\n") : null
}

export function matchesQuery(haystack: string, query: string | undefined): boolean {
  if (!query) return true
  const hay = haystack.toLowerCase()
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
