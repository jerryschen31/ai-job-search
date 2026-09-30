import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

function parsedStderr(s: string): { error?: string; code?: string } {
  try { return JSON.parse(s); } catch { return {}; }
}

describe("Workday CLI flag validation", () => {
  for (const flag of ["page", "limit", "jobage"]) {
    test(`--${flag} non-numeric exits 1 with BAD_ARG`, async () => {
      const r = await runCLI(["search", "-e", "roche", `--${flag}`, "abc"]);
      expect(r.exitCode).not.toBe(0);
      expect(parsedStderr(r.stderr).code).toBe("BAD_ARG");
    });
  }

  test("partial ad-hoc employer flags exit 1 with BAD_ARG", async () => {
    const r = await runCLI(["search", "--tenant", "acme", "--wd", "wd5"]);
    expect(r.exitCode).not.toBe(0);
    expect(parsedStderr(r.stderr).code).toBe("BAD_ARG");
  });

  test("detail with no url exits 1 with NO_URL", async () => {
    expect(parsedStderr((await runCLI(["detail"])).stderr).code).toBe("NO_URL");
  });

  test("detail with a non-Workday url exits 1 with BAD_URL", async () => {
    expect(parsedStderr((await runCLI(["detail", "https://example.com/x"])).stderr).code).toBe("BAD_URL");
  });

  test("unknown sector exits 1 with NO_EMPLOYERS", async () => {
    expect(parsedStderr((await runCLI(["search", "--sector", "zzz"])).stderr).code).toBe("NO_EMPLOYERS");
  });

  test("unknown command exits 1 with BAD_CMD", async () => {
    expect(parsedStderr((await runCLI(["bogus"])).stderr).code).toBe("BAD_CMD");
  });

  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/workday-cli/);
  });

  test("employers lists curated sites incl. roche", async () => {
    const r = await runCLI(["employers", "--format", "json"]);
    expect(r.exitCode).toBe(0);
    const d = JSON.parse(r.stdout);
    expect(d.results.some((e: { key: string }) => e.key === "roche")).toBe(true);
    expect(d.results[0].careerSite).toMatch(/myworkdayjobs\.com/);
  });
});
