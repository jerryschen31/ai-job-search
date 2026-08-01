#!/usr/bin/env bun
// Self-contained CLI for searching jobs on Levels.fyi. Zero runtime dependencies.
//
// Levels.fyi's differentiator is that listings carry SALARY RANGES (base and
// total comp). Its limitation is that it has NO free-text job search: filtering
// is path-based over a fixed job-family taxonomy (/jobs/title/<family>), and
// query params like ?searchText= are ignored. --query narrows locally.
//
// Levels.fyi's robots.txt explicitly welcomes agent access and asks for
// attribution; every output names Levels.fyi as the salary-data source.
// It also rate-limits, so keep volume low.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { runFamilies } from "./commands/families.js"

interface Flags { _: string[]; [k: string]: string | boolean | string[] }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit", f: "family" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) flags[key] = true
      else { flags[key] = next; i++ }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `levels-fyi-cli — search jobs on Levels.fyi, with salary ranges attached

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <jobId | levels.fyi ?jobId= url> [--format json|plain]
  bun run src/cli.ts families [filter] [--format json|plain]

SEARCH FLAGS
  --family, -f <slug>     Job family to filter by (path-based, server-side).
                          Run \`families\` to list. e.g. software-engineer,
                          data-scientist, biomedical-engineer.
  --query, -q <text>      LOCAL keyword narrowing on title/company.
  --location, -l <text>   LOCAL filter on location text, e.g. "CA".
  --jobage <days>         Only postings within N days.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Page size. Default 25.
  --format <fmt>          json (default) | table | plain.

IMPORTANT LIMITATIONS
  - Levels.fyi has NO free-text job search. Only the job-family taxonomy filters
    server-side; --query/--location are applied locally to what was fetched.
  - The taxonomy has no "bioinformatics" or "computational-biology" family.
    For biotech/pharma roles use greenhouse-search / ashby-search / workday-search.
  - One fetch returns a limited slice (~11 companies x up to 3 jobs). Levels.fyi
    ignores limit/offset query params, so there is no deep pagination.
  - Levels.fyi rate-limits: it answers with an empty page rather than a 429.
    Keep volume low; the CLI backs off and reports this clearly.

EXAMPLES
  bun run src/cli.ts search -f software-engineer --format table
  bun run src/cli.ts search -f data-scientist -l "CA" --format table
  bun run src/cli.ts families engineer
  bun run src/cli.ts detail 80449164546056902 --format plain
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const fmt = (flags.format as string) || "json"
  const safeFmt = (["json", "table", "plain"].includes(fmt) ? fmt : "json") as "json" | "table" | "plain"

  if (cmd === "families") {
    return runFamilies(safeFmt, (flags._ as string[])[1])
  }

  if (cmd === "search") {
    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = parseInt(raw as string, 10)
      if (isNaN(val)) {
        process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
        return null
      }
      return val
    }
    for (const f of ["page", "limit", "jobage"]) {
      if (flags[f] !== undefined) {
        const v = parseIntFlag(f, flags[f])
        if (v === null) return 1
        flags[f] = String(v)
      }
    }
    const opts: SearchOpts = {
      family: typeof flags.family === "string" ? flags.family : undefined,
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? Math.max(1, parseInt(flags.limit as string, 10)) : 25,
      format: safeFmt,
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const input = (flags._ as string[])[1]
    if (!input) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <jobId|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const opts: DetailOpts = { input, format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"] }
    return runDetail(opts)
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
