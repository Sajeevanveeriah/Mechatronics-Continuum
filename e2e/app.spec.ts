import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("lesson progression, simulator, theme and accessibility", async ({
  page,
}) => {
  await page.goto("#/lesson/ohms-law");
  await expect(
    page.getByRole("heading", { name: "Ohm’s law and circuit reasoning" }),
  ).toBeVisible();
  await page.getByLabel(/Voltage V/).fill("12");
  await page.getByLabel(/Resistance R/).fill("240");
  await expect(page.getByText("0.050 A", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset simulator" }).click();
  await expect(page.getByText("0.050 A", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Complete & continue/ }).click();
  await expect(
    page.getByRole("heading", { name: "Series circuits" }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.goto("#/settings");
  await page.getByLabel("dark").check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("mobile navigation opens and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto("");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.locator(".sidebar")).toHaveClass(/open/);
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
});
