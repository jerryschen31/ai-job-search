import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";
function err(s: string): { code?: string } { try { return JSON.parse(s); } catch { return {}; } }

describe("Levels.fyi CLI flag validation", () => {
  for (const f of ["page", "limit", "jobage"]) {
    test(`--${f} non-numeric exits 1 with BAD_ARG`, async () => {
      const r = await runCLI(["search", "-f", "software-engineer", `--${f}`, "abc"]);
      expect(r.exitCode).not.toBe(0);
      expect(err(r.stderr).code).toBe("BAD_ARG");
    });
  }
  test("unknown family exits 1 with BAD_FAMILY", async () => {
    const r = await runCLI(["search", "-f", "bioinformatics"]);
    expect(err(r.stderr).code).toBe("BAD_FAMILY");
  });
  test("detail with no id exits 1 with NO_ID", async () => {
    expect(err((await runCLI(["detail"])).stderr).code).toBe("NO_ID");
  });
  test("detail with a bad id exits 1 with BAD_ID", async () => {
    expect(err((await runCLI(["detail", "nope"])).stderr).code).toBe("BAD_ID");
  });
  test("unknown command exits 1 with BAD_CMD", async () => {
    expect(err((await runCLI(["bogus"])).stderr).code).toBe("BAD_CMD");
  });
  test("families lists the taxonomy and supports a filter", async () => {
    const all = await runCLI(["families", "--format", "json"]);
    expect(JSON.parse(all.stdout).meta.count).toBeGreaterThan(50);
    const filtered = await runCLI(["families", "engineer", "--format", "json"]);
    const d = JSON.parse(filtered.stdout);
    expect(d.results.every((f: string) => f.includes("engineer"))).toBe(true);
  });
  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/levels-fyi-cli/);
  });
});
