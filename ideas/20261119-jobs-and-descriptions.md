# Bay Area Senior/Staff/Principal SWE Job Digest — 2026-11-19

## Summary

- **Sources used:** Greenhouse CLI (24 curated company boards; `10xgenomics` returned not-found), Ashby CLI (12 boards; `fireworksai` not-found), LinkedIn guest-search CLI (7 queries x 10 results, last 7 days), Lever CLI (5 boards, 0 matches). Builtin, Workday, Levels.fyi and WebSearch were not used, to keep request volume low.
- **Postings listed:** 82 distinct (after removing non-software roles such as sales/mechanical/quality/security-ops/manager, and non-Bay on-site results). All links are URLs returned by the tools.
- **Descriptions read:** **25** (16 via LinkedIn `detail`, 7 via Greenhouse `detail`, 2 via Ashby `detail`). I read only a ~3,000-character window of most descriptions, usually the requirements and pay sections. **All skill counts below are therefore lower bounds**, and percentages are of n=25.
- **Coverage bias:** the Greenhouse and Ashby company lists are curated (AI, biotech, autonomy, fintech), so those results lean toward AI labs and big tech. LinkedIn queries ran with "San Francisco Bay Area" or "San Jose", so SF companies are over-represented relative to the South Bay.
- **Headline findings:**
  - Distributed systems, Python/Go/Java, Kubernetes and cloud dominate.
  - AI and agent work is the fastest-rising theme.
  - Staff pay at AI labs is far above everyone else.
  - Posted bases:

| Level | Median of range midpoints |
|---|---|
| Senior | ~$196K |
| Staff | ~$280K |
| Principal | ~$265K |

- No earlier `ideas/*-jobs-and-descriptions.md` exists, so there is no "Change since last report" section yet. This file is the baseline.

## Top 20 technical skills (n=25 sampled descriptions; lower bounds)

| # | Skill | Postings | % |
|---|---|---|---|
| 1 | Distributed systems (explicit) | 12 | 48% |
| 2 | Python | 9 | 36% |
| 3 | Public cloud, any (AWS/GCP/Azure) | 9 | 36% |
| 4 | Go | 8 | 32% |
| 5 | Kubernetes | 8 | 32% |
| 6 | SQL / relational DB (Postgres, RDS) | 8 | 32% |
| 7 | LLMs / AI agents / agentic work | 8 | 32% |
| 8 | AWS specifically | 7 | 28% |
| 9 | Java / Kotlin | 7 | 28% |
| 10 | NoSQL / caching / search (Redis, Mongo, Elasticsearch, DynamoDB) | 7 | 28% |
| 11 | Auth/IAM/OAuth/security engineering | 6 | 24% |
| 12 | Kafka / streaming | 5 | 20% |
| 13 | CI/CD | 5 | 20% |
| 14 | REST/gRPC microservice APIs | 5 | 20% |
| 15 | C / C++ | 4 | 16% |
| 16 | On-call / production operations | 4 | 16% |
| 17 | Docker | 3 | 12% |
| 18 | Terraform / IaC | 3 | 12% |
| 19 | Regulated-industry compliance (HIPAA, SOC 2, audit) | 3 | 12% |
| 20 | Observability (Prometheus/Grafana/OpenTelemetry) | 3 | 12% |

Notes: Rust (2), Spring (1), Android/Kotlin (1) and SLURM/GPU clusters (1) are niche. Python and Docker are probably undercounted because of my read window.

## Top 10 experience requirements (n=25)

1. **Explicit years-of-experience floor:** 13 postings. Senior: 5+ (GM Energy, Waymo) or 6+ (Commure). Staff: 8–10+. Principal: 10–12+.
2. **CS/engineering degree or equivalent:** ~10.
3. **Cross-team technical leadership / influence without authority:** 9.
4. **End-to-end ownership, design through production:** 8.
5. **Mentoring other engineers:** 7.
6. **Explicit system/architecture design, design docs, multi-year roadmaps:** 6.
7. **Ambiguity tolerance / product mindset:** 6.
8. **On-call / operating production systems:** 4.
9. **Regulated-industry experience (healthcare, finance):** 3.
10. **In-office expectations stated** (Stripe 50%, Snap 4+ days, Rippling/GM/Benchling/PANW/Replit ~3 days, Anthropic 25%): 9. Fully remote is rare among Bay Area postings.

