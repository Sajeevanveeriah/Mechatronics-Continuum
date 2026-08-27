import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("navigation, simulator, theme and accessibility", async ({ page }) => {
  await page.goto("#/Simulator%20lab");
  await expect(
    page.getByRole("heading", { name: "DC circuit simulator" }),
  ).toBeVisible();
  await page
    .getByLabel(/Voltage V/)
    .last()
    .fill("12");
  await page
    .getByLabel(/Resistance R/)
    .last()
    .fill("240");
  await expect(page.getByText(/0.050 A/)).toBeVisible();
  await page.getByRole("button", { name: "Reset simulator" }).click();
  await expect(page.getByText(/0.200 A/)).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.goto("#/Settings");
  await page.getByLabel("dark").check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("mobile navigation opens and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto("");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation")).toHaveClass(/open/);
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.getByRole("navigation")).not.toHaveClass(/open/);
});
