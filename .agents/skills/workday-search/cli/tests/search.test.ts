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
