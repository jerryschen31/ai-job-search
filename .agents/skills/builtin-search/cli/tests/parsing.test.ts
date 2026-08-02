import { describe, test, expect } from "bun:test";
import { parseJobCards, parseJobDetail, decodeHtmlEntities } from "../src/helpers";

// Minimal card markup mirroring builtin.com's real structure: each card is
// wrapped in id="job-card-<id>", with a company link (data-id="company-title"),
// a title link (data-id="job-card-title", data-alias holds the path), and a
// tooltip (data-bs-title) carrying one or more <div>-wrapped locations.
function searchCard(opts: {
  id: string;
  title: string;
  company?: string;
  locations?: string[];
  date?: string;
  salary?: string;
  seniority?: string;
  workplace?: string;
}): string {
  const {
    id,
    title,
    company = "Acme Corp",
    locations = ["San Jose, CA, USA"],
    date = "Reposted 3 Days Ago",
    salary,
    seniority,
    workplace,
  } = opts;
  const tooltip = locations.map((l) => `&lt;div class=&#x27;text-truncate&#x27;&gt;${l}&lt;/div&gt;`).join("");
  const salaryHtml = salary
    ? `<div class="d-flex align-items-start gap-sm"><div><i class="fa-regular fa-sack-dollar"></i></div><span class="font-barlow text-gray-04">${salary}</span></div>`
    : "";
  const seniorityHtml = seniority
    ? `<div class="d-flex align-items-start gap-sm"><div><i class="fa-regular fa-trophy"></i></div><span class="font-barlow text-gray-04">${seniority}</span></div>`
    : "";
  const workplaceHtml = workplace
    ? `<div class="d-flex align-items-start gap-sm"><div><i class="fa-regular fa-house-building"></i></div><span class="font-barlow text-gray-04">${workplace}</span></div>`
    : "";
  return `<div id="job-card-${id}" data-id="job-card">
    <div class="left-side-tile-item-2"><a href="/company/acme" target="_blank" data-id="company-title" data-builtin-track-job-id="${id}"><span>${company}</span></a></div>
    <div class="left-side-tile-item-3"><h2><a href="/job/some-role/${id}" target="_blank" data-id="job-card-title" data-alias="/job/some-role/${id}">${title}</a></h2></div>
    <span class="fs-xs fw-bold"><i class="fa-regular fa-clock"></i>${date}</span>
    <div><i class="fa-regular fa-location-dot"></i><span data-bs-toggle="tooltip" data-bs-title="${tooltip}">${locations.length > 1 ? locations.length + " Locations" : locations[0]}</span></div>
    ${salaryHtml}${seniorityHtml}${workplaceHtml}
  </div>`;
}

describe("parseJobCards", () => {
  test("parses id, title, company, url from a single card", () => {
    const html = searchCard({ id: "111111", title: "Backend Engineer" });
    const [card] = parseJobCards(html);
    expect(card.id).toBe("111111");
    expect(card.title).toBe("Backend Engineer");
    expect(card.company).toBe("Acme Corp");
    expect(card.companyUrl).toBe("https://builtin.com/company/acme");
    expect(card.url).toBe("https://builtin.com/job/some-role/111111");
  });

  test("joins multiple tooltip locations with a separator", () => {
    const html = searchCard({
      id: "222222",
      title: "Platform Engineer",
      locations: ["Warren, MI, USA", "Mountain View, CA, USA"],
    });
    const [card] = parseJobCards(html);
    expect(card.location).toBe("Warren, MI, USA; Mountain View, CA, USA");
  });

  test("extracts salary, seniority, and workplace type via adjacent icon markers", () => {
    const html = searchCard({
      id: "333333",
      title: "Data Engineer",
      salary: "120K-180K Annually",
      seniority: "Senior level",
      workplace: "Hybrid",
    });
    const [card] = parseJobCards(html);
    expect(card.salary).toBe("120K-180K Annually");
    expect(card.seniority).toBe("Senior level");
    expect(card.workplaceType).toBe("Hybrid");
  });

  test("date field carries the site's relative posting text", () => {
    const html = searchCard({ id: "444444", title: "SRE", date: "Reposted 13 Hours Ago" });
    const [card] = parseJobCards(html);
    expect(card.date).toBe("Reposted 13 Hours Ago");
  });

  test("one malformed card does not break parsing of the rest", () => {
    const bad = `<div id="job-card-999999" data-id="job-card">no title link here</div>`;
    const good = searchCard({ id: "555555", title: "Good Card" });
    const [card] = parseJobCards(bad + good);
    expect(card.id).toBe("555555");
    expect(card.title).toBe("Good Card");
  });

  test("decodes HTML entities in the title", () => {
    const html = searchCard({ id: "666666", title: "Caf&#xE9; Ops Engineer" });
    const [card] = parseJobCards(html);
    expect(card.title).toBe("Café Ops Engineer");
  });

  test("returns an empty array for a page with no job cards", () => {
    expect(parseJobCards("<div>no jobs here</div>")).toHaveLength(0);
  });
});

