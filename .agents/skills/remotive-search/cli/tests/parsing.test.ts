import { describe, test, expect } from "bun:test";
import {
  normalizeJob, matchesQuery, ageInDays, descriptionToText, decodeHtmlEntities,
  ATTRIBUTION, API_URL, type RemotiveJob,
} from "../src/helpers";
import { buildUrl } from "../src/commands/search";

const raw: RemotiveJob = {
  id: 2091081,
  url: "https://remotive.com/remote-jobs/data/senior-data-engineer-2091081",
  title: "Senior Data Engineer",
  company_name: "Acme",
  category: "Data and Analytics",
  tags: ["python", "sql"],
  job_type: "full_time",
  publication_date: "2026-07-28T14:23:05",
  candidate_required_location: "USA",
  salary: "",
};

describe("normalizeJob", () => {
  test("maps the Remotive shape onto the portal-skill contract", () => {
    const j = normalizeJob(raw);
    expect(j.id).toBe("2091081");
    expect(j.title).toBe("Senior Data Engineer");
    expect(j.company).toBe("Acme");
    expect(j.location).toBe("USA");
    expect(j.category).toBe("Data and Analytics");
    expect(j.jobType).toBe("full_time");
  });

  test("url is the public Remotive posting link, preserved verbatim", () => {
    expect(normalizeJob(raw).url).toBe(raw.url);
  });

  test("attribution is attached to every result (Remotive requires it)", () => {
    expect(normalizeJob(raw).attribution).toBe(ATTRIBUTION);
    expect(ATTRIBUTION).toMatch(/Remotive/);
  });

  test("an empty salary string becomes null rather than empty string", () => {
    expect(normalizeJob(raw).salary).toBeNull();
    expect(normalizeJob({ ...raw, salary: "$100k" }).salary).toBe("$100k");
  });
});

describe("buildUrl", () => {
  // Remotive's free API ignores search/category/limit — verified against the
  // live endpoint. The CLI must not send params implying otherwise.
  test("is parameterless regardless of options", () => {
    expect(buildUrl({ query: "python", category: "Software Development", page: 1, limit: 25, format: "json" })).toBe(API_URL);
    expect(buildUrl({ page: 1, limit: 25, format: "json" })).toBe(API_URL);
  });
});

describe("matchesQuery", () => {
  const j = normalizeJob(raw);
  test("matches on title, category and tags", () => {
    expect(matchesQuery(j, "data")).toBe(true);
    expect(matchesQuery(j, "python")).toBe(true);
    expect(matchesQuery(j, "analytics")).toBe(true);
  });
  test("requires every term", () => {
    expect(matchesQuery(j, "senior data")).toBe(true);
    expect(matchesQuery(j, "senior chemistry")).toBe(false);
  });
  test("no query matches everything", () => {
    expect(matchesQuery(j, undefined)).toBe(true);
  });
});

describe("descriptionToText", () => {
  test("strips HTML and decodes entities", () => {
    expect(descriptionToText("<p>Build &amp; ship</p>")).toBe("Build & ship");
  });
});

describe("decodeHtmlEntities", () => {
  test("handles named/decimal/hex", () => {
    expect(decodeHtmlEntities("A&amp;B")).toBe("A&B");
    expect(decodeHtmlEntities("Caf&#xE9;")).toBe("Café");
  });
});

describe("ageInDays", () => {
  test("null on missing/unparseable", () => {
    expect(ageInDays(null)).toBeNull();
    expect(ageInDays("nope")).toBeNull();
  });
});
