#!/usr/bin/env bun
// Self-contained CLI for compensation benchmarking via Levels.fyi's
// LLM-readable markdown routes. Zero runtime dependencies.
//
// Levels.fyi's robots.txt and /llms.txt explicitly invite agent access and
// document these `.md` routes; this skill uses only those sanctioned endpoints.
//
// ATTRIBUTION IS MANDATORY per Levels.fyi's own data terms — every output
// carries "Data source: Levels.fyi (https://www.levels.fyi)".

import { runReport, type ReportOpts } from "./commands/report.js"
import { runExport, type ExportOpts } from "./commands/export.js"
import { JOB_FAMILIES } from "./families.js"

interface Flags { _: string[]; [k: string]: string | boolean | string[] }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { l: "location", r: "role", c: "company", o: "out" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) flags[key] = true
      else {
        if (key === "company" && flags[key] !== undefined) {
          const prev = flags[key]
          flags[key] = Array.isArray(prev) ? [...prev, next] : [prev as string, next]
        } else flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `levels-fyi-compensation-cli — salary benchmarking via Levels.fyi

USAGE
  bun run src/cli.ts company <slug> [--role <family>] [--format json|markdown|table]
  bun run src/cli.ts role <family> [--location <slug>] [--format json|markdown|table]
  bun run src/cli.ts export --company <slug> [--company <slug> ...] [--role <family>] [--out <file>]
  bun run src/cli.ts families [filter]

COMMANDS
  company   Compensation at one company, optionally for one job family.
            e.g. company roche --role software-engineer
  role      Compensation for a job family across the market, optionally by
            location. e.g. role software-engineer --location san-francisco-bay-area
  export    Build a salary_data.json for this repo's salary benchmarking tool
            (see tools/README_SALARY_TOOL.md) from one or more companies.
  families  List the Levels.fyi job-family taxonomy.

FORMATS
  json      Parsed structure: median, per-level breakdown, scope, source URL.
  table     Human-readable summary.
  markdown  Levels.fyi's original document, passed through unchanged.

ATTRIBUTION (required by Levels.fyi's data terms)
  Every output includes "Data source: Levels.fyi (https://www.levels.fyi)".
  Keep it on anything you derive from this data. Licence terms:
  https://www.levels.fyi/offerings/data/

RATE LIMITING
  Levels.fyi throttles by returning HTTP 200 with an EMPTY body. The CLI backs
  off, retries, and then says so plainly. Keep volume low — export fetches one
  document per company, sequentially.

EXAMPLES
  bun run src/cli.ts company roche --role software-engineer --format table
  bun run src/cli.ts role software-engineer --location san-francisco-bay-area --format table
  bun run src/cli.ts company genentech --format markdown
  bun run src/cli.ts export --company roche --company gilead --role software-engineer --out salary_data.json
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const args = flags._ as string[]
  const cmd = args[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const fmt = (flags.format as string) || "json"
  const safeFmt = (["json", "markdown", "table"].includes(fmt) ? fmt : "json") as
    | "json" | "markdown" | "table"

  if (cmd === "families") {
    const filter = args[1]?.toLowerCase()
    const list = filter ? JOB_FAMILIES.filter((f) => f.includes(filter)) : JOB_FAMILIES
    process.stdout.write(list.join("\n") + "\n")
    return 0
  }

  if (cmd === "company" || cmd === "role") {
    const target = args[1]
    if (!target) {
      process.stderr.write(
        JSON.stringify({ error: `${cmd} requires a <slug>`, code: "NO_TARGET" }) + "\n",
      )
      return 1
    }
    const opts: ReportOpts = {
      kind: cmd,
      target,
      role: typeof flags.role === "string" ? flags.role : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      format: safeFmt,
    }
    return runReport(opts)
  }

  if (cmd === "export") {
    const c = flags.company
    const companies =
      c === undefined || c === true ? [] : Array.isArray(c) ? c : [c as string]
    const opts: ExportOpts = {
      companies,
      role: typeof flags.role === "string" ? flags.role : undefined,
      out: typeof flags.out === "string" ? flags.out : undefined,
    }
    return runExport(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "INTERNAL_ERROR" }) + "\n",
    )
    process.exit(1)
  })
