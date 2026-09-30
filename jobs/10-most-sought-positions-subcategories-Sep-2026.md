# Sub-Category Analysis — Software Engineer, DevOps/SRE/Cloud/Platform, Product/Program Manager (Bay Area, as of 2026-09-29)

Companion to [10-most-sought-positions-Sep-2026.md](10-most-sought-positions-Sep-2026.md). It breaks the three largest categories from that report into sub-categories, ranks them by hiring volume, and rates fit against your profile.

## Method and caveats (same limits as the parent report)

- **Volume metric:** current open-posting counts for "San Francisco Bay Area" from LinkedIn and Indeed search-result page titles (snapshot, late Sep 2026). This is **not** a 9-month historical count, because the portal CLIs and public pages only expose open postings.
- **Indeed counts are the primary basis for ranking.** They are rounded but more title-specific and mutually comparable. LinkedIn counts are shown for context only: they are bucketed ("9,000+"), match loosely (a "Platform Software Engineer" search returns 9,000+ because it catches nearly any platform-adjacent SWE role), and include contract and duplicate postings. A few Indeed figures were for "San Francisco, CA" rather than the full Bay Area; these are marked (SF).
- **Sub-categories overlap.** A "Senior Python Backend Engineer" posting can appear under Backend, Python Developer and Full Stack searches. Counts cannot be summed, and the order within a tier is approximate.
- **Descriptions and requirements** are synthesized from posting snippets plus general market knowledge, as typical patterns, not quotes.
- **Fit rating** compares each sub-category to your CLAUDE.md profile: AWS/Terraform/Docker/Python, GxP-regulated systems, cross-functional leadership, agentic AI with Claude Code, and biotech domain. **Algorithm/data-structure-heavy work is your stated hard no**, so sub-categories that interview or work heavily on algorithms are down-weighted. Fit is my assessment, not a verified match against any specific posting.

---

# Part 1 — Software Engineer sub-categories

## Hiring volume vs. fit at a glance

| Rank (volume) | Sub-category | Indeed (Bay Area) | LinkedIn (Bay Area) | Volume | Fit for you |
|---|---|---|---|---|---|
| 1 | Full Stack Engineer | ~1,530 | 1,000+ | High | Medium |
| 2 | Distributed Systems / Infrastructure SWE | ~1,220 (SF) | 8,000+ (loose match) | High | Low–Medium |
| 3 | Python Developer | ~1,150 | 12,000+ (Python jobs, SF; very loose) | High | High |
| 4 | Backend Engineer | ~915 | 15,000+ (loose match) | High | Medium–High |
| 5 | Embedded / Firmware Engineer | ~600 | 693 embedded; 5,000+ firmware | Medium | Low |
| 6 | Frontend Engineer | ~505 | 7,000+ | Medium | Low |
| 7 | Bioinformatics / Biotech Software Engineer | ~350 (bioinformatics eng.), ~320 (biotech SWE, SF) | ~350–400 | Medium-low | **Very high** |
| 8 | Mobile Engineer (iOS/Android) | ~320 | ~960 (SF) | Medium-low | Low |
| 9 | SDET / QA Automation Engineer | ~250–300 | 425+ (QA automation) | Medium-low | Medium |

Not counted here: ML/AI Engineer and Data Engineer, which are ranked separately in the parent report.

**Which hire the most:** Full Stack, Distributed Systems/Infrastructure, Python and Backend engineers lead by a clear margin. Embedded, Frontend, Mobile and SDET are a second tier. Bioinformatics/biotech software is the smallest by volume in absolute terms but is the strongest fit, so it is the best value per application for you.

## Full Stack Engineer
- **Summary:** Builds both the user-facing application and the services behind it, typically at startups and scale-ups where one engineer owns a feature end to end. Employers seen in the results include Salesforce, Uber, OpenAI and Deloitte/KPMG (consulting-style roles).
- **Skills:** React or another modern JS framework with TypeScript, plus a backend in Node, Python, Java or Go; REST/GraphQL APIs; PostgreSQL/MySQL; cloud deployment (AWS), Docker, CI/CD; testing.
- **Experience:** 2–3 years for mid-level, 5+ for senior. CS degree or equivalent. Increasingly expected: shipping features using AI coding tools.
- **Fit: Medium.** Your Python/AWS/Docker foundation applies, but frontend depth is not in your profile and you'd compete against dedicated web engineers.

