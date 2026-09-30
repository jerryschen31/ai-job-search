import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function nextDataPage(results: unknown) {
  const payload = JSON.stringify({ props: { pageProps: { initialJobsData: { results } } } });
  return new Response(`<html><script id="__NEXT_DATA__" type="application/json">${payload}</script></html>`, {
    headers: { "Content-Type": "text/html" },
  });
}
function co(name: string, jobs: Array<Record<string, unknown>>) {
  return { companyName: name, companySlug: name.toLowerCase(), jobs };
}
function job(id: string, title: string, extra: Record<string, unknown> = {}) {
  return {
    id, title,
    locations: ["San Jose, California"],
    postingDate: new Date().toISOString(),
    minTotalSalary: 200000, maxTotalSalary: 250000, baseSalaryCurrency: "USD",
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
  test("rejects an unknown job family before making any request", async () => {
    let called = false;
    globalThis.fetch = (async () => { called = true; return nextDataPage([]); }) as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    const code = await runSearch({ family: "bioinformatics", page: 1, limit: 25, format: "json" });
    expect(code).toBe(1);
    expect(called).toBe(false);
  });

  test("requests the family PATH", async () => {
    let url = "";
    globalThis.fetch = (async (u: string) => { url = String(u); return nextDataPage([co("Acme", [job("1", "Engineer")])]); }) as unknown as typeof fetch;
    process.stdout.write = (() => true) as typeof process.stdout.write;
    await runSearch({ family: "software-engineer", page: 1, limit: 25, format: "json" });
    expect(url).toBe("https://www.levels.fyi/jobs/title/software-engineer");
  });

  test("flattens companies and attaches salary + verifiable url", async () => {
    globalThis.fetch = (async () => nextDataPage([co("Acme", [job("1", "Engineer")])])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results[0].url).toBe("https://www.levels.fyi/jobs?jobId=1");
    expect(d.results[0].totalSalary).toBe("200K-250K");
    expect(d.results[0].company).toBe("Acme");
  });

  test("filters locally by query and location", async () => {
    globalThis.fetch = (async () => nextDataPage([
      co("Acme", [job("1", "Data Engineer"), job("2", "Recruiter")]),
      co("Beta", [job("3", "Data Engineer", { locations: ["Austin, Texas"] })]),
    ])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "data", location: "california", page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].id).toBe("1");
  });

  test("reports fetched vs matched so empty results are explicable", async () => {
    globalThis.fetch = (async () => nextDataPage([co("Acme", [job("1", "Engineer")])])) as typeof fetch;
    const read = captureStdout();
    await runSearch({ query: "nomatch", page: 1, limit: 25, format: "json" });
    const d = JSON.parse(read());
    expect(d.meta.fetched).toBe(1);
    expect(d.meta.matched).toBe(0);
  });

  test("table and plain output carry the attribution line", async () => {
    globalThis.fetch = (async () => nextDataPage([co("Acme", [job("1", "Engineer")])])) as typeof fetch;
    let read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "table" });
    expect(read()).toMatch(/Levels\.fyi/);
    read = captureStdout();
    await runSearch({ page: 1, limit: 25, format: "plain" });
    expect(read()).toMatch(/Levels\.fyi/);
  });

  test("a page with no __NEXT_DATA__ surfaces a rate-limit hint", async () => {
    globalThis.fetch = (async () => new Response("<html></html>", { headers: { "Content-Type": "text/html" } })) as typeof fetch;
    let err = "";
    const origErr = process.stderr.write;
    process.stderr.write = ((c: string | Uint8Array) => { err += c.toString(); return true; }) as typeof process.stderr.write;
    const code = await runSearch({ page: 1, limit: 25, format: "json" });
    process.stderr.write = origErr;
    expect(code).toBe(1);
    expect(err).toMatch(/rate limit/i);
  }, 60000);
});
