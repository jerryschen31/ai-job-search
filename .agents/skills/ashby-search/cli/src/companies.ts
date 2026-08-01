// Curated Ashby job-board slugs. Ashby's public posting API is per-organization
// with no cross-company search, so searching "the market" means fanning out over
// a known list. Every slug here was verified to return a non-empty board.
//
// To find a company's slug, look for a `jobs.ashbyhq.com/<slug>` URL on its
// careers page. Pass any slug directly with --company, listed here or not.

export interface Company {
  slug: string
  name: string
  sector: "biotech" | "ai" | "tech"
}

export const COMPANIES: Company[] = [
  // Biotech / techbio
  { slug: "insitro", name: "insitro", sector: "biotech" },
  { slug: "benchling", name: "Benchling", sector: "biotech" },
  { slug: "chaidiscovery", name: "Chai Discovery", sector: "biotech" },
  { slug: "latentlabs", name: "Latent Labs", sector: "biotech" },

  // AI labs / AI infrastructure
  { slug: "openai", name: "OpenAI", sector: "ai" },
  { slug: "cursor", name: "Cursor (Anysphere)", sector: "ai" },
  { slug: "elevenlabs", name: "ElevenLabs", sector: "ai" },
  { slug: "suno", name: "Suno", sector: "ai" },
  { slug: "fireworksai", name: "Fireworks AI", sector: "ai" },
  { slug: "modal", name: "Modal", sector: "ai" },
  { slug: "sfcompute", name: "SF Compute", sector: "ai" },

  // Broader tech
  { slug: "replit", name: "Replit", sector: "tech" },
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
