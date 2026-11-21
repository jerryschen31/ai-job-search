# Bay Area Senior/Staff/Principal SWE Job Digest — 2026-11-20

## Summary

- **Sources used:**
  - Greenhouse CLI: 24 curated company boards; `10xgenomics` returned not-found.
  - Ashby CLI: 12 boards; `fireworksai` returned not-found.
  - Lever CLI: 1 query, returned 8 rows with no URLs in table output, so they are excluded from the table (see caveats).
  - LinkedIn guest-search CLI: 9 queries, 10 results per page, last 7 days.
  - Builtin, Workday, Levels.fyi and WebSearch were not used, to keep request volume low.
- **Postings listed:** 94 distinct rows in the table. All links are URLs returned by the tools. I removed non-software roles (sales, solutions, quality, mechanical, security-ops, managers, directors) and postings outside the Bay Area or non-US.
- **Descriptions read: 27** (19 via LinkedIn `detail`, 4 via Greenhouse `detail`, 4 via Ashby `detail`; for 8 of the LinkedIn ones I also re-read the tail to find pay). I read roughly the first 4,000-5,000 characters of most, so **every skill count below is a lower bound** and percentages are of n=27.
- **Coverage bias:** Greenhouse/Ashby lists are curated (AI labs, biotech, autonomy, fintech). LinkedIn returns 10 results per query page, so it is a sample, not a census. SF companies are over-represented relative to the South Bay.
- **Headline findings:**
  - Distributed systems, Kubernetes, Python/Go and public cloud dominate.
  - Security/identity/auth is the biggest "domain" theme (10 of 27).
  - AI-agent work is the fastest-rising theme, and "AI-fluency" is now stated as a hiring expectation (8 of 27).
  - Staff pay posted in this sample centres around $244K base; AI labs and OpenAI-type unlevelled roles post $350K+.

| Level | Postings with pay | Median of range midpoints |
|---|---|---|
| Senior | 5 | ~$198K |
| Senior/Staff | 2 | ~$323K |
| Staff | 4 | ~$244K |
| Principal | 1 | ~$320K |

## Change since last report (2026-11-19)

- Yesterday's report: 82 postings, 25 descriptions. Today's table: 94 postings, 27 descriptions.
- Overlap: by my manual comparison, about 54 of today's 94 rows were already in yesterday's table (a count by eye, not a scripted diff), so about 40 are new. Most of yesterday's Anthropic, Natera and Waymo "Agentic Test Systems" rows are not in today's table, likely because they were posted on 2026-11-13 and aged out of the 7-day window (I did not verify this).
- Newly surfaced roles include Anthropic "Staff+ SWE, Capacity Engineering" and "Principal Engineer, Capacity/Compute" (posted 11-20), Suno "Bots + Fraud", Replit "Staff SWE, Enterprise", Snowflake "FoundationDB", Reddit "Infrastructure Engineering", ServiceNow/Veza "Staff Data Platform", Roblox "Principal SWE, WebRTC", and several Braze/OKX/Imply/Sigma/EliseAI/Snorkel staff roles.
- Skill mix moved, but the two samples overlap heavily and differ in read window, so treat these as noise-level shifts:

| Skill | 11-19 (n=25) | 11-20 (n=27) |
|---|---|---|
| Distributed systems | 48% | 63% |
| Public cloud (any) | 36% | 48% |
| Kubernetes | 32% | 44% |
| Python | 36% | 44% |
| Go | 32% | 33% |
| LLM/agent as product | 32% | 22% |
| Security/IAM/auth | 24% | 37% |

- Same stories as yesterday: agent identity (OpenAI, Replit), Stripe Code Forge serving AI agents, SpaceX AI infrastructure, Commure/Heartflow platform roles. Posted bases are consistent with yesterday (Staff $180K-$320K bands; OpenAI $347K-$405K).

## Top 20 technical skills (n=27 sampled descriptions; lower bounds)

