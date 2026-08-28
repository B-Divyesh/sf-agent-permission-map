import { expect, test } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, copyFileSync, linkSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

test("sample browser summary matches the bundled CLI report", { tag: "@claim:demo-resolves" }, async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByLabel("Report summary")).toContainText("4sources9effective1shadowed");
  const cli = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "demo", "--format", "json"], { encoding: "utf8" }));
  expect(cli.counts).toMatchObject({ sources: 4, effective: 9, shadowed: 1 });
  await expect(page.locator("#full-rule-table tbody tr")).toHaveCount(10);
  await expect(page.locator("#full-rule-table tr.shadowed")).toHaveCount(1);
});

test("landing action opens the isolated sample with real rows in the phone viewport", { tag: "@claim:demo-entry" }, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByLabel("Report summary")).toContainText("4sources9effective1shadowed");
  const rows = page.locator(".first-screen-table tbody tr");
  await expect(rows).toHaveCount(3);
  const expectedRows = [
    ["deny", "Bash(git status:*)", "settings.local.json"],
    ["allow", "Bash(npm test:*)", "settings.json"],
    ["deny", "Read(.env*)", "settings.local.json"],
  ];
  for (let index = 0; index < 3; index += 1) {
    const row = rows.nth(index);
    await expect(row.locator(".decision")).toBeVisible();
    await expect(row.locator("td")).toHaveText(expectedRows[index]);
    const box = await row.boundingBox();
    expect((box?.y ?? 844) + (box?.height ?? 0), `sample row ${index + 1} should be above the fold`).toBeLessThanOrEqual(844);
  }
  const clippedCells = await page.locator(".first-screen-table td code").evaluateAll(cells => cells
    .filter(cell => cell.scrollWidth > cell.clientWidth)
    .map(cell => cell.textContent));
  expect(clippedCells, "phone preview values should not be visually clipped").toEqual([]);
});

test("every browser rule exposes the CLI decision, status, matcher, and source", { tag: "@claim:demo-rule-provenance" }, async ({ page }) => {
  await page.goto("/?demo=1");
  const cli = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "demo", "--format", "json"], { encoding: "utf8" }));
  const browserRows = await page.locator("#full-rule-table tbody tr").evaluateAll(rows => rows.map(row => {
    const cells = [...row.querySelectorAll("td")].map(cell => cell.textContent?.trim() ?? "");
    return { vendor: cells[0], layer: cells[1], effect: cells[2], status: cells[3], target: cells[4], source: cells[5] };
  }));
  expect(browserRows).toEqual(cli.rules.map((rule: { vendor: string; layer: string; effect: string; status: string; target: string; source: string }) => ({
    vendor: rule.vendor, layer: rule.layer, effect: rule.effect, status: rule.status, target: rule.target, source: rule.source,
  })));
});

test("CLI emits table, JSON, and Markdown reports", { tag: "@claim:report-formats" }, () => {
  const run = (...args: string[]) => execFileSync("cargo", ["run", "--quiet", "--", "inspect", "examples/sample-repo", "--no-global", ...args], { encoding: "utf8" });
  expect(run()).toContain("VENDOR");
  expect(JSON.parse(run("--format", "json")).counts.shadowed).toBe(1);
  expect(run("--format", "markdown")).toContain("# Permit Map report");
});

test("successful inspections exit with status 0", { tag: "@claim:success-exit" }, () => {
  const result = spawnSync("cargo", ["run", "--quiet", "--", "inspect", "examples/sample-repo", "--no-global", "--format", "json"], { encoding: "utf8" });
  expect(result.status).toBe(0);
  const report = JSON.parse(result.stdout);
  expect(report.counts.sources).toBe(4);
  expect(report.rules.length).toBeGreaterThan(0);
});

