# 10 Most Sought Positions — Bay Area Tech & Biotech (as of 2026-09-29)

## Read this first: what this ranking is (and is not)

You asked for a ranking by the number of **active or past** postings over the past 9 months. **I could not measure that.** The portal CLIs in this repo (LinkedIn, Built In, Greenhouse, etc.) only return *currently open* postings, and LinkedIn's recency filter tops out at 30 days. Historical posting counts sit in paid datasets (Lightcast, Indeed Hiring Lab, LinkUp) that I don't have access to.

What I did instead:

- **Proxy metric:** current open-posting counts per role title for "San Francisco Bay Area", read from LinkedIn and Indeed search-result page titles (snapshot, late Sep 2026). Open postings are a reasonable proxy for hiring volume because they accumulate over the weeks-to-months a role stays open, but they are **not** a 9-month count.
- **Caveats on the counts:**
  - LinkedIn shows bucketed values ("9,000+", "18,000+") and its title searches match loosely, so they include adjacent titles and contract or duplicate postings.
  - Indeed numbers are rounded and systematically lower for the same title, so the two sources are not comparable to each other.
  - Use the tiers below, not the exact order within a tier.
- **Sector balance:** a pure combined ranking would be almost entirely tech, because Bay Area tech posting volume is several times larger than biotech's. I chose **6 tech + 4 biotech** roles so both sectors you named are represented, ranking within each sector by the same metric. Biotech counts are not comparable in size to tech counts.
- **Job descriptions, skills and experience** below are synthesized from the posting snippets returned by the searches plus general market knowledge. Treat them as typical patterns, not quotes from specific postings. No individual postings were fetched, so `seen_jobs.json` was not updated.

Context from the same sources: Indeed lists ~10,400 tech jobs and Glassdoor ~7,900 for the Bay Area; the SF Bay hosts an estimated 20%+ of US AI postings. Biotech hiring is described as selective in 2026, with clinical operations, regulatory affairs and AI/computational roles the tightest.

## Summary table

| Rank | Position | Sector | LinkedIn Bay Area (open) | Indeed Bay Area (open) | Volume tier |
|---|---|---|---|---|---|
| 1 | Software Engineer | Tech | 18,000+ | not retrieved | Very high |
| 2 | Data Scientist / Data Analyst | Tech | 17,000+ / 18,000+ | ~900 / ~1,000+ | Very high |
| 3 | Machine Learning / AI Engineer | Tech | 9,000+ / 2,000+ | ~2,800 | Very high |
| 4 | Data Engineer | Tech | 9,000+ | ~7,000 | Very high |
| 5 | DevOps / SRE / Cloud / Platform Engineer | Tech | 6,000+ (SRE), 8,000+ (Cloud) | ~1,250 (DevOps), ~820 (Cloud) | High |
| 6 | Product / Technical Program Manager | Tech | 7,000+ (PM), 9,000+ (TPM) | ~1,500 (PM), ~870 (TPM) | High |
| 7 | Biotech Manufacturing / Process Development Associate & Scientist | Biotech | not retrieved | ~2,000 (mfg), ~400 (PD) | Medium |
| 8 | Research Associate / Scientist (lab) | Biotech | ~280 (Biotech Scientist) | ~500–800 | Medium |
| 9 | Quality Assurance / Quality Control (GMP/GxP) | Biotech | ~160 (QA Biotech) | ~200–300 | Medium |
| 10 | Clinical Research Associate / Clinical Operations | Biotech | ~490 (CRA), ~670 (Sr CRA) | ~200–250 | Medium |

Aggregate biotech search for context: "Biotech jobs, SF Bay Area" shows 9,000+ on LinkedIn and ~800–880 on Indeed.

**Runners-up (not in the top 10):** Security Engineer (6,000+ LinkedIn / ~720 Indeed), Solutions/Sales Engineer (2,000+ LinkedIn), Regulatory Affairs (~300–435), Bioinformatics / Computational Biology (~350–400; the national market was ~419 jobs across 110 companies in Q1 2026 per CompBioJobs).

---

## Tech

### 1. Software Engineer
- **Summary:** Designs, builds, tests and ships production software (backend, full-stack, frontend, embedded or C++ systems). Levels run from SWE II to Staff. The largest single title family in the Bay Area, with LinkedIn showing ~15,000+ backend-flavored postings alone.
- **Skills:** Python, Java, Go, C++ or TypeScript; distributed systems and API design; SQL and NoSQL; cloud (AWS/GCP/Azure), Docker/Kubernetes, CI/CD; testing and code review; increasingly, LLM/AI-assisted development.
- **Experience:** BS/MS in CS or equivalent. 2–5 years for mid-level, 5–8+ for senior, 8–10+ for staff (system design and cross-team leadership). Strong data-structure/algorithm fluency is typically assessed in interviews.