## Distributed Systems / Infrastructure Software Engineer
- **Summary:** Designs and scales core infrastructure services: storage, queuing, orchestration, GPU/ML clusters, observability. Employers include OpenAI, Meta, Apple, Tesla, DoorDash, Salesforce, Rubrik and Together AI.
- **Skills:** Go, Rust, C++ or Java; consensus, consistency and sharding concepts (e.g., consistent hashing, sticky routing); Kubernetes at scale; performance debugging; strong systems fundamentals.
- **Experience:** 5+ years building high-scale, high-reliability infrastructure for senior roles; staff-level expects architecture ownership across teams. Interviews are algorithm- and system-design-heavy.
- **Fit: Low–Medium.** The algorithm-heavy interview loop conflicts with your stated hard no. The platform/infrastructure-flavored postings (Kubernetes, IaC) overlap more with Part 2.

## Python Developer
- **Summary:** Writes Python services, automation and data-adjacent applications. Postings range from web backends (Django/FastAPI) to data tooling and scientific or ML-adjacent systems.
- **Skills:** Python 3, FastAPI/Django/Flask, SQL/ORMs, pytest, Docker, AWS, async programming; often pandas or NumPy for data-heavy roles.
- **Experience:** 3–5 years for mid-level, 6+ for senior; production Python services and code review.
- **Fit: High.** Python is your primary language and pairs with AWS. Best matches are data/platform or scientific Python roles rather than pure web product work.

## Backend Engineer
- **Summary:** Builds services, APIs and data models behind products: service-oriented architectures, databases, integrations. Overlaps heavily with the Python and Full Stack searches.
- **Skills:** Python, Go, Java or Kotlin; Postgres and data modeling; microservices; Docker/Kubernetes; AWS/GCP; CI/CD. Typical listing: 4+ years, $150k–$220k plus equity.
- **Experience:** 4+ years for mid-level, 7+ for senior.
- **Fit: Medium–High.** Choose roles built around cloud services, data pipelines or internal platforms; avoid ones that emphasize high-scale algorithmic problems.

## Embedded / Firmware Engineer
- **Summary:** Writes low-level code for devices and SoCs (C/C++ firmware, embedded Linux, drivers). Concentrated in the South Bay (Apple, Google/Fitbit, Reality Labs and Tesla postings in Sunnyvale, Mountain View and Palo Alto).
- **Skills:** C/C++, RTOS or embedded Linux, microcontrollers, hardware bring-up, debugging with scopes and JTAG, communication protocols (I2C/SPI/UART, BLE).
- **Experience:** 3–5+ years; BS/MS in EE/CE/CS. Reality Labs listed $147k–$208k for one role.
- **Fit: Low.** Your EE/CE degree from Caltech is relevant, but your recent career is cloud and software; this would be a change of specialty.

## Frontend Engineer
- **Summary:** Builds web UIs, design systems and client-side performance. Roughly 1,000+ postings are senior-level.
- **Skills:** React, TypeScript, modern CSS, state management, testing (Jest/Playwright), accessibility, performance. Listed compensation ~$143k–$179k.
- **Experience:** 3+ years for mid-level; portfolio of shipped UI work.
- **Fit: Low.** Not a core strength or interest in your profile.

