import { test, expect } from "@playwright/test";

test("has correct element", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/hello/i)).toBeVisible();
});
