import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("sample resolves four files and exposes the shadowed rule", { tag: "@claim:demo-resolves" }, async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByLabel("Report summary")).toContainText("4sources9effective1shadowed");
  await expect(page.locator("tr.shadowed")).toHaveCount(1);
  await expect(page.locator("tr.shadowed")).toContainText("Bash(git status:*)");
});

test("CLI emits table, JSON, and Markdown reports", { tag: "@claim:report-formats" }, () => {
  const run = (...args: string[]) => execFileSync("cargo", ["run", "--quiet", "--", "inspect", "examples/sample-repo", "--no-global", ...args], { encoding: "utf8" });
  expect(run()).toContain("VENDOR");
  expect(JSON.parse(run("--format", "json")).counts.shadowed).toBe(1);
  expect(run("--format", "markdown")).toContain("# Permit Map report");
});

test("CLI limits automatic discovery to documented policy paths", { tag: "@claim:policy-files" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-claim-"));
  try {
    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), '{"permissions":{"allow":["Read(src/**)"]}}');
    writeFileSync(join(root, ".env"), "DECOY_SECRET=never-report-this");
    writeFileSync(join(root, "other-policy.json"), '{"permissions":{"deny":["Bash(*)"]}}');
    const output = execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--format", "json"], { encoding: "utf8" });
    const report = JSON.parse(output);
    expect(report.counts.sources).toBe(1);
    expect(output).toContain("Read(src/**)");
    expect(output).not.toContain("DECOY_SECRET");
    expect(output).not.toContain("Bash(*)");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("demo opens from a clean browser without an account", { tag: "@claim:no-account" }, async ({ page, context }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Review the resolved permission map");
  await expect(page.locator("form")).toHaveCount(0);
  expect(await context.cookies()).toEqual([]);
});

test("repository ships under the MIT license", { tag: "@claim:mit-license" }, () => {
  const license = readFileSync("LICENSE", "utf8");
  const cargo = readFileSync("Cargo.toml", "utf8");
  expect(license).toContain("Permission is hereby granted, free of charge");
  expect(cargo).toContain('license = "MIT"');
});

test("browser demo makes no cross-origin requests or stored data", { tag: "@claim:browser-privacy" }, async ({ page, context }) => {
  const origins = new Set<string>();
  page.on("request", request => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("CLI source has no network or telemetry client", { tag: "@claim:cli-local" }, () => {
  const cargo = readFileSync("Cargo.toml", "utf8");
  const source = `${readFileSync("src/lib.rs", "utf8")}\n${readFileSync("src/main.rs", "utf8")}`;
  expect(cargo).not.toMatch(/reqwest|hyper|ureq|telemetry|analytics/);
  expect(source).not.toMatch(/TcpStream|UdpSocket|https?:\/\/|telemetry|analytics/);
});
