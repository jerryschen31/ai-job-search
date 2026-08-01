import {
  API_URL,
  jsonFetch,
  normalizeJob,
  matchesQuery,
  ageInDays,
  contentsToText,
  writeError,
  type MuseResponse,
  type MuseJob,
  type JobResult,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  category?: string
  level?: string
  company?: string
  jobage?: number
  page: number
  limit: number
  /** How many upstream pages to pull before local filtering. */
  pages: number
  withDescription?: boolean
  format: "json" | "table" | "plain"
}

export function buildUrl(opts: SearchOpts, page: number): string {
  const params = new URLSearchParams()
  params.set("page", String(page))
  // These are genuinely applied server-side by The Muse.
  if (opts.location) params.set("location", opts.location)
  if (opts.category) params.set("category", opts.category)
  if (opts.level) params.set("level", opts.level)
  if (opts.company) params.set("company", opts.company)
  return `${API_URL}?${params.toString()}`
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 42).padEnd(42)
    const company = (j.company || "—").slice(0, 20).padEnd(20)
    const loc = (j.location || "—").slice(0, 26).padEnd(26)
    const date = (j.date || "").slice(0, 10) || "—"
    return `${title} ${company} ${loc} ${date}`
  })
  const header =
    "TITLE".padEnd(42) + " " + "COMPANY".padEnd(20) + " " + "LOCATION".padEnd(26) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const raw: MuseJob[] = []
    let upstreamTotal = 0
    let pageCount = 0

    // The Muse pages at 20/response; pull `--pages` of them, then filter locally.
    for (let p = 1; p <= opts.pages; p++) {
      const data = await jsonFetch<MuseResponse>(buildUrl(opts, p))
      if (!data?.results) {
        if (p === 1) {
          writeError("The Muse returned no results list", "NO_RESULTS")
          return 1
        }
        break
      }
      upstreamTotal = data.total ?? upstreamTotal
      pageCount = data.page_count ?? pageCount
      raw.push(...data.results)
      if (data.results.length === 0) break
      if (pageCount && p >= pageCount) break
    }

    let jobs = raw.map(normalizeJob)
    jobs = jobs.filter((j) => matchesQuery(j, opts.query))

    if (opts.jobage !== undefined && opts.jobage > 0) {
      jobs = jobs.filter((j) => {
        const age = ageInDays(j.date)
        return age === null || age <= opts.jobage!
      })
    }

    jobs.sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0))

    const matched = jobs.length
    const start = (opts.page - 1) * opts.limit
    let pageJobs = jobs.slice(start, start + opts.limit)

    if (opts.withDescription) {
      const byId = new Map(raw.map((r) => [String(r.id), r]))
      pageJobs = pageJobs.map((j) => {
        const src = byId.get(j.id)
        return { ...j, description: src?.contents ? contentsToText(src.contents) : null }
      })
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(pageJobs) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        pageJobs
          .map(
            (j) =>
              `${j.title}\n  ${j.company || "—"} · ${j.location || "—"} · ${(j.date || "—").slice(0, 10)}\n  ${j.url}` +
              `${j.description ? "\n\n" + j.description : ""}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: pageJobs.length,
              matched,
              page: opts.page,
              upstreamFetched: raw.length,
              upstreamTotal,
              pagesFetched: Math.min(opts.pages, pageCount || opts.pages),
            },
            results: pageJobs,
          },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
