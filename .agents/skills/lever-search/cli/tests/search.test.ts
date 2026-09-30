import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function board(jobs: Array<Record<string, unknown>>) {
  return new Response(JSON.stringify(jobs), { headers: { "Content-Type": "application/json" } });
}
function job(id: string, text: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    text,
    hostedUrl: `https://jobs.lever.co/x/${id}`,
    createdAt: Date.now(),
    categories: { location: "Foster City, CA", department: "Software" },
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
  test("filters by query on the title", async () => {
    globalThis.fetch = (async () =>
      board([
        job("a", "Software Engineer"),
        job("b", "Recruiter", { categories: { location: "Foster City, CA", department: "People" } }),
      ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "software", companies: ["x"], page: 1, format: "json" });
    const results = JSON.parse(read()).results;
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Software Engineer");
  });

  test("query also matches on department, not just title", async () => {
    // Intentional: a "Recruiter" in the Software department is a software-org
    // role, so department is part of the searchable haystack.
    globalThis.fetch = (async () =>
      board([
        job("a", "Recruiter", { categories: { location: "X", department: "Software" } }),
        job("b", "Recruiter", { categories: { location: "X", department: "People" } }),
      ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "software", companies: ["x"], page: 1, format: "json" });
    const results = JSON.parse(read()).results;
    expect(results).toHaveLength(1);
    expect(results[0].department).toBe("Software");
  });

  test("every result carries a resolvable posting url", async () => {
    globalThis.fetch = (async () => board([job("a", "Engineer")])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ companies: ["x"], page: 1, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toBe("https://jobs.lever.co/x/a");
    expect(d.results.every((r: { url: string }) => !!r.url)).toBe(true);
  });

  test("a non-array response is treated as a missing board, not a crash", async () => {
    globalThis.fetch = (async () => new Response(JSON.stringify({ ok: false }), { headers: { "Content-Type": "application/json" } })) as typeof fetch;
    const read = captureStdout();
    const code = await runSearch({ companies: ["nope"], page: 1, format: "json" });
    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(0);
    expect(d.meta.failed[0].error).toBe("not found");
  });

  test("a failing board is reported, not fatal", async () => {
    let n = 0;
    globalThis.fetch = (async () => { n++; if (n === 1) throw new Error("boom"); return board([job("a", "Survivor")]); }) as unknown as typeof fetch;
    const read = captureStdout();
    expect(await runSearch({ companies: ["bad", "good"], page: 1, format: "json" })).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.meta.failed[0].slug).toBe("bad");
  });

  test("jobage filters old postings", async () => {
    globalThis.fetch = (async () => board([
      job("a", "Fresh"),
      job("b", "Stale", { createdAt: Date.now() - 200 * 86400000 }),
    ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ jobage: 30, companies: ["x"], page: 1, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Fresh"]);
  });

  test("unknown sector exits 1", async () => {
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runSearch({ sector: "zzz", page: 1, format: "json" })).toBe(1);
  });
});
