// Curated Greenhouse board tokens. Greenhouse's public API has no cross-company
// search endpoint — each board is fetched by its own token — so a search across
// "the market" means fanning out over a known list. Every token here was verified
// to return a non-empty job list at the time of writing.
//
// Add your own with --company <token>, or extend this list. To find a company's
// token, open its careers page and look for a `boards.greenhouse.io/<token>` or
// `job-boards.greenhouse.io/<token>` URL.

export interface Company {
  token: string
  name: string
  sector: "biotech" | "ai" | "tech"
}

export const COMPANIES: Company[] = [
  // Biotech / genomics / pharma
  { token: "10xgenomics", name: "10x Genomics", sector: "biotech" },
  { token: "natera", name: "Natera", sector: "biotech" },
  { token: "altoslabs", name: "Altos Labs", sector: "biotech" },
  { token: "recursionpharmaceuticals", name: "Recursion", sector: "biotech" },
  { token: "freenome", name: "Freenome", sector: "biotech" },
  { token: "twistbioscience", name: "Twist Bioscience", sector: "biotech" },
  { token: "arcinstitute", name: "Arc Institute", sector: "biotech" },
  { token: "isomorphiclabs", name: "Isomorphic Labs", sector: "biotech" },
  { token: "chanzuckerberginitiative", name: "Chan Zuckerberg Initiative", sector: "biotech" },
  { token: "ginkgobioworks", name: "Ginkgo Bioworks", sector: "biotech" },
  { token: "genedx", name: "GeneDx", sector: "biotech" },
  { token: "vaxcyte", name: "Vaxcyte", sector: "biotech" },
  { token: "alumis", name: "Alumis", sector: "biotech" },
  { token: "ultimagenomics", name: "Ultima Genomics", sector: "biotech" },
  { token: "formationbio", name: "Formation Bio", sector: "biotech" },
  { token: "septerna", name: "Septerna", sector: "biotech" },
  { token: "latitude", name: "Latitude", sector: "biotech" },

  // AI labs / AI-forward engineering
  { token: "anthropic", name: "Anthropic", sector: "ai" },
  { token: "databricks", name: "Databricks", sector: "ai" },
  { token: "scaleai", name: "Scale AI", sector: "ai" },
  { token: "figureai", name: "Figure AI", sector: "ai" },
  { token: "waymo", name: "Waymo", sector: "ai" },

  // Broader tech
  { token: "robinhood", name: "Robinhood", sector: "tech" },
  { token: "coinbase", name: "Coinbase", sector: "tech" },
]

export function resolveCompanies(opts: {
  only?: string[]
  sector?: string
}): Company[] {
  if (opts.only?.length) {
    return opts.only.map((token) => {
      const known = COMPANIES.find((c) => c.token === token)
      return known ?? { token, name: token, sector: "tech" as const }
    })
  }
  if (opts.sector) {
    return COMPANIES.filter((c) => c.sector === opts.sector)
  }
  return COMPANIES
}
