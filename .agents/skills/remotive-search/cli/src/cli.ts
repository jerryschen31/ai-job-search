#!/usr/bin/env bun
// Self-contained CLI for searching remote jobs via Remotive's public API.
// No authentication, no API key, zero runtime dependencies.
//
// Two Remotive terms shape this tool:
//   1. Attribution is required — every output carries the posting URL and names
//      Remotive as the source.
//   2. Request volume must stay very low (Remotive advises max ~4 calls/day and
//      blocks excess). This CLI makes exactly ONE request per invocation and
//      filters locally, and has no `detail` command because descriptions
//      already ship in the search payload (use --with-description).

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

const HELP = `remotive-cli — search remote jobs via Remotive's public API

USAGE
  bun run src/cli.ts search [flags]

SEARCH FLAGS
  --query, -q <text>        Keyword. Sent upstream AND tightened locally
                            (Remotive's own search is fuzzy).
  --location, -l <text>     Filter on candidate-required location, e.g. "USA".
  --category <name>         Remotive category, e.g. "Software Development".
  --jobage <days>           Only postings published within N days.
  --with-description        Include the full description text in output.
  --page <n>                1-indexed page. Default 1.
  --limit, -n <n>           Page size. Default 25.
  --format <fmt>            json (default) | table | plain.

IMPORTANT
  Remotive requires attribution: results link back to remotive.com and name
  Remotive as the source. Do not republish these listings elsewhere.
  Remotive also asks for very low request volume (a few calls per day) and
  blocks excess — this CLI makes exactly one request per run.
  Listings are intentionally delayed ~24h by Remotive.

EXAMPLES
  bun run src/cli.ts search -q "bioinformatics" --format table
  bun run src/cli.ts search -q "python" -l "USA" --jobage 14 --format table
  bun run src/cli.ts search --category "Software Development" --limit 10 --format table
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
    for (const f of ["page", "limit", "jobage"]) {
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
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? Math.max(1, parseInt(flags.limit as string, 10)) : 25,
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
