// Run with Playwright installed: node tests/ui-smoke.cjs
// Optional CHROMIUM_EXECUTABLE and PLAYWRIGHT_MODULE support sandbox browsers.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--no-zygote",
            "--use-gl=angle",
            "--use-angle=swiftshader",
          ],
        }
      : {}),
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1050 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const state = () => page.evaluate(() => JSON.stringify(gameState));
  const visit = async (tab) => page.evaluate((tab) => switchTab(tab), tab);
  await page.goto(process.env.GAME_URL || "http://127.0.0.1:3000");
  await page.locator(".find-card").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const initial = await state();
  await page.locator(".find-open").first().click();
  await page.locator("#item-inspector").waitFor({ state: "visible" });
  assert.equal(
    await state(),
    initial,
    "Preview must be free and leave gameplay untouched",
  );
  await page.locator("#item-inspector [data-favorite]").click();
  assert.equal(await state(), initial, "Favorites must not change gameplay");
  await page.locator("#item-inspector [data-close]").click();
  await page.locator("#favorites-filter").click();
  assert.equal(await page.locator(".find-card").count(), 1);
  await page.locator("#favorites-filter").click();
  await page.locator("#market-search").fill("НЕСУЩЕСТВУЮЩИЙ ПРЕДМЕТ");
  assert.equal(await page.locator(".find-card").count(), 0);
  await page.locator("[data-reset]").click();
  const originalCount = await page.locator(".find-card").count();
  await page.locator('[data-view="list"]').click();
  assert.equal(await page.locator(".find-card").count(), originalCount);
  await page.locator('[data-view="grid"]').click();
  assert.equal(
    await state(),
    initial,
    "Filtering and view controls must not change state",
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({
    path: process.env.SHOT_DIR
      ? process.env.SHOT_DIR + "/market-desktop.png"
      : "/tmp/market-desktop.png",
    fullPage: true,
  });
  await page.locator("#nextDayBtn").click();
  await page.locator("#day-confirmation [data-stay]").click();
  assert.equal(
    await state(),
    initial,
    "Cancelling next day must not change state",
  );
  await page.locator("#market-sort").selectOption("low");
  await page.locator(".find-open").first().click();
  const previousAttention = await page.evaluate(() => gameState.attention);
  await page.locator("#item-inspector [data-start]").click();
  assert.equal(
    await page.evaluate(() => gameState.attention),
    previousAttention - 5,
    "Entering trade uses existing attention cost",
  );
  await page.locator('#haggleModal [onclick="acceptCurrentPrice()"]').click();
  await page.waitForTimeout(3300);
  assert.equal(
    await page.evaluate(() => gameState.inventory.length),
    1,
    "Purchase uses original handler",
  );
  await visit("inventory");
  assert.equal(await page.locator("#inventoryItems>.card:visible").count(), 1);
  await page.locator('[data-stage="ready"]').click();
  assert.equal(await page.locator("#inventoryItems>.card:visible").count(), 0);
  await page.locator('[data-stage="research"]').click();
  assert.equal(await page.locator("#inventoryItems>.card:visible").count(), 1);
  await page.locator('#inventoryItems [onclick^="startExpertise"]').click();
  assert.equal(await page.locator("#expertiseModal").isVisible(), true);
  await page.screenshot({
    path: process.env.SHOT_DIR
      ? process.env.SHOT_DIR + "/appraisal-desktop.png"
      : "/tmp/appraisal-desktop.png",
  });
  await page.evaluate(() => closeExpertise());
  for (const tab of ["selling", "knowledge", "stats", "help", "market"]) {
    await visit(tab);
    assert.equal(await page.locator("#content-" + tab).isVisible(), true);
  }
  const oldDay = await page.evaluate(() => gameState.day);
  await page.locator("#nextDayBtn").click();
  await page.locator("#day-confirmation [data-confirm]").click();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => gameState.day), oldDay + 1);
  await page.reload();
  await page.waitForTimeout(200);
  await visit("market");
  assert.equal(
    await page.evaluate(() => gameState.inventory.length),
    1,
    "Save remains compatible",
  );
  await page.locator("#marketViewToggle").click();
  assert.equal(await page.locator("#walking-market").isVisible(), true);
  await page.locator("#marketViewToggle").click();
  assert.equal(await page.locator("#traditional-market").isVisible(), true);
  for (const width of [360, 390, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const size = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      innerWidth,
    ]);
    assert.ok(size[0] <= size[1], `No page overflow at ${width}: ${size}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-dock [data-nav="inventory"]').click();
  assert.equal(await page.locator("#content-inventory").isVisible(), true);
  await page.locator('.mobile-dock [data-nav="market"]').click();
  await page.screenshot({
    path: process.env.SHOT_DIR
      ? process.env.SHOT_DIR + "/market-mobile.png"
      : "/tmp/market-mobile.png",
    fullPage: true,
  });
  await page.locator(".find-open").first().click();
  await page.waitForTimeout(250);
  await page.screenshot({
    path: process.env.SHOT_DIR
      ? process.env.SHOT_DIR + "/preview-mobile.png"
      : "/tmp/preview-mobile.png",
  });
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#item-inspector").isVisible(), false);
  // Continue the original gameplay path on a mobile viewport.
  await visit("inventory");
  await page.locator('[data-stage="all"]').click();
  await page.locator('#inventoryItems [onclick^="startExpertise"]').click();
  const beforeMethod = await page.evaluate(() => gameState.attention);
  await page
    .locator("#expertiseMethods button:not([disabled])")
    .first()
    .click();
  assert.ok(
    (await page.evaluate(() => gameState.attention)) < beforeMethod,
    "Original method spends attention",
  );
  await page.locator("#authenticityGuess").selectOption("true");
  await page.locator("#valueGuess").fill("1200");
  await page.locator("#ageGuess").fill("50");
  await page.locator('[onclick="submitExpertise()"]').click();
  assert.equal(
    await page.evaluate(() => gameState.inventory[0].expertiseDone),
    true,
  );
  await page.locator('#inventoryItems [onclick^="startSell"]').click();
  await page.locator("#avitoPrice").fill("1500");
  await page.locator('[onclick="selectAvitoSale()"]').click();
  await visit("selling");
  assert.equal(await page.locator(".sale-lot").count(), 1);
  assert.equal(
    await page.evaluate(() => gameState.sellingItems[0].playerPrice),
    1500,
  );
  await page.screenshot({
    path: process.env.SHOT_DIR
      ? process.env.SHOT_DIR + "/selling-mobile.png"
      : "/tmp/selling-mobile.png",
    fullPage: true,
  });
  await visit("stats");
  assert.equal(await page.locator("#stat-bought").textContent(), "1");
  assert.deepEqual(errors, [], "No browser JS errors");

  console.log(
    "PASS: free preview, favorites, filters, list/grid, day confirmation, purchase, inventory stages, appraisal, tabs, save/reload, walking, mobile navigation, responsive widths, Escape, research method, appraisal submission, Avito listing and stats; no JS errors.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
