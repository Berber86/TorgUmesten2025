// Same browser options as ui-smoke.cjs. All UI actions must preserve gameState.
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
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const snap = () => page.evaluate(() => JSON.stringify(gameState));
  const shot = async (name) => {
    await page.waitForTimeout(300);
    await page.screenshot({
      path: (process.env.SHOT_DIR || "/tmp") + "/" + name + ".png",
      fullPage: !(await page
        .locator("dialog[open],.modal-backdrop:not(.hidden)")
        .count()),
    });
  };
  await page.goto(process.env.GAME_URL || "http://127.0.0.1:3000");
  await page.waitForFunction(
    () => document.documentElement.dataset.atelierReady === "true",
  );
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("#content-atelier").isVisible(), true);
  const initial = await snap();
  await page.evaluate(() => scrollTo(0, 0));
  await shot("atelier-desktop");
  await page.locator("#rename-shop").click();
  await page.locator("#shop-name-input").fill("Тихая лавка");
  await page
    .locator('#shop-settings button[type="submit"],#shop-settings .ux-primary')
    .click();
  assert.equal(await page.locator("#shop-name").textContent(), "Тихая лавка");
  await page.locator("#tab-market").click();
  await page.locator("[data-compare]").nth(0).click();
  await page.locator("[data-compare]").nth(1).click();
  await page.locator("[data-compare]").nth(2).click();
  await page.locator("[data-compare]").nth(3).click();
  assert.equal(
    await page.locator('[data-compare][aria-pressed="true"]').count(),
    3,
  );
  await page.locator("#open-comparison").click();
  assert.equal(await page.locator(".comparison-item").count(), 3);
  await shot("comparison-desktop");
  await page.locator("[data-remove]").first().click();
  assert.equal(await page.locator(".comparison-item").count(), 2);
  await page.keyboard.press("Escape");
  await page.locator("#clear-comparison").click();
  assert.equal(
    await page.locator('[data-compare][aria-pressed="true"]').count(),
    0,
  );
  for (let i = 0; i < 3; i++)
    await page.locator("[data-compare]").nth(i).click();
  await page.locator("[data-note]").first().click();
  await page
    .locator("#note-text")
    .fill("Сравнить цены. Проверить клеймо. <script>notCode()</script>");
  await page.locator("#note-form .ux-primary").click();
  assert.match(await page.locator("#note-status").textContent(), /сохранена/);
  await page.locator("#note-text").fill("Черновик, который нельзя потерять");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#collector-notebook").isVisible(), true);
  await page.locator("#discard-note").click();
  assert.equal(await page.locator("#collector-notebook").isVisible(), false);
  await page.locator(".sidebar-notebook").click();
  await page.locator("[data-edit-note]").first().click();
  assert.equal(
    await page.locator("#note-text").inputValue(),
    "Сравнить цены. Проверить клеймо. <script>notCode()</script>",
  );
  await shot("notebook-desktop");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-notes").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "torg-diary.txt");
  await page.locator("[data-note-close]").click();
  await page.keyboard.press("Control+k");
  await page.locator("#palette-query").fill("статистика");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#content-stats").isVisible(), true);
  await page.keyboard.press("Control+k");
  await page.locator("#palette-query").fill("qqqnotfound");
  assert.equal(await page.locator(".palette-empty").isVisible(), true);
  await page.keyboard.press("Escape");
  await page.evaluate(() => switchTab("market"));
  await page.locator(".find-open").first().click();
  await page.locator(".preview-note-button").click();
  assert.equal(await page.locator("#collector-notebook").isVisible(), true);
  await page.locator("[data-note-close]").click();
  await page.locator("#item-inspector [data-close]").click();
  assert.equal(
    await snap(),
    initial,
    "Studio, rename, comparison, notes, palette, preview must not change gameState",
  );
  await page.locator("#market-focus").click();
  assert.equal(await page.locator(".market-hero").isVisible(), false);
  await page.locator("#compact-walk").click();
  assert.equal(await page.locator("#walking-market").isVisible(), true);
  assert.equal(await page.locator("#walking-hud").isVisible(), false);
  await page.locator("#marketViewToggle").click();
  assert(
    await page
      .locator(".seller-portrait-video")
      .evaluateAll((videos) => videos.every((video) => video.paused)),
  );
  await page.locator("#market-focus").click();
  for (const width of [360, 390, 700, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => switchTab("atelier"));
    const size = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      innerWidth,
    ]);
    assert.ok(size[0] <= size[1], `Studio overflow ${width}: ${size}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await shot("atelier-mobile");
  await page.locator('.mobile-dock [data-nav="market"]').click();
  await page.locator("#open-comparison").click();
  await shot("comparison-mobile");
  await page.keyboard.press("Escape");
  await page.locator("[data-note]").first().click();
  await shot("notebook-mobile");
  await page.keyboard.press("Escape");
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.atelierReady === "true",
  );
  assert.equal(await page.locator("#shop-name").textContent(), "Тихая лавка");
  await page.locator("#content-atelier .hotspot-notes").click();
  assert.equal(await page.locator("[data-edit-note]").count(), 1);
  await page.keyboard.press("Escape");
  const loaded = JSON.parse(await snap()),
    first = JSON.parse(initial);
  // Existing loadGame migrates historical descriptors; compare economic state and lots instead.
  for (const key of [
    "money",
    "reputation",
    "day",
    "attention",
    "inventory",
    "stats",
  ])
    assert.deepEqual(loaded[key], first[key]);
  assert.deepEqual(
    loaded.marketItems.map((i) => [i.id, i.askingPrice, i.realValue]),
    first.marketItems.map((i) => [i.id, i.askingPrice, i.realValue]),
  );
  // Main trade renderer remains active, with live presentation metrics only.
  await page.evaluate(() => switchTab("market"));
  await page.locator(".find-open").first().click();
  await page.locator("#item-inspector [data-start]").click();
  await page.waitForTimeout(250);
  assert.equal(
    await page.locator("#negotiation-pulse .patience-meter").isVisible(),
    true,
  );
  await shot("negotiation-mobile");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: atelier, rename, compare limit/clear, notes/save/unsaved guard/export, command palette, nesting, persisted UI preferences, mobile layouts, negotiation indicators; no JS errors; state invariants verified.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