## Bioinformatics / Biotech Software Engineer
- **Summary:** Builds the pipelines, platforms and tools that process and manage scientific data: NGS and single-cell workflows, LIMS/ELN integrations, cloud data platforms, validated (GxP) applications. Employers: Genentech, Gilead, Thermo Fisher, UCSF, Lawrence Berkeley National Lab, Twist Bioscience, Freenome, Amgen.
- **Skills:** Python and R; workflow managers (Nextflow, Snakemake, Cromwell/WDL); AWS/cloud pipelines; SQL and data modeling; genomics methods; increasingly LLM/agent tooling for science. Some postings ask for MS/PhD in bioinformatics/CS or a bachelor's plus 5 years.
- **Experience:** 3–5+ years for mid-level; a PhD is often preferred but experience substitutes.
- **Fit: Very high.** This is your background (7,000+ sample cloud genomics pipeline, GxP Bioinformatics Cloud, Ph.D. in computational science) and matches your biotech target sector and Bay Area location. Volume is smaller but competition for the senior end is thinner.

## Mobile Engineer (iOS / Android)
- **Summary:** Native app development (Swift, Kotlin), typically 5–6+ years for senior roles at OpenAI, Discord and health-tech startups.
- **Skills:** Swift/SwiftUI or Kotlin/Jetpack Compose, app architecture, release management, performance.
- **Experience:** 5–6+ years shipping consumer apps at scale.
- **Fit: Low.**

## SDET / QA Automation Engineer
- **Summary:** Builds test frameworks and automation for web, cloud and mobile applications; also present in medical-device firms (e.g., Abbott).
- **Skills:** Python (or Java) test automation, Selenium/Playwright, API testing, CI integration, test strategy. 5+ years for senior.
- **Experience:** 3–5+ years.
- **Fit: Medium.** Adjacent through your GxP validation background (computer-system validation), particularly at regulated employers, but it is a different day-to-day than engineering leadership.

---

# Part 2 — DevOps / SRE / Cloud / Platform Engineer sub-categories

## Hiring volume vs. fit at a glance

| Rank (volume) | Sub-category | Indeed (Bay Area) | LinkedIn (Bay Area) | Volume | Fit for you |
|---|---|---|---|---|---|
| 1 | Platform / Platform Engineering | ~1,000 ("Platform Engineer"); 9,500 for the broader "platform engineering" query | 9,000+ (platform SWE, loose) | High | **High** |
| 2 | DevOps Engineer | ~1,250 | 1,000+ (SF) / 798 senior | High | **High** |
| 3 | Infrastructure Engineer | ~960 | 2,000+ | High | High |
| 4 | Cloud Engineer | ~820 | 8,000+ (loose) | High | **High** |
| 5 | MLOps / ML Platform | ~830 | limited (1,000+ nationwide) | Medium-high | High |
| 6 | Site Reliability Engineer (SRE) | ~600 (SF) | 6,000+ | Medium-high | Medium–High |
| 7 | Solutions / Cloud Architect | ~830 (solution), ~400 (cloud, SF) | 320 (cloud architect, SF) | Medium | Medium–High |
| 8 | DevSecOps / Cloud Security | ~580 | 142 | Medium-low | Medium–High |
| 9 | Kubernetes / Container Engineer | ~445 | ~300 (senior, SF) | Medium-low | Medium |

**Which hire the most:** Platform, DevOps, Infrastructure and Cloud Engineer lead, with SRE and MLOps close behind. These titles blur together (a "Platform Engineer" posting often reads like DevOps or SRE), so treat the top four as one large pool and pick by the posting's actual duties.

## Platform Engineer
- **Summary:** Builds internal developer platforms: golden paths, self-service infrastructure, CI/CD, developer tooling and paved-road frameworks that product teams use. AI and data platform variants are growing.
- **Skills:** Terraform/IaC, Kubernetes, AWS/GCP, CI/CD (GitHub Actions, ArgoCD), Python or Go, developer-experience mindset, API and tooling design.
- **Experience:** 4–6+ years for mid/senior; experience partnering with product engineering teams.
- **Fit: High.** Direct match: you led a GxP-qualified Bioinformatics Cloud (0-to-1 platform), with Terraform, Docker, AWS Batch/ECR and cross-functional stakeholder work.