| # | Skill | Postings | % |
|---|---|---|---|
| 1 | Distributed systems (explicit) | 17 | 63% |
| 2 | Public cloud, any (AWS/GCP/Azure) | 13 | 48% |
| 3 | Kubernetes | 12 | 44% |
| 4 | Python | 12 | 44% |
| 5 | Security / identity / auth / anti-abuse | 10 | 37% |
| 6 | Go | 9 | 33% |
| 7 | AWS specifically | 9 | 33% |
| 8 | AI-assisted development expected (AI coding agents/tools, "AI-native") | 8 | 30% |
| 9 | Observability (Prometheus/Grafana/OpenTelemetry, monitoring) | 8 | 30% |
| 10 | NoSQL / cache / search (Redis, Mongo, Elasticsearch, DynamoDB, KV) | 7 | 26% |
| 11 | Kafka / streaming / messaging / event-driven | 7 | 26% |
| 12 | CI/CD | 7 | 26% |
| 13 | Java / Kotlin | 6 | 22% |
| 14 | C / C++ | 6 | 22% |
| 15 | Terraform / IaC | 6 | 22% |
| 16 | SQL / relational DB (Postgres, RDS) | 6 | 22% |
| 17 | LLM / AI agents as the product or platform | 6 | 22% |
| 18 | REST / gRPC / GraphQL APIs | 5 | 19% |
| 19 | Docker / containers | 4 | 15% |
| 20 | Regulated-industry compliance (HIPAA, SOC 2, regulated data) | 4 | 15% |

Notes: GitOps/Argo/Helm (3), GPU/accelerator fleets (3), Rust (1) are niche. Docker is probably undercounted because of my read window; "Docker / containers" counts GM, SpaceX, Palo Alto Networks and Benchling (ECS/Kubernetes). "AI-assisted dev expected" counts Stripe, Snap, Reddit, Suno, Virta, Benchling (AI interview exercise), Cloudflare, Snowflake.

## Top 10 experience requirements (n=27)

1. **Explicit years-of-experience floor:** 20 postings (74%). Senior 5-6+, Staff 7-10+, Principal 8-10+ (details below).
2. **Mentoring other engineers:** 12.
3. **Cross-team technical leadership / influence without authority:** 11.
4. **End-to-end ownership, design through production:** 10.
5. **CS/engineering degree (or equivalent):** 10.
6. **On-call / operating production systems / incident response:** 9.
7. **Domain depth** (security, fraud/abuse, identity, datastores, healthcare data): about 10.
8. **AI-tool fluency** (using coding agents, evaluating AI output, AI interview exercise): 8.
9. **Stated in-office expectations:** Suno 5 days, Snap 4+, Rippling 3, Robinhood 3, Palo Alto Networks 3, Roblox Tue-Thu; Replit/Benchling/OpenAI hybrid; Coinbase remote-first with quarterly "surges". Fully remote is rare for Bay Area postings.
10. **Ambiguity tolerance / set direction in new problem spaces:** 5 (Whatnot, Anthropic, OpenAI, Waymo, Cloudflare).

Also seen: explicit algorithms/CS-fundamentals asks in 2 (Snowflake FoundationDB, Rippling); a Top Secret clearance requirement in 1 (SpaceX); a Japanese-fluency requirement in 1 (Waymo Field Response).

## Senior vs Staff vs Principal

- **Senior** (5-6+ years typical): hands-on delivery within a stack, own a service or platform area.
  - Examples: GM Energy 5+, Reddit 5+, Rippling 5+, Suno 5+, Snowflake FDB 6+, Commure 6+, SpaceX 5+.
  - Outlier: NVIDIA "Senior SWE, Agentic AI" asks 8+ years in Rust/Python/Go/Node.
- **Staff** (7-10+ years): set technical direction, lead multi-team initiatives, write design docs, mentor.
  - Waymo 7+; Whatnot, Cloudflare, Robinhood, Databricks, Coinbase 8+; Snap 9+ plus 1+ year of technical leadership; Stripe and ServiceNow 10+.
  - Most require distributed-systems depth.
- **Principal** (8-10+ years): narrower, deep specialty or whole-product ownership.
  - Roblox WebRTC 8+ (C++, real-time at scale); Palo Alto Networks DLP 10+ (Java/Spring cloud services).
  - Roblox's Principal floor is lower than several Staff floors, so levels are not comparable across companies.

## Emerging / rising signals

- **Agentic AI as the product or platform:**
  - NVIDIA "Senior SWE, Agentic AI" (libraries for agent harnesses; evaluation/benchmarking of agent workflows is a "stand out" item).
  - Robinhood "Staff SWE, AI Security" (platform for teams to build and operate AI agents safely).
  - Salesforce "Senior/Lead SWE, Site Reliability (Agentforce Operations)" (AIOps, AI/ML infrastructure).
  - Databricks "Staff SWE, Threat and Abuse Defense" (an agent framework for triaging threats, ML scoring).
