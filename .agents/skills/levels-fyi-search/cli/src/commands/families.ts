import { JOB_FAMILIES } from "../families.js"

export function runFamilies(format: "json" | "table" | "plain", filter?: string): number {
  const list = filter
    ? JOB_FAMILIES.filter((f) => f.includes(filter.toLowerCase()))
    : JOB_FAMILIES
  if (format === "json") {
    process.stdout.write(
      JSON.stringify({ meta: { count: list.length }, results: list }, null, 2) + "\n",
    )
    return 0
  }
  process.stdout.write(list.join("\n") + "\n")
  return 0
}
