import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function resp(total: number, postings: Array<Record<string, unknown>>) {
  return new Response(JSON.stringify({ total, jobPostings: postings }), {
    headers: { "Content-Type": "application/json" },
  });
}
function posting(title: string, extra: Record<string, unknown> = {}) {
  return {
    title,
    externalPath: `/job/Santa-Clara/${title.replace(/\s+/g, "-")}_1`,
    locationsText: "Santa Clara",
    postedOn: "Posted 2 Days Ago",
    bulletFields: ["REQ1"],
    ...extra,
  };
}
function captureStdout(): () => string {
  let out = "";
  process.stdout.write = ((c: string | Uint8Array) => { out += c.toString(); return true; }) as typeof process.stdout.write;
  return () => out;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
});

describe("runSearch", () => {
  test("sends the query server-side as searchText", async () => {
    let body: unknown;
    globalThis.fetch = (async (_u: string, init?: RequestInit) => {
      body = JSON.parse(String(init?.body));
      return resp(1, [posting("Bioinformatics Engineer")]);
    }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ query: "bioinformatics", employers: ["roche"], page: 1, limit: 5, format: "json" });
    expect((body as { searchText: string }).searchText).toBe("bioinformatics");
  });

  // The strict title filter is applied over the fetched window, so that window has to
  // be deeper than one page or a real match ranked below the OR-matched noise is lost.
  test("a strict query overfetches past the page size, and a large limit is not shrunk", async () => {
    const offsets: number[] = [];
    globalThis.fetch = (async (_u: string, init?: RequestInit) => {
      offsets.push(JSON.parse(String(init?.body)).offset);
      return resp(500, Array.from({ length: 20 }, (_, i) => posting(`Data Engineer ${i}`)));
    }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ query: "data engineer", employers: ["roche"], page: 1, limit: 10, format: "json" });
    expect(Math.max(...offsets)).toBeGreaterThanOrEqual(80);

    offsets.length = 0;
    await runSearch({ query: "data engineer", employers: ["roche"], page: 1, limit: 300, format: "json" });
    expect(Math.max(...offsets)).toBeGreaterThanOrEqual(280);
  });

  test("no overfetch when there is no query to filter on", async () => {
    const offsets: number[] = [];
    globalThis.fetch = (async (_u: string, init?: RequestInit) => {
      offsets.push(JSON.parse(String(init?.body)).offset);
      return resp(500, Array.from({ length: 20 }, (_, i) => posting(`Role ${i}`)));
    }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ employers: ["roche"], page: 1, limit: 10, format: "json" });
    expect(Math.max(...offsets)).toBe(0);
  });

  test("never requests more than Workday's 20-per-page cap", async () => {
    let sawLimit = 0;
    globalThis.fetch = (async (_u: string, init?: RequestInit) => {
      sawLimit = JSON.parse(String(init?.body)).limit;
      return resp(1, [posting("A")]);
    }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ employers: ["roche"], page: 1, limit: 100, format: "json" });
    expect(sawLimit).toBe(20);
  });

  test("every result carries a resolvable posting url", async () => {
    globalThis.fetch = (async () => resp(1, [posting("Engineer")])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ employers: ["roche"], page: 1, limit: 5, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toMatch(/^https:\/\/roche\.wd3\.myworkdayjobs\.com\/roche-ext\/job\//);
  });

  test("filters by location", async () => {
    globalThis.fetch = (async () =>
      resp(2, [posting("A"), posting("B", { locationsText: "Basel" })])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ location: "santa clara", employers: ["roche"], page: 1, limit: 10, format: "json" });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].location).toBe("Santa Clara");
  });

  // Regression: the location filter was a raw substring test, so -l "CA" matched the
  // "ca" inside "2 Locations" and "Ocoyoacac" and let Budapest/Hyderabad rows through.
  test("a short location filter matches whole tokens, not substrings", async () => {
    globalThis.fetch = (async () =>
      resp(4, [
        posting("Keep", { locationsText: "Santa Clara, CA" }),
        posting("Drop-multi", { locationsText: "2 Locations" }),
        posting("Drop-town", { locationsText: "Ocoyoacac" }),
        posting("Drop-far", { locationsText: "Budapest" }),
      ])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ location: "CA", employers: ["roche"], page: 1, limit: 10, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Keep"]);
  });

  // Regression: Workday OR-matches searchText across the whole posting, so
  // -q "technical program manager" came back with "Key Account Manager".
  test("a multi-word query keeps only titles containing every term", async () => {
    globalThis.fetch = (async () =>
      resp(3, [
        posting("Senior Technical Program Manager"),
        posting("Key Account Manager"),
        posting("Field Medical Director, Oncology East"),
      ])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({
      query: "technical program manager",
      employers: ["roche"],
      page: 1,
      limit: 10,
      format: "json",
    });
    const d = JSON.parse(read());
    expect(d.results.map((r: { title: string }) => r.title)).toEqual([
      "Senior Technical Program Manager",
    ]);
    expect(d.meta.queryFilter).toBe("all-terms-in-title");
  });

  test("--loose restores Workday's raw OR-matched ranking", async () => {
    globalThis.fetch = (async () =>
      resp(2, [posting("Senior Technical Program Manager"), posting("Key Account Manager")])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({
      query: "technical program manager",
      loose: true,
      employers: ["roche"],
      page: 1,
      limit: 10,
      format: "json",
    });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(2);
    expect(d.meta.queryFilter).toBe("loose");
  });

  // "ai" as a substring lands in the middle of ordinary words (it pulled a German
  // cleanroom internship into an "AI engineer" search), so two-letter terms match
  // whole tokens only — while longer terms stay substrings.
  test("two-letter terms match whole tokens; longer terms stay substrings", async () => {
    globalThis.fetch = (async () =>
      resp(3, [
        posting("Data & AI Engineer"),
        posting("Praktikum Instandhaltung Engineering"),
        posting("Senior Bioinformatician"),
      ])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "AI engineer", employers: ["roche"], page: 1, limit: 10, format: "json" });
    expect(JSON.parse(read()).results.map((r: { title: string }) => r.title)).toEqual([
      "Data & AI Engineer",
    ]);

    const read2 = captureStdout();
    await runSearch({ query: "bioinformatic", employers: ["roche"], page: 1, limit: 10, format: "json" });
    expect(JSON.parse(read2()).results.map((r: { title: string }) => r.title)).toEqual([
      "Senior Bioinformatician",
    ]);
  });

  // The term a searcher wants often lives only in the description, so a single-word
  // query must not be narrowed away just because the title words it differently.
  test("a single-word query still matches titles that merely contain it", async () => {
    globalThis.fetch = (async () =>
      resp(2, [posting("Senior Bioinformatics Software Engineer"), posting("Key Account Manager")])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "bioinformatics", employers: ["roche"], page: 1, limit: 10, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Senior Bioinformatics Software Engineer"]);
  });

  test("jobage filters using the parsed relative posted date", async () => {
    globalThis.fetch = (async () =>
      resp(2, [
        posting("Fresh", { postedOn: "Posted 2 Days Ago" }),
        posting("Old", { postedOn: "Posted 30+ Days Ago" }),
      ])) as unknown as typeof fetch;
    const read = captureStdout();
    await runSearch({ jobage: 7, employers: ["roche"], page: 1, limit: 10, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Fresh"]);
  });

  test("a response with no jobPostings is reported, not fatal", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ total: 0 }), { headers: { "Content-Type": "application/json" } })) as typeof fetch;
    const read = captureStdout();
    const code = await runSearch({ employers: ["roche"], page: 1, limit: 5, format: "json" });
    expect(code).toBe(0);
    expect(JSON.parse(read()).meta.failed[0].error).toBe("no results returned");
  });

  test("an ad-hoc employer targets the supplied tenant/wd/site", async () => {
    let url = "";
    globalThis.fetch = (async (u: string) => { url = String(u); return resp(1, [posting("A")]); }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    await runSearch({ custom: { tenant: "acme", wd: "wd5", site: "AcmeCareers" }, page: 1, limit: 5, format: "json" });
    expect(url).toBe("https://acme.wd5.myworkdayjobs.com/wday/cxs/acme/AcmeCareers/jobs");
  });

  test("unknown employer key exits 1 with NO_EMPLOYERS", async () => {
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runSearch({ employers: ["nope"], page: 1, limit: 5, format: "json" })).toBe(1);
  });
});
