import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function feed(jobs: Array<Record<string, unknown>>) {
  return new Response(JSON.stringify({ "job-count": jobs.length, jobs }), {
    headers: { "Content-Type": "application/json" },
  });
}
function job(id: number, title: string, extra: Record<string, unknown> = {}) {
  return {
    id, title,
    url: `https://remotive.com/remote-jobs/x/${id}`,
    company_name: "Acme",
    category: "Software Development",
    tags: [],
    candidate_required_location: "USA",
    publication_date: new Date().toISOString().slice(0, 19),
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
  test("makes exactly one upstream request (Remotive rate-limit guidance)", async () => {
    let calls = 0;
    globalThis.fetch = (async () => { calls++; return feed([job(1, "Engineer")]); }) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    await runSearch({ query: "engineer", page: 1, limit: 25, format: "json" });
    expect(calls).toBe(1);
  });

  test("filters locally by query", async () => {
    globalThis.fetch = (async () => feed([job(1, "Data Engineer"), job(2, "Recruiter", { category: "HR" })])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "data", page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].title).toBe("Data Engineer");
  });

  test("filters locally by category and location", async () => {
    globalThis.fetch = (async () => feed([
      job(1, "A"),
      job(2, "B", { category: "Design" }),
      job(3, "C", { candidate_required_location: "Europe" }),
    ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ category: "software", location: "usa", page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results.map((r: { id: string }) => r.id)).toEqual(["1"]);
  });

  test("every result carries a resolvable url and attribution", async () => {
    globalThis.fetch = (async () => feed([job(1, "Engineer")])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toBe("https://remotive.com/remote-jobs/x/1");
    expect(d.results[0].attribution).toMatch(/Remotive/);
    expect(d.meta.attribution).toMatch(/Remotive/);
  });

  test("table and plain output both carry the attribution line", async () => {
    globalThis.fetch = (async () => feed([job(1, "Engineer")])) as typeof fetch;
    let read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "table" });
    expect(read()).toMatch(/Source: Remotive/);
    read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "plain" });
    expect(read()).toMatch(/Source: Remotive/);
  });

  test("--with-description attaches converted description text", async () => {
    globalThis.fetch = (async () => feed([job(1, "Engineer", { description: "<p>Hi &amp; hello</p>" })])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ page: 1, limit: 25, withDescription: true, format: "json" });
    expect(JSON.parse(read()).results[0].description).toBe("Hi & hello");
  });

  test("a response with no jobs array exits 1", async () => {
    globalThis.fetch = (async () => new Response("{}", { headers: { "Content-Type": "application/json" } })) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runSearch({ page: 1, limit: 25, format: "json" })).toBe(1);
  });
});
