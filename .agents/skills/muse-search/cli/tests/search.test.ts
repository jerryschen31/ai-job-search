import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function page(results: Array<Record<string, unknown>>, total = results.length, pageCount = 1) {
  return new Response(JSON.stringify({ results, total, page_count: pageCount }), {
    headers: { "Content-Type": "application/json" },
  });
}
function job(id: number, name: string, extra: Record<string, unknown> = {}) {
  return {
    id, name,
    publication_date: new Date().toISOString(),
    locations: [{ name: "San Jose, CA" }],
    categories: [{ name: "Data and Analytics" }],
    company: { name: "Acme", short_name: "acme" },
    refs: { landing_page: `https://www.themuse.com/jobs/acme/${id}` },
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
  test("fetches the requested number of upstream pages", async () => {
    let calls = 0;
    globalThis.fetch = (async () => { calls++; return page([job(calls, `Job ${calls}`)], 100, 10); }) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    await runSearch({ pages: 3, page: 1, limit: 25, format: "json" });
    expect(calls).toBe(3);
  });

  test("stops early when page_count is reached", async () => {
    let calls = 0;
    globalThis.fetch = (async () => { calls++; return page([job(calls, "J")], 1, 1); }) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    await runSearch({ pages: 5, page: 1, limit: 25, format: "json" });
    expect(calls).toBe(1);
  });

  test("narrows locally by query", async () => {
    globalThis.fetch = (async () => page([job(1, "Data Engineer"), job(2, "Recruiter", { categories: [{ name: "HR" }] })], 2, 1)) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "data", pages: 1, page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].title).toBe("Data Engineer");
  });

  test("every result carries a resolvable url", async () => {
    globalThis.fetch = (async () => page([job(1, "Engineer")], 1, 1)) as typeof fetch;
    const read = captureStdout();
    await runSearch({ pages: 1, page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toBe("https://www.themuse.com/jobs/acme/1");
    expect(d.results.every((r: { url: string }) => r.url.startsWith("https://"))).toBe(true);
  });

  test("jobage filters old postings but keeps undated", async () => {
    globalThis.fetch = (async () => page([
      job(1, "Fresh"),
      job(2, "Stale", { publication_date: new Date(Date.now() - 200 * 86400000).toISOString() }),
      job(3, "Undated", { publication_date: null }),
    ], 3, 1)) as typeof fetch;
    const read = captureStdout();
    await runSearch({ jobage: 30, pages: 1, page: 1, limit: 25, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toContain("Fresh");
    expect(titles).toContain("Undated");
    expect(titles).not.toContain("Stale");
  });

  test("--with-description converts contents HTML to text", async () => {
    globalThis.fetch = (async () => page([job(1, "Engineer", { contents: "<p>Hi &amp; hello</p>" })], 1, 1)) as typeof fetch;
    const read = captureStdout();
    await runSearch({ pages: 1, page: 1, limit: 25, withDescription: true, format: "json" });
    expect(JSON.parse(read()).results[0].description).toBe("Hi & hello");
  });

  test("a first page with no results list exits 1", async () => {
    globalThis.fetch = (async () => new Response("{}", { headers: { "Content-Type": "application/json" } })) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runSearch({ pages: 1, page: 1, limit: 25, format: "json" })).toBe(1);
  });
});
