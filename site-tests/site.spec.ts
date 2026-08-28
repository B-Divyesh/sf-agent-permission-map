import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { existsSync, readFileSync } from "node:fs";

const routes = ["/", "/demo", "/privacy", "/terms", "/missing-route"];

function parseRgb(value: string): [number, number, number] {
  const match = value.match(/\d+(?:\.\d+)?/g);
  if (!match || match.length < 3) throw new Error(`Expected an RGB color, got ${value}`);
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function contrastRatio(first: string, second: string): number {
  const luminance = (color: [number, number, number]) => color.reduce((sum, component, index) => {
    const channel = component / 255;
    const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
  const [one, two] = [luminance(parseRgb(first)), luminance(parseRgb(second))].sort((a, b) => b - a);
  return (one + 0.05) / (two + 0.05);
}

for (const route of routes) {
  test(`${route} has a semantic page and no serious accessibility findings`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Permit Map/);
    // axe-core/playwright 4.10 ships Playwright 1.57 types; the runtime API is
    // compatible with the pinned 1.58 runner.
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const findings = results.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""));
    expect(findings).toEqual([]);
  });
}

test("navigation uses real URLs and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /Try it with sample data/ })).toBeFocused();
});

test("keyboard can enter the demo and reset it", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.getByRole("link", { name: /Try it with sample data/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await page.getByRole("button", { name: "Reset demo" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByText(/Sample reset/)).toBeVisible();
});

test("the in-memory demo resets after the browser goes offline", async ({ page, context }) => {
  await page.goto("/?demo=1");
  await context.setOffline(true);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText(/Sample reset/)).toBeVisible();
  await expect(page.locator("#full-rule-table tbody tr")).toHaveCount(10);
});

test("Reset demo keeps every visible phone table text treatment at 4.5:1 during feedback", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.waitForTimeout(120);
  await expect(page.locator(".first-screen-table")).toHaveClass(/reset-pulse/);
  const axe = await new AxeBuilder({ page: page as never }).analyze();
  expect(axe.violations.filter(item => item.id === "color-contrast")).toEqual([]);

  const treatments = await page.locator(".first-screen-table").evaluate(table => {
    const style = (selector: string) => getComputedStyle(table.querySelector<HTMLElement>(selector)!);
    const tableStyle = getComputedStyle(table);
    const opacity = [] as string[];
    for (let node: Element | null = table; node; node = node.parentElement) opacity.push(getComputedStyle(node).opacity);
    return {
      opacity,
      treatments: [
        { name: "caption", foreground: style("caption").color, background: style("caption").backgroundColor },
        { name: "headers", foreground: style("th").color, background: style("th").backgroundColor },
        { name: "body cells", foreground: style("td").color, background: tableStyle.backgroundColor },
        ...[...table.querySelectorAll<HTMLElement>(".decision")].map(node => ({
          name: `${node.textContent?.trim()} badge`, foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor,
        })),
      ],
    };
  });

  expect(treatments.opacity).toEqual(expect.arrayContaining(["1"]));
  expect(treatments.opacity.every(value => value === "1"), "Reset feedback must not fade table text").toBeTruthy();
  for (const treatment of treatments.treatments) {
    expect(contrastRatio(treatment.foreground, treatment.background), treatment.name).toBeGreaterThanOrEqual(4.5);
  }
});

test("keyboard install action moves focus to the install destination", async ({ page }) => {
  await page.goto("/demo");
  const start = page.getByRole("link", { name: "View install command" });
  await start.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#install$/);
  await expect(page.getByRole("heading", { name: "Install the single binary" })).toBeFocused();
});

test("View install command exposes a complete source install command", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { name: "View install command" }).click();
  await expect(page.locator("#install code")).toContainText("git clone https://github.com/B-Divyesh/sf-agent-permission-map.git");
  await expect(page.locator("#install code")).toContainText("cargo install --path .");
  await expect(page.getByRole("link", { name: /source repository/ })).toHaveAttribute("href", "https://github.com/B-Divyesh/sf-agent-permission-map");
});

test("terms uses a present-tense change instruction", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByText("Check this page and the project changelog for changes.")).toBeVisible();
  await expect(page.getByText(/Material changes will appear/)).toHaveCount(0);
});