describe("parseJobDetail", () => {
  // builtin.com HTML-escapes the "+" in the script type attribute
  // (application/ld&#x2B;json), and the JSON body itself carries &amp; for
  // literal ampersands - both must round-trip through decodeHtmlEntities.
  function detailHtml(jobPosting: Record<string, unknown>): string {
    const json = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "JobPosting", ...jobPosting }],
    }).replace(/&/g, "&amp;");
    return `<html><head><script type="application/ld&#x2B;json">${json}</script></head><body></body></html>`;
  }

  test("parses title, company, salary, and description from JSON-LD", () => {
    const html = detailHtml({
      title: "Senior Engineer",
      description: "<b>Overview</b><br>Build things &amp; ship them.",
      hiringOrganization: { name: "Acme & Co", sameAs: "https://builtin.com/company/acme" },
      baseSalary: { value: { minValue: 120000, maxValue: 180000, unitText: "YEAR" } },
      datePosted: "2026-01-15",
      employmentType: "FULL_TIME",
      industry: ["Software", "AI"],
    });
    const job = parseJobDetail(html, "777777", "https://builtin.com/job/x/777777");
    expect(job).not.toBeNull();
    expect(job!.title).toBe("Senior Engineer");
    expect(job!.company).toBe("Acme & Co");
    expect(job!.salary).toBe("120K-180K Annually");
    expect(job!.employmentType).toBe("FULL_TIME");
    expect(job!.industries).toEqual(["Software", "AI"]);
    expect(job!.description).toContain("Overview");
    expect(job!.description).toContain("Build things & ship them.");
  });

  // Regression: schema.org `industry` is a Text field, so a single-industry posting
  // arrives as a bare string. A string passes `.length` but has no `.join`, which
  // made `detail --format plain` exit 1 with DETAIL_FAILED on most biotech listings.
  test("coerces a single-industry string to an array", () => {
    const html = detailHtml({ title: "DevOps Engineer", industry: "Biotech" });
    const job = parseJobDetail(html, "9568850", "https://builtin.com/job/x/9568850");
    expect(job!.industries).toEqual(["Biotech"]);
  });

  test("industries is null when absent or empty, never a bare string", () => {
    const absent = parseJobDetail(detailHtml({ title: "A" }), "1", "https://builtin.com/job/x/1");
    expect(absent!.industries).toBeNull();
    const blank = parseJobDetail(detailHtml({ title: "B", industry: "   " }), "2", "https://builtin.com/job/x/2");
    expect(blank!.industries).toBeNull();
  });

  test("joins multiple jobLocation entries", () => {
    const html = detailHtml({
      title: "Remote Engineer",
      jobLocation: [
        { address: { addressLocality: "Warren", addressRegion: "Michigan", addressCountry: "USA" } },
        { address: { addressLocality: "Mountain View", addressRegion: "California", addressCountry: "USA" } },
      ],
    });
    const job = parseJobDetail(html, "888888", "https://builtin.com/job/x/888888");
    expect(job!.location).toBe("Warren, Michigan, USA; Mountain View, California, USA");
  });

  test("returns null when no JobPosting JSON-LD block is present", () => {
    const job = parseJobDetail("<html><body>no data here</body></html>", "999999", "https://builtin.com/job/x/999999");
    expect(job).toBeNull();
  });
});

describe("decodeHtmlEntities", () => {
  test("decodes hex, decimal, and named entities", () => {
    expect(decodeHtmlEntities("Caf&#xE9;")).toBe("Café");
    expect(decodeHtmlEntities("Caf&#233;")).toBe("Café");
    expect(decodeHtmlEntities("Tom &amp; Jerry")).toBe("Tom & Jerry");
  });
});
