import {
  API_BASE,
  jsonFetch,
  normalizeJob,
  writeError,
  type AshbyJob,
} from "../helpers.js"
import { COMPANIES } from "../companies.js"

export interface DetailOpts {
  input: string
  company?: string
  format: "json" | "plain"
}

/**
 * Ashby has no single-posting endpoint — the whole board comes back in one
 * response — so detail needs the org slug plus the job id. A jobs.ashbyhq.com
 * URL carries both; a bare UUID needs --company.
 */
export function resolveTarget(
  input: string,
  company?: string,
): { slug: string; id: string } | null {
  const url = input.match(/jobs\.ashbyhq\.com\/([^/?#]+)\/([0-9a-f-]{16,})/i)
  if (url) return { slug: url[1], id: url[2] }
  if (/^[0-9a-f-]{16,}$/i.test(input) && company) return { slug: company, id: input }
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const target = resolveTarget(opts.input, opts.company)
  if (!target) {
    writeError(
      `Could not resolve an org slug and job id from "${opts.input}". Pass a full ` +
        `jobs.ashbyhq.com posting URL, or a bare job id together with --company <slug>.`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const data = await jsonFetch<{ jobs?: AshbyJob[] }>(
      `${API_BASE}/${target.slug}?includeCompensation=true`,
    )
    if (!data?.jobs) {
      writeError(`Job board "${target.slug}" not found`, "NOT_FOUND")
      return 1
    }
    const job = data.jobs.find((j) => j.id === target.id)
    if (!job) {
      writeError("Job not found on that board", "NOT_FOUND")
      return 1
    }
    const known = COMPANIES.find((c) => c.slug === target.slug)
    const base = normalizeJob(job, target.slug, known?.name ?? target.slug)
    const full = { ...base, description: job.descriptionPlain ?? null }

    if (opts.format === "plain") {
      const lines = [
        full.title,
        `${full.company} · ${full.location || "—"}`,
        "",
        full.department ? `Department: ${full.department}` : "",
        full.employmentType ? `Employment: ${full.employmentType}` : "",
        full.workplaceType ? `Workplace: ${full.workplaceType}` : "",
        full.salary ? `Compensation: ${full.salary}` : "",
        full.date ? `Posted: ${full.date.slice(0, 10)}` : "",
        "",
        full.description || "(no description)",
        "",
        `URL: ${full.url}`,
        full.applyUrl ? `Apply: ${full.applyUrl}` : "",
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
