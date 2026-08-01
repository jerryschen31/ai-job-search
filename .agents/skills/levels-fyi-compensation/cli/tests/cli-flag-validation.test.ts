import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";
function err(s: string): { code?: string } { try { return JSON.parse(s); } catch { return {}; } }

describe("levels-fyi-compensation CLI", () => {
  test("company with no slug exits 1 with NO_TARGET", async () => {
    expect(err((await runCLI(["company"])).stderr).code).toBe("NO_TARGET");
  });
  test("role with no slug exits 1 with NO_TARGET", async () => {
    expect(err((await runCLI(["role"])).stderr).code).toBe("NO_TARGET");
  });
  test("export with no --company exits 1 with NO_COMPANIES", async () => {
    expect(err((await runCLI(["export"])).stderr).code).toBe("NO_COMPANIES");
  });
  test("unknown command exits 1 with BAD_CMD", async () => {
    expect(err((await runCLI(["bogus"])).stderr).code).toBe("BAD_CMD");
  });
  test("no command prints help and exits 1", async () => {
    const r = await runCLI([]);
    expect(r.exitCode).toBe(1);
    expect(r.stdout).toMatch(/levels-fyi-compensation-cli/);
  });
  test("families lists the taxonomy", async () => {
    const r = await runCLI(["families", "engineer"]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("software-engineer");
  });
});
