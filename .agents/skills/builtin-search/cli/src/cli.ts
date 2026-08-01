#!/usr/bin/env bun
// Self-contained CLI for searching jobs on builtin.com (US/Canada tech-job board,
// national + metro editions). No external CLI framework, so it runs anywhere `bun`
// is available with zero install beyond the repo clone.
//
// Personal use only. This reads builtin.com's public job pages; the site's
// robots.txt disallows the search query parameter for unrecognized crawlers
// (it only carves out exceptions for a handful of named AI search bots), so
// keep volume low and do not use it commercially or for bulk data collection.
// Run it on your own responsibility.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `builtin-cli — search jobs on builtin.com (US/Canada tech-job board)

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, or role).
  --city <text>            City name, e.g. "San Jose".
  --state <text>           State/region, e.g. "California".
  --country <text>         Default "USA".
  --radius <text>          Search radius around city, e.g. "25mi". Default "25mi".
  --remote                 Search remote-only listings instead of a location.
  --page <n>               1-indexed page. Default 1.
  --limit, -n <n>          Cap results emitted (client-side).
  --format <fmt>           json (default) | table | plain.

NOTES
  - Posting-age filtering is not exposed via a reliable query parameter on this
    portal; each result's "date" field carries the site's own relative text
    (e.g. "Reposted 3 Days Ago") so recency is still visible, just not filterable.
  - detail requires the FULL job url (as returned by search's "url" field) —
    builtin.com job pages need the correct slug in the path; a bare numeric id
    will 404.

EXAMPLES
  bun run src/cli.ts search -q "senior software engineer" --city "San Jose" --state "California" --format table
  bun run src/cli.ts search -q "data engineer" --remote --format table
  bun run src/cli.ts search -q "product designer" --page 2 --format table
  bun run src/cli.ts detail https://builtin.com/job/senior-software-developer-test-framework/9553863 --format plain

Personal use only — uses builtin.com's public pages; keep volume low.
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

    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      flags.page = String(v)
    }
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      flags.limit = String(v)
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      city: typeof flags.city === "string" ? flags.city : undefined,
      state: typeof flags.state === "string" ? flags.state : undefined,
      country: typeof flags.country === "string" ? flags.country : undefined,
      radius: typeof flags.radius === "string" ? flags.radius : undefined,
      remote: flags.remote === true,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const input = (flags._ as string[])[1]
    if (!input) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      input,
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