## Senior vs Staff vs Principal

- **Senior** (about 5–6 years typical; one NVIDIA "Senior" post asks 12+):
  - Hands-on delivery in a stack: backend APIs, platform/IaC, Kubernetes.
  - Examples: GM Energy, Commure, Heartflow, Waymo.
  - Base midpoints roughly $144K–$290K.
- **Staff** (8–10+ years):
  - Leading multi-team initiatives, setting technical direction, writing design docs, mentoring.
  - Examples: Stripe, Whatnot, Coinbase, Snap.
  - Snap Staff: 9+ years plus 1+ year of technical leadership.
  - Most require distributed-systems depth.
- **Principal** (10–12+ years):
  - Narrower deep-specialty scope: Postgres internals (ClickHouse), DLP (Palo Alto Networks), in-vehicle voice/agent architecture (GM).
  - Multi-year roadmaps and cross-org alignment (GM).
  - The pay spread within the level is wide ($147K–$366K).

## Emerging / rising signals

- **Agentic AI as the product:**
  - Waymo "Senior SWE, Agentic Test Systems" (building and productionizing agents).
  - Anthropic "Staff SWE, Internal Products" (LLM agents in high-stakes workflows, "evals and guardrails").
  - Salesforce "Senior/Lead SWE, Site Reliability (Agentforce Operations)".
  - GM "Principal SWE, Vehicle AI" (agentic LLM orchestration, preferred).
