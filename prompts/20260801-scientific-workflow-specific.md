# Scientific Workflow / AWS Platform Roles — 2026-08-01

Targeted scrape against the stated core competency: **managing AWS-deployed workflows for
scientific applications**. Same constraints as the earlier run — SF Bay Area or fully
remote, and the published base range must reach **$200K**.

Deduplicated against `job_scraper/seen_jobs.json` (32 entries from the 2026-08-01 broad
run). Everything below is new except where noted.

**Result: 7 new positions (4 high, 3 medium), plus 4 competency-perfect roles that had to
be held back because no salary is published.**

---

## High fit

| # | Title | Company | Location | Base range | Posted | URL |
|---|-------|---------|----------|-----------|--------|-----|
| 1 | Engineering Leader, Infrastructure | Benchling | San Francisco, CA (hybrid, remote-flagged) | $226,223–$306,066 + equity | 2026-07-20 | [Link](https://jobs.ashbyhq.com/benchling/7017bd54-cf7e-45cc-a6ee-580701f2b7fc) |
| 2 | Senior Data Platform Engineer (Onyx Research Data Tech) | GSK | South San Francisco, CA | $158K–$263K | — | [Link](https://builtin.com/job/senior-data-platform-engineer/9800426) |
| 3 | Staff Software Engineer – Data Team #4555 | GRAIL | Sunnyvale, CA (60% onsite) | $169K–$224K | — | [Link](https://builtin.com/job/staff-software-engineer-data-team-4555/10355150) |
| 4 | Senior / Staff Cloud Platform Engineer (ML) | Calico Life Sciences | South San Francisco, CA | $220K–$290K | — | [Link](https://builtin.com/job/senior-staff-cloud-platform-engineer-ml/10208887) |

## Medium fit

| # | Title | Company | Location | Base range | URL |
|---|-------|---------|----------|-----------|-----|
| 5 | DevOps & Platform Engineer (AWS / CI/CD) — CrossLab Connect | Agilent Technologies | Remote option | $143.8K–$224.6K | [Link](https://builtin.com/job/devops-platform-engineer-aws-ci-cd/9568850) |
| 6 | Staff Data Platform Software Engineer | ServiceNow | Santa Clara, CA | $176K–$308K | [Link](https://builtin.com/job/staff-data-platform-software-engineer-graph-veza/10226415) |
| 7 | Lead Bioinformatics Scientist, NGS | Profluent | Emeryville, CA | $160K–$230K | [Link](https://builtin.com/job/lead-bioinformatics-scientist-ngs/7701469) |

---

## High-fit detail

### 1. Benchling — Engineering Leader, Infrastructure — *the single best competency match found*

- **Why it matches:** the JD asks for hands-on modern cloud infrastructure leadership,
  explicitly *"Build and evolve cloud foundations on **AWS**, including network and compute
  patterns and Kubernetes-based services"* — and then, separately, *"Operate in a regulated
  environment (**GxP**/biotech): help ensure infrastructure changes are traceable,
  auditable, and appropriately controlled, without slowing teams down unnecessarily."*
  That is the GxP-qualified Bioinformatics Cloud project restated as a job description.
- Scientific application layer is the whole product: Benchling is the R&D platform 200,000+
  scientists use, including Sanofi, Moderna, and half the top-50 biopharma.
- **Requirements to check:** they want people-leadership depth (hiring, coaching,
  performance management) alongside the IC background — your Project Lead / team-of-4
  founder experience covers this, but it is a manager role, not a staff IC role. Also
  wants pragmatic SRE (SLIs/SLOs, on-call health, incident/postmortem process); worth
  preparing concrete examples.
- **Note:** the interview includes a brief AI-focused exercise where you may reference the
  tools you use — an unusually clean opening for the Claude Code work.
- Comp is well clear of target: **$226,223–$306,066 plus equity**.

### 2. GSK — Senior Data Platform Engineer, Onyx

- **Why it matches:** Onyx builds "a next-generation, metadata- and automation-driven data
  experience for GSK's scientists" — cloud-native infrastructure, CI/CD and DevOps, data
  governance/provenance, and high-dimensionality scientific data processing. The named
  toolchain is **Python, Spark, Nextflow, k8s, IaC** — workflow orchestration for science,
  exactly your lane. Big-pharma regulated context is your home sector.
- **Requirements to check:** 8+ years and Python — met. Cloud experience listed as
  "AWS, Azure and GCP," but the day-to-day stack named in the responsibilities is
  **GCP and Azure**, not AWS. Your AWS depth transfers, but expect to argue portability.
- Range reaches $263K; the $158K floor means you should anchor high.

### 3. GRAIL — Staff Software Engineer, Data Team

- **Why it matches:** end-to-end scientific data lifecycle "from sample ingestion through
  downstream analysis, while meeting rigorous clinical, regulatory, and privacy standards."
  Preferred qualifications read like your CV: **regulated/clinical data environments (HIPAA,
  CLIA, GCP, FDA)**, *"Familiarity with **GxP** practices,"* *"systems that manage
  laboratory or bioinformatics data (LIMS, sequencing pipelines, assay metadata),"* NGS
  background, and an advanced degree in bioinformatics.
- **Location is the best in this batch** — Sunnyvale, your top-preference city.
- **Requirements to check:** 7+ years production software — met. They are explicit that
  this is *"building complex production-grade systems… as opposed to assembling
  off-the-shelf ETL tools or writing SQL heavy pipelines."* Go or Python; you have Python.
- ⚠️ **Salary is the weak point:** $169K–$224K, so only the top of the band clears your
  floor. Also 60% onsite (24 hrs/week), Tue/Thu anchored, moving to a new Sunnyvale HQ in
  September.

### 4. Calico Life Sciences — Senior / Staff Cloud Platform Engineer (ML)

- **Why it matches:** *"migrate existing workflows into a unified, compliant
  infrastructure"* and *"design intuitive onboarding processes and 'paved paths' for
  scientists"* — platform engineering in service of research scientists, with IaC
  (Terraform), Kubernetes, CI/CD, Docker, compliant cloud architecture (SOC2/HIPAA), and
  FinOps cost governance. Alphabet-founded aging-biology R&D company.
- Explicitly says *"No biology or life sciences background is required"* — your domain
  depth is upside, not a gate.
- ⚠️ **Two real frictions:** the platform is **GCP/GKE, not AWS** (Terraform, K8s, and
  DevSecOps transfer cleanly; the GCP-specific service knowledge does not), and the posting
  requires **onsite at least four days a week in South San Francisco** — roughly 45 miles
  each way from San Jose. That is the most demanding commute of anything in this batch.
- Comp is strong: $220K–$290K plus two annual cash bonuses.

---

## Held back — competency-perfect but salary not published

These four are the closest title-level matches to "AWS workflows for scientific
applications" found anywhere in this run, but they come from LinkedIn, which publishes no
compensation. They cannot be confirmed against the $200K floor, so they are listed
separately rather than dropped or presented as qualifying. Stanford in particular is
unlikely to clear it.

| Title | Company | Location | Posted |
|-------|---------|----------|--------|
| Bioinformatics Cloud Engineer | Dualitas Therapeutics | San Francisco Bay Area | 2026-07-07 |
| Infrastructure Engineer | LatchBio | San Francisco, CA | 2026-07-24 |
| Member of Technical Staff – Infrastructure | Phylo | South San Francisco, CA | 2026-07-10 |
| Research Computing Cloud Engineer | Stanford University | Stanford, CA | 2026-07-06 |

Worth 20 minutes of your own checking — LatchBio in particular is a workflow-orchestration
company for biology, which is the HubSeq thesis with funding behind it.

---

## Excluded, with reasons

| Role | Company | Why excluded |
|------|---------|--------------|
| Senior Bioinformatics Scientist (US Remote **and** San Carlos) | Natera | $118.8K–$148.5K — fails the floor outright. Also centers on *"Advanced knowledge of data structures, algorithm design, and computational complexity"* and novel algorithm development: a direct hit on your stated hard no. |
| Senior Bioinformatician | Vivodyne | $214K–$245K clears the floor, but the role is PhD-level scRNA-seq/proteomics **method development** ("develop or adapt methods for perturbation modeling, causal inference, network reconstruction"), not workflow platform ownership. Onsite SF. Brushes the algorithm deal-breaker. |
| Bioinformatics Platform Engineer | Eli Lilly | $66K–$194K — fails the floor. |
| Bioinformatics Engineer, Pipelines | Mithrl | $150K–$200K — touches $200K only at the very top of a startup band; effectively fails. |
| Computational Biologist | Valius Sciences | $125K–$185K — fails the floor. |
| Senior Data Engineer, AWS Data Platform | IDEXX | $110K–$130K — fails the floor. |
| Systems AWS Platform Engineer | Guidehouse | $98K–$163K — fails the floor. |
| Senior Software Developer – AWS / Platform | Walt Disney Company | $142K–$208K, and not a scientific-application context. |

**Pattern worth noting:** the bioinformatics-titled roles in this market cluster at
$120K–$200K, while the *platform/infrastructure-titled* roles serving the same scientific
users clear $220K+. Benchling, Calico, and GSK all pay materially more for "cloud platform
engineer supporting scientists" than Natera or Lilly pay for "bioinformatics engineer"
doing adjacent work. Positioning toward the platform title, not the bioinformatics title,
is worth real money.

---

## Contacts

Recruiter search / role-peer search, for each high- and medium-fit role. These are search
links to open yourself — no lookups were performed.

- **Benchling** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=Benchling%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=Benchling%20Engineering%20Leader%20Infrastructure&origin=GLOBAL_SEARCH_HEADER)
- **GSK** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=GSK%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=GSK%20Onyx%20Data%20Platform%20Engineer&origin=GLOBAL_SEARCH_HEADER)
- **GRAIL** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=GRAIL%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=GRAIL%20Staff%20Software%20Engineer%20Data&origin=GLOBAL_SEARCH_HEADER)
- **Calico Life Sciences** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=Calico%20Life%20Sciences%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=Calico%20Life%20Sciences%20Cloud%20Platform%20Engineer&origin=GLOBAL_SEARCH_HEADER)
- **Agilent Technologies** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=Agilent%20Technologies%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=Agilent%20Technologies%20DevOps%20Platform%20Engineer&origin=GLOBAL_SEARCH_HEADER)
- **ServiceNow** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=ServiceNow%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=ServiceNow%20Staff%20Data%20Platform%20Software%20Engineer&origin=GLOBAL_SEARCH_HEADER)
- **Profluent** — [recruiters](https://www.linkedin.com/search/results/people/?keywords=Profluent%20recruiter&origin=GLOBAL_SEARCH_HEADER) · [peers](https://www.linkedin.com/search/results/people/?keywords=Profluent%20Bioinformatics%20Scientist%20NGS&origin=GLOBAL_SEARCH_HEADER)

---

## Portal health

Portals run this pass: `ashby`, `builtin`, `greenhouse`, `lever`, `linkedin`, `muse`,
`workday`. None disabled.

**One new confirmed defect, found by hitting it:**

```
health: builtin-search — degraded (detail --format plain crashes when a posting has a
single industry); .agents/skills/builtin-search/cli/src/commands/detail.ts:51
```

`detail.ts:51` calls `job.industries.join(", ")` behind a `job.industries?.length` guard.
Built In returns `industries` as a **string** (`"Biotech"`) when there is exactly one, and a
non-empty string passes the `.length` check — so `.join` is undefined and the command exits
1 with `DETAIL_FAILED`. Reproduced on the Agilent posting; `--format json` is unaffected and
was used as the workaround. The fix is a one-liner (normalize to an array before joining),
and it silently costs `/scrape` every plain-text detail read on single-industry postings —
which is most biotech listings.

Still standing from the earlier run, unchanged:

```
health: workday-search — degraded (--location is a naive case-insensitive substring match)
health: workday-search — degraded (--query is OR-matched server-side, not phrase-matched)
```

Both were re-confirmed this pass: `-q "computational biology"` returned "Internal Audit
Analyst III" and "Key Account Manager", and Workday remains unusable for multi-word queries.

No portal is broken. `greenhouse-search` legitimately returned near-zero for `workflow`,
`devops`, and `cloud` — its curated biotech list is 17 companies and none of them have
those roles open; the same CLI returned 30 rows for a bare `--sector biotech` sweep in the
same pass, which rules out a parser fault.
