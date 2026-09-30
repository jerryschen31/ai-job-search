import { afterEach, describe, expect, test } from "bun:test";
import { runSearch } from "../src/commands/search";

const originalFetch = globalThis.fetch;
const originalStdoutWrite = process.stdout.write;

function searchCard(id: string, title: string): string {
  return `<div id="job-card-${id}" data-id="job-card">
    <div class="left-side-tile-item-2"><a href="/company/acme" target="_blank" data-id="company-title"><span>Acme</span></a></div>
    <div class="left-side-tile-item-3"><h2><a href="/job/role/${id}" target="_blank" data-id="job-card-title" data-alias="/job/role/${id}">${title}</a></h2></div>
  </div>`;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.stdout.write = originalStdoutWrite;
});

describe("runSearch", () => {
  test("--limit 0 emits zero results", async () => {
    globalThis.fetch = (async () => new Response(searchCard("123456", "Engineer"))) as typeof fetch;

    let stdout = "";
    process.stdout.write = ((chunk: string | Uint8Array) => {
      stdout += chunk.toString();
      return true;
    }) as typeof process.stdout.write;

    const code = await runSearch({ page: 1, limit: 0, format: "json" });

    expect(code).toBe(0);
    expect(JSON.parse(stdout).results).toHaveLength(0);
  });

  test("remote flag requests the /jobs/remote path and omits city/state params", async () => {
    let requestedUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      requestedUrl = url.toString();
      return new Response(searchCard("111", "Remote Engineer"));
    }) as unknown as typeof fetch;

    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ query: "engineer", city: "San Jose", remote: true, page: 1, format: "json" });

    expect(requestedUrl).toContain("/jobs/remote?");
    expect(requestedUrl).not.toContain("city=");
  });

  test("non-remote search includes city/state/country/searcharea params", async () => {
    let requestedUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      requestedUrl = url.toString();
      return new Response(searchCard("222", "Engineer"));
    }) as unknown as typeof fetch;

    process.stdout.write = (() => true) as typeof process.stdout.write;

    await runSearch({ query: "engineer", city: "San Jose", state: "California", page: 1, format: "json" });

    expect(requestedUrl).toContain("city=San+Jose");
    expect(requestedUrl).toContain("state=California");
    expect(requestedUrl).toContain("country=USA");
    expect(requestedUrl).toContain("searcharea=25mi");
  });
});
