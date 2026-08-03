# Near-Miss Findings — Platform Engineer / Systems Engineer Search

Follow-up to `20260801-platform-systems-engineer-jobs.md`. Two parts: (1) the near-misses and
title-mismatch exclusions already flagged in that run, and (2) a new targeted pass at nine named
tech companies (Google, Netflix, Nvidia, Coinbase, Robinhood, eBay, Apple, Microsoft, Box) using
a relaxed **$185k+ base salary** floor instead of the original $200k bar, still requiring Bay
Area or remote.

---

## Part 1 — Carried over from the original run

### Salary just under $200k

| Title | Company | Location | Salary |
|---|---|---|---|
| Systems Development Engineer | Google | Sunnyvale, CA | $193,200–$198,000 |
| Senior Software Systems Engineer, Behavior Validation | General Motors | Sunnyvale/Mountain View, Hybrid | $125K–$192K |
| Engineer 3, Business Systems (CPQ) | MongoDB | USA, Remote/Hybrid | $101K–$198K |

### Title-mismatch exclusions (role is "Software/ML/Security Engineer" with "Platform"/"Systems" as a team name, not the job discipline)

Capital One (Sr. Lead AI Engineer, Gen AI Platform Services), ServiceNow (Staff Data Platform
Software Engineer; Staff ML Engineer, Agentic App Platform; ML Engineer, GAI Search Platform;
Senior ML Engineer, Agentic Systems), Samsara (Staff Software Engineer – Platform), Expedia
(Principal Software Development Engineer – Cloud Platform), Block (Senior Security Engineer,
Platform Security), CrowdStrike (Sr. Engineer – Risk Platform ×2), **Replit** (7 postings, all
"Software/Product Engineer" on a platform team, Foster City CA, $130K–$365K), **Coinbase /
Robinhood** (17 "Software Engineer, X Platform" postings via Greenhouse, mostly Remote-USA),
Hightouch (Software Engineer, Streaming Systems), JPMorgan (2× "AI Platform Engineer" — salary
not disclosed in scraped data).

---

## Part 2 — New: $185k+ floor at named companies (Bay Area or remote)

Searched LinkedIn directly per company (`"<Company> platform engineer"` / `"<Company> systems
engineer"`, plus location-anchored searches at each HQ) since these employers barely appear on
BuiltIn/Greenhouse/Ashby's curated lists. Salary pulled from each posting's disclosed range (CA/
WA/NY/CO transparency laws).

### 2a. Genuine near-misses — top of range still under $200k

| Title | Company | Location | Salary | Note |
|---|---|---|---|---|
| Systems Development Engineer | Google | Sunnyvale, CA | $193,200–$198,000 | Same posting as Part 1 |
| Systems Development Engineer, Engineering Labs | Google | Sunnyvale, CA | $132,000–$190,000 | Lab systems admin, Platforms Infra org |
| Senior Platform Engineer | eBay | **Austin, TX** | $118,800–$188,000 | Exact title match, but **location fails** — not Bay Area, no remote option stated |

### 2b. Clears $200k at senior end — missed by the original run (title-strictness or portal coverage gap), now in-scope under the relaxed $185k+ floor

