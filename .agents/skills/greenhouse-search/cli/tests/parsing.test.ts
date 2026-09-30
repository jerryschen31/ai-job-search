import { describe, test, expect } from "bun:test";
import {
  normalizeJob,
  contentToText,
  matchesQuery,
  ageInDays,
  decodeHtmlEntities,
  type GreenhouseJob,
} from "../src/helpers";
import { resolveCompanies, COMPANIES } from "../src/companies";
import { resolveTarget } from "../src/commands/detail";

describe("normalizeJob", () => {
  const raw: GreenhouseJob = {
    id: 123456,
    title: "Senior Bioinformatics Scientist",
    absolute_url: "https://job-boards.greenhouse.io/natera/jobs/123456",
    first_published: "2026-07-31T10:00:00-04:00",
    updated_at: "2026-07-31T12:00:00-04:00",
    company_name: "Natera",
    location: { name: "San Carlos, CA" },
    departments: [{ name: "Bioinformatics" }],
  };

  test("maps the Greenhouse shape onto the portal-skill result contract", () => {
    const j = normalizeJob(raw, "natera", "Natera");
    expect(j.id).toBe("123456");
    expect(j.title).toBe("Senior Bioinformatics Scientist");
    expect(j.company).toBe("Natera");
    expect(j.companyToken).toBe("natera");
    expect(j.location).toBe("San Carlos, CA");
    expect(j.department).toBe("Bioinformatics");
    expect(j.url).toBe("https://job-boards.greenhouse.io/natera/jobs/123456");
  });

  test("prefers first_published over updated_at for the date", () => {
    expect(normalizeJob(raw, "natera", "Natera").date).toBe("2026-07-31T10:00:00-04:00");
  });

  test("missing values become null rather than being omitted", () => {
    const sparse: GreenhouseJob = { id: 1, title: "X", absolute_url: "u", location: null };
    const j = normalizeJob(sparse, "tok", "Fallback Co");
    expect(j.location).toBeNull();
    expect(j.department).toBeNull();
    expect(j.date).toBeNull();
    expect(j.company).toBe("Fallback Co");
  });
});

describe("contentToText", () => {
  test("decodes the HTML-escaped content string and strips tags", () => {
    const content = "&lt;p&gt;Build &amp;amp; ship&lt;/p&gt;&lt;ul&gt;&lt;li&gt;Python&lt;/li&gt;&lt;/ul&gt;";
    const text = contentToText(content);
    expect(text).toContain("Build & ship");
    expect(text).toContain("Python");
    expect(text).not.toContain("<p>");
  });

  test("preserves line breaks between blocks", () => {
    const content = "&lt;p&gt;One&lt;/p&gt;&lt;p&gt;Two&lt;/p&gt;";
    expect(contentToText(content).split("\n").filter(Boolean)).toEqual(["One", "Two"]);
  });
});

describe("matchesQuery", () => {
  test("requires every term, in any order, case-insensitively", () => {
    expect(matchesQuery("Senior Scientist, Bioinformatics", "senior bioinformatics")).toBe(true);
    expect(matchesQuery("Senior Scientist, Bioinformatics", "bioinformatics senior")).toBe(true);
    expect(matchesQuery("Senior Scientist, Bioinformatics", "senior chemistry")).toBe(false);
  });

  test("an empty query matches everything", () => {
    expect(matchesQuery("anything", undefined)).toBe(true);
    expect(matchesQuery("anything", "")).toBe(true);
  });
});

describe("ageInDays", () => {
  test("returns null for missing or unparseable dates", () => {
    expect(ageInDays(null)).toBeNull();
    expect(ageInDays("not-a-date")).toBeNull();
  });

  test("computes a positive age for a past date", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString();
    const age = ageInDays(tenDaysAgo)!;
    expect(age).toBeGreaterThan(9.5);
    expect(age).toBeLessThan(10.5);
  });
});

describe("resolveCompanies", () => {
  test("defaults to the full curated list", () => {
    expect(resolveCompanies({}).length).toBe(COMPANIES.length);
  });

  test("filters by sector", () => {
    const bio = resolveCompanies({ sector: "biotech" });
    expect(bio.length).toBeGreaterThan(0);
    expect(bio.every((c) => c.sector === "biotech")).toBe(true);
  });

  test("unknown sector yields an empty list (caller reports NO_COMPANIES)", () => {
    expect(resolveCompanies({ sector: "nope" })).toHaveLength(0);
  });

  test("explicit --company tokens win, including ones not in the curated list", () => {
    const r = resolveCompanies({ only: ["natera", "some-unlisted-co"] });
    expect(r.map((c) => c.token)).toEqual(["natera", "some-unlisted-co"]);
    expect(r[0].name).toBe("Natera");
    expect(r[1].name).toBe("some-unlisted-co");
  });
});

describe("resolveTarget", () => {
  test("extracts token and id from a job-boards URL", () => {
    expect(resolveTarget("https://job-boards.greenhouse.io/ginkgobioworks/jobs/5185285007")).toEqual({
      token: "ginkgobioworks",
      id: "5185285007",
    });
  });

  test("extracts token and id from an API URL", () => {
    expect(resolveTarget("https://boards-api.greenhouse.io/v1/boards/natera/jobs/123")).toEqual({
      token: "natera",
      id: "123",
    });
  });

  test("accepts a bare id when --company is supplied", () => {
    expect(resolveTarget("123456", "natera")).toEqual({ token: "natera", id: "123456" });
  });

  test("rejects a bare id with no --company", () => {
    expect(resolveTarget("123456")).toBeNull();
  });
});

describe("decodeHtmlEntities", () => {
  test("decodes named, decimal, and hex entities", () => {
    expect(decodeHtmlEntities("R&amp;D")).toBe("R&D");
    expect(decodeHtmlEntities("Caf&#233;")).toBe("Café");
    expect(decodeHtmlEntities("Caf&#xE9;")).toBe("Café");
  });
});
