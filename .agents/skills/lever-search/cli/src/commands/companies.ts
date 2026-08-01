import { COMPANIES } from "../companies.js"

export function runCompanies(format: "json" | "table" | "plain"): number {
  if (format === "json") {
    process.stdout.write(
      JSON.stringify({ meta: { count: COMPANIES.length }, results: COMPANIES }, null, 2) + "\n",
    )
    return 0
  }
  const rows = COMPANIES.map((c) => `${c.slug.padEnd(20)} ${c.name.padEnd(24)} ${c.sector}`)
  const header = "SLUG".padEnd(20) + " " + "NAME".padEnd(24) + " SECTOR"
  process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
  return 0
}
