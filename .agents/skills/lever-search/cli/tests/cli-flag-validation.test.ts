import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try { return JSON.parse(stderr); } catch { return {}; }
}

describe("Lever CLI flag validation", () => {
  for (const flag of ["page", "limit", "jobage"]) {
    test(`--${flag} non-numeric exits 1 with BAD_ARG`, async () => {
      const r = await runCLI(["search", "-c", "zoox", `--${flag}`, "abc"]);
      expect(r.exitCode).not.toBe(0);
      expect(parsedStderr(r.stderr).code).toBe("BAD_ARG");
    });
  }

  test("detail with no arg exits 1 with NO_ID", async () => {
    expect(parsedStderr((await runCLI(["detail"])).stderr).code).toBe("NO_ID");
  });

  test("detail with bare id and no --company exits 1 with BAD_ID", async () => {
    const r = await runCLI(["detail", "2ef807a0-f80d-47ba-a1a1-578ebe195592"]);
    expect(parsedStderr(r.stderr).code).toBe("BAD_ID");
  });

  test("unknown sector exits 1 with NO_COMPANIES", async () => {
    expect(parsedStderr((await runCLI(["search", "--sector", "zzz"])).stderr).code).toBe("NO_COMPANIES");
  });

  test("unknown command exits 1 with BAD_CMD", async () => {
    expect(parsedStderr((await runCLI(["bogus"])).stderr).code).toBe("BAD_CMD");
  });

  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/lever-cli/);
  });

  test("companies lists curated boards", async () => {
    const r = await runCLI(["companies", "--format", "json"]);
    expect(JSON.parse(r.stdout).results.some((c: { slug: string }) => c.slug === "zoox")).toBe(true);
  });
});
