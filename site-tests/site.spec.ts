import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/demo", "/privacy", "/terms", "/missing-route"];

for (const route of routes) {
  test(`${route} has a semantic page and no serious accessibility findings`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Permit Map/);
    const results = await new AxeBuilder({ page }).analyze();
    const findings = results.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""));
    expect(findings).toEqual([]);
  });
}

test("navigation uses real URLs and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("h1")).toBeFocused();
});

test("keyboard can enter the demo and reset it", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.getByRole("link", { name: /Try it with sample data/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo$/);
  await page.getByRole("button", { name: "Reset demo" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByText(/Sample reset/)).toBeVisible();
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
