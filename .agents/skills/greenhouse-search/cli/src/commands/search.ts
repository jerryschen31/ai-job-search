import {
  API_BASE,
  jsonFetch,
  normalizeJob,
  matchesQuery,
  ageInDays,
  writeError,
  type GreenhouseJob,
  type JobResult,
} from "../helpers.js"
import { resolveCompanies } from "../companies.js"

export interface SearchOpts {
  query?: string
  location?: string
  companies?: string[]
  sector?: string
  jobage?: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

/** Fetch one board, tolerating a single company's failure without failing the run. */
async function fetchBoard(
  token: string,
  name: string,
): Promise<{ jobs: JobResult[]; error: string | null }> {
  try {
    const data = await jsonFetch<{ jobs?: GreenhouseJob[] }>(`${API_BASE}/${token}/jobs`)
    if (!data?.jobs) return { jobs: [], error: "not found" }
    return { jobs: data.jobs.map((j) => normalizeJob(j, token, name)), error: null }
  } catch (e) {
    return { jobs: [], error: e instanceof Error ? e.message : String(e) }
  }
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 44).padEnd(44)
    const company = (j.company || "—").slice(0, 20).padEnd(20)
    const loc = (j.location || "—").slice(0, 26).padEnd(26)
    const date = (j.date || "").slice(0, 10) || "—"
    return `${j.id.padEnd(10)} ${title} ${company} ${loc} ${date}`
  })
  const header =
    "ID".padEnd(10) + " " + "TITLE".padEnd(44) + " " + "COMPANY".padEnd(20) + " " +
    "LOCATION".padEnd(26) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const companies = resolveCompanies({ only: opts.companies, sector: opts.sector })
    if (companies.length === 0) {
      writeError("No companies to search (unknown --sector?)", "NO_COMPANIES")
      return 1
    }

    const settled = await Promise.all(
      companies.map((c) => fetchBoard(c.token, c.name)),
    )
    const failures = companies
      .map((c, i) => ({ token: c.token, error: settled[i].error }))
      .filter((f) => f.error !== null)

    let jobs = settled.flatMap((s) => s.jobs)

    if (opts.query) {
      jobs = jobs.filter((j) =>
        matchesQuery(`${j.title} ${j.department ?? ""} ${j.company ?? ""}`, opts.query),
      )
    }
    if (opts.location) {
      jobs = jobs.filter((j) => matchesQuery(j.location ?? "", opts.location))
    }
    if (opts.jobage !== undefined && opts.jobage > 0) {
      jobs = jobs.filter((j) => {
        const age = ageInDays(j.date)
        return age === null || age <= opts.jobage!
      })
    }

    // Newest first; undated postings sort last.
    jobs.sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0))

    const total = jobs.length
    const pageSize = opts.limit ?? 25
    const start = (opts.page - 1) * pageSize
    jobs = jobs.slice(start, start + pageSize)

    if (opts.format === "table") {
      process.stdout.write(renderTable(jobs) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        jobs
          .map(
            (j) =>
              `${j.title}\n  ${j.company || "—"} · ${j.location || "—"} · ${(j.date || "—").slice(0, 10)}\n  id: ${j.id} (${j.companyToken})\n  ${j.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: jobs.length,
              total,
              page: opts.page,
              companiesSearched: companies.length,
              ...(failures.length ? { failed: failures } : {}),
            },
            results: jobs,
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
