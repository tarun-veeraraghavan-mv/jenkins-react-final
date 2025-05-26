import { test, expect } from "@playwright/test";

test("has correct element", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page.getByText(/hello/i)).toBeVisible();
});
