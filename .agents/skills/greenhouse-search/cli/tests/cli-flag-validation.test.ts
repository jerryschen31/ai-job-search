import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try {
    return JSON.parse(stderr);
  } catch {
    return {};
  }
}

describe("Greenhouse CLI flag validation", () => {
  for (const flag of ["page", "limit", "jobage"]) {
    test(`--${flag} non-numeric exits 1 with BAD_ARG`, async () => {
      const result = await runCLI(["search", "-c", "natera", `--${flag}`, "abc"]);
      expect(result.exitCode).not.toBe(0);
      const err = parsedStderr(result.stderr);
      expect(err.code).toBe("BAD_ARG");
      expect(err.error).toMatch(new RegExp(flag));
    });
  }

  test("detail with no argument exits 1 with NO_ID", async () => {
    const result = await runCLI(["detail"]);
    expect(result.exitCode).not.toBe(0);
    expect(parsedStderr(result.stderr).code).toBe("NO_ID");
  });

  test("detail with a bare id and no --company exits 1 with BAD_ID", async () => {
    const result = await runCLI(["detail", "12345"]);
    expect(result.exitCode).not.toBe(0);
    expect(parsedStderr(result.stderr).code).toBe("BAD_ID");
  });

  test("unknown sector exits 1 with NO_COMPANIES", async () => {
    const result = await runCLI(["search", "--sector", "nope"]);
    expect(result.exitCode).not.toBe(0);
    expect(parsedStderr(result.stderr).code).toBe("NO_COMPANIES");
  });

  test("unknown command exits 1 with BAD_CMD", async () => {
    const result = await runCLI(["bogus"]);
    expect(result.exitCode).not.toBe(0);
    expect(parsedStderr(result.stderr).code).toBe("BAD_CMD");
  });

  test("no command prints help and exits 1", async () => {
    const result = await runCLI([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toMatch(/greenhouse-cli/);
  });

  test("companies command lists the curated boards", async () => {
    const result = await runCLI(["companies", "--format", "json"]);
    expect(result.exitCode).toBe(0);
    const d = JSON.parse(result.stdout);
    expect(d.meta.count).toBeGreaterThan(0);
    expect(d.results.some((c: { token: string }) => c.token === "natera")).toBe(true);
  });

});
