import { expect, test } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

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
    mkdirSync(join(root, ".codex"));
    writeFileSync(join(root, ".codex", "config.local.toml"), 'sandbox_mode = "danger-full-access"');
    const output = execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--format", "json"], { encoding: "utf8" });
    const report = JSON.parse(output);
    expect(report.counts.sources).toBe(1);
    expect(output).toContain("Read(src/**)");
    expect(output).not.toContain("DECOY_SECRET");
    expect(output).not.toContain("Bash(*)");
    expect(output).not.toContain("danger-full-access");
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

test("CLI does not launch agents and has no network or telemetry client", { tag: "@claim:cli-local" }, () => {
  const cargo = readFileSync("Cargo.toml", "utf8");
  const source = `${readFileSync("src/lib.rs", "utf8")}\n${readFileSync("src/main.rs", "utf8")}`;
  expect(cargo).not.toMatch(/reqwest|hyper|ureq|telemetry|analytics/);
  expect(source).not.toMatch(/TcpStream|UdpSocket|https?:\/\/|telemetry|analytics|Command::new/);
});

test("demo changes nothing in the caller directory", { tag: "@claim:demo-isolated" }, () => {
  const caller = mkdtempSync(join(tmpdir(), "permit-map-caller-"));
  try {
    writeFileSync(join(caller, "keep.txt"), "unchanged");
    const binary = resolve(process.cwd(), process.platform === "win32" ? "target/debug/permit-map.exe" : "target/debug/permit-map");
    const result = spawnSync(binary, ["demo", "--json"], { cwd: caller, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(readFileSync(join(caller, "keep.txt"), "utf8")).toBe("unchanged");
  } finally {
    rmSync(caller, { recursive: true, force: true });
  }
});

test("Claude resolves deny before allow across scopes", { tag: "@claim:resolution-order" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-order-"));
  try {
    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), '{"permissions":{"deny":["Bash(git status:*)","Read(src/**)"]}}');
    writeFileSync(join(root, ".claude", "settings.local.json"), '{"permissions":{"allow":["Bash(git status:*)"],"ask":["Read(src/**)"]}}');
    const output = execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--format", "json"], { encoding: "utf8" });
    const report = JSON.parse(output);
    const gitRules = report.rules.filter((rule: { target: string }) => rule.target === "Bash(git status:*)");
    const readRules = report.rules.filter((rule: { target: string }) => rule.target === "Read(src/**)");
    expect(gitRules.find((rule: { status: string }) => rule.status === "effective")).toMatchObject({ layer: "repo", effect: "deny" });
    expect(readRules.find((rule: { status: string }) => rule.status === "effective")).toMatchObject({ layer: "repo", effect: "deny" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Codex project policy is unresolved without trust and layered when trusted", { tag: "@claim:codex-context" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-codex-"));
  try {
    mkdirSync(join(root, ".git"));
    mkdirSync(join(root, ".codex"));
    mkdirSync(join(root, "services/api/.codex"), { recursive: true });
    writeFileSync(join(root, ".codex", "config.toml"), 'sandbox_mode = "workspace-write"');
    writeFileSync(join(root, "services/api/.codex", "config.toml"), 'sandbox_mode = "read-only"');
    const run = (...args: string[]) => JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "inspect", join(root, "services/api"), "--no-global", "--format", "json", ...args], { encoding: "utf8" }));
    const unresolved = run();
    expect(unresolved.counts.unresolved).toBe(2);
    expect(unresolved.rules.every((rule: { status: string }) => rule.status === "unresolved")).toBeTruthy();
    const trusted = run("--codex-trust", "trusted");
    expect(trusted.rules.find((rule: { status: string }) => rule.status === "effective")).toMatchObject({ layer: "project", target: "sandbox:read-only" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("report output cannot replace a discovered vendor policy", { tag: "@claim:vendor-policy-safe" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-output-"));
  try {
    mkdirSync(join(root, ".claude"));
    const policy = join(root, ".claude", "settings.json");
    const original = '{"permissions":{"deny":["Bash(git push:*)"]}}';
    writeFileSync(policy, original);
    expect(() => execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--output", policy])).toThrow();
    expect(readFileSync(policy, "utf8")).toBe(original);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("bad paths and malformed supported policies exit with code 2", { tag: "@claim:cli-errors" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-errors-"));
  try {
    expect(spawnSync("cargo", ["run", "--quiet", "--", "inspect", join(root, "missing"), "--no-global"]).status).toBe(2);
    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), "not json");
    expect(spawnSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global"]).status).toBe(2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("all visible home links meet the 44px touch-target baseline", { tag: "@claim:touch-targets" }, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const undersized = await page.locator("a:visible").evaluateAll(links => links
    .map(link => ({ label: (link.textContent ?? "").trim(), height: link.getBoundingClientRect().height }))
    .filter(link => link.height < 44));
  expect(undersized).toEqual([]);
});

test("different vendors remain separate and overlapping patterns remain visible", { tag: "@claim:vendor-boundaries" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-vendors-"));
  try {
    mkdirSync(join(root, ".claude"));
    mkdirSync(join(root, ".codex/rules"), { recursive: true });
    writeFileSync(join(root, ".claude", "settings.json"), '{"permissions":{"deny":["Bash(git:*)","Bash(git push:*)"]}}');
    writeFileSync(join(root, ".codex/rules", "git.rules"), 'prefix_rule(pattern = ["git"], decision = "allow")');
    const report = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--codex-trust", "trusted", "--format", "json"], { encoding: "utf8" }));
    expect(report.rules.filter((rule: { vendor: string; status: string }) => rule.vendor === "claude" && rule.status === "effective")).toHaveLength(2);
    expect(report.rules.find((rule: { vendor: string; target: string }) => rule.vendor === "codex" && rule.target === "command:git")).toMatchObject({ status: "effective" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
