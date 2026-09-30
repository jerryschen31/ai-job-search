import { afterEach, describe, expect, test } from "bun:test";
import { postJson, getJson } from "../src/helpers";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

describe("request wrappers", () => {
  test("postJson passes an AbortSignal timeout", async () => {
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_u: string, i?: RequestInit) => { init = i; return new Response("{}", { status: 200 }); }) as unknown as typeof fetch;
    await postJson("https://x.wd3.myworkdayjobs.com/wday/cxs/x/y/jobs", {});
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  test("getJson returns null on 404", async () => {
    globalThis.fetch = (async () => new Response("", { status: 404 })) as typeof fetch;
    expect(await getJson("https://x.wd3.myworkdayjobs.com/a")).toBeNull();
  });

  test("throws on a non-retryable error status", async () => {
    globalThis.fetch = (async () => new Response("", { status: 403 })) as typeof fetch;
    await expect(getJson("https://x.wd3.myworkdayjobs.com/a")).rejects.toThrow();
  });
});
