import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";
function err(s: string): { code?: string } { try { return JSON.parse(s); } catch { return {}; } }

describe("Muse CLI flag validation", () => {
  for (const f of ["page", "limit", "jobage", "pages"]) {
    test(`--${f} non-numeric exits 1 with BAD_ARG`, async () => {
      const r = await runCLI(["search", `--${f}`, "abc"]);
      expect(r.exitCode).not.toBe(0);
      expect(err(r.stderr).code).toBe("BAD_ARG");
    });
  }
  test("unknown command exits 1 with BAD_CMD", async () => {
    expect(err((await runCLI(["bogus"])).stderr).code).toBe("BAD_CMD");
  });
  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/muse-cli/);
  });
});
