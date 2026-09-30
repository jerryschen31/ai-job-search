import { describe, test, expect } from "bun:test";
import {
  parseCompensationMarkdown, parseMoney, companyUrl, roleUrl, slugify,
  ATTRIBUTION, DATA_LICENSE_URL,
} from "../src/helpers";
import { urlFor, renderTable } from "../src/commands/report";
import { prettifyCompany } from "../src/commands/export";

// Trimmed but structurally faithful copy of a real Levels.fyi .md document.
const DOC = `# Levels.fyi – Roche Software Engineer Salaries

**URL:** https://www.levels.fyi/companies/roche/salaries/software-engineer  
**Generated:** 2026-08-01T17:55:08.482Z  
**Scope:** Software Engineer roles at Roche in United States  
**Location:** United States  
**Currency:** USD ($)

---
## Summary
Software Engineer compensation at Roche ranges from $138.1K to $308K.

---
## Aggregate Highlights
- Median Total Compensation: $203,000  
- Last Updated: August 1, 2026

---
## Key Breakdowns

### Levels Breakdown
| Level | Median Total Compensation |
| --- | --- |
| Software Engineer I | $138,135 |
| Senior Software Engineer | $203,864 |
| Principal Software Engineer | $308,000 |

---
## Attribution
Use of this data requires attribution to **Levels.fyi**.
`;

describe("parseCompensationMarkdown", () => {
  const r = parseCompensationMarkdown(DOC);

  test("extracts the header fields", () => {
    expect(r.sourceUrl).toBe("https://www.levels.fyi/companies/roche/salaries/software-engineer");
    expect(r.scope).toBe("Software Engineer roles at Roche in United States");
    expect(r.location).toBe("United States");
    expect(r.currency).toBe("USD ($)");
    expect(r.title).toBe("Roche Software Engineer Salaries");
  });

  test("extracts the median and last-updated", () => {
    expect(r.medianTotalCompensation).toBe(203000);
    expect(r.lastUpdated).toBe("August 1, 2026");
  });

  test("parses the levels breakdown table, skipping header and separator rows", () => {
    expect(r.levels).toHaveLength(3);
    expect(r.levels[0]).toMatchObject({ level: "Software Engineer I", medianTotalCompensation: 138135 });
    expect(r.levels[1].medianTotalCompensation).toBe(203864);
    expect(r.levels.some((l) => /^-+$/.test(l.level))).toBe(false);
    expect(r.levels.some((l) => l.level.toLowerCase() === "level")).toBe(false);
  });

  test("always carries attribution and licence (required by Levels.fyi terms)", () => {
    expect(r.attribution).toBe(ATTRIBUTION);
    expect(r.dataLicense).toBe(DATA_LICENSE_URL);
    expect(ATTRIBUTION).toMatch(/Levels\.fyi/);
  });

  test("a document with no levels table still parses", () => {
    const min = `# Levels.fyi – X\n\n**URL:** https://x  \n\n## Aggregate Highlights\n- Median Total Compensation: $277,250  \n`;
    const p = parseCompensationMarkdown(min);
    expect(p.medianTotalCompensation).toBe(277250);
    expect(p.levels).toHaveLength(0);
  });
});

describe("parseMoney", () => {
  test("handles plain, comma, K and M forms", () => {
    expect(parseMoney("$203,864")).toBe(203864);
    expect(parseMoney("$138.1K")).toBe(138100);
    expect(parseMoney("$1.5M")).toBe(1500000);
    expect(parseMoney("203000")).toBe(203000);
  });
  test("null on junk", () => {
    expect(parseMoney(null)).toBeNull();
    expect(parseMoney("n/a")).toBeNull();
    expect(parseMoney("")).toBeNull();
  });
});

describe("url builders", () => {
  test("companyUrl with and without a role", () => {
    expect(companyUrl("roche")).toBe("https://www.levels.fyi/companies/roche/salaries.md");
    expect(companyUrl("Roche", "Software Engineer")).toBe(
      "https://www.levels.fyi/companies/roche/salaries/software-engineer.md",
    );
  });
  test("roleUrl with and without a location", () => {
    expect(roleUrl("software-engineer")).toBe("https://www.levels.fyi/t/software-engineer.md");
    expect(roleUrl("software-engineer", "San Francisco Bay Area")).toBe(
      "https://www.levels.fyi/t/software-engineer/locations/san-francisco-bay-area.md",
    );
  });
  test("urlFor dispatches on kind", () => {
    expect(urlFor({ kind: "company", target: "roche", role: "software-engineer", format: "json" }))
      .toContain("/companies/roche/salaries/software-engineer.md");
    expect(urlFor({ kind: "role", target: "software-engineer", format: "json" }))
      .toContain("/t/software-engineer.md");
  });
});

describe("slugify / prettifyCompany", () => {
  test("slugify normalizes free text", () => {
    expect(slugify("San Francisco Bay Area")).toBe("san-francisco-bay-area");
    expect(slugify("  Bristol-Myers  Squibb ")).toBe("bristol-myers-squibb");
  });
  test("prettifyCompany turns a slug back into a matchable name", () => {
    expect(prettifyCompany("roche")).toBe("Roche");
    expect(prettifyCompany("bristol-myers-squibb")).toBe("Bristol Myers Squibb");
  });
});

describe("renderTable", () => {
  test("includes the median, levels and the attribution line", () => {
    const out = renderTable(parseCompensationMarkdown(DOC));
    expect(out).toContain("$203,000");
    expect(out).toContain("Senior Software Engineer");
    expect(out).toContain("Data source: Levels.fyi");
  });
});