- **Agent identity and delegated authorization:** OpenAI "Software Engineer, Agent Identity" (OAuth/OIDC, delegation, "Sign in with ChatGPT"); Replit "Senior/Staff SWE, Connectors Platform" (OAuth, credential proxy, agent execution).
- **Infrastructure serving AI agents as first-class users:** Stripe "Staff SWE, Code Forge" (source control for "every engineer, AI agent, and CI job"; candidates are expected to use AI coding agents daily).
- **AI-fluency as a hiring criterion:**
  - Benchling adds an AI-focused exercise to interviews.
  - Snap asks for the judgment to audit AI-generated output.
  - Snowflake and Cloudflare write "AI-native" into their descriptions.
  - Virta describes an "AI-augmented" way of working.
  - Suno lists AI use for building and on-call as a nice-to-have.
- **GPU / AI fleet infrastructure:** SpaceX "AI Infrastructure (Starshield)" (100k+ GPU clusters, Kubernetes, Top Secret); Anthropic "Staff+ SWE, Capacity Engineering" (multi-accelerator, multi-cloud fleet telemetry, BigQuery, Kubernetes). Anthropic also posted "Principal Engineer, Capacity/Compute" (title only; description not read).
- **Anti-abuse / fraud / identity security** (new theme): Suno Bots + Fraud, Databricks Threat and Abuse, Cloudflare Security Platform (PKI, workload identity), ServiceNow/Veza (identity graph), MongoDB IAM (FedRAMP).
- **MCP / LLM evals:** MCP was not seen in my read windows today; "evaluation/benchmarking" appears once explicitly (NVIDIA). I cannot rule out more in unread text.

## Salary (posted base ranges seen today; ranges may span levels)

| Level | Postings (pay seen today) | Range of posted lows-highs | Median of range midpoints |
|---|---|---|---|
| Senior (n=5) | NVIDIA Agentic AI (L4-L5), Rippling Backend Platform, Heartflow Cloud Foundations, Commure Infrastructure, ClickHouse Infra Automation | $150K-$442K | ~$198K |
| Senior/Staff (n=2) | Suno Bots + Fraud, Replit Connectors | $229K-$400K | ~$323K |
| Staff (n=4) | Databricks Threat and Abuse, Coinbase Datastores, Replit Enterprise, Waymo Field Response | $180K-$320K | ~$244K |
| Staff/Principal (n=1) | Cloudflare Security Platform (CA range) | $220K-$303K | ~$262K |
| Principal (n=1) | Roblox WebRTC | $295K-$345K | ~$320K |

- Unlevelled OpenAI software engineer roles post $347K-$405K (Agent Identity $350K-$405K; four Full Stack roles $347K-$385K).
- Benchling unlevelled roles post $136K-$167K (Big Data Infrastructure, CDC) and $173K-$235K (Full Stack, Core Admin).
- NVIDIA's range is wide: L4 $187.5K-$364K, L5 $232.5K-$442K.
- Midpoints are my arithmetic on posted ranges, and samples are very small. Many postings showed no pay in the portion I read.

## Fit for Jerry

**Top skill gaps relative to what postings ask**

1. Go, Java, or C++/Rust systems programming (Go 33%, Java 22%, C++ 22%). The profile is Python/R-centered.
2. Internet-scale distributed systems ownership (63%) and on-call at that scale.
3. Kubernetes, Helm, GitOps/Argo CD, service mesh (Kubernetes 44%). The profile shows Docker and Terraform but no Kubernetes.
4. Security/identity engineering (OAuth/OIDC, IAM, PKI; 37%).
5. Streaming and NoSQL stacks (Kafka, Redis, Elasticsearch, DynamoDB; ~26% each).
6. Observability tooling (Prometheus, Grafana, OpenTelemetry; 30%) and years-of-experience floors at Staff+ that assume a pure-software-engineering career.

**Algorithm/data-structure-heavy flags (avoid):** Snowflake "Senior SWE - FoundationDB" (C++ systems, "strong CS fundamentals including data structures, algorithms"); Roblox Principal WebRTC (C++, kernel/assembly performance); NVIDIA "Principal Engineer, CUDA UMD - GPU Kernel Scheduling" (title only); Rippling Backend Platform lists algorithms fundamentals.

**Five best matches** (Python/AWS/Terraform/regulated/agentic; South Bay or remote preferred)

