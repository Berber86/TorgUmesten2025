// Atmosphere remains presentation, not a source of new item knowledge or game rules.
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
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.GAME_URL || "http://127.0.0.1:3000");
  await page.waitForFunction(
    () => document.documentElement.dataset.atelierReady === "true",
  );
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => JSON.stringify(gameState));
  assert(
    (await page.locator(".studio-scene>img").getAttribute("src")).includes(
      "rented-room.webp",
    ),
  );
  assert(
    (await page.locator(".scene-caption").textContent()).includes(
      "не уровень жилья",
    ),
  );
  for (const [baseName, category, file] of [
    ["Чашка", "porcelain", "street-cup"],
    ["Книга", "books", "street-books"],
    ["Картина", "painting", "street-painting"],
  ]) {
    const markup = await page.evaluate(
      ({ baseName, category }) =>
        TorgUI.artwork({
          baseName,
          category,
          authentic: true,
          realValue: 3456789,
        }),
      { baseName, category },
    );
    assert(markup.includes(file + ".webp"));
    assert(!markup.includes("3456789"));
    const response = await page.request.get(
      new URL("/assets/" + file + ".webp", page.url()).href,
    );
    assert(response.ok());
  }
  await page.evaluate(() => switchTab("market"));
  // Preview / framing must not spend attention or reveal hidden valuation.
  await page.locator(".find-open").first().click();
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => JSON.stringify(gameState)), before);
  await page.evaluate(() => {
    const fixtures = [
      ["Книга", "books"],
      ["Чашка", "porcelain"],
      ["Картина", "painting"],
    ];
    gameState.marketItems = fixtures.map(([baseName, category], i) => ({
      ...gameState.marketItems[0],
      id: "visual_" + i,
      baseName,
      category,
      askingPrice: 850 + i * 700,
      modifiers: [],
      modifiersDisplay: [],
    }));
    renderMarket();
  });
  await page.evaluate(() =>
    document.querySelector("#marketItems").scrollIntoView({ block: "start" }),
  );
  await page.waitForTimeout(200);
  await page.screenshot({
    path: (process.env.SHOT_DIR || "/tmp") + "/atmosphere-stalls-desktop.png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  await page.locator(".find-open").first().click();
  await page.locator("#item-inspector [data-start]").click();
  await page.waitForTimeout(300);
  assert(await page.locator("#haggleModal").isVisible());
  assert(await page.locator(".seller-visual").isVisible());
  assert(
    await page
      .locator("#haggleModal>.negotiation-shell")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  );
  await page.screenshot({
    path: (process.env.SHOT_DIR || "/tmp") + "/atmosphere-trade-mobile.png",
  });
  await page.locator('[onclick="closeHaggle()"]').click();
  await page.evaluate(() => switchTab("atelier"));
  await page.locator(".hotspot-notes").click();
  await page.locator("#note-text").fill("Запомнить цену, а не обещания.");
  await page.locator("#note-form .ux-primary").click();
  assert.match(await page.locator("#note-status").textContent(), /сохранена/);
  await page.keyboard.press("Escape");
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS: compressed room and street artwork, illustration disclaimer, no hidden values, free preview state, mobile trading geometry, original seller portrait and notebook controls.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
