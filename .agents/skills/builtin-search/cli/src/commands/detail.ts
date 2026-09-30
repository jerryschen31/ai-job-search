import { htmlFetch, parseJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  input: string
  format: "json" | "plain"
}

/**
 * builtin.com job URLs require the correct slug in the path (`/job/<slug>/<id>`) —
 * a bare numeric ID 404s. So unlike LinkedIn, `detail` requires the full URL, as
 * returned by `search`'s `url` field, not just the ID.
 */
function normalizeUrl(input: string): { url: string; id: string } | null {
  const full = input.match(/^https?:\/\/(?:www\.)?builtin\.com\/job\/[^/]+\/(\d+)\/?$/i)
  if (full) return { url: input, id: full[1] }
  const relative = input.match(/^\/job\/[^/]+\/(\d+)\/?$/i)
  if (relative) return { url: `https://builtin.com${input}`, id: relative[1] }
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const normalized = normalizeUrl(opts.input)
  if (!normalized) {
    writeError(
      `"${opts.input}" is not a full builtin.com job URL. This portal requires the ` +
        `slug in the path (e.g. https://builtin.com/job/senior-engineer/1234567) — ` +
        `pass the "url" field from a search result, not just the numeric id.`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const html = await htmlFetch(normalized.url)
    if (!html) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, normalized.id, normalized.url)
    if (!job) {
      writeError("Could not parse job posting data from the page", "PARSE_FAILED")
      return 1
    }

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        "",
        job.salary ? `Salary: ${job.salary}` : "",
        job.employmentType ? `Employment: ${job.employmentType}` : "",
        job.industries?.length ? `Industries: ${job.industries.join(", ")}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
