// Data source: Levels.fyi's job board. Levels.fyi is a Next.js app that
// server-renders its job data into a __NEXT_DATA__ script tag, so this skill
// reads structured JSON out of that blob rather than scraping rendered HTML.
//
// Levels.fyi's robots.txt explicitly welcomes LLM/agent access and documents
// structured routes, and asks for attribution when quoting its data — hence the
// ATTRIBUTION constant emitted with every result.
//
// The differentiator vs other job sources: listings carry Levels.fyi's
// salary ranges (base and total comp).

export const SITE = "https://www.levels.fyi"
export const ATTRIBUTION = "Salary data source: Levels.fyi (https://www.levels.fyi)"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/**
 * Fetch a page and pull the __NEXT_DATA__ payload out of it.
 * Levels.fyi rate-limits fairly aggressively and answers with a 200 + empty
 * body rather than a 429, so a missing payload is reported as a rate-limit
 * hint instead of a generic parse error.
 */
export async function fetchNextData<T>(url: string): Promise<T> {
  const maxRetries = 4
  let delay = 2000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      await new Promise((r) => setTimeout(r, delay + Math.floor(Math.random() * 1000)))
      delay = Math.min(delay * 2, 15000)
      continue
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    const html = await response.text()
    const parsed = extractNextData<T>(html)
    if (parsed) return parsed
    if (attempt === maxRetries) {
      throw new Error(
        "Levels.fyi returned a page with no __NEXT_DATA__ payload. This usually " +
          "means rate limiting — wait a minute and retry, and keep request volume low.",
      )
    }
    await new Promise((r) => setTimeout(r, delay))
    delay = Math.min(delay * 2, 15000)
  }
  throw new Error("Request failed after max retries")
}

export function extractNextData<T>(html: string): T | null {
  const m = html.match(/id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!m) return null
  try {
    return JSON.parse(m[1]) as T
  } catch {
    return null
  }
}

export interface LevelsJob {
  id: string
  title: string
  locations?: string[] | null
  applicationUrl?: string | null
  postingDate?: string | null
  expiryDate?: string | null
  minBaseSalary?: number | null
  maxBaseSalary?: number | null
  baseSalaryCurrency?: string | null
  minTotalSalary?: number | null
  maxTotalSalary?: number | null
  workArrangement?: string | null
  description?: string | null
}

export interface LevelsCompany {
  companyName?: string
  companySlug?: string
  companyType?: string
  employeeCount?: number | null
  jobs?: LevelsJob[]
}

export interface NextDataShape {
  props?: {
    pageProps?: {
      initialJobsData?: { results?: LevelsCompany[] }
      // NOTE: the detail payload's companyInfo uses `name`/`slug`, while the
      // search payload's company objects use `companyName`/`companySlug`.
      initialJobDetails?: LevelsJob & {
        companyInfo?: { name?: string; slug?: string; website?: string }
        employmentTypes?: string[]
        jobFamilySlug?: string
      }
      initialFilters?: Record<string, unknown>
    }
  }
}

export interface JobResult {
  id: string
  title: string
  company: string | null
  companySlug: string | null
  location: string | null
  date: string | null
  expiryDate: string | null
  /** Levels.fyi's own page for this posting — the link to verify a result. */
  url: string
  /** Where the employer actually accepts applications (often an external ATS). */
  applicationUrl: string | null
  workArrangement: string | null
  baseSalary: string | null
  totalSalary: string | null
  attribution: string
  description?: string | null
}

/** Levels.fyi's own permalink for a posting. */
export function jobUrl(id: string): string {
  return `${SITE}/jobs?jobId=${encodeURIComponent(id)}`
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

/** Job descriptions come back as raw HTML; render them as readable text. */
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

export function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (typeof min !== "number" || typeof max !== "number" || min <= 0 || max <= 0) return null
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n))
  const cur = currency && currency !== "USD" ? ` ${currency}` : ""
  return min === max ? `${fmt(min)}${cur}` : `${fmt(min)}-${fmt(max)}${cur}`
}

export function normalizeJob(job: LevelsJob, company: LevelsCompany | null): JobResult {
  const locs = (job.locations ?? []).filter((l): l is string => !!l && l.trim() !== "")
  return {
    id: String(job.id),
    title: job.title ?? "(untitled)",
    company: company?.companyName ?? null,
    companySlug: company?.companySlug ?? null,
    location: locs.length ? [...new Set(locs)].join("; ") : null,
    date: job.postingDate ?? null,
    expiryDate: job.expiryDate ?? null,
    url: jobUrl(String(job.id)),
    applicationUrl: job.applicationUrl ?? null,
    workArrangement: job.workArrangement ?? null,
    baseSalary: formatRange(job.minBaseSalary, job.maxBaseSalary, job.baseSalaryCurrency),
    totalSalary: formatRange(job.minTotalSalary, job.maxTotalSalary, job.baseSalaryCurrency),
    attribution: ATTRIBUTION,
  }
}

/** Flatten the company-grouped payload into a flat job list. */
export function flattenResults(results: LevelsCompany[]): JobResult[] {
  const out: JobResult[] = []
  for (const company of results) {
    for (const job of company.jobs ?? []) {
      if (job?.id) out.push(normalizeJob(job, company))
    }
  }
  return out
}

export function matchesQuery(job: JobResult, query: string | undefined): boolean {
  if (!query) return true
  const hay = `${job.title} ${job.company ?? ""}`.toLowerCase()
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