## DevOps Engineer
- **Summary:** Automates build, test, deploy and infrastructure provisioning and keeps environments reliable; sometimes at the intersection with security (DevSecOps). Employers seen: Salesforce, Zoom, Okta, Roblox and many mid-size firms; ~114 postings are remote-eligible on LinkedIn.
- **Skills:** AWS/Azure/GCP, Terraform/Ansible, Docker/Kubernetes, CI/CD, Linux, monitoring, Python/Bash scripting.
- **Experience:** 3–5+ years for mid-level, 5+ for senior (798 senior-level LinkedIn postings).
- **Fit: High.**

## Infrastructure Engineer
- **Summary:** Owns cloud/on-prem compute, networking, storage and cluster operations; at AI companies this includes GPU clusters (OpenAI, Anthropic, Apple, Discord in results).
- **Skills:** Kubernetes, Go or Python, Terraform, Linux internals, cloud networking, observability, reliability engineering; strong Go/Kubernetes for many roles.
- **Experience:** 4–7+ years running production infrastructure.
- **Fit: High** for cloud-oriented roles; **lower** for GPU-cluster or bare-metal roles that are deeply systems-oriented.

## Cloud Engineer
- **Summary:** Designs, migrates, secures and optimizes workloads on AWS/Azure/GCP; a common title at enterprises and consultancies.
- **Skills:** AWS services (Batch, RDS, S3, IAM, ECR, Redshift), Terraform/CloudFormation, networking and IAM, cost optimization, scripting; cloud certifications valued.
- **Experience:** 3–6 years; enterprise migration experience is a plus.
- **Fit: High.** AWS architecture is your primary skill; the enterprise/regulated version of this role is a good match.

## MLOps / ML Platform Engineer
- **Summary:** Builds the infrastructure for deploying and monitoring models and LLM applications: model serving, pipelines, feature stores, GPU scheduling, evaluation. Examples: JPMorgan (Palo Alto), Molex (Fremont), robotics startups.
- **Skills:** Python, Kubernetes, Ray/Dagster/Airflow, PyTorch familiarity, CI/CD for ML, AWS/GCP/Azure, model monitoring.
- **Experience:** 4–6+ years combining infrastructure and ML systems.
- **Fit: High.** Combines your AWS/Terraform/Docker strengths with your agentic AI and RAG training. Prefer platform-focused roles over ones requiring model research.

## Site Reliability Engineer (SRE)
- **Summary:** Ensures availability and performance through SLOs, incident response, capacity planning and automation; typically on-call. LinkedIn shows 6,000+ postings (864 new).
- **Skills:** Linux, Kubernetes, observability (Prometheus/Grafana/Datadog), Python or Go, incident management, IaC, Terraform. 5+ years typical.
- **Experience:** 5+ years operating production systems.
- **Fit: Medium–High.** Skills overlap, but the on-call and incident focus and the high-scale software-reliability emphasis at big tech are less aligned with your regulated-systems track record.

## Solutions / Cloud Architect
- **Summary:** Designs cloud solutions for customers or internal teams (pre-sales, delivery or enterprise architecture); employers include AWS, Microsoft, Salesforce and consultancies (Deloitte, Accenture).
- **Skills:** Multi-cloud architecture, IaC, security and compliance, stakeholder communication, technical presentations; 5+ years as an architect, data architect, DBA or data engineer is typical.
- **Experience:** 5–10 years; certifications (AWS Solutions Architect, etc.) are common requirements.
- **Fit: Medium–High.** Your SEI Software Architecture Professional certification, cross-functional leadership and AWS background fit well; check whether the role is customer-facing sales support.

## DevSecOps / Cloud Security Engineer
- **Summary:** Embeds security into CI/CD and cloud environments: scanning (SAST/DAST), IAM, key management, zero trust, vulnerability management.
- **Skills:** IAM, VPC, IaC scanning, CI/CD pipeline security, compliance frameworks, cloud security tools.
- **Experience:** 4–7 years across DevOps and security.
- **Fit: Medium–High.** GxP/validation compliance experience transfers, but security tooling depth would need to be shown.

## Kubernetes / Container Engineer
- **Summary:** Runs and extends Kubernetes clusters, Helm/GitOps deployments, service mesh and cluster tooling.
- **Skills:** Kubernetes, Helm, etcd, Argo, Terraform/Ansible, Go.
- **Experience:** 4–6 years; hands-on production Kubernetes with AWS.
- **Fit: Medium.** You have Docker and AWS Batch experience, but Kubernetes-specific depth is not listed in your profile; a gap to close.

