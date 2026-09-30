// Data source: Ashby's public posting API (api.ashbyhq.com/posting-api/job-board/<org>).
// This is the documented, unauthenticated endpoint Ashby provides so companies can
// render their own job board. It returns JSON including a ready-made plain-text
// description per job, so this skill does no HTML parsing at all.
//
// The API returns a company's ENTIRE board in one response (no keyword or paging
// parameters), so search fans out over a curated org list and filters locally.

export const API_BASE = "https://api.ashbyhq.com/posting-api/job-board"

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
      signal: AbortSignal.timeout(30000),
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

export interface AshbyCompensationTier {
  minValue?: number
  maxValue?: number
  currencyCode?: string
  interval?: string
}

export interface AshbyJob {
  id: string
  title: string
  department?: string | null
  team?: string | null
  employmentType?: string | null
  location?: string | null
  secondaryLocations?: Array<{ location?: string }> | null
  publishedAt?: string | null
  isListed?: boolean
  isRemote?: boolean
  workplaceType?: string | null
  jobUrl: string
  applyUrl?: string | null
  descriptionPlain?: string | null
  compensation?: {
    compensationTierSummary?: string | null
    summaryComponents?: AshbyCompensationTier[]
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
  employmentType: string | null
  workplaceType: string | null
  isRemote: boolean | null
  salary: string | null
  description?: string | null
}

/** Join the primary location with any secondary ones, e.g. multi-site postings. */
export function formatLocation(job: AshbyJob): string | null {
  const parts = [job.location, ...(job.secondaryLocations ?? []).map((s) => s?.location)]
    .filter((p): p is string => !!p && p.trim() !== "")
  const unique = [...new Set(parts)]
  return unique.length ? unique.join("; ") : null
}

export function normalizeJob(job: AshbyJob, slug: string, companyName: string): JobResult {
  return {
    id: job.id,
    title: job.title ?? "(untitled)",
    company: companyName,
    companySlug: slug,
    location: formatLocation(job),
    date: job.publishedAt ?? null,
    url: job.jobUrl,
    applyUrl: job.applyUrl ?? null,
    department: job.department ?? job.team ?? null,
    employmentType: job.employmentType ?? null,
    workplaceType: job.workplaceType ?? null,
    isRemote: typeof job.isRemote === "boolean" ? job.isRemote : null,
    salary: job.compensation?.compensationTierSummary ?? null,
  }
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