- **Agent identity / MCP:**
  - OpenAI "Software Engineer, Agent Identity" (OAuth/OIDC for agents acting on a user's behalf).
  - Replit "Senior/Staff SWE, Connectors Platform" (OAuth 2.0 credential proxy, MCP as a bonus).
- **Infrastructure serving AI agents:** Stripe "Staff SWE, Code Forge" (source control for engineers, AI agents and CI), plus "use AI coding agents every day".
- **GPU/AI infrastructure:** NVIDIA "Senior SWE, DGX Cloud" (GPU fleet automation, Kubernetes/SLURM); "Sr. SWE, AI Infrastructure (Starshield)" at SpaceX and "Datacenter Server Lifecycle" at Anthropic (titles only).
- **Internal developer platforms and GitOps:** Commure (Crossplane, Argo CD, OpenTelemetry), Heartflow (EKS migration).
- **Postgres and managed datastores as a platform specialty:** ClickHouse Principal Postgres, Coinbase Staff Datastores.
- **LLM evals:** only one explicit mention in the sample (Anthropic).

## Salary (posted base ranges in the sampled set; ranges may span levels)

| Level | Postings with pay | Range of posted lows–highs | Median of range midpoints |
|---|---|---|---|
| Senior (n=8) | Commure, NVIDIA L5, Heartflow, Salesforce, Oracle, GM Energy, Natera, Waymo | $79K–$357K | ~$196K |
| Staff (n=7) | Stripe IAM, Stripe ML, Rippling, Coinbase, Databricks, Anthropic x2 | $180K–$485K | ~$280K |
| Principal (n=3) | ClickHouse, Palo Alto Networks, GM Vehicle AI | $147K–$366K | ~$265K |

- OpenAI's unlevelled Software Engineer roles post $347K–$405K.
- Anthropic's two Staff roles post $320K–$405K and $405K–$485K.
- The Oracle low of $79K is Oracle's "broad range" disclaimer, not a realistic Senior base.
- Databricks's Staff range ($180.5K–$203K) is labelled "Local Pay Range" in the posting.
- Midpoints are my arithmetic on posted ranges. Samples are small.

## Fit for Jerry

**Top skill gaps relative to what postings ask**

1. Go, Java, or C++/Rust systems programming. The profile is Python/R-centered.
2. Deep large-scale distributed-systems ownership (48% of postings) and on-call at scale.
3. Kubernetes, Helm, GitOps/Argo CD and service mesh. Jerry has Docker and Terraform but no Kubernetes in the profile.
4. Streaming and NoSQL stacks (Kafka, Redis, Elasticsearch, DynamoDB).
5. Observability tooling (Prometheus, Grafana, OpenTelemetry).
6. OAuth/IAM depth, and years-of-experience floors at Staff+ that assume a pure-software career.

**Algorithm/data-structure-heavy flags:** the NVIDIA DGX Cloud post explicitly asks for "a solid understanding of Data Structures and Algorithms". Core-database and C++ roles (ClickHouse, Oracle) are systems-heavy. Avoid those.

**Five best matches** (Python/AWS/Terraform/regulated/agentic, South Bay or remote preferred):

1. **Heartflow, Senior Platform Engineer (Cloud Foundations)**, San Francisco, $180K–$215K. AWS (EKS/ECS/Lambda/RDS), Terraform, Python/Bash, and medical-device change control and audit evidence, which is close to GxP validation. Link: https://www.linkedin.com/jobs/view/senior-platform-engineer-cloud-foundations-at-heartflow-4478829300
2. **Commure, Senior Software Engineer, Infrastructure**, Mountain View listing (the SF listing was the one I read). Terraform, multi-cloud, HIPAA/SOC 2; Kubernetes is the gap. Posted comp for the SF listing: $170K–$220K. Link: https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-at-commure-4461196703
3. **Waymo, Senior SWE, Agentic Test Systems**, Mountain View, $213K–$263K. Building and productionizing agents; 5+ years of Python or C++. This role maps most directly to the Claude Code and agentic-AI-champion experience. Link: https://careers.withwaymo.com/jobs?gh_jid=8386398
4. **Natera, Senior Software Engineer**, US Remote, $125.6K–$175K. Genomics and diagnostics domain; AWS (SQS/S3/SNS/MSK), Docker, CI/CD, PostgreSQL. The primary language was outside my read window, so verify it. Link: https://job-boards.greenhouse.io/natera/jobs/6261258004
5. **Anthropic, Staff Software Engineer, Internal Products**, remote-friendly (travel required) / SF, $405K–$485K. LLM and agent products with evals and guardrails, and AI-adoption work. Staff-level bar is high. Link: https://job-boards.greenhouse.io/anthropic/jobs/5481096008

Honorable mention: Benchling "Software Engineer, Big Data Infrastructure" (life-science SaaS, Python/Terraform/Docker). It lists "1+ years" of experience and a $136K–$167K range, which looks junior for Jerry's level, so confirm the level before applying.

## All postings (82)

Dates are as returned by each tool. Salary "—" means none was seen. "Unspecified" means no level in the title. The Nextdoor date reads 2026-11-20 in LinkedIn's output (a time-zone quirk, tomorrow's date relative to today).

