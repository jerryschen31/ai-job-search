import {
  fetchMarkdown, parseCompensationMarkdown, companyUrl, roleUrl,
  ATTRIBUTION, writeError, type CompensationReport,
} from "../helpers.js"

export interface ReportOpts {
  kind: "company" | "role"
  target: string
  role?: string
  location?: string
  format: "json" | "markdown" | "table"
}

export function urlFor(opts: ReportOpts): string {
  return opts.kind === "company"
    ? companyUrl(opts.target, opts.role)
    : roleUrl(opts.target, opts.location)
}

export function renderTable(r: CompensationReport): string {
  const lines: string[] = []
  if (r.title) lines.push(r.title)
  if (r.scope) lines.push(r.scope)
  lines.push("")
  if (r.medianTotalCompensation !== null) {
    lines.push(`Median total compensation: $${r.medianTotalCompensation.toLocaleString("en-US")}`)
  }
  if (r.lastUpdated) lines.push(`Last updated: ${r.lastUpdated}`)
  if (r.levels.length) {
    lines.push("")
    const width = Math.max(...r.levels.map((l) => l.level.length), 5)
    lines.push("LEVEL".padEnd(width) + "  MEDIAN TOTAL COMP")
    lines.push("-".repeat(width + 20))
    for (const l of r.levels) {
      lines.push(
        l.level.padEnd(width) +
          "  " +
          (l.medianTotalCompensation !== null
            ? `$${l.medianTotalCompensation.toLocaleString("en-US")}`
            : l.raw),
      )
    }
  }
  if (r.sourceUrl) {
    lines.push("")
    lines.push(`Source page: ${r.sourceUrl}`)
  }
  lines.push("")
  lines.push(ATTRIBUTION)
  return lines.join("\n")
}

export async function runReport(opts: ReportOpts): Promise<number> {
  const url = urlFor(opts)
  try {
    const md = await fetchMarkdown(url)
    if (opts.format === "markdown") {
      // Pass through Levels.fyi's own document, which already ends with its
      // attribution and licence sections.
      process.stdout.write(md.endsWith("\n") ? md : md + "\n")
      return 0
    }
    const report = parseCompensationMarkdown(md)
    if (opts.format === "table") {
      process.stdout.write(renderTable(report) + "\n")
    } else {
      process.stdout.write(JSON.stringify(report, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "REPORT_FAILED")
    return 1
  }
}
