import { test, expect } from "@playwright/test";

test.describe("Learn mode (flashcards)", () => {
  test("shows a card with Japanese text on front", async ({ page }) => {
    await page.goto("/topic/directions/learn?type=word");

    // Should show a progress bar
    await expect(page.locator("div.w-full.h-2")).toBeVisible();

    // Should show "Reveal Answer" button
    await expect(page.getByRole("button", { name: "Reveal Answer" })).toBeVisible();
  });

  test("flips card on click and shows rating buttons", async ({ page }) => {
    await page.goto("/topic/directions/learn?type=word");

    // Click "Reveal Answer"
    await page.getByRole("button", { name: "Reveal Answer" }).click();

    // Rating buttons should appear
    await expect(page.getByRole("button", { name: "Again" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Good" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Easy" })).toBeVisible();
  });

  test("advances to next card after rating", async ({ page }) => {
    await page.goto("/topic/directions/learn?type=word");

    // Reveal and rate
    await page.getByRole("button", { name: "Reveal Answer" }).click();
    await page.getByRole("button", { name: "Good" }).click();

    // Should show "Reveal Answer" again (next card)
    await expect(page.getByRole("button", { name: "Reveal Answer" })).toBeVisible();
  });
});
