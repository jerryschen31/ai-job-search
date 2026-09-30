import { API_BASE, jsonFetch, normalizeJob, buildDescription, writeError, type LeverJob } from "../helpers.js"
import { COMPANIES } from "../companies.js"

export interface DetailOpts {
  input: string
  company?: string
  format: "json" | "plain"
}

/**
 * Lever DOES have a per-posting endpoint (/v0/postings/<org>/<id>), but it still
 * needs the org slug, so a bare id requires --company.
 */
export function resolveTarget(
  input: string,
  company?: string,
): { slug: string; id: string } | null {
  const url = input.match(/(?:jobs\.lever\.co|api\.lever\.co\/v0\/postings)\/([^/?#]+)\/([0-9a-f-]{16,})/i)
  if (url) return { slug: url[1], id: url[2] }
  if (/^[0-9a-f-]{16,}$/i.test(input) && company) return { slug: company, id: input }
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const target = resolveTarget(opts.input, opts.company)
  if (!target) {
    writeError(
      `Could not resolve an org slug and job id from "${opts.input}". Pass a full ` +
        `jobs.lever.co posting URL, or a bare job id together with --company <slug>.`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const job = await jsonFetch<LeverJob>(`${API_BASE}/${target.slug}/${target.id}?mode=json`)
    if (!job || !job.id) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const known = COMPANIES.find((c) => c.slug === target.slug)
    const base = normalizeJob(job, target.slug, known?.name ?? target.slug)
    const full = { ...base, description: buildDescription(job) }

    if (opts.format === "plain") {
      const lines = [
        full.title,
        `${full.company} · ${full.location || "—"}`,
        "",
        full.department ? `Department: ${full.department}` : "",
        full.team ? `Team: ${full.team}` : "",
        full.commitment ? `Commitment: ${full.commitment}` : "",
        full.workplaceType ? `Workplace: ${full.workplaceType}` : "",
        full.salary ? `Salary: ${full.salary}` : "",
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
