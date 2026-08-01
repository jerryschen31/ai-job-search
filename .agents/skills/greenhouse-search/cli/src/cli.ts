#!/usr/bin/env bun
// Self-contained CLI for searching jobs across companies hosted on Greenhouse,
// via Greenhouse's public, documented job-board API. No authentication, no API
// key, zero runtime dependencies.
//
// Greenhouse's API is per-company and has no keyword parameter, so `search`
// fans out over a curated list of board tokens (src/companies.ts) and filters
// client-side. Use `companies` to see the list, or --company to target specific
// boards (including ones not in the list).

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { runCompanies } from "./commands/companies.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit", c: "company" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        // --company may repeat; collect repeats into an array.
        if (key === "company" && flags[key] !== undefined) {
          const prev = flags[key]
          flags[key] = Array.isArray(prev) ? [...prev, next] : [prev as string, next]
        } else {
          flags[key] = next
        }
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `greenhouse-cli — search jobs across companies hosted on Greenhouse

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <url | id --company <token>> [--format json|plain]
  bun run src/cli.ts companies [--format json|table]

SEARCH FLAGS
  --query, -q <text>      Keyword filter on title/department/company (all terms must match).
  --location, -l <text>   Filter on the posting's location text, e.g. "South San Francisco".
  --company, -c <token>   Search a specific board token. Repeatable. Overrides the curated list.
  --sector <name>         Restrict the curated list: biotech | ai | tech.
  --jobage <days>         Only postings published within N days.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Page size. Default 25.
  --format <fmt>          json (default) | table | plain.

NOTES
  - Greenhouse has no cross-company search endpoint, so a bare \`search\` fans out
    over every board in src/companies.ts (one HTTP request each, in parallel) and
    filters locally. Narrow with --company/--sector to cut request volume.
  - A company whose board fails is reported under meta.failed rather than
    aborting the whole search.
  - detail needs a board token AND a job id: pass a full greenhouse job URL, or
    a bare id plus --company <token>.

EXAMPLES
  bun run src/cli.ts search -q "bioinformatics" --sector biotech --format table
  bun run src/cli.ts search -q "machine learning" -l "South San Francisco" --format table
  bun run src/cli.ts search -q "engineer" -c anthropic -c databricks --jobage 14 --format table
  bun run src/cli.ts companies --format table
  bun run src/cli.ts detail https://job-boards.greenhouse.io/ginkgobioworks/jobs/5185285007 --format plain
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

  if (cmd === "companies") {
    return runCompanies((["json", "table", "plain"].includes(fmt) ? fmt : "json") as "json" | "table" | "plain")
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

    const companyFlag = flags.company
    const companies =
      companyFlag === undefined || companyFlag === true
        ? undefined
        : Array.isArray(companyFlag)
          ? companyFlag
          : [companyFlag as string]

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      companies,
      sector: typeof flags.sector === "string" ? flags.sector : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const input = (flags._ as string[])[1]
    if (!input) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <url|id>", code: "NO_ID" }) + "\n")
      return 1
    }
    const opts: DetailOpts = {
      input,
      company: typeof flags.company === "string" ? flags.company : undefined,
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "INTERNAL_ERROR",
      }) + "\n",
    )
    process.exit(1)
  })