---

# Part 3 — Product / Technical Program Manager sub-categories

## Hiring volume vs. fit at a glance

| Rank (volume) | Sub-category | Indeed (Bay Area) | LinkedIn (Bay Area) | Volume | Fit for you |
|---|---|---|---|---|---|
| 1 | Product Manager (general/senior) | ~1,530 | 7,000+ | High | Medium |
| 2 | Program Manager | ~1,480 | 3,000+ (SF) | High | Medium–High |
| 3 | Project Manager (general) | ~1,470 | 4,000+ (SF); 21,000+ for "project management" | High | Medium |
| 4 | AI Product Manager | ~1,020 | 1,000+ (AI/ML PM, California) | Medium-high | Medium–High |
| 5 | Technical Product Manager | ~1,060 | 1,000+ | Medium-high | Medium–High |
| 6 | IT Project Manager | ~950 | (in project-management pool) | Medium-high | Medium |
| 7 | Technical Program Manager (TPM) | ~870 (425 senior) | 355 (SF); 9,000+ (loose) | Medium-high | **High** |
| 8 | Technical Project Manager | ~630 | (in pool) | Medium | Medium–High |
| 9 | Biotech / Clinical Project or Program Manager | ~400–700 | 156–219 | Medium | **High** |
| 10 | Associate Product Manager (APM) | (low) | 3,000+ | n/a (entry level) | Not applicable |

The "20,000 data product" Indeed figure is a keyword-match artifact and is excluded.

**Which hire the most:** Product Manager, Program Manager and Project Manager are similar in size at ~1,500 each on Indeed. Within tech-flavored roles, AI PM, Technical PM and TPM run ~900–1,100. Biotech project/program management is a smaller but relevant niche.

## Product Manager (general / senior)
- **Summary:** Owns product strategy, roadmap and outcomes for a product area; the core PM track at SaaS, consumer and AI companies. Senior PM total-target cash cited in the results: ~$255k–$384k (Bay Area).
- **Skills:** Customer discovery, prioritization frameworks, metrics/experimentation, roadmapping, writing specs, executive communication, working with engineering and design.
- **Experience:** 5+ years of product management in high-growth tech/SaaS is the common bar for senior roles.
- **Fit: Medium.** You have product-adjacent experience (Business Process Manager for Basecamp 2.0; founding HubSeq) but no formal PM title, so you'd compete against PMs with track records.

## Program Manager
- **Summary:** Coordinates multi-team initiatives, scope, schedule, risk and governance; the label is used both in tech and in biotech operations (e.g., program managers in South San Francisco coordinating science/engineering/lab work).
- **Skills:** Program governance, roadmap and dependency management, stakeholder communication, budgeting, JIRA or equivalent, change management.
- **Experience:** 5–8+ years; PMP or similar sometimes preferred.
- **Fit: Medium–High.** Matches your program leadership (Project Lead for the Bioinformatics Cloud; Global Implementation Lead for FCS Express).

## Project Manager (general)
- **Summary:** Delivers defined projects on time and budget; the title spans construction, creative, non-profit and IT (many of the ~1,470 postings are outside tech).
- **Skills:** Scheduling, scope management, vendor coordination, Agile/Waterfall, PMP.
- **Experience:** 3–7+ years.
- **Fit: Medium.** Filter hard to tech or life-sciences employers.

## AI Product Manager
- **Summary:** Defines and ships AI-powered products and platforms (LLM features, AI platforms, data products, analytics); employers include OpenAI, Anthropic, Together AI, Meta and Amplitude.
- **Skills:** LLM and ML fundamentals, evaluation and quality metrics, responsible-AI concerns, data-driven prioritization, working with research and engineering teams. Related Indeed searches show ~1,000 "AI Product Manager" postings.
- **Experience:** 5+ years of PM experience, ideally with AI/ML products.
- **Fit: Medium–High.** Your Claude Code, agentic AI, AI-training and AI-champion experience is relevant, but it is more engineering-side than product-side.