test("CLI opens only documented policy paths", { tag: "@claim:policy-files" }, () => {
  expect(process.platform, "the syscall-level policy access proof runs on the Linux release target").toBe("linux");
  const root = mkdtempSync(join(tmpdir(), "permit-map-claim-"));
  try {
    mkdirSync(join(root, ".claude"));
    const knownPolicy = join(root, ".claude", "settings.json");
    const environmentDecoy = join(root, ".env");
    const unrelatedJson = join(root, "other-policy.json");
    const sourceDecoy = join(root, "src", "credential.ts");
    const credentialDecoy = join(root, ".aws", "credentials");
    writeFileSync(knownPolicy, '{"permissions":{"allow":["Read(src/**)"]}}');
    writeFileSync(environmentDecoy, "DECOY_SECRET=never-report-this");
    writeFileSync(unrelatedJson, '{"permissions":{"deny":["Bash(*)"]}}');
    mkdirSync(join(root, "src"));
    mkdirSync(join(root, ".aws"));
    writeFileSync(sourceDecoy, "export const token = 'never-open-source-decoy';");
    writeFileSync(credentialDecoy, "[default]\naws_secret_access_key = never-open-credential-decoy\n");
    mkdirSync(join(root, ".codex"));
    const undocumentedCodex = join(root, ".codex", "config.local.toml");
    writeFileSync(undocumentedCodex, 'sandbox_mode = "danger-full-access"');
    const trace = join(root, "opened-paths.log");
    const shim = join(root, "permit-map-open-trace.so");
    const binary = resolve(process.cwd(), process.platform === "win32" ? "target/debug/permit-map.exe" : "target/debug/permit-map");
    execFileSync("cc", ["-shared", "-fPIC", "site-tests/open-trace.c", "-o", shim], { encoding: "utf8" });
    const result = spawnSync(binary, ["inspect", root, "--no-global", "--format", "json"], {
      encoding: "utf8",
      env: { ...process.env, LD_PRELOAD: shim, PERMIT_MAP_OPEN_LOG: trace },
    });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    const opened = readFileSync(trace, "utf8").split("\n").filter(Boolean);
    expect(report.counts.sources).toBe(1);
    expect(result.stdout).toContain("Read(src/**)");
    expect(opened).toContain(knownPolicy);
    for (const decoy of [environmentDecoy, unrelatedJson, sourceDecoy, credentialDecoy, undocumentedCodex]) {
      expect(opened, `${decoy} must never be opened by Permit Map`).not.toContain(decoy);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("CLI does not persist a secret-shaped decoy", { tag: "@claim:no-secret-storage" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-secret-"));
  const home = mkdtempSync(join(tmpdir(), "permit-map-secret-home-"));
  try {
    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), '{"permissions":{"allow":["Read(src/**)"]}}');
    const secret = "sbk_permit_map_secret_9d3b50e0";
    writeFileSync(join(root, ".env"), `PERMIT_MAP_TOKEN=${secret}\n`);
    const reportPath = join(root, "report.json");
    const binary = resolve(process.cwd(), process.platform === "win32" ? "target/debug/permit-map.exe" : "target/debug/permit-map");
    const result = spawnSync(binary, ["inspect", root, "--no-global", "--format", "json", "--output", reportPath], {
      encoding: "utf8",
      env: { ...process.env, HOME: home },
    });
    expect(result.status).toBe(0);
    expect(`${result.stdout}${result.stderr}`).not.toContain(secret);
    expect(readFileSync(reportPath, "utf8")).not.toContain(secret);
    expect(readdirSync(home)).toEqual([]);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(home, { recursive: true, force: true });
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

test("every public route avoids third parties and browser persistence", { tag: "@claim:site-no-third-parties" }, async ({ page, context }) => {
  const origins = new Set<string>();
  page.on("request", request => origins.add(new URL(request.url()).origin));
  for (const route of ["/", "/?demo=1", "/demo", "/privacy", "/terms", "/404/", "/missing-route"]) {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    const storage = await page.evaluate(async () => ({
      local: localStorage.length,
      session: sessionStorage.length,
      indexedDb: (await indexedDB.databases()).length,
      caches: (await caches.keys()).length,
    }));
    expect(storage, `${route} should not persist browser data`).toEqual({ local: 0, session: 0, indexedDb: 0, caches: 0 });
  }
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
  expect(await context.cookies()).toEqual([]);
  expect(context.serviceWorkers()).toEqual([]);
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
    const result = spawnSync(binary, ["demo", "--format", "markdown", "--output", "report.md"], { cwd: caller, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("Nothing outside this temporary directory was read or changed");
    expect(readFileSync(join(caller, "keep.txt"), "utf8")).toBe("unchanged");
    expect(spawnSync(binary, ["demo", "--output", join(caller, "escape.md")], { cwd: caller, encoding: "utf8" }).status).toBe(2);
    expect(readFileSync(join(caller, "keep.txt"), "utf8")).toBe("unchanged");
    expect(() => readFileSync(join(caller, "report.md"), "utf8")).toThrow();
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

test("Only Codex project policy is unresolved without trust and layered when trusted", { tag: "@claim:codex-context" }, () => {
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

    const home = mkdtempSync(join(tmpdir(), "permit-map-codex-home-"));
    try {
      mkdirSync(join(home, ".codex/rules"), { recursive: true });
      writeFileSync(join(home, ".codex/rules", "global.rules"), 'prefix_rule(pattern = ["git", "push"], decision = "prompt")\nprefix_rule(pattern = ["rm", "-rf"], decision = "forbidden")');
      const binary = resolve(process.cwd(), process.platform === "win32" ? "target/debug/permit-map.exe" : "target/debug/permit-map");
      const boundary = JSON.parse(execFileSync(binary, ["inspect", join(root, "services/api"), "--format", "json", "--codex-config", 'sandbox_mode="danger-full-access"'], {
        encoding: "utf8",
        env: { ...process.env, HOME: home },
      }));
      expect(boundary.counts).toMatchObject({ effective: 3, unresolved: 2 });
      expect(boundary.rules.find((rule: { target: string; layer: string }) => rule.target === "command:git push" && rule.layer === "global")).toMatchObject({ status: "effective", effect: "ask" });
      expect(boundary.rules.find((rule: { target: string; layer: string }) => rule.target === "command:rm -rf" && rule.layer === "global")).toMatchObject({ status: "effective", effect: "deny" });
      expect(boundary.rules.find((rule: { target: string; layer: string }) => rule.target === "sandbox:danger-full-access" && rule.layer === "override")).toMatchObject({ status: "effective" });
      expect(boundary.rules.filter((rule: { layer: string }) => rule.layer === "project")).toHaveLength(2);
      expect(boundary.rules.filter((rule: { layer: string }) => rule.layer === "project").every((rule: { status: string }) => rule.status === "unresolved")).toBeTruthy();
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Codex command rules parse documented forms and keep the most restrictive match", { tag: "@claim:codex-rules" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-codex-rules-"));
  try {
    mkdirSync(join(root, ".codex/rules"), { recursive: true });
    writeFileSync(join(root, ".codex/rules/default.rules"), `prefix_rule(
  pattern = ["git", ["push", "status"]],
  decision = "prompt",
)
prefix_rule(pattern = ["git", "push"], decision = "forbidden")
prefix_rule(pattern = ["git", "push"], decision = "allow")
prefix_rule(pattern = ["cargo", "test"])
`);
    const report = JSON.parse(execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--codex-trust", "trusted", "--format", "json"], { encoding: "utf8" }));
    expect(report.rules.find((rule: { target: string; status: string }) => rule.target === "command:git push" && rule.status === "effective")).toMatchObject({ effect: "deny" });
    expect(report.rules.find((rule: { target: string; status: string }) => rule.target === "command:git status" && rule.status === "effective")).toMatchObject({ effect: "ask" });
    expect(report.rules.find((rule: { target: string; status: string }) => rule.target === "command:cargo test" && rule.status === "effective")).toMatchObject({ effect: "allow" });
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
    const alias = join(root, "report.md");
    linkSync(policy, alias);
    expect(() => execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--output", alias])).toThrow();
    expect(readFileSync(policy, "utf8")).toBe(original);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("inspection does not change any discovered vendor settings", { tag: "@claim:vendor-settings-unchanged" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-settings-unchanged-"));
  try {
    mkdirSync(join(root, ".claude"));
    mkdirSync(join(root, ".codex/rules"), { recursive: true });
    const policies = [
      join(root, ".claude", "settings.json"),
      join(root, ".claude", "settings.local.json"),
      join(root, ".codex", "config.toml"),
      join(root, ".codex", "rules", "release.rules"),
    ];
    writeFileSync(policies[0], '{"permissions":{"allow":["Read(src/**)"]}}');
    writeFileSync(policies[1], '{"permissions":{"deny":["Read(.env*)"]}}');
    writeFileSync(policies[2], 'sandbox_mode = "workspace-write"');
    writeFileSync(policies[3], 'prefix_rule(pattern = ["git", "push"], decision = "forbidden", justification = "Use the reviewed release workflow instead")');
    const fingerprint = () => policies.map(path => createHash("sha256").update(readFileSync(path)).digest("hex"));
    const before = fingerprint();
    const result = spawnSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", "--codex-trust", "trusted", "--format", "json"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(fingerprint()).toEqual(before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("missing, unreadable, and malformed policies exit 2 with recovery steps", { tag: "@claim:cli-errors" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-errors-"));
  try {
    const binary = resolve(process.cwd(), process.platform === "win32" ? "target/debug/permit-map.exe" : "target/debug/permit-map");
    const missing = spawnSync(binary, ["inspect", join(root, "missing"), "--no-global"], { encoding: "utf8" });
    expect(missing.status).toBe(2);
    expect(missing.stderr).toContain("does not exist");
    expect(missing.stderr).toContain("Choose a repository directory and try again");

    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), "not json");
    const malformedClaude = spawnSync(binary, ["inspect", root, "--no-global"], { encoding: "utf8" });
    expect(malformedClaude.status).toBe(2);
    expect(malformedClaude.stderr).toContain("Cannot parse");
    expect(malformedClaude.stderr).toContain("Fix the JSON syntax, then run Permit Map again");

    const codexRoot = mkdtempSync(join(tmpdir(), "permit-map-rules-errors-"));
    try {
      mkdirSync(join(codexRoot, ".codex/rules"), { recursive: true });
      writeFileSync(join(codexRoot, ".codex/rules/default.rules"), 'prefix_rule(pattern = ["git"], decision = "forbidden"');
      const malformedRules = spawnSync(binary, ["inspect", codexRoot, "--no-global"], { encoding: "utf8" });
      expect(malformedRules.status).toBe(2);
      expect(malformedRules.stderr).toContain("Cannot parse");
      expect(malformedRules.stderr).toContain("Fix the rules syntax, then run Permit Map again");
    } finally {
      rmSync(codexRoot, { recursive: true, force: true });
    }

    const codexConfigRoot = mkdtempSync(join(tmpdir(), "permit-map-toml-errors-"));
    try {
      mkdirSync(join(codexConfigRoot, ".codex"));
      writeFileSync(join(codexConfigRoot, ".codex/config.toml"), 'sandbox_mode = "workspace-write');
      const malformedToml = spawnSync(binary, ["inspect", codexConfigRoot, "--no-global"], { encoding: "utf8" });
      expect(malformedToml.status).toBe(2);
      expect(malformedToml.stderr).toContain("Cannot parse");
      expect(malformedToml.stderr).toContain("Fix the TOML syntax, then run Permit Map again");
    } finally {
      rmSync(codexConfigRoot, { recursive: true, force: true });
    }

    if (process.platform !== "win32") {
      const unreadableRoot = mkdtempSync(join(tmpdir(), "permit-map-unreadable-"));
      const policyDirectory = join(unreadableRoot, ".claude");
      const policy = join(policyDirectory, "settings.json");
      const isolatedBinary = join(unreadableRoot, "permit-map");
      try {
        mkdirSync(policyDirectory);
        writeFileSync(policy, '{"permissions":{"allow":["Read(src/**)"]}}');
        copyFileSync(binary, isolatedBinary);
        chmodSync(unreadableRoot, 0o755);
        chmodSync(policyDirectory, 0o755);
        chmodSync(policy, 0o000);
        chmodSync(isolatedBinary, 0o755);
        const privilege = process.getuid?.() === 0 ? { uid: 65534, gid: 65534 } : {};
        const unreadable = spawnSync(isolatedBinary, ["inspect", unreadableRoot, "--no-global"], {
          encoding: "utf8",
          ...privilege,
        });
        expect(unreadable.status).toBe(2);
        expect(unreadable.stderr).toContain("Cannot read");
        expect(unreadable.stderr).toMatch(/Permission denied|Access is denied/);
        expect(unreadable.stderr).toContain("Check that your account can read the file, then try again");
      } finally {
        chmodSync(policy, 0o600);
        rmSync(unreadableRoot, { recursive: true, force: true });
      }
    }
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

test("every report format states unsupported overlap and CLI-context limits", { tag: "@claim:report-limitations" }, () => {
  const root = mkdtempSync(join(tmpdir(), "permit-map-limitations-"));
  try {
    mkdirSync(join(root, ".claude"));
    writeFileSync(join(root, ".claude", "settings.json"), '{"permissions":{"deny":["Bash(git:*)","Bash(git push:*)"]}}');
    const overlap = "Pattern overlap is vendor-specific; Permit Map lists it but does not infer overlap.";
    const context = "CLI flags that Permit Map cannot observe remain a report limitation. Supply supported values with --codex-config.";
    const run = (...args: string[]) => execFileSync("cargo", ["run", "--quiet", "--", "inspect", root, "--no-global", ...args], { encoding: "utf8" });
    const table = run("--format", "table");
    const markdown = run("--format", "markdown");
    const json = JSON.parse(run("--format", "json"));
    for (const report of [table, markdown]) {
      expect(report).toContain(overlap);
      expect(report).toContain(context);
    }
    expect(json.notes).toContain(overlap);
    expect(json.notes).toContain(context);

    const empty = mkdtempSync(join(tmpdir(), "permit-map-empty-limitations-"));
    try {
      const emptyRun = (...args: string[]) => execFileSync("cargo", ["run", "--quiet", "--", "inspect", empty, "--no-global", ...args], { encoding: "utf8" });
      expect(emptyRun("--format", "table")).toContain(context);
      expect(emptyRun("--format", "markdown")).toContain(context);
      expect(JSON.parse(emptyRun("--format", "json")).notes).toContain(context);
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