| Title | Company | Location | Salary | Why it was missed originally |
|---|---|---|---|---|
| **GitHub Enterprise Platform Engineer** | eBay | **San Jose, CA** | $196,800–$262,700 | eBay has no curated ATS-skill coverage (not on Greenhouse/Ashby/Lever lists) and didn't surface in the original generic LinkedIn query — exact title match, Bay Area. **Should have been in the main report; recommend treating as a live top candidate.** |
| Senior Software Engineer, Agents Platform | Box | Redwood City, CA | $198,500–$248,000 | Title mismatch (Software Engineer core) — but this is an agentic-AI platform team built on LangGraph, very high overlap with your Claude Code/agentic AI background |
| Senior Software Engineer, Backend – Platform (Core AI Automation) | Coinbase | San Francisco, CA | $186,065–$218,900 | Title mismatch — agentic AI automation for support/compliance, high overlap |
| Senior Software Engineer, Streaming Platform | Robinhood | Bellevue, WA (Zone 1 band incl. Menlo Park, CA) | $196,000–$230,000 | Title mismatch |
| Senior Software Engineer, Security Platform | Robinhood | Bellevue, WA (Zone 1 band incl. Menlo Park, CA) | $196,000–$230,000 | Title mismatch |
| Systems Architect | Nvidia | Santa Clara, CA | $136,000–$258,750 (L3–L4 combined) | Nvidia wasn't queried in the original run |
| Systems Validation Engineer | Nvidia | Santa Clara, CA | $108,000–$212,750 (L2–L3 combined) | Nvidia wasn't queried in the original run |
| Software Engineer L5, Python Platform | Netflix | US, Remote | $388,000–$619,000 | Title mismatch — exceptionally high pay |
| Software Engineer 5 – Training Platform, AI Platform | Netflix | US, Remote | $466,000–$750,000 | Title mismatch — ML training infra, agentic/AI-adjacent |
| Software Engineer 5 – Agent Platform, AI Platform | Netflix | US, Remote | $466,000–$750,000 | Title mismatch — **builds Netflix's internal agent SDK/MCP gateway; explicitly references Claude, GPT, Gemini** — extremely high overlap |
| Software Engineer 4/5 – Data and Feature Infrastructure, AI Platform | Netflix | US, Remote | $466,000–$750,000 | Title mismatch |
| Software Engineer 4, N-Tech Systems Engineering | Netflix | US, Remote | $250,000–$413,000 | "Systems Engineering" is the org name, not the job title |
| Software Engineer, Salesforce Platform (EAA) | Coinbase | San Francisco, CA | $135,320–$159,200 | Below $185k floor — listed for completeness, does not qualify |
| Staff Software Engineer – AI Platform Team | Coinbase | US, Remote | Not disclosed | No range shown in posting text; AI/agent infra team, worth a manual look |

### 2c. Apple — real matching postings found, salary not extractable

Apple's `jobs.apple.com` renders job detail client-side via JavaScript, so neither the CLI
portals nor WebFetch could pull the disclosed pay range (Apple does post CA ranges by law — this
is a tooling limitation, not an absence of data). Confirmed live postings with matching titles,
via web search:

- [Systems Software Engineer, Platform Architecture](https://jobs.apple.com/en-us/details/200661460-1242/systems-software-engineer-platform-architecture) — Cupertino, CA
- [Systems Engineer](https://jobs.apple.com/en-us/details/200636915-0836/systems-engineer) — Cupertino, CA
- "Prototyping Systems Engineer – Platform Architecture" appeared in search results but the
  posting has since been taken down (`jobs.apple.com` returned "this role does not exist or is
  no longer available" on fetch — already closed).

**Recommend checking these two directly on jobs.apple.com for the pay range** before pursuing.

### 2d. Microsoft — no qualifying postings found

Neither a direct LinkedIn company search nor a Redmond-anchored location search nor a targeted
web search of `careers.microsoft.com` turned up a live Platform Engineer or Systems Engineer
posting (or a close title variant) meeting the location criteria in this run. Not a tooling gap
like Apple — searches returned real Microsoft postings, just none with a matching title. Worth
retrying with different title keywords (e.g., "Site Reliability Engineer," "Cloud Engineer") if
you want Microsoft covered.

---

## Bottom line — top 3 to look at first

1. **eBay — GitHub Enterprise Platform Engineer, San Jose, CA, $196,800–$262,700.** Exact title
   match, Bay Area, clears $200k at the top of range. Should have been in the original report —
   eBay just isn't covered by any of the installed portal skills' curated company lists.
2. **Netflix — Software Engineer 5, Agent Platform (AI Platform), $466,000–$750,000, fully
   remote.** Title says "Software Engineer" but the work — building Netflix's internal Agent SDK
   and MCP gateway across Claude/GPT/Gemini — is a closer match to your AI Champion / agentic AI
   engineering work than almost anything in the main report.
3. **Box — Senior Software Engineer, Agents Platform, Redwood City, CA, $198,500–$248,000.**
   Local, LangGraph-based enterprise agent platform, clears $200k at the top of range.