## Technical Product Manager
- **Summary:** PM for developer- and infrastructure-facing products (APIs, platforms, data systems) where engineering depth is expected.
- **Skills:** API/platform product sense, cloud architecture knowledge, stakeholder management with engineering, roadmap and requirements writing.
- **Experience:** 4–7+ years; often an engineering background.
- **Fit: Medium–High.** Your engineering-plus-stakeholder profile suits platform/data/cloud product areas.

## IT Project Manager
- **Summary:** Runs internal IT and systems implementations (ERP, migrations, validation, vendor rollouts) in enterprises and life-sciences companies.
- **Skills:** PMP, Agile/Waterfall, vendor management, change management, computer-system validation for regulated sectors.
- **Experience:** 5+ years.
- **Fit: Medium.** Your FCS Express validation and deployment matches the regulated-IT variant; the general IT variant is less interesting.

## Technical Program Manager (TPM)
- **Summary:** Drives complex technical programs across engineering teams (infrastructure, AI, hardware/software integration). Employers seen: Google (Sunnyvale, Mountain View, SF), Anthropic, OpenAI, Meta, Amazon, Tesla, Waymo, Apple, Plaid.
- **Skills:** Program planning across engineering orgs, technical fluency (cloud, AI infrastructure, ML pipelines), risk and dependency management, executive reporting, ability to unblock engineers.
- **Experience:** 5–10+ years, often with an engineering background; cross-functional leadership at scale.
- **Fit: High.** Technical depth plus cross-functional leadership across engineering, science and business is your stated strength; several employers are near Sunnyvale/Cupertino/Mountain View.

## Technical Project Manager
- **Summary:** Similar to TPM but scoped to projects, often at smaller companies, consultancies and IT organizations.
- **Skills:** Project planning, technical fluency, Agile delivery, client and stakeholder communication.
- **Experience:** 4–8 years.
- **Fit: Medium–High.**

## Biotech / Clinical Project or Program Manager
- **Summary:** Coordinates drug-development programs, clinical operations, CMC/manufacturing or research programs (e.g., Senior Project Manager for Clinical Operations at Maze Therapeutics; Senior Clinical Trials Manager at Zai Lab; program roles at Ohalo, all in South San Francisco).
- **Skills:** Clinical or R&D program planning, GxP awareness, cross-functional team leadership (clinical, regulatory, CMC, quality), vendor/CRO management, budget and timeline tracking.
- **Experience:** 5–10+ years, often with a life-science degree; biotech domain knowledge is essential.
- **Fit: High.** Your Ph.D., drug-development lifecycle knowledge and GxP program leadership at Genentech/Roche are strong differentiators; the tradeoff is that it drifts from software toward operations, so target roles with a systems or digital emphasis.

## Associate Product Manager (APM)
- **Summary:** Entry-level rotational PM programs. Included only for completeness (3,000+ LinkedIn postings). **Not applicable** at your seniority.

---

# Where to focus (takeaways)

**Highest hiring volume:**
1. SWE: Full Stack, Distributed Systems, Python, Backend
2. DevOps: Platform, DevOps, Infrastructure, Cloud
3. PM: Product, Program and Project Manager

**Best fit for you (fit first, then volume):**

| Priority | Sub-category | Why |
|---|---|---|
| 1 | Bioinformatics / Biotech Software Engineer | Direct domain and skills match; smaller pool but less competition at senior level |
| 2 | Platform Engineer (cloud/data/AI platform flavor) | Largest DevOps-family pool and a direct match to your Bioinformatics Cloud build |
| 3 | Cloud Engineer / DevOps Engineer (regulated or enterprise) | AWS + Terraform + Docker; large pools |
| 4 | MLOps / ML Platform Engineer | Combines infra skills with your agentic-AI training |
| 5 | Technical Program Manager | Cross-functional leadership, technical depth; several South Bay employers |
| 6 | Biotech / Clinical Program Manager | Strong biotech credentials; drifts toward non-software work |
| 7 | Python Developer (data/scientific/platform flavor) | Primary language; pick roles by domain |

