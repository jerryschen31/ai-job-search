// Workday career sites are per-tenant: each employer runs its own Workday
// instance at <tenant>.<wd>.myworkdayjobs.com with its own external site name.
// The API shape is identical across all of them, so one skill covers every
// employer once its (tenant, wd, site) triple is known.
//
// Every entry below was verified to return a non-zero job count. To add an
// employer, open its careers page, note the URL
// (https://<tenant>.<wd>.myworkdayjobs.com/<site>), and add it here — or pass
// --tenant/--wd/--site on the command line for a one-off search.

export interface Employer {
  key: string
  name: string
  tenant: string
  wd: string
  site: string
  sector: "pharma" | "biotech" | "tech"
}

export const EMPLOYERS: Employer[] = [
  // Big pharma — the core of the regulated/GxP market
  { key: "roche", name: "Roche / Genentech", tenant: "roche", wd: "wd3", site: "roche-ext", sector: "pharma" },
  { key: "astrazeneca", name: "AstraZeneca", tenant: "astrazeneca", wd: "wd3", site: "Careers", sector: "pharma" },
  { key: "sanofi", name: "Sanofi", tenant: "sanofi", wd: "wd3", site: "SanofiCareers", sector: "pharma" },
  { key: "merck", name: "Merck (MSD)", tenant: "msd", wd: "wd5", site: "SearchJobs", sector: "pharma" },
  { key: "gsk", name: "GSK", tenant: "gsk", wd: "wd5", site: "GSKCareers", sector: "pharma" },
  { key: "bms", name: "Bristol Myers Squibb", tenant: "bristolmyerssquibb", wd: "wd5", site: "BMS", sector: "pharma" },
  { key: "pfizer", name: "Pfizer", tenant: "pfizer", wd: "wd1", site: "PfizerCareers", sector: "pharma" },
  { key: "gilead", name: "Gilead Sciences", tenant: "gilead", wd: "wd1", site: "gileadcareers", sector: "pharma" },

  // Biotech / life-science tools
  { key: "illumina", name: "Illumina", tenant: "illumina", wd: "wd1", site: "illumina-careers", sector: "biotech" },
]

export function resolveEmployers(opts: {
  only?: string[]
  sector?: string
}): Employer[] {
  if (opts.only?.length) {
    return opts.only
      .map((k) => EMPLOYERS.find((e) => e.key === k))
      .filter((e): e is Employer => e !== undefined)
  }
  if (opts.sector) return EMPLOYERS.filter((e) => e.sector === opts.sector)
  return EMPLOYERS
}

/** Base URL of the public (human-facing) career site — used to build posting links. */
export function siteBase(e: Pick<Employer, "tenant" | "wd" | "site">): string {
  return `https://${e.tenant}.${e.wd}.myworkdayjobs.com/${e.site}`
}

/** Base URL of the CXS JSON API behind that site. */
export function apiBase(e: Pick<Employer, "tenant" | "wd" | "site">): string {
  return `https://${e.tenant}.${e.wd}.myworkdayjobs.com/wday/cxs/${e.tenant}/${e.site}`
}
