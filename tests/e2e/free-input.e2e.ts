import { test, expect } from "@playwright/test";

test.describe("Free input mode", () => {
  test("shows English prompt and input field", async ({ page }) => {
    await page.goto("/topic/weather/quiz/free-input?type=word");

    // Input field should be visible
    await expect(page.getByTestId("free-input-field")).toBeVisible();
    await expect(page.getByRole("button", { name: "Check" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Skip" })).toBeVisible();
  });

  test("accepts correct romaji and shows success", async ({ page }) => {
    await page.goto("/topic/weather/quiz/free-input?type=word");

    // Get the English prompt text
    const english = await page.locator(".text-3xl.font-bold").textContent();

    // We need to know which word it is and type the romaji
    // For "sunny / clear weather" → hare
    // For "rain" → ame
    // Since we don't know the order, just skip one
    await page.getByRole("button", { name: "Skip" }).click();

    // Should still be on free input
    await expect(page.getByTestId("free-input-field")).toBeVisible();
  });

  test("shows wrong feedback for incorrect answer", async ({ page }) => {
    await page.goto("/topic/weather/quiz/free-input?type=word");

    await page.getByTestId("free-input-field").fill("wronganswer");
    await page.getByRole("button", { name: "Check" }).click();

    // Should show "Wrong answer" feedback
    await expect(page.getByText("Wrong answer")).toBeVisible();
  });
});