test("all local page links return content", async ({ page, request }) => {
  await page.goto("/");
  const paths = await page.locator("a[href]").evaluateAll(links => [...new Set(links.map(link => new URL((link as HTMLAnchorElement).href).pathname).filter(path => path !== "/"))]);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should load`).toBeTruthy();
  }
});

test("390px layout stays inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/demo", "/privacy"]) {
    await page.goto(route);
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasOverflow, `${route} should not overflow`).toBeFalsy();
  }
});

test("install link and focus rings retain required contrast on every surface", async ({ page }) => {
  await page.goto("/");
  const installColors = await page.locator(".install-grid p a").evaluate(node => ({
    foreground: getComputedStyle(node).color,
    background: getComputedStyle(node.closest(".install-band")!).backgroundColor,
  }));
  expect(contrastRatio(installColors.foreground, installColors.background)).toBeGreaterThanOrEqual(4.5);

  for (const [target, surface] of [
    [".site-header nav a", ".site-header"],
    [".preview-section .text-link", ".preview-section"],
    [".install-grid p a", ".install-band"],
    ["footer a", "footer"],
  ]) {
    const colors = await page.locator(target).first().evaluate((node, surfaceSelector) => {
      (node as HTMLElement).focus();
      return {
        outline: getComputedStyle(node).outlineColor,
        background: getComputedStyle(document.querySelector(surfaceSelector!)!).backgroundColor,
      };
    }, surface);
    expect(contrastRatio(colors.outline, colors.background), `${target} focus ring`).toBeGreaterThanOrEqual(3);
  }
});

test("200% text enlargement reflows every route without clipping", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    const dimensions = await page.evaluate(() => {
      window.scrollTo(1000, 0);
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollX: window.scrollX,
      };
    });
    expect(dimensions.scrollWidth, `${route} should reflow at 200% text`).toBeLessThanOrEqual(dimensions.clientWidth);
    expect(dimensions.scrollX, `${route} should not need horizontal recovery`).toBe(0);
  }
});

test("first read fits the audience, sample action, and facts at 1366 by 768", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  for (const locator of [page.locator(".lede"), page.getByRole("link", { name: /Try it with sample data/ }), page.locator(".plain-facts")]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(768);
  }
});

test("query demo has its own title, metadata, canonical URL, and focused heading", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Permit Map");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", "Review ten resolved rules from the isolated Permit Map sample.");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Demo — Permit Map");
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "Demo — Permit Map");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://agent-permission-map.sociobot.in/?demo=1");
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("secondary routes include route-specific social metadata", async ({ page }) => {
  for (const route of ["/demo", "/privacy", "/terms", "/404/"]) {
    await page.goto(route);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.png$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /og-image\.png$/);
  }
});

test("production output has route documents and a 404 response override", () => {
  for (const path of ["dist/site/demo/index.html", "dist/site/privacy/index.html", "dist/site/terms/index.html", "dist/site/404/index.html"]) {
    expect(existsSync(path), `${path} should be emitted`).toBeTruthy();
  }
  const config = JSON.parse(readFileSync("dist/site/staticwebapp.config.json", "utf8"));
  expect(config.responseOverrides["404"]).toMatchObject({ rewrite: "/404/index.html", statusCode: 404 });
});

test("reviewed README sentences use the approved short wording", () => {
  const readme = readFileSync("README.md", "utf8");
  for (const sentence of [
    "Codex controls use system, user, profile, and trusted project files.",
    "Codex project rows stay `unresolved` until you set `--codex-trust`.",
    "`npm test` runs Rust and browser tests and checks every product claim.",
  ]) expect(readme).toContain(sentence);
  expect(readme).not.toContain("the closest control wins");
  expect(readme).not.toContain("Only Codex project rows stay");
  expect(readme).not.toContain("checks every product claim, tests keyboard paths");
});

test("every registered claim has exactly one matching tagged test", () => {
  const claims = JSON.parse(readFileSync(".factory/claims.json", "utf8")) as Array<{ id: string; test: string }>;
  const tests = readFileSync("site-tests/claims.spec.ts", "utf8");
  expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
  for (const { id, test: command } of claims) {
    expect(command).toBe(`npm test -- --grep @claim:${id}`);
    expect(tests.match(new RegExp(`@claim:${id}(?![a-z0-9-])`, "g")) ?? [], id).toHaveLength(1);
  }
});
