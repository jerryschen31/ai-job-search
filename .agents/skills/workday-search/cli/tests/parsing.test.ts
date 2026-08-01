import { describe, test, expect } from "bun:test";
import {
  normalizePosting,
  postedOnToIso,
  descriptionToText,
  decodeHtmlEntities,
  ageInDays,
  MAX_PAGE_SIZE,
  type WorkdayPosting,
} from "../src/helpers";
import { resolveEmployers, siteBase, apiBase, EMPLOYERS } from "../src/employers";
import { parseWorkdayUrl } from "../src/commands/detail";

describe("normalizePosting", () => {
  const p: WorkdayPosting = {
    title: "Senior Bioinformatics Software Engineer",
    externalPath: "/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2",
    timeType: "Full time",
    locationsText: "Santa Clara",
    postedOn: "Posted 2 Days Ago",
    bulletFields: ["202607-118174"],
  };

  test("builds the public posting url from the site base plus externalPath", () => {
    const j = normalizePosting(p, "roche", "Roche / Genentech", "https://roche.wd3.myworkdayjobs.com/roche-ext");
    expect(j.url).toBe(
      "https://roche.wd3.myworkdayjobs.com/roche-ext/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2",
    );
  });

  test("maps title, location, timeType and req id", () => {
    const j = normalizePosting(p, "roche", "Roche / Genentech", "base");
    expect(j.title).toBe("Senior Bioinformatics Software Engineer");
    expect(j.location).toBe("Santa Clara");
    expect(j.timeType).toBe("Full time");
    expect(j.id).toBe("202607-118174");
    expect(j.company).toBe("Roche / Genentech");
  });

  test("falls back to the site base when externalPath is missing", () => {
    const j = normalizePosting({ title: "X" }, "k", "N", "https://base");
    expect(j.url).toBe("https://base");
    expect(j.id).toBeNull();
  });
});

describe("postedOnToIso", () => {
  const now = Date.parse("2026-08-01T00:00:00Z");

  test("parses 'Posted N Days Ago'", () => {
    expect(postedOnToIso("Posted 2 Days Ago", now)).toBe(new Date(now - 2 * 86400000).toISOString());
  });

  test("parses the '30+ Days Ago' form", () => {
    expect(postedOnToIso("Posted 30+ Days Ago", now)).toBe(new Date(now - 30 * 86400000).toISOString());
  });

  test("parses Today and Yesterday", () => {
    expect(postedOnToIso("Posted Today", now)).toBe(new Date(now).toISOString());
    expect(postedOnToIso("Posted Yesterday", now)).toBe(new Date(now - 86400000).toISOString());
  });

  test("approximates months and years", () => {
    expect(postedOnToIso("Posted 2 Months Ago", now)).toBe(new Date(now - 60 * 86400000).toISOString());
    expect(postedOnToIso("Posted 1 Year Ago", now)).toBe(new Date(now - 365 * 86400000).toISOString());
  });

  test("returns null rather than guessing on unrecognized phrasing", () => {
    expect(postedOnToIso("Reposted recently", now)).toBeNull();
    expect(postedOnToIso(null, now)).toBeNull();
    expect(postedOnToIso("", now)).toBeNull();
  });
});

describe("descriptionToText", () => {
  test("strips tags and preserves block breaks", () => {
    const html = "<p>Intro</p><ul><li>Python</li><li>NGS</li></ul>";
    const text = descriptionToText(html);
    expect(text).toContain("Intro");
    expect(text).toContain("Python");
    expect(text).not.toContain("<li>");
    expect(text.split("\n").length).toBeGreaterThan(1);
  });

  test("decodes entities", () => {
    expect(descriptionToText("<p>R&amp;D</p>")).toBe("R&D");
  });
});

describe("decodeHtmlEntities", () => {
  test("named, decimal and hex", () => {
    expect(decodeHtmlEntities("A&amp;B")).toBe("A&B");
    expect(decodeHtmlEntities("Caf&#233;")).toBe("Café");
    expect(decodeHtmlEntities("Caf&#xE9;")).toBe("Café");
  });
});

describe("ageInDays", () => {
  test("null on missing/unparseable", () => {
    expect(ageInDays(null)).toBeNull();
    expect(ageInDays("nope")).toBeNull();
  });
});

describe("employers", () => {
  test("MAX_PAGE_SIZE reflects Workday's hard cap of 20", () => {
    expect(MAX_PAGE_SIZE).toBe(20);
  });

  test("siteBase and apiBase derive the right URLs", () => {
    const e = { tenant: "roche", wd: "wd3", site: "roche-ext" };
    expect(siteBase(e)).toBe("https://roche.wd3.myworkdayjobs.com/roche-ext");
    expect(apiBase(e)).toBe("https://roche.wd3.myworkdayjobs.com/wday/cxs/roche/roche-ext");
  });

  test("resolveEmployers defaults to all, filters by sector, drops unknown keys", () => {
    expect(resolveEmployers({}).length).toBe(EMPLOYERS.length);
    expect(resolveEmployers({ sector: "pharma" }).every((e) => e.sector === "pharma")).toBe(true);
    expect(resolveEmployers({ sector: "zzz" })).toHaveLength(0);
    expect(resolveEmployers({ only: ["roche", "not-a-real-key"] }).map((e) => e.key)).toEqual(["roche"]);
  });
});

describe("parseWorkdayUrl", () => {
  test("extracts tenant, wd, site and path from a posting URL", () => {
    expect(
      parseWorkdayUrl(
        "https://roche.wd3.myworkdayjobs.com/roche-ext/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2",
      ),
    ).toEqual({
      tenant: "roche",
      wd: "wd3",
      site: "roche-ext",
      path: "/job/Santa-Clara/Senior-Bioinformatics-Software-Engineer_202607-118174-2",
    });
  });

  test("tolerates a locale segment in the path", () => {
    const p = parseWorkdayUrl("https://gsk.wd5.myworkdayjobs.com/en-US/GSKCareers/job/London/Scientist_123");
    expect(p?.site).toBe("GSKCareers");
    expect(p?.tenant).toBe("gsk");
  });

  test("rejects non-Workday URLs", () => {
    expect(parseWorkdayUrl("https://example.com/job/1")).toBeNull();
    expect(parseWorkdayUrl("not a url")).toBeNull();
  });
});
