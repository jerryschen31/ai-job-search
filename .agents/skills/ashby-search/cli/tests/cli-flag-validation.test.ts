import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try { return JSON.parse(stderr); } catch { return {}; }
}

describe("Ashby CLI flag validation", () => {
  for (const flag of ["page", "limit", "jobage"]) {
    test(`--${flag} non-numeric exits 1 with BAD_ARG`, async () => {
      const r = await runCLI(["search", "-c", "insitro", `--${flag}`, "abc"]);
      expect(r.exitCode).not.toBe(0);
      expect(parsedStderr(r.stderr).code).toBe("BAD_ARG");
    });
  }

  test("detail with no arg exits 1 with NO_ID", async () => {
    const r = await runCLI(["detail"]);
    expect(parsedStderr(r.stderr).code).toBe("NO_ID");
  });

  test("detail with bare id and no --company exits 1 with BAD_ID", async () => {
    const r = await runCLI(["detail", "71606d59-a7d1-4246-8fb3-f8c97ba8201b"]);
    expect(parsedStderr(r.stderr).code).toBe("BAD_ID");
  });

  test("unknown sector exits 1 with NO_COMPANIES", async () => {
    const r = await runCLI(["search", "--sector", "zzz"]);
    expect(parsedStderr(r.stderr).code).toBe("NO_COMPANIES");
  });

  test("unknown command exits 1 with BAD_CMD", async () => {
    const r = await runCLI(["bogus"]);
    expect(parsedStderr(r.stderr).code).toBe("BAD_CMD");
  });

  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/ashby-cli/);
  });

  test("companies lists curated boards incl. insitro", async () => {
    const r = await runCLI(["companies", "--format", "json"]);
    expect(r.exitCode).toBe(0);
    expect(JSON.parse(r.stdout).results.some((c: { slug: string }) => c.slug === "insitro")).toBe(true);
  });
});
