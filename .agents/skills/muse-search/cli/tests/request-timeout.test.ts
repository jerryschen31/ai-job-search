import { afterEach, describe, expect, test } from "bun:test";
import { jsonFetch } from "../src/helpers";

// A stalled upstream connection (accepted socket, no response) would otherwise
// hang the CLI forever - fetch has no default timeout. Assert the request
// wrapper carries an AbortSignal timeout.
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("jsonFetch", () => {
  test("passes an AbortSignal timeout to fetch", async () => {
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_url: string | URL | Request, i?: RequestInit) => {
      init = i;
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;

    await jsonFetch("https://www.themuse.com/api/public/jobs");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  test("returns null on 404 rather than throwing", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as typeof fetch;
    expect(await jsonFetch("https://www.themuse.com/api/public/jobs")).toBeNull();
  });

  test("throws on a non-retryable error status", async () => {
    globalThis.fetch = (async () => new Response("", { status: 403 })) as typeof fetch;
    await expect(jsonFetch("https://www.themuse.com/api/public/jobs")).rejects.toThrow();
  });
});
