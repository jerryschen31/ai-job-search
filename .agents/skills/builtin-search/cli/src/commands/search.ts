import {
  SEARCH_URL,
  REMOTE_SEARCH_URL,
  htmlFetch,
  parseJobCards,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  city?: string
  state?: string
  country?: string
  radius?: string
  remote?: boolean
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("search", opts.query)
  if (!opts.remote) {
    if (opts.city) params.set("city", opts.city)
    if (opts.state) params.set("state", opts.state)
    if (opts.city || opts.state) params.set("country", opts.country || "USA")
    if (opts.city || opts.state) params.set("searcharea", opts.radius || "25mi")
  }
  params.set("page", String(opts.page))
  const base = opts.remote ? REMOTE_SEARCH_URL : SEARCH_URL
  return `${base}?${params.toString()}`
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 40).padEnd(40)
    const company = (c.company || "—").slice(0, 22).padEnd(22)
    const loc = (c.location || "—").slice(0, 22).padEnd(22)
    const salary = c.salary || "—"
    return `${c.id.padEnd(9)} ${title} ${company} ${loc} ${salary}`
  })
  const header =
    "ID".padEnd(9) +
    " " +
    "TITLE".padEnd(40) +
    " " +
    "COMPANY".padEnd(22) +
    " " +
    "LOCATION".padEnd(22) +
    " SALARY"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    let cards = parseJobCards(html)
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}` +
              `${c.salary ? " · " + c.salary : ""}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
