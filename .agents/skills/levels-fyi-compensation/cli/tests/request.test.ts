import { afterEach, describe, expect, test } from "bun:test";
import { fetchMarkdown } from "../src/helpers";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

describe("fetchMarkdown", () => {
  test("passes an AbortSignal timeout", async () => {
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_u: string, i?: RequestInit) => { init = i; return new Response("# doc", { status: 200 }); }) as unknown as typeof fetch;
    await fetchMarkdown("https://www.levels.fyi/t/x.md");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  test("a 404 names the slug problem", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as typeof fetch;
    await expect(fetchMarkdown("https://www.levels.fyi/t/x.md")).rejects.toThrow(/slug/i);
  });

  test("an empty 200 body is reported as rate limiting, not 'empty document'", async () => {
    globalThis.fetch = (async () => new Response("", { status: 200 })) as typeof fetch;
    await expect(fetchMarkdown("https://www.levels.fyi/t/x.md")).rejects.toThrow(/rate limit/i);
  }, 90000);
});
