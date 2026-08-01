import {
  SITE, ATTRIBUTION, fetchNextData, flattenResults, matchesQuery, ageInDays,
  writeError, type NextDataShape, type JobResult,
} from "../helpers.js"
import { isKnownFamily, suggestFamilies } from "../families.js"

export interface SearchOpts {
  family?: string
  query?: string
  location?: string
  jobage?: number
  page: number
  limit: number
  format: "json" | "table" | "plain"
}

export function buildUrl(opts: SearchOpts): string {
  // Filtering is PATH-based: /jobs/title/<family>. Query params such as
  // ?searchText= and ?limit= are ignored by Levels.fyi (verified live).
  return opts.family ? `${SITE}/jobs/title/${opts.family}` : `${SITE}/jobs`
}

function renderTable(jobs: JobResult[]): string {
  if (jobs.length === 0) return "No results."
  const rows = jobs.map((j) => {
    const title = (j.title || "").slice(0, 40).padEnd(40)
    const company = (j.company || "—").slice(0, 18).padEnd(18)
    const loc = (j.location || "—").slice(0, 22).padEnd(22)
    const comp = (j.totalSalary || j.baseSalary || "—").slice(0, 14)
    return `${title} ${company} ${loc} ${comp}`
  })
  const header =
    "TITLE".padEnd(40) + " " + "COMPANY".padEnd(18) + " " + "LOCATION".padEnd(22) + " TOTAL COMP"
  return [header, "-".repeat(header.length), ...rows, "", ATTRIBUTION].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  if (opts.family && !isKnownFamily(opts.family)) {
    const suggestions = suggestFamilies(opts.family)
    writeError(
      `Unknown job family "${opts.family}". Levels.fyi filters by a fixed taxonomy, ` +
        `not free text.` +
        (suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : "") +
        ` Run \`families\` to list all of them.`,
      "BAD_FAMILY",
    )
    return 1
  }
  try {
    const data = await fetchNextData<NextDataShape>(buildUrl(opts))
    const results = data.props?.pageProps?.initialJobsData?.results
    if (!results) {
      writeError("No job data found on the Levels.fyi page", "NO_RESULTS")
      return 1
    }

    let jobs = flattenResults(results)
    const fetched = jobs.length

    jobs = jobs.filter((j) => matchesQuery(j, opts.query))
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

    const matched = jobs.length
    const start = (opts.page - 1) * opts.limit
    const pageJobs = jobs.slice(start, start + opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(pageJobs) + "\n")
    } else if (opts.format === "plain") {
      const body = pageJobs
        .map(
          (j) =>
            `${j.title}\n  ${j.company || "—"} · ${j.location || "—"} · ${(j.date || "—").slice(0, 10)}` +
            `${j.totalSalary ? " · total " + j.totalSalary : ""}\n  ${j.url}` +
            `${j.applicationUrl ? "\n  apply: " + j.applicationUrl : ""}`,
        )
        .join("\n\n")
      process.stdout.write(`${body}\n\n${ATTRIBUTION}\n`)
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: pageJobs.length,
              matched,
              fetched,
              page: opts.page,
              family: opts.family ?? null,
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
