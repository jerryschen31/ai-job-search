// Data source: the public Workday "CXS" endpoint that every Workday-hosted
// career site uses to render its own job search. It is unauthenticated JSON,
// so this skill does no HTML scraping of the search results.
//
// Unlike the ATS APIs (Greenhouse/Ashby/Lever), Workday supports SERVER-SIDE
// keyword search via `searchText`, so queries are pushed to the employer rather
// than filtered locally.

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/** Workday rejects page sizes above 20 (the response comes back without jobPostings). */
export const MAX_PAGE_SIZE = 20

async function request(url: string, init: RequestInit): Promise<Response> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
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
    return response
  }
  throw new Error("Request failed after max retries")
}

export async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  const response = await request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  return (await response.json()) as T
}

export async function getJson<T>(url: string): Promise<T | null> {
  const response = await request(url, { method: "GET" })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  return (await response.json()) as T
}

export interface WorkdayPosting {
  title?: string
  externalPath?: string
  locationsText?: string
  postedOn?: string
  timeType?: string
  bulletFields?: string[]
}

export interface WorkdaySearchResponse {
  total?: number
  jobPostings?: WorkdayPosting[]
}

export interface WorkdayJobInfo {
  title?: string
  jobDescription?: string
  location?: string
  postedOn?: string
  startDate?: string
  timeType?: string
  jobReqId?: string
  externalUrl?: string
  country?: { descriptor?: string }
}

export interface JobResult {
  id: string | null
  title: string
  company: string
  employerKey: string
  location: string | null
  postedOn: string | null
  date: string | null
  timeType: string | null
  url: string
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

/** Workday job descriptions are HTML; render them as readable plain text. */
export function descriptionToText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d|tr)>/gi, "\n")
  return decodeHtmlEntities(
    withBreaks
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n *(?:\s*\n)*/g, "\n"),
  ).trim()
}

/**
 * Turn Workday's relative "Posted 2 Days Ago" text into an approximate ISO date.
 * Workday's search response carries no absolute timestamp, so this is the only
 * way to filter by age without fetching every posting's detail page. Returns
 * null when the phrasing isn't recognized (e.g. "Posted Today" variants are
 * handled, but anything unexpected stays null rather than guessing).
 */
export function postedOnToIso(postedOn: string | null | undefined, now = Date.now()): string | null {
  if (!postedOn) return null
  const text = postedOn.toLowerCase()
  if (/posted\s+today/.test(text)) return new Date(now).toISOString()
  if (/posted\s+yesterday/.test(text)) return new Date(now - 86400000).toISOString()
  const m = text.match(/posted\s+(\d+)\+?\s+(day|days|month|months|year|years)\s+ago/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  if (isNaN(n)) return null
  const unit = m[2]
  const days = unit.startsWith("day") ? n : unit.startsWith("month") ? n * 30 : n * 365
  return new Date(now - days * 86400000).toISOString()
}

export function ageInDays(iso: string | null): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (isNaN(t)) return null
  return (Date.now() - t) / 86400000
}

export function normalizePosting(
  p: WorkdayPosting,
  employerKey: string,
  companyName: string,
  siteBaseUrl: string,
): JobResult {
  const path = p.externalPath ?? ""
  return {
    id: p.bulletFields?.[0] ?? null,
    title: p.title ? decodeHtmlEntities(p.title) : "(untitled)",
    company: companyName,
    employerKey,
    location: p.locationsText ? decodeHtmlEntities(p.locationsText) : null,
    postedOn: p.postedOn ?? null,
    date: postedOnToIso(p.postedOn),
    timeType: p.timeType ?? null,
    // The public posting URL is the career-site base plus the externalPath —
    // this matches the `externalUrl` the detail endpoint returns.
    url: path ? `${siteBaseUrl}${path}` : siteBaseUrl,
  }
}
