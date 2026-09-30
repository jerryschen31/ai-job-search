import { describe, test, expect } from "bun:test";
import {
  normalizeJob, flattenResults, formatRange, jobUrl, matchesQuery, ageInDays,
  extractNextData, descriptionToText, ATTRIBUTION, type LevelsCompany,
} from "../src/helpers";
import { isKnownFamily, suggestFamilies, JOB_FAMILIES } from "../src/families";
import { resolveJobId } from "../src/commands/detail";
import { buildUrl } from "../src/commands/search";

const company: LevelsCompany = {
  companyName: "Databricks",
  companySlug: "databricks",
  jobs: [
    {
      id: "117191097934848710",
      title: "Senior Software Engineer, Compute Infrastructure",
      locations: ["Mountain View, California"],
      applicationUrl: "https://www.linkedin.com/jobs/view/123",
      postingDate: "2026-07-20T00:00:00.000Z",
      minBaseSalary: 180000, maxBaseSalary: 220000,
      minTotalSalary: 205000, maxTotalSalary: 205000,
      baseSalaryCurrency: "USD",
    },
  ],
};

describe("normalizeJob", () => {
  const j = normalizeJob(company.jobs![0], company);

  test("url is the Levels.fyi permalink (verifiable on the site)", () => {
    expect(j.url).toBe("https://www.levels.fyi/jobs?jobId=117191097934848710");
  });

  test("keeps the external application link separately", () => {
    expect(j.applicationUrl).toBe("https://www.linkedin.com/jobs/view/123");
  });

  test("attaches salary ranges — the reason to use this source", () => {
    expect(j.baseSalary).toBe("180K-220K");
    expect(j.totalSalary).toBe("205K");
  });

  test("carries attribution as Levels.fyi asks", () => {
    expect(j.attribution).toBe(ATTRIBUTION);
    expect(ATTRIBUTION).toMatch(/Levels\.fyi/);
  });

  test("maps company and location", () => {
    expect(j.company).toBe("Databricks");
    expect(j.location).toBe("Mountain View, California");
  });
});

describe("formatRange", () => {
  test("collapses an equal min/max to a single figure", () => {
    expect(formatRange(205000, 205000, "USD")).toBe("205K");
  });
  test("shows a range and appends non-USD currency", () => {
    expect(formatRange(100000, 150000, "USD")).toBe("100K-150K");
    expect(formatRange(100000, 150000, "EUR")).toBe("100K-150K EUR");
  });
  test("null when data is missing or non-positive", () => {
    expect(formatRange(null, 100, "USD")).toBeNull();
    expect(formatRange(0, 0, "USD")).toBeNull();
    expect(formatRange(undefined, undefined, null)).toBeNull();
  });
});

describe("flattenResults", () => {
  test("flattens the company-grouped payload into jobs", () => {
    const jobs = flattenResults([company, { companyName: "X", jobs: [] }]);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].company).toBe("Databricks");
  });
  test("skips entries with no id", () => {
    expect(flattenResults([{ companyName: "X", jobs: [{ id: "", title: "T" }] }])).toHaveLength(0);
  });
});

describe("buildUrl", () => {
  test("filters by PATH, since query params are ignored by Levels.fyi", () => {
    expect(buildUrl({ family: "software-engineer", page: 1, limit: 25, format: "json" }))
      .toBe("https://www.levels.fyi/jobs/title/software-engineer");
  });
  test("no family means the unfiltered board", () => {
    expect(buildUrl({ page: 1, limit: 25, format: "json" })).toBe("https://www.levels.fyi/jobs");
  });
  test("never puts the local --query into the URL", () => {
    expect(buildUrl({ query: "kubernetes", page: 1, limit: 25, format: "json" })).not.toContain("kubernetes");
  });
});

describe("families taxonomy", () => {
  test("is populated and includes common engineering families", () => {
    expect(JOB_FAMILIES.length).toBeGreaterThan(50);
    expect(isKnownFamily("software-engineer")).toBe(true);
    expect(isKnownFamily("data-scientist")).toBe(true);
  });
  test("has no bioinformatics family — the documented gap", () => {
    expect(isKnownFamily("bioinformatics")).toBe(false);
    expect(isKnownFamily("computational-biology")).toBe(false);
  });
  test("suggests near matches for a typo", () => {
    expect(suggestFamilies("software engineer")).toContain("software-engineer");
    expect(suggestFamilies("data science")).toContain("data-scientist");
  });
});

describe("resolveJobId", () => {
  test("accepts a bare numeric id and a ?jobId= url", () => {
    expect(resolveJobId("84665402944037574")).toBe("84665402944037574");
    expect(resolveJobId("https://www.levels.fyi/jobs?jobId=84665402944037574")).toBe("84665402944037574");
  });
  test("rejects nonsense", () => {
    expect(resolveJobId("not-an-id")).toBeNull();
    expect(resolveJobId("123")).toBeNull();
  });
});

describe("extractNextData", () => {
  test("pulls the JSON payload out of the script tag", () => {
    const html = `<html><script id="__NEXT_DATA__" type="application/json">{"a":1}</script></html>`;
    expect(extractNextData<{ a: number }>(html)?.a).toBe(1);
  });
  test("returns null when absent or malformed (rate-limited page)", () => {
    expect(extractNextData("<html></html>")).toBeNull();
    expect(extractNextData(`<script id="__NEXT_DATA__">{oops</script>`)).toBeNull();
  });
});

describe("descriptionToText", () => {
  test("converts the raw HTML description to readable text", () => {
    expect(descriptionToText("<div><h2>Title</h2><p>Body &amp; more</p></div>")).toContain("Body & more");
    expect(descriptionToText("<p>x</p>")).not.toContain("<p>");
  });
});

describe("matchesQuery / ageInDays", () => {
  const j = normalizeJob(company.jobs![0], company);
  test("query matches title and company", () => {
    expect(matchesQuery(j, "senior software")).toBe(true);
    expect(matchesQuery(j, "databricks")).toBe(true);
    expect(matchesQuery(j, "chemist")).toBe(false);
  });
  test("ageInDays null on bad input", () => {
    expect(ageInDays(null)).toBeNull();
  });
});

describe("jobUrl", () => {
  test("encodes the id", () => {
    expect(jobUrl("123")).toBe("https://www.levels.fyi/jobs?jobId=123");
  });
});
