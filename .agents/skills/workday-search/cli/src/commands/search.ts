import {
  postJson,
  normalizePosting,
  ageInDays,
  locationMatches,
  titleMatchesAllTerms,
  writeError,
  MAX_PAGE_SIZE,
  type WorkdaySearchResponse,
  type JobResult,
} from "../helpers.js"
import { resolveEmployers, apiBase, siteBase, type Employer } from "../employers.js"

export interface SearchOpts {
  query?: string
  location?: string
  employers?: string[]
  sector?: string
  jobage?: number
  page: number
  limit: number
  /** Skip the local all-terms title filter and keep Workday's raw OR-matched ranking. */
  loose?: boolean
  format: "json" | "table" | "plain"
  /** Ad-hoc employer not in the curated list. */
  custom?: { tenant: string; wd: string; site: string }
}

/**
 * Fetch up to `want` postings for one employer, paging through Workday's
 * 20-per-request cap. Server-side keyword search means we only page over
 * results that already matched.
 */
async function fetchEmployer(
  e: Employer,
  query: string | undefined,
  want: number,
): Promise<{ jobs: JobResult[]; total: number; error: string | null }> {
  const url = `${apiBase(e)}/jobs`
  const base = siteBase(e)
  const jobs: JobResult[] = []
  let total = 0
  try {
    for (let offset = 0; offset < want; offset += MAX_PAGE_SIZE) {
      const data = await postJson<WorkdaySearchResponse>(url, {
        appliedFacets: {},
        limit: MAX_PAGE_SIZE,
        offset,
        searchText: query ?? "",
      })
      if (!data?.jobPostings) {
        if (offset === 0) return { jobs: [], total: 0, error: "no results returned" }
        break
      }
      total = data.total ?? total
      jobs.push(...data.jobPostings.map((p) => normalizePosting(p, e.key, e.name, base)))
      if (data.jobPostings.length < MAX_PAGE_SIZE) break
      if (jobs.length >= total) break
    }
    return { jobs, total, error: null }
  } catch (err) {
    return { jobs, total, error: err instanceof Error ? err.message : String(err) }
  }
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 46).padEnd(46)
    const company = (j.company || "—").slice(0, 18).padEnd(18)
    const loc = (j.location || "—").slice(0, 22).padEnd(22)
    const posted = (j.postedOn || "—").replace(/^Posted\s+/i, "").slice(0, 16)
    return `${title} ${company} ${loc} ${posted}`
  })
  const header =
    "TITLE".padEnd(46) + " " + "COMPANY".padEnd(18) + " " + "LOCATION".padEnd(22) + " POSTED"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    let employers: Employer[]
    if (opts.custom) {
      employers = [
        {
          key: "custom",
          name: opts.custom.tenant,
          sector: "tech",
          ...opts.custom,
        },
      ]
    } else {
      employers = resolveEmployers({ only: opts.employers, sector: opts.sector })
    }
    if (employers.length === 0) {
      writeError(
        "No employers to search. Check --employer keys against `employers`, or --sector.",
        "NO_EMPLOYERS",
      )
      return 1
    }

    // Pull enough from each employer to fill the requested page after filtering.
    // The strict title filter needs a deeper window than the page size to bite:
    // Workday ranks its OR-matched hits by its own relevance, so the titles that
    // contain every term routinely sit below the ones that share only one. Without
    // the overfetch a default-sized page would filter down to nothing while real
    // matches sat just past the horizon. Bounded so this stays a handful of extra
    // 20-row requests per employer, and the fetch loop still stops early once an
    // employer is exhausted.
    const strictQuery = Boolean(opts.query) && !opts.loose
    const pageWant = Math.max(opts.limit * opts.page, MAX_PAGE_SIZE)
    // max() so a large --limit is never *shrunk* by the overfetch cap.
    const want = strictQuery ? Math.max(pageWant, Math.min(pageWant * 5, 100)) : pageWant
    const settled = await Promise.all(employers.map((e) => fetchEmployer(e, opts.query, want)))

    const failures = employers
      .map((e, i) => ({ employer: e.key, error: settled[i].error }))
      .filter((f) => f.error !== null)

    let jobs = settled.flatMap((s) => s.jobs)
    const matchedTotal = settled.reduce((sum, s) => sum + s.total, 0)

    if (opts.query && !opts.loose) {
      jobs = jobs.filter((j) => titleMatchesAllTerms(j.title, opts.query!))
    }
    if (opts.location) {
      jobs = jobs.filter((j) => locationMatches(j.location, opts.location!))
    }
    if (opts.jobage !== undefined && opts.jobage > 0) {
      jobs = jobs.filter((j) => {
        const age = ageInDays(j.date)
        return age === null || age <= opts.jobage!
      })
    }

    jobs.sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0))

    const start = (opts.page - 1) * opts.limit
    const pageJobs = jobs.slice(start, start + opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(pageJobs) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        pageJobs
          .map(
            (j) =>
              `${j.title}\n  ${j.company} · ${j.location || "—"} · ${j.postedOn || "—"}\n  ${j.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: pageJobs.length,
              fetched: jobs.length,
              matchedTotal,
              page: opts.page,
              employersSearched: employers.length,
              // Surfaced so a low `fetched` against a high `matchedTotal` reads as
              // local narrowing rather than a thin server response.
              ...(opts.query ? { queryFilter: opts.loose ? "loose" : "all-terms-in-title" } : {}),
              ...(failures.length ? { failed: failures } : {}),
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