### 2. Data Scientist / Data Analyst
- **Summary:** Turns product, business or scientific data into decisions through analysis, experimentation (A/B testing), dashboards and predictive models. "Analyst" roles emphasize SQL, BI and reporting; "Scientist" roles add statistics and modeling. Note that LinkedIn counts here include many contract postings.
- **Skills:** SQL, Python (pandas, scikit-learn), R; statistics and causal inference; Tableau/Looker/Power BI; dbt and warehouse basics (Snowflake, BigQuery, Redshift); clear communication with stakeholders.
- **Experience:** BS/MS (PhD common for scientist tracks) in statistics, CS, economics or a quantitative science. 2–5 years for analyst and scientist II, 5+ for senior. Domain experience (product, marketing, healthcare, biotech) is a differentiator.

### 3. Machine Learning / AI Engineer
- **Summary:** Builds and deploys ML and generative-AI systems: model training and fine-tuning, LLM applications, RAG pipelines, agents, evaluation, and inference infrastructure. AI/ML Engineer is described as the most in-demand generalist role in 2026, with a reported median salary of ~$219k.
- **Skills:** Python, PyTorch/TensorFlow; LLM APIs and frameworks, RAG, vector databases, agentic workflows, prompt and eval design; MLOps (feature stores, model serving, monitoring); AWS/GCP; software engineering fundamentals.
- **Experience:** BS/MS/PhD in CS or a related field. 3–6+ years for mid/senior. Production deployment experience matters more than research credentials for applied roles, whereas research-scientist roles expect publications.

### 4. Data Engineer
- **Summary:** Builds and maintains the pipelines, warehouses and platforms that feed analytics and ML: ingestion, transformation, orchestration, data quality and governance.
- **Skills:** SQL and Python (Scala/Java for Spark); Airflow or similar orchestration; dbt; Spark, Kafka; Snowflake/BigQuery/Redshift/Databricks; AWS/GCP; Terraform and CI/CD; data modeling and quality testing.
- **Experience:** BS in CS or a related field. 3–5 years for mid, 5–8+ for senior/staff. Experience owning pipelines end-to-end in production and working with analysts, scientists and product teams.

### 5. DevOps / SRE / Cloud / Platform Engineer
- **Summary:** Keeps systems reliable and scalable and builds internal developer platforms: infrastructure as code, CI/CD, observability, incident response, and cloud cost/security. Titles overlap heavily (DevOps, SRE, Cloud, Platform), so I grouped them.
- **Skills:** AWS/GCP/Azure; Terraform; Kubernetes and Docker; Linux; CI/CD (GitHub Actions, Jenkins, ArgoCD); monitoring (Prometheus, Grafana, Datadog); Python or Go scripting; incident management.
- **Experience:** 3–5+ years operating production infrastructure for mid-level and 5+ for senior. Cloud certifications are a plus. On-call experience is commonly required for SRE.

### 6. Product Manager / Technical Program Manager
- **Summary:** PMs own product strategy, roadmap and outcomes. TPMs drive cross-functional delivery of complex technical programs (schedule, risk, dependencies, stakeholder alignment). AI product roles are a fast-growing sub-segment (~1,000 "AI Product Manager" listings on Indeed).
- **Skills:** Product discovery and prioritization; roadmapping; metrics and experimentation; technical fluency (APIs, cloud, ML basics) especially for TPM/technical PM; stakeholder management; JIRA and documentation; executive communication.
- **Experience:** 3–5 years for PM/TPM and 7–10+ for senior/principal. Prior engineering, data or domain experience is often preferred. MBA is optional.

---

## Biotech

### 7. Manufacturing / Process Development Associate & Scientist
- **Summary:** Executes cGMP manufacturing (cell culture, bioreactors, purification, fill/finish, DNA synthesis) or develops and scales the processes behind cell and gene therapies, antibodies and other biologics. Growing hubs include South San Francisco, Emeryville, Alameda and Fremont (e.g., Cellares, Neurona, Ansa, Genentech).
- **Skills:** cGMP and batch-record documentation; bioreactor and chromatography operation; aseptic technique; process characterization and DoE (for PD); deviations and CAPA; shift flexibility (swing or weekend shifts are common for manufacturing).
- **Experience:** BS in life sciences, biotechnology or chemical/biochemical engineering. Associate roles typically need 0–3 years; scientist/senior roles 3–5+ years, and an associate's degree with 5+ years is sometimes accepted. Hands-on GMP bioreactor experience is often the deciding factor.

### 8. Research Associate / Scientist (Lab-Based R&D)
- **Summary:** Bench scientists who run assays, generate and analyze experimental data, and support discovery and preclinical programs across molecular biology, protein science, cell biology and assay development. Employers include Genentech, Amgen, Denali, UCSF and many clinical-stage startups.
- **Skills:** Molecular and cell-biology techniques (PCR/qPCR, cloning, cell culture, flow cytometry, ELISA); protein biochemistry and analytical methods; NGS and single-cell workflows for genomics groups; ELN and data documentation; basic Python/R for analysis is increasingly expected.
- **Experience:** BS/MS with 1–3 years of lab experience for Research Associate (RA), and PhD (plus 0–3 years of postdoc or industry) for Scientist. Senior Scientist roles typically need 5+ years and evidence of project ownership.

