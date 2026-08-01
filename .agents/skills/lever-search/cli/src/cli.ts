#!/usr/bin/env bun
// Self-contained CLI for searching jobs across companies hosted on Lever, via
// Lever's public postings API. No authentication, no API key, zero runtime
// dependencies. api.lever.co/robots.txt is `User-agent: * / Allow: /`.
//
// Lever's API is per-organization with no keyword parameter, so `search` fans
// out over a curated org list (src/companies.ts) and filters client-side.

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

const HELP = `lever-cli — search jobs across companies hosted on Lever

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <url | id --company <slug>> [--format json|plain]
  bun run src/cli.ts companies [--format json|table]

SEARCH FLAGS
  --query, -q <text>      Keyword filter on title/department/team/company (all terms must match).
  --location, -l <text>   Filter on the posting's location text, e.g. "Foster City".
  --company, -c <slug>    Search a specific org board. Repeatable. Overrides the curated list.
  --sector <name>         Restrict the curated list: biotech | ai | tech.
  --jobage <days>         Only postings created within N days.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Page size. Default 25.
  --format <fmt>          json (default) | table | plain.

NOTES
  - Lever has no cross-company search, so a bare \`search\` queries every org in
    src/companies.ts in parallel. Narrow with --company/--sector to cut volume.
  - Every result's \`url\` is the public jobs.lever.co posting link.

EXAMPLES
  bun run src/cli.ts search -q "engineer" --format table
  bun run src/cli.ts search -q "software" -c zoox -c palantir --jobage 30 --format table
  bun run src/cli.ts search --sector biotech --format table
  bun run src/cli.ts companies --format table
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
  const safeFmt = (["json", "table", "plain"].includes(fmt) ? fmt : "json") as
    | "json"
    | "table"
    | "plain"

  if (cmd === "companies") return runCompanies(safeFmt)

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
      format: safeFmt,
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
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "INTERNAL_ERROR" }) + "\n",
    )
    process.exit(1)
  })
