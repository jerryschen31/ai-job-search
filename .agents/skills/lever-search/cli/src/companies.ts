// Curated Lever job-board slugs. Lever's public postings API is per-organization
// with no cross-company search, so searching "the market" means fanning out over
// a known list. Every slug here was verified to return a non-empty board.
//
// To find a company's slug, look for a `jobs.lever.co/<slug>` URL on its careers
// page. Pass any slug directly with --company, listed here or not.

export interface Company {
  slug: string
  name: string
  sector: "biotech" | "ai" | "tech"
}

export const COMPANIES: Company[] = [
  // Biotech / synthetic biology
  { slug: "synthego", name: "Synthego", sector: "biotech" },

  // AI / autonomy
  { slug: "zoox", name: "Zoox", sector: "ai" },
  { slug: "palantir", name: "Palantir", sector: "ai" },

  // Broader tech
  { slug: "spotify", name: "Spotify", sector: "tech" },
  { slug: "gopuff", name: "Gopuff", sector: "tech" },
]

export function resolveCompanies(opts: { only?: string[]; sector?: string }): Company[] {
  if (opts.only?.length) {
    return opts.only.map((slug) => {
      const known = COMPANIES.find((c) => c.slug === slug)
      return known ?? { slug, name: slug, sector: "tech" as const }
    })
  }
  if (opts.sector) return COMPANIES.filter((c) => c.sector === opts.sector)
  return COMPANIES
}
