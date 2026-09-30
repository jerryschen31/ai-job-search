import {
  API_URL,
  ATTRIBUTION,
  jsonFetch,
  normalizeJob,
  matchesQuery,
  ageInDays,
  descriptionToText,
  writeError,
  type RemotiveResponse,
  type JobResult,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  category?: string
  jobage?: number
  page: number
  limit: number
  withDescription?: boolean
  format: "json" | "table" | "plain"
}

/**
 * Build the single upstream request.
 *
 * Deliberately parameterless. Remotive's free public API ignores `search`,
 * `category`, and `limit` entirely — verified: every combination returns the
 * same fixed feed (~34 jobs, identical first result). Their filtered API is a
 * paid product. Sending those params would imply server-side filtering that
 * does not happen, so this CLI fetches the feed once and filters everything
 * locally, which also honours Remotive's request-volume guidance.
 */
export function buildUrl(_opts: SearchOpts): string {
  return API_URL
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 44).padEnd(44)
    const company = (j.company || "—").slice(0, 20).padEnd(20)
    const loc = (j.location || "—").slice(0, 24).padEnd(24)
    const date = (j.date || "").slice(0, 10) || "—"
    return `${title} ${company} ${loc} ${date}`
  })
  const header =
    "TITLE".padEnd(44) + " " + "COMPANY".padEnd(20) + " " + "LOCATION".padEnd(24) + " DATE"
  return [header, "-".repeat(header.length), ...rows, "", ATTRIBUTION].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const data = await jsonFetch<RemotiveResponse>(buildUrl(opts))
    if (!data?.jobs) {
      writeError("Remotive returned no job list", "NO_RESULTS")
      return 1
    }

    const raw = data.jobs
    let jobs = raw.map(normalizeJob)

    // All filtering is local — the upstream feed is unfiltered (see buildUrl).
    jobs = jobs.filter((j) => matchesQuery(j, opts.query))

    if (opts.category) {
      const needle = opts.category.toLowerCase()
      jobs = jobs.filter((j) => (j.category ?? "").toLowerCase().includes(needle))
    }
    if (opts.location) {
      const needle = opts.location.toLowerCase()
      jobs = jobs.filter((j) => (j.location ?? "").toLowerCase().includes(needle))
    }
    if (opts.jobage !== undefined && opts.jobage > 0) {
      jobs = jobs.filter((j) => {
        const age = ageInDays(j.date)
        return age === null || age <= opts.jobage!
      })
    }

    jobs.sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0))

    const total = jobs.length
    const start = (opts.page - 1) * opts.limit
    let pageJobs = jobs.slice(start, start + opts.limit)

    if (opts.withDescription) {
      const byId = new Map(raw.map((r) => [String(r.id), r]))
      pageJobs = pageJobs.map((j) => {
        const src = byId.get(j.id)
        return { ...j, description: src?.description ? descriptionToText(src.description) : null }
      })
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(pageJobs) + "\n")
    } else if (opts.format === "plain") {
      const body = pageJobs
        .map(
          (j) =>
            `${j.title}\n  ${j.company || "—"} · ${j.location || "—"} · ${(j.date || "—").slice(0, 10)}` +
            `${j.salary ? " · " + j.salary : ""}\n  ${j.url}` +
            `${j.description ? "\n\n" + j.description : ""}`,
        )
        .join("\n\n")
      process.stdout.write(`${body}\n\n${ATTRIBUTION}\n`)
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: pageJobs.length,
              total,
              page: opts.page,
              upstreamReturned: raw.length,
              attribution: ATTRIBUTION,
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
