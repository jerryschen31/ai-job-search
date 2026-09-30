import { EMPLOYERS, siteBase } from "../employers.js"

export function runEmployers(format: "json" | "table" | "plain"): number {
  if (format === "json") {
    process.stdout.write(
      JSON.stringify(
        {
          meta: { count: EMPLOYERS.length },
          results: EMPLOYERS.map((e) => ({ ...e, careerSite: siteBase(e) })),
        },
        null,
        2,
      ) + "\n",
    )
    return 0
  }
  const rows = EMPLOYERS.map(
    (e) => `${e.key.padEnd(14)} ${e.name.padEnd(24)} ${e.sector.padEnd(9)} ${siteBase(e)}`,
  )
  const header =
    "KEY".padEnd(14) + " " + "NAME".padEnd(24) + " " + "SECTOR".padEnd(9) + " CAREER SITE"
  process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
  return 0
}