### 9. Quality Assurance / Quality Control (GMP/GxP)
- **Summary:** Ensures manufacturing, lab and computerized-system compliance: batch record review, deviations, CAPA, change control, audits, validation and release testing. Employers include Genentech, Gilead, Ultragenyx and Boehringer Ingelheim (Fremont).
- **Skills:** FDA/EMA regulations (21 CFR Parts 210/211, Part 11, ICH guidelines); GMP/GxP quality systems; validation (including computer-system validation); root-cause analysis; audit readiness; documentation discipline; QC analytical methods for QC roles.
- **Experience:** Bachelor's in a scientific or engineering field. 2–5 years for specialist, 5+ years in regulated quality for senior, and 10+ years of GMP biopharma technical operations/quality for leadership roles.

### 10. Clinical Research Associate / Clinical Operations
- **Summary:** Oversees clinical trial execution: site monitoring, data quality, protocol and regulatory compliance, vendor/CRO coordination. Clinical operations leadership is among the tightest functions in 2026 (Director/VP-level roles reportedly grew ~31% year over year).
- **Skills:** ICH-GCP and FDA regulations; site monitoring and source-data verification; CTMS/EDC systems; protocol and study-document management; vendor and CRO oversight; travel tolerance for monitoring visits.
- **Experience:** BS in life sciences or nursing (advanced degree for some tracks). 1–2 years for CRA I, 3+ for CRA II, 5+ for Senior CRA. Therapeutic-area experience (oncology, cell and gene therapy) is valued.

---

## How this relates to your profile (brief)

- **Strong overlap:** #5 (DevOps/Cloud/Platform: AWS, Terraform, Docker), #4 (Data Engineer, cloud genomics pipelines), #3 (AI Engineer: Claude Code, agentic AI, RAG/agent certificates), and #6 (TPM/technical program lead, GxP program leadership).
- **Adjacent via biotech domain:** #9 (GxP/CSV validation experience) and Bioinformatics (runner-up).
- **Poor fit or a deal-breaker per your profile:** algorithm-heavy variants of #1 and #3 (research-scientist style ML). Prefer applied/platform variants.

## Getting a true 9-month ranking

If the historical ranking matters, options are: (1) a Lightcast or Indeed Hiring Lab data pull, (2) repeating this snapshot monthly and storing the counts so trends accumulate, or (3) running the repo's portal CLIs with `--jobage 30` per role. I can set up (2) or (3) if you want.

## Sources

- [LinkedIn: Software Engineer, Bay Area](https://www.linkedin.com/jobs/software-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Data Scientist, Bay Area](https://www.linkedin.com/jobs/data-scientist-jobs-san-francisco-bay-area)
- [LinkedIn: Data Analyst, Bay Area](https://www.linkedin.com/jobs/data-analyst-jobs-san-francisco-bay-area)
- [LinkedIn: Machine Learning Engineer, Bay Area](https://www.linkedin.com/jobs/machine-learning-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: AI Engineer, Bay Area](https://www.linkedin.com/jobs/ai-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Data Engineer, Bay Area](https://www.linkedin.com/jobs/data-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Site Reliability Engineer, Bay Area](https://www.linkedin.com/jobs/site-reliability-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Product Manager, Bay Area](https://www.linkedin.com/jobs/product-manager-jobs-san-francisco-bay-area)
- [LinkedIn: Technical Program Manager, Bay Area](https://www.linkedin.com/jobs/technical-program-manager-jobs-san-francisco-bay-area)
- [LinkedIn: Security Engineer, Bay Area](https://www.linkedin.com/jobs/security-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Clinical Research Associate, Bay Area](https://www.linkedin.com/jobs/clinical-research-associate-jobs-san-francisco-bay-area)
- [LinkedIn: Quality Assurance Biotech, Bay Area](https://www.linkedin.com/jobs/quality-assurance-biotech-jobs-san-francisco-bay-area)
- [LinkedIn: Biotech, Bay Area](https://www.linkedin.com/jobs/biotech-jobs-san-francisco-bay-area)
- [Indeed: Data Engineer](https://www.indeed.com/q-data-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Machine Learning Engineer](https://www.indeed.com/q-machine-learning-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Product Manager](https://www.indeed.com/q-product-manager-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: DevOps Engineer](https://www.indeed.com/q-devops-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Manufacturing Biotech](https://www.indeed.com/q-manufacturing-biotech-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Biotech](https://www.indeed.com/q-biotech-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Clinical Research Associate](https://www.indeed.com/q-clinical-research-associate-l-san-francisco-bay-area,-ca-jobs.html)
- [Glassdoor: tech jobs, San Francisco](https://www.glassdoor.com/Job/san-francisco-tech-jobs-SRCH_IL.0,13_IC1147401_KO14,18.htm)
- [Xtalks: Biotech Hiring Trends 2026](https://xtalks.com/biotech-hiring-trends-2026-the-roles-companies-are-recruiting-for-now-4852/)
- [CompBioJobs: Bioinformatics job market Q1 2026](https://www.compbiojobs.com/blog/bioinformatics-job-market-q1-2026)