| Company | Title | Level | Location | Posted | Salary | Link |
|---|---|---|---|---|---|---|
| Waymo | Staff Software Engineer, Field Response | Staff | Mountain View, CA | 2026-11-18 | — | https://careers.withwaymo.com/jobs?gh_jid=8396989 |
| Databricks | Staff Software Engineer - Threat and Abuse Defense | Staff | Mountain View, CA | 2026-11-18 | $180.5K–$203K | https://databricks.com/company/careers/open-positions/job?gh_jid=8950673002 |
| Anthropic | Applied AI Engineer, Commercial | Unspecified | San Francisco, CA | 2026-11-18 | — | https://job-boards.greenhouse.io/anthropic/jobs/5483945008 |
| Waymo | Senior Machine Learning Engineer, Driver Refinement & Validation | Senior | Mountain View / San Francisco, CA | 2026-11-17 | — | https://careers.withwaymo.com/jobs?gh_jid=8380137 |
| Waymo | Senior Software Engineer, Simulator Platform | Senior | Mountain View / San Francisco, CA | 2026-11-17 | — | https://careers.withwaymo.com/jobs?gh_jid=8394788 |
| Latitude AI | Senior Embedded Software Engineer (C++) - Hardware Safety | Senior | Palo Alto, CA (+Remote) | 2026-11-17 | — | https://job-boards.greenhouse.io/latitude/jobs/8395533 |
| Robinhood | Software Engineer, Backend - Government Products | Unspecified | Menlo Park, CA | 2026-11-16 | $166K–$195K (Zone 1) | https://boards.greenhouse.io/robinhood/jobs/8385931?t=gh_src=&gh_jid=8385931 |
| Latitude AI | Senior Software Engineer (C++) - Sensor Pipelines | Senior | Palo Alto, CA | 2026-11-16 | — | https://job-boards.greenhouse.io/latitude/jobs/8393140 |
| Robinhood | Senior Client Platform Engineer | Senior | Menlo Park, CA | 2026-11-16 | — | https://boards.greenhouse.io/robinhood/jobs/8354333?t=gh_src=&gh_jid=8354333 |
| Waymo | Senior Software Engineer, Agentic Test Systems | Senior | Mountain View, CA | 2026-11-13 | $213K–$263K | https://careers.withwaymo.com/jobs?gh_jid=8386398 |
| Anthropic | Staff+ Software Engineer, Consumer | Staff | San Francisco, CA | 2026-11-13 | $320K–$405K | https://job-boards.greenhouse.io/anthropic/jobs/5477652008 |
| Anthropic | Staff Software Engineer, Internal Products | Staff | Remote-friendly (travel) / SF | 2026-11-13 | $405K–$485K | https://job-boards.greenhouse.io/anthropic/jobs/5481096008 |
| Anthropic | Software Engineer, Datacenter Server Lifecycle | Unspecified | Remote-friendly, US | 2026-11-16 | — | https://job-boards.greenhouse.io/anthropic/jobs/5484171008 |
| Coinbase | Senior Software Engineer, Financial Integrity | Senior | Remote - USA | 2026-11-17 | — | https://www.coinbase.com/careers/positions/8395582?gh_jid=8395582 |
| Coinbase | Staff Software Engineer, Infrastructure (Datastores) | Staff | Remote - USA | 2026-11-16 | $218K–$256.5K | https://www.coinbase.com/careers/positions/8286487?gh_jid=8286487 |
| Coinbase | Senior Software Engineer, Core Reliability | Senior | Remote - USA | 2026-11-16 | — | https://www.coinbase.com/careers/positions/8237493?gh_jid=8237493 |
| Coinbase | Senior Software Engineer, TRUST Network | Senior | Remote - USA | 2026-11-16 | — | https://www.coinbase.com/careers/positions/8368463?gh_jid=8368463 |
| Coinbase | Staff Software Engineer, TRUST Network | Staff | Remote - USA | 2026-11-13 | — | https://www.coinbase.com/careers/positions/8368472?gh_jid=8368472 |
| Natera | Senior Software Engineer | Senior | US Remote | 2026-11-13 | $125.6K–$175K | https://job-boards.greenhouse.io/natera/jobs/6261258004 |
| OpenAI | Software Engineer, Agent Identity | Unspecified | San Francisco; Mountain View | 2026-11-18 | $350K–$405K | https://jobs.ashbyhq.com/openai/a9a5a979-06a5-49af-95f3-7c537e3105c0 |
| OpenAI | Operating Systems Engineer \| Consumer Devices | Unspecified | San Francisco | 2026-11-19 | $230K–$342K | https://jobs.ashbyhq.com/openai/efed424b-e025-400f-8ac3-73e962b85751 |
| OpenAI | Operating Systems Engineer, Linux Kernel \| Consumer Devices | Unspecified | San Francisco | 2026-11-19 | $230K–$385K | https://jobs.ashbyhq.com/openai/f0529a1d-fb6a-4229-a590-8caff1785bb3 |
| Benchling | Data Engineer | Unspecified | San Francisco, CA | 2026-11-18 | $154K–$208K | https://jobs.ashbyhq.com/benchling/c97e5668-29ee-4810-b7cc-35331ac123f5 |
| SF Compute | Senior Product Engineer | Senior | San Francisco, CA | 2026-11-18 | — | https://jobs.ashbyhq.com/sfcompute/d12268a2-7e2b-4ef3-b53b-0808c648c427 |
| OpenAI | Full Stack Software Engineer, DotCom | Unspecified | San Francisco; New York City | 2026-11-17 | $347K–$385K | https://jobs.ashbyhq.com/openai/60f8bcbc-3ca5-42f4-a73b-e864a6340a16 |
| OpenAI | Full Stack Software Engineer, Dots for Companies | Unspecified | San Francisco | 2026-11-17 | $347K–$385K | https://jobs.ashbyhq.com/openai/7447dd43-9bf5-445f-bb8c-ba57756c8d04 |
| Benchling | Software Engineer, Big Data Infrastructure | Unspecified | San Francisco, CA | 2026-11-17 | $136.4K–$166.8K | https://jobs.ashbyhq.com/benchling/6183438d-1ff6-4389-aff9-a0128ff3a407 |
| Benchling | Software Engineer, CDC | Unspecified | San Francisco, CA | 2026-11-17 | $136.4K–$166.8K | https://jobs.ashbyhq.com/benchling/baa78673-4c25-4d61-8888-2eac4c63d8c5 |
| OpenAI | Software Engineer, Presence | Unspecified | San Francisco | 2026-11-17 | $347K–$385K | https://jobs.ashbyhq.com/openai/1327d083-c932-4aed-aadc-57586521ee60 |
| OpenAI | Full Stack Software Engineer, Travel | Unspecified | San Francisco | 2026-11-15 | $347K–$385K | https://jobs.ashbyhq.com/openai/2320fe69-df26-4d1d-ada6-d1a46c0e68a1 |
| OpenAI | Full Stack Software Engineer, Consumer Health | Unspecified | San Francisco | 2026-11-13 | $347K–$385K | https://jobs.ashbyhq.com/openai/cc1ea124-47ad-4b81-9e4e-0c69e525b62a |
| OpenAI | Full Stack Software Engineer, ChatGPT Finances | Unspecified | San Francisco | 2026-11-13 | $347K–$385K | https://jobs.ashbyhq.com/openai/26cfb873-f30a-4a13-b7b6-52833ea48ec9 |
| General Motors | Senior Backend Software Engineer - GM Energy | Senior | Sunnyvale, CA | 2026-11-17 | $129.4K–$198.4K | https://www.linkedin.com/jobs/view/senior-backend-software-engineer-gm-energy-at-general-motors-4491700464 |
| SpaceX Super Intelligence | Sr. Software Engineer, Real-Time Storage | Senior | Palo Alto, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-real-time-storage-at-spacex-super-intelligence-4482755080 |
| General Motors | Senior Software Engineer, AV Frameworks | Senior | Sunnyvale, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-av-frameworks-at-general-motors-4490584179 |
| Walmart Global Tech | Senior, Software Engineer (Sunnyvale On-Site Hiring Event) | Senior | Sunnyvale, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-sunnyvale-on-site-hiring-event-at-walmart-global-tech-4409228472 |
| Oracle | Senior Software Engineer, Core Infrastructure (C++) | Senior | Santa Clara, CA | 2026-11-14 | $79.2K–$209.5K | https://www.linkedin.com/jobs/view/senior-software-engineer-core-infrastructure-c%2B%2B-at-oracle-4472992080 |
| NVIDIA | Senior Software Engineer, Embedded Platform Middleware - Automotive and Robotics | Senior | Santa Clara, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-embedded-platform-middleware-%E2%80%94-automotive-and-robotics-at-nvidia-4448261405 |
| NVIDIA | Senior Storage Software Engineer, DGXC Data Services | Senior | Santa Clara, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/senior-storage-software-engineer-dgxc-data-services-at-nvidia-4436254969 |
| Tesla | Sr. Software Engineer, Manufacturing Quality | Senior | Fremont, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-manufacturing-quality-at-tesla-4491011905 |
| Plaid | Senior Software Engineer, Backend | Senior | San Francisco Bay Area | 2026-11-13 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-backend-at-plaid-4410255594 |
| Robinhood | Senior Software Engineer, Government Products | Senior | Menlo Park, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-government-products-at-robinhood-4490559866 |
| Stripe | Staff Software Engineer, Code Forge | Staff | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-code-forge-at-stripe-4491041439 |
| Cash App | Staff Software Engineer, Financial Platform - Issuing | Staff | Oakland, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-financial-platform-issuing-at-cash-app-4463493703 |
| Scribe | Staff Backend Engineer | Staff | San Francisco, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/staff-backend-engineer-at-scribe-4472371702 |
| Cash App | Staff Software Engineer, Financial Platform - Issuing | Staff | San Jose, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-financial-platform-issuing-at-cash-app-4463916095 |
| Whatnot | Staff Software Engineer, Discovery Platform | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-discovery-platform-at-whatnot-4474999704 |
| Stripe | Staff Software Engineer, IAM Control Plane | Staff | San Francisco, CA | 2026-11-18 | $224K–$336K | https://www.linkedin.com/jobs/view/staff-software-engineer-iam-control-plane-at-stripe-4481782231 |
| Replit | Senior / Staff Software Engineer, Connectors Platform | Senior/Staff | Foster City, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-staff-software-engineer-connectors-platform-at-replit-4491885723 |
| Cloudflare | Staff/Principal Software Engineer - Security Platform | Staff/Principal | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-principal-software-engineer-security-platform-at-cloudflare-4458045210 |
| Rippling | Staff Software Engineer - Core Experience | Staff | San Francisco, CA | 2026-11-19 | $189K–$315K | https://www.linkedin.com/jobs/view/staff-software-engineer-core-experience-at-rippling-4458526715 |
| Snap Inc. | Staff Software Engineer, Backend, Level 6 | Staff | Palo Alto, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-backend-level-6-at-snap-inc-4484228122 |
| Palo Alto Networks | Principal Engineer Software (DLP) | Principal | Santa Clara, CA | 2026-11-17 | $147K–$237.5K | https://www.linkedin.com/jobs/view/principal-engineer-software-dlp-at-palo-alto-networks-4363165173 |
| NVIDIA | Principal Software Engineer - Employee Productivity | Principal | Santa Clara, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-employee-productivity-at-nvidia-4446883704 |
| Amazon Web Services (AWS) | Principal Engineer, Amazon (Multiple Locations, Global Specialty Recruiting) | Principal | Sunnyvale, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/principal-engineer-amazon-multiple-locations-usa-global-specialty-recruiting-team-at-amazon-web-services-aws-4455921774 |
| NVIDIA | Principal Software Engineer | Principal | Santa Clara, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-at-nvidia-4482305064 |
| Amazon | Principal Software Engineer, Amazon DSP (Demand-Side Platform) - Advertising | Principal | Palo Alto, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-amazon-dsp-demand-side-platform-%E2%80%94-advertising-at-amazon-4456723075 |
| Collins Aerospace | Principal Software Engineer | Principal | San Jose, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-at-collins-aerospace-4491105336 |
| Palo Alto Networks | Sr Principal Engineer Software | Principal | Santa Clara, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/sr-principal-engineer-software-at-palo-alto-networks-4491342406 |
| General Motors | Principal Software Engineer - Vehicle AI | Principal | Mountain View, CA | 2026-11-13 | $238.7K–$365.7K | https://www.linkedin.com/jobs/view/principal-software-engineer-vehicle-ai-at-general-motors-4465350312 |
| Collins Aerospace | Principal Software Engineer - Front-end Developer | Principal | San Jose, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-%E2%80%93-front-end-developer-at-collins-aerospace-4484419461 |
| ClickHouse | Principal Software Engineer - Postgres | Principal | San Francisco, CA | 2026-11-18 | $220K–$310K | https://www.linkedin.com/jobs/view/principal-software-engineer-postgres-at-clickhouse-4491836064 |
| Commure | Senior Software Engineer, Infrastructure | Senior | San Francisco, CA | 2026-11-18 | $170K–$220K | https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-at-commure-4461411311 |
| Commure | Senior Software Engineer, Infrastructure | Senior | Mountain View, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-at-commure-4461196703 |
| Nextdoor | Senior Software Engineer, Cloud Engineering | Senior | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-cloud-engineering-at-nextdoor-4492763017 |
| Bloom Energy | Sr Staff Software Engineer - DevOps | Staff | San Jose, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/sr-staff-software-engineer-devops-at-bloom-energy-4389082165 |
| Heartflow | Senior Platform Engineer (Cloud Foundations) | Senior | San Francisco, CA | 2026-11-18 | $180K–$215K | https://www.linkedin.com/jobs/view/senior-platform-engineer-cloud-foundations-at-heartflow-4478829300 |
| Heartflow | Senior Platform Engineer (Compute Migration) | Senior | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-platform-engineer-compute-migration-at-heartflow-4461928969 |
| SpaceX | Sr. Software Engineer, AI Infrastructure (Starshield) | Senior | Palo Alto, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-ai-infrastructure-starshield-at-spacex-4474577169 |
| NVIDIA | Senior Software Engineer - DGX Cloud | Senior | Santa Clara, CA | 2026-11-18 | $224K–$356.5K (L5); $272K–$431K (L6) | https://www.linkedin.com/jobs/view/senior-software-engineer-dgx-cloud-at-nvidia-4483810971 |
| Salesforce | Senior/Lead Software Engineer, Site Reliability (Agentforce Operations) | Senior | San Francisco, CA | 2026-11-14 | $148.5K–$313.7K ($178.9K–$344.7K SF) | https://www.linkedin.com/jobs/view/senior-lead-software-engineer-site-reliability-agentforce-operations-at-salesforce-4475076088 |
| Fastly | Senior Engineer - Cloud and Container Services | Senior | San Francisco, CA | 2026-11-16 | — | https://www.linkedin.com/jobs/view/senior-engineer-cloud-and-container-services-at-fastly-4487861613 |
| NVIDIA | Senior Machine Learning Engineer, Perception - Autonomous Driving | Senior | Santa Clara, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-perception-autonomous-driving-at-nvidia-4475138356 |
| Klaviyo | Senior Machine Learning Engineer | Senior | Palo Alto, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-klaviyo-4460640544 |
| NVIDIA | Deep Learning Senior Engineer, End-To-End Autonomous Driving | Senior | Santa Clara, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/deep-learning-senior-engineer-end-to-end-autonomous-driving-at-nvidia-4475124989 |
| 6sense | Sr. Machine Learning Engineer | Senior | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/sr-machine-learning-engineer-at-6sense-4456784011 |
| EvenUp | Senior Machine Learning Engineer | Senior | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-evenup-4437312010 |
| Amazon | Sr. Machine Learning Engineer, FAI | Senior | Sunnyvale, CA | 2026-11-13 | — | https://www.linkedin.com/jobs/view/sr-machine-learning-engineer-fai-at-amazon-4490544624 |
| hum.ai | Senior Machine Learning Engineer | Senior | San Francisco, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-hum-ai-4491759274 |
| Applied Intuition | Senior Machine Learning Engineer - Generative Models | Senior | Sunnyvale, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-generative-models-at-applied-intuition-4474992695 |
| Stripe | Staff Machine Learning Engineer, Financial Connections | Staff | San Francisco, CA | 2026-11-18 | $253.5K–$380.3K | https://www.linkedin.com/jobs/view/staff-machine-learning-engineer-financial-connections-at-stripe-4458578088 |
| Plenful | Senior Machine Learning Engineer | Senior | San Francisco Bay Area | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-plenful-4444171613 |

## Method notes and caveats

- A LinkedIn "Remote, United States" Python/AWS query returned mostly on-site roles in other states (AZ, MA, IA, TX, OK, NC, NY). Those were excluded. Genuine remote-US Senior/Staff coverage in this report comes mainly from Coinbase and Natera on Greenhouse.
- Counts come from sampled descriptions only, and mostly from a mid-to-late text window of each posting. Treat them as directional.
- Salary figures are copied from the postings. Midpoints and medians are my own arithmetic on the posted ranges.
- Cloudflare's Staff/Principal posting was fetched, but my text window held only boilerplate, so it was excluded from the n=25 counts. It stays in the table.
- Possible duplicates kept as separate entries: Robinhood "Software Engineer, Backend - Government Products" (Greenhouse) and "Senior Software Engineer, Government Products" (LinkedIn) have different IDs and titles.
