import { test, expect } from "@playwright/test";

/**
 * Smoke test: load the real home page and verify the Leaflet map renders.
 * StrictMode is enabled by the app — this confirms double-mount in dev/jsdom-style
 * scenarios doesn't blank the page or kill the map.
 */
test.describe("Home page — map smoke test", () => {
  test("map area is visible and the page never blanks", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    // Page chrome must be present
    await expect(page.locator("nav")).toBeVisible();

    // The live map status badge must mount
    await expect(page.getByTestId("map-status-badge")).toBeVisible({ timeout: 15_000 });

    // Either the real Leaflet map OR the placeholder/fallback — but never a blank body.
    // The Leaflet container has class `.leaflet-container`. If anything caused a
    // full-page blank (white screen), neither would exist.
    await expect.poll(
      async () => {
        const leaflet = await page.locator(".leaflet-container").count();
        const placeholder = await page.getByTestId("map-placeholder").count();
        const fallback = await page.getByTestId("map-fallback").count();
        return leaflet + placeholder + fallback;
      },
      { timeout: 20_000, message: "map area never appeared — page may be blank" }
    ).toBeGreaterThan(0);

    // Expect the real leaflet map eventually
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 20_000 });

    // No render2 / Context.Consumer crashes
    const blankErr = consoleErrors.find((e) => /render2 is not a function/i.test(e));
    expect(blankErr, `Got blank-screen console error: ${blankErr}`).toBeUndefined();

    // Body has visible text — UI didn't blank
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test("map status badge reports OK once tiles are mounted", async ({ page }) => {
    await page.goto("/");
    const badge = page.getByTestId("map-status-badge");
    await expect(badge).toBeVisible({ timeout: 15_000 });
    await expect.poll(async () => await badge.getAttribute("data-status"), {
      timeout: 20_000,
    }).toBe("ok");
  });
});
