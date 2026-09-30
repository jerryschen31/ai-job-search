import { afterEach, describe, expect, test } from "bun:test";
import { runExport } from "../src/commands/export";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

const DOC = `# Levels.fyi – Roche Software Engineer Salaries

**URL:** https://www.levels.fyi/companies/roche/salaries/software-engineer  
**Location:** United States  

## Aggregate Highlights
- Median Total Compensation: $203,000  

### Levels Breakdown
| Level | Median Total Compensation |
| --- | --- |
| Senior Software Engineer | $203,864 |
`;

function captureStdout(): () => string {
  let out = "";
  process.stdout.write = ((c: string | Uint8Array) => { out += c.toString(); return true; }) as typeof process.stdout.write;
  return () => out;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
});

describe("runExport", () => {
  test("emits the salary_data.json shape the repo's salary tool expects", async () => {
    globalThis.fetch = (async () => new Response(DOC, { status: 200 })) as typeof fetch;
    const read = captureStdout();
    const code = await runExport({ companies: ["roche"], role: "software-engineer" });
    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.metadata.source).toBe("Levels.fyi");
    expect(d.metadata.attribution).toMatch(/Levels\.fyi/);
    expect(Array.isArray(d.companies)).toBe(true);
    const c = d.companies[0];
    expect(c.company).toBe("Roche");
    expect(c.categories["Senior Software Engineer"].index).toBe(203864);
  });

  test("uses the plain company name, not the document headline", async () => {
    globalThis.fetch = (async () => new Response(DOC, { status: 200 })) as typeof fetch;
    const read = captureStdout();
    await runExport({ companies: ["bristol-myers-squibb"] });
    expect(JSON.parse(read()).companies[0].company).toBe("Bristol Myers Squibb");
  });

  test("a failed company is recorded without aborting the run", async () => {
    let n = 0;
    globalThis.fetch = (async () => {
      n++;
      if (n === 1) return new Response("", { status: 404 });
      return new Response(DOC, { status: 200 });
    }) as typeof fetch;
    const read = captureStdout();
    const code = await runExport({ companies: ["missing", "roche"] });
    expect(code).toBe(0);
    const d = JSON.parse(read());
    expect(d.companies).toHaveLength(1);
    expect(d._failed[0].company).toBe("missing");
  }, 30000);

  test("no companies exits 1", async () => {
    process.stdout.write = (() => true) as typeof process.stdout.write;
    expect(await runExport({ companies: [] })).toBe(1);
  });
});
