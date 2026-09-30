import {
  getJson,
  descriptionToText,
  decodeHtmlEntities,
  writeError,
  type WorkdayJobInfo,
} from "../helpers.js"
import { EMPLOYERS, apiBase, siteBase, type Employer } from "../employers.js"

export interface DetailOpts {
  input: string
  format: "json" | "plain"
}

export interface ParsedUrl {
  tenant: string
  wd: string
  site: string
  path: string
}

/**
 * Workday posting URLs look like
 *   https://<tenant>.<wd>.myworkdayjobs.com/<site>/job/<Location>/<Title>_<reqId>
 * and the JSON for one lives at
 *   https://<tenant>.<wd>.myworkdayjobs.com/wday/cxs/<tenant>/<site>/job/...
 * so everything needed is already in the public URL — no --employer flag needed.
 * Also accepts an en-US-style locale segment (/en-US/<site>/job/...).
 */
export function parseWorkdayUrl(input: string): ParsedUrl | null {
  const m = input.match(
    /^https?:\/\/([^.]+)\.(wd\d+)\.myworkdayjobs\.com\/(?:[a-z]{2}-[A-Z]{2}\/)?([^/]+)(\/job\/.+)$/,
  )
  if (!m) return null
  return { tenant: m[1], wd: m[2], site: m[3], path: m[4] }
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const parsed = parseWorkdayUrl(opts.input)
  if (!parsed) {
    writeError(
      `"${opts.input}" is not a Workday posting URL. Expected something like ` +
        `https://<tenant>.wd3.myworkdayjobs.com/<site>/job/<Location>/<Title>_<reqId> ` +
        `— pass the "url" field from a search result.`,
      "BAD_URL",
    )
    return 1
  }
  const target = { tenant: parsed.tenant, wd: parsed.wd, site: parsed.site }
  try {
    const data = await getJson<{ jobPostingInfo?: WorkdayJobInfo }>(
      `${apiBase(target)}${parsed.path}`,
    )
    const info = data?.jobPostingInfo
    if (!info) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const known: Employer | undefined = EMPLOYERS.find(
      (e) => e.tenant === parsed.tenant && e.site === parsed.site,
    )
    const description = info.jobDescription ? descriptionToText(info.jobDescription) : null
    const job = {
      id: info.jobReqId ?? null,
      title: info.title ? decodeHtmlEntities(info.title) : "(untitled)",
      company: known?.name ?? parsed.tenant,
      employerKey: known?.key ?? parsed.tenant,
      location: info.location ? decodeHtmlEntities(info.location) : null,
      country: info.country?.descriptor ?? null,
      postedOn: info.postedOn ?? null,
      date: info.startDate ?? null,
      timeType: info.timeType ?? null,
      // Prefer Workday's own externalUrl; fall back to reconstructing it.
      url: info.externalUrl ?? `${siteBase(target)}${parsed.path}`,
      description,
    }

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company} · ${job.location || "—"}${job.country ? ` · ${job.country}` : ""}`,
        "",
        job.id ? `Req ID: ${job.id}` : "",
        job.timeType ? `Time type: ${job.timeType}` : "",
        job.postedOn ? `Posted: ${job.postedOn}` : "",
        job.date ? `Start date: ${job.date}` : "",
        "",
        description || "(no description)",
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