**Lower priority:** Frontend, Mobile, Embedded/Firmware, and Distributed Systems SWE roles. They are large or specialized pools, but they are either outside your skills or heavy on algorithms (your hard no).

**Search-term suggestions for `/scrape`:** "bioinformatics software engineer," "platform engineer AWS Terraform," "MLOps engineer," "technical program manager cloud OR AI," "computational biology platform," "GxP cloud engineer."

## Sources

- [LinkedIn: Full Stack Engineer, Bay Area](https://www.linkedin.com/jobs/full-stack-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Frontend Engineer, Bay Area](https://www.linkedin.com/jobs/frontend-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Backend Software Engineer, Bay Area](https://www.linkedin.com/jobs/backend-software-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Software Engineer, Distributed Systems, Bay Area](https://www.linkedin.com/jobs/software-engineer-distributed-systems-jobs-san-francisco-bay-area)
- [LinkedIn: Embedded Software Engineer, Bay Area](https://www.linkedin.com/jobs/embedded-software-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Firmware Engineer, Bay Area](https://www.linkedin.com/jobs/firmware-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: QA Automation Engineer, Bay Area](https://www.linkedin.com/jobs/qa-automation-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Platform Software Engineer, Bay Area](https://www.linkedin.com/jobs/platform-software-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: DevOps Engineer, San Francisco](https://www.linkedin.com/jobs/devops-jobs-san-francisco-ca)
- [LinkedIn: Senior DevOps Engineer, Bay Area](https://www.linkedin.com/jobs/senior-devops-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: Infrastructure Engineer, Bay Area](https://www.linkedin.com/jobs/infrastructure-engineer-jobs-san-francisco-bay-area)
- [LinkedIn: DevSecOps, Bay Area](https://www.linkedin.com/jobs/devsecops-jobs-san-francisco-bay-area)
- [LinkedIn: Cloud Architect, San Francisco](https://www.linkedin.com/jobs/cloud-architect-jobs-san-francisco-ca)
- [LinkedIn: Technical Program Manager, San Francisco](https://www.linkedin.com/jobs/technical-program-manager-jobs-san-francisco-ca)
- [LinkedIn: Project Manager Biotech, Bay Area](https://www.linkedin.com/jobs/project-manager-biotech-jobs-san-francisco-bay-area)
- [Indeed: Full Stack Engineer](https://www.indeed.com/q-full-stack-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Python Developer](https://www.indeed.com/q-python-developer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Backend Engineer](https://www.indeed.com/q-backend-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Front End Developer](https://www.indeed.com/q-front-end-developer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Distributed Systems Engineer](https://www.indeed.com/q-distributed-systems-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Mobile Engineer](https://www.indeed.com/q-mobile-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: SDET](https://www.indeed.com/q-sdet-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Bioinformatics Engineer](https://www.indeed.com/q-bioinformatics-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Platform Engineer](https://www.indeed.com/q-platform-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Infrastructure Engineer](https://www.indeed.com/q-infrastructure-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Cloud Engineer](https://www.indeed.com/q-cloud-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: MLOps](https://www.indeed.com/q-mlops-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Kubernetes Engineer](https://www.indeed.com/q-Kubernetes-Engineer-l-San-Francisco-Bay-Area,-CA-jobs.html)
- [Indeed: DevSecOps Engineer](https://www.indeed.com/q-devsecops-engineer-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Solution Architect](https://www.indeed.com/q-solution-architect-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Project Manager](https://www.indeed.com/q-project-manager-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: AI Product Manager](https://www.indeed.com/q-ai-product-manager-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Technical Program Manager](https://www.indeed.com/q-technical-program-manager-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: IT Project Manager](https://www.indeed.com/q-it-project-manager-l-san-francisco-bay-area,-ca-jobs.html)
- [Indeed: Biotech Senior Project Manager](https://www.indeed.com/q-Biotech-Senior-Project-Manager-l-San-Francisco-Bay-Area,-CA-jobs.html)
