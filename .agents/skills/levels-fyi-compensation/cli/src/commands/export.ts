import {
  fetchMarkdown, parseCompensationMarkdown, companyUrl,
  ATTRIBUTION, writeError,
} from "../helpers.js"

export interface ExportOpts {
  companies: string[]
  role?: string
  out?: string
}

/** "bristol-myers-squibb" -> "Bristol Myers Squibb" */
export function prettifyCompany(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/**
 * Emit the repo's `salary_data.json` shape (see tools/README_SALARY_TOOL.md) so
 * `/apply`'s salary benchmarking step has real data to work with. Absolute
 * median total compensation is written into the `index` field, which the lookup
 * tool treats as an opaque numeric metric.
 */
export async function runExport(opts: ExportOpts): Promise<number> {
  if (opts.companies.length === 0) {
    writeError("export requires at least one --company", "NO_COMPANIES")
    return 1
  }
  const companies: Array<Record<string, unknown>> = []
  const failed: Array<{ company: string; error: string }> = []

  for (const slug of opts.companies) {
    try {
      const md = await fetchMarkdown(companyUrl(slug, opts.role))
      const r = parseCompensationMarkdown(md)
      const categories: Record<string, { index: number }> = {}
      if (r.medianTotalCompensation !== null) {
        categories[opts.role ? opts.role : "all_roles"] = { index: r.medianTotalCompensation }
      }
      for (const lvl of r.levels) {
        if (lvl.medianTotalCompensation !== null) {
          categories[lvl.level] = { index: lvl.medianTotalCompensation }
        }
      }
      if (Object.keys(categories).length === 0) {
        failed.push({ company: slug, error: "no compensation figures parsed" })
        continue
      }
      companies.push({
        // The document title is a headline ("Roche Software Engineer Salaries"),
        // not a company name. salary_lookup.py fuzzy-matches on company name, so
        // emit the plain name derived from the slug instead.
        company: prettifyCompany(slug),
        city: r.location ?? null,
        source_url: r.sourceUrl,
        categories,
      })
    } catch (e) {
      failed.push({ company: slug, error: e instanceof Error ? e.message : String(e) })
    }
  }

  const payload = {
    metadata: {
      source: "Levels.fyi",
      index_baseline: 0,
      index_label: "Median total compensation (USD)",
      baseline_description:
        "Absolute median total compensation in USD per year, from Levels.fyi self-reported data. Higher is higher pay.",
      attribution: ATTRIBUTION,
      generated: new Date().toISOString(),
    },
    companies,
    ...(failed.length ? { _failed: failed } : {}),
  }

  const json = JSON.stringify(payload, null, 2) + "\n"
  if (opts.out) {
    await Bun.write(opts.out, json)
    process.stdout.write(
      `Wrote ${companies.length} company record(s) to ${opts.out}\n` +
        (failed.length ? `${failed.length} failed (see _failed in the file)\n` : "") +
        ATTRIBUTION +
        "\n",
    )
  } else {
    process.stdout.write(json)
  }
  return companies.length > 0 ? 0 : 1
}
