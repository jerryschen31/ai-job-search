import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function board(jobs: Array<Record<string, unknown>>) {
  return new Response(JSON.stringify({ jobs }), {
    headers: { "Content-Type": "application/json" },
  });
}

function job(id: string, title: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    title,
    jobUrl: `https://jobs.ashbyhq.com/x/${id}`,
    location: "South San Francisco, CA",
    publishedAt: new Date().toISOString(),
    ...extra,
  };
}

function captureStdout(): () => string {
  let out = "";
  process.stdout.write = ((chunk: string | Uint8Array) => {
    out += chunk.toString();
    return true;
  }) as typeof process.stdout.write;
  return () => out;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
});

describe("runSearch", () => {
  test("filters by query", async () => {
    globalThis.fetch = (async () =>
      board([job("a", "ML Scientist"), job("b", "Office Manager")])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "scientist", companies: ["x"], page: 1, format: "json" });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].title).toBe("ML Scientist");
  });

  test("every result carries a resolvable posting url", async () => {
    globalThis.fetch = (async () => board([job("a", "Engineer")])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ companies: ["x"], page: 1, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toBe("https://jobs.ashbyhq.com/x/a");
    expect(d.results.every((r: { url: string }) => typeof r.url === "string" && r.url.length > 0)).toBe(true);
  });

  test("unlisted postings (isListed false) are excluded", async () => {
    globalThis.fetch = (async () =>
      board([job("a", "Public"), job("b", "Hidden", { isListed: false })])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ companies: ["x"], page: 1, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Public"]);
  });

  test("--remote keeps only remote-flagged postings", async () => {
    globalThis.fetch = (async () =>
      board([job("a", "Remote Role", { isRemote: true }), job("b", "Onsite Role", { isRemote: false })])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ remote: true, companies: ["x"], page: 1, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toEqual(["Remote Role"]);
  });

  test("a failing board is reported, not fatal", async () => {
    let n = 0;
    globalThis.fetch = (async () => {
      n++;
      if (n === 1) throw new Error("boom");
      return board([job("a", "Survivor")]);
    }) as unknown as typeof fetch;
    const read = captureStdout();
    const code = await runSearch({ companies: ["bad", "good"], page: 1, format: "json" });
    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.meta.failed[0].slug).toBe("bad");
  });

  test("jobage filters old postings but keeps undated", async () => {
    const old = new Date(Date.now() - 200 * 86400000).toISOString();
    globalThis.fetch = (async () =>
      board([
        job("a", "Fresh"),
        job("b", "Stale", { publishedAt: old }),
        { id: "c", title: "Undated", jobUrl: "u" },
      ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ jobage: 30, companies: ["x"], page: 1, format: "json" });
    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toContain("Fresh");
    expect(titles).toContain("Undated");
    expect(titles).not.toContain("Stale");
  });

  test("unknown sector exits 1", async () => {
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runSearch({ sector: "zzz", page: 1, format: "json" })).toBe(1);
  });
});
