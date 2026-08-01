import {
  fetchNextData, normalizeJob, jobUrl, descriptionToText, writeError,
  type NextDataShape,
} from "../helpers.js"

export interface DetailOpts {
  input: string
  format: "json" | "plain"
}

/** Accept a bare job id or a Levels.fyi ?jobId= URL. */
export function resolveJobId(input: string): string | null {
  const url = input.match(/[?&]jobId=(\d+)/)
  if (url) return url[1]
  if (/^\d{6,}$/.test(input)) return input
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = resolveJobId(opts.input)
  if (!id) {
    writeError(
      `Could not parse a Levels.fyi job id from "${opts.input}". Pass a numeric job id ` +
        `or a https://www.levels.fyi/jobs?jobId=<id> URL.`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const data = await fetchNextData<NextDataShape>(jobUrl(id))
    const d = data.props?.pageProps?.initialJobDetails
    if (!d || String(d.id) !== id) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    // The detail payload nests company under `name`/`slug`, unlike search.
    const base = normalizeJob(d, {
      companyName: d.companyInfo?.name,
      companySlug: d.companyInfo?.slug,
    })
    const full = {
      ...base,
      employmentTypes: d.employmentTypes ?? null,
      jobFamily: d.jobFamilySlug ?? null,
      description: d.description ? descriptionToText(d.description) : null,
    }

    if (opts.format === "plain") {
      const lines = [
        full.title,
        `${full.company || "—"} · ${full.location || "—"}`,
        "",
        full.totalSalary ? `Total comp: ${full.totalSalary}` : "",
        full.baseSalary ? `Base: ${full.baseSalary}` : "",
        full.workArrangement ? `Work arrangement: ${full.workArrangement}` : "",
        full.employmentTypes?.length ? `Employment: ${full.employmentTypes.join(", ")}` : "",
        full.date ? `Posted: ${full.date.slice(0, 10)}` : "",
        "",
        full.description || "(no description)",
        "",
        `URL: ${full.url}`,
        full.applicationUrl ? `Apply: ${full.applicationUrl}` : "",
        "",
        full.attribution,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(full, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
