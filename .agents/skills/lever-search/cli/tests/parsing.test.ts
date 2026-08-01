import { describe, test, expect } from "bun:test";
import {
  normalizeJob,
  formatLocation,
  formatSalary,
  buildDescription,
  toIso,
  matchesQuery,
  type LeverJob,
} from "../src/helpers";
import { resolveCompanies, COMPANIES } from "../src/companies";
import { resolveTarget } from "../src/commands/detail";

const base: LeverJob = {
  id: "2ef807a0-f80d-47ba-a1a1-578ebe195592",
  text: "Senior Software Systems Engineer",
  hostedUrl: "https://jobs.lever.co/zoox/2ef807a0-f80d-47ba-a1a1-578ebe195592",
  applyUrl: "https://jobs.lever.co/zoox/2ef807a0/apply",
  createdAt: 1785000000000,
  workplaceType: "onsite",
  categories: {
    commitment: "Full-time",
    department: "Software",
    team: "Simulation",
    location: "Foster City, CA",
    allLocations: ["Foster City, CA"],
  },
};

describe("normalizeJob", () => {
  test("maps the Lever shape onto the portal-skill contract", () => {
    const j = normalizeJob(base, "zoox", "Zoox");
    expect(j.id).toBe(base.id);
    expect(j.title).toBe("Senior Software Systems Engineer");
    expect(j.company).toBe("Zoox");
    expect(j.department).toBe("Software");
    expect(j.team).toBe("Simulation");
    expect(j.commitment).toBe("Full-time");
  });

  test("url is the public hostedUrl, preserved verbatim", () => {
    expect(normalizeJob(base, "zoox", "Zoox").url).toBe(base.hostedUrl);
  });

  test("missing optional values become null", () => {
    const j = normalizeJob({ id: "a", text: "T", hostedUrl: "u" }, "x", "X");
    expect(j.location).toBeNull();
    expect(j.date).toBeNull();
    expect(j.salary).toBeNull();
    expect(j.department).toBeNull();
  });
});

describe("toIso", () => {
  test("converts Lever's epoch-millisecond createdAt to ISO", () => {
    expect(toIso(1785000000000)).toBe(new Date(1785000000000).toISOString());
  });

  test("rejects non-numeric, zero, and negative values", () => {
    expect(toIso(null)).toBeNull();
    expect(toIso(undefined)).toBeNull();
    expect(toIso(0)).toBeNull();
    expect(toIso(-5)).toBeNull();
  });
});

describe("formatLocation", () => {
  test("joins and de-duplicates locations", () => {
    expect(
      formatLocation({
        ...base,
        categories: { location: "Foster City, CA", allLocations: ["Foster City, CA", "Seattle, WA"] },
      }),
    ).toBe("Foster City, CA; Seattle, WA");
  });

  test("null when no location present", () => {
    expect(formatLocation({ id: "a", text: "T", hostedUrl: "u" })).toBeNull();
  });
});

describe("formatSalary", () => {
  test("formats a min/max range in thousands", () => {
    expect(
      formatSalary({ ...base, salaryRange: { min: 180000, max: 250000, currency: "USD", interval: "per-year-salary" } }),
    ).toBe("USD 180K-250K / year-salary");
  });

  test("null when the range is incomplete", () => {
    expect(formatSalary({ ...base, salaryRange: { min: 100000 } })).toBeNull();
    expect(formatSalary(base)).toBeNull();
  });
});

describe("buildDescription", () => {
  test("concatenates the separate plain-text fields", () => {
    const d = buildDescription({
      ...base,
      openingPlain: "Intro.",
      descriptionPlain: "Body.",
      additionalPlain: "Responsibilities.",
    });
    expect(d).toBe("Intro.\n\nBody.\n\nResponsibilities.");
  });

  test("de-duplicates identical fields (descriptionPlain vs descriptionBodyPlain)", () => {
    const d = buildDescription({ ...base, descriptionPlain: "Same.", descriptionBodyPlain: "Same." });
    expect(d).toBe("Same.");
  });

  test("recovers a description when descriptionPlain is empty but additionalPlain is not", () => {
    const d = buildDescription({ ...base, descriptionPlain: "", additionalPlain: "The real content." });
    expect(d).toBe("The real content.");
  });

  test("null when every field is empty", () => {
    expect(buildDescription({ ...base, descriptionPlain: "", additionalPlain: "   " })).toBeNull();
  });
});

describe("matchesQuery", () => {
  test("all terms must match, order-independent", () => {
    expect(matchesQuery("Senior Software Systems Engineer", "software senior")).toBe(true);
    expect(matchesQuery("Senior Software Systems Engineer", "hardware")).toBe(false);
  });
});

describe("resolveCompanies", () => {
  test("defaults to the curated list", () => {
    expect(resolveCompanies({}).length).toBe(COMPANIES.length);
  });
  test("filters by sector", () => {
    expect(resolveCompanies({ sector: "biotech" }).every((c) => c.sector === "biotech")).toBe(true);
  });
  test("unknown sector is empty", () => {
    expect(resolveCompanies({ sector: "zzz" })).toHaveLength(0);
  });
});

describe("resolveTarget", () => {
  test("parses slug and id from a jobs.lever.co URL", () => {
    expect(resolveTarget("https://jobs.lever.co/zoox/2ef807a0-f80d-47ba-a1a1-578ebe195592")).toEqual({
      slug: "zoox",
      id: "2ef807a0-f80d-47ba-a1a1-578ebe195592",
    });
  });
  test("accepts a bare id with --company", () => {
    expect(resolveTarget("2ef807a0-f80d-47ba-a1a1-578ebe195592", "zoox")?.slug).toBe("zoox");
  });
  test("rejects a bare id without --company", () => {
    expect(resolveTarget("2ef807a0-f80d-47ba-a1a1-578ebe195592")).toBeNull();
  });
});