1. **NVIDIA, Senior Software Engineer, Agentic AI**, Santa Clara, posted 2026-11-20, base $187.5K-$364K (L4) / $232.5K-$442K (L5). South Bay. Core libraries for agent harnesses with RAG/vector DB, LLM tool-calling and evaluation. This is the closest to Jerry's Claude Code and agentic-AI work. Gaps: asks 8+ years in Rust/Python/Go/Node and open-source library work; performance profiling across language boundaries is a stretch.
2. **General Motors, Senior Backend Software Engineer - GM Energy**, Sunnyvale. South Bay. Python is an accepted language, 5+ years, REST APIs, cloud, observability, with Docker/Kubernetes and "regulated, enterprise" environments as preferred. Azure preference; backend platform emphasis is more software-engineering than Jerry's bioinformatics background. No pay seen today.
3. **Heartflow, Senior Platform Engineer (Cloud Foundations)**, San Francisco, base $180K-$215K. AWS (EKS/Lambda/Fargate/RDS/IAM), Terraform/Terragrunt, medical-technology company, so regulated-change experience maps to his GxP background. Gap: Kubernetes migration experience.
4. **ClickHouse, Senior Software Engineer, Infrastructure Automation**, San Francisco (company is remote-friendly), base $150K-$230K. Python and/or Go, Terraform, AWS/GCP, working-hours-only on-call. Gaps: Kubernetes mastery, hundreds-of-clusters scale, GitOps tools.
5. **Commure, Senior Software Engineer, Infrastructure**, San Francisco, base $170K-$220K. Terraform on AWS/GCP/Azure, HIPAA/SOC 2 by default, internal developer platform. Gaps: Kubernetes fleet, Argo CD, service mesh. (A Mountain View listing existed yesterday; today's tool output returned only the SF listing.)

Honorable mentions: Benchling "Software Engineer, Big Data Infrastructure" (biotech SaaS, Python/Terraform/ECS-Kubernetes, but it asks only 1+ years and posts $136K-$167K, so it is below level); Virta Health "Senior Software Engineer II" (regulated healthcare data platform, AI-augmented, SF); Salesforce Agentforce SRE (AIOps and IaC).

## All postings

Dates are as returned by each tool. Salary "—" means none was seen in today's tool output (many postings carry pay in text I did not read). "Unlevelled" means no level in the title.

| Company | Title | Level | Location | Posted | Salary | Link |
|---|---|---|---|---|---|---|
| Anthropic | Staff+ Software Engineer, Capacity Engineering | Staff+ | San Francisco, CA | 2026-11-20 | — | https://job-boards.greenhouse.io/anthropic/jobs/5490979008 |
| Anthropic | Principal Engineer Capacity/Compute | Principal | San Francisco, CA | 2026-11-20 | — | https://job-boards.greenhouse.io/anthropic/jobs/5490974008 |
| Anthropic | Software Engineer, Datacenter Server Lifecycle | Unlevelled | Remote-friendly, US | 2026-11-16 | — | https://job-boards.greenhouse.io/anthropic/jobs/5484171008 |
| Waymo | Staff Software Engineer, Field Response | Staff | Mountain View, CA | 2026-11-18 | $251K-$310K | https://careers.withwaymo.com/jobs?gh_jid=8396989 |
| Waymo | Senior Software Engineer, Simulator Platform | Senior | Mountain View / San Francisco, CA | 2026-11-17 | — | https://careers.withwaymo.com/jobs?gh_jid=8394788 |
| Waymo | Senior Machine Learning Engineer, Driver Refinement & Validation | Senior | Mountain View / San Francisco, CA | 2026-11-17 | — | https://careers.withwaymo.com/jobs?gh_jid=8380137 |
| Databricks | Staff Software Engineer - Threat and Abuse Defense | Staff | Mountain View, CA | 2026-11-18 | $180.5K-$203K | https://databricks.com/company/careers/open-positions/job?gh_jid=8950673002 |
| Coinbase | Staff Software Engineer, Infrastructure (Datastores) | Staff | Remote - USA | 2026-11-16 | $218K-$256.5K | https://www.coinbase.com/careers/positions/8286487?gh_jid=8286487 |
| Coinbase | Senior Software Engineer, Financial Integrity | Senior | Remote - USA | 2026-11-17 | — | https://www.coinbase.com/careers/positions/8395582?gh_jid=8395582 |
| Coinbase | Senior Software Engineer, Core Reliability | Senior | Remote - USA | 2026-11-16 | — | https://www.coinbase.com/careers/positions/8237493?gh_jid=8237493 |
| Coinbase | Senior Software Engineer, TRUST Network | Senior | Remote - USA | 2026-11-16 | — | https://www.coinbase.com/careers/positions/8368463?gh_jid=8368463 |
| Robinhood | Software Engineer, Backend - Government Products | Unlevelled | Menlo Park, CA | 2026-11-16 | — | https://boards.greenhouse.io/robinhood/jobs/8385931?t=gh_src=&gh_jid=8385931 |
| Robinhood | Staff Software Engineer, AI Security | Staff | Menlo Park, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-ai-security-at-robinhood-4474098574 |
| Latitude AI | Senior Embedded Software Engineer (C++) - Hardware Safety | Senior | Palo Alto, CA (+Remote) | 2026-11-17 | — | https://job-boards.greenhouse.io/latitude/jobs/8395533 |
| Latitude AI | Senior Software Engineer (C++) - Sensor Pipelines | Senior | Palo Alto, CA | 2026-11-16 | — | https://job-boards.greenhouse.io/latitude/jobs/8393140 |
| Benchling | Software Engineer, Full Stack (Core Admin) | Unlevelled | San Francisco, CA | 2026-11-20 | $173.4K-$234.6K | https://jobs.ashbyhq.com/benchling/0ad40d59-6e70-4081-8123-4864fc1b12d8 |
| Benchling | Software Engineer, Big Data Infrastructure | Unlevelled | San Francisco, CA | 2026-11-17 | $136.4K-$166.8K | https://jobs.ashbyhq.com/benchling/6183438d-1ff6-4389-aff9-a0128ff3a407 |
| Benchling | Software Engineer, CDC | Unlevelled | San Francisco, CA | 2026-11-17 | $136.4K-$166.8K | https://jobs.ashbyhq.com/benchling/baa78673-4c25-4d61-8888-2eac4c63d8c5 |
| Suno | Senior/Staff Software Engineer, Bots + Fraud | Senior/Staff | San Francisco, CA | 2026-11-20 | $229K-$363.5K | https://jobs.ashbyhq.com/suno/84af340c-efff-42b6-9861-4baee60b7405 |
| Replit | Senior / Staff Software Engineer, Connectors Platform | Senior/Staff | Foster City, CA | 2026-11-18 | $300K-$400K | https://jobs.ashbyhq.com/replit/fa9ee306-7e2b-4d94-87d1-0db292102f03 |
| Replit | Staff Software Engineer, Enterprise | Staff | Foster City, CA | 2026-11-17 | $180K-$320K | https://jobs.ashbyhq.com/replit/b7f12834-78d2-424d-bf83-0c942815fbf7 |
| OpenAI | Software Engineer, Agent Identity | Unlevelled | San Francisco / Mountain View, CA | 2026-11-18 | $350K-$405K | https://jobs.ashbyhq.com/openai/a9a5a979-06a5-49af-95f3-7c537e3105c0 |
| OpenAI | Full Stack Software Engineer, DotCom | Unlevelled | San Francisco, CA | 2026-11-17 | $347K-$385K | https://jobs.ashbyhq.com/openai/60f8bcbc-3ca5-42f4-a73b-e864a6340a16 |
| OpenAI | Full Stack Software Engineer, Dots for Companies | Unlevelled | San Francisco, CA | 2026-11-17 | $347K-$385K | https://jobs.ashbyhq.com/openai/7447dd43-9bf5-445f-bb8c-ba57756c8d04 |
| OpenAI | Software Engineer, Presence | Unlevelled | San Francisco, CA | 2026-11-17 | $347K-$385K | https://jobs.ashbyhq.com/openai/1327d083-c932-4aed-aadc-57586521ee60 |
| OpenAI | Full Stack Software Engineer, Travel | Unlevelled | San Francisco, CA | 2026-11-15 | $347K-$385K | https://jobs.ashbyhq.com/openai/2320fe69-df26-4d1d-ada6-d1a46c0e68a1 |
| Salesforce | Senior Software Engineer (SMTS), Identity & Access Management - Device Trust | Senior | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-smts-identity-access-management-device-trust-at-salesforce-4484005104 |
| General Motors | Senior Backend Software Engineer - GM Energy | Senior | Sunnyvale, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/senior-backend-software-engineer-gm-energy-at-general-motors-4491700464 |
| Zoox | Senior Software Engineer, C++ Vehicle Experience | Senior | Foster City, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-c%2B%2B-vehicle-experience-at-zoox-4485236810 |
| ClickHouse | Senior Software Engineer - ClickHouse Private (Remote) | Senior | San Francisco, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-clickhouse-private-remote-at-clickhouse-4492523189 |
| Guidewire Software | Senior Software Engineer - Application Platform | Senior | San Mateo, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-application-platform-at-guidewire-software-4468297910 |
| Walmart Global Tech | Senior, Software Engineer (Sunnyvale - On-Site Hiring Event) | Senior | Sunnyvale, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-sunnyvale-on-site-hiring-event-at-walmart-global-tech-4409228472 |
| Oracle | Senior Software Engineer, Core Infrastructure (C++) | Senior | Santa Clara, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-core-infrastructure-c%2B%2B-at-oracle-4472992080 |
| NVIDIA | Senior Software Engineer, Agentic AI | Senior | Santa Clara, CA | 2026-11-20 | $187.5K-$364K (L4); $232.5K-$442K (L5) | https://www.linkedin.com/jobs/view/senior-software-engineer-agentic-ai-at-nvidia-4492567012 |
| NVIDIA | Senior Software Engineer, Embedded Platform Middleware - Automotive and Robotics | Senior | Santa Clara, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-embedded-platform-middleware-%E2%80%94-automotive-and-robotics-at-nvidia-4448261405 |
| Rippling | Senior Software Engineer, Backend - Platform | Senior | San Francisco, CA | 2026-11-16 | $159K-$278.25K | https://www.linkedin.com/jobs/view/senior-software-engineer-backend-platform-at-rippling-4466492101 |
| Snowflake | Senior Software Engineer - Foundation DB | Senior | Menlo Park, CA | 2026-11-21 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-foundation-db-at-snowflake-4493236346 |
| Virta Health | Senior Software Engineer II | Senior | San Francisco, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-ii-at-virta-health-4447277444 |
| Rippling | Senior Software Engineer, Backend - IT Product | Senior | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-backend-it-product-at-rippling-4492235099 |
| Google | Senior Software Engineer, Embedded, Pixel Graphics | Senior | Mountain View, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-embedded-pixel-graphics-at-google-4483602654 |
| MongoDB | Senior Software Engineer, Identity & Access Management (FedRamp) | Senior | San Francisco, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-identity-access-management-fedramp-at-mongodb-4467933226 |
| MongoDB | Senior Software Engineer, Identity & Access Management (FedRamp) | Senior | Palo Alto, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-identity-access-management-fedramp-at-mongodb-4467923282 |
| Reddit | Senior Software Engineer, Infrastructure Engineering | Senior | San Francisco, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-engineering-at-reddit-inc-4484905377 |
| PayPal | Sr Software Engineer, Venmo Platform | Senior | San Jose, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-venmo-platform-at-paypal-4491113135 |
| Scout Motors | Sr. Software Engineer (Android) - Digital Products | Senior | San Ramon, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-android-digital-products-at-scout-motors-inc-4491961770 |
| Higharc | Sr. Software Engineer, Structural | Senior | San Francisco, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-structural-at-higharc-4456549970 |
| Stripe | Staff Software Engineer, Code Forge | Staff | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-code-forge-at-stripe-4491041439 |
| Cash App | Staff Software Engineer, Financial Platform - Issuing | Staff | Oakland, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-financial-platform-issuing-at-cash-app-4463493703 |
| Cash App | Staff Software Engineer, Financial Platform - Issuing | Staff | San Jose, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-financial-platform-issuing-at-cash-app-4463916095 |
| Whatnot | Staff Software Engineer, Discovery Platform | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-discovery-platform-at-whatnot-4474999704 |
| Stripe | Staff Software Engineer, IAM Control Plane | Staff | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-iam-control-plane-at-stripe-4481782231 |
| Cloudflare | Staff/Principal Software Engineer - Security Platform | Staff/Principal | San Francisco, CA | 2026-11-18 | $220K-$303K (CA) | https://www.linkedin.com/jobs/view/staff-principal-software-engineer-security-platform-at-cloudflare-4458045210 |
| Rippling | Staff Software Engineer - Core Experience | Staff | San Francisco, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-core-experience-at-rippling-4458526715 |
| Snap Inc. | Staff Software Engineer, Backend, Level 6 | Staff | Palo Alto, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-backend-level-6-at-snap-inc-4484228122 |
| Snap Inc. | Staff Software Engineer, Backend, Level 6 | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-backend-level-6-at-snap-inc-4484209964 |
| EliseAI | Staff Software Engineer | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-at-eliseai-4491797360 |
| Braze | Staff Software Engineer, Canvas Logic & Execution | Staff | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-canvas-logic-execution-at-braze-4493203018 |
| OKX | Staff/Sr Staff Software Engineer, Payment | Staff | San Jose, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/staff-sr-staff-software-engineer-payment-at-okx-4492552208 |
| Imply | Staff Software Engineer (Remote) | Staff | Burlingame, CA (remote) | 2026-11-16 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-remote-at-imply-4457080145 |
| Walmart | Staff, Software Engineer - WFS & Marketplace | Staff | Sunnyvale, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-wfs-marketplace-at-walmart-4457700411 |
| ServiceNow | Staff Data Platform Software Engineer - Veza | Staff | Santa Clara, CA | 2026-11-16 | — | https://www.linkedin.com/jobs/view/staff-data-platform-software-engineer-veza-at-servicenow-4490791386 |
| Sigma | Staff Software Engineer - Fullstack | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-fullstack-at-sigma-4426760032 |
| Snorkel AI | Senior / Staff Software Engineer - Platform | Senior/Staff | San Francisco, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-staff-software-engineer-%E2%80%94-platform-at-snorkel-ai-4454135614 |
| Jobot | Staff Software Engineer | Staff | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/staff-software-engineer-at-jobot-4489331207 |
| Palo Alto Networks | Principal Engineer Software (DLP) | Principal | Santa Clara, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/principal-engineer-software-dlp-at-palo-alto-networks-4363165173 |
| Palo Alto Networks | Sr Principal Engineer Software | Principal | Santa Clara, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/sr-principal-engineer-software-at-palo-alto-networks-4491342406 |
| NVIDIA | Principal Software Engineer - Employee Productivity | Principal | Santa Clara, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-employee-productivity-at-nvidia-4446883704 |
| NVIDIA | Principal Engineer, CUDA UMD - GPU Kernel Scheduling | Principal | Santa Clara, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/principal-engineer-cuda-umd-gpu-kernel-scheduling-at-nvidia-4395469533 |
| Roblox | Principal Software Engineer, WebRTC | Principal | San Mateo, CA | 2026-11-20 | $295.25K-$345.04K | https://www.linkedin.com/jobs/view/principal-software-engineer-webrtc-at-roblox-4484804145 |
| Amazon | Principal Software Engineer, Amazon DSP (Demand-Side Platform) - Advertising | Principal | Palo Alto, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-amazon-dsp-demand-side-platform-%E2%80%94-advertising-at-amazon-4456723075 |
| Oracle | Senior Principal Software Developer | Principal | Santa Clara, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-principal-software-developer-at-oracle-4429461044 |
| Collins Aerospace | Principal Software Engineer | Principal | San Jose, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-at-collins-aerospace-4491105336 |
| Collins Aerospace | Principal Software Engineer - Front-end Developer | Principal | San Jose, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-%E2%80%93-front-end-developer-at-collins-aerospace-4484419461 |
| ClickHouse | Principal Software Engineer - Postgres | Principal | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/principal-software-engineer-postgres-at-clickhouse-4491836064 |
| NVIDIA | Senior Machine Learning Engineer, Perception - Autonomous Driving | Senior | Santa Clara, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-perception-autonomous-driving-at-nvidia-4475138356 |
| NVIDIA | Deep Learning Senior Engineer, End-To-End Autonomous Driving | Senior | Santa Clara, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/deep-learning-senior-engineer-end-to-end-autonomous-driving-at-nvidia-4475124989 |
| EvenUp | Senior Machine Learning Engineer | Senior | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-evenup-4437312010 |
| Plenful | Senior Machine Learning Engineer | Senior | San Francisco Bay Area | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-plenful-4444171613 |
| FloQast | Senior Machine Learning Engineer | Senior | San Jose, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-floqast-4492232676 |
| Stripe | Staff Machine Learning Engineer, Financial Connections | Staff | San Francisco, CA | 2026-11-18 | — | https://www.linkedin.com/jobs/view/staff-machine-learning-engineer-financial-connections-at-stripe-4458578088 |
| Plaid | Senior Machine Learning Engineer - Fraud | Senior | San Francisco Bay Area | 2026-11-15 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-fraud-at-plaid-4466489132 |
| Gravity | Senior Ads ML Engineer | Senior | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-ads-ml-engineer-at-gravity-4492785116 |
| Applied Intuition | Senior Machine Learning Engineer - Generative Models | Senior | Sunnyvale, CA | 2026-11-19 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-generative-models-at-applied-intuition-4474992695 |
| hum.ai | Senior Machine Learning Engineer | Senior | San Francisco, CA | 2026-11-17 | — | https://www.linkedin.com/jobs/view/senior-machine-learning-engineer-at-hum-ai-4491759274 |
| ClickHouse | Senior Software Engineer, Infrastructure Automation | Senior | San Francisco, CA | 2026-11-20 | $150K-$230K | https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-automation-at-clickhouse-4492837939 |
| Commure | Senior Software Engineer, Infrastructure | Senior | San Francisco, CA | 2026-11-18 | $170K-$220K | https://www.linkedin.com/jobs/view/senior-software-engineer-infrastructure-at-commure-4461411311 |
| Nextdoor | Senior Software Engineer, Cloud Engineering | Senior | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-cloud-engineering-at-nextdoor-4492763017 |
| Bloom Energy | Sr Staff Software Engineer - DevOps | Staff | San Jose, CA | 2026-11-15 | — | https://www.linkedin.com/jobs/view/sr-staff-software-engineer-devops-at-bloom-energy-4389082165 |
| Heartflow | Senior Platform Engineer (Cloud Foundations) | Senior | San Francisco, CA | 2026-11-18 | $180K-$215K | https://www.linkedin.com/jobs/view/senior-platform-engineer-cloud-foundations-at-heartflow-4478829300 |
| Heartflow | Senior Platform Engineer (Compute Migration) | Senior | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-platform-engineer-compute-migration-at-heartflow-4461928969 |
| SpaceX | Sr. Software Engineer, AI Infrastructure (Starshield) | Senior | Palo Alto, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/sr-software-engineer-ai-infrastructure-starshield-at-spacex-4474577169 |
| Salesforce | Senior/Lead Software Engineer, Site Reliability (Agentforce Operations) | Senior | San Francisco, CA | 2026-11-14 | — | https://www.linkedin.com/jobs/view/senior-lead-software-engineer-site-reliability-agentforce-operations-at-salesforce-4475076088 |
| Fastly | Senior Engineer - Cloud and Container Services | Senior | San Francisco, CA | 2026-11-16 | — | https://www.linkedin.com/jobs/view/senior-engineer-cloud-and-container-services-at-fastly-4487861613 |
| Scribd | Senior Software Engineer, Core Infrastructure | Senior | San Francisco, CA | 2026-11-20 | — | https://www.linkedin.com/jobs/view/senior-software-engineer-core-infrastructure-at-scribd-inc-4492844536 |

## Method notes and caveats

- **Remote-US coverage is thin.** A LinkedIn "Staff SWE, United States, remote" query returned mostly roles with out-of-Bay office locations (Atlanta, Seattle, Denver, Boston, Austin, New York). I excluded them. Genuinely remote-flagged roles in the table: Coinbase (Remote-USA), ClickHouse Private (Remote), Imply (Remote), Anthropic Datacenter Server Lifecycle (remote-friendly).
- **Lever** returned Zoox and Palantir Bay-area rows, but the table output carried no URLs, so I did not list them: Zoox "Senior / Staff Test Automation Engineer", "Calibration, Localization and Mapping Systems", Palantir "Information Systems Security Engineer".
- **Not in the table:** non-Bay or non-US variants (Anthropic Principal Capacity/Compute in Seattle and New York, Anthropic Staff+ Deployment in London, Databricks Bengaluru, Coinbase Singapore, Robinhood London), and non-software roles surfaced by the broad "engineer" query.
- **Possible duplicates kept as separate entries:** same-title postings in different cities (MongoDB, Snap, Cash App) are distinct listings.
- **Date quirk:** the Snowflake FoundationDB listing is dated 2026-11-21 in LinkedIn's output, one day after today's date; I kept it as returned.
- **Dropped for lack of a URL:** the Greenhouse and Ashby `--format table` output has no URL column, so I only listed rows whose URL I saw in JSON output. That excluded e.g. Robinhood "Senior Client Platform Engineer" and SF Compute "Senior Product Engineer".
- **Counts** come from 27 sampled descriptions, mostly the first ~4,000-5,000 characters, so skill percentages are lower bounds and directional only. Waymo, Anthropic, Replit, Salesforce and Heartflow windows ended before the full requirements list in some cases.
- Salary figures are copied from postings or tool output. Midpoints and medians are my own arithmetic on posted ranges.
