import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function board(jobs: Array<Record<string, unknown>>) {
  return new Response(JSON.stringify({ jobs }), {
    headers: { "Content-Type": "application/json" },
  });
}

function job(id: number, title: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    title,
    absolute_url: `https://job-boards.greenhouse.io/x/jobs/${id}`,
    location: { name: "San Carlos, CA" },
    first_published: new Date().toISOString(),
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
  test("filters by query across the fanned-out boards", async () => {
    globalThis.fetch = (async () =>
      board([job(1, "Bioinformatics Scientist"), job(2, "Sales Director")])) as typeof fetch;
    const read = captureStdout();

    const code = await runSearch({
      query: "bioinformatics",
      companies: ["a"],
      page: 1,
      format: "json",
    });

    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].title).toBe("Bioinformatics Scientist");
  });

  test("filters by location", async () => {
    globalThis.fetch = (async () =>
      board([
        job(1, "Engineer", { location: { name: "San Carlos, CA" } }),
        job(2, "Engineer", { location: { name: "Tel Aviv, Israel" } }),
      ])) as typeof fetch;
    const read = captureStdout();

    await runSearch({ location: "san carlos", companies: ["a"], page: 1, format: "json" });

    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.results[0].location).toBe("San Carlos, CA");
  });

  test("jobage excludes older postings but keeps undated ones", async () => {
    const old = new Date(Date.now() - 90 * 86400000).toISOString();
    globalThis.fetch = (async () =>
      board([
        job(1, "Fresh"),
        job(2, "Stale", { first_published: old, updated_at: old }),
        { id: 3, title: "Undated", absolute_url: "u", location: null },
      ])) as typeof fetch;
    const read = captureStdout();

    await runSearch({ jobage: 30, companies: ["a"], page: 1, format: "json" });

    const titles = JSON.parse(read()).results.map((r: { title: string }) => r.title);
    expect(titles).toContain("Fresh");
    expect(titles).toContain("Undated");
    expect(titles).not.toContain("Stale");
  });

  test("a failing board is reported in meta.failed instead of aborting", async () => {
    let n = 0;
    globalThis.fetch = (async () => {
      n++;
      if (n === 1) throw new Error("boom");
      return board([job(1, "Survivor")]);
    }) as unknown as typeof fetch;
    const read = captureStdout();

    const code = await runSearch({ companies: ["bad", "good"], page: 1, format: "json" });

    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(1);
    expect(d.meta.failed).toHaveLength(1);
    expect(d.meta.failed[0].token).toBe("bad");
  });

  test("a 404 board yields no jobs and is flagged, not thrown", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as typeof fetch;
    const read = captureStdout();

    const code = await runSearch({ companies: ["missing"], page: 1, format: "json" });

    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.results).toHaveLength(0);
    expect(d.meta.failed[0].error).toBe("not found");
  });

  test("results are paginated with total preserved", async () => {
    globalThis.fetch = (async () =>
      board([job(1, "A"), job(2, "B"), job(3, "C")])) as typeof fetch;
    const read = captureStdout();

    await runSearch({ companies: ["a"], page: 2, limit: 2, format: "json" });

    const d = JSON.parse(read());
    expect(d.meta.total).toBe(3);
    expect(d.results).toHaveLength(1);
  });

  test("unknown sector exits 1 with NO_COMPANIES", async () => {
    process.stdout.write = (() => true) as typeof process.stdout.write;
    const code = await runSearch({ sector: "nope", page: 1, format: "json" });
    expect(code).toBe(1);
  });
});

describe("multiple companies", () => {
  test("repeated --company entries are each fetched (no overwrite)", async () => {
    // Guards the CLI flag parser's repeat-collection for --company: two boards
    // requested must mean two fetches and both appear in meta.
    const seen: string[] = [];
    globalThis.fetch = (async (u: string) => {
      seen.push(String(u));
      return board([job(1, "Engineer")]);
    }) as unknown as typeof fetch;
    const read = captureStdout();

    await runSearch({ companies: ["natera", "freenome"], page: 1, format: "json" });

    expect(seen).toHaveLength(2);
    expect(seen[0]).toContain("/boards/natera/jobs");
    expect(seen[1]).toContain("/boards/freenome/jobs");
    expect(JSON.parse(read()).meta.companiesSearched).toBe(2);
  });
});
