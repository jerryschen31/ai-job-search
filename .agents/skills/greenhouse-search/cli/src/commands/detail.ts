import {
  API_BASE,
  jsonFetch,
  normalizeJob,
  contentToText,
  writeError,
  type GreenhouseJob,
} from "../helpers.js"
import { COMPANIES } from "../companies.js"

export interface DetailOpts {
  input: string
  company?: string
  format: "json" | "plain"
}

/**
 * Greenhouse detail needs BOTH a board token and a job id. A full
 * job-boards.greenhouse.io URL carries both; a bare id needs --company.
 */
export function resolveTarget(
  input: string,
  company?: string,
): { token: string; id: string } | null {
  const url = input.match(
    /(?:job-)?boards(?:-api)?\.greenhouse\.io\/(?:v1\/boards\/)?([^/]+)\/jobs\/(\d+)/i,
  )
  if (url) return { token: url[1], id: url[2] }
  if (/^\d+$/.test(input) && company) return { token: company, id: input }
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const target = resolveTarget(opts.input, opts.company)
  if (!target) {
    writeError(
      `Could not resolve a board token and job id from "${opts.input}". Pass a full ` +
        `greenhouse job URL, or a bare job id together with --company <token>.`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const job = await jsonFetch<GreenhouseJob>(
      `${API_BASE}/${target.token}/jobs/${target.id}`,
    )
    if (!job) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const known = COMPANIES.find((c) => c.token === target.token)
    const base = normalizeJob(job, target.token, known?.name ?? target.token)
    const description = job.content ? contentToText(job.content) : null
    const full = { ...base, description }

    if (opts.format === "plain") {
      const lines = [
        full.title,
        `${full.company || "—"} · ${full.location || "—"}`,
        "",
        full.department ? `Department: ${full.department}` : "",
        full.date ? `Posted: ${full.date.slice(0, 10)}` : "",
        "",
        description || "(no description)",
        "",
        `URL: ${full.url}`,
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
