// Levels.fyi filters jobs by a fixed job-family taxonomy via the URL path
// (/jobs/title/<slug>) — there is no free-text keyword search. This list is the
// full taxonomy, harvested from Levels.fyi's own job-family sitemap
// (https://www.levels.fyi/sitemaps/job-family-sitemap.xml).
//
// NOTE for life-science searches: the taxonomy has no "bioinformatics" or
// "computational-biology" family. The closest are data-scientist,
// biomedical-engineer, and data-analyst. For biotech/pharma roles prefer the
// greenhouse-search, ashby-search, and workday-search skills, which do support
// real keyword search.

export const JOB_FAMILIES: string[] = [
  "accountant",
  "actuary",
  "administrative-assistant",
  "aerospace-engineer",
  "biomedical-engineer",
  "biz-ops",
  "bizops-manager",
  "business-analyst",
  "business-development",
  "chemical-engineer",
  "chief-of-staff",
  "civil-engineer",
  "claims-adjuster",
  "compliance-officer",
  "controls-engineer",
  "copywriter",
  "corp-dev",
  "customer-service",
  "customer-service-ops",
  "customer-success",
  "data-analyst",
  "data-annotator",
  "data-science-manager",
  "data-scientist",
  "electrical-engineer",
  "facilities-manager",
  "fashion-designer",
  "financial-analyst",
  "founder",
  "geological-engineer",
  "graphic-designer",
  "gtm-engineer",
  "hardware-engineer",
  "human-resources",
  "industrial-designer",
  "information-technologist",
  "investment-banker",
  "lab-tech",
  "legal",
  "legal-ops",
  "management-consultant",
  "marketing",
  "marketing-operations",
  "materials-engineer",
  "mechanical-engineer",
  "mep-engineer",
  "meteorologist",
  "nurse",
  "optical-engineer",
  "paralegal",
  "partner-manager",
  "people-ops",
  "physician",
  "product-design-manager",
  "product-designer",
  "product-manager",
  "program-manager",
  "project-manager",
  "prompt-engineer",
  "property-manager",
  "real-estate-agent",
  "recruiter",
  "regulatory-affairs",
  "revops",
  "sales",
  "sales-enablement",
  "sales-engineer",
  "security-analyst",
  "software-engineer",
  "software-engineering-manager",
  "solution-architect",
  "tam",
  "technical-program-manager",
  "technical-writer",
  "total-rewards",
  "toxicologist",
  "trust-and-safety",
  "underwriter",
  "ux-researcher",
  "venture-capitalist",
]

export function isKnownFamily(slug: string): boolean {
  return JOB_FAMILIES.includes(slug)
}

/** Suggest near-matches so a typo or unsupported term gets a useful error. */
export function suggestFamilies(input: string, max = 8): string[] {
  const needle = input.toLowerCase().replace(/[^a-z0-9]+/g, "")
  if (!needle) return JOB_FAMILIES.slice(0, max)
  const scored = JOB_FAMILIES.map((f) => {
    const flat = f.replace(/-/g, "")
    let score = 0
    if (flat === needle) score = 100
    else if (flat.includes(needle) || needle.includes(flat)) score = 50
    else {
      // Loose overlap on word parts, e.g. "data science" -> "data-scientist".
      const parts = input.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
      score = parts.filter((p) => p.length > 2 && f.includes(p)).length * 10
    }
    return { f, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.f)
}
