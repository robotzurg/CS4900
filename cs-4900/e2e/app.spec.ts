import { test, expect } from "@playwright/test";

test.describe("Waveform App (E2E)", () => {
  const BASE = "http://localhost:5173";

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test("has main navigation links", async ({ page }) => {
    for (const linkText of ["Songs", "Albums", "Artists", "Genres"]) {
      await expect(page.getByRole("link", { name: linkText })).toBeVisible();
    }
  });

  test("can navigate to All Songs page", async ({ page }) => {
    await page.getByRole("link", { name: "Songs" }).click();
    await expect(page).toHaveURL(/\/songs$/);
    await expect(page.getByRole("heading", { name: /All Songs/i })).toBeVisible();
  });

  test("can navigate to All Albums page", async ({ page }) => {
    await page.getByRole("link", { name: "Albums" }).click();
    await expect(page).toHaveURL(/\/albums$/);
    await expect(page.getByRole("heading", { name: /All Albums/i })).toBeVisible();
  });

  test("can navigate to All Artists page", async ({ page }) => {
    await page.getByRole("link", { name: "Artists" }).click();
    await expect(page).toHaveURL(/\/artists$/);
    await expect(page.getByRole("heading", { name: /All Artists/i })).toBeVisible();
  });

  test("can navigate to All Users page", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByRole("heading", { name: /All Users/i })).toBeVisible();
  });

  test("can navigate to All Genres page", async ({ page }) => {
    await page.getByRole("link", { name: "Genres" }).click();
    await expect(page).toHaveURL(/\/genres$/);
    await expect(page.getByRole("heading", { name: /All Genres/i })).toBeVisible();
  });
});
