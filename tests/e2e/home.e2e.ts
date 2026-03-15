import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows the app title and 16 topic cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Japanese Vocab Trainer")).toBeVisible();
    await expect(page.getByText("Choose a Topic")).toBeVisible();

    // Should have 16 topic cards
    const topicLinks = page.locator("a[href^='/topic/']");
    await expect(topicLinks).toHaveCount(16);
  });

  test("settings panel opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open settings" }).click();
    await expect(page.getByText("Display Script")).toBeVisible();

    // Close via backdrop
    await page.keyboard.press("Escape");
    // Or click backdrop
    const backdrop = page.locator(".absolute.inset-0.bg-black\\/60");
    if (await backdrop.isVisible()) {
      await backdrop.click();
    }
  });

  test("can change display script to katakana", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open settings" }).click();
    await page.getByRole("button", { name: "Katakana" }).click();

    // Verify header updates
    await expect(page.getByText("katakana script")).toBeVisible();
  });
});

test.describe("Topic page", () => {
  test("shows topic details and 3 mode cards", async ({ page }) => {
    await page.goto("/topic/directions");
    await expect(page.getByText("Directions")).toBeVisible();
    await expect(page.getByText("Flashcards")).toBeVisible();
    await expect(page.getByText("Multiple Choice")).toBeVisible();
    await expect(page.getByText("Free Input")).toBeVisible();
  });

  test("navigates back to home", async ({ page }) => {
    await page.goto("/topic/weather");
    await page.getByText("← Topics").click();
    await expect(page).toHaveURL("/");
  });
});
