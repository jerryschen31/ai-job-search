import {
  API_BASE,
  jsonFetch,
  normalizeJob,
  matchesQuery,
  ageInDays,
  writeError,
  type LeverJob,
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

async function fetchBoard(
  slug: string,
  name: string,
): Promise<{ jobs: JobResult[]; error: string | null }> {
  try {
    const data = await jsonFetch<LeverJob[]>(`${API_BASE}/${slug}?mode=json`)
    if (!Array.isArray(data)) return { jobs: [], error: "not found" }
    return { jobs: data.map((j) => normalizeJob(j, slug, name)), error: null }
  } catch (e) {
    return { jobs: [], error: e instanceof Error ? e.message : String(e) }
  }
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 42).padEnd(42)
    const company = (j.company || "—").slice(0, 16).padEnd(16)
    const loc = (j.location || "—").slice(0, 24).padEnd(24)
    const date = (j.date || "").slice(0, 10) || "—"
    return `${title} ${company} ${loc} ${date}`
  })
  const header =
    "TITLE".padEnd(42) + " " + "COMPANY".padEnd(16) + " " + "LOCATION".padEnd(24) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const companies = resolveCompanies({ only: opts.companies, sector: opts.sector })
    if (companies.length === 0) {
      writeError("No companies to search (unknown --sector?)", "NO_COMPANIES")
      return 1
    }

    const settled = await Promise.all(companies.map((c) => fetchBoard(c.slug, c.name)))
    const failures = companies
      .map((c, i) => ({ slug: c.slug, error: settled[i].error }))
      .filter((f) => f.error !== null)

    let jobs = settled.flatMap((s) => s.jobs)

    if (opts.query) {
      jobs = jobs.filter((j) =>
        matchesQuery(
          `${j.title} ${j.department ?? ""} ${j.team ?? ""} ${j.company}`,
          opts.query,
        ),
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
              `${j.title}\n  ${j.company} · ${j.location || "—"} · ${(j.date || "—").slice(0, 10)}` +
              `${j.salary ? " · " + j.salary : ""}\n  id: ${j.id}\n  ${j.url}`,
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
