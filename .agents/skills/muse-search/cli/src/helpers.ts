// Data source: The Muse's public jobs API (themuse.com/api/public/jobs).
// Documented, unauthenticated JSON — no HTML parsing.
//
// The Muse has NO free-text keyword parameter. It filters by a fixed taxonomy
// (category / level / location / company), all of which are genuinely applied
// server-side (verified: adding `category` drops the total from ~405k to ~18k).
// Keyword narrowing therefore happens locally over the fetched pages.

export const API_URL = "https://www.themuse.com/api/public/jobs"

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

export interface MuseJob {
  id: number
  name: string
  type?: string | null
  publication_date?: string | null
  contents?: string | null
  locations?: Array<{ name?: string }> | null
  categories?: Array<{ name?: string }> | null
  levels?: Array<{ name?: string; short_name?: string }> | null
  tags?: Array<{ name?: string }> | null
  company?: { id?: number; name?: string; short_name?: string } | null
  refs?: { landing_page?: string } | null
}

export interface MuseResponse {
  page?: number
  page_count?: number
  items_per_page?: number
  total?: number
  results?: MuseJob[]
}

export interface JobResult {
  id: string
  title: string
  company: string | null
  companySlug: string | null
  location: string | null
  date: string | null
  url: string
  category: string | null
  level: string | null
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

export function contentsToText(html: string): string {
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

export function formatLocations(job: MuseJob): string | null {
  const names = (job.locations ?? [])
    .map((l) => l?.name)
    .filter((n): n is string => !!n && n.trim() !== "")
  const unique = [...new Set(names)]
  return unique.length ? unique.join("; ") : null
}

/**
 * The Muse exposes a job's public page via refs.landing_page. Fall back to a
 * constructed themuse.com/jobs URL only when that ref is absent, so the result
 * always carries a link the user can open.
 */
export function jobUrl(job: MuseJob): string {
  const ref = job.refs?.landing_page
  if (ref && ref.trim() !== "") return ref
  const slug = job.company?.short_name
  return slug
    ? `https://www.themuse.com/jobs/${slug}`
    : `https://www.themuse.com/search/keyword/${encodeURIComponent(job.name ?? "")}`
}

export function normalizeJob(job: MuseJob): JobResult {
  return {
    id: String(job.id),
    title: decodeHtmlEntities(job.name ?? "(untitled)"),
    company: job.company?.name ? decodeHtmlEntities(job.company.name) : null,
    companySlug: job.company?.short_name ?? null,
    location: formatLocations(job),
    date: job.publication_date ?? null,
    url: jobUrl(job),
    category: job.categories?.[0]?.name ?? null,
    level: job.levels?.[0]?.name ?? null,
  }
}

/** Local keyword narrowing — The Muse has no server-side free-text search. */
export function matchesQuery(job: JobResult, query: string | undefined): boolean {
  if (!query) return true
  const hay = `${job.title} ${job.category ?? ""} ${job.company ?? ""} ${job.level ?? ""}`.toLowerCase()
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
