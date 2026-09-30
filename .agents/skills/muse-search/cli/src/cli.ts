#!/usr/bin/env bun
// Self-contained CLI for searching jobs via The Muse's public API.
// No authentication, no API key, zero runtime dependencies.
//
// The Muse has NO free-text keyword parameter — it filters by a fixed taxonomy
// (category / level / location / company), which IS applied server-side.
// --query narrows locally over the pages fetched, so pair it with a taxonomy
// filter (and --pages) rather than relying on it alone across 400k+ jobs.

import { runSearch, type SearchOpts } from "./commands/search.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit" }
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

const HELP = `muse-cli — search jobs via The Muse's public API

USAGE
  bun run src/cli.ts search [flags]

SERVER-SIDE FILTERS (applied by The Muse)
  --location, -l <text>   Exact Muse location, e.g. "San Jose, CA",
                          "San Francisco, CA", "Flexible / Remote".
  --category <name>       Muse category, e.g. "Data and Analytics",
                          "Science and Engineering", "Software Engineering".
  --level <name>          e.g. "Senior Level", "Mid Level", "Entry Level".
  --company <slug>        Muse company short_name, e.g. "bankofamerica".

LOCAL FILTERS (applied after fetching)
  --query, -q <text>      Keyword narrowing on title/category/company/level.
                          The Muse has no keyword API — see NOTE below.
  --jobage <days>         Only postings published within N days.

OUTPUT
  --pages <n>             Upstream pages to pull (20 jobs each). Default 3.
  --page <n>              1-indexed output page. Default 1.
  --limit, -n <n>         Page size. Default 25.
  --with-description      Include full description text.
  --format <fmt>          json (default) | table | plain.

NOTE
  With ~400k jobs and no keyword API, a bare --query only searches the pages
  actually fetched. Always pair --query with --location/--category (and raise
  --pages) or you are keyword-filtering an arbitrary slice of the catalogue.

EXAMPLES
  bun run src/cli.ts search -l "San Jose, CA" --category "Data and Analytics" --format table
  bun run src/cli.ts search -q "scientist" --category "Science and Engineering" --pages 5 --format table
  bun run src/cli.ts search -l "Flexible / Remote" --level "Senior Level" --format table
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"
    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = parseInt(raw as string, 10)
      if (isNaN(val)) {
        process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
        return null
      }
      return val
    }
    for (const f of ["page", "limit", "jobage", "pages"]) {
      if (flags[f] !== undefined) {
        const v = parseIntFlag(f, flags[f])
        if (v === null) return 1
        flags[f] = String(v)
      }
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      category: typeof flags.category === "string" ? flags.category : undefined,
      level: typeof flags.level === "string" ? flags.level : undefined,
      company: typeof flags.company === "string" ? flags.company : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? Math.max(1, parseInt(flags.limit as string, 10)) : 25,
      pages: flags.pages ? Math.max(1, parseInt(flags.pages as string, 10)) : 3,
      withDescription: flags["with-description"] === true,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
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
