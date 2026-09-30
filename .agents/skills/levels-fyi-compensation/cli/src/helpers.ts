// Data source: Levels.fyi's LLM-readable markdown routes.
//
// Levels.fyi's robots.txt and /llms.txt explicitly invite agent access and
// document these routes: appending `.md` to a salary or job-family URL returns
// a structured markdown document instead of a rendered page. This skill uses
// only those sanctioned routes — it does not scrape the HTML site.
//
// ATTRIBUTION IS MANDATORY. Every markdown document ends with:
//   "Use of this data requires attribution to Levels.fyi.
//    Include: 'Data source: Levels.fyi (https://www.levels.fyi)'"
// The CLI therefore emits `attribution` and `sourceUrl` on every result and
// prints an attribution line in markdown/table output.

export const SITE = "https://www.levels.fyi"
export const ATTRIBUTION = "Data source: Levels.fyi (https://www.levels.fyi)"
export const DATA_LICENSE_URL = "https://www.levels.fyi/offerings/data/"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/**
 * Fetch a Levels.fyi `.md` route.
 *
 * Levels.fyi rate-limits by returning HTTP 200 with a ZERO-LENGTH body rather
 * than a 429, so an empty response is treated as throttling: back off, retry,
 * and finally report it plainly instead of surfacing "empty document".
 */
export async function fetchMarkdown(url: string): Promise<string> {
  const maxRetries = 4
  let delay = 3000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/markdown,text/plain,text/html;q=0.9",
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
      delay = Math.min(delay * 2, 20000)
      continue
    }
    if (response.status === 404) {
      throw new Error(
        `Not found: ${url}. Check the company slug or job-family slug — ` +
          `Levels.fyi uses its own slugs (e.g. "roche", "software-engineer").`,
      )
    }
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    const text = await response.text()
    if (text.trim() !== "") return text
    if (attempt === maxRetries) {
      throw new Error(
        "Levels.fyi returned an empty document. This is how it signals rate " +
          "limiting (HTTP 200, zero-length body) — wait a minute and retry, and " +
          "keep request volume low.",
      )
    }
    await new Promise((r) => setTimeout(r, delay))
    delay = Math.min(delay * 2, 20000)
  }
  throw new Error("Request failed after max retries")
}

export interface LevelRow {
  level: string
  medianTotalCompensation: number | null
  raw: string
}

export interface CompensationReport {
  title: string | null
  sourceUrl: string | null
  scope: string | null
  location: string | null
  currency: string | null
  generated: string | null
  summary: string | null
  medianTotalCompensation: number | null
  lastUpdated: string | null
  levels: LevelRow[]
  attribution: string
  dataLicense: string
}

/** Parse "$203,864" / "$138.1K" / "203000" into a number. */
export function parseMoney(text: string | null | undefined): number | null {
  if (!text) return null
  const m = text.replace(/,/g, "").match(/\$?\s*([\d.]+)\s*([KkMm])?/)
  if (!m) return null
  const n = parseFloat(m[1])
  if (isNaN(n)) return null
  const suffix = (m[2] ?? "").toLowerCase()
  if (suffix === "k") return Math.round(n * 1000)
  if (suffix === "m") return Math.round(n * 1000000)
  return Math.round(n)
}

function field(md: string, label: string): string | null {
  const re = new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.+)$`, "im")
  const m = md.match(re)
  return m ? m[1].trim() : null
}

/**
 * Return the body of a `##`/`###` section by heading text, up to the next
 * heading of the same-or-shallower depth (or end of document).
 *
 * Deliberately a line scan rather than a regex: a lookahead terminator like
 * `(?=^##\s|\Z)` silently fails in JavaScript, because `\Z` is not an anchor
 * here — it is an identity escape matching a literal "Z". That made any section
 * appearing LAST in a document unmatchable.
 */
function section(md: string, heading: string): string | null {
  const lines = md.split("\n")
  const wanted = heading.trim().toLowerCase()
  let start = -1
  let depth = 0

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,})\s*(.+?)\s*$/)
    if (!m) continue
    if (start === -1) {
      if (m[2].toLowerCase() === wanted) {
        start = i + 1
        depth = m[1].length
      }
      continue
    }
    if (m[1].length <= depth) {
      return lines.slice(start, i).join("\n").trim() || null
    }
  }
  return start === -1 ? null : lines.slice(start).join("\n").trim() || null
}

/** Parse a Levels.fyi salary markdown document into structured data. */
export function parseCompensationMarkdown(md: string): CompensationReport {
  const titleMatch = md.match(/^#\s*(.+)$/m)

  const summary = section(md, "Summary")

  // "- Median Total Compensation: $203,000"
  const medianLine = md.match(/Median Total Compensation:\s*([^\n]+)/i)
  const lastUpdated = md.match(/Last Updated:\s*([^\n]+)/i)

  const levels: LevelRow[] = []
  const levelsSection = section(md, "Levels Breakdown") ?? section(md, "Key Breakdowns")
  if (levelsSection) {
    for (const line of levelsSection.split("\n")) {
      const cells = line.split("|").map((c) => c.trim()).filter((c) => c !== "")
      if (cells.length < 2) continue
      // Skip the header and the |---|---| separator row.
      if (/^-{2,}$/.test(cells[1].replace(/\s/g, "")) || /^-+$/.test(cells[0])) continue
      if (/^level$/i.test(cells[0])) continue
      const value = parseMoney(cells[1])
      if (value === null && !/\$/.test(cells[1])) continue
      levels.push({ level: cells[0], medianTotalCompensation: value, raw: cells[1] })
    }
  }

  return {
    title: titleMatch ? titleMatch[1].replace(/^Levels\.fyi\s*[–-]\s*/, "").trim() : null,
    sourceUrl: field(md, "URL"),
    scope: field(md, "Scope"),
    location: field(md, "Location"),
    currency: field(md, "Currency"),
    generated: field(md, "Generated"),
    summary: summary ? summary.replace(/\s+/g, " ").trim() : null,
    medianTotalCompensation: parseMoney(medianLine?.[1]),
    lastUpdated: lastUpdated ? lastUpdated[1].trim() : null,
    levels,
    attribution: ATTRIBUTION,
    dataLicense: DATA_LICENSE_URL,
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Company salary doc, optionally narrowed to one job family. */
export function companyUrl(company: string, role?: string): string {
  const base = `${SITE}/companies/${slugify(company)}/salaries`
  return role ? `${base}/${slugify(role)}.md` : `${base}.md`
}

/** Job-family salary doc, optionally scoped to a location. */
export function roleUrl(family: string, location?: string): string {
  const base = `${SITE}/t/${slugify(family)}`
  return location ? `${base}/locations/${slugify(location)}.md` : `${base}.md`
}
