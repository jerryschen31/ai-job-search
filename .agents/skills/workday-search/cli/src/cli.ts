#!/usr/bin/env bun
// Self-contained CLI for searching jobs on Workday-hosted career sites, via the
// public "CXS" JSON endpoint every Workday career site uses for its own search.
// No authentication, no API key, zero runtime dependencies.
//
// Unlike the ATS skills in this repo, Workday supports SERVER-SIDE keyword
// search, so --query is pushed to the employer rather than filtered locally.
// Workday is where most of big pharma runs its careers site.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { runEmployers } from "./commands/employers.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit", e: "employer" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        if (key === "employer" && flags[key] !== undefined) {
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

const HELP = `workday-cli — search jobs on Workday-hosted career sites (big pharma, biotech)

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <workday posting url> [--format json|plain]
  bun run src/cli.ts employers [--format json|table]

SEARCH FLAGS
  --query, -q <text>      Keyword search. Sent SERVER-SIDE to each employer, then
                          narrowed locally to titles containing EVERY term (Workday
                          OR-matches searchText, so multi-word queries otherwise
                          return anything sharing one word).
  --loose                 Skip that local narrowing and keep Workday's own ranking.
                          Use when your term lives in the description, not the title.
  --location, -l <text>   Filter results on location text, e.g. "Santa Clara".
                          Matched on token boundaries, so -l "CA" won't hit
                          "2 Locations".
  --employer, -e <key>    Search a specific employer (see \`employers\`). Repeatable.
  --sector <name>         Restrict to pharma | biotech | tech.
  --jobage <days>         Only postings within N days (approximated from
                          Workday's relative "Posted N Days Ago" text).
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Page size. Default 25.
  --format <fmt>          json (default) | table | plain.

AD-HOC EMPLOYER (not in the curated list)
  --tenant <t> --wd <wdN> --site <s>
      Search any Workday site directly, e.g. for
      https://acme.wd5.myworkdayjobs.com/AcmeCareers
      use --tenant acme --wd wd5 --site AcmeCareers

NOTES
  - Workday caps page size at 20 per request; the CLI pages automatically.
  - detail needs no employer flag — the posting URL contains tenant/site.
  - Every result's \`url\` is the public career-site posting link.

EXAMPLES
  bun run src/cli.ts search -q "bioinformatics" --format table
  bun run src/cli.ts search -q "computational biology" -e roche -e gilead --format table
  bun run src/cli.ts search -q "data engineer" -l "Santa Clara" --sector pharma --format table
  bun run src/cli.ts employers --format table
  bun run src/cli.ts detail "https://roche.wd3.myworkdayjobs.com/roche-ext/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2" --format plain
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

  if (cmd === "employers") return runEmployers(safeFmt)

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

    // Ad-hoc employer: all three parts are required together.
    const t = flags.tenant
    const w = flags.wd
    const s = flags.site
    const anyCustom = [t, w, s].some((v) => typeof v === "string")
    let custom: SearchOpts["custom"]
    if (anyCustom) {
      if (typeof t !== "string" || typeof w !== "string" || typeof s !== "string") {
        process.stderr.write(
          JSON.stringify({
            error: "--tenant, --wd and --site must be supplied together for an ad-hoc employer",
            code: "BAD_ARG",
          }) + "\n",
        )
        return 1
      }
      custom = { tenant: t, wd: w, site: s }
    }

    const employerFlag = flags.employer
    const employers =
      employerFlag === undefined || employerFlag === true
        ? undefined
        : Array.isArray(employerFlag)
          ? employerFlag
          : [employerFlag as string]

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      employers,
      sector: typeof flags.sector === "string" ? flags.sector : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? Math.max(1, parseInt(flags.limit as string, 10)) : 25,
      loose: flags.loose !== undefined,
      format: safeFmt,
      custom,
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const input = (flags._ as string[])[1]
    if (!input) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <url>", code: "NO_URL" }) + "\n")
      return 1
    }
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
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "INTERNAL_ERROR" }) + "\n",
    )
    process.exit(1)
  })
