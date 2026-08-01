import { describe, test, expect } from "bun:test";
import { normalizeJob, formatLocation, matchesQuery, ageInDays, type AshbyJob } from "../src/helpers";
import { resolveCompanies, COMPANIES } from "../src/companies";
import { resolveTarget } from "../src/commands/detail";

const base: AshbyJob = {
  id: "71606d59-a7d1-4246-8fb3-f8c97ba8201b",
  title: "Senior ML Scientist",
  department: "Research",
  employmentType: "FullTime",
  location: "South San Francisco, CA",
  publishedAt: "2026-04-22T17:10:36.849+00:00",
  jobUrl: "https://jobs.ashbyhq.com/insitro/71606d59-a7d1-4246-8fb3-f8c97ba8201b",
  applyUrl: "https://jobs.ashbyhq.com/insitro/71606d59/application",
  isRemote: false,
  workplaceType: "Onsite",
};

describe("normalizeJob", () => {
  test("maps the Ashby shape onto the portal-skill contract", () => {
    const j = normalizeJob(base, "insitro", "insitro");
    expect(j.id).toBe(base.id);
    expect(j.title).toBe("Senior ML Scientist");
    expect(j.company).toBe("insitro");
    expect(j.location).toBe("South San Francisco, CA");
    expect(j.department).toBe("Research");
    expect(j.employmentType).toBe("FullTime");
    expect(j.isRemote).toBe(false);
  });

  test("url is the public posting link, preserved verbatim", () => {
    expect(normalizeJob(base, "insitro", "insitro").url).toBe(base.jobUrl);
  });

  test("falls back to team when department is absent", () => {
    const j = normalizeJob({ ...base, department: null, team: "Platform" }, "x", "X");
    expect(j.department).toBe("Platform");
  });

  test("missing optional values become null", () => {
    const sparse: AshbyJob = { id: "a", title: "T", jobUrl: "u" };
    const j = normalizeJob(sparse, "x", "X");
    expect(j.location).toBeNull();
    expect(j.date).toBeNull();
    expect(j.salary).toBeNull();
    expect(j.isRemote).toBeNull();
  });

  test("surfaces the compensation tier summary when present", () => {
    const j = normalizeJob(
      { ...base, compensation: { compensationTierSummary: "$200K – $260K" } },
      "x",
      "X",
    );
    expect(j.salary).toBe("$200K – $260K");
  });
});

describe("formatLocation", () => {
  test("joins primary and secondary locations", () => {
    expect(
      formatLocation({
        ...base,
        location: "SSF, CA",
        secondaryLocations: [{ location: "Cambridge, MA" }],
      }),
    ).toBe("SSF, CA; Cambridge, MA");
  });

  test("de-duplicates repeated locations", () => {
    expect(
      formatLocation({ ...base, location: "SSF", secondaryLocations: [{ location: "SSF" }] }),
    ).toBe("SSF");
  });

  test("returns null when there is no location at all", () => {
    expect(formatLocation({ id: "a", title: "T", jobUrl: "u" })).toBeNull();
  });
});

describe("matchesQuery", () => {
  test("all terms must match, order-independent", () => {
    expect(matchesQuery("Senior ML Scientist", "senior scientist")).toBe(true);
    expect(matchesQuery("Senior ML Scientist", "scientist senior")).toBe(true);
    expect(matchesQuery("Senior ML Scientist", "senior chemist")).toBe(false);
  });
});

describe("ageInDays", () => {
  test("null for missing/unparseable", () => {
    expect(ageInDays(null)).toBeNull();
    expect(ageInDays("nope")).toBeNull();
  });
});

describe("resolveCompanies", () => {
  test("defaults to the curated list", () => {
    expect(resolveCompanies({}).length).toBe(COMPANIES.length);
  });
  test("filters by sector", () => {
    const bio = resolveCompanies({ sector: "biotech" });
    expect(bio.every((c) => c.sector === "biotech")).toBe(true);
    expect(bio.some((c) => c.slug === "insitro")).toBe(true);
  });
  test("unknown sector is empty", () => {
    expect(resolveCompanies({ sector: "zzz" })).toHaveLength(0);
  });
  test("explicit slugs pass through even when unlisted", () => {
    const r = resolveCompanies({ only: ["insitro", "brand-new-co"] });
    expect(r.map((c) => c.slug)).toEqual(["insitro", "brand-new-co"]);
  });
});

describe("resolveTarget", () => {
  test("parses slug and id from a posting URL", () => {
    expect(
      resolveTarget("https://jobs.ashbyhq.com/insitro/71606d59-a7d1-4246-8fb3-f8c97ba8201b"),
    ).toEqual({ slug: "insitro", id: "71606d59-a7d1-4246-8fb3-f8c97ba8201b" });
  });
  test("accepts a bare id with --company", () => {
    expect(resolveTarget("71606d59-a7d1-4246-8fb3-f8c97ba8201b", "insitro")).toEqual({
      slug: "insitro",
      id: "71606d59-a7d1-4246-8fb3-f8c97ba8201b",
    });
  });
  test("rejects a bare id with no company", () => {
    expect(resolveTarget("71606d59-a7d1-4246-8fb3-f8c97ba8201b")).toBeNull();
  });
});
