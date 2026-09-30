import { describe, test, expect } from "bun:test";
import {
  normalizeJob, formatLocations, jobUrl, matchesQuery, ageInDays,
  contentsToText, decodeHtmlEntities, type MuseJob,
} from "../src/helpers";
import { buildUrl } from "../src/commands/search";

const raw: MuseJob = {
  id: 21916588,
  name: "Senior Data Engineer",
  publication_date: "2026-07-29T19:22:35Z",
  locations: [{ name: "San Jose, CA" }, { name: "Seattle, WA" }],
  categories: [{ name: "Data and Analytics" }],
  levels: [{ name: "Senior Level" }],
  company: { id: 1, name: "Acme Corp", short_name: "acme" },
  refs: { landing_page: "https://www.themuse.com/jobs/acme/senior-data-engineer" },
};

describe("normalizeJob", () => {
  test("maps the Muse shape onto the portal-skill contract", () => {
    const j = normalizeJob(raw);
    expect(j.id).toBe("21916588");
    expect(j.title).toBe("Senior Data Engineer");
    expect(j.company).toBe("Acme Corp");
    expect(j.companySlug).toBe("acme");
    expect(j.category).toBe("Data and Analytics");
    expect(j.level).toBe("Senior Level");
  });

  test("url comes from refs.landing_page", () => {
    expect(normalizeJob(raw).url).toBe("https://www.themuse.com/jobs/acme/senior-data-engineer");
  });
});

describe("jobUrl", () => {
  test("prefers refs.landing_page", () => {
    expect(jobUrl(raw)).toBe("https://www.themuse.com/jobs/acme/senior-data-engineer");
  });
  test("falls back to a company page when landing_page is missing", () => {
    expect(jobUrl({ ...raw, refs: null })).toBe("https://www.themuse.com/jobs/acme");
  });
  test("always returns some openable link, even with no company", () => {
    const u = jobUrl({ id: 1, name: "Data Role", refs: null, company: null });
    expect(u).toMatch(/^https:\/\/www\.themuse\.com\//);
  });
  test("treats an empty landing_page as missing", () => {
    expect(jobUrl({ ...raw, refs: { landing_page: "" } })).toBe("https://www.themuse.com/jobs/acme");
  });
});

describe("formatLocations", () => {
  test("joins and de-duplicates", () => {
    expect(formatLocations(raw)).toBe("San Jose, CA; Seattle, WA");
    expect(formatLocations({ ...raw, locations: [{ name: "X" }, { name: "X" }] })).toBe("X");
  });
  test("null when absent", () => {
    expect(formatLocations({ id: 1, name: "T", locations: [] })).toBeNull();
  });
});

describe("buildUrl", () => {
  test("sends the server-side taxonomy filters", () => {
    const u = buildUrl(
      { location: "San Jose, CA", category: "Data and Analytics", level: "Senior Level", company: "acme", page: 1, limit: 25, pages: 1, format: "json" },
      2,
    );
    expect(u).toContain("page=2");
    expect(u).toContain("location=San+Jose%2C+CA");
    expect(u).toContain("category=Data+and+Analytics");
    expect(u).toContain("level=Senior+Level");
    expect(u).toContain("company=acme");
  });
  test("does not send --query (The Muse has no keyword param)", () => {
    const u = buildUrl({ query: "scientist", page: 1, limit: 25, pages: 1, format: "json" }, 1);
    expect(u).not.toContain("scientist");
  });
});

describe("matchesQuery", () => {
  const j = normalizeJob(raw);
  test("matches title/category/company/level, all terms required", () => {
    expect(matchesQuery(j, "data")).toBe(true);
    expect(matchesQuery(j, "senior data")).toBe(true);
    expect(matchesQuery(j, "acme")).toBe(true);
    expect(matchesQuery(j, "chemistry")).toBe(false);
  });
});

describe("contentsToText / decodeHtmlEntities", () => {
  test("renders HTML contents as text", () => {
    expect(contentsToText("<p>Build &amp; ship</p>")).toBe("Build & ship");
  });
  test("decodes entities", () => {
    expect(decodeHtmlEntities("Caf&#xE9;")).toBe("Café");
  });
});

describe("ageInDays", () => {
  test("null on missing/unparseable", () => {
    expect(ageInDays(null)).toBeNull();
    expect(ageInDays("nope")).toBeNull();
  });
});
